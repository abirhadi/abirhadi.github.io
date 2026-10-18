import type { Publication } from "./content/types";
export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
export function bibtex(publication: Publication): string | undefined {
  if (
    publication.metadata !== "verified" ||
    !publication.authors?.length ||
    !publication.venue
  )
    return;
  const escape = (s: string) => s.replace(/([&%_#])/g, "\\$1");
  const citationTypes = {
    "Journal article": ["article", "journal"],
    "Conference paper": ["inproceedings", "booktitle"],
    "Book chapter": ["incollection", "booktitle"],
    "Doctoral dissertation": ["phdthesis", "school"],
    Poster: ["misc", "howpublished"],
  } as const;
  const [entryType, venueField] = citationTypes[publication.type];
  const fields = {
    title: publication.title,
    author: publication.authors
      .map((author) => {
        const words = author.split(" ");
        return `${words.pop()}, ${words.join(" ")}`;
      })
      .join(" and "),
    year: String(publication.year),
    [venueField]:
      publication.type === "Poster"
        ? `Poster presented at ${publication.venue}`
        : publication.venue,
    volume: publication.volume,
    number: publication.issue,
    pages: publication.pages?.replace("–", "--"),
    eid: publication.articleNumber,
    publisher:
      publication.type === "Doctoral dissertation"
        ? undefined
        : publication.publisher,
    doi: publication.doi,
    url: publication.doi
      ? undefined
      : publication.url || publication.scholarUrl,
  };
  return `@${entryType}{hadi-${publication.id},\n${Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `  ${key} = {${escape(value!)}},`)
    .join("\n")}\n}`;
}
