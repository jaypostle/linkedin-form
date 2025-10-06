import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import { employmentTypes } from "@/sample-data";
import type { JobExperienceType } from "@/types";

function AddExperience({
  onSubmit,
  onCancel,
}: {
  onSubmit: (newExperience: JobExperienceType) => void;
  onCancel: () => void;
}) {
  const formSchema = z
    .object({
      title: z
        .string()
        .min(2, { message: "Title is a required field" })
        .max(100),
      employmentType: z.enum(employmentTypes),
      company: z
        .string()
        .min(2, { message: "Company is a required field" })
        .max(100),
      isCurrent: z.boolean(),
      startDate: z.date({ error: "Start date is a required field" }),
      endDate: z.date().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.isCurrent && !data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          code: "custom",
          message: "End date is required unless currently employed",
        });
      }
      if (data.endDate && data.startDate > data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          code: "custom",
          message: "End date must be after start date",
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      employmentType: undefined,
      company: "",
      isCurrent: false,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const formValues = form.watch();

  // watch for changes in isCurrent to clear endDate if isCurrent is true
  useEffect(() => {
    if (formValues.isCurrent) {
      form.setValue("endDate", undefined);
    }
  }, [formValues.isCurrent, form]);

  function onFormSubmit(values: z.infer<typeof formSchema>) {
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
          name="title"
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
          name="employmentType"
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
          name="isCurrent"
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
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          {/* End date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={formValues.isCurrent}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
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
