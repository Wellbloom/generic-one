// Filename: SessionCalendar.tsx
// Role: Comprehensive calendar view for displaying all user sessions
// Purpose: Provides Google Calendar-like interface showing sessions directly on calendar grid
// Integration: Used in Dashboard.tsx for enhanced calendar view functionality

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SessionActions from "./SessionActions";
import { tailwindClasses } from "@/styles/colors";

interface Session {
  id: number;
  date: string;
  time: string;
  duration: string;
  amount: string;
  status: "completed" | "upcoming" | "cancelled" | "rescheduled";
  type: "Trial Session" | "Full Session";
  sessionCategory?: "one-time" | "recurring";
  zoomLink?: string;
  canCancel?: boolean;
  canReschedule?: boolean;
}

interface SessionCalendarProps {
  sessions: Session[];
  onJoinZoom: (zoomLink: string) => void;
  onReschedule: (sessionId: number, withFee: boolean) => void;
  onCancel: (sessionId: number, withFee: boolean) => void;
}

const SessionCalendar = ({
  sessions,
  onJoinZoom,
  onReschedule,
  onCancel,
}: SessionCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        sessions: getSessionsForDate(prevDate),
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        sessions: getSessionsForDate(dayDate),
      });
    }

    // Add empty cells for days after the last day of the month to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        sessions: getSessionsForDate(nextDate),
      });
    }

    return days;
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return sessions.filter(session => session.date === dateStr);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "upcoming":
        return <Clock className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      case "rescheduled":
        return <Edit className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const canCancelSession = (sessionDate: string, sessionTime: string) => {
    const sessionDateTime = new Date(`${sessionDate} ${sessionTime}`);
    const now = new Date();
    const diffHours =
      (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  // Helper function to format date in a friendly format
  const formatFriendlyDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Helper function to get session category display text
  const getSessionCategoryText = (session: Session) => {
    return session.sessionCategory === "recurring"
      ? "Recurring Session"
      : "One-time Session";
  };

  // Helper function to capitalize status text
  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-forest text-2xl font-serif">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-forest border-forest/20 hover:bg-forest/10"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="text-forest border-forest/20 hover:bg-forest/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="text-forest border-forest/20 hover:bg-forest/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-sage/30">
          {dayNames.map(day => (
            <div
              key={day}
              className="p-3 text-center font-medium text-moss border-r border-sage/30 last:border-r-0 bg-sage/10"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] border-r border-b border-sage/30 last:border-r-0 p-2 ${
                !day.isCurrentMonth ? "bg-gray-50/50" : ""
              } ${isToday(day.date) ? "bg-blue-50/50" : ""}`}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium ${
                    !day.isCurrentMonth
                      ? "text-gray-400"
                      : isToday(day.date)
                        ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        : "text-forest"
                  }`}
                >
                  {day.date.getDate()}
                </span>
              </div>

              {/* Sessions for this day */}
              <div className="space-y-1">
                {day.sessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-1.5 rounded-md border text-xs ${getStatusColor(session.status)} hover:shadow-sm transition-shadow cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 min-w-0 flex-1">
                        {getStatusIcon(session.status)}
                        <span className="font-medium truncate">
                          {session.time}
                        </span>
                      </div>
                      {session.status === "upcoming" && session.zoomLink && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={e => {
                            e.stopPropagation();
                            onJoinZoom(session.zoomLink!);
                          }}
                        >
                          <Video
                            className={`h-3 w-3 ${tailwindClasses.zoom.text}`}
                          />
                        </Button>
                      )}
                    </div>

                    <div className="mt-1">
                      <div className="text-xs opacity-90 truncate">
                        {getSessionCategoryText(session)}
                      </div>
                      <div className="text-xs opacity-75">
                        {session.duration}
                      </div>
                    </div>

                    {/* Action buttons on hover for upcoming sessions */}
                    {session.status === "upcoming" && (
                      <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1 scale-75">
                          {session.zoomLink && (
                            <Button
                              size="sm"
                              className={`h-5 text-xs px-1 ${tailwindClasses.zoom.bg}`}
                              onClick={e => {
                                e.stopPropagation();
                                onJoinZoom(session.zoomLink!);
                              }}
                            >
                              Join
                            </Button>
                          )}
                          <div onClick={e => e.stopPropagation()}>
                            <SessionActions
                              session={session}
                              onCancel={onCancel}
                              onReschedule={onReschedule}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show indicator if there are more sessions than can fit */}
              {day.sessions.length > 3 && (
                <div className="text-xs text-moss/70 mt-1">
                  +{day.sessions.length - 3} more
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="p-4 bg-sage/5 border-t border-sage/30">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-moss">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-moss">Upcoming</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-moss">Cancelled</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
              <span className="text-moss">Rescheduled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCalendar;
