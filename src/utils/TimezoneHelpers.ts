// Filename: TimezoneHelpers.ts
// Role: Comprehensive timezone management for therapy session scheduling
// Purpose: Handles timezone detection, conversion, and display for clients and therapists
// Integration: Used throughout booking and session management components

import { parseISO } from "date-fns";
import { format, toZonedTime, fromZonedTime } from "date-fns-tz";

export interface TimezoneInfo {
  timezone: string;
  abbreviation: string;
  offset: string;
  displayName: string;
}

export interface ScheduledTime {
  utcTime: string; // ISO string in UTC
  clientTimezone: string;
  therapistTimezone?: string;
  scheduledInTimezone: string; // The timezone in which it was originally scheduled
}

// Get user's current timezone
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Get timezone information with user-friendly details
export const getTimezoneInfo = (timezone: string): TimezoneInfo => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(now);
  const timeZoneName =
    parts.find(part => part.type === "timeZoneName")?.value || "";

  // Get offset
  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  });
  const offsetParts = offsetFormatter.formatToParts(now);
  const offset =
    offsetParts.find(part => part.type === "timeZoneName")?.value || "";

  // Create display name
  const cityName = timezone.split("/").pop()?.replace(/_/g, " ") || timezone;
  const displayName = `${cityName} (${timeZoneName})`;

  return {
    timezone,
    abbreviation: timeZoneName,
    offset,
    displayName,
  };
};

// Create a scheduled time object with proper timezone handling
export const createScheduledTime = (
  dateTime: Date,
  clientTimezone: string,
  therapistTimezone?: string
): ScheduledTime => {
  // Convert to UTC for storage
  const utcTime = fromZonedTime(dateTime, clientTimezone).toISOString();

  return {
    utcTime,
    clientTimezone,
    therapistTimezone,
    scheduledInTimezone: clientTimezone,
  };
};

// Convert a scheduled time to a specific timezone
export const convertScheduledTimeToTimezone = (
  scheduledTime: ScheduledTime,
  targetTimezone: string
): Date => {
  const utcDate = parseISO(scheduledTime.utcTime);
  return toZonedTime(utcDate, targetTimezone);
};

// Format time for display in a specific timezone
export const formatTimeInTimezone = (
  scheduledTime: ScheduledTime,
  targetTimezone: string,
  formatString: string = "MMM d, yyyy 'at' h:mm a"
): string => {
  const localTime = convertScheduledTimeToTimezone(
    scheduledTime,
    targetTimezone
  );
  return format(localTime, formatString, { timeZone: targetTimezone });
};

// Create a recurring schedule time slot
export const createRecurringTimeSlot = (
  dayOfWeek: number, // 0-6 (Sunday-Saturday)
  timeSlot: string, // "14:00" format
  clientTimezone: string,
  therapistTimezone?: string
) => {
  // Create a date object for the next occurrence of this day/time in the client's timezone
  const now = new Date();
  const currentDay = now.getDay();
  let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  if (daysUntilTarget === 0) daysUntilTarget = 7; // If today, schedule for next week

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntilTarget);

  // Set the time
  const [hours, minutes] = timeSlot.split(":").map(Number);
  targetDate.setHours(hours, minutes, 0, 0);

  return createScheduledTime(targetDate, clientTimezone, therapistTimezone);
};

// Get next session dates for a recurring schedule
export const getNextRecurringSessions = (
  dayOfWeek: number,
  timeSlot: string,
  clientTimezone: string,
  therapistTimezone: string,
  count: number = 8
): ScheduledTime[] => {
  const sessions: ScheduledTime[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    // Calculate the date for this occurrence
    const currentDay = now.getDay();
    let daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    if (daysUntilTarget === 0 && i === 0) daysUntilTarget = 7; // If today, start next week

    const sessionDate = new Date(now);
    sessionDate.setDate(now.getDate() + daysUntilTarget + i * 7);

    // Set the time
    const [hours, minutes] = timeSlot.split(":").map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    sessions.push(
      createScheduledTime(sessionDate, clientTimezone, therapistTimezone)
    );
  }

  return sessions;
};

// Format time slot for display with timezone
export const formatTimeSlotWithTimezone = (
  timeSlot: string,
  timezone: string,
  includeTimezone: boolean = true
): string => {
  const [hours, minutes] = timeSlot.split(":").map(Number);

  // Create a date object for formatting
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  const timeString = format(date, "h:mm a");

  if (!includeTimezone) {
    return timeString;
  }

  const timezoneInfo = getTimezoneInfo(timezone);
  return `${timeString} ${timezoneInfo.abbreviation}`;
};

// Check if client and therapist are in different timezones
export const hasTimezoneConflict = (
  clientTimezone: string,
  therapistTimezone: string
): boolean => {
  return clientTimezone !== therapistTimezone;
};

// Get timezone conflict warning message - client version (hides therapist timezone)
export const getClientTimezoneMessage = (
  scheduledTime: ScheduledTime,
  clientTimezone: string
): string | null => {
  if (
    !scheduledTime.therapistTimezone ||
    scheduledTime.clientTimezone === scheduledTime.therapistTimezone
  ) {
    return null;
  }

  const clientTime = formatTimeInTimezone(
    scheduledTime,
    scheduledTime.clientTimezone,
    "h:mm a"
  );
  const clientTz = getTimezoneInfo(scheduledTime.clientTimezone);

  // Only show client's timezone information, not therapist's
  return `Your session is scheduled for ${clientTime} (${clientTz.abbreviation}) in your local timezone.`;
};

// Get timezone conflict warning message
export const getTimezoneConflictMessage = (
  scheduledTime: ScheduledTime,
  viewerTimezone: string
): string | null => {
  if (
    !scheduledTime.therapistTimezone ||
    scheduledTime.clientTimezone === scheduledTime.therapistTimezone
  ) {
    return null;
  }

  const clientTime = formatTimeInTimezone(
    scheduledTime,
    scheduledTime.clientTimezone,
    "h:mm a"
  );
  const therapistTime = formatTimeInTimezone(
    scheduledTime,
    scheduledTime.therapistTimezone,
    "h:mm a"
  );
  const clientTz = getTimezoneInfo(scheduledTime.clientTimezone);
  const therapistTz = getTimezoneInfo(scheduledTime.therapistTimezone);

  if (viewerTimezone === scheduledTime.clientTimezone) {
    return `Your session is at ${clientTime} (${clientTz.abbreviation}). For your therapist, this is ${therapistTime} (${therapistTz.abbreviation}).`;
  } else if (viewerTimezone === scheduledTime.therapistTimezone) {
    return `Session is at ${therapistTime} (${therapistTz.abbreviation}) for you. For your client, this is ${clientTime} (${clientTz.abbreviation}).`;
  }

  return `Client: ${clientTime} (${clientTz.abbreviation}), Therapist: ${therapistTime} (${therapistTz.abbreviation})`;
};

// Common timezone list for selection
export const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "America/Toronto",
  "America/Vancouver",
];

// Get user-friendly timezone options
export const getTimezoneOptions = () => {
  return COMMON_TIMEZONES.map(tz => ({
    value: tz,
    label: getTimezoneInfo(tz).displayName,
    ...getTimezoneInfo(tz),
  }));
};

// Mock therapist timezone (in a real app, this would come from the therapist's profile)
export const getTherapistTimezone = (): string => {
  // For demo purposes, let's assume therapist is in Eastern Time
  return "America/New_York";
};
