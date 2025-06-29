// Filename: AdminCalendarView.tsx
// Role: Admin-specific calendar view component for therapist dashboard
// Purpose: Displays calendar view of all sessions from therapist's perspective
// Integration: Used by AdminDashboard in the calendar tab

import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Video,
  ExternalLink,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Calendar session data structure
interface CalendarSession {
  id: number;
  clientName: string;
  profileImage: string;
  date: string;
  time: string;
  duration: string;
  sessionType: "Initial Consultation" | "Regular Session" | "Follow-up";
  status: "scheduled" | "confirmed" | "completed";
  zoomLink?: string;
}

interface AdminCalendarViewProps {
  onAddSession?: (date: string) => void;
  onEditSession?: (sessionId: number) => void;
}

const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({
  onAddSession,
  onEditSession,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock calendar sessions data
  const [sessions] = useState<CalendarSession[]>([
    {
      id: 1,
      clientName: "Sarah Johnson",
      profileImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      date: new Date().toISOString().split("T")[0], // Today
      time: "2:00 PM",
      duration: "60 minutes",
      sessionType: "Regular Session",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/1234567890",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Tomorrow
      time: "10:00 AM",
      duration: "90 minutes",
      sessionType: "Initial Consultation",
      status: "scheduled",
      zoomLink: "https://zoom.us/j/2345678901",
    },
    {
      id: 3,
      clientName: "Emily Rodriguez",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // In 3 days
      time: "4:00 PM",
      duration: "60 minutes",
      sessionType: "Follow-up",
      status: "confirmed",
      zoomLink: "https://zoom.us/j/3456789012",
    },
  ]);

  // Get the first day of the current month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Get the first day of the calendar (might be from previous month)
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(
    firstDayOfCalendar.getDate() - firstDayOfMonth.getDay()
  );

  // Generate calendar days
  const calendarDays = [];
  const currentCalendarDate = new Date(firstDayOfCalendar);

  for (let i = 0; i < 42; i++) {
    // 6 weeks * 7 days
    calendarDays.push(new Date(currentCalendarDate));
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
  }

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

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return sessions.filter(session => session.date === dateString);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-forest flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Calendar View
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold text-forest min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="bg-forest hover:bg-moss text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div
              key={day}
              className="p-2 text-center font-medium text-moss bg-sage/10 rounded"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((date, index) => {
            const daysSessions = getSessionsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-sage/20 rounded-lg ${
                  isCurrentMonthDay ? "bg-white" : "bg-gray-50"
                } ${isTodayDate ? "ring-2 ring-forest/30 bg-sage/10" : ""} hover:bg-sage/5 transition-colors cursor-pointer`}
                onClick={() => onAddSession?.(date.toISOString().split("T")[0])}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    isCurrentMonthDay ? "text-forest" : "text-moss/50"
                  } ${isTodayDate ? "text-forest font-bold" : ""}`}
                >
                  {date.getDate()}
                </div>

                {/* Sessions for this day */}
                <div className="space-y-1">
                  {daysSessions.map(session => (
                    <div
                      key={session.id}
                      className={`text-xs p-1.5 rounded border ${getStatusColor(session.status)} hover:shadow-sm transition-shadow cursor-pointer`}
                      onClick={e => {
                        e.stopPropagation();
                        onEditSession?.(session.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 min-w-0 flex-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{session.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Avatar className="h-4 w-4 flex-shrink-0">
                          <AvatarImage
                            src={session.profileImage}
                            alt={session.clientName}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-sage/20 text-forest text-xs">
                            {session.clientName
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{session.clientName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCalendarView;
