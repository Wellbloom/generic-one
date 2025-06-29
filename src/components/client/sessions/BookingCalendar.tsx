// Filename: BookingCalendar.tsx
// Role: Handles booking calendar functionality for package sessions
// Purpose: Allows users to schedule their available package sessions with proper session type and pricing
// Integration: Used by Dashboard component for session booking functionality

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionNotifications } from "@/utils/NotificationService";
import { Clock, User, CreditCard, CheckCircle } from "lucide-react";
import { PRICING } from "@/constants";

interface BookingCalendarProps {
  onClose: () => void;
  availableSessions?: number;
  isTrialBooking?: boolean;
}

const BookingCalendar = ({
  onClose,
  availableSessions = 0,
  isTrialBooking = false,
}: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      setShowForm(true);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      setShowForm(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      SessionNotifications.bookingError();
      return;
    }

    try {
      // Generate Zoom link (in real implementation, this would be done server-side)
      const meetingId = Math.random().toString(36).substring(2, 15);
      const zoomLink = `https://zoom.us/j/${meetingId}`;

      const sessionType = isTrialBooking ? "Trial Session" : "Wellness Session";
      const sessionDuration = isTrialBooking ? "15 minutes" : "60 minutes";
      const sessionPrice = isTrialBooking ? "Free" : `$${PRICING.individualSession}.00`;

      SessionNotifications.booked(
        sessionType,
        selectedDate?.toLocaleDateString() || "",
        selectedTime
      );

      console.log("Booking details:", {
        date: selectedDate,
        time: selectedTime,
        client: formData,
        zoomLink,
        sessionType,
        isTrialBooking,
        availableSessionsRemaining: availableSessions - 1,
      });

      onClose();
    } catch (error) {
      console.error("Error booking session:", error);
      SessionNotifications.bookingError();
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getSessionInfo = () => {
    if (isTrialBooking) {
      return {
        title: "Trial Session",
        duration: "15 minutes",
        price: "Free",
        description: "Get started with a quick introduction session",
        platform: "Zoom",
      };
    } else {
      return {
        title: "Full Session",
        duration: "60 minutes",
        price: `$${PRICING.individualSession}.00`,
        description: "Complete therapeutic session with personalized care",
        platform: "Zoom",
      };
    }
  };

  const sessionInfo = getSessionInfo();

  if (showForm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
          <h3 className="text-2xl font-serif font-bold text-forest mb-6">
            Complete Your Booking
          </h3>

          <div className="mb-6 p-4 bg-sage/20 dark:bg-sage/10 rounded-lg border border-sage/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-forest font-medium">
                {selectedDate?.toLocaleDateString()} at {selectedTime}
              </p>
              <Badge variant="secondary" className="bg-forest/10 text-forest">
                {sessionInfo.title}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-moss/70">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{sessionInfo.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{sessionInfo.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Via {sessionInfo.platform}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Full name"
              className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none dark:bg-gray-700 dark:border-sage/50 dark:text-white"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email address"
              className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none dark:bg-gray-700 dark:border-sage/50 dark:text-white"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Phone number"
              className="w-full px-4 py-3 border border-sage rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none dark:bg-gray-700 dark:border-sage/50 dark:text-white"
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-forest hover:bg-moss">
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-forest">
              {isTrialBooking
                ? "Book Your Trial Session"
                : "Schedule Your Session"}
            </h3>
            {!isTrialBooking && (
              <p className="text-moss/70 text-sm mt-1">
                Schedule an individual therapy session
              </p>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-forest mb-4">Select Date</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={date =>
                date < new Date() || date.getDay() === 0 || date.getDay() === 6
              }
              className="rounded-md border border-sage"
            />
          </div>

          <div>
            <h4 className="font-semibold text-forest mb-4">Select Time</h4>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(time => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => handleTimeSelect(time)}
                  className={`${selectedTime === time ? "bg-forest hover:bg-moss" : ""}`}
                  disabled={false}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-sage/20 dark:bg-sage/10 rounded-lg border border-sage/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-forest font-medium">{sessionInfo.title}</p>
            <Badge variant="secondary" className="bg-forest/10 text-forest">
              {sessionInfo.price}
            </Badge>
          </div>
          <p className="text-moss/70 text-sm mb-2">{sessionInfo.description}</p>
          <div className="flex items-center gap-4 text-xs text-moss/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {sessionInfo.duration}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Via {sessionInfo.platform}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
