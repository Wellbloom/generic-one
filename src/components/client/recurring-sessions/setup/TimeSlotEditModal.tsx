// Filename: TimeSlotEditModal.tsx
// Role: Timezone-aware modal for editing individual time slots
// Purpose: Provides clean interface for day/time selection with timezone management
// Integration: Used by MultiRecurringScheduleSelector for editing time slots

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  Trash2,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getUserTimezone,
  getTimezoneInfo,
  formatTimeSlotWithTimezone,
  getTherapistTimezone,
  hasTimezoneConflict,
  getTimezoneConflictMessage,
  TimezoneInfo,
} from "@/utils/TimezoneHelpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  timeSlot: string;
  timezone: string;
  isEnabled: boolean;
}

interface TimeSlotEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: RecurringSchedule | null;
  onUpdate: (updates: Partial<RecurringSchedule>) => void;
  onRemove: () => void;
  onSave: () => void;
  isNewSession?: boolean;
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

const TimeSlotEditModal: React.FC<TimeSlotEditModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onUpdate,
  onRemove,
  onSave,
  isNewSession = false,
}) => {
  // Timezone state - only client timezone needed
  const [clientTimezone, setClientTimezone] = useState<string>("");
  const [clientTzInfo, setClientTzInfo] = useState<TimezoneInfo | null>(null);
  const [localTimeSlot, setLocalTimeSlot] = useState<string>("");
  const [localTimezone, setLocalTimezone] = useState<string>("");

  useEffect(() => {
    // Get user's timezone on component mount
    const userTz = getUserTimezone();

    setClientTimezone(userTz);
    setClientTzInfo(getTimezoneInfo(userTz));
    setLocalTimezone(schedule?.timezone || userTz);
    setLocalTimeSlot(schedule?.timeSlot || "");
  }, [schedule]);

  if (!schedule) return null;

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

  const handleSave = () => {
    // Update the schedule with new values
    onUpdate({
      timeSlot: localTimeSlot,
      timezone: localTimezone,
    });
    onSave();
    onClose();
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  // Format time slots with timezone information
  const formatTimeSlotDisplay = (timeSlot: string) => {
    return formatTimeSlotWithTimezone(timeSlot, clientTimezone, true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Modify the time slot and timezone for your recurring session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Day Display */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Day</label>
            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">
                {
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][schedule.dayOfWeek]
                }
              </p>
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="time" className="text-right text-sm font-medium">
              Time
            </label>
            <div className="col-span-3">
              <Input
                id="time"
                type="time"
                value={localTimeSlot}
                onChange={e => setLocalTimeSlot(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Timezone Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="timezone"
              className="text-right text-sm font-medium"
            >
              Timezone
            </label>
            <div className="col-span-3 mt-4">
              <Select value={localTimezone} onValueChange={setLocalTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">
                    Eastern Time (EST/EDT)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CST/CDT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MST/MDT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PST/PDT)
                  </SelectItem>
                  <SelectItem value="America/Phoenix">
                    Arizona Time (MST)
                  </SelectItem>
                  <SelectItem value="America/Anchorage">
                    Alaska Time (AKST/AKDT)
                  </SelectItem>
                  <SelectItem value="Pacific/Honolulu">
                    Hawaii Time (HST)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Fixed Actions Section */}
        <div
          className={`flex items-center pt-6 border-t border-sage/30 bg-gray-50/50 dark:bg-gray-800/50 px-6 pb-6 ${
            isNewSession ? "justify-end" : "justify-between"
          }`}
        >
          {/* Delete button - only show for existing sessions */}
          {!isNewSession && (
            <Button
              variant="outline"
              onClick={handleRemove}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 transition-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Session
            </Button>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-moss/30 text-moss hover:bg-moss/10 hover:border-moss/50 px-6 py-2 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-forest hover:bg-moss text-white px-8 py-2 shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isNewSession ? "Create Recurring Session" : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotEditModal;
