import type { ProfessionalLink } from "./types";
import { scholarProfileUrl } from "./publicationCategories";
// Only add confirmed profiles. Optional Scholar, GitHub, ORCID, and ResearchGate links render automatically.
export const professionalLinks: ProfessionalLink[] = [
  { label: "Google Scholar", url: scholarProfileUrl },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/abirmhadi" },
  {
    label: "NKU faculty profile",
    url: "https://www.nku.edu/our-people/profiles/informatics/sca/abir-hadi.html",
  },
];
