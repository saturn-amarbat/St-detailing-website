import { Check, Sparkles } from "lucide-react";
import Image from "next/image";
import type { PackageId } from "@/lib/booking";

type PricingCardProps = {
  id: PackageId;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  features: readonly string[];
  featured?: boolean;
};

export function PricingCard({
  id,
  name,
  description,
  basePrice,
  image,
  features,
  featured
}: PricingCardProps) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-xl border bg-white/[0.04] p-6 shadow-glass transition duration-300",
        featured ? "border-cyan-300/50 shadow-glow" : "border-white/10 hover:border-cyan-300/35 hover:bg-white/[0.06]"
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          {featured ? (
            <span className="mb-4 inline-flex rounded-full bg-cyan-900/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
              Best Seller
            </span>
          ) : null}
          <h3 className="text-2xl font-black tracking-tight text-white">{name}</h3>
          <p className="mt-3 text-sm text-zinc-300">{description}</p>
        </div>
        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-950/70 sm:h-28 sm:w-28">
          <Image src={image} alt="" width={96} height={96} className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
        </div>
      </div>

      <p className="mt-8 text-5xl font-black tracking-tight text-white">
        ${basePrice}
        <span className="text-2xl text-zinc-400">+</span>
      </p>

      <ul className="mt-8 space-y-4 text-sm font-semibold text-zinc-100">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={`#quote-${id}`}
        className={[
          "mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-base font-black transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950",
          featured
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glass hover:from-cyan-500 hover:to-blue-500"
            : "border border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/50 hover:bg-white/[0.08]"
        ].join(" ")}
      >
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        Select {name}
      </a>
    </article>
  );
}
