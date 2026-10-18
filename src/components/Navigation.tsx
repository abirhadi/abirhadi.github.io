import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { profile } from "../content/profile";

const items = [
  ["research", "Research"],
  ["publications", "Publications"],
  ["projects", "Projects"],
  ["teaching", "Teaching"],
  ["about", "About"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("light");
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("ah-theme");
      } catch {
        /* system preference still works */
      }
      const next =
        saved === "dark" || saved === "light"
          ? saved
          : media.matches
            ? "dark"
            : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("ah-theme", next);
    } catch {
      /* usable without storage */
    }
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="#home"
          className="brand"
          aria-label={`${profile.name}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="monogram">
            {profile.initials}
            <span>.</span>
          </span>
          <span className="brand-name">
            {profile.shortName}
            <small>RESEARCH & EDUCATION</small>
          </span>
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {items.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <a className="contact-nav" href="#contact">
            Let’s connect <ArrowUpRight size={16} />
          </a>
          <button
            ref={toggleRef}
            className="icon-button menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-nav"
        >
          {[...items, ["contact", "Contact"]].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
