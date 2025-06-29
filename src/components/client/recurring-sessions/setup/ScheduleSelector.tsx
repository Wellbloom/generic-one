// Filename: ScheduleSelector.tsx
// Role: Timezone-aware interface for setting up multiple recurring therapy sessions for clients
// Purpose: Allows clients to create flexible recurring schedules with proper timezone handling
// Integration: Used in RecurringSessionsSetup component for client schedule selection

import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit3,
  RotateCcw,
  Settings,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tailwindClasses } from "@/styles/colors";
import TimeSlotEditModal from "./TimeSlotEditModal";
import {
  getUserTimezone,
  formatTimeSlotWithTimezone,
} from "@/utils/TimezoneHelpers";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string; // "14:00" format (24-hour)
  timezone: string;
  isEnabled: boolean;
}

interface ScheduleSelectorProps {
  selectedSchedules: RecurringSchedule[];
  onSchedulesChange: (schedules: RecurringSchedule[]) => void;
  maxSchedules?: number;
  errors?: Array<{ field: string; message: string }>;
}

// Available time slots (in 24-hour format)
const TIME_SLOTS = [
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
const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedSchedules,
  onSchedulesChange,
  maxSchedules = 5,
  errors = [],
}) => {
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [newScheduleIds, setNewScheduleIds] = useState<Set<string>>(new Set());
  const [previewSessions, setPreviewSessions] = useState<
    Array<{
      date: Date;
      scheduleId: string;
      dayLabel: string;
      timeLabel: string;
    }>
  >([]);

  // Client timezone (detected once)
  const [clientTimezone] = useState<string>(getUserTimezone());

  // Create a new schedule
  const createNewSchedule = useCallback(() => {
    const newSchedule: RecurringSchedule = {
      id: `schedule-${Date.now()}`,
      dayOfWeek: 1, // Default to Monday
      timeSlot: "14:00", // Default to 2:00 PM
      timezone: clientTimezone,
      isEnabled: true,
    };

    const updatedSchedules = [...selectedSchedules, newSchedule];
    onSchedulesChange(updatedSchedules);
    setNewScheduleIds(prev => new Set([...prev, newSchedule.id]));
    setEditingSchedule(newSchedule.id);
  }, [selectedSchedules, onSchedulesChange, clientTimezone]);

  // Update a specific schedule
  const updateSchedule = useCallback(
    (scheduleId: string, updates: Partial<RecurringSchedule>) => {
      const updatedSchedules = selectedSchedules.map(schedule =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              ...updates,
              timezone: updates.timezone || schedule.timezone || clientTimezone,
            }
          : schedule
      );
      onSchedulesChange(updatedSchedules);
    },
    [selectedSchedules, onSchedulesChange, clientTimezone]
  );

  // Remove a schedule
  const removeSchedule = useCallback(
    (scheduleId: string) => {
      const updatedSchedules = selectedSchedules.filter(
        schedule => schedule.id !== scheduleId
      );
      onSchedulesChange(updatedSchedules);
      setNewScheduleIds(prev => {
        const updated = new Set(prev);
        updated.delete(scheduleId);
        return updated;
      });
      if (editingSchedule === scheduleId) {
        setEditingSchedule(null);
      }
    },
    [selectedSchedules, onSchedulesChange, editingSchedule]
  );

  // Toggle schedule enabled/disabled
  const toggleSchedule = useCallback(
    (scheduleId: string) => {
      updateSchedule(scheduleId, {
        isEnabled: !selectedSchedules.find(s => s.id === scheduleId)?.isEnabled,
      });
    },
    [selectedSchedules, updateSchedule]
  );

  // Generate preview sessions for the next 4 weeks
  useEffect(() => {
    const sessions: Array<{
      date: Date;
      scheduleId: string;
      dayLabel: string;
      timeLabel: string;
    }> = [];

    const enabledSchedules = selectedSchedules.filter(s => s.isEnabled);

    if (enabledSchedules.length === 0) {
      setPreviewSessions([]);
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 28); // Next 4 weeks

    enabledSchedules.forEach(schedule => {
      const dayLabel =
        DAYS_OF_WEEK.find(d => d.value === schedule.dayOfWeek)?.label || "";
      const timeLabel =
        TIME_SLOTS.find(t => t.value === schedule.timeSlot)?.label || "";

      // Find all occurrences of this day/time in the next 4 weeks
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (date.getDay() === schedule.dayOfWeek && date >= startDate) {
          const sessionDate = new Date(date);
          const [hours, minutes] = schedule.timeSlot.split(":").map(Number);
          sessionDate.setHours(hours, minutes, 0, 0);

          sessions.push({
            date: sessionDate,
            scheduleId: schedule.id,
            dayLabel,
            timeLabel,
          });
        }
      }
    });

    // Sort sessions by date
    sessions.sort((a, b) => a.date.getTime() - b.date.getTime());
    setPreviewSessions(sessions);
  }, [selectedSchedules]);

  // Check for conflicts (same day/time)
  const hasConflicts = useCallback(() => {
    const enabledSchedules = selectedSchedules.filter(s => s.isEnabled);
    for (let i = 0; i < enabledSchedules.length; i++) {
      for (let j = i + 1; j < enabledSchedules.length; j++) {
        if (
          enabledSchedules[i].dayOfWeek === enabledSchedules[j].dayOfWeek &&
          enabledSchedules[i].timeSlot === enabledSchedules[j].timeSlot
        ) {
          return true;
        }
      }
    }
    return false;
  }, [selectedSchedules]);

  // Group time slots by period
  const timeSlotsByPeriod = TIME_SLOTS.reduce(
    (acc, slot) => {
      if (!acc[slot.period]) {
        acc[slot.period] = [];
      }
      acc[slot.period].push(slot);
      return acc;
    },
    {} as Record<string, typeof TIME_SLOTS>
  );

  const enabledSchedulesCount = selectedSchedules.filter(
    s => s.isEnabled
  ).length;
  const scheduleErrors = errors.filter(e => e.field.startsWith("schedule"));

  return (
    <div className="space-y-6">
      {/* Timezone Information Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Session Timezone: {clientTimezone}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                All times will be scheduled in your local timezone
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Add New Button (only show when schedules exist) */}
      {selectedSchedules.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-forest">
              Your Recurring Schedule
            </h3>
            <p className="text-sm text-moss/70 mt-1">
              {enabledSchedulesCount} session
              {enabledSchedulesCount !== 1 ? "s" : ""} per week
            </p>
          </div>
          <Button
            onClick={createNewSchedule}
            disabled={selectedSchedules.length >= maxSchedules}
            className="bg-forest hover:bg-moss text-white w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Time Slot</span>
            <span className="sm:hidden">Add Slot</span>
          </Button>
        </div>
      )}

      {/* Header when no schedules exist */}
      {selectedSchedules.length === 0 && (
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-forest">
            Your Recurring Schedule
          </h3>
          <p className="text-sm text-moss/70 mt-1">
            Set up weekly recurring therapy sessions
          </p>
        </div>
      )}

      {/* Error Display */}
      {scheduleErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 dark:text-red-400">
            {scheduleErrors.map(error => error.message).join(", ")}
          </AlertDescription>
        </Alert>
      )}

      {/* Conflict Warning */}
      {hasConflicts() && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700 dark:text-orange-400">
            <strong>Schedule Conflict:</strong> You have multiple sessions
            scheduled for the same day and time. Please review your schedule.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Schedules */}
      <div className="space-y-4">
        {selectedSchedules.length === 0 ? (
          <Card className="border-2 border-dashed border-sage/30 dark:border-sage/20">
            <CardContent className="p-4 sm:p-6 text-center">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-moss/50 dark:text-moss/60 mx-auto mb-3" />
              <p className="text-moss/70 dark:text-moss/80 mb-4 text-sm sm:text-base">
                No recurring sessions scheduled
              </p>
              <Button
                onClick={createNewSchedule}
                className="bg-forest hover:bg-moss text-white w-full sm:w-auto text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Add Your First Time Slot
                </span>
                <span className="sm:hidden">Add Time Slot</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          selectedSchedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={() => setEditingSchedule(schedule.id)}
              onRemove={() => removeSchedule(schedule.id)}
              onToggle={() => toggleSchedule(schedule.id)}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      <TimeSlotEditModal
        isOpen={editingSchedule !== null}
        onClose={() => setEditingSchedule(null)}
        schedule={selectedSchedules.find(s => s.id === editingSchedule) || null}
        onUpdate={updates =>
          editingSchedule && updateSchedule(editingSchedule, updates)
        }
        onRemove={() => {
          if (editingSchedule) {
            removeSchedule(editingSchedule);
            setEditingSchedule(null);
          }
        }}
        onSave={() => {
          if (editingSchedule) {
            // Remove from newScheduleIds when saved (it's no longer new)
            setNewScheduleIds(prev => {
              const updated = new Set(prev);
              updated.delete(editingSchedule);
              return updated;
            });
            setEditingSchedule(null);
          }
        }}
        isNewSession={
          editingSchedule ? newScheduleIds.has(editingSchedule) : false
        }
      />
    </div>
  );
};

// Individual Schedule Card Component
interface ScheduleCardProps {
  schedule: RecurringSchedule;
  onEdit: () => void;
  onRemove: () => void;
  onToggle: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onEdit,
  onRemove,
  onToggle,
}) => {
  const dayLabel = DAYS_OF_WEEK.find(
    d => d.value === schedule.dayOfWeek
  )?.label;

  // Format time with timezone (client only)
  const clientTz = schedule.timezone || getUserTimezone();
  const timeDisplayClient = formatTimeSlotWithTimezone(
    schedule.timeSlot,
    clientTz,
    true
  );

  return (
    <Card
      className={`transition-all ${
        schedule.isEnabled
          ? "border-forest/30 bg-forest/5 dark:bg-forest/10"
          : "border-sage/30 bg-gray-50 dark:bg-gray-800/50 opacity-60"
      }`}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div
              className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                schedule.isEnabled
                  ? "bg-forest/10 dark:bg-forest/20"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <Calendar
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  schedule.isEnabled ? "text-forest" : "text-gray-500"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-base sm:text-lg leading-tight ${
                  schedule.isEnabled ? "text-forest" : "text-gray-500"
                }`}
              >
                {dayLabel}s at {timeDisplayClient}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${
                schedule.isEnabled
                  ? "text-forest hover:bg-forest/10"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {schedule.isEnabled ? (
                <>
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">On</span>
                </>
              ) : (
                <>
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Off</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="text-moss hover:bg-moss/10 px-2 sm:px-3"
            >
              <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 sm:px-3"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSelector;
