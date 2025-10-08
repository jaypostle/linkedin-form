import type { employmentTypes } from "@/sample-data";

export type JobExperience = {
  job_title: string;
  employment_type: (typeof employmentTypes)[number];
  company: string;
};

export type CurrentJobExperienceType = JobExperience & {
  is_current: true;
  start_date: { month: string; year: string };
};

export type PreviousJobExperienceType = JobExperience & {
  is_current: false;
  start_date: { month: string; year: string };
  end_date: { month: string; year: string };
};

export type JobExperienceType =
  | CurrentJobExperienceType
  | PreviousJobExperienceType;
