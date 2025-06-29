// Filename: AvailabilityManager.tsx
// Role: Enhanced availability management for therapist scheduling
// Purpose: Manages weekly schedules, recurring blocked periods, and timezone-aware availability
// Integration: Used in AdminDashboard for comprehensive schedule management

import { useState } from "react";
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Save,
  Globe,
  Repeat,
  X,
  AlertCircle,
  Settings,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface RecurringBlockedPeriod {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  recurrenceType: "daily" | "weekly" | "monthly" | "annually";
  daysOfWeek?: number[]; // For weekly recurrence (0=Sunday, 1=Monday, etc.)
  dayOfMonth?: number; // For monthly recurrence
  monthAndDay?: { month: number; day: number }; // For annual recurrence
  startDate: string;
  endDate?: string; // Optional - can be indefinite
  isIndefinite: boolean;
  timezone: string;
  isActive: boolean;
  reason: string;
  color: string;
}

interface OneTimeBlockedPeriod {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  timezone: string;
  reason: string;
  color: string;
}

// Common timezone options
const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time (MST)" },
  { value: "America/Anchorage", label: "Alaska Time (AKST)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
  { value: "UTC", label: "UTC" },
];

// Color options for blocked periods
const COLOR_OPTIONS = [
  { value: "#ef4444", label: "Red", class: "bg-red-500" },
  { value: "#f97316", label: "Orange", class: "bg-orange-500" },
  { value: "#eab308", label: "Yellow", class: "bg-yellow-500" },
  { value: "#22c55e", label: "Green", class: "bg-green-500" },
  { value: "#3b82f6", label: "Blue", class: "bg-blue-500" },
  { value: "#8b5cf6", label: "Purple", class: "bg-purple-500" },
  { value: "#ec4899", label: "Pink", class: "bg-pink-500" },
  { value: "#6b7280", label: "Gray", class: "bg-gray-500" },
];

// Predefined recurring block templates
const RECURRING_TEMPLATES = [
  {
    title: "Lunch Break",
    description: "Daily lunch break",
    startTime: "12:00",
    endTime: "13:00",
    recurrenceType: "daily" as const,
    reason: "Meal break",
    color: "#22c55e",
  },
  {
    title: "Morning Break",
    description: "Daily morning break",
    startTime: "10:30",
    endTime: "10:45",
    recurrenceType: "daily" as const,
    reason: "Break time",
    color: "#3b82f6",
  },
  {
    title: "Personal Time",
    description: "Personal time block for self-care",
    startTime: "08:00",
    endTime: "09:00",
    recurrenceType: "daily" as const,
    reason: "Personal wellness",
    color: "#8b5cf6",
  },
  {
    title: "Administrative Work",
    description: "Weekly time for admin tasks and notes",
    startTime: "16:00",
    endTime: "17:00",
    recurrenceType: "weekly" as const,
    daysOfWeek: [5], // Friday
    reason: "Administrative duties",
    color: "#f97316",
  },
];

const AvailabilityManager = () => {
  // Current timezone for the therapist
  const [therapistTimezone, setTherapistTimezone] =
    useState("America/New_York");

  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState<TimeSlot[]>([
    {
      id: "1",
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      id: "2",
      day: "Tuesday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      id: "3",
      day: "Wednesday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      id: "4",
      day: "Thursday",
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
    },
    {
      id: "5",
      day: "Friday",
      startTime: "09:00",
      endTime: "15:00",
      isAvailable: true,
    },
    {
      id: "6",
      day: "Saturday",
      startTime: "",
      endTime: "",
      isAvailable: false,
    },
    { id: "7", day: "Sunday", startTime: "", endTime: "", isAvailable: false },
  ]);

  // Blocked periods state
  const [recurringBlockedPeriods, setRecurringBlockedPeriods] = useState<
    RecurringBlockedPeriod[]
  >([
    {
      id: "1",
      title: "Lunch Break",
      description: "Daily lunch break",
      startTime: "12:00",
      endTime: "13:00",
      recurrenceType: "daily",
      startDate: "2025-01-01",
      isIndefinite: true,
      timezone: "America/New_York",
      isActive: true,
      reason: "Meal break",
      color: "#22c55e",
    },
  ]);

  const [oneTimeBlockedPeriods, setOneTimeBlockedPeriods] = useState<
    OneTimeBlockedPeriod[]
  >([
    {
      id: "1",
      title: "Summer Vacation",
      description: "Annual summer vacation",
      startDate: "2025-07-15",
      endDate: "2025-07-29",
      isAllDay: true,
      timezone: "America/New_York",
      reason: "Personal vacation time",
      color: "#ef4444",
    },
  ]);

  // Modal states
  const [showAddRecurringBlock, setShowAddRecurringBlock] = useState(false);
  const [showAddOneTimeBlock, setShowAddOneTimeBlock] = useState(false);

  // Form states
  const [newRecurringBlock, setNewRecurringBlock] = useState<
    Partial<RecurringBlockedPeriod>
  >({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    recurrenceType: "daily",
    daysOfWeek: [],
    startDate: new Date().toISOString().split("T")[0],
    isIndefinite: true,
    timezone: therapistTimezone,
    isActive: true,
    reason: "",
    color: "#3b82f6",
  });

  const [newOneTimeBlock, setNewOneTimeBlock] = useState<
    Partial<OneTimeBlockedPeriod>
  >({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    isAllDay: false,
    timezone: therapistTimezone,
    reason: "",
    color: "#ef4444",
  });

  // Helper functions
  const formatRecurrenceText = (period: RecurringBlockedPeriod) => {
    switch (period.recurrenceType) {
      case "daily":
        return "Every day";
      case "weekly":
        if (period.daysOfWeek && period.daysOfWeek.length > 0) {
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return `Every ${period.daysOfWeek.map(d => dayNames[d]).join(", ")}`;
        }
        return "Weekly";
      case "monthly":
        return period.dayOfMonth
          ? `Monthly on day ${period.dayOfMonth}`
          : "Monthly";
      case "annually":
        return period.monthAndDay
          ? `Annually on ${period.monthAndDay.month}/${period.monthAndDay.day}`
          : "Annually";
      default:
        return "Custom";
    }
  };

  const getCurrentTimezoneTime = () => {
    return new Date().toLocaleString("en-US", {
      timeZone: therapistTimezone,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  // Event handlers
  const handleScheduleChange = (
    dayId: string,
    field: "startTime" | "endTime" | "isAvailable",
    value: string | boolean
  ) => {
    setWeeklySchedule(prev =>
      prev.map(slot => (slot.id === dayId ? { ...slot, [field]: value } : slot))
    );
  };

  const handleApplyTemplate = (template: (typeof RECURRING_TEMPLATES)[0]) => {
    setNewRecurringBlock({
      ...newRecurringBlock,
      ...template,
      timezone: therapistTimezone,
      startDate: new Date().toISOString().split("T")[0],
      isIndefinite: true,
      isActive: true,
    });
  };

  const handleAddRecurringBlock = () => {
    if (
      newRecurringBlock.title &&
      newRecurringBlock.startTime &&
      newRecurringBlock.endTime
    ) {
      const period: RecurringBlockedPeriod = {
        id: Date.now().toString(),
        title: newRecurringBlock.title!,
        description: newRecurringBlock.description || "",
        startTime: newRecurringBlock.startTime!,
        endTime: newRecurringBlock.endTime!,
        recurrenceType: newRecurringBlock.recurrenceType!,
        daysOfWeek: newRecurringBlock.daysOfWeek,
        dayOfMonth: newRecurringBlock.dayOfMonth,
        monthAndDay: newRecurringBlock.monthAndDay,
        startDate: newRecurringBlock.startDate!,
        endDate: newRecurringBlock.isIndefinite
          ? undefined
          : newRecurringBlock.endDate,
        isIndefinite: newRecurringBlock.isIndefinite!,
        timezone: newRecurringBlock.timezone!,
        isActive: newRecurringBlock.isActive!,
        reason: newRecurringBlock.reason || "",
        color: newRecurringBlock.color!,
      };

      setRecurringBlockedPeriods(prev => [...prev, period]);
      setNewRecurringBlock({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        recurrenceType: "daily",
        daysOfWeek: [],
        startDate: new Date().toISOString().split("T")[0],
        isIndefinite: true,
        timezone: therapistTimezone,
        isActive: true,
        reason: "",
        color: "#3b82f6",
      });
      setShowAddRecurringBlock(false);
    }
  };

  const handleAddOneTimeBlock = () => {
    if (
      newOneTimeBlock.title &&
      newOneTimeBlock.startDate &&
      newOneTimeBlock.endDate
    ) {
      const period: OneTimeBlockedPeriod = {
        id: Date.now().toString(),
        title: newOneTimeBlock.title!,
        description: newOneTimeBlock.description || "",
        startDate: newOneTimeBlock.startDate!,
        endDate: newOneTimeBlock.endDate!,
        startTime: newOneTimeBlock.isAllDay
          ? undefined
          : newOneTimeBlock.startTime,
        endTime: newOneTimeBlock.isAllDay ? undefined : newOneTimeBlock.endTime,
        isAllDay: newOneTimeBlock.isAllDay!,
        timezone: newOneTimeBlock.timezone!,
        reason: newOneTimeBlock.reason || "",
        color: newOneTimeBlock.color!,
      };

      setOneTimeBlockedPeriods(prev => [...prev, period]);
      setNewOneTimeBlock({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        isAllDay: false,
        timezone: therapistTimezone,
        reason: "",
        color: "#ef4444",
      });
      setShowAddOneTimeBlock(false);
    }
  };

  const handleRemoveRecurringBlock = (id: string) => {
    setRecurringBlockedPeriods(prev => prev.filter(period => period.id !== id));
  };

  const handleRemoveOneTimeBlock = (id: string) => {
    setOneTimeBlockedPeriods(prev => prev.filter(period => period.id !== id));
  };

  const handleToggleRecurringBlock = (id: string) => {
    setRecurringBlockedPeriods(prev =>
      prev.map(period =>
        period.id === id ? { ...period, isActive: !period.isActive } : period
      )
    );
  };

  const handleSaveSchedule = () => {
    console.log("Saving schedule:", {
      weeklySchedule,
      recurringBlockedPeriods,
      oneTimeBlockedPeriods,
      therapistTimezone,
    });
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-forest">
            Availability Settings
          </h2>
          <p className="text-moss/70 dark:text-moss/80">
            Manage your available time slots and blocked periods
          </p>
        </div>

        <Button
          onClick={handleSaveSchedule}
          className="bg-forest hover:bg-moss"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Timezone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-forest" />
            <span>Timezone Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="timezone">Primary Timezone</Label>
              <Select
                value={therapistTimezone}
                onValueChange={setTherapistTimezone}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-moss/70">
              <Clock className="h-4 w-4" />
              <span>Current time: {getCurrentTimezoneTime()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-forest" />
            <span>Weekly Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklySchedule.map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between p-4 border border-sage/20 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="font-medium text-forest">{slot.day}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={slot.isAvailable}
                      onCheckedChange={checked =>
                        handleScheduleChange(
                          slot.id,
                          "isAvailable",
                          checked as boolean
                        )
                      }
                    />
                    <span className="text-sm text-moss/70">Available</span>
                  </div>
                </div>

                {slot.isAvailable && (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={e =>
                        handleScheduleChange(
                          slot.id,
                          "startTime",
                          e.target.value
                        )
                      }
                      className="w-32"
                    />
                    <span className="text-moss/50">to</span>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={e =>
                        handleScheduleChange(slot.id, "endTime", e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recurring Blocked Periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Repeat className="h-5 w-5 text-forest" />
              <span>Recurring Blocked Periods</span>
            </CardTitle>
            <Button
              onClick={() => setShowAddRecurringBlock(true)}
              className="bg-forest hover:bg-moss"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recurring Block
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recurringBlockedPeriods.map(period => (
              <div
                key={period.id}
                className="flex items-center justify-between p-4 border border-sage/20 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: period.color }}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-forest">
                        {period.title}
                      </span>
                      <Badge
                        variant={period.isActive ? "default" : "secondary"}
                      >
                        {period.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-sm text-moss/70">
                      {period.startTime} - {period.endTime} •{" "}
                      {formatRecurrenceText(period)}
                      {period.isIndefinite
                        ? " • Indefinite"
                        : ` • Until ${period.endDate}`}
                    </div>
                    {period.description && (
                      <div className="text-xs text-moss/50 mt-1">
                        {period.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRecurringBlock(period.id)}
                  >
                    {period.isActive ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveRecurringBlock(period.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {recurringBlockedPeriods.length === 0 && (
              <div className="text-center py-8 text-moss/50">
                No recurring blocked periods set up
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* One-Time Blocked Periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-forest" />
              <span>One-Time Blocked Periods</span>
            </CardTitle>
            <Button
              onClick={() => setShowAddOneTimeBlock(true)}
              className="bg-forest hover:bg-moss"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add One-Time Block
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {oneTimeBlockedPeriods.map(period => (
              <div
                key={period.id}
                className="flex items-center justify-between p-4 border border-sage/20 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: period.color }}
                  />
                  <div>
                    <span className="font-medium text-forest">
                      {period.title}
                    </span>
                    <div className="text-sm text-moss/70">
                      {period.startDate} to {period.endDate}
                      {!period.isAllDay &&
                        period.startTime &&
                        period.endTime && (
                          <span>
                            {" "}
                            • {period.startTime} - {period.endTime}
                          </span>
                        )}
                      {period.isAllDay && <span> • All day</span>}
                    </div>
                    {period.description && (
                      <div className="text-xs text-moss/50 mt-1">
                        {period.description}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveOneTimeBlock(period.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {oneTimeBlockedPeriods.length === 0 && (
              <div className="text-center py-8 text-moss/50">
                No one-time blocked periods set up
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Recurring Block Modal */}
      <Dialog
        open={showAddRecurringBlock}
        onOpenChange={setShowAddRecurringBlock}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Recurring Blocked Period</DialogTitle>
            <DialogDescription>
              Set up a recurring time block that repeats on a schedule (like
              lunch breaks, meetings, etc.)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Templates */}
            <div>
              <Label className="text-base font-medium">Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {RECURRING_TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleApplyTemplate(template)}
                    className="justify-start"
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: template.color }}
                    />
                    {template.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newRecurringBlock.title || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., Lunch Break"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={newRecurringBlock.reason || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="e.g., Meal break"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRecurringBlock.description || ""}
                onChange={e =>
                  setNewRecurringBlock(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
                rows={2}
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newRecurringBlock.startTime || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newRecurringBlock.endTime || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <Label htmlFor="recurrenceType">Recurrence Pattern *</Label>
              <Select
                value={newRecurringBlock.recurrenceType}
                onValueChange={(value: any) =>
                  setNewRecurringBlock(prev => ({
                    ...prev,
                    recurrenceType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weekly Days Selection */}
            {newRecurringBlock.recurrenceType === "weekly" && (
              <div>
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day, index) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        checked={
                          newRecurringBlock.daysOfWeek?.includes(index) || false
                        }
                        onCheckedChange={checked => {
                          if (checked) {
                            setNewRecurringBlock(prev => ({
                              ...prev,
                              daysOfWeek: [...(prev.daysOfWeek || []), index],
                            }));
                          } else {
                            setNewRecurringBlock(prev => ({
                              ...prev,
                              daysOfWeek: (prev.daysOfWeek || []).filter(
                                d => d !== index
                              ),
                            }));
                          }
                        }}
                      />
                      <Label className="text-sm">{day.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Day Selection */}
            {newRecurringBlock.recurrenceType === "monthly" && (
              <div>
                <Label htmlFor="dayOfMonth">Day of Month</Label>
                <Input
                  id="dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={newRecurringBlock.dayOfMonth || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      dayOfMonth: parseInt(e.target.value),
                    }))
                  }
                  placeholder="e.g., 15 for 15th of each month"
                />
              </div>
            )}

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newRecurringBlock.startDate || ""}
                  onChange={e =>
                    setNewRecurringBlock(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    checked={newRecurringBlock.isIndefinite || false}
                    onCheckedChange={checked =>
                      setNewRecurringBlock(prev => ({
                        ...prev,
                        isIndefinite: checked as boolean,
                      }))
                    }
                  />
                  <Label>Indefinite (no end date)</Label>
                </div>
                {!newRecurringBlock.isIndefinite && (
                  <>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newRecurringBlock.endDate || ""}
                      onChange={e =>
                        setNewRecurringBlock(prev => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </>
                )}
              </div>
            </div>

            {/* Timezone and Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={newRecurringBlock.timezone}
                  onValueChange={value =>
                    setNewRecurringBlock(prev => ({ ...prev, timezone: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONE_OPTIONS.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex space-x-2 mt-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                        newRecurringBlock.color === color.value
                          ? "border-forest"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setNewRecurringBlock(prev => ({
                          ...prev,
                          color: color.value,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Alert about timezone */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All times will be interpreted in the selected timezone:{" "}
                {newRecurringBlock.timezone}
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddRecurringBlock(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRecurringBlock}
              className="bg-forest hover:bg-moss"
            >
              Add Recurring Block
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add One-Time Block Modal */}
      <Dialog open={showAddOneTimeBlock} onOpenChange={setShowAddOneTimeBlock}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add One-Time Blocked Period</DialogTitle>
            <DialogDescription>
              Block off a specific date range for vacation, conferences, etc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="oneTimeTitle">Title *</Label>
              <Input
                id="oneTimeTitle"
                value={newOneTimeBlock.title || ""}
                onChange={e =>
                  setNewOneTimeBlock(prev => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g., Summer Vacation"
              />
            </div>

            <div>
              <Label htmlFor="oneTimeDescription">Description</Label>
              <Textarea
                id="oneTimeDescription"
                value={newOneTimeBlock.description || ""}
                onChange={e =>
                  setNewOneTimeBlock(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Optional description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="oneTimeStartDate">Start Date *</Label>
                <Input
                  id="oneTimeStartDate"
                  type="date"
                  value={newOneTimeBlock.startDate || ""}
                  onChange={e =>
                    setNewOneTimeBlock(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="oneTimeEndDate">End Date *</Label>
                <Input
                  id="oneTimeEndDate"
                  type="date"
                  value={newOneTimeBlock.endDate || ""}
                  onChange={e =>
                    setNewOneTimeBlock(prev => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newOneTimeBlock.isAllDay || false}
                onCheckedChange={checked =>
                  setNewOneTimeBlock(prev => ({
                    ...prev,
                    isAllDay: checked as boolean,
                  }))
                }
              />
              <Label>All day</Label>
            </div>

            {!newOneTimeBlock.isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="oneTimeStartTime">Start Time</Label>
                  <Input
                    id="oneTimeStartTime"
                    type="time"
                    value={newOneTimeBlock.startTime || ""}
                    onChange={e =>
                      setNewOneTimeBlock(prev => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="oneTimeEndTime">End Time</Label>
                  <Input
                    id="oneTimeEndTime"
                    type="time"
                    value={newOneTimeBlock.endTime || ""}
                    onChange={e =>
                      setNewOneTimeBlock(prev => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="oneTimeReason">Reason</Label>
              <Input
                id="oneTimeReason"
                value={newOneTimeBlock.reason || ""}
                onChange={e =>
                  setNewOneTimeBlock(prev => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="e.g., Personal vacation"
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex space-x-2 mt-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                      newOneTimeBlock.color === color.value
                        ? "border-forest"
                        : "border-gray-300"
                    }`}
                    onClick={() =>
                      setNewOneTimeBlock(prev => ({
                        ...prev,
                        color: color.value,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddOneTimeBlock(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOneTimeBlock}
              className="bg-forest hover:bg-moss"
            >
              Add Block Period
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailabilityManager;
