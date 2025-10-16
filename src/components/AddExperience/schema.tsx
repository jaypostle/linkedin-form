import { employmentTypes } from "@/sample-data";
import { z } from "zod";

const BaseSchema = z.object({
  job_title: z.string().min(2).max(100),
  employment_type: z.enum(employmentTypes),
  company: z.string().min(2).max(100),
  start_date: z.object({
    month: z.string().min(1, { message: "Start month is required" }),
    year: z.string().min(4, { message: "Start year is required" }),
  }),
});

const CurrentJobSchema = BaseSchema.extend({
  is_current: z.literal(true),
});

const PreviousJobSchema = BaseSchema.extend(
  z.object({
    is_current: z.literal(false),
    end_date: z.object({
      month: z.string().min(1, { message: "End month is required" }),
      year: z.string().min(4, { message: "End year is required" }),
    }),
  }).shape
).superRefine((data, ctx) => {
  // Job is Not Current
  // if (data.is_current === false) {
  // End date must be after start date
  const startDateISO = new Date(
    `${data.start_date.month} 1, ${data.start_date.year}`
  );
  const endDateISO = new Date(
    `${data.end_date.month} 1, ${data.end_date.year}`
  );
  if (startDateISO > endDateISO)
    ctx.addIssue({
      path: ["end_date", "month"],
      code: "custom",
      message: "End date must be after start date",
    });
  // }
});

export const JobSchema = z.discriminatedUnion("is_current", [
  CurrentJobSchema,
  PreviousJobSchema,
]);
