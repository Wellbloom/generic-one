// Filename: RecurringScheduleDemo.tsx
// Role: Demo component showcasing MultiRecurringScheduleSelector functionality
// Purpose: Demonstrates how users can set up multiple recurring schedules with intuitive interface
// Integration: Standalone demo component that can be used for testing and showcasing

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Play, RotateCcw } from "lucide-react";
import MultiRecurringScheduleSelector from "./payasyougo/MultiRecurringScheduleSelector";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  timeSlot: string;
  timezone: string;
  isEnabled: boolean;
}

const RecurringScheduleDemo: React.FC = () => {
  const [selectedSchedules, setSelectedSchedules] = useState<
    RecurringSchedule[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);

  // Example schedules for demonstration
  const loadExampleSchedule = () => {
    const exampleSchedules: RecurringSchedule[] = [
      {
        id: "schedule-1",
        dayOfWeek: 4, // Thursday
        timeSlot: "15:00", // 3:00 PM
        timezone: "America/New_York",
        isEnabled: true,
      },
      {
        id: "schedule-2",
        dayOfWeek: 5, // Friday
        timeSlot: "14:00", // 2:00 PM
        timezone: "America/New_York",
        isEnabled: true,
      },
    ];
    setSelectedSchedules(exampleSchedules);
  };

  const clearSchedules = () => {
    setSelectedSchedules([]);
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-forest">
          <Calendar className="h-6 w-6" />
          <span>Recurring Schedule Setup Demo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo Description */}
        <div className="bg-sage/10 p-4 rounded-lg border border-sage/30">
          <h3 className="font-semibold text-forest mb-2">How It Works</h3>
          <p className="text-moss/70 text-sm mb-3">
            This interface allows users to easily set up multiple recurring
            therapy sessions. For example, you can schedule sessions for
            "Thursdays at 3pm AND Fridays at 2pm" or any combination that works
            for your schedule.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={loadExampleSchedule}
              size="sm"
              className="bg-forest hover:bg-moss text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Load Example (Thu 3pm + Fri 2pm)
            </Button>
            <Button
              onClick={clearSchedules}
              size="sm"
              variant="outline"
              className="border-moss/30 text-moss hover:bg-moss/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Current Schedule Summary */}
        {selectedSchedules.length > 0 && (
          <div className="bg-gradient-to-r from-forest/5 to-sage/5 p-4 rounded-lg border border-forest/20">
            <h3 className="font-semibold text-forest mb-3">
              Current Schedule Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {selectedSchedules
                .filter(s => s.isEnabled)
                .map(schedule => (
                  <div
                    key={schedule.id}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg"
                  >
                    <div className="p-2 bg-forest/10 rounded-lg">
                      <Calendar className="h-4 w-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-forest">
                        {daysOfWeek[schedule.dayOfWeek]}s
                      </p>
                      <p className="text-sm text-moss/70">
                        at {formatTime(schedule.timeSlot)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="text-sm text-moss/70">
              <strong>Total:</strong>{" "}
              {selectedSchedules.filter(s => s.isEnabled).length} sessions per
              week
              <br />
              <strong>Weekly Cost:</strong> $
              {selectedSchedules.filter(s => s.isEnabled).length * 175}
              (${175} per session)
            </div>
          </div>
        )}

        {/* Open Full Interface Button */}
        <div className="text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-forest hover:bg-moss text-white px-8 py-3">
                <Calendar className="h-5 w-5 mr-2" />
                Open Full Schedule Interface
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-forest">
                  Set Up Your Recurring Schedule
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <MultiRecurringScheduleSelector
                  selectedSchedules={selectedSchedules}
                  onSchedulesChange={setSelectedSchedules}
                  maxSchedules={7}
                  errors={[]}
                />
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-forest hover:bg-moss text-white"
                >
                  Save & Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-sage/30">
          <div className="text-center p-3 sm:p-4">
            <div className="p-2 sm:p-3 bg-forest/10 rounded-full w-fit mx-auto mb-2 sm:mb-3">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-forest" />
            </div>
            <h4 className="font-semibold text-forest mb-2 text-sm sm:text-base">
              Multiple Time Slots
            </h4>
            <p className="text-xs sm:text-sm text-moss/70">
              Add up to 7 different recurring time slots per week
            </p>
          </div>
          <div className="text-center p-3 sm:p-4">
            <div className="p-2 sm:p-3 bg-forest/10 rounded-full w-fit mx-auto mb-2 sm:mb-3">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-forest" />
            </div>
            <h4 className="font-semibold text-forest mb-2 text-sm sm:text-base">
              Easy Management
            </h4>
            <p className="text-xs sm:text-sm text-moss/70">
              Enable/disable, edit, or remove time slots with simple controls
            </p>
          </div>
          <div className="text-center p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <div className="p-2 sm:p-3 bg-forest/10 rounded-full w-fit mx-auto mb-2 sm:mb-3">
              <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-forest" />
            </div>
            <h4 className="font-semibold text-forest mb-2 text-sm sm:text-base">
              Flexible Preview
            </h4>
            <p className="text-xs sm:text-sm text-moss/70">
              See upcoming sessions and payment schedule before confirming
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringScheduleDemo;
