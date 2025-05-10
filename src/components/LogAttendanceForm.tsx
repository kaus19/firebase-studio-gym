"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, User, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getMembers, addAttendance, INITIAL_MEMBERS } from "@/lib/attendanceStore";

const attendanceFormSchema = z.object({
  member: z.string().min(1, { message: "Please select a member." }),
  date: z.date({
    required_error: "A date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
});

type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export const LogAttendanceForm: FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<string[]>(INITIAL_MEMBERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // getMembers is synchronous for this version, but this structure allows async in future
    setMembers(getMembers());
  }, []);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      member: members.length > 0 ? members[members.length-1] : "", // Default to "MySelf" or last member
      date: new Date(),
    },
  });

  useEffect(() => { // Update default member when members list is loaded
    if (members.length > 0 && !form.getValues("member")) {
      form.reset({ ...form.getValues(), member: members[members.length-1] });
    }
  }, [members, form]);


  const onSubmit = async (data: AttendanceFormValues) => {
    setIsLoading(true);
    try {
      addAttendance({ member: data.member, date: data.date });
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Attendance Logged!
          </div>
        ),
        description: `${data.member}'s attendance on ${format(data.date, "PPP")} has been recorded.`,
        variant: "default",
      });
      form.reset({ member: data.member, date: new Date() }); // Reset date to today, keep member
    } catch (error: any) {
       let description = "An unexpected error occurred.";
       if (error.message.includes("already logged")) {
          description = error.message;
       }
      toast({
        title: (
           <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            Logging Failed
          </div>
        ),
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                Member
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {members.map((memberName) => (
                    <SelectItem key={memberName} value={memberName}>
                      {memberName}
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Date of Attendance
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
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
                      date > new Date() || date < new Date("2000-01-01") || isLoading
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? "Logging..." : "Log Attendance"}
          {!isLoading && <CheckCircle className="ml-2 h-5 w-5" />}
        </Button>
      </form>
    </Form>
  );
};
