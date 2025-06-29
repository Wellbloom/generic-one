// Filename: AdminUpcomingSessions.tsx
// Role: Admin-specific upcoming sessions component for therapist dashboard
// Purpose: Displays upcoming therapy sessions from therapist's perspective with simplified layout
// Integration: Used by AdminDashboard in the upcoming sessions tab

import { useState } from "react";
import { Calendar, Clock, Video, ExternalLink, User, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDetailsModal } from "@/components/admin/clients";
import { SessionActionsModal } from "@/components/admin/sessions";

// Simplified admin session data structure
interface AdminSession {
  id: number;
  clientName: string;
  clientId: string;
  profileImage?: string;
  date: string;
  time: string;
  duration: string;
  sessionFee: string;
  paymentStatus: "paid" | "pending";
  sessionType: "recurring" | "one-time";
  zoomLink?: string;
}

interface AdminUpcomingSessionsProps {
  onSessionUpdate?: (sessionId: number, action: string) => void;
}

const AdminUpcomingSessions: React.FC<AdminUpcomingSessionsProps> = ({
  onSessionUpdate,
}) => {
  // Helper function to determine payment status based on 48-hour rule
  const getPaymentStatusForSession = (
    sessionDate: string
  ): "paid" | "pending" => {
    const sessionDateTime = new Date(sessionDate);
    const now = new Date();
    const hoursDifference =
      (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // If session is less than 48 hours away, payment should be automatically deducted (paid)
    return hoursDifference < 48 ? "paid" : "pending";
  };

  // Simplified mock admin sessions data with automatic payment status calculation
  const [upcomingSessions] = useState<AdminSession[]>([
    {
      id: 1,
      clientName: "Sarah Johnson",
      clientId: "client-001",
      profileImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      date: new Date().toISOString().split("T")[0], // Today
      time: "2:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      paymentStatus: getPaymentStatusForSession(
        new Date().toISOString().split("T")[0]
      ),
      sessionType: "recurring",
      zoomLink: "https://zoom.us/j/1234567890",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      clientId: "client-002",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Tomorrow
      time: "10:00 AM",
      duration: "90 minutes",
      sessionFee: "$200.00",
      paymentStatus: getPaymentStatusForSession(
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      ),
      sessionType: "one-time",
      zoomLink: "https://zoom.us/j/2345678901",
    },
    {
      id: 3,
      clientName: "Emily Rodriguez",
      clientId: "client-003",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // In 3 days
      time: "4:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      paymentStatus: getPaymentStatusForSession(
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      ),
      sessionType: "recurring",
      zoomLink: "https://zoom.us/j/3456789012",
    },
  ]);

  // Modal states
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<AdminSession | null>(
    null
  );
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [showSessionActions, setShowSessionActions] = useState(false);

  const handleClientNameClick = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowClientDetails(true);
  };

  const handleEditSession = (session: AdminSession) => {
    setSelectedSession(session);
    setShowSessionActions(true);
  };

  const handleCancelSession = (sessionId: number) => {
    console.log(`Cancelling session ${sessionId}`);
    if (onSessionUpdate) {
      onSessionUpdate(sessionId, "cancel");
    }
  };

  const handleRescheduleSession = (sessionId: number) => {
    console.log(`Rescheduling session ${sessionId}`);
    if (onSessionUpdate) {
      onSessionUpdate(sessionId, "reschedule");
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Payment
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {type === "recurring" ? "Recurring Session" : "One-time Session"}
      </Badge>
    );
  };

  const formatFriendlyDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-forest flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Upcoming Sessions ({upcomingSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map(session => (
                <div
                  key={session.id}
                  className="p-4 sm:p-6 bg-gradient-to-r from-sage/20 to-sage/10 dark:from-sage/10 dark:to-sage/5 rounded-lg border border-sage/30 dark:border-sage/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Client Info Section */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Profile Image */}
                      <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {session.profileImage ? (
                          <img
                            src={session.profileImage}
                            alt={session.clientName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-forest" />
                        )}
                      </div>

                      {/* Session Details */}
                      <div className="flex-1 min-w-0">
                        {/* Client Name with Payment Status */}
                        <div className="flex items-center space-x-2 mb-1">
                          <button
                            onClick={() =>
                              handleClientNameClick(session.clientId)
                            }
                            className="font-semibold text-forest text-base sm:text-lg hover:text-moss transition-colors text-left"
                          >
                            {session.clientName}
                          </button>
                          {getPaymentStatusBadge(session.paymentStatus)}
                        </div>

                        {/* Date and Time */}
                        <p className="text-moss font-medium text-sm sm:text-base">
                          {formatFriendlyDate(session.date)} at {session.time}
                        </p>

                        {/* Duration and Session Type - Subtle styling */}
                        <p className="text-moss/60 text-xs mt-1">
                          {session.duration} •{" "}
                          {session.sessionType === "recurring"
                            ? "Recurring session"
                            : "One-time session"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSession(session)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(session.zoomLink, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join on Zoom
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-moss/50 dark:text-moss/60 mx-auto mb-4" />
              <p className="text-moss/70 dark:text-moss/80 text-lg mb-4">
                No upcoming sessions scheduled
              </p>
              <p className="text-sm text-moss/60">
                Sessions will appear here once clients book appointments
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      {showClientDetails && selectedClientId && (
        <ClientDetailsModal
          isOpen={showClientDetails}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedClientId(null);
          }}
          clientId={selectedClientId}
        />
      )}

      {/* Session Actions Modal */}
      {showSessionActions && selectedSession && (
        <SessionActionsModal
          isOpen={showSessionActions}
          onClose={() => {
            setShowSessionActions(false);
            setSelectedSession(null);
          }}
          session={{
            id: selectedSession.id,
            clientName: selectedSession.clientName,
            date: selectedSession.date,
            time: selectedSession.time,
            duration: selectedSession.duration,
            sessionFee: selectedSession.sessionFee,
          }}
          onCancel={handleCancelSession}
          onReschedule={handleRescheduleSession}
        />
      )}
    </>
  );
};

export default AdminUpcomingSessions;
