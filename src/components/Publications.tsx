import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  FileText,
  X,
} from "lucide-react";
import { publications } from "../content/publications";
import { profile } from "../content/profile";
import {
  publicationCategories,
  publicationTypeLabels,
} from "../content/publicationCategories";
import type { Publication } from "../content/types";
import { assetUrl, bibtex } from "../lib";

export function Publications({ resetKey }: { resetKey: number }) {
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<Publication | null>(null);
  useEffect(() => {
    setCategory("all");
    setYear("all");
    setType("all");
  }, [resetKey]);
  const filtered = publications.filter(
    (p) =>
      (category === "all" || p.categories.some((id) => id === category)) &&
      (year === "all" || p.year === Number(year)) &&
      (type === "all" || p.type === type),
  );
  const categories = [
    { id: "all", label: "All work" },
    ...publicationCategories,
  ].filter(
    (a) =>
      a.id === "all" ||
      publications.some((p) => p.categories.some((id) => id === a.id)),
  );
  return (
    <>
      <div className="publication-filters">
        <div
          className="filter-buttons"
          role="group"
          aria-label="Filter publications by research interest"
        >
          {categories.map((a) => (
            <button
              key={a.id}
              aria-pressed={category === a.id}
              onClick={() => setCategory(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="publication-filter-selects">
          <label className="year-filter">
            <span className="sr-only">Publication year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="all">All years</option>
              {[...new Set(publications.map((p) => p.year))]
                .sort((a, b) => b - a)
                .map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
            </select>
          </label>
          <label className="year-filter">
            <span className="sr-only">Publication type</span>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              {[...new Set(publications.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} publications shown
      </p>
      <div className="publication-list">
        {filtered.map((p) => (
          <article
            key={p.id}
            id={`publication-${p.id}`}
            className={`publication ${p.featured ? "featured-publication" : ""}`}
          >
            <div className="publication-year">
              {p.year}
              <span>{publicationTypeLabels[p.type]}</span>
            </div>
            <div className="publication-body">
              <div className="publication-topline">
                {p.featured && (
                  <span className="featured-label">SELECTED PAPER</span>
                )}
                <span className="publication-type">{p.type}</span>
              </div>
              <h3>{p.title}</h3>
              {p.authors && (
                <p className="authors">
                  {p.authors.map((a, i) => (
                    <span key={a}>
                      {i > 0 && ", "}
                      {a === profile.name ||
                      profile.publicationNameVariants.includes(a) ? (
                        <strong>{a}</strong>
                      ) : (
                        a
                      )}
                    </span>
                  ))}
                </p>
              )}
              {p.venue && (
                <p className="venue">
                  {p.venue}
                  {p.volume && `, ${p.volume}${p.issue ? `(${p.issue})` : ""}`}
                  {p.pages && ` · pp. ${p.pages}`}
                  {p.articleNumber && ` · Article ${p.articleNumber}`}
                </p>
              )}
              <div className="publication-bottom">
                <div className="tags">
                  {p.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="paper-actions">
                  {(p.doi || p.url || p.scholarUrl) && (
                    <a
                      href={
                        p.doi
                          ? `https://doi.org/${p.doi}`
                          : p.url || p.scholarUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${p.title} (opens in a new tab)`}
                    >
                      {p.type === "Doctoral dissertation"
                        ? "Repository"
                        : p.type === "Poster"
                          ? "Poster"
                          : "Paper"}{" "}
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  {p.pdf && (
                    <a
                      href={/^https?:/.test(p.pdf) ? p.pdf : assetUrl(p.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PDF <FileText size={14} />
                    </a>
                  )}
                  {bibtex(p) && (
                    <button
                      onClick={() => setSelected(p)}
                      aria-label={`View BibTeX for ${p.title}`}
                    >
                      BibTeX <Copy size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>No publications in this selection.</h3>
          <p>Try another year, research interest, or publication type.</p>
          <button
            className="text-link"
            onClick={() => {
              setCategory("all");
              setYear("all");
              setType("all");
            }}
          >
            Show all publications <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      <CitationDialog
        publication={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function CitationDialog({
  publication,
  onClose,
}: {
  publication: Publication | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState("");
  const citation = publication ? bibtex(publication) : undefined;
  useEffect(() => {
    if (publication) {
      setStatus("");
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [publication]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(citation!);
      setStatus("Citation copied.");
    } catch {
      setStatus(
        "Clipboard unavailable. Select the citation below or download the .bib file.",
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className="citation-dialog"
      aria-labelledby="citation-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-heading">
        <div>
          <span className="eyebrow">CITATION EXPORT</span>
          <h2 id="citation-title">A reference for your research.</h2>
        </div>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close citation"
        >
          <X size={22} />
        </button>
      </div>
      <p>{publication?.title}</p>
      <label className="sr-only" htmlFor="bibtex-value">
        BibTeX citation
      </label>
      <textarea
        id="bibtex-value"
        value={citation || ""}
        readOnly
        rows={11}
        spellCheck={false}
      />
      <div className="citation-actions">
        <button className="button button-primary" onClick={copy}>
          {status === "Citation copied." ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}{" "}
          Copy BibTeX
        </button>
        <a
          className="text-link"
          href={`data:application/x-bibtex;charset=utf-8,${encodeURIComponent(citation || "")}`}
          download={`${publication?.id || "citation"}.bib`}
        >
          Download .bib <ArrowDownToLine size={16} />
        </a>
      </div>
      <p role="status" className="copy-status">
        {status}
      </p>
    </dialog>
  );
}
