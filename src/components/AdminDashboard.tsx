// Filename: AdminDashboard.tsx
// Role: Main admin dashboard component for therapist interface
// Purpose: Provides therapist-focused dashboard matching client dashboard structure
// Integration: Used by Dashboard.tsx when in admin mode

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Users,
  Clock,
  BarChart3,
  Video,
  ExternalLink,
} from "lucide-react";
import { MOCK_DATA } from "@/constants";
import DashboardHeader from "@/components/DashboardHeader";

// Import admin-specific components
import {
  AdminUpcomingSessions,
  AdminSessionHistory,
  AdminCalendarView,
} from "@/components/admin/sessions";
import { AdminClientsList } from "@/components/admin/clients";
import AvailabilityManager from "@/components/admin/AvailabilityManager";
import TherapistProfile from "@/components/admin/TherapistProfile";

interface AdminDashboardProps {
  onSwitchToClient?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchToClient,
}) => {
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Function to get greeting based on current time
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get therapist's first name for greeting
  const getTherapistFirstName = () => {
    // In admin mode, always show the therapist's name from constants
    return MOCK_DATA.therapist.name.split(" ")[0]; // Returns "Silvia"
  };

  // Basic analytics data as requested
  const basicAnalytics = {
    totalEarnings: 42150.0,
    totalClients: 23,
    upcomingSessionsThisWeek: 12,
    monthlyRevenue: 4750.0,
    revenueGrowth: 21.5,
  };

  const handleSessionUpdate = (sessionId: number, action: string) => {
    console.log(`Admin action: ${action} on session ${sessionId}`);
    // Handle session updates from admin perspective
  };

  const handleViewClient = (clientId: string) => {
    console.log(`View client: ${clientId}`);
    // Handle client viewing
  };

  const handleEditClient = (clientId: string) => {
    console.log(`Edit client: ${clientId}`);
    // Handle client editing
  };

  const handleAddClient = () => {
    console.log("Add new client");
    // Handle adding new client
  };

  const handleViewNotes = (sessionId: number) => {
    console.log(`View notes for session: ${sessionId}`);
    // Handle viewing session notes
  };

  const handleEditSession = (sessionId: number) => {
    console.log(`Edit session: ${sessionId}`);
    // Handle editing session
  };

  const handleAddSession = (date: string) => {
    console.log(`Add session for date: ${date}`);
    // Handle adding new session
  };

  const handleStartInstantMeeting = () => {
    // Generate a quick Zoom meeting link or redirect to Zoom
    const instantMeetingLink = "https://zoom.us/start/videomeeting";
    window.open(instantMeetingLink, "_blank");
    console.log("Starting instant meeting");
  };

  const handleShowProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <>
      {/* Admin Dashboard Header - Same as client mode, OUTSIDE container */}
      <DashboardHeader isAdminMode={true} onShowProfile={handleShowProfile} />

      <div className="max-w-6xl mx-auto">
        {/* Admin Dashboard Welcome Section - Matching client structure exactly */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
              {getGreeting()} {getTherapistFirstName()},
            </h1>
            <p className="text-moss/70 dark:text-moss/80 mt-2 text-sm sm:text-base">
              You can manage all your sessions and clients from here.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={handleStartInstantMeeting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Start Instant Meeting
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Modern Analytics Cards */}
        {/*
          Grid tweaks:
          • Use 4 columns starting at the `lg` breakpoint (≥1024 px) instead of `xl` (≥1280 px).
          • Allow the featured card to span two columns only below `lg`; once we reach 4-column layout it should take a single column so that all four cards sit in one row.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings - Featured Card */}
          <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-sage/20 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-forest mb-1">
                  ${basicAnalytics.totalEarnings.toLocaleString()}
                </div>
                <div className="text-moss/60 text-sm font-medium">
                  Total Earnings
                </div>
              </div>
              <div className="w-10 h-10 bg-forest/5 rounded-xl flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-forest" />
              </div>
            </div>
          </div>

          {/* Total Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage/20 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-forest mb-1">
                  {basicAnalytics.totalClients}
                </div>
                <div className="text-moss/60 text-sm font-medium">Clients</div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Sessions This Week */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage/20 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-forest mb-1">
                  {basicAnalytics.upcomingSessionsThisWeek}
                </div>
                <div className="text-moss/60 text-sm font-medium">
                  Sessions This Week
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* This Month Revenue with Growth */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-sage/20 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-3xl font-bold text-forest mb-1">
                  ${basicAnalytics.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-moss/60 text-sm font-medium">
                  This Month Revenue
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                +{basicAnalytics.revenueGrowth}% growth
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs - Reordered as requested */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="history">Session History</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions Tab - Admin specific */}
          <TabsContent value="upcoming" className="space-y-4">
            <AdminUpcomingSessions onSessionUpdate={handleSessionUpdate} />
          </TabsContent>

          {/* Session History Tab - Admin specific */}
          <TabsContent value="history" className="space-y-4">
            <AdminSessionHistory
              onViewNotes={handleViewNotes}
              onEditSession={handleEditSession}
            />
          </TabsContent>

          {/* Clients Tab - Admin specific */}
          <TabsContent value="clients" className="space-y-4">
            <AdminClientsList
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onAddClient={handleAddClient}
            />
          </TabsContent>

          {/* Calendar View Tab - Admin specific */}
          <TabsContent value="calendar" className="space-y-4">
            <AdminCalendarView
              onAddSession={handleAddSession}
              onEditSession={handleEditSession}
            />
          </TabsContent>

          {/* Availability Management Tab - As specifically requested */}
          <TabsContent value="availability" className="space-y-4">
            <AvailabilityManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
          </DialogHeader>
          <TherapistProfile />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
