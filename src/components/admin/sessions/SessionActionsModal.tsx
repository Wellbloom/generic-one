// Filename: SessionActionsModal.tsx
// Role: Modal dialog for session management actions (cancel/reschedule)
// Purpose: Provides therapist with options to cancel or reschedule sessions
// Integration: Used by AdminUpcomingSessions when edit button is clicked

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  X,
  AlertTriangle,
  Clock,
  User,
  DollarSign,
} from "lucide-react";

interface SessionActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    id: number;
    clientName: string;
    date: string;
    time: string;
    duration: string;
    sessionFee: string;
  };
  onCancel: (sessionId: number) => void;
  onReschedule: (sessionId: number) => void;
}

const SessionActionsModal: React.FC<SessionActionsModalProps> = ({
  isOpen,
  onClose,
  session,
  onCancel,
  onReschedule,
}) => {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const handleCancel = () => {
    onCancel(session.id);
    onClose();
    setIsConfirmingCancel(false);
  };

  const handleReschedule = () => {
    onReschedule(session.id);
    onClose();
  };

  const formatFriendlyDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-forest">
            Session Actions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Session Details */}
          <Card className="bg-sage/10">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-forest" />
                  <span className="font-medium text-forest">
                    {session.clientName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-moss" />
                  <span className="text-sm text-moss">
                    {formatFriendlyDate(session.date)} at {session.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-moss" />
                  <span className="text-sm text-moss">{session.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-moss" />
                  <span className="text-sm text-moss">
                    {session.sessionFee}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isConfirmingCancel ? (
            <div className="space-y-3">
              <Button
                onClick={handleReschedule}
                variant="outline"
                className="w-full justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule Session
              </Button>
              <Button
                onClick={() => setIsConfirmingCancel(true)}
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel Session
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Confirm Cancellation
                  </p>
                  <p className="text-xs text-red-600">
                    This action cannot be undone. The client will be notified.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  className="flex-1"
                >
                  Yes, Cancel Session
                </Button>
                <Button
                  onClick={() => setIsConfirmingCancel(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Keep Session
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionActionsModal;
