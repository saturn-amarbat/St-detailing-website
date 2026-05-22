"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQAccordionProps = {
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mt-8 space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <article
            key={item.question}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-glass"
            data-reveal="scale"
            data-reveal-delay={String(index % 4)}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 text-left text-lg font-black text-white"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={["h-5 w-5 shrink-0 text-cyan-300 transition-transform", isOpen ? "rotate-180" : "rotate-0"].join(" ")}
                aria-hidden="true"
              />
            </button>
            {isOpen ? <p className="mt-3 text-zinc-300">{item.answer}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
