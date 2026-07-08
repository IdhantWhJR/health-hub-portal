import { useEffect, useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-5">
      <div
        className={cn(
          "flex w-full items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "max-w-[1100px] rounded-full border border-ink/10 bg-cream/70 px-5 py-3 shadow-[0_20px_50px_-25px_oklch(0.3_0.04_70/0.5)] backdrop-blur-xl md:px-8 md:py-3.5"
            : "max-w-[1600px] bg-transparent px-3 py-3 mix-blend-multiply md:px-9 md:py-5",
        )}
      >
        <Link href="/" className="font-display text-xl tracking-tight text-ink md:text-2xl">
          Dr. Shweta Tripathi<span className="text-terracotta">.</span>
        </Link>
        <div className="hidden items-center gap-9 text-[13px] tracking-[0.08em] uppercase text-ink/70 md:flex">
          <Link href="/#about" className="transition-colors hover:text-ink">About</Link>
          <Link href="/#programs" className="transition-colors hover:text-ink">Programs</Link>
          <Link href="/recipes" className="transition-colors hover:text-ink">Recipes</Link>
          <Link href="/blog" className="transition-colors hover:text-ink">Blog</Link>
        </div>
        <Link
          href="/consultations"
          className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/60 px-4 py-2 text-[12px] tracking-[0.06em] uppercase text-ink backdrop-blur-md transition-all hover:bg-ink hover:text-cream md:px-5 md:py-2.5 md:text-[13px]"
        >
          Book a Consult
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-ink pb-10 text-cream/70 mt-auto">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="border-t border-cream/15 py-10 md:py-14">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-4">
              <div className="font-display text-3xl text-cream">
                Dr. Shweta Tripathi<span className="text-terracotta">.</span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed">
                Nourish Better. Live Better. Clinical nutrition & lifestyle disorder specialist.
                By appointment — in person and online.
              </p>
            </div>
            <div className="col-span-6 md:col-span-2 md:col-start-7">
              <div className="text-[11px] tracking-[0.18em] uppercase text-cream/50">Practice</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/#about" className="hover:text-cream">About</Link></li>
                <li><Link href="/#programs" className="hover:text-cream">Programs</Link></li>
                <li><Link href="/consultations" className="hover:text-cream">Consult</Link></li>
              </ul>
            </div>
            <div className="col-span-6 md:col-span-2">
              <div className="text-[11px] tracking-[0.18em] uppercase text-cream/50">Content</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/recipes" className="hover:text-cream">Recipes</Link></li>
                <li><Link href="/blog" className="hover:text-cream">Blog</Link></li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-2">
              <div className="text-[11px] tracking-[0.18em] uppercase text-cream/50">Consult</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>In person — Delhi</li>
                <li>Online — Worldwide</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-4 text-xs text-cream/40 md:flex-row md:items-end">
            <div>© Dr. Shweta Tripathi, {new Date().getFullYear()}</div>
            <div className="font-display text-[14vw] leading-none tracking-[-0.05em] text-cream/10 md:text-[10rem]">
              Tripathi.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
