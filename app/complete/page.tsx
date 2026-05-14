"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CompleteHero } from "@/components/CompleteHero";
import { SESSIONS } from "@/lib/sessions";

type Result = { name: string; session1: string; session2: string };

export default function CompletePage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = sessionStorage.getItem("fyf:result");
      if (!raw) {
        router.replace("/");
        return;
      }
      setResult(JSON.parse(raw) as Result);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!hydrated || !result) {
    return (
      <>
        <Header />
        <main className="flex flex-1 items-center justify-center p-10 text-sm text-brand-mute">
          잠시만요...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <CompleteHero
          name={result.name}
          session1={result.session1}
          session2={result.session2}
        />
        <WhatsNext />
        <BackLink />
      </main>
    </>
  );
}

function WhatsNext() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="rounded-[2rem] border border-brand-line bg-white p-7 sm:p-9">
        <h2 className="text-xl font-bold text-brand-ink sm:text-2xl">
          강의에서 만나게 될 것들
        </h2>
        <p className="mt-2 text-sm text-brand-mute">
          두 회기 모두 손으로 직접 만들어보는 시간이 가장 많아요.
        </p>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {(["1st", "2nd"] as const).map((round) => {
            const s = SESSIONS[round];
            const tone = round === "1st" ? "purple" : "coral";
            const dotClass = tone === "purple" ? "bg-brand-purple" : "bg-brand-coral";
            const chipClass =
              tone === "purple"
                ? "bg-brand-purple/10 text-brand-purple"
                : "bg-brand-coral/10 text-brand-coral";
            return (
              <div key={round} className="rounded-2xl border border-brand-line bg-brand-paper p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-mute">
                  <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                  {round === "1st" ? "1회차" : "2회차"} · {s.durationLabel}
                </div>
                <h3 className="mt-2 text-base font-bold text-brand-ink">{s.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-ink/80">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand-ink/40" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tools.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${chipClass}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 rounded-2xl bg-brand-paper p-5 text-sm leading-relaxed text-brand-ink/85">
          <span className="font-semibold text-brand-ink">잠깐, 작은 힌트</span> ·
          지금 보고 계신 이 페이지도 2회차 마지막 실습 <em>"사업 랜딩페이지·접수페이지 만들기"</em>의 레퍼런스 사례예요.
          6월에 직접 비슷한 페이지를 만들어볼게요.
        </p>
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <div className="mx-auto mb-14 mt-auto w-full max-w-3xl px-5 text-center sm:px-8">
      <Link href="/" className="text-xs text-brand-mute hover:text-brand-ink">
        ← 처음으로
      </Link>
    </div>
  );
}
