"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    root.classList.add("reveal-ready");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return () => root.classList.remove("reveal-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
