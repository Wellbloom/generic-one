// Filename: ClientDashboard.tsx
// Role: Client-specific dashboard interface for therapy session management
// Purpose: Provides a clean, user-friendly dashboard for clients to manage their therapy sessions and progress
// Integration: Used as the main dashboard view for authenticated clients

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Video,
  Plus,
  BarChart3,
  ExternalLink,
  BookOpen,
  Heart,
  Wind,
  FileText,
  Target,
  Brain,
  Lightbulb,
  Download,
  Play,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookingCalendar,
  SessionCalendar,
  SessionActions,
  IndividualSessionBooking,
} from "@/components/client/sessions";

import { RecurringSessionsSetup } from "../recurring-sessions/setup";
import PlanStatusBadge from "@/components/PlanStatusBadge";
import TherapeuticFrameViewer from "@/components/TherapeuticFrameViewer";
import DashboardHeader from "@/components/DashboardHeader";

import { PlanType } from "@/types/PlanManagementTypes";
import { tailwindClasses } from "@/styles/colors";
import { SessionNotifications } from "@/utils/NotificationService";
import { MOCK_DATA, PRICING } from "@/constants";

// Client session data structure
interface ClientSession {
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

// Generate client session data
const generateClientSessionData = (hasPayAsYouGo = false) => {
  const now = new Date();
  const sessions: ClientSession[] = [];
  let sessionId = 1;

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  // Helper function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Generate completed sessions for client history
  const completedSessions = [
    {
      id: sessionId++,
      date: formatDate(addDays(now, -14)),
      time: "2:00 PM",
      duration: "15 minutes",
      amount: "Free",
      status: "completed" as const,
      type: "Trial Session" as const,
      sessionCategory: "one-time" as const,
    },
    {
      id: sessionId++,
      date: formatDate(addDays(now, -10)),
      time: "3:30 PM",
      duration: "60 minutes",
      amount: "$79.00",
      status: "completed" as const,
      type: "Full Session" as const,
      sessionCategory: "recurring" as const,
    },
    {
      id: sessionId++,
      date: formatDate(addDays(now, -7)),
      time: "2:00 PM",
      duration: "60 minutes",
      amount: "$79.00",
      status: "completed" as const,
      type: "Full Session" as const,
      sessionCategory: "one-time" as const,
    },
  ];

  // Generate upcoming sessions for pay-as-you-go clients
  const upcomingSessions: ClientSession[] = hasPayAsYouGo
    ? [
        {
          id: sessionId++,
          date: formatDate(addDays(now, 0)),
          time: `${(now.getHours() + 2) % 12 || 12}:00 ${now.getHours() + 2 >= 12 ? "PM" : "AM"}`,
          duration: "60 minutes",
          amount: "$79.00",
          status: "upcoming" as const,
          type: "Full Session" as const,
          sessionCategory: "recurring" as const,
          zoomLink: "https://zoom.us/j/1234567890",
          canCancel: true,
          canReschedule: true,
        },
        {
          id: sessionId++,
          date: formatDate(addDays(now, 7)),
          time: "2:00 PM",
          duration: "60 minutes",
          amount: "$79.00",
          status: "upcoming" as const,
          type: "Full Session" as const,
          sessionCategory: "recurring" as const,
          zoomLink: "https://zoom.us/j/2345678901",
          canCancel: true,
          canReschedule: true,
        },
      ]
    : [];

  // Combine all sessions
  sessions.push(...completedSessions, ...upcomingSessions);
  return { sessions };
};

interface ClientDashboardProps {
  onSwitchToAdmin?: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({
  onSwitchToAdmin,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Function to get greeting based on current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get user's first name for greeting
  const getUserFirstName = () => {
    // In client mode, always show the client's name from constants
    return MOCK_DATA.client.firstName;
  };

  // Client-specific plan state
  const [currentPlan, setCurrentPlan] =
    useState<PlanType>("individual-session");
  const [hasPayAsYouGoSubscription, setHasPayAsYouGoSubscription] =
    useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Modal states for client interactions
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [showIndividualSessionBooking, setShowIndividualSessionBooking] =
    useState(false);
  const [showTherapeuticFrame, setShowTherapeuticFrame] = useState(false);
  const [showRecurringSetupWizard, setShowRecurringSetupWizard] =
    useState(false);
  const [currentSetupStep, setCurrentSetupStep] = useState(0);

  // Generate client session data
  const [sessions, setSessions] = useState<ClientSession[]>([]);

  // State to store subscription data from setup
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  // Update sessions when subscription status changes OR when subscription data changes
  useEffect(() => {
    let { sessions: mockSessions } = generateClientSessionData(
      hasPayAsYouGoSubscription
    );

    // If we have real subscription data, use those sessions instead
    if (subscriptionData?.upcomingSessions) {
      // Convert subscription sessions to ClientSession format
      const realSessions: ClientSession[] =
        subscriptionData.upcomingSessions.map(
          (session: any, index: number) => ({
            id: index + 1000, // Use high IDs to avoid conflicts
            date:
              session.date instanceof Date
                ? session.date.toISOString().split("T")[0]
                : new Date(session.date).toISOString().split("T")[0],
            time: session.timeSlot,
            duration: `${session.duration} minutes`,
            amount: `$${session.amount}`,
            status: "upcoming" as const,
            type: "Full Session" as const,
            sessionCategory: "recurring" as const,
            zoomLink: session.zoomLink,
            canCancel: true,
            canReschedule: true,
          })
        );

      // Replace mock sessions with real ones
      mockSessions = [
        ...realSessions,
        ...mockSessions.filter(s => s.status !== "upcoming"),
      ];
    }

    setSessions(mockSessions);
  }, [hasPayAsYouGoSubscription, subscriptionData]);

  const upcomingSessions = sessions.filter(s => s.status === "upcoming");
  const completedSessions = sessions.filter(s => s.status === "completed");

  // Update current plan when pay-as-you-go status changes
  useEffect(() => {
    setCurrentPlan(
      hasPayAsYouGoSubscription ? "pay-as-you-go" : "individual-session"
    );
  }, [hasPayAsYouGoSubscription]);

  // Mock plan status for client
  const planStatus = {
    isActive: hasPayAsYouGoSubscription,
    isPaused: false,
    nextPaymentDate: hasPayAsYouGoSubscription
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : undefined,
    nextSessionDate:
      hasPayAsYouGoSubscription && upcomingSessions.length > 0
        ? new Date(upcomingSessions[0].date + " " + upcomingSessions[0].time)
        : undefined,
    pricePerSession: 79,
  };

  const handleManagePlan = () => {
    if (currentPlan === "pay-as-you-go") {
      console.log("Managing pay-as-you-go plan");
    } else {
      setShowIndividualSessionBooking(true);
    }
  };

  const handleCancelSession = (sessionId: number, withFee: boolean) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    try {
      console.log("Cancelling session:", sessionId, "with fee:", withFee);
      const fee = session.type === "Trial Session" ? 0.0 : 50.0;
      const formattedDate = new Date(session.date).toLocaleDateString();

      if (withFee) {
        SessionNotifications.cancelledWithFee(
          session.type,
          formattedDate,
          session.time,
          fee
        );
      } else {
        SessionNotifications.cancelledFree(
          session.type,
          formattedDate,
          session.time
        );
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      SessionNotifications.cancellationError();
    }
  };

  const handleRescheduleSession = (sessionId: number, withFee: boolean) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    try {
      console.log("Rescheduling session:", sessionId, "with fee:", withFee);
      const fee = session.type === "Trial Session" ? 0.0 : 50.0;
      const formattedDate = new Date(session.date).toLocaleDateString();

      if (withFee) {
        SessionNotifications.rescheduledWithFee(
          session.type,
          formattedDate,
          session.time,
          fee
        );
      } else {
        SessionNotifications.rescheduledFree(
          session.type,
          formattedDate,
          session.time
        );
      }

      setShowBookingCalendar(true);
    } catch (error) {
      console.error("Error rescheduling session:", error);
      SessionNotifications.reschedulingError();
    }
  };

  const handleJoinZoom = (zoomLink: string) => {
    window.open(zoomLink, "_blank");
  };

  const handleSessionBooked = (sessionType: string) => {
    console.log("Session booked:", sessionType);
    // You can show a toast or update state after booking if needed
    if (sessionType === "Recurring Session") {
      setShowRecurringSetupWizard(true);
    } else if (sessionType === "Single Session") {
      setShowBookingCalendar(true);
    }
  };

  const handleCloseSetupWizard = () => {
    setShowRecurringSetupWizard(false);
    setCurrentSetupStep(0); // Reset step when closing
  };

  // If recurring setup wizard should be shown, render it full-screen
  if (showRecurringSetupWizard) {
    return (
      <div className="min-h-screen bg-sage/5 dark:bg-sage/10">
        <DashboardHeader
          isSetupMode={true}
          currentStep={currentSetupStep}
          totalSteps={6}
          onExitSetup={handleCloseSetupWizard}
        />
        <div className="pt-4">
          <RecurringSessionsSetup
            onClose={handleCloseSetupWizard}
            onComplete={data => {
              setSubscriptionData(data);
              setHasPayAsYouGoSubscription(true);
              handleCloseSetupWizard();

              // Show success message
              setShowSuccessMessage(true);
              setTimeout(() => setShowSuccessMessage(false), 8000);
            }}
            onStepChange={setCurrentSetupStep}
          />
        </div>
      </div>
    );
  }

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
  const getSessionCategoryText = (session: ClientSession) => {
    return session.sessionCategory === "recurring"
      ? "Recurring Session"
      : "One-time Session";
  };

  // Helper function to capitalize status text
  const formatStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Message for Recurring Sessions Setup */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-green-800 font-semibold">
                🎉 Recurring Sessions Setup Successful!
              </h3>
              <p className="text-green-700 text-sm">
                Your recurring therapy sessions have been scheduled. You can see
                them in the "Upcoming Sessions" tab below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Client Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
            {getGreeting()} {getUserFirstName()},
          </h1>
          <p className="text-moss/70 dark:text-moss/80 mt-2 text-sm sm:text-base">
            You can manage your therapy sessions and track your progress.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <Button
            onClick={() => setShowIndividualSessionBooking(true)}
            className="w-full sm:w-auto bg-forest hover:bg-moss text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book Session
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-forest flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Sessions
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
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="p-2 sm:p-3 bg-forest/10 dark:bg-forest/20 rounded-full flex-shrink-0">
                            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-forest" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-forest text-base sm:text-lg leading-tight">
                              {new Date(session.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-moss font-medium text-sm sm:text-base">
                              {session.time} • {session.duration}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <SessionActions
                                session={session}
                                onCancel={handleCancelSession}
                                onReschedule={handleRescheduleSession}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleJoinZoom(session.zoomLink!)}
                            className={tailwindClasses.zoom.bg}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Zoom
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
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                      onClick={() => setShowIndividualSessionBooking(true)}
                      className="bg-forest hover:bg-moss dark:bg-forest dark:hover:bg-moss"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Book Individual / Recurring Session
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <SessionCalendar
            sessions={sessions}
            onJoinZoom={handleJoinZoom}
            onReschedule={id => handleRescheduleSession(id, false)}
            onCancel={id => handleCancelSession(id, false)}
          />
        </TabsContent>

        {/* Session History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-forest flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map(session => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-sage/30 dark:border-sage/20 rounded-lg hover:bg-sage/10 dark:hover:bg-sage/5 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {session.status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {session.status === "upcoming" && (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                          {session.status === "cancelled" && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          {session.status === "rescheduled" && (
                            <Edit className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-forest">
                            {formatFriendlyDate(session.date)} at {session.time}
                          </p>
                          <p className="text-sm text-moss">
                            {getSessionCategoryText(session)} •{" "}
                            {session.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-forest">
                          {session.amount}
                        </p>
                        <Badge
                          variant={
                            session.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-xs ${
                            session.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : session.status === "upcoming"
                                ? "bg-blue-100 text-blue-800"
                                : session.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {formatStatusText(session.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resources Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-forest flex items-center mb-2">
            <BookOpen className="h-6 w-6 mr-3" />
            Resources
          </h2>
          <p className="text-moss/70 dark:text-moss/80">
            Access your therapeutic materials and assignments
          </p>
        </div>

        {/* Responsive Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Therapeutic Framework Card */}
          <Card className="border-l-4 border-l-forest hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-forest flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Therapeutic Framework
              </CardTitle>
              <Badge className="w-fit bg-sage/20 text-forest border-sage/40">
                <CheckCircle className="h-3 w-3 mr-1" />
                Signed
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-moss/70 text-sm mb-4">
                Signed on May 23, 2025 at 11:00 AM
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTherapeuticFrame(true)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Breathing Exercises Card */}
          <Card className="border-l-4 border-l-slate-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-forest flex items-center text-lg">
                <Wind className="h-5 w-5 mr-2" />
                Breathing Exercises
              </CardTitle>
              <Badge className="w-fit bg-slate-100 text-slate-700 border-slate-300">
                New Assignment
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-moss/70 text-sm mb-4">
                Practice the 4-7-8 breathing technique daily for relaxation and
                anxiety management.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-moss">
                  <Target className="h-4 w-4 mr-2" />
                  Goal: 10 minutes daily
                </div>
                <div className="flex items-center text-sm text-moss">
                  <Calendar className="h-4 w-4 mr-2" />
                  Assigned: Dec 28, 2024
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-slate-500 hover:bg-slate-600 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Practice
              </Button>
            </CardContent>
          </Card>

          {/* Homework Assignment Card */}
          <Card className="border-l-4 border-l-teal-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-forest flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Weekly Homework
              </CardTitle>
              <Badge className="w-fit bg-teal-50 text-teal-700 border-teal-200">
                Due in 3 days
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-moss/70 text-sm mb-4">
                Complete the thought record worksheet and practice cognitive
                restructuring techniques.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-moss">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: Jan 3, 2025
                </div>
                <div className="flex items-center text-sm text-moss">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Not started
                </div>
              </div>
              <Button
                size="sm"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Start Assignment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Client-specific Modals */}
      {showBookingCalendar && (
        <BookingCalendar
          onClose={() => setShowBookingCalendar(false)}
          isTrialBooking={false}
        />
      )}

      {showIndividualSessionBooking && (
        <IndividualSessionBooking
          isOpen={showIndividualSessionBooking}
          onClose={() => setShowIndividualSessionBooking(false)}
          onSessionBooked={handleSessionBooked}
        />
      )}

      {showTherapeuticFrame && (
        <TherapeuticFrameViewer
          isOpen={showTherapeuticFrame}
          onClose={() => setShowTherapeuticFrame(false)}
          compact={false}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
