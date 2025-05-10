"use client";

import type { FC } from 'react';
import { useMemo } from 'react';
import type { AttendanceEntry, Member } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { isSameMonth, parseISO, format } from 'date-fns';

interface AttendanceSummaryProps {
  attendanceEntries: AttendanceEntry[];
  members: Member[];
  selectedMember: Member | "All";
  currentMonth: Date;
}

interface MemberSummary {
  name: Member;
  currentMonthCount: number;
  totalCount: number;
}

export const AttendanceSummary: FC<AttendanceSummaryProps> = ({ attendanceEntries, members, selectedMember, currentMonth }) => {
  const summaryData = useMemo(() => {
    const memberMap: Record<Member, MemberSummary> = {};

    members.forEach(member => {
      memberMap[member] = { name: member, currentMonthCount: 0, totalCount: 0 };
    });

    attendanceEntries.forEach(entry => {
      if (memberMap[entry.member]) {
        memberMap[entry.member].totalCount++;
        if (isSameMonth(parseISO(entry.date), currentMonth)) {
          memberMap[entry.member].currentMonthCount++;
        }
      }
    });
    
    if (selectedMember !== "All" && memberMap[selectedMember]) {
        return [memberMap[selectedMember]];
    }

    return Object.values(memberMap).sort((a, b) => b.totalCount - a.totalCount);

  }, [attendanceEntries, members, selectedMember, currentMonth]);

  if (summaryData.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No attendance data available for the current selection.</p>;
  }

  const monthName = format(currentMonth, "MMMM yyyy");

  return (
    <Table>
      <TableCaption>
        {selectedMember === "All" 
          ? `Summary of gym visits for all members.`
          : `Summary of gym visits for ${selectedMember}.`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Member</TableHead>
          <TableHead className="text-right">Visits ({monthName})</TableHead>
          <TableHead className="text-right">Total Visits (All Time)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summaryData.map((summary) => (
          <TableRow key={summary.name} className="hover:bg-muted/50">
            <TableCell className="font-medium">{summary.name}</TableCell>
            <TableCell className="text-right">{summary.currentMonthCount}</TableCell>
            <TableCell className="text-right">{summary.totalCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
