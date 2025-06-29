// Filename: PlanStatusBadge.tsx
// Role: Plan status indicator component
// Purpose: Displays current plan type and status with visual indicators for pay-as-you-go only
// Integration: Used in Dashboard header to show active plan

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  Pause,
  AlertTriangle,
  User,
} from "lucide-react";
import { PlanType } from "@/types/PlanManagementTypes";

interface PlanStatusBadgeProps {
  currentPlan: PlanType;
  planStatus: {
    isActive: boolean;
    isPaused?: boolean;
    nextPaymentDate?: Date;
    nextSessionDate?: Date;
    pricePerSession: number;
  };
  onManagePlan: () => void;
  compact?: boolean;
}

const PlanStatusBadge: React.FC<PlanStatusBadgeProps> = ({
  currentPlan,
  planStatus,
  onManagePlan,
  compact = false,
}) => {
  const getPlanIcon = () => {
    return currentPlan === "pay-as-you-go" ? (
      <Calendar className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );
  };

  const getPlanDisplayName = () => {
    return currentPlan === "pay-as-you-go"
      ? "Recurring Sessions"
      : "Individual Sessions";
  };

  const getStatusColor = () => {
    if (!planStatus.isActive)
      return "bg-gray-100 text-gray-700 border-gray-300";
    if (planStatus.isPaused)
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return currentPlan === "pay-as-you-go"
      ? "bg-purple-100 text-purple-700 border-purple-300"
      : "bg-forest/10 text-forest border-forest/30";
  };

  const getStatusIcon = () => {
    if (!planStatus.isActive) return <AlertTriangle className="h-3 w-3" />;
    if (planStatus.isPaused) return <Pause className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!planStatus.isActive) return "Inactive";
    if (planStatus.isPaused) return "Paused";
    return "Active";
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className={`${getStatusColor()} flex items-center space-x-1`}
        >
          {getPlanIcon()}
          <span className="font-medium">{getPlanDisplayName()}</span>
          {getStatusIcon()}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onManagePlan}
          className="text-moss/60 hover:text-moss"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-purple-25 dark:from-purple-900/10 dark:to-purple-800/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                currentPlan === "pay-as-you-go"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {getPlanIcon()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-forest">
                  {getPlanDisplayName()}
                </p>
                <Badge
                  variant="outline"
                  className={`${getStatusColor()} flex items-center space-x-1 text-xs`}
                >
                  {getStatusIcon()}
                  <span>{getStatusText()}</span>
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-moss/70">
                  ${planStatus.pricePerSession}/session
                </p>
                {currentPlan === "pay-as-you-go" &&
                  planStatus.nextPaymentDate && (
                    <p className="text-sm text-moss/70 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Next charge:{" "}
                      {planStatus.nextPaymentDate.toLocaleDateString()}
                    </p>
                  )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onManagePlan}
            className={`${
              currentPlan === "pay-as-you-go"
                ? "border-purple-300 text-purple-600 hover:bg-purple-100"
                : "border-forest/30 text-forest hover:bg-forest/10"
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            {currentPlan === "pay-as-you-go" ? "Manage Plan" : "Book Session"}
          </Button>
        </div>

        {/* Recurring Sessions specific information */}
        {currentPlan === "pay-as-you-go" && planStatus.nextSessionDate && (
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Next session: {planStatus.nextSessionDate.toLocaleDateString()} at{" "}
              {planStatus.nextSessionDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {planStatus.isPaused && (
          <div className="mt-3 pt-3 border-t border-yellow-200">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center">
              <Pause className="h-3 w-3 mr-1" />
              Billing is currently paused. Click "Manage Plan" to resume.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanStatusBadge;
