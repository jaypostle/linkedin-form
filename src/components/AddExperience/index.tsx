import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldErrors,
  // type SubmitErrorHandler,
} from "react-hook-form";
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
import type { JobExperienceType } from "./types";
import { JobSchema } from "./schema";

// add an aria-label to the form elements
// make the month and years in a fieldset wrapper
// adjust the location of the label component so it gets highlighted when there is an error too

// write two tests: user can add a current job, user can add a previous job // showing that the value of what is passed into your on submit is expected
type AddExperienceFormValues = z.infer<typeof JobSchema>;

function AddExperience({
  onSubmit,
  onCancel,
}: {
  onSubmit: (newExperience: JobExperienceType) => void;
  onCancel: () => void;
}) {
  const form = useForm<AddExperienceFormValues>({
    resolver: zodResolver(JobSchema),
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

  function onFormSubmit(values: AddExperienceFormValues) {
    console.log(values);
    onSubmit(values);
  }

  // const onError: SubmitErrorHandler<AddExperienceFormValues> = (errors) =>
  //   console.log(errors);
  function onError(errors: FieldErrors<AddExperienceFormValues>) {
    console.log(errors);
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
                    aria-label="Select start date month"
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
                  <FormMessage />
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
                    aria-label="Select start date year"
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* End date */}
        {!isCurrentWatch ? (
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
                      aria-label="Select end date month"
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
                    <FormMessage />
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
                      aria-label="Select end date year"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : (
          ""
        )}

        <Button type="submit">Save</Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Form>
  );
}

export default AddExperience;
