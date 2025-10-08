import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { employmentTypes, months, years } from "@/sample-data";
import type { JobExperienceType } from "@/types";

// 1. Use month and year for the config date inputs, not date
// 2. add the boiler plate first, and THEN add the work in a new branch
// added form schema outside of the component so it doesn't recreate on every render
// 5. don't need to watch all the fields. can watch only a single field with watch("nameOfField")
// 3. Make the JobExperienceType  a union, so that endDate can be optional if isCurrent is true e.g. currentjob and previousjobtype

// const formSchema = z
//   .object({
//     job_title: z
//       .string()
//       .min(2, { message: "Title is a required field" })
//       .max(100),
//     employment_type: z.enum(employmentTypes),
//     company: z
//       .string()
//       .min(2, { message: "Company is a required field" })
//       .max(100),
//     is_current: z.boolean(),
//     start_date: z.object({ month: z.string(), year: z.string() }),
//     end_date: z.object({ month: z.string(), year: z.string() }).optional(),
//   })
// .superRefine((data, ctx) => {
//   if (!data.is_current && !data.end_date) {
//     ctx.addIssue({
//       path: ["end_date"],
//       code: "custom",
//       message: "End date is required unless currently employed",
//     });
//   }
//   const startDateISO = new Date(
//     `${data.start_date.month} 1, ${data.start_date.year}`
//   );

//   if (data.end_date) {
//     const endDateISO = new Date(
//       `${data.end_date.month} 1, ${data.end_date.year}`
//     );

//     if (startDateISO > endDateISO) {
//       ctx.addIssue({
//         path: ["end_date"],
//         code: "custom",
//         message: "End date must be after start date",
//       });
//     }
//   }
// });

const baseSchema = z.object({
  job_title: z.string().min(2).max(100),
  employment_type: z.enum(employmentTypes),
  company: z.string().min(2).max(100),
  start_date: z.object({ month: z.string(), year: z.string() }),
});

const currentJobSchema = baseSchema.extend({
  is_current: z.literal(true),
});

const previousJobSchema = baseSchema.extend({
  is_current: z.literal(false),
  end_date: z.object({ month: z.string(), year: z.string() }),
});

export const jobSchema = z
  .discriminatedUnion("is_current", [currentJobSchema, previousJobSchema])
  .superRefine((data, ctx) => {
    if (!data.start_date.month || !data.start_date.year) {
      ctx.addIssue({
        path: ["start_date", "month"],
        code: "custom",
        message: "Start date is required",
      });
    }
    // Job is Not Current
    if (data.is_current === false) {
      // End date is required
      if (!data.end_date.month || !data.end_date.year) {
        ctx.addIssue({
          path: ["end_date", "month"],
          code: "custom",
          message: "End date is required",
        });
      }
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
    }
  });
// Refine so that if the job is current, end date is not required but start date is.
// If job is not current, both start and end date are required and end date must be after start date

// .superRefine((data, ctx) => {
//   if (!data.is_current && !data.end_date) {
//     ctx.addIssue({
//       path: ["end_date"],
//       code: "custom",
//       message: "End date is required unless currently employed",
//     });
//   }
//   const startDateISO = new Date(
//     `${data.start_date.month} 1, ${data.start_date.year}`
//   );

//   if (data.end_date) {
//     const endDateISO = new Date(
//       `${data.end_date.month} 1, ${data.end_date.year}`
//     );

//     if (startDateISO > endDateISO) {
//       ctx.addIssue({
//         path: ["end_date"],
//         code: "custom",
//         message: "End date must be after start date",
//       });
//     }
//   }
// });

function AddExperience({
  onSubmit,
  onCancel,
}: {
  onSubmit: (newExperience: JobExperienceType) => void;
  onCancel: () => void;
}) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_title: "",
      employment_type: undefined,
      company: "",
      is_current: false,
      start_date: { month: "", year: "" },
      end_date: { month: "", year: "" },
    },
  });

  const isCurrentWatch = form.watch("is_current");

  // watch for changes in isCurrent to clear endDate if isCurrent is true
  useEffect(() => {
    if (isCurrentWatch) {
      form.setValue("end_date", { month: "", year: "" });
    }
  }, [isCurrentWatch, form]);

  function onFormSubmit(values: z.infer<typeof jobSchema>) {
    console.log(values);
    onSubmit(values);
  }

  function onError(errors: any) {
    console.error(errors);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit, onError)}
        className="flex flex-col gap-8 p-4"
      >
        {/* Job Title */}
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Employment type */}
        <FormField
          control={form.control}
          name="employment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/* Is Current */}
        <FormField
          control={form.control}
          name="is_current"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>I am currently working in this role</FormLabel>
            </FormItem>
          )}
        />
        {/* Company */}
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company or organization</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start date */}
        <div className="flex gap-2 flex-col">
          <FormLabel>Start date</FormLabel>
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="start_date.month"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date.year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* End date */}
        <div className="flex gap-2 flex-col">
          <FormLabel>End date</FormLabel>
          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="end_date.month"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {months.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date.year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Save</Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  );
}

export default AddExperience;

// <div className="flex gap-4">
//       <FormField
//         control={form.control}
//         name="startDate"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Start date</FormLabel>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <FormControl>
//                   <Button
//                     variant={"outline"}
//                     className={cn(
//                       "w-[240px] pl-3 text-left font-normal",
//                       !field.value && "text-muted-foreground"
//                     )}
//                   >
//                     {field.value ? (
//                       format(field.value, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                   </Button>
//                 </FormControl>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={field.value}
//                   onSelect={field.onChange}
//                   disabled={(date) =>
//                     date > new Date() || date < new Date("1900-01-01")
//                   }
//                   captionLayout="dropdown"
//                 />
//               </PopoverContent>
//             </Popover>
//           </FormItem>
//         )}
//       />
//       {/* End date */}
//       <FormField
//         control={form.control}
//         name="endDate"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>End date</FormLabel>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <FormControl>
//                   <Button
//                     variant={"outline"}
//                     className={cn(
//                       "w-[240px] pl-3 text-left font-normal",
//                       !field.value && "text-muted-foreground"
//                     )}
//                     disabled={isCurrentWatch}
//                   >
//                     {field.value ? (
//                       format(field.value, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                     <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                   </Button>
//                 </FormControl>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={field.value}
//                   onSelect={field.onChange}
//                   disabled={(date) =>
//                     date > new Date() || date < new Date("1900-01-01")
//                   }
//                   captionLayout="dropdown"
//                 />
//               </PopoverContent>
//             </Popover>
//           </FormItem>
//         )}
//       />
//     </div>
