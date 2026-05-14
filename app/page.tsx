import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SessionPreviewCards } from "@/components/SessionPreviewCards";
import { countByOption } from "@/lib/google-sheets";
import { ALL_OPTION_IDS, type CapacityMap } from "@/lib/sessions";
import { Code, Sparkles } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadCapacity(): Promise<CapacityMap> {
  try {
    return await countByOption();
  } catch {
    return Object.fromEntries(
      ALL_OPTION_IDS.map((id) => [id, 0]),
    ) as CapacityMap;
  }
}

export default async function Home() {
  const counts = await loadCapacity();
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SessionPreviewCards counts={counts} />
        <Highlights />
        <BottomCta />
      </main>
      <Footer />
    </>
  );
}

function Highlights() {
  const items = [
    {
      icon: "🤝",
      title: "현장 실무에 바로 쓰는 예제",
      body: "제안서·메일·데이터 정리 등 재단 업무를 그대로 가져와 자동화 흐름으로 풀어봐요.",
    },
    {
      icon: "🛠️",
      title: "도구가 아닌, 사고방식",
      body: "Gemini, Codex, Google Apps Script 등 도구를 매개로 'AI와 함께 일하는' 감각을 익혀요.",
    },
    {
      icon: "🌱",
      title: "처음이어도 괜찮은 페이스",
      body: "스텝마다 같이 따라하며 진행해요. 무엇을 모르는지부터 안전하게 짚고 갑니다.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
      <div className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-paper px-3 py-1.5 text-xs font-semibold text-brand-mute">
          <Sparkles className="size-3.5 text-brand-coral" />이 교육에서 얻어갈
          것
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="space-y-2">
              <div className="text-3xl">{it.icon}</div>
              <h3 className="text-base font-bold text-brand-ink sm:text-lg">
                {it.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-mute">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-ink p-8 sm:p-12">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-brand-purple/40 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-brand-coral/40 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold leading-snug sm:text-3xl">
              원하는 일정으로 지금 신청해 주세요.
            </h3>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              회기별 정원 15명 · 1회차 / 2회차 각각 한 일정씩 선택해 주세요.
            </p>
          </div>
          <Link
            href="/apply"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-semibold text-brand-ink transition hover:-translate-y-0.5"
          >
            교육 신청하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-brand-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-brand-mute sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>© 아이들과미래재단 임직원 AI교육 · 제작 SWITWORKS</div>
        <div className="inline-flex items-center gap-1.5">
          <Code className="size-3.5" />이 페이지는 2회차 실습의 레퍼런스
          사례입니다.
        </div>
      </div>
    </footer>
  );
}
