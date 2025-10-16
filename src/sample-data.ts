import type {
  CurrentJobExperienceType,
  PreviousJobExperienceType,
} from "./types";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 16 }, (_, i) =>
  String(currentYear - 10 + i)
);

export const employmentTypes = [
  "Self-employed",
  "Freelance",
  "Internship",
  "Apprenticeship",
  "Permanent Full-time",
] as const;
export const sampleJobExperiences: (
  | CurrentJobExperienceType
  | PreviousJobExperienceType
)[] = [
  {
    job_title: "Software Engineer",
    employment_type: "Permanent Full-time",
    company: "TechCorp Inc.",
    is_current: true,
    start_date: { month: "March", year: "2024" },
  },
  {
    job_title: "Frontend Developer",
    employment_type: "Freelance",
    company: "Creative Solutions Ltd.",
    is_current: false,
    start_date: { month: "March", year: "2024" },
    end_date: { month: "March", year: "2025" },
  },
];
