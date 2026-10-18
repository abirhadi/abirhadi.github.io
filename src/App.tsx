import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  GraduationCap,
  Mail,
  Plus,
} from "lucide-react";
import { Navigation } from "./components/Navigation";
import { SystemDiagram } from "./components/SystemDiagram";
import { ResearchMark } from "./components/ResearchMark";
import { Publications } from "./components/Publications";
import { profile } from "./content/profile";
import { research } from "./content/research";
import { projects } from "./content/projects";
import { publications } from "./content/publications";
import { scholarProfileUrl } from "./content/publicationCategories";
import { courses } from "./content/teaching";
import { experience } from "./content/experience";
import { professionalLinks } from "./content/links";
import { news } from "./content/news";
import { assetUrl } from "./lib";
import { useSectionReveal } from "./useSectionReveal";

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number} /</span>
      {children}
    </div>
  );
}

export default function App() {
  useSectionReveal();
  const [publicationReset, setPublicationReset] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <section
          id="home"
          className="hero section-shell"
          aria-labelledby="hero-title"
        >
          <div className="hero-meta">
            <span className="affiliation">
              <span className="status-dot" />
              {profile.institution}
            </span>
            <span className="hero-meta-right">
              COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE
            </span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-name">
                {profile.name}, <span>{profile.suffix}</span>
              </p>
              <p className="hero-role">{profile.identity}</p>
              <h1 id="hero-title">
                {profile.headline.opening}
                <br />
                <em>{profile.headline.emphasis}</em>{" "}
                {profile.headline.ending.replace(/\.$/, "")}
                <span className="heading-dot">.</span>
              </h1>
              <p className="hero-description">{profile.introduction}</p>
              <div className="hero-ctas">
                <a className="button button-primary" href="#research">
                  Explore research <ArrowDownRightIcon />
                </a>
                <a className="text-link" href="#publications">
                  View publications <ArrowUpRight size={17} />
                </a>
                {profile.cvPath && (
                  <a
                    className="text-link"
                    href={assetUrl(profile.cvPath)}
                    download
                  >
                    Download CV <ArrowDownToLine size={16} />
                  </a>
                )}
              </div>
            </div>
            <figure className="hero-visual">
              <SystemDiagram />
            </figure>
          </div>
          <div className="hero-bottom">
            <a href="#about">
              An introduction <ArrowDown size={14} />
            </a>
            <p>Foundations in AI. A focus on reliability.</p>
            <span className="coordinates">NKU / INFORMATICS</span>
          </div>
        </section>

        <section
          id="about"
          className="about-section section-shell section-space"
          aria-labelledby="about-title"
        >
          <div className="about-layout">
            <div>
              <SectionLabel number="01">THE RESEARCHER</SectionLabel>
              <h2 id="about-title">
                {profile.aboutHeading.opening}
                <br />
                <em>{profile.aboutHeading.emphasis}</em>{" "}
                {profile.aboutHeading.ending}
              </h2>
              <div className="about-signature">
                {profile.portrait ? (
                  <img
                    src={assetUrl(profile.portrait.path)}
                    width={profile.portrait.width}
                    height={profile.portrait.height}
                    alt={profile.portrait.alt}
                    loading="lazy"
                  />
                ) : (
                  <span className="signature-monogram" aria-hidden="true">
                    ah.
                  </span>
                )}
                <div>
                  <strong>
                    {profile.name}, {profile.suffix}
                  </strong>
                  <span>
                    {profile.role} · {profile.institution}
                  </span>
                </div>
              </div>
            </div>
            <div className="about-prose">
              {profile.biography.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <a href="#experience" className="text-link">
                Academic journey <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="research"
          className="research-section section-space"
          aria-labelledby="research-title"
        >
          <div className="section-shell">
            <SectionLabel number="02">RESEARCH DIRECTIONS</SectionLabel>
            <div className="section-heading">
              <h2 id="research-title">
                Three perspectives.
                <br />
                <em>One connected pursuit.</em>
              </h2>
              <p>
                From how systems reason to how they learn and perceive, my
                research asks what it takes to build intelligence we can rely
                on.
              </p>
            </div>
            <div className="research-grid">
              {research.map((r) => (
                <article
                  key={r.id}
                  className={`research-card research-${r.id}`}
                >
                  <div className="research-card-top">
                    <span>{r.number}</span>
                    <ResearchMark type={r.id} />
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                  <div className="research-keywords">
                    {r.keywords.map((k) => (
                      <span key={k}>{k}</span>
                    ))}
                  </div>
                  <a
                    href={`#project-area-${r.id}`}
                    className="research-question"
                  >
                    {r.question}
                    <ArrowUpRight size={19} />
                  </a>
                </article>
              ))}
            </div>
            <div className="vision-panel">
              <span className="vision-symbol" aria-hidden="true">
                ∞
              </span>
              <div>
                <span className="eyebrow">THE LONG-TERM SCIENTIFIC VISION</span>
                <h3>{profile.direction}</h3>
                <p>{profile.vision}</p>
                <span className="vision-note">
                  A scientific ambition guiding current research.
                </span>
              </div>
              <ArrowUpRight className="vision-arrow" size={28} />
            </div>
          </div>
        </section>

        <section
          id="publications"
          className="section-shell section-space"
          aria-labelledby="publications-title"
        >
          <SectionLabel number="03">PUBLICATIONS & SCHOLARLY WORK</SectionLabel>
          <div className="section-heading">
            <h2 id="publications-title">
              Ideas, in <em>print.</em>
            </h2>
            <p>
              Work on efficient learning, machine perception, intelligent
              sensing, and applied AI.
              <a
                className="publication-source-link"
                href={scholarProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Scholar <ArrowUpRight size={14} />
              </a>
            </p>
          </div>
          <Publications resetKey={publicationReset} />
          <p className="publication-footnote">
            Publisher links and citation exports are provided where verified.
            Full texts remain subject to publisher access.
          </p>
        </section>

        <section
          id="projects"
          className="projects-section section-space"
          aria-labelledby="projects-title"
        >
          <div className="section-shell">
            <SectionLabel number="04">RESEARCH IN FOCUS</SectionLabel>
            <div className="section-heading">
              <h2 id="projects-title">
                Questions worth
                <br />
                <em>working on.</em>
              </h2>
              <p>
                Research themes connecting published foundations with new
                questions in autonomous systems, adaptive learning, and sensing.
              </p>
            </div>
            <div className="projects-list">
              {projects.map((p, index) => (
                <details
                  key={p.id}
                  className={`project project-${p.area}`}
                  id={
                    projects.find((first) => first.area === p.area)?.id === p.id
                      ? `project-area-${p.area}`
                      : `project-${p.id}`
                  }
                >
                  <summary>
                    <span className="project-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="project-summary">
                      <span className="project-status">{p.status}</span>
                      <h3>{p.shortTitle}</h3>
                      <p>{p.summary}</p>
                    </div>
                    <span className="project-plus">
                      <Plus size={22} />
                    </span>
                  </summary>
                  <div className="project-detail">
                    <div>
                      <span className="eyebrow">THE QUESTION</span>
                      <h4>{p.title}</h4>
                      <p>{p.motivation}</p>
                    </div>
                    <div>
                      <span className="eyebrow">METHODS & DIRECTIONS</span>
                      <div className="tags">
                        {p.methods.map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                      {p.publicationIds.length > 0 && (
                        <div className="project-papers">
                          <span className="eyebrow">RELATED PUBLICATIONS</span>
                          {p.publicationIds.map((id) => {
                            const paper = publications.find(
                              (pub) => pub.id === id,
                            );
                            return (
                              paper && (
                                <a
                                  href="#publications"
                                  key={id}
                                  onClick={() =>
                                    setPublicationReset((n) => n + 1)
                                  }
                                >
                                  {paper.title}
                                  <ArrowUpRight size={15} />
                                </a>
                              )
                            );
                          })}
                        </div>
                      )}
                      {p.link && (
                        <a
                          className="text-link"
                          href={p.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {p.link.label}
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="teaching"
          className="section-shell section-space"
          aria-labelledby="teaching-title"
        >
          <div className="teaching-layout">
            <div className="teaching-intro">
              <SectionLabel number="05">TEACHING & MENTORSHIP</SectionLabel>
              <h2 id="teaching-title">
                Understanding.
                <br />
                Building.
                <br />
                <em>Questioning.</em>
              </h2>
              <p>{profile.teachingPhilosophy}</p>
              <div className="teaching-note">
                <GraduationCap size={21} />
                <span>
                  Instructional areas
                  <br />
                  <strong>{profile.institution}</strong>
                </span>
              </div>
            </div>
            <div className="course-list">
              {courses.map((c) => (
                <article className="course" key={c.code}>
                  <div className="course-meta">
                    <span>{c.code}</span>
                    {c.semester && <span>{c.semester}</span>}
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="experience-section section-space"
          aria-labelledby="experience-title"
        >
          <div className="section-shell experience-layout">
            <div>
              <SectionLabel number="06">EXPERIENCE & EDUCATION</SectionLabel>
              <h2 id="experience-title">
                The path
                <br />
                <em>so far.</em>
              </h2>
            </div>
            <ol className="timeline">
              {experience.map((e, i) => (
                <li key={e.title}>
                  <span
                    className={`timeline-dot ${i === 0 ? "current" : ""}`}
                  />
                  <span className="timeline-period">{e.period}</span>
                  <div>
                    <h3>{e.title}</h3>
                    <strong>{e.institution}</strong>
                    <p>{e.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {news.length > 0 && (
          <section
            id="news"
            className="section-shell section-space"
            aria-labelledby="news-title"
          >
            <SectionLabel number="07">FROM THE DESK</SectionLabel>
            <h2 id="news-title">
              News & <em>updates.</em>
            </h2>
            <div className="news-list">
              {[...news]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((n) => (
                  <article key={n.id}>
                    <time dateTime={n.date}>
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(`${n.date}T12:00:00Z`))}
                    </time>
                    <h3>{n.url ? <a href={n.url}>{n.title}</a> : n.title}</h3>
                  </article>
                ))}
            </div>
          </section>
        )}

        <section
          id="contact"
          className="contact-section section-space"
          aria-labelledby="contact-title"
        >
          <div className="section-shell">
            <div className="contact-top">
              <SectionLabel number={news.length ? "08" : "07"}>
                LET’S CONNECT
              </SectionLabel>
              <span className="contact-context">
                RESEARCH · COLLABORATION · CURIOSITY
              </span>
            </div>
            <div className="contact-grid">
              <h2 id="contact-title">
                {profile.contactHeading.opening}
                <br />
                {profile.contactHeading.continuation}{" "}
                <em>{profile.contactHeading.emphasis}</em>
              </h2>
              <div>
                <p>{profile.contactText}</p>
              </div>
            </div>
            <div className="contact-links">
              <span>
                <Mail size={15} /> Academic inquiries welcome
              </span>
              <div>
                {professionalLinks.map((l) => (
                  <a
                    href={l.url}
                    key={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                    <ArrowUpRight size={15} />
                  </a>
                ))}
                {profile.cvPath && (
                  <a href={assetUrl(profile.cvPath)} download>
                    Download CV
                    <ArrowDownToLine size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a className="footer-brand" href="#home">
          {profile.initials}
          <span>.</span>
        </a>
        <p>
          © {new Date().getUTCFullYear()} {profile.name}
          <span>
            {profile.school} · {profile.institution}
          </span>
        </p>
        <a href="#home" className="footer-top">
          Back to top <ArrowUp size={15} />
        </a>
      </footer>
      {showTop && (
        <a
          className="floating-top icon-button"
          href="#home"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </a>
      )}
    </>
  );
}
function ArrowDownRightIcon() {
  return <ChevronDown size={17} className="cta-arrow" />;
}
