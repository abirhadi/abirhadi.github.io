import { useEffect } from "react";

export function useSectionReveal() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll<HTMLElement>(
      ".section-heading, .about-layout, .teaching-layout, .experience-layout",
    );
    const reveal = (element: Element) =>
      element.classList.remove("reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    elements.forEach((element) => {
      // Never hide above-the-fold or non-JavaScript content.
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("reveal-block", "reveal-pending");
        observer.observe(element);
      }
    });
    const reduce = () => {
      if (media.matches) elements.forEach(reveal);
    };
    media.addEventListener("change", reduce);
    return () => {
      observer.disconnect();
      elements.forEach(reveal);
      media.removeEventListener("change", reduce);
    };
  }, []);
}
