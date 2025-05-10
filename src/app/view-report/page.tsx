"use client";

import { useEffect, useState, useMemo } from 'react';
import { AttendanceCalendar } from '@/components/AttendanceCalendar';
import { AttendanceSummary } from '@/components/AttendanceSummary';
import type { AttendanceEntry, Member } from '@/types';
import { getAttendance, getMembers, INITIAL_MEMBERS } from '@/lib/attendanceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChartHorizontalBig, Users, CalendarDaysIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ViewReportPage() {
  const [allAttendance, setAllAttendance] = useState<AttendanceEntry[]>([]);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<Member | 'All'>('All');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setAllAttendance(getAttendance());
    setMembers(getMembers());
    setIsLoading(false);
  }, []);

  const filteredAttendance = useMemo(() => {
    return allAttendance.filter(entry => 
      selectedMember === 'All' || entry.member === selectedMember
    );
  }, [allAttendance, selectedMember]);

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all attendance data? This action cannot be undone.")) {
      localStorage.removeItem('fitfriend_attendance_log_v1'); // Direct key for safety
      setAllAttendance([]);
      alert("All attendance data has been cleared.");
    }
  };


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-3">
          <BarChartHorizontalBig className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight">Loading Attendance Report...</h1>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Filters...</CardTitle>
          </CardHeader>
          <CardContent className="h-20 bg-muted animate-pulse rounded-md"></CardContent>
        </Card>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Calendar...</CardTitle>
          </CardHeader>
          <CardContent className="h-64 bg-muted animate-pulse rounded-md"></CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Summary...</CardTitle>
          </CardHeader>
          <CardContent className="h-40 bg-muted animate-pulse rounded-md"></CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <BarChartHorizontalBig className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Attendance Report</h1>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Users className="h-5 w-5 text-muted-foreground hidden sm:block" />
          <Select value={selectedMember} onValueChange={(value) => setSelectedMember(value as Member | 'All')}>
            <SelectTrigger className="w-full sm:w-[180px] shadow-sm">
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Members</SelectItem>
              {members.map(member => (
                <SelectItem key={member} value={member}>{member}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
       <p className="text-muted-foreground">
        Visualize gym attendance patterns. Select a member to filter the calendar and summary, or view combined data for all members.
      </p>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-6 w-6 text-primary"/>
            <CardTitle>Attendance Calendar</CardTitle>
          </div>
          <CardDescription>
            Days with logged attendance are highlighted. Current view: {selectedMember === 'All' ? 'All Members' : selectedMember}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceCalendar 
            attendanceEntries={filteredAttendance} 
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            selectedMember={selectedMember}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-2">
             <Users className="h-6 w-6 text-primary"/>
            <CardTitle>Attendance Summary</CardTitle>
          </div>
          <CardDescription>
            Total gym visits for {selectedMember === 'All' ? 'each member' : selectedMember}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceSummary 
            attendanceEntries={allAttendance} // Summary always gets all data to show totals for everyone if "All" selected
            members={members}
            selectedMember={selectedMember}
            currentMonth={currentMonth} 
          />
        </CardContent>
      </Card>

      <Separator />
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            This action will permanently delete all stored attendance data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearData}>
            Clear All Attendance Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
