// Filename: PricingConfirmation.tsx
// Role: Displays a confirmation of the client recurring sessions pricing model.
// Purpose: Informs the client about the per-session cost and individual billing based on their selected schedule.
// Integration: Used in RecurringSessionsSetup.tsx as step 2 of the setup process.

import React from "react";
import {
  DollarSign,
  Info,
  Repeat,
  Calendar,
  CreditCard,
  CheckCircle,
  Lock,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  timeSlot: string;
  timezone: string;
  isEnabled: boolean;
}

interface PricingConfirmationProps {
  selectedSchedules: RecurringSchedule[];
  className?: string;
}

const PricingConfirmation: React.FC<PricingConfirmationProps> = ({
  selectedSchedules,
  className = "",
}) => {
  const enabledSchedules = selectedSchedules.filter(s => s.isEnabled);
  const sessionCount = enabledSchedules.length;
  const pricePerSession = 70;

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatTime = (timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const sessionFeatures = [
    {
      text: "Flexible scheduling",
      icon: <Calendar className="h-4 w-4 mr-2 text-forest" />,
    },
    {
      text: "Cancel or reschedule with 24h notice",
      icon: <Repeat className="h-4 w-4 mr-2 text-forest" />,
    },
    {
      text: "Fully confidential & private sessions",
      icon: <Lock className="h-4 w-4 mr-2 text-forest" />,
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-forest/10 dark:bg-forest/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-forest">
            Pricing Confirmation
          </h2>
        </div>
      </div>

      {/* Simplified: Only Recurring Schedule & Billing */}
      <Card className="border-sage/30 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center text-forest">
            <Repeat className="mr-2 h-5 w-5" />
            Your Recurring Schedule & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionCount > 0 ? (
            <ul className="space-y-2">
              {enabledSchedules.map(schedule => (
                <li
                  key={schedule.id}
                  className="flex justify-between items-center text-moss/90 p-3 rounded-lg bg-white dark:bg-gray-800 border border-sage/30"
                >
                  <div>
                    <p className="font-semibold text-forest">
                      {daysOfWeek[schedule.dayOfWeek]}
                    </p>
                    <p className="text-sm">{formatTime(schedule.timeSlot)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest text-lg">
                      {formatCurrency(pricePerSession)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-moss/70 p-4">
              No recurring schedules selected. Please go back to Step 1.
            </p>
          )}
          <Alert variant="default" className="bg-sage/10 border-sage/30">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-moss/90">
              <strong>
                {sessionCount} {sessionCount === 1 ? "session" : "sessions"} per
                week
              </strong>
              • Billed individually
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Billing Explanation Alert */}
      <Alert className="mt-6 max-w-2xl mx-auto border-amber-300/50 bg-amber-50/80 text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-200">
        <CreditCard className="h-4 w-4 !text-amber-600 dark:!text-amber-400" />
        <AlertTitle className="mb-2 font-semibold !text-amber-800 dark:!text-amber-300">
          How You'll Be Charged
        </AlertTitle>
        <AlertDescription className="!text-amber-800/90 dark:!text-amber-400/90">
          <strong>{formatCurrency(pricePerSession)}</strong> charged
          automatically 48 hours before each session. Cancel anytime.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PricingConfirmation;
