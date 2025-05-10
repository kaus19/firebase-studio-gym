export interface AttendanceEntry {
  id: string; // Unique identifier for the entry
  member: string; // Name of the member
  date: string; // Date of attendance, stored as YYYY-MM-DD string
}

export type Member = string;
