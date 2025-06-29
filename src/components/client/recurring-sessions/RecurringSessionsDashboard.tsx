// Filename: RecurringSessionsDashboard.tsx
// Role: Client recurring sessions subscription management dashboard
// Purpose: Displays active subscriptions, upcoming sessions, billing info, and management controls with individual session billing
// Integration: Used in ClientDashboard component when client has recurring sessions subscriptions

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Pause,
  Play,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Video,
  ExternalLink,
  Plus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecurringSessionsSetup } from "./setup";
import TherapeuticFrameViewer from "../../TherapeuticFrameViewer";
import { tailwindClasses } from "@/styles/colors";
import { PRICING } from "@/constants";

interface RecurringSessionsSubscription {
  id: string;
  isActive: boolean;
  isPaused: boolean;
  recurringSchedule: {
    dayOfWeek: number;
    timeSlot: string;
    frequency: string;
  };
  billing: {
    pricePerSession: number;
    nextChargeDate: Date;
    lastChargedDate?: Date;
  };
  nextSessionDate: Date;
  upcomingSessions?: Array<{
    id: string;
    date: Date;
    dayOfWeek: number;
    timeSlot: string;
    timezone: string;
    status: string;
    amount: number;
    duration: number;
    type: string;
    zoomLink?: string;
  }>;
  sessionHistory: Array<{
    id: string;
    date: Date;
    status: string;
    amount: number;
  }>;
}

interface RecurringSessionsDashboardProps {
  onCreateSubscription?: () => void;
  initialSubscriptionData?: any;
}

const RecurringSessionsDashboard: React.FC<RecurringSessionsDashboardProps> = ({
  onCreateSubscription,
  initialSubscriptionData,
}) => {
  const [activeSubscription, setActiveSubscription] =
    useState<RecurringSessionsSubscription | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showTherapeuticFrame, setShowTherapeuticFrame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize subscription data
  useEffect(() => {
    console.log("🏊 RecurringSessionsDashboard: useEffect called");
    console.log(
      "🏊 RecurringSessionsDashboard: initialSubscriptionData:",
      initialSubscriptionData
    );

    if (initialSubscriptionData) {
      console.log(
        "🏊 RecurringSessionsDashboard: Using provided subscription data"
      );
      // Use the real subscription data from setup
      const newSubscription: RecurringSessionsSubscription = {
        id: `sub_recurring_${Date.now()}`,
        isActive: true,
        isPaused: false,
        recurringSchedule: {
          dayOfWeek: initialSubscriptionData.schedules[0]?.dayOfWeek || 1,
          timeSlot: initialSubscriptionData.schedules[0]?.timeSlot || "14:00",
          frequency: "weekly",
        },
        billing: {
          pricePerSession:
            initialSubscriptionData.pricing?.pricePerSession || 79,
          nextChargeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        nextSessionDate:
          initialSubscriptionData.upcomingSessions?.[0]?.date || new Date(),
        upcomingSessions: initialSubscriptionData.upcomingSessions || [],
        sessionHistory: [],
      };

      console.log(
        "🏊 RecurringSessionsDashboard: Created subscription from setup data:",
        newSubscription
      );
      setActiveSubscription(newSubscription);
      setIsLoading(false);
    } else {
      console.log(
        "🏊 RecurringSessionsDashboard: No initial data, using mock data"
      );
      // Simulate loading subscription data with mock data
      setTimeout(() => {
        // Mock active subscription
        const mockSubscription: RecurringSessionsSubscription = {
          id: "sub_payg_123",
          isActive: true,
          isPaused: false,
          recurringSchedule: {
            dayOfWeek: 2, // Tuesday
            timeSlot: "14:00",
            frequency: "weekly",
          },
          billing: {
            pricePerSession: 79,
            nextChargeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            lastChargedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          },
          nextSessionDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
          sessionHistory: [
            {
              id: "sess_1",
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              status: "completed",
              amount: 79,
            },
            {
              id: "sess_2",
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              status: "completed",
              amount: 79,
            },
            {
              id: "sess_3",
              date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
              status: "completed",
              amount: 79,
            },
          ],
        };
        console.log(
          "🏊 RecurringSessionsDashboard: Using mock subscription data:",
          mockSubscription
        );
        setActiveSubscription(mockSubscription);
        setIsLoading(false);
      }, 1000);
    }
  }, [initialSubscriptionData]);

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
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? "PM" : "AM";
    return `${hour12}:${minutes} ${period}`;
  };

  const handleCreateSubscription = async (subscriptionData: any) => {
    console.log("Creating Recurring Sessions subscription:", subscriptionData);

    // Create the subscription with the upcoming sessions
    const newSubscription: RecurringSessionsSubscription = {
      id: `sub_recurring_${Date.now()}`,
      isActive: true,
      isPaused: false,
      recurringSchedule: {
        dayOfWeek: subscriptionData.schedules[0]?.dayOfWeek || 1,
        timeSlot: subscriptionData.schedules[0]?.timeSlot || "14:00",
        frequency: "weekly",
      },
      billing: {
        pricePerSession: subscriptionData.pricing.pricePerSession,
        nextChargeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      nextSessionDate: subscriptionData.upcomingSessions[0]?.date || new Date(),
      upcomingSessions: subscriptionData.upcomingSessions || [],
      sessionHistory: [],
    };

    // Set the active subscription
    setActiveSubscription(newSubscription);
    setShowSetupModal(false);
    setIsLoading(false);

    if (onCreateSubscription) {
      onCreateSubscription();
    }
  };

  const handlePauseSubscription = () => {
    if (activeSubscription) {
      setActiveSubscription({
        ...activeSubscription,
        isPaused: true,
      });
    }
  };

  const handleResumeSubscription = () => {
    if (activeSubscription) {
      setActiveSubscription({
        ...activeSubscription,
        isPaused: false,
      });
    }
  };

  const handleJoinZoom = () => {
    window.open("https://zoom.us/j/payasyougo123", "_blank");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-sage/20 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-sage/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No active subscription - show setup
  if (!activeSubscription) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="p-4 bg-forest/10 dark:bg-forest/20 rounded-full w-16 h-16 mx-auto mb-4">
            <Calendar className="h-8 w-8 text-forest mx-auto mt-1" />
          </div>
          <h3 className="text-xl font-semibold text-forest mb-2">
            Start Your Recurring Sessions Journey
          </h3>
          <p className="text-moss/70 dark:text-moss/80 mb-6 max-w-md mx-auto">
            Set up recurring therapy sessions with flexible scheduling and
            individual session billing. Pay only for the sessions you attend.
          </p>
          <Button
            onClick={() => setShowSetupModal(true)}
            className="bg-forest hover:bg-moss text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Setup Recurring Sessions
          </Button>
        </div>

        {/* Setup Modal */}
        {showSetupModal && (
          <RecurringSessionsSetup
            onClose={() => setShowSetupModal(false)}
            onComplete={handleCreateSubscription}
          />
        )}
      </div>
    );
  }

  // Active subscription dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-forest">
            Recurring Sessions Dashboard
          </h2>
          <p className="text-moss/70 dark:text-moss/80">
            Manage your recurring therapy sessions with individual session
            billing
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowManageModal(true)}
            className="border-forest/30 text-forest hover:bg-forest/10"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          {activeSubscription.isPaused ? (
            <Button
              onClick={handleResumeSubscription}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handlePauseSubscription}
              className="border-orange-300 text-orange-700 hover:bg-orange/10"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
        </div>
      </div>

      {/* Status Alert */}
      {activeSubscription.isPaused && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <Pause className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700 dark:text-orange-400">
            Your subscription is paused. No sessions will be scheduled or
            charged until you resume.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Next Session */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-moss truncate">
                  Next Session
                </p>
                <p className="text-lg sm:text-lg font-bold text-forest">
                  {activeSubscription.nextSessionDate.toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-xs text-moss/60 truncate">
                  {daysOfWeek[activeSubscription.recurringSchedule.dayOfWeek]}{" "}
                  at {formatTime(activeSubscription.recurringSchedule.timeSlot)}
                </p>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Next Payment */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-moss truncate">
                  Next Payment
                </p>
                <p className="text-lg sm:text-lg font-bold text-forest">
                  ${activeSubscription.billing.pricePerSession}
                </p>
                <p className="text-xs text-moss/60 truncate">
                  {activeSubscription.billing.nextChargeDate.toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-moss truncate">
                  Schedule
                </p>
                <p className="text-lg sm:text-lg font-bold text-forest">
                  {activeSubscription.recurringSchedule.frequency}
                </p>
                <p className="text-xs text-moss/60 truncate">
                  {daysOfWeek[activeSubscription.recurringSchedule.dayOfWeek]}s
                </p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-l-4 border-l-forest">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-moss truncate">Status</p>
                <div className="flex items-center space-x-2">
                  {activeSubscription.isPaused ? (
                    <>
                      <Pause className="h-4 w-4 text-orange-500" />
                      <span className="text-lg font-bold text-orange-600">
                        Paused
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-bold text-green-600">
                        Active
                      </span>
                    </>
                  )}
                </div>
              </div>
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-forest flex-shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Therapeutic Framework Agreement - Prominently Displayed */}
      <div className="mb-6">
        <TherapeuticFrameViewer
          isOpen={false}
          onClose={() => {}}
          compact={true}
          onViewFull={() => setShowTherapeuticFrame(true)}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Upcoming Sessions */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-forest flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Sessions
                {activeSubscription.upcomingSessions && (
                  <Badge className="ml-2 bg-forest/10 text-forest border-forest/20">
                    {activeSubscription.upcomingSessions.length} scheduled
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!activeSubscription.isPaused ? (
                <div className="space-y-4">
                  {activeSubscription.upcomingSessions &&
                  activeSubscription.upcomingSessions.length > 0 ? (
                    activeSubscription.upcomingSessions
                      .slice(0, 4)
                      .map((session, index) => {
                        return (
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
                                    {formatTime(session.timeSlot)} •{" "}
                                    {session.duration} minutes
                                  </p>
                                  <p className="text-sm text-moss/70">
                                    ${session.amount} • {session.type} session
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                {session.zoomLink && (
                                  <Button
                                    onClick={() =>
                                      window.open(session.zoomLink, "_blank")
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto text-sm sm:text-base"
                                  >
                                    <Video className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">
                                      Join Zoom
                                    </span>
                                    <span className="sm:hidden">Join</span>
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                )}
                                <Badge
                                  className={`${
                                    index === 0
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-blue-100 text-blue-800 border-blue-200"
                                  }`}
                                >
                                  {index === 0 ? "Next Session" : "Upcoming"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-moss/50 mx-auto mb-4" />
                      <p className="text-moss/70 dark:text-moss/80 text-lg mb-4">
                        No upcoming sessions scheduled
                      </p>
                      <p className="text-sm text-moss/60 mb-4">
                        Your recurring sessions will appear here once scheduled
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pause className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-moss/70 dark:text-moss/80 text-lg mb-4">
                    Subscription is paused
                  </p>
                  <p className="text-sm text-moss/60 mb-4">
                    Resume your subscription to schedule new sessions
                  </p>
                  <Button
                    onClick={handleResumeSubscription}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume Subscription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session History */}
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
                {activeSubscription.sessionHistory.map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-sage/30 dark:border-sage/20 rounded-lg hover:bg-sage/10 dark:hover:bg-sage/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-forest">
                          {session.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-moss">
                          Recurring Session • 60 minutes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-forest">
                        ${session.amount}
                      </p>
                      <Badge className="text-xs bg-green-100 text-green-800">
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-forest flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 sm:p-4 bg-sage/10 dark:bg-sage/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-forest text-sm sm:text-base">
                        Price per Session
                      </span>
                      <span className="text-lg font-bold text-forest">
                        ${activeSubscription.billing.pricePerSession}
                      </span>
                    </div>
                    <p className="text-sm text-moss/70">
                      Charged automatically 48 hours before each session
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-moss text-sm sm:text-base">
                        Next Charge
                      </span>
                      <span className="font-medium text-forest text-sm sm:text-base">
                        {activeSubscription.billing.nextChargeDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-moss text-sm sm:text-base">
                        Last Charged
                      </span>
                      <span className="font-medium text-forest text-sm sm:text-base">
                        {activeSubscription.billing.lastChargedDate?.toLocaleDateString() ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-forest flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-moss text-sm sm:text-base">
                      Sessions This Month
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-forest">
                      3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-moss text-sm sm:text-base">
                      Total Spent
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-forest">
                      $237
                    </span>
                  </div>
                  <div className="text-center pt-4 border-t border-sage/30">
                    <p className="text-sm text-moss/70">
                      Average cost per session: ${PRICING.recurringSession}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Therapeutic Framework Agreement Modal */}
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

export default RecurringSessionsDashboard;
