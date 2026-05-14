"use client";

import { CalendarPlus, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { SESSIONS, findOption } from "@/lib/sessions";
import { buildIcs, ddayLabel } from "@/lib/utils";

type Props = {
  name: string;
  session1: string;
  session2: string;
};

export function CompleteHero({ name, session1, session2 }: Props) {
  const o1 = findOption(session1);
  const o2 = findOption(session2);

  return (
    <div className="relative isolate overflow-hidden">
      <Confetti />
      <div className="brand-soft-bg absolute inset-0 -z-10" />

      <div className="mx-auto max-w-3xl px-5 pt-12 sm:px-8 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-mute backdrop-blur-sm">
            <Sparkles className="size-3.5 text-brand-coral" />
            신청 완료
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-[1.18] tracking-tight text-brand-ink sm:text-5xl">
            <span className="brand-text-gradient">{name}</span> 님,
            <br />곧 만나요!
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-mute sm:text-lg">
            신청해 주셔서 감사합니다. 강의 당일 안내는 재단 내부에서 별도로 전달될 예정이에요.
            아래에서 선택하신 일정을 다시 확인하고, 캘린더에도 담아두세요.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {o1 && (
            <ScheduleCard
              ribbon="1회차"
              tone="purple"
              title={SESSIONS["1st"].title}
              option={o1}
            />
          )}
          {o2 && (
            <ScheduleCard
              ribbon="2회차"
              tone="coral"
              title={SESSIONS["2nd"].title}
              option={o2}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({
  ribbon,
  tone,
  title,
  option,
}: {
  ribbon: string;
  tone: "purple" | "coral";
  title: string;
  option: NonNullable<ReturnType<typeof findOption>>;
}) {
  const [dday, setDday] = useState<string>("");
  useEffect(() => {
    setDday(ddayLabel(option.dateISO));
  }, [option.dateISO]);

  const toneText =
    tone === "purple" ? "text-brand-purple" : "text-brand-coral";
  const toneBg = tone === "purple" ? "bg-brand-purple/10" : "bg-brand-coral/10";

  function downloadIcs() {
    const ics = buildIcs({
      uid: `fyf-ai-${option.id}-${Date.now()}@fyf.or.kr`,
      title: `[${ribbon}] ${title}`,
      description: `아이들과미래재단 임직원 AI교육 - ${ribbon}`,
      dateISO: option.dateISO,
      startTime: option.startTime,
      endTime: option.endTime,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fyf-ai-${ribbon}-${option.id.replace("/", "-")}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
      className="relative overflow-hidden rounded-3xl border border-brand-line bg-white p-6 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneBg} ${toneText}`}
        >
          {ribbon}
        </span>
        <span className={`text-xs font-bold tracking-wider ${toneText}`}>{dday}</span>
      </div>

      <div className="mt-4 text-2xl font-bold text-brand-ink sm:text-3xl">
        {option.label}
      </div>
      <div className="mt-1 text-sm text-brand-mute">
        {option.startTime} – {option.endTime} · {option.durationLabel}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-brand-ink/80">{title}</p>

      <button
        type="button"
        onClick={downloadIcs}
        className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-brand-paper px-4 py-2 text-xs font-semibold text-brand-ink transition hover:border-brand-ink/30"
      >
        <CalendarPlus className="size-3.5" />
        내 캘린더에 추가
      </button>
    </motion.article>
  );
}

function Confetti() {
  // Lightweight SVG sprinkle, single render. Not animated to keep things subtle.
  const pieces = [
    { x: 6, y: 8, c: "#A395C0", r: -12 },
    { x: 20, y: 26, c: "#A6CE39", r: 18 },
    { x: 36, y: 14, c: "#F08673", r: 6 },
    { x: 54, y: 22, c: "#A395C0", r: -28 },
    { x: 72, y: 10, c: "#F08673", r: 24 },
    { x: 86, y: 30, c: "#A6CE39", r: -8 },
    { x: 92, y: 50, c: "#A395C0", r: 10 },
    { x: 14, y: 64, c: "#F08673", r: 22 },
  ];
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {pieces.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width="1.5"
          height="0.4"
          rx="0.2"
          fill={p.c}
          transform={`rotate(${p.r} ${p.x + 0.75} ${p.y + 0.2})`}
          opacity={0.85}
        />
      ))}
    </svg>
  );
}
