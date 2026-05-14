import { google, type sheets_v4 } from "googleapis";
import { ALL_OPTION_IDS, CAPACITY, type CapacityMap } from "./sessions";

const SHEET_TAB = process.env.SHEET_TAB_NAME || "responses";
const HEADER_ROW = [
  "timestamp",
  "name",
  "team",
  "session1",
  "session2",
  "ai_level",
  "expectation",
  "extra",
];

function getServiceAccount(): { client_email: string; private_key: string } {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "Google service account credentials are not set. Define GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY."
    );
  }
  // Support either raw JSON key string (with \\n) or base64-encoded full JSON
  let privateKey: string;
  if (rawKey.trim().startsWith("{")) {
    privateKey = JSON.parse(rawKey).private_key as string;
  } else if (/^[A-Za-z0-9+/=\s]+$/.test(rawKey) && !rawKey.includes("BEGIN")) {
    const decoded = Buffer.from(rawKey, "base64").toString("utf8");
    if (decoded.trim().startsWith("{")) {
      privateKey = JSON.parse(decoded).private_key as string;
    } else {
      privateKey = decoded;
    }
  } else {
    privateKey = rawKey;
  }
  privateKey = privateKey.replace(/\\n/g, "\n");
  return { client_email: email, private_key: privateKey };
}

let cachedClient: sheets_v4.Sheets | null = null;

function getSheets(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;
  const { client_email, private_key } = getServiceAccount();
  const auth = new google.auth.JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_ID env is missing");
  return id;
}

/**
 * Ensure the target tab exists and the header row matches.
 * Runs at most once per cold start (idempotent on Google's side).
 */
let initialized = false;
async function ensureSheet() {
  if (initialized) return;
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();

  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const tab = meta.data.sheets?.find((s) => s.properties?.title === SHEET_TAB);
  if (!tab) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_TAB } } }],
      },
    });
  }

  // Write header if A1 is empty
  const head = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB}!A1:H1`,
  });
  if (!head.data.values || head.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER_ROW] },
    });
  }
  initialized = true;
}

export async function countByOption(): Promise<CapacityMap> {
  await ensureSheet();
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_TAB}!D2:E`,
  });
  const counts: Record<string, number> = {};
  for (const id of ALL_OPTION_IDS) counts[id] = 0;
  const rows = res.data.values || [];
  for (const row of rows) {
    const [s1, s2] = row;
    if (s1 && counts[s1] !== undefined) counts[s1]++;
    if (s2 && counts[s2] !== undefined) counts[s2]++;
  }
  return counts as CapacityMap;
}

export type AppendRow = {
  name: string;
  team: string;
  session1: string;
  session2: string;
  ai_level: number;
  expectation: string;
  extra?: string;
};

export async function appendRow(input: AppendRow): Promise<void> {
  await ensureSheet();
  const sheets = getSheets();
  const spreadsheetId = getSpreadsheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_TAB}!A:H`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          input.name,
          input.team,
          input.session1,
          input.session2,
          input.ai_level,
          input.expectation,
          input.extra || "",
        ],
      ],
    },
  });
}

export { CAPACITY };
