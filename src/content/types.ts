export type ResearchId = "autonomous" | "efficient" | "perception";
export type PublicationCategoryId =
  | "computer-vision"
  | "machine-learning"
  | "artificial-intelligence"
  | "robotics";
export type PublicationType =
  | "Journal article"
  | "Conference paper"
  | "Book chapter"
  | "Doctoral dissertation"
  | "Poster";
export interface Publication {
  id: string;
  title: string;
  year: number;
  authors?: string[];
  venue?: string;
  type: PublicationType;
  area: ResearchId;
  categories: PublicationCategoryId[];
  tags: string[];
  doi?: string;
  pdf?: string;
  pages?: string;
  volume?: string;
  issue?: string;
  articleNumber?: string;
  publisher?: string;
  url?: string;
  scholarUrl?: string;
  metadata: "verified" | "incomplete";
  sources: string[];
  featured?: boolean;
}
export interface Project {
  id: string;
  title: string;
  shortTitle: string;
  area: ResearchId;
  summary: string;
  motivation: string;
  methods: string[];
  status: "Research theme" | "Ongoing research";
  publicationIds: string[];
  link?: { label: string; url: string };
}
export interface ProfessionalLink {
  label: string;
  url: string;
}
export interface NewsItem {
  id: string;
  date: string;
  title: string;
  url?: string;
}
