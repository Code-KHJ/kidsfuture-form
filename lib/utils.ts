export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function daysUntil(dateISO: string, now = new Date()): number {
  const target = new Date(`${dateISO}T00:00:00+09:00`);
  const today = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function ddayLabel(dateISO: string): string {
  const d = daysUntil(dateISO);
  if (d === 0) return "D-DAY";
  if (d > 0) return `D-${d}`;
  return `D+${Math.abs(d)}`;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * Build a minimal .ics calendar string (single VEVENT) for KST events.
 * No external library — runs in browser via Blob URL.
 */
export function buildIcs(args: {
  uid: string;
  title: string;
  description?: string;
  dateISO: string; // 2026-05-26
  startTime: string; // 14:00
  endTime: string; // 17:00
}): string {
  const [y, m, d] = args.dateISO.split("-").map(Number);
  const [sh, sm] = args.startTime.split(":").map(Number);
  const [eh, em] = args.endTime.split(":").map(Number);

  // KST = UTC+9 — encode as local time with TZID to be safe in most clients
  const local = (h: number, mi: number) =>
    `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(mi)}00`;

  const now = new Date();
  const stamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  return [
    "BEGIN:VCALENDAR",
    "PRODID:-//FYF//AI Workshop//KO",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Seoul",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "TZNAME:KST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${args.uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Seoul:${local(sh, sm)}`,
    `DTEND;TZID=Asia/Seoul:${local(eh, em)}`,
    `SUMMARY:${escapeIcs(args.title)}`,
    args.description ? `DESCRIPTION:${escapeIcs(args.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function escapeIcs(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
