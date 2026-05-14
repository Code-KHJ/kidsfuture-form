"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextType?: "button" | "submit";
  submitting?: boolean;
  errorMessage?: string;
};

export function StepShell({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "다음",
  nextDisabled,
  nextType = "button",
  submitting,
  errorMessage,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-10 sm:px-8">
      <ProgressDots current={stepIndex} total={totalSteps} />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          <div className="mt-6 sm:mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-mute">
              Step {stepIndex + 1} / {totalSteps}
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-snug text-brand-ink sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-brand-mute sm:text-base">{subtitle}</p>
            )}
          </div>

          <div className="mt-6 flex-1 sm:mt-8">{children}</div>
        </motion.div>
      </AnimatePresence>

      {errorMessage && (
        <p className="mt-4 rounded-2xl bg-brand-coral/10 px-4 py-3 text-sm font-medium text-brand-coral">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack || submitting}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition",
            onBack
              ? "text-brand-ink hover:bg-brand-ink/5"
              : "cursor-default text-transparent"
          )}
        >
          <ArrowLeft className="size-4" />
          이전
        </button>

        <button
          type={nextType}
          onClick={nextType === "submit" ? undefined : onNext}
          disabled={nextDisabled || submitting}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold transition sm:text-base",
            nextDisabled || submitting
              ? "bg-brand-ink/15 text-brand-ink/40"
              : "bg-brand-ink text-white shadow-[0_18px_36px_-18px_rgba(26,26,31,0.55)] hover:-translate-y-0.5"
          )}
        >
          {submitting ? "전송 중..." : nextLabel}
          {!submitting && <ArrowRight className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="mt-6 flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all",
              done && "bg-brand-ink/70",
              active && "bg-brand-ink",
              !done && !active && "bg-brand-ink/10"
            )}
          />
        );
      })}
    </div>
  );
}
