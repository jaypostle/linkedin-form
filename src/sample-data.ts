import type { JobExperienceType } from "./types";

export const employmentTypes = [
  "Self-employed",
  "Freelance",
  "Internship",
  "Apprenticeship",
  "Permanent Full-time",
] as const;
export const sampleJobExperiences: JobExperienceType[] = [
  {
    title: "Software Engineer",
    employmentType: "Permanent Full-time",
    company: "TechCorp Inc.",
    isCurrent: true,
    startDate: new Date(2020, 5, 1),
  },
  {
    title: "Frontend Developer",
    employmentType: "Freelance",
    company: "Creative Solutions Ltd.",
    isCurrent: false,
    startDate: new Date(2018, 0, 1), // January 1, 2018
    endDate: new Date(2020, 4, 31), // May 31, 2020
  },
];
