import type { AttendanceEntry } from '@/types';

const ATTENDANCE_KEY = 'fitfriend_attendance_log_v1'; // Added versioning to key
export const INITIAL_MEMBERS: string[] = ["Alex P.", "Jamie L.", "Casey B.", "Jordan M.", "MySelf"];

export const getMembers = (): string[] => {
  // For this version, members are fixed. Could be extended to allow dynamic members.
  return INITIAL_MEMBERS;
};

export const getAttendance = (): AttendanceEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedAttendance = localStorage.getItem(ATTENDANCE_KEY);
    if (storedAttendance) {
      const parsed = JSON.parse(storedAttendance) as AttendanceEntry[];
      // Basic validation
      if (Array.isArray(parsed) && parsed.every(item => typeof item.id === 'string' && typeof item.member === 'string' && typeof item.date === 'string')) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error reading attendance from localStorage:", error);
  }
  return [];
};

export const addAttendance = (entryData: { member: string; date: Date }): AttendanceEntry => {
  if (typeof window === 'undefined') {
    // Should not be called server-side, but good to have a guard
    console.warn("addAttendance called on server. This entry will not be persisted.");
    // Return a non-persisted entry for type consistency if absolutely needed
    return { ...entryData, date: entryData.date.toISOString().split('T')[0], id: `server-${Date.now()}` };
  }

  const currentAttendance = getAttendance();
  const newEntry: AttendanceEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    member: entryData.member,
    date: entryData.date.toISOString().split('T')[0], // Store as YYYY-MM-DD
  };

  // Prevent duplicate entries for the same member on the same day
  const exists = currentAttendance.find(
    (e) => e.member === newEntry.member && e.date === newEntry.date
  );
  if (exists) {
    // Or, update existing? For now, prevent duplicate.
    console.warn("Attendance already logged for this member on this date.");
    // throw new Error("Attendance already logged for this member on this date."); // Or use toast
    return exists; // return existing entry
  }
  
  const updatedAttendance = [...currentAttendance, newEntry];
  
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updatedAttendance));
  } catch (error) {
    console.error("Error saving attendance to localStorage:", error);
    // Potentially handle quota exceeded error
    throw error; // Re-throw to be caught by caller
  }
  return newEntry;
};

export const removeAttendance = (entryId: string): void => {
  if (typeof window === 'undefined') return;
  const currentAttendance = getAttendance();
  const updatedAttendance = currentAttendance.filter(entry => entry.id !== entryId);
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updatedAttendance));
  } catch (error) {
    console.error("Error updating attendance in localStorage after removal:", error);
  }
};

export const clearAllAttendance = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ATTENDANCE_KEY);
  } catch (error) {
    console.error("Error clearing attendance from localStorage:", error);
  }
};
