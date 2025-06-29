// Filename: IndividualSessionBooking.tsx
// Role: Timezone-aware individual session booking component
// Purpose: Allows users to book single therapy sessions with proper timezone handling
// Integration: Used in Dashboard when user wants to book individual sessions

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  User,
  CheckCircle,
  Info,
  Star,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SessionNotifications } from "@/utils/NotificationService";
import {
  getUserTimezone,
  getTimezoneInfo,
  TimezoneInfo,
} from "@/utils/TimezoneHelpers";
import { PRICING } from "@/constants";

interface SessionOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface IndividualSessionBookingProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionBooked: (sessionType: string) => void;
}

const IndividualSessionBooking = ({
  isOpen,
  onClose,
  onSessionBooked,
}: IndividualSessionBookingProps) => {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Timezone state - only client timezone needed
  const [clientTimezone, setClientTimezone] = useState<string>("");
  const [clientTzInfo, setClientTzInfo] = useState<TimezoneInfo | null>(null);

  // Initialize timezone information
  useEffect(() => {
    const userTz = getUserTimezone();

    setClientTimezone(userTz);
    setClientTzInfo(getTimezoneInfo(userTz));
  }, []);

  const sessionOptions: SessionOption[] = [
    {
      id: "recurring",
      name: "Recurring Session",
      price: 70,
      duration: "60 minutes",
      description: "Weekly sessions at a discounted rate for continuous progress",
      features: [
        "60-minute session",
        "Zoom meeting",
        "Discounted pricing",
      ],
      popular: true,
    },
    {
      id: "single",
      name: "Single Session",
      price: 79,
      duration: "60 minutes",
      description: "Complete therapy session with full support and guidance",
      features: [
        "60-minute session",
        "Zoom meeting",
      ],
    },
  ];

  const handleBookSession = async () => {
    if (!selectedSession) {
      SessionNotifications.cancellationError();
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedOption = sessionOptions.find(
        session => session.id === selectedSession
      );

      if (selectedOption) {
        console.log("Individual session booked:", {
          sessionId: selectedSession,
          sessionDetails: selectedOption,
          timestamp: new Date().toISOString(),
        });

        onSessionBooked(selectedOption.name);
        onClose();
      }
    } catch (error) {
      SessionNotifications.cancellationError();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-forest text-2xl">
            <User className="h-6 w-6" />
            Book Individual Session
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose the session type that best fits your needs
          </DialogDescription>
        </DialogHeader>

        {/* Timezone Information */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Session Timezone: {clientTzInfo?.displayName || "Loading..."}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Session will be scheduled in your local timezone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information Banner */}
        <div className="mb-6">
          <Alert className="border-sage/30 bg-sage/10">
            <Info className="h-4 w-4 text-moss" />
            <AlertDescription className="text-moss">
              <div className="font-medium mb-2">
                Individual Session Booking:
              </div>
              <div className="text-sm">
                Perfect for flexible scheduling without long-term commitment.
                You can always set up a Recurring Sessions plan later for
                recurring sessions with individual billing for better value and
                consistency.
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Session Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {sessionOptions.map(session => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedSession === session.id
                  ? "ring-2 ring-forest border-forest bg-sage/10"
                  : "border-sage/30 hover:border-sage/50"
              } ${session.popular ? "border-purple-300 bg-purple-50/50" : ""}`}
              onClick={() => setSelectedSession(session.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-forest flex items-center gap-2">
                    {session.name}
                    {session.popular && (
                      <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest">
                      {session.price === 0 ? "Free" : `$${session.price}`}
                    </div>
                    <div className="text-sm text-moss/70">
                      {session.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-moss/80 text-sm mb-4">
                  {session.description}
                </p>
                <div className="space-y-2">
                  {session.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-moss/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-purple-50 to-purple-25 dark:from-purple-900/10 dark:to-purple-800/5 border-purple-200">
            <CardHeader>
              <CardTitle className="text-forest text-lg">
                Session Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="font-medium text-moss">Feature</div>
                <div className="font-medium text-center text-moss">
                  Recurring Session
                </div>
                <div className="font-medium text-center text-moss">
                  Single Session
                </div>

                <div className="text-moss/70">Duration</div>
                <div className="text-center">60 minutes</div>
                <div className="text-center">60 minutes</div>

                <div className="text-moss/70">Price (per session)</div>
                <div className="text-center font-semibold text-green-600">
                  ${PRICING.recurringSession} <span className="text-sm font-normal">(~12% discount)</span>
                </div>
                <div className="text-center font-semibold">${PRICING.individualSession}</div>

                {/* Additional features removed as requested */}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-sage/30 text-moss hover:bg-sage/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookSession}
            disabled={!selectedSession || isProcessing}
            className="bg-forest hover:bg-moss disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Book Selected Session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IndividualSessionBooking;
