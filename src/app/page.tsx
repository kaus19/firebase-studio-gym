import { LogAttendanceForm } from '@/components/LogAttendanceForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function LogAttendancePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Log Gym Session</h1>
      </div>
      <p className="text-muted-foreground">
        Record your gym attendance. Select your name, pick the date, and hit Log Attendance!
      </p>
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
          <CardDescription>Fill in the details for your gym visit.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogAttendanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
