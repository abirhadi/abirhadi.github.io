import type { Project } from "./types";
// Themes are not claims of funded projects or completed outcomes. Add confirmed links as available.
export const projects: Project[] = [
  {
    id: "multi-agent",
    title: "Heterogeneous agents for autonomous software engineering",
    shortTitle: "From requirements to working software",
    area: "autonomous",
    status: "Research theme",
    summary:
      "Exploring how agents with different roles and capabilities can collaborate to generate web applications.",
    motivation:
      "Turning a natural-language requirement into reliable software involves interpretation, coordination, and evaluation. This theme examines how agent specialization and collaboration could support that process.",
    methods: [
      "Multi-agent systems",
      "Requirement interpretation",
      "Web application generation",
    ],
    publicationIds: [],
  },
  {
    id: "verification",
    title:
      "Requirements, verification, and design diversity in AI-generated software",
    shortTitle: "Asking more of generated software",
    area: "autonomous",
    status: "Research theme",
    summary:
      "Examining functional correctness and design diversity in software produced by AI systems.",
    motivation:
      "A plausible interface is only one part of a working application. This theme considers how explicit requirements and behavioral checks can help evaluate generated systems, alongside the diversity of their designs.",
    methods: [
      "Functional verification",
      "Behavioral evaluation",
      "Design diversity",
    ],
    publicationIds: [],
  },
  {
    id: "compression",
    title: "Neural network compression and efficient learning",
    shortTitle: "Learning with less",
    area: "efficient",
    status: "Research theme",
    summary:
      "Investigating the relationship between task complexity, network structure, and efficient computation.",
    motivation:
      "Resource constraints make model size consequential. Published work investigates task-dependent complexity and reinforcement learning for pruning; this theme connects those questions to adaptive learning.",
    methods: [
      "Deep reinforcement learning",
      "Structured pruning",
      "Intrinsic dimension",
    ],
    publicationIds: ["intrinsic-2024", "pruning-2023", "complexity-2022"],
  },
  {
    id: "thermal",
    title: "Thermal image-based infrastructure inspection",
    shortTitle: "Reading the physical world",
    area: "perception",
    status: "Research theme",
    summary:
      "Exploring thermal imagery and intelligent sensing for understanding infrastructure condition.",
    motivation:
      "Inspection requires interpreting observations in their physical context. This theme considers how computer vision and thermal sensing can support the analysis of infrastructure without assuming that every anomaly has the same cause.",
    methods: [
      "Thermal imaging",
      "Computer vision",
      "Infrastructure inspection",
    ],
    publicationIds: [],
  },
  {
    id: "multimodal",
    title: "Multimodal AI for anomaly detection",
    shortTitle: "Different signals. A richer picture.",
    area: "perception",
    status: "Research theme",
    summary:
      "Combining heterogeneous representations to understand anomalies in imagery.",
    motivation:
      "Different representations capture different aspects of a scene. Published work on satellite imagery provides a basis for asking how complementary information can inform anomaly classification.",
    methods: [
      "Representation learning",
      "Multimodal fusion",
      "Anomaly classification",
    ],
    publicationIds: ["multimodal-2024"],
  },
];
