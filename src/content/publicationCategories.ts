import type { PublicationCategoryId, PublicationType } from "./types";

export const scholarProfileUrl =
  "https://scholar.google.com/citations?hl=en&user=0jyh-ugAAAAJ&view_op=list_works&sortby=pubdate";
export const publicationsCheckedOn = "2026-10-18";

// These labels match the profile's research interests. Per-work membership is
// an editorial classification by subject; Scholar does not categorize each work.
export const publicationCategories: {
  id: PublicationCategoryId;
  label: string;
}[] = [
  { id: "computer-vision", label: "Computer Vision" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "artificial-intelligence", label: "Artificial Intelligence" },
  { id: "robotics", label: "Robotics" },
];

export const publicationTypeLabels: Record<PublicationType, string> = {
  "Journal article": "JOURNAL",
  "Conference paper": "CONFERENCE",
  "Book chapter": "BOOK CHAPTER",
  "Doctoral dissertation": "DISSERTATION",
  Poster: "POSTER",
};

export function scholarCitationUrl(citationId: string) {
  const url = new URL(scholarProfileUrl);
  url.searchParams.set("view_op", "view_citation");
  url.searchParams.set(
    "citation_for_view",
    `${url.searchParams.get("user")}:${citationId}`,
  );
  url.searchParams.delete("sortby");
  return url.href;
}
