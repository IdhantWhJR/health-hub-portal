import { useEffect, useState } from "react";
import { Building2, Globe2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import heroPortrait from "@/assets/shweta-portrait.jpg";
import stillLife from "@/assets/still-life.jpg";
import handsHerbs from "@/assets/hands-herbs.jpg";
import corporatePhoto from "@/assets/shweta-corporate.jpg";
import { Link } from "wouter";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <ellipse cx="32" cy="32" rx="22" ry="8.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <ellipse cx="32" cy="32" rx="9" ry="22" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M10 32h44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M32 10v44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <circle cx="14" cy="24" r="1.6" fill="currentColor" />
      <circle cx="46" cy="20" r="1.6" fill="currentColor" />
      <circle cx="40" cy="46" r="1.6" fill="currentColor" />
      <circle cx="20" cy="44" r="1.6" fill="currentColor" />
      <path d="M14 24 Q28 6 46 20" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M46 20 Q54 34 40 46" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M40 46 Q28 56 20 44" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M20 44 Q6 30 14 24" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-24 md:pt-44 md:pb-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[640px] w-[640px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.86 0.06 60 / 0.55), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-200px] top-[20%] h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.78 0.05 130 / 0.45), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-10 flex items-center gap-4 text-[12px] tracking-[0.18em] uppercase text-ink/55 md:mb-16">
          <span className="h-px w-12 bg-ink/30" />
          <span>CLINICAL NUTRITIONIST · PhD · 21+ YEARS OF PRACTICE</span>
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-10 lg:gap-16">
          <div className="min-w-0 md:flex-1">
            <h1 className="font-display text-[13vw] leading-[0.92] tracking-[-0.04em] text-ink md:text-[7vw] lg:text-[6.4rem]">
              Nourish better.
              <br />
              Live <em className="font-light italic text-olive">better.</em>
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-cream px-4 py-2.5 text-[11px] font-medium leading-none tracking-[0.02em] text-ink/70 shadow-[0_8px_20px_-12px_oklch(0.3_0.04_70/0.4)] transition-transform hover:-translate-y-0.5 md:text-[12px]">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-terracotta" />
                Works with major corporations
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-cream px-4 py-2.5 text-[11px] font-medium leading-none tracking-[0.02em] text-ink/70 shadow-[0_8px_20px_-12px_oklch(0.3_0.04_70/0.4)] transition-transform hover:-translate-y-0.5 md:text-[12px]">
                <Globe2 className="h-3.5 w-3.5 shrink-0 text-olive" />
                Online clients, worldwide
              </div>
              <div className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-ink/10 bg-cream px-4 py-2.5 text-[11px] font-medium leading-none tracking-[0.02em] text-ink/70 shadow-[0_8px_20px_-12px_oklch(0.3_0.04_70/0.4)] transition-transform hover:-translate-y-0.5 md:text-[12px]">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-terracotta" />
                In-person consultations
              </div>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:mt-20 md:grid-cols-6">
              <div className="sm:col-span-2 md:col-span-3">
                <p className="text-pretty text-lg leading-relaxed text-ink/75 md:text-xl">
                  Dr. Shweta Tripathi is a clinical nutritionist and lifestyle disorder specialist
                  who has guided 3,500+ individuals toward lasting metabolic health — through
                  evidence-based nutrition, not restriction.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:col-span-2">
                <span className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink/50">
                  <GlobeIcon className="h-4 w-4 text-olive" />
                  Consultations
                </span>
                <p className="font-display text-2xl leading-tight text-ink">
                  In person, in Delhi.
                  <br />
                  Online, worldwide.
                </p>
              </div>

              <div className="flex items-end md:col-span-1">
                <a
                  href="#programs"
                  className="group inline-flex items-center gap-3 text-[13px] tracking-[0.1em] uppercase text-ink"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform group-hover:scale-105">
                    ↓
                  </span>
                  See the programs
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[360px] shrink-0 md:mx-0 md:w-[34%] md:max-w-[420px]">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[180px] bg-sand/40 blur-2xl"
              />
              <img
                src={heroPortrait}
                alt="Dr. Shweta Tripathi, Clinical Nutritionist & Lifestyle Disorder Specialist"
                width={1024}
                height={1280}
                className="relative aspect-[4/5] w-full rounded-[180px] object-cover object-top shadow-[0_40px_120px_-40px_oklch(0.3_0.04_70/0.45)]"
              />
              <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-full bg-terracotta md:block" />

              <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-cream/40 bg-cream/90 px-5 py-2.5 text-[12px] font-medium tracking-[0.02em] text-ink shadow-[0_14px_30px_-14px_oklch(0.3_0.04_70/0.5)] backdrop-blur-md md:-top-5 md:bg-cream">
                Dr. Shweta Tripathi, PhD
              </div>

              <div className="absolute -right-3 bottom-8 z-10 whitespace-nowrap rounded-full border border-cream/40 bg-olive px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-cream shadow-[0_14px_30px_-14px_oklch(0.3_0.04_70/0.5)] md:-right-5 md:bottom-10">
                Wellness & Lifestyle Coach
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  const items = [
    ["Gold Medalist", "MSc Nutrition"],
    ["PhD", "in Nutrition"],
    ["21+ Years", "Clinical Practice"],
    ["3,500+", "Individuals Guided"],
    ["Apollo · VLCC · Kailash", "Institutional Experience"],
  ];
  return (
    <div className="border-y border-ink/10 bg-bone/60 py-8">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-12 gap-y-4 px-6 md:px-12">
        {items.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-2">
            <span className="font-display text-lg text-ink md:text-xl">{k}</span>
            <span className="text-[11px] tracking-[0.1em] uppercase text-ink/50">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Philosophy() {
  return (
    <section id="about" className="relative overflow-hidden py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-5">
            <div className="relative md:sticky md:top-24">
              <img
                src={stillLife}
                alt="Seasonal, whole-food ingredients used in client meal plans"
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full rounded-[28px] object-cover"
              />
              <div className="mt-4 flex items-center justify-between text-[11px] tracking-[0.18em] uppercase text-ink/50">
                <span>Evidence-based nutrition</span>
                <span>Not restriction</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-20">
            <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— About</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl">
              We do not <em className="italic text-olive/90">prescribe</em>.
              <br />
              We <em className="italic text-olive/90">listen</em>, then
              <br />
              re-arrange.
            </h2>
            <div className="mt-12 max-w-xl space-y-6 text-lg leading-relaxed text-ink/75">
              <p>
                Dr. Shweta Tripathi, PhD, is a Clinical Nutritionist and Lifestyle Disorder
                Specialist with over 21 years of experience in preventive healthcare, lifestyle
                medicine, and therapeutic nutrition. A Gold Medalist in MSc Nutrition and holder
                of a PhD in Nutrition, her institutional experience includes Indraprastha Apollo
                Hospitals, Kailash Hospital & Research Centre, and VLCC Healthcare, alongside
                collaboration with Luke Coutinho.
              </p>
              <p>
                Her areas of expertise span PCOS, thyroid disorders, type 2 diabetes,
                hypertension, liver and gut health, menopause, obesity, metabolic disorders,
                pregnancy nutrition, and women's hormonal health — translating complex medical
                nutrition into practical, sustainable lifestyle strategies.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-ink/10 pt-12">
              {[
                ["21 yrs", "Of clinical practice"],
                ["3,500+", "Individuals guided"],
                ["1:1", "Personalized, always"],
                ["PhD", "Nutrition, Gold Medalist MSc"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="font-display text-4xl tracking-tight text-ink md:text-5xl">{k}</div>
                  <div className="mt-2 text-sm text-ink/60">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="relative overflow-hidden bg-olive py-32 text-cream md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.08 80 / 0.6), transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-1">
            <span className="font-display text-7xl leading-none text-cream/40">"</span>
          </div>
          <blockquote className="col-span-12 md:col-span-10">
            <p className="text-balance font-display text-3xl font-light leading-[1.15] tracking-[-0.02em] md:text-6xl">
              My mission is to help people build a positive relationship with food, enjoy the
              foods they love, and achieve better health without restrictive or unsustainable
              approaches.
            </p>
            <footer className="mt-12 flex items-center gap-4 text-sm tracking-wide text-cream/70">
              <span className="h-px w-12 bg-cream/40" />
              Dr. Shweta Tripathi, PhD
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function Programs() {
  const programs = [
    {
      no: "01",
      title: "30-Day Nutrition Intervention",
      duration: "30 days",
      price: "₹11,000",
      desc: "A focused initiation of dietary and lifestyle modifications, with close monitoring and daily support to build early momentum.",
    },
    {
      no: "02",
      title: "60-Day Metabolic Health Optimization",
      duration: "60 days",
      price: "₹20,000",
      desc: "An extended intervention to strengthen adherence, improve clinical outcomes, and reinforce behavioural change for conditions like PCOS, prediabetes, and thyroid disorders.",
    },
    {
      no: "03",
      title: "90-Day Comprehensive Lifestyle Transformation",
      duration: "90 days",
      price: "₹27,000",
      desc: "Long-term, intensive support aimed at sustainable health improvements and durable lifestyle modification — from meal plans to sleep, stress, and activity.",
    },
  ];

  return (
    <section id="programs" className="bg-bone py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-20 grid grid-cols-12 items-end gap-4 md:mb-28">
          <div className="col-span-12 md:col-span-7">
            <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— Programs</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl">
              Three ways
              <br />
              to begin.
            </h2>
          </div>
          <p className="col-span-12 max-w-md text-ink/70 md:col-span-4 md:col-start-9">
            Each program includes a comprehensive clinical assessment, a personalized nutrition
            prescription, and continuous monitoring. Held in person in Delhi, or over video —
            worldwide.
          </p>
        </div>

        <div className="space-y-px overflow-hidden rounded-[32px] border border-ink/10 bg-cream">
          {programs.map((p, i) => (
            <article
              key={p.no}
              className="group relative grid grid-cols-12 items-start gap-4 bg-cream px-6 py-12 transition-colors hover:bg-sand/40 md:px-12 md:py-16"
            >
              <div className="col-span-2 font-display text-2xl text-ink/40 md:col-span-1 md:text-3xl">
                {p.no}
              </div>
              <div className="col-span-10 md:col-span-4">
                <h3 className="font-display text-3xl tracking-tight text-ink md:text-4xl">
                  {p.title}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-ink/50">
                  <span>{p.duration}</span>
                  <span className="h-px w-6 bg-ink/30" />
                  <span>{p.price}</span>
                </div>
              </div>
              <p className="col-span-12 max-w-xl text-pretty text-base leading-relaxed text-ink/70 md:col-span-5 md:col-start-7 md:text-lg">
                {p.desc}
              </p>
              <div className="col-span-12 mt-6 flex md:col-span-1 md:col-start-12 md:mt-0 md:justify-end">
                <Link
                  href="/consultations"
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-ink transition-all group-hover:bg-ink group-hover:text-cream"
                >
                  <span aria-hidden>→</span>
                </Link>
              </div>
              {i < programs.length - 1 && (
                <div className="absolute inset-x-6 bottom-0 h-px bg-ink/10 md:inset-x-12" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Editorial() {
  const steps = [
    ["Assess", "A comprehensive clinical nutrition assessment — medical, dietary, and lifestyle evaluation, plus biochemical parameters and reports."],
    ["Prescribe", "A personalized nutrition prescription — customized to your clinical condition, preferences, culture, and life."],
    ["Practice", "A lifestyle modification framework covering sleep, stress, activity, and circadian rhythm, with behaviour coaching that sticks."],
    ["Follow up", "Continuous monitoring and scheduled follow-ups, with plans adjusted as your progress and needs evolve."],
  ];
  return (
    <section className="relative overflow-hidden bg-cream py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— The method</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-[5.5rem]">
              Evidence-based,
              <br />
              <em className="italic text-olive/90">restrained</em>,
              <br />
              deeply personal.
            </h2>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 md:pt-32">
            <img
              src={handsHerbs}
              alt="Fresh, whole ingredients used in client nutrition plans"
              loading="lazy"
              width={1280}
              height={960}
              className="aspect-[4/3] w-full rounded-[24px] object-cover"
            />
            <p className="mt-4 text-sm leading-relaxed text-ink/60">
              Nutrition prescriptions are built around real food — customized to clinical need,
              preference, and culture, never a generic template.
            </p>
          </div>
        </div>

        <ol className="mt-24 grid grid-cols-12 gap-x-4 gap-y-16 md:mt-32">
          {steps.map(([t, d], i) => (
            <li key={t} className="col-span-12 md:col-span-3">
              <div className="font-display text-sm text-terracotta">№ {String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">{t}</h3>
              <p className="mt-3 text-pretty text-ink/70">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Corporate() {
  return (
    <section id="corporate" className="relative overflow-hidden">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-7">
          <img
            src={corporatePhoto}
            alt="Dr. Shweta Tripathi delivering a corporate wellness session"
            loading="lazy"
            width={1280}
            height={1024}
            className="h-full max-h-[820px] w-full object-cover"
          />
        </div>
        <div className="col-span-12 flex items-center bg-sand/50 px-6 py-20 md:col-span-5 md:px-16 md:py-32">
          <div className="max-w-md">
            <span className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-olive">
              <GlobeIcon className="h-4 w-4" />
              Global & corporate
            </span>
            <h2 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
              Wherever you
              <br />
              are, we begin.
            </h2>
            <p className="mt-8 text-pretty text-lg leading-relaxed text-ink/75">
              1:1 consultations are held in person in Delhi, or online with individuals across
              time zones, worldwide. Dr. Tripathi also partners with organizations — bringing
              keynote addresses, wellness workshops, executive health programs, and
              organization-wide health campaigns to teams who want measurable results, not just
              a talk.
            </p>
            <Link
              href="/consultations"
              className="mt-10 inline-flex items-center gap-3 border-b border-ink/30 pb-1 text-[13px] tracking-[0.1em] uppercase text-ink transition-colors hover:border-ink"
            >
              Enquire about corporate wellness
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Focus() {
  const areas = [
    { tag: "Metabolic", title: "Prediabetes, Type 2 Diabetes remission, and obesity & weight management." },
    { tag: "Hormonal", title: "PCOS, thyroid disorders, and women's hormonal health, including menopause." },
    { tag: "Whole-body", title: "Liver (MASLD), gut health, dyslipidaemia, and cardiometabolic health." },
  ];
  return (
    <section id="focus" className="bg-cream py-32 md:py-44">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-16 flex items-end justify-between gap-8">
          <div>
            <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— Focus areas</span>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-6xl">
              Areas of special interest.
            </h2>
          </div>
        </div>

        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {areas.map((p) => (
            <Link
              key={p.title}
              href="/consultations"
              className="group grid grid-cols-12 items-baseline gap-4 py-8 transition-colors hover:bg-bone/50 md:py-10"
            >
              <div className="col-span-3 text-[11px] tracking-[0.18em] uppercase text-ink/50 md:col-span-2">
                {p.tag}
              </div>
              <h3 className="col-span-9 text-pretty font-display text-2xl tracking-tight text-ink md:col-span-9 md:text-3xl">
                {p.title}
              </h3>
              <div className="col-span-12 flex justify-end md:col-span-1">
                <span aria-hidden className="text-ink/40 transition-transform group-hover:translate-x-1 group-hover:text-ink">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-32 text-cream md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -bottom-40 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.115 45 / 0.6), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-200px] top-[-150px] h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.035 130 / 0.6), transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <span className="text-[12px] tracking-[0.2em] uppercase text-cream/50">— Begin</span>
            <h2 className="mt-6 font-display text-6xl leading-[0.98] tracking-[-0.03em] md:text-[7rem]">
              Write to
              <br />
              <em className="italic text-sand">Dr. Tripathi</em>.
            </h2>
          </div>
          <div className="col-span-12 mt-10 flex flex-col gap-8 md:col-span-4 md:mt-32">
            <p className="text-pretty text-lg leading-relaxed text-cream/75">
              A short note about where you are, and what you'd like to feel differently, is
              enough — in person in Delhi, online worldwide, or on behalf of your organization.
            </p>
            <a
              href="mailto:shwetavtripathi@gmail.com"
              className="group inline-flex items-center justify-between rounded-full bg-cream px-6 py-5 text-ink transition-colors hover:bg-sand"
            >
              <span className="font-display text-base md:text-lg">shwetavtripathi@gmail.com</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="tel:+919902275240"
              className="group inline-flex items-center justify-between rounded-full border border-cream/25 px-6 py-5 text-cream transition-colors hover:border-cream/60"
            >
              <span className="font-display text-base md:text-lg">+91 99022 75240</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Credentials />
      <Philosophy />
      <Quote />
      <Programs />
      <Editorial />
      <Corporate />
      <Focus />
      <CTA />
    </>
  );
}
