// Filename: RecurringScheduleSelector.tsx
// Role: Interactive calendar component for selecting recurring session schedule
// Purpose: Allows users to choose day of week, time slot, and frequency for Pay-as-You-Go sessions
// Integration: Used in PayAsYouGoSetup component for schedule selection step

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tailwindClasses } from "@/styles/colors";

interface RecurringSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string; // "14:00" format (24-hour)
  frequency: "weekly" | "biweekly" | "monthly";
  timezone: string;
}

interface RecurringScheduleSelectorProps {
  selectedSchedule: Partial<RecurringSchedule> | null;
  onScheduleChange: (schedule: Partial<RecurringSchedule>) => void;
  errors?: Array<{ field: string; message: string }>;
}

const RecurringScheduleSelector: React.FC<RecurringScheduleSelectorProps> = ({
  selectedSchedule,
  onScheduleChange,
  errors = [],
}) => {
  // Available time slots (in 24-hour format)
  const timeSlots = [
    { value: "09:00", label: "9:00 AM", period: "Morning" },
    { value: "10:00", label: "10:00 AM", period: "Morning" },
    { value: "11:00", label: "11:00 AM", period: "Morning" },
    { value: "12:00", label: "12:00 PM", period: "Afternoon" },
    { value: "13:00", label: "1:00 PM", period: "Afternoon" },
    { value: "14:00", label: "2:00 PM", period: "Afternoon" },
    { value: "15:00", label: "3:00 PM", period: "Afternoon" },
    { value: "16:00", label: "4:00 PM", period: "Afternoon" },
    { value: "17:00", label: "5:00 PM", period: "Evening" },
    { value: "18:00", label: "6:00 PM", period: "Evening" },
    { value: "19:00", label: "7:00 PM", period: "Evening" },
  ];

  // Days of the week
  const daysOfWeek = [
    { value: 0, label: "Sunday", short: "Sun" },
    { value: 1, label: "Monday", short: "Mon" },
    { value: 2, label: "Tuesday", short: "Tue" },
    { value: 3, label: "Wednesday", short: "Wed" },
    { value: 4, label: "Thursday", short: "Thu" },
    { value: 5, label: "Friday", short: "Fri" },
    { value: 6, label: "Saturday", short: "Sat" },
  ];

  // Frequency options
  const frequencyOptions = [
    {
      value: "weekly",
      label: "Weekly",
      description: "Same day and time every week",
      recommended: true,
    },
    {
      value: "biweekly",
      label: "Bi-weekly",
      description: "Every other week",
      recommended: false,
    },
    {
      value: "monthly",
      label: "Monthly",
      description: "Once per month",
      recommended: false,
    },
  ];

  // Local state for preview
  const [previewSessions, setPreviewSessions] = useState<Date[]>([]);
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());

  // Update schedule
  const updateSchedule = (updates: Partial<RecurringSchedule>) => {
    const newSchedule = {
      ...selectedSchedule,
      ...updates,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    onScheduleChange(newSchedule);
  };

  // Generate preview sessions
  useEffect(() => {
    if (
      selectedSchedule?.dayOfWeek !== undefined &&
      selectedSchedule?.frequency &&
      selectedSchedule?.timeSlot
    ) {
      generatePreviewSessions();
    }
  }, [selectedSchedule]);

  const generatePreviewSessions = () => {
    if (
      !selectedSchedule?.dayOfWeek === undefined ||
      !selectedSchedule?.frequency ||
      !selectedSchedule?.timeSlot
    ) {
      return;
    }

    const sessions: Date[] = [];
    const startDate = new Date();
    const numberOfSessions = 8; // Show next 8 sessions

    for (let i = 0; i < numberOfSessions; i++) {
      const sessionDate = getNextSessionDate(
        startDate,
        selectedSchedule as RecurringSchedule,
        i
      );
      sessions.push(sessionDate);
    }

    setPreviewSessions(sessions);
  };

  const getNextSessionDate = (
    startDate: Date,
    schedule: RecurringSchedule,
    sessionIndex: number
  ): Date => {
    const date = new Date(startDate);

    // Find the next occurrence of the specified day of week
    const daysUntilTarget = (schedule.dayOfWeek - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysUntilTarget);

    // Apply frequency multiplier
    switch (schedule.frequency) {
      case "weekly":
        date.setDate(date.getDate() + sessionIndex * 7);
        break;
      case "biweekly":
        date.setDate(date.getDate() + sessionIndex * 14);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + sessionIndex);
        break;
    }

    // Set the time
    const [hours, minutes] = schedule.timeSlot.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);

    return date;
  };

  // Group time slots by period
  const timeSlotsByPeriod = timeSlots.reduce(
    (acc, slot) => {
      if (!acc[slot.period]) {
        acc[slot.period] = [];
      }
      acc[slot.period].push(slot);
      return acc;
    },
    {} as Record<string, typeof timeSlots>
  );

  // Check if current selection is valid
  const isSelectionComplete =
    selectedSchedule?.dayOfWeek !== undefined &&
    selectedSchedule?.timeSlot &&
    selectedSchedule?.frequency;

  // Get error messages
  const scheduleErrors = errors.filter(e => e.field.startsWith("schedule"));

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {scheduleErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            {scheduleErrors.map(error => error.message).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Day Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-forest">
            <Calendar className="h-5 w-5" />
            <span>Choose Your Day</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-moss/70 dark:text-moss/80 text-sm mb-4">
            Select the day of the week for your recurring sessions
          </p>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map(day => (
              <Button
                key={day.value}
                variant={
                  selectedSchedule?.dayOfWeek === day.value
                    ? "default"
                    : "outline"
                }
                className={`p-4 h-auto flex flex-col items-center space-y-1 ${
                  selectedSchedule?.dayOfWeek === day.value
                    ? "bg-forest hover:bg-moss text-white"
                    : "border-sage/30 hover:bg-sage/10"
                }`}
                onClick={() => updateSchedule({ dayOfWeek: day.value })}
              >
                <span className="text-xs font-medium">{day.short}</span>
                <span className="text-xs opacity-80">{day.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-forest">
            <Clock className="h-5 w-5" />
            <span>Choose Your Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-moss/70 dark:text-moss/80 text-sm mb-4">
            Select your preferred time slot
          </p>
          <div className="space-y-4">
            {Object.entries(timeSlotsByPeriod).map(([period, slots]) => (
              <div key={period}>
                <h4 className="font-medium text-forest mb-2">{period}</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <Button
                      key={slot.value}
                      variant={
                        selectedSchedule?.timeSlot === slot.value
                          ? "default"
                          : "outline"
                      }
                      className={`${
                        selectedSchedule?.timeSlot === slot.value
                          ? "bg-forest hover:bg-moss text-white"
                          : "border-sage/30 hover:bg-sage/10"
                      }`}
                      onClick={() => updateSchedule({ timeSlot: slot.value })}
                    >
                      {slot.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-forest">
            <RefreshCw className="h-5 w-5" />
            <span>Choose Frequency</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-moss/70 dark:text-moss/80 text-sm mb-4">
            How often would you like your sessions?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {frequencyOptions.map(option => (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all border-2 ${
                  selectedSchedule?.frequency === option.value
                    ? "border-forest bg-forest/5 dark:bg-forest/10"
                    : "border-sage/30 hover:border-sage/50"
                }`}
                onClick={() =>
                  updateSchedule({ frequency: option.value as any })
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-forest">{option.label}</h4>
                    {option.recommended && (
                      <Badge className="bg-forest/10 text-forest border-forest/20">
                        Recommended
                      </Badge>
                    )}
                    {selectedSchedule?.frequency === option.value && (
                      <CheckCircle className="h-5 w-5 text-forest" />
                    )}
                  </div>
                  <p className="text-sm text-moss/70">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Preview */}
      {isSelectionComplete && previewSessions.length > 0 && (
        <Card className="bg-gradient-to-r from-sage/10 to-sage/5 border-sage/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-forest">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Your Schedule Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-forest/10 dark:bg-forest/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p className="font-medium text-forest">
                    {
                      daysOfWeek.find(
                        d => d.value === selectedSchedule?.dayOfWeek
                      )?.label
                    }
                    s at{" "}
                    {
                      timeSlots.find(
                        t => t.value === selectedSchedule?.timeSlot
                      )?.label
                    }
                  </p>
                  <p className="text-sm text-moss/70">
                    {
                      frequencyOptions.find(
                        f => f.value === selectedSchedule?.frequency
                      )?.label
                    }{" "}
                    sessions
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-forest mb-3">
                  Next 8 Sessions:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {previewSessions.slice(0, 8).map((session, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white dark:bg-gray-800 rounded border border-sage/20 text-center"
                    >
                      <p className="text-xs font-medium text-forest">
                        {session.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-moss/70">
                        {session.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  <strong>Payment Schedule:</strong> You'll be charged
                  automatically 48 hours before each session. You can modify or
                  pause your schedule at any time.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {!isSelectionComplete && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Complete Your Selection
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Please choose a day, time, and frequency to continue.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecurringScheduleSelector;
