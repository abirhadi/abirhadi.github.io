import { profile } from "./profile";

export const experience = [
  {
    period: `${profile.appointmentStartYear} — Present`,
    title: profile.role,
    institution: profile.institution,
    description: `${profile.discipline} · ${profile.school}`,
  },
  {
    period: `2021 - ${String(profile.education.year)}`,
    title: profile.education.degree,
    institution: profile.education.institution,
    description:
      "Doctoral education, with graduate research and teaching experience.",
  },
  {
    period: "2025 - 2025",
    title: "Technician III - Research",
    institution: profile.education.institution,
    description: "Research and instruction in computer science.",
  },
  {
    period: "2021 - 2025",
    title: "Graduate Research & Teaching Assistant",
    institution: profile.education.institution,
    description: "Research and instruction in computer science.",
  },
  {
    period: "2019 - 2021",
    title: profile.previousEngineering.title,
    institution: profile.previousEngineering.institution,
    description: "Software research and development.",
  },
];
