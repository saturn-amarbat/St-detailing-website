import Image from "next/image";
import { Award, CalendarCheck, CheckCircle2, Mail, MapPin, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { BookingWizard } from "@/components/BookingWizard";
import { PricingCard } from "@/components/PricingCard";
import { packages } from "@/lib/booking";

const serviceAreas = [
  "Downtown Chicago",
  "West Loop",
  "South Loop",
  "Oak Park",
  "Evanston",
  "Skokie",
  "Naperville",
  "Schaumburg",
  "Downers Grove",
  "Orland Park",
  "Bolingbrook",
  "Aurora"
];

const hiddenFormFields = [
  "form-name",
  "bot-field",
  "vehicleSize",
  "selectedPackage",
  "addons",
  "calculatedTotal",
  "firstName",
  "lastName",
  "email",
  "phone",
  "preferredDate",
  "preferredTime",
  "payload"
];

export default function Home() {
  return (
    <>
      <form
        name="booking-wizard"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        {hiddenFormFields.map((field) => (
          <input key={field} type="hidden" name={field} />
        ))}
      </form>

      <div className="min-h-screen bg-slate-950 text-white">
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/88 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <a href="#top" className="flex min-w-0 items-center gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-cyan-300/35 bg-slate-950 shadow-glow">
                <Image src="/st-logo.png" alt="ST Chicagoland Mobile Detailing logo" width={56} height={56} className="h-full w-full object-cover" priority />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-black tracking-tight sm:text-xl">ST CHICAGOLAND</span>
                <span className="block truncate text-sm font-bold text-zinc-400 sm:text-base">Mobile Detailing</span>
              </span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              <a href="#services" className="text-sm font-black text-zinc-300 transition hover:text-white">
                Services
              </a>
              <a href="#pricing" className="text-sm font-black text-zinc-300 transition hover:text-white">
                Pricing
              </a>
              <a href="#quote" className="text-sm font-black text-zinc-300 transition hover:text-white">
                Quote
              </a>
              <a href="#faq" className="text-sm font-black text-zinc-300 transition hover:text-white">
                FAQ
              </a>
            </div>

            <a
              href="#quote"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 text-sm font-black text-white shadow-glass transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:px-5"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Get Quote</span>
            </a>
          </nav>
          <div className="grid grid-cols-4 border-t border-white/10 md:hidden">
            {["Services", "Pricing", "Quote", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-2 py-2 text-center text-xs font-black uppercase tracking-wide text-zinc-300"
              >
                {item}
              </a>
            ))}
          </div>
        </header>

        <main id="top">
          <section className="relative isolate min-h-[94svh] overflow-hidden pt-32 md:pt-24">
            <Image
              src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=2400&q=80"
              alt=""
              fill
              sizes="100vw"
              className="absolute inset-0 -z-20 object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.98)_0%,rgba(2,6,23,0.82)_45%,rgba(2,6,23,0.64)_100%)]" />
            <div className="mx-auto flex min-h-[calc(94svh-8rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Downtown Chicago & nearby suburbs
                </div>
                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-7xl lg:text-8xl">
                  Premium mobile detailing without leaving your driveway.
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-zinc-200 sm:text-xl">
                  ST Chicagoland Mobile Detailing brings exterior washing, interior resets, steam cleaning, stain treatment, and resale-ready restoration straight to your home or workplace.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#quote"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-base font-black text-white shadow-glass transition hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    Get a Free Quote
                  </a>
                  <a
                    href="#pricing"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 text-base font-black text-white shadow-glass transition hover:border-cyan-300/45 hover:bg-white/[0.1]"
                  >
                    View Pricing
                  </a>
                </div>
                <div className="mt-10 grid max-w-3xl gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-glass backdrop-blur sm:grid-cols-3">
                  <div>
                    <p className="text-3xl font-black text-emerald-400">2-Man</p>
                    <p className="mt-1 text-sm text-zinc-300">Rapid mobile workflow</p>
                  </div>
                  <div className="border-white/10 sm:border-l sm:pl-5">
                    <p className="text-3xl font-black text-cyan-300">2-5 hr</p>
                    <p className="mt-1 text-sm text-zinc-300">Typical driveway appointment</p>
                  </div>
                  <div className="border-white/10 sm:border-l sm:pl-5">
                    <p className="text-3xl font-black text-white">100%</p>
                    <p className="mt-1 text-sm text-zinc-300">Walkaround before final payment</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="border-y border-white/10 bg-slate-900 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Why mobile detailing</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: MapPin,
                    title: "We Come to You",
                    copy: "Book at home or work and skip the waiting room. We bring the detail setup directly to your vehicle."
                  },
                  {
                    icon: Wrench,
                    title: "Premium Equipment",
                    copy: "Foam wash tools, steam cleaning, drill brushes, and interior-safe products for a professional finish."
                  },
                  {
                    icon: ShieldCheck,
                    title: "Satisfied Results",
                    copy: "Every appointment ends with a final walkaround so the result is clear before payment."
                  }
                ].map((item) => (
                  <article key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-glass">
                    <item.icon className="h-9 w-9 text-cyan-300" aria-hidden="true" />
                    <h2 className="mt-6 text-2xl font-black text-white">{item.title}</h2>
                    <p className="mt-3 text-zinc-300">{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="bg-slate-950 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Packages</p>
                  <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                    Choose the finish your vehicle needs.
                  </h2>
                </div>
                <p className="max-w-md text-zinc-300">
                  Starting prices are shown for sedan/coupe vehicles. Your booking estimate updates by vehicle size in the quote wizard.
                </p>
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                {packages.map((servicePackage) => (
                  <PricingCard key={servicePackage.id} {...servicePackage} />
                ))}
              </div>

              <div className="mt-12 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-glass md:grid-cols-2">
                <article className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/55 p-4">
                  <Image src="/requirement-water.png" alt="" width={96} height={96} className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />
                  <div>
                    <h3 className="text-xl font-black text-white">Outdoor Water Spigot Access Required</h3>
                    <p className="mt-2 text-sm text-zinc-300">
                      Please make sure we can connect to a working outdoor spigot close enough to the vehicle service area.
                    </p>
                  </div>
                </article>
                <article className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/55 p-4">
                  <Image src="/requirement-power.png" alt="" width={96} height={96} className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24" />
                  <div>
                    <h3 className="text-xl font-black text-white">Standard 110V Power Outlet Required</h3>
                    <p className="mt-2 text-sm text-zinc-300">
                      We use a standard outlet for polishers, vacuums, steam tools, and other professional detailing equipment.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <BookingWizard />

          <section className="border-y border-white/10 bg-slate-900 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">How it works</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["1", "Pick Your Package", "Choose a package, vehicle size, add-ons, and preferred appointment window."],
                  ["2", "We Drive to You", "A focused two-person mobile team arrives prepared and works efficiently at your home or office."],
                  ["3", "Inspect & Pay", "Review the vehicle with us, confirm the result, and pay after the final walkaround."]
                ].map(([number, title, copy]) => (
                  <article key={title} className="rounded-xl border border-white/10 bg-white/[0.04] p-6 shadow-glass">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-lg font-black text-white">
                      {number}
                    </span>
                    <h2 className="mt-6 text-2xl font-black text-white">{title}</h2>
                    <p className="mt-3 text-zinc-300">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-950 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Service areas</p>
                  <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                    Downtown Chicago and nearby suburbs.
                  </h2>
                  <p className="mt-5 text-zinc-300">
                    Service availability depends on schedule, weather, and drive time. The ideal radius is roughly 40-50 miles from the Downtown Chicago area.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {serviceAreas.map((area) => (
                    <div key={area} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-zinc-100 shadow-glass">
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="faq" className="bg-slate-900 py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Requirements & FAQ</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">What to know before booking.</h2>
              <div className="mt-8 space-y-3">
                {[
                  [
                    "Do you need water and electricity?",
                    "Yes. Please confirm access to an outdoor water spigot and a standard 110V power outlet before booking. These requirements help us deliver a professional mobile setup without delays."
                  ],
                  [
                    "What happens if the weather changes?",
                    "If rain, snow, extreme cold, or unsafe wind affects service quality or safety, we will contact you to reschedule for the next practical opening."
                  ],
                  [
                    "Are prices final?",
                    "The booking wizard provides an accurate starting estimate. Final quotes may change for oversized vehicles, pet hair, heavy staining, excessive debris, odor issues, or paint condition."
                  ],
                  [
                    "Can I email for a custom quote?",
                    "Yes. You can reach ST Chicagoland Mobile Detailing at info.stdetailingchicago@gmail.com for custom requests, fleet work, or unique vehicle conditions."
                  ]
                ].map(([question, answer]) => (
                  <details key={question} className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-glass" open>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-white">
                      {question}
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" />
                    </summary>
                    <p className="mt-3 text-zinc-300">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-slate-950">
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-300">Ready when your driveway is</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-white">
                  Get a polished quote before the appointment hits your calendar.
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-zinc-300">
                  <Mail className="h-5 w-5 text-cyan-300" aria-hidden="true" />
                  <a href="mailto:info.stdetailingchicago@gmail.com" className="break-all font-bold text-cyan-300 transition hover:text-white">
                    info.stdetailingchicago@gmail.com
                  </a>
                </div>
              </div>
              <a
                href="#quote"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-base font-black text-white shadow-glass transition hover:from-cyan-500 hover:to-blue-500"
              >
                <Award className="h-5 w-5" aria-hidden="true" />
                Start Booking
              </a>
            </div>
            <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-sm text-zinc-500 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <p>&copy; 2026 ST Chicagoland Mobile Detailing. All rights reserved.</p>
              <a href="mailto:info.stdetailingchicago@gmail.com" className="break-all transition hover:text-cyan-300">
                info.stdetailingchicago@gmail.com
              </a>
            </div>
          </section>
        </footer>
      </div>
    </>
  );
}
