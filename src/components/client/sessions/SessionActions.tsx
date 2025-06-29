// Filename: SessionActions.tsx
// Role: Handles session cancellation and rescheduling functionality
// Purpose: Provides proper UI for session management with fee calculations and user warnings
// Integration: Used in Dashboard and SessionCalendar components for session management

import { useState } from "react";
import {
  Clock,
  AlertTriangle,
  Calendar,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tailwindClasses } from "@/styles/colors";

interface Session {
  id: number;
  date: string;
  time: string;
  duration: string;
  amount: string;
  status: "completed" | "upcoming" | "cancelled" | "rescheduled";
  type: "Trial Session" | "Full Session";
  zoomLink?: string;
  canCancel?: boolean;
  canReschedule?: boolean;
}

interface SessionActionsProps {
  session: Session;
  onCancel: (sessionId: number, withFee: boolean) => void;
  onReschedule: (sessionId: number, withFee: boolean) => void;
  showActions?: boolean;
}

const SessionActions = ({
  session,
  onCancel,
  onReschedule,
  showActions = true,
}: SessionActionsProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate if session is within 24 hours
  const getTimeUntilSession = () => {
    const sessionDateTime = new Date(`${session.date} ${session.time}`);
    const now = new Date();
    const diffHours =
      (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      hours: diffHours,
      isWithin24Hours: diffHours < 24 && diffHours > 0,
      isPast: diffHours <= 0,
    };
  };

  const timeInfo = getTimeUntilSession();
  const cancellationFee = session.type === "Trial Session" ? 0.0 : 50.0; // Free for trial, $50 for others

  const handleCancel = async (withFee: boolean) => {
    setIsProcessing(true);
    try {
      await onCancel(session.id, withFee);
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Error cancelling session:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReschedule = async (withFee: boolean) => {
    setIsProcessing(true);
    try {
      await onReschedule(session.id, withFee);
      setShowRescheduleDialog(false);
    } catch (error) {
      console.error("Error rescheduling session:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimeRemaining = () => {
    if (timeInfo.isPast) return "Session time has passed";

    const hours = Math.floor(timeInfo.hours);
    const minutes = Math.floor((timeInfo.hours - hours) * 60);

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? "s" : ""} ${remainingHours > 0 ? `${remainingHours} hour${remainingHours > 1 ? "s" : ""}` : ""}`;
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : ""}`;
    }
  };

  if (!showActions || session.status !== "upcoming" || timeInfo.isPast) {
    return null;
  }

  return (
    <>
      <div className="flex space-x-2">
        {session.canReschedule && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRescheduleDialog(true)}
            className="text-forest border-forest/30 hover:bg-forest/10 dark:text-forest dark:border-forest/40 dark:hover:bg-forest/10"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Reschedule
          </Button>
        )}

        {session.canCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCancelDialog(true)}
            className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-forest">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancel Session
            </DialogTitle>
            <DialogDescription>
              Cancel your {session.type.toLowerCase()} scheduled for{" "}
              {new Date(session.date).toLocaleDateString()} at {session.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Time remaining info */}
            <div className="bg-sage/10 dark:bg-sage/5 border border-sage/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-moss" />
                <span className="font-medium text-moss">
                  Time until session:
                </span>
                <span className="text-forest font-semibold">
                  {formatTimeRemaining()}
                </span>
              </div>
            </div>

            {/* Fee information */}
            {timeInfo.isWithin24Hours ? (
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <div className="font-semibold mb-1">
                    Late Cancellation Fee Applies
                  </div>
                  <div className="text-sm">
                    Since you're cancelling within 24 hours, a cancellation fee
                    of{" "}
                    <span className="font-semibold">
                      {cancellationFee === 0 ? "Free" : `$${cancellationFee.toFixed(2)}`}
                    </span>{" "}
                    will be charged. This helps cover the therapist's time that
                    was reserved for you.
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="font-semibold mb-1">No Cancellation Fee</div>
                  <div className="text-sm">
                    Since you're cancelling more than 24 hours in advance, no
                    fee will be charged.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Cancellation Policy */}
            <div className="text-xs text-moss/70 bg-sage/5 p-3 rounded border border-sage/20">
              <div className="font-semibold mb-1">Cancellation Policy:</div>
              <ul className="space-y-1">
                <li>• Free cancellation: 24+ hours before session</li>
                <li>• Late cancellation fee: Within 24 hours of session</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isProcessing}
            >
              Keep Session
            </Button>
            <Button
              onClick={() => handleCancel(timeInfo.isWithin24Hours)}
              disabled={isProcessing}
              className={
                timeInfo.isWithin24Hours
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isProcessing
                ? "Processing..."
                : timeInfo.isWithin24Hours
                  ? (cancellationFee === 0 ? "Cancel (No Fee)" : `Cancel (Pay $${cancellationFee.toFixed(2)})`)
                  : "Cancel Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-forest">
              <Calendar className="h-5 w-5 text-blue-500" />
              Reschedule Session
            </DialogTitle>
            <DialogDescription>
              Reschedule your {session.type.toLowerCase()} from{" "}
              {new Date(session.date).toLocaleDateString()} at {session.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Time remaining info */}
            <div className="bg-sage/10 dark:bg-sage/5 border border-sage/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-moss" />
                <span className="font-medium text-moss">
                  Time until session:
                </span>
                <span className="text-forest font-semibold">
                  {formatTimeRemaining()}
                </span>
              </div>
            </div>

            {/* Fee information */}
            {timeInfo.isWithin24Hours ? (
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <div className="font-semibold mb-1">
                    Late Rescheduling Fee Applies
                  </div>
                  <div className="text-sm">
                    Since you're rescheduling within 24 hours, a rescheduling
                    fee of{" "}
                    <span className="font-semibold">
                      {cancellationFee === 0 ? "Free" : `$${cancellationFee.toFixed(2)}`}
                    </span>{" "}
                    will be charged. You can then select a new time slot.
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="font-semibold mb-1">Free Rescheduling</div>
                  <div className="text-sm">
                    Since you're rescheduling more than 24 hours in advance, no
                    fee will be charged.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Rescheduling Policy */}
            <div className="text-xs text-moss/70 bg-sage/5 p-3 rounded border border-sage/20">
              <div className="font-semibold mb-1">Rescheduling Policy:</div>
              <ul className="space-y-1">
                <li>• Free rescheduling: 24+ hours before session</li>
                <li>• Late rescheduling fee: Within 24 hours of session</li>
                <li>
                  • After payment, you can choose a new available time slot
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={isProcessing}
            >
              Keep Current Time
            </Button>
            <Button
              onClick={() => handleReschedule(timeInfo.isWithin24Hours)}
              disabled={isProcessing}
              className={
                timeInfo.isWithin24Hours
                  ? tailwindClasses.warning.bg
                  : tailwindClasses.zoom.bg
              }
            >
              {isProcessing
                ? "Processing..."
                : timeInfo.isWithin24Hours
                  ? `Reschedule (Pay $${cancellationFee.toFixed(2)})`
                  : "Choose New Time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionActions;
