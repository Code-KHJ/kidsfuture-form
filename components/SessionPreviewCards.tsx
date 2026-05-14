import { CalendarDays, Clock, Sparkles } from "lucide-react";
import { CAPACITY, SESSIONS, type CapacityMap } from "@/lib/sessions";
import { cn } from "@/lib/utils";

type Props = {
  counts: CapacityMap;
};

export function SessionPreviewCards({ counts }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 sm:pb-16">
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <RoundCard
          round="1st"
          counts={counts}
          ribbon="1회차"
          tone="purple"
        />
        <RoundCard
          round="2nd"
          counts={counts}
          ribbon="2회차"
          tone="coral"
        />
      </div>
    </section>
  );
}

function RoundCard({
  round,
  counts,
  ribbon,
  tone,
}: {
  round: "1st" | "2nd";
  counts: CapacityMap;
  ribbon: string;
  tone: "purple" | "coral";
}) {
  const s = SESSIONS[round];
  const dotClass =
    tone === "purple" ? "bg-brand-purple" : "bg-brand-coral";
  const ringClass =
    tone === "purple"
      ? "shadow-[0_30px_70px_-30px_rgba(163,149,192,0.55)]"
      : "shadow-[0_30px_70px_-30px_rgba(240,134,115,0.55)]";
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9",
        ringClass
      )}
    >
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-brand-mute">
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
        {ribbon}
        <span className="text-brand-line">·</span>
        <Clock className="size-3.5" />
        {s.durationLabel}
      </div>

      <h3 className="mt-3 text-xl font-bold leading-snug text-brand-ink sm:text-2xl">
        {s.title}
      </h3>
      <p className="mt-2 text-sm text-brand-mute sm:text-base">{s.subtitle}</p>

      <ul className="mt-5 space-y-2 text-sm leading-relaxed text-brand-ink/85">
        {s.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-ink/40" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {s.tools.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-brand-paper px-2.5 py-1 text-[11px] font-medium text-brand-ink/75"
          >
            <Sparkles className="size-3 text-brand-ink/40" />
            {t}
          </span>
        ))}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {s.options.map((o) => {
          const taken = counts[o.id as keyof CapacityMap] ?? 0;
          const remaining = Math.max(0, CAPACITY - taken);
          const isFull = remaining === 0;
          return (
            <div
              key={o.id}
              className={cn(
                "rounded-2xl border bg-brand-paper px-4 py-3.5",
                isFull
                  ? "border-brand-line/60 opacity-60"
                  : "border-brand-line"
              )}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-mute">
                <CalendarDays className="size-3.5" />
                {o.weekday}
              </div>
              <div className="mt-1 text-sm font-bold text-brand-ink">
                {o.label}
              </div>
              <div className="mt-0.5 text-xs text-brand-mute">
                {o.startTime} – {o.endTime}
              </div>
              <div className="mt-2 text-[11px] font-semibold">
                {isFull ? (
                  <span className="text-brand-coral">마감되었어요</span>
                ) : remaining <= 3 ? (
                  <span className="text-brand-coral">
                    {remaining}자리 남음
                  </span>
                ) : (
                  <span className={tone === "purple" ? "text-brand-purple" : "text-brand-coral"}>
                    {remaining}/{CAPACITY} 신청 가능
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
