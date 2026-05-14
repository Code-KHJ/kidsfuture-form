export const CAPACITY = 15;

export type Round = "1st" | "2nd";

export type ScheduleOption = {
  id: string;
  round: Round;
  label: string;
  dateISO: string;
  weekday: string;
  startTime: string;
  endTime: string;
  durationLabel: string;
};

export const SESSIONS: Record<
  Round,
  {
    title: string;
    subtitle: string;
    durationLabel: string;
    bullets: string[];
    tools: string[];
    options: [ScheduleOption, ScheduleOption];
    accentClass: string;
    chipClass: string;
  }
> = {
  "1st": {
    title: "생성형 AI 기반 업무 생산성 높이기",
    subtitle: "AI 자동화의 큰 그림을 잡고 바로 쓸 수 있는 도구를 익힙니다.",
    durationLabel: "3시간",
    bullets: [
      "AI와 업무자동화 개념 · 사례 소개",
      "(실습) AI로 제안서 PPT 만들기",
      "(실습) 구글폼 응답자에게 보낼 안내 메일 자동화",
    ],
    tools: ["Gemini", "Google Apps Script"],
    options: [
      {
        id: "5/26",
        round: "1st",
        label: "5월 26일 (화)",
        dateISO: "2026-05-26",
        weekday: "화요일",
        startTime: "14:00",
        endTime: "17:00",
        durationLabel: "3시간",
      },
      {
        id: "5/29",
        round: "1st",
        label: "5월 29일 (금)",
        dateISO: "2026-05-29",
        weekday: "금요일",
        startTime: "14:00",
        endTime: "17:00",
        durationLabel: "3시간",
      },
    ],
    accentClass: "from-brand-purple to-brand-lime",
    chipClass: "bg-brand-purple/10 text-brand-purple",
  },
  "2nd": {
    title: "AI와 Codex를 활용한 업무자동화 바이브코딩",
    subtitle: "코드는 처음이어도 괜찮아요. 함께 손으로 만들어봅니다.",
    durationLabel: "약 5시간",
    bullets: [
      "바이브코딩과 Codex 개념 · 사례 소개",
      "(실습) 영수증 취합 데크 · 데이터 크롤링 스크립트",
      "(실습) 사업 랜딩페이지 및 접수페이지 만들기",
    ],
    tools: ["Codex App", "Antigravity", "Google Sheets", "GitHub", "Vercel"],
    options: [
      {
        id: "6/4",
        round: "2nd",
        label: "6월 4일 (목)",
        dateISO: "2026-06-04",
        weekday: "목요일",
        startTime: "13:00",
        endTime: "18:00",
        durationLabel: "약 5시간",
      },
      {
        id: "6/8",
        round: "2nd",
        label: "6월 8일 (월)",
        dateISO: "2026-06-08",
        weekday: "월요일",
        startTime: "13:00",
        endTime: "18:00",
        durationLabel: "약 5시간",
      },
    ],
    accentClass: "from-brand-coral to-brand-purple",
    chipClass: "bg-brand-coral/10 text-brand-coral",
  },
};

export const ALL_OPTION_IDS = [
  ...SESSIONS["1st"].options.map((o) => o.id),
  ...SESSIONS["2nd"].options.map((o) => o.id),
] as const;

export type OptionId = (typeof ALL_OPTION_IDS)[number];

export type CapacityMap = Record<OptionId, number>;

export function findOption(id: string): ScheduleOption | undefined {
  for (const round of ["1st", "2nd"] as Round[]) {
    const found = SESSIONS[round].options.find((o) => o.id === id);
    if (found) return found;
  }
  return undefined;
}

export const AI_LEVELS: { value: number; label: string; emoji: string; desc: string }[] = [
  { value: 1, label: "처음이에요", emoji: "🌱", desc: "AI를 거의 써본 적이 없어요" },
  { value: 2, label: "가볍게 써봤어요", emoji: "🪄", desc: "ChatGPT 등에 가끔 질문해본 정도" },
  { value: 3, label: "업무에 자주 써요", emoji: "⚡", desc: "초안 작성 · 요약 등에 일상적으로 활용" },
  { value: 4, label: "도구 여러 개 다뤄봤어요", emoji: "🧰", desc: "이미지/문서/코드 등 다양하게 활용" },
  { value: 5, label: "자동화까지 만들어봤어요", emoji: "🚀", desc: "API · 워크플로우로 업무 자동화 경험" },
];
