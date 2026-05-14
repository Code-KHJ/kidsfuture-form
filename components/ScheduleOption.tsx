"use client";

import { CalendarDays, Check, Lock } from "lucide-react";
import { motion } from "motion/react";
import { CAPACITY, type ScheduleOption as TOption } from "@/lib/sessions";
import { cn } from "@/lib/utils";

type Props = {
  option: TOption;
  count: number;
  selected: boolean;
  onSelect: () => void;
  tone: "purple" | "coral";
};

export function ScheduleOptionCard({ option, count, selected, onSelect, tone }: Props) {
  const remaining = Math.max(0, CAPACITY - count);
  const isFull = remaining === 0;

  const toneText =
    tone === "purple" ? "text-brand-purple" : "text-brand-coral";
  const toneBg = tone === "purple" ? "bg-brand-purple" : "bg-brand-coral";
  const toneRing =
    tone === "purple"
      ? "ring-brand-purple/40 shadow-[0_24px_48px_-24px_rgba(163,149,192,0.65)]"
      : "ring-brand-coral/40 shadow-[0_24px_48px_-24px_rgba(240,134,115,0.65)]";

  return (
    <motion.button
      type="button"
      whileTap={!isFull ? { scale: 0.985 } : undefined}
      onClick={() => !isFull && onSelect()}
      disabled={isFull}
      aria-pressed={selected}
      aria-disabled={isFull}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl border bg-white p-5 text-left transition sm:p-6",
        isFull
          ? "cursor-not-allowed border-brand-line/70 opacity-60"
          : "border-brand-line hover:-translate-y-0.5 hover:border-brand-ink/30",
        selected && !isFull && cn("border-transparent ring-2", toneRing)
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-mute">
            <CalendarDays className="size-3.5" />
            {option.weekday}
          </div>
          <div className="mt-1.5 text-xl font-bold text-brand-ink sm:text-2xl">
            {option.label}
          </div>
          <div className="mt-1 text-sm text-brand-mute">
            {option.startTime} – {option.endTime} · {option.durationLabel}
          </div>
        </div>

        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full border transition",
            selected && !isFull
              ? cn("border-transparent text-white", toneBg)
              : "border-brand-line bg-white text-transparent"
          )}
          aria-hidden
        >
          <Check className="size-4" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-[12px] font-medium text-brand-mute">
          정원 {CAPACITY}명
        </div>
        <div className="text-[12px] font-semibold">
          {isFull ? (
            <span className="inline-flex items-center gap-1 text-brand-mute">
              <Lock className="size-3.5" /> 마감
            </span>
          ) : remaining <= 3 ? (
            <span className={toneText}>{remaining}자리 남음</span>
          ) : (
            <span className={toneText}>
              {remaining}자리 신청 가능
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
