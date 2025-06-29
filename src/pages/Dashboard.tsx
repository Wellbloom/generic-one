import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ClientDashboard } from "@/components/client";
import { AdminDashboard } from "@/components/admin";

const DashboardContent = () => {
  // Admin mode state
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSwitchToAdmin = () => {
    setIsAdminMode(true);
  };

  const handleSwitchToClient = () => {
    setIsAdminMode(false);
  };

  // If admin mode is active, render the admin dashboard
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-sage/10 dark:bg-sage/5">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8 pt-28">
          <AdminDashboard />

          {/* Client Mode Toggle */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-3 p-3 bg-forest/5 dark:bg-forest/10 border border-forest/20 dark:border-forest/15 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-forest" />
                <span className="text-sm font-medium text-forest">
                  Client View:
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button
                  onClick={handleSwitchToClient}
                  variant="outline"
                  size="sm"
                  className="border-forest/30 text-forest hover:bg-forest hover:text-white w-full sm:w-auto"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Switch to Client View
                </Button>
                <span className="text-xs text-forest/60">
                  Switch to client interface to see their experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render client dashboard by default
  return (
    <div className="min-h-screen bg-sage/10 dark:bg-sage/5">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8 pt-28">
        <ClientDashboard onSwitchToAdmin={handleSwitchToAdmin} />

        {/* Admin Mode Toggle */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-3 p-3 bg-forest/5 dark:bg-forest/10 border border-forest/20 dark:border-forest/15 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium text-forest">
                Admin Access:
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Button
                onClick={handleSwitchToAdmin}
                variant="outline"
                size="sm"
                className="border-forest/30 text-forest hover:bg-forest hover:text-white w-full sm:w-auto"
              >
                <Shield className="h-4 w-4 mr-2" />
                Enter Admin Mode
              </Button>
              <span className="text-xs text-forest/60">
                Switch to therapist administrative interface
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
