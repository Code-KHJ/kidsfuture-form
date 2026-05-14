"use client";

import { AI_LEVELS } from "@/lib/sessions";
import { cn } from "@/lib/utils";

type Props = {
  value: number | undefined;
  onChange: (v: number) => void;
};

export function AILevelScale({ value, onChange }: Props) {
  return (
    <div className="space-y-2.5">
      {AI_LEVELS.map((lv) => {
        const selected = value === lv.value;
        return (
          <button
            key={lv.value}
            type="button"
            onClick={() => onChange(lv.value)}
            className={cn(
              "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition sm:p-5",
              selected
                ? "border-transparent ring-2 ring-brand-ink shadow-[0_20px_40px_-20px_rgba(26,26,31,0.45)]"
                : "border-brand-line hover:border-brand-ink/30"
            )}
            aria-pressed={selected}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-paper text-2xl">
              {lv.emoji}
            </span>
            <span className="flex flex-1 flex-col">
              <span className="flex items-baseline gap-2">
                <span className="text-xs font-semibold tracking-wider text-brand-mute">
                  Lv.{lv.value}
                </span>
                <span className="text-base font-bold text-brand-ink">{lv.label}</span>
              </span>
              <span className="mt-0.5 text-sm text-brand-mute">{lv.desc}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
