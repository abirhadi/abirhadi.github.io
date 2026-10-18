export const courses: {
  code: string;
  title: string;
  description: string;
  semester?: string;
}[] = [
  {
    code: "CSC 364",
    title: "Data Structures and Algorithms",
    description:
      "Organizing data, reasoning about complexity, and choosing algorithms with care.",
  },
  {
    code: "ASE 230",
    title: "Server-Side Programming",
    description:
      "Building the logic, data handling, and foundations behind web applications.",
  },
  {
    code: "INF 286",
    title: "Introduction to Web Development",
    description:
      "Creating accessible, responsive experiences with the building blocks of the web.",
  },
  {
    code: "ASE 220",
    title: "Full-Stack Application Development",
    description:
      "Design and implement full-stack applications using modern technologies and framworks.",
  },
  {
    code: "CSC 392",
    title: "Topics: Natural Language Processing",
    description:
      "Understanding the evaluation of natural language processing methods.",
  },
];
// Add semester only when confirmed, e.g. semester: 'Fall 2026'. Descriptions summarize instructional areas.
