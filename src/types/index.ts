import type { employmentTypes } from "@/sample-data";

export type JobExperience = {
  job_title: string;
  employment_type: (typeof employmentTypes)[number];
  company: string;
  start_date: { month: string; year: string };
};

export type CurrentJobExperienceType = JobExperience & {
  is_current: true;
};

export type PreviousJobExperienceType = JobExperience & {
  is_current: false;
  end_date: { month: string; year: string };
};

export type JobExperienceType =
  | CurrentJobExperienceType
  | PreviousJobExperienceType;
