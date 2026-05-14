"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { StepShell } from "@/components/StepShell";
import { TextField, TextArea } from "@/components/TextField";
import { ScheduleOptionCard } from "@/components/ScheduleOption";
import { AILevelScale } from "@/components/AILevelScale";
import { applicationSchema, type ApplicationInput } from "@/lib/schema";
import {
  AI_LEVELS,
  ALL_OPTION_IDS,
  SESSIONS,
  findOption,
  type CapacityMap,
  type OptionId,
} from "@/lib/sessions";

const TOTAL_STEPS = 6;

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [counts, setCounts] = useState<CapacityMap>(
    () => Object.fromEntries(ALL_OPTION_IDS.map((id) => [id, 0])) as CapacityMap
  );
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setError: setFieldError,
    getValues,
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      team: "",
      session1: undefined,
      session2: undefined,
      ai_level: undefined as unknown as number,
      expectation: "",
      extra: "",
    },
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/capacity", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.counts) setCounts(data.counts as CapacityMap);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const v = watch();

  async function handleNext() {
    setError("");
    if (step === 0) {
      const ok = await trigger(["name", "team"]);
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await trigger("session1");
      if (!ok) return;
    }
    if (step === 2) {
      const ok = await trigger("session2");
      if (!ok) return;
    }
    if (step === 3) {
      const ok = await trigger("ai_level");
      if (!ok) return;
    }
    if (step === 4) {
      const ok = await trigger(["expectation", "extra"]);
      if (!ok) return;
    }
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 409) {
        const j = await res.json();
        const full: OptionId[] = j.full || [];
        if (j.counts) setCounts(j.counts as CapacityMap);
        if (full.includes(data.session1 as OptionId)) {
          setFieldError("session1", { message: "선택하신 일정이 방금 마감되었어요. 다시 선택해 주세요." });
          setStep(1);
        } else if (full.includes(data.session2 as OptionId)) {
          setFieldError("session2", { message: "선택하신 일정이 방금 마감되었어요. 다시 선택해 주세요." });
          setStep(2);
        } else {
          setError("선택하신 일정이 방금 마감되었어요. 다시 선택해 주세요.");
        }
        return;
      }
      if (!res.ok) {
        setError("제출 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }
      try {
        sessionStorage.setItem(
          "fyf:result",
          JSON.stringify({
            name: data.name,
            session1: data.session1,
            session2: data.session2,
          })
        );
      } catch {}
      router.push("/complete");
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <form onSubmit={onSubmit} className="flex flex-1 flex-col">
          {step === 0 && (
            <StepShell
              stepIndex={0}
              totalSteps={TOTAL_STEPS}
              title="먼저, 본인 소개를 부탁드려요"
              subtitle="신청자 확인과 연락을 위해 이름과 부서/팀을 알려주세요."
              onNext={handleNext}
              nextDisabled={!v.name?.trim() || !v.team?.trim()}
            >
              <div className="space-y-5">
                <TextField
                  label="이름"
                  placeholder="홍길동"
                  autoFocus
                  autoComplete="name"
                  {...register("name")}
                  error={errors.name?.message}
                />
                <TextField
                  label="부서 / 팀"
                  placeholder="예) 사업운영팀"
                  autoComplete="organization"
                  {...register("team")}
                  error={errors.team?.message}
                />
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              stepIndex={1}
              totalSteps={TOTAL_STEPS}
              title="1회차 — 어느 날짜에 참여하시나요?"
              subtitle="생성형 AI 기반 업무 생산성 높이기 · 3시간"
              onBack={() => setStep(0)}
              onNext={handleNext}
              nextDisabled={!v.session1}
              errorMessage={errors.session1?.message}
            >
              <Controller
                control={control}
                name="session1"
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {SESSIONS["1st"].options.map((o) => (
                      <ScheduleOptionCard
                        key={o.id}
                        option={o}
                        count={counts[o.id as OptionId] ?? 0}
                        selected={field.value === o.id}
                        onSelect={() => field.onChange(o.id)}
                        tone="purple"
                      />
                    ))}
                  </div>
                )}
              />
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              stepIndex={2}
              totalSteps={TOTAL_STEPS}
              title="2회차 — 어느 날짜에 참여하시나요?"
              subtitle="AI와 Codex를 활용한 업무자동화 바이브코딩 · 약 5시간"
              onBack={() => setStep(1)}
              onNext={handleNext}
              nextDisabled={!v.session2}
              errorMessage={errors.session2?.message}
            >
              <Controller
                control={control}
                name="session2"
                render={({ field }) => (
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {SESSIONS["2nd"].options.map((o) => (
                      <ScheduleOptionCard
                        key={o.id}
                        option={o}
                        count={counts[o.id as OptionId] ?? 0}
                        selected={field.value === o.id}
                        onSelect={() => field.onChange(o.id)}
                        tone="coral"
                      />
                    ))}
                  </div>
                )}
              />
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              stepIndex={3}
              totalSteps={TOTAL_STEPS}
              title="현재 AI를 얼마나 활용하고 계세요?"
              subtitle="강의 난이도와 예제를 맞추는 데 참고할게요. 솔직하게 골라주셔도 좋아요."
              onBack={() => setStep(2)}
              onNext={handleNext}
              nextDisabled={!v.ai_level}
              errorMessage={errors.ai_level?.message}
            >
              <Controller
                control={control}
                name="ai_level"
                render={({ field }) => (
                  <AILevelScale value={field.value} onChange={field.onChange} />
                )}
              />
            </StepShell>
          )}

          {step === 4 && (
            <StepShell
              stepIndex={4}
              totalSteps={TOTAL_STEPS}
              title="이 강의에서 기대하는 점은요?"
              subtitle="어떤 걸 알고 싶은지 알려주시면 그 부분을 더 챙겨갈게요."
              onBack={() => setStep(3)}
              onNext={handleNext}
              nextDisabled={!v.expectation?.trim()}
              errorMessage={errors.expectation?.message || errors.extra?.message}
            >
              <div className="space-y-5">
                <TextArea
                  label="기대하는 점"
                  hint="필수"
                  rows={5}
                  placeholder="예) 매주 받는 신청자 명단을 자동으로 정리해서 메일로 보내는 흐름을 만들어보고 싶어요."
                  {...register("expectation")}
                  error={errors.expectation?.message}
                />
                <TextArea
                  label="기타 의견"
                  hint="선택"
                  rows={4}
                  placeholder="강의 진행에 참고할 만한 내용이 있다면 자유롭게 적어주세요."
                  {...register("extra")}
                  error={errors.extra?.message}
                />
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <ReviewStep
              data={getValues()}
              onBack={() => setStep(4)}
              onEdit={(stepIndex) => setStep(stepIndex)}
              submitting={submitting}
              error={error}
            />
          )}
        </form>

        <div className="mx-auto mb-10 mt-4 max-w-2xl px-5 text-center sm:px-8">
          <Link href="/" className="text-xs text-brand-mute hover:text-brand-ink">
            ← 처음으로
          </Link>
        </div>
      </main>
    </>
  );
}

function ReviewStep({
  data,
  onBack,
  onEdit,
  submitting,
  error,
}: {
  data: ApplicationInput;
  onBack: () => void;
  onEdit: (stepIndex: number) => void;
  submitting: boolean;
  error: string;
}) {
  const o1 = useMemo(() => findOption(data.session1), [data.session1]);
  const o2 = useMemo(() => findOption(data.session2), [data.session2]);
  const lv = AI_LEVELS.find((l) => l.value === data.ai_level);

  return (
    <StepShell
      stepIndex={5}
      totalSteps={TOTAL_STEPS}
      title="제출 전에 한 번만 확인할게요"
      subtitle="아래 내용이 맞나요? 필요하면 항목을 눌러 수정할 수 있어요."
      onBack={onBack}
      nextType="submit"
      nextLabel="제출하기"
      nextDisabled={submitting}
      submitting={submitting}
      errorMessage={error}
    >
      <div className="space-y-3">
        <Row label="이름" value={data.name} onEdit={() => onEdit(0)} />
        <Row label="부서/팀" value={data.team} onEdit={() => onEdit(0)} />
        <Row
          label="1회차"
          value={o1 ? `${o1.label} · ${o1.startTime}–${o1.endTime}` : "-"}
          onEdit={() => onEdit(1)}
          accent="purple"
        />
        <Row
          label="2회차"
          value={o2 ? `${o2.label} · ${o2.startTime}–${o2.endTime}` : "-"}
          onEdit={() => onEdit(2)}
          accent="coral"
        />
        <Row
          label="AI 활용 수준"
          value={lv ? `${lv.emoji} Lv.${lv.value} · ${lv.label}` : "-"}
          onEdit={() => onEdit(3)}
        />
        <Row
          label="기대하는 점"
          value={data.expectation}
          onEdit={() => onEdit(4)}
          multiline
        />
        {data.extra && (
          <Row
            label="기타 의견"
            value={data.extra}
            onEdit={() => onEdit(4)}
            multiline
          />
        )}
      </div>
    </StepShell>
  );
}

function Row({
  label,
  value,
  onEdit,
  multiline,
  accent,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  multiline?: boolean;
  accent?: "purple" | "coral";
}) {
  const dotClass =
    accent === "purple"
      ? "bg-brand-purple"
      : accent === "coral"
      ? "bg-brand-coral"
      : "bg-brand-ink/40";
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group flex w-full items-start gap-4 rounded-2xl border border-brand-line bg-white px-4 py-3.5 text-left transition hover:border-brand-ink/30"
    >
      <span className="mt-[3px] inline-flex w-24 shrink-0 items-center gap-2 text-xs font-semibold tracking-wider text-brand-mute sm:w-28">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
        {label}
      </span>
      <span
        className={`min-w-0 flex-1 text-sm text-brand-ink ${
          multiline ? "whitespace-pre-wrap break-words" : "truncate"
        }`}
      >
        {value}
      </span>
      <span className="mt-[3px] shrink-0 text-xs font-medium text-brand-mute group-hover:text-brand-ink">
        수정
      </span>
    </button>
  );
}
