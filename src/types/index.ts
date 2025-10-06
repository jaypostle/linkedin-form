import type { employmentTypes } from "@/sample-data";

export type JobExperienceType = {
  title: string;
  employmentType: (typeof employmentTypes)[number];
  company: string;
  isCurrent: boolean;
  startDate: Date;
  endDate?: Date;
};
