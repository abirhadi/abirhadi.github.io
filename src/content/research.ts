import type { ResearchId } from "./types";
export const research: {
  id: ResearchId;
  number: string;
  title: string;
  description: string;
  keywords: string[];
  question: string;
}[] = [
  {
    id: "autonomous",
    number: "01",
    title: "Autonomous & verifiable intelligent systems",
    description:
      "How can autonomous systems interpret requirements, collaborate, and produce behavior we can meaningfully check? I explore agentic AI and autonomous software engineering, with verification as a central research question.",
    keywords: ["Agentic AI", "Software verification", "Multi-agent systems"],
    question: "How do we make autonomy accountable?",
  },
  {
    id: "efficient",
    number: "02",
    title: "Efficient & adaptive machine intelligence",
    description:
      "Intelligence should adapt to both the task and the resources available. My research connects neural network compression and adaptive model complexity with the broader pursuit of learning systems that evolve over time.",
    keywords: [
      "Model compression",
      "Continual learning",
      "Efficient inference",
    ],
    question: "How much complexity does a task need?",
  },
  {
    id: "perception",
    number: "03",
    title: "Machine perception & intelligent sensing",
    description:
      "Connecting learning algorithms to physical environments through computer vision and multimodal representations. Research themes include anomaly detection, infrastructure inspection, and the interpretation of heterogeneous sensor data.",
    keywords: ["Computer vision", "Multimodal learning", "Intelligent sensing"],
    question: "What can machines learn to see?",
  },
];
