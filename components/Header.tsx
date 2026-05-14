import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="홈으로">
          <Image
            src="/logo-foundation.png"
            alt="아이들과미래재단"
            width={156}
            height={28}
            sizes="(min-width: 640px) 180px, 156px"
            style={{ width: "auto", height: "auto" }}
            className="h-6 w-auto sm:h-7"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-brand-mute sm:inline">
            with
          </span>
          <InstructorLogo />
        </div>
      </div>
    </header>
  );
}

function InstructorLogo() {
  return (
    <Image
      src="/swit_logo_black_trimmed.png"
      alt="SWITworks"
      width={4578}
      height={1756}
      sizes="(min-width: 640px) 70px, 56px"
      style={{ width: "auto", height: "auto" }}
      priority
      className="h-5 w-auto sm:h-6"
    />
  );
}
