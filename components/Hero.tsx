import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="brand-soft-bg absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:pt-24">
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white/70 px-3 py-1.5 text-xs font-medium text-brand-mute backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-coral" />
            임직원 대상 사내 워크숍 · 총 2회기
          </span>

          <h1 className="text-3xl font-bold leading-[1.18] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            아이들과미래재단 임직원을 위한
            <br />
            <span className="brand-text-gradient">AI 업무 생산성 교육</span>
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-brand-mute sm:text-lg">
            생성형 AI로 일하는 방법부터, 코드 한 줄 없이 자동화·사이트 만들기까지.
            <br className="hidden sm:block" />
            본인이 가능한 일정을 선택해 신청해 주세요. 회기별 정원은 15명입니다.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/apply"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-7 py-4 text-base font-semibold text-white shadow-[0_20px_40px_-20px_rgba(26,26,31,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-24px_rgba(240,134,115,0.55)]"
            >
              교육 신청하기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <p className="text-sm text-brand-mute">
              신청 소요 시간 약 1분 · 데이터는 구글시트로 안전하게 전달됩니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
