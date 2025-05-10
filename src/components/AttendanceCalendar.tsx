"use client";

import type { FC } from 'react';
import { Calendar } from "@/components/ui/calendar";
import type { AttendanceEntry, Member } from "@/types";
import { format, parseISO } from 'date-fns';

interface AttendanceCalendarProps {
  attendanceEntries: AttendanceEntry[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedMember: Member | "All";
}

export const AttendanceCalendar: FC<AttendanceCalendarProps> = ({ 
  attendanceEntries, 
  currentMonth, 
  onMonthChange,
  selectedMember
}) => {
  
  const attendedDays = attendanceEntries.map(entry => parseISO(entry.date));

  const modifiers = {
    attended: attendedDays,
  };

  const modifiersStyles = {
    attended: {
      backgroundColor: 'hsl(var(--primary))', // Teal
      color: 'hsl(var(--primary-foreground))', // Light text on teal
      borderRadius: '0.375rem', // rounded-md
    },
  };

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        month={currentMonth}
        onMonthChange={onMonthChange}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-md border shadow-sm p-4 bg-card"
        captionLayout="dropdown-buttons"
        fromYear={2020}
        toYear={new Date().getFullYear() + 1}
        fixedWeeks
        showOutsideDays
      />
    </div>
  );
};
