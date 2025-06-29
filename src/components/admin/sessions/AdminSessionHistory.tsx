// Filename: AdminSessionHistory.tsx
// Role: Admin-specific session history component for therapist dashboard
// Purpose: Displays completed and past therapy sessions from therapist's perspective
// Integration: Used by AdminDashboard in the session history tab

import { useState } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Admin session history data structure
interface AdminSessionHistory {
  id: number;
  clientName: string;
  clientId: string;
  profileImage: string;
  date: string;
  time: string;
  duration: string;
  sessionFee: string;
  sessionType:
    | "Initial Consultation"
    | "Regular Session"
    | "Follow-up"
    | "Crisis Session"
    | "Cancellation Fee";
  status: "completed" | "cancelled" | "no-show" | "rescheduled";
  paymentStatus: "paid";
  sessionNotes?: string;
  isRecurring: boolean;
  actualDuration?: string;
}

interface AdminSessionHistoryProps {
  onViewNotes?: (sessionId: number) => void;
  onEditSession?: (sessionId: number) => void;
}

const AdminSessionHistory: React.FC<AdminSessionHistoryProps> = ({
  onViewNotes,
  onEditSession,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock admin session history data - No pending payments since all past sessions must be paid for
  const [sessionHistory] = useState<AdminSessionHistory[]>([
    {
      id: 1,
      clientName: "Sarah Johnson",
      clientId: "CLT-001",
      profileImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
      date: "2025-06-15",
      time: "2:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      sessionType: "Regular Session",
      status: "completed",
      paymentStatus: "paid",
      sessionNotes:
        "Session completed successfully. Good progress on anxiety management techniques.",
      isRecurring: true,
      actualDuration: "60 minutes",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      clientId: "CLT-002",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      date: "2025-06-14",
      time: "10:00 AM",
      duration: "60 minutes",
      sessionFee: "$50.00",
      sessionType: "Cancellation Fee",
      status: "cancelled",
      paymentStatus: "paid",
      sessionNotes:
        "Client cancelled with less than 24 hours notice. Cancellation fee charged and paid.",
      isRecurring: false,
      actualDuration: "0 minutes",
    },
    {
      id: 3,
      clientName: "Emily Rodriguez",
      clientId: "CLT-003",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      date: "2025-06-12",
      time: "4:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      sessionType: "Regular Session",
      status: "completed",
      paymentStatus: "paid",
      sessionNotes:
        "Session completed successfully. Client showed excellent progress with coping strategies.",
      isRecurring: true,
      actualDuration: "60 minutes",
    },
    {
      id: 4,
      clientName: "David Thompson",
      clientId: "CLT-004",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      date: "2025-06-11",
      time: "11:00 AM",
      duration: "60 minutes",
      sessionFee: "$50.00",
      sessionType: "Cancellation Fee",
      status: "cancelled",
      paymentStatus: "paid",
      sessionNotes:
        "Client cancelled last minute due to emergency. Cancellation fee applied and paid.",
      isRecurring: true,
      actualDuration: "0 minutes",
    },
    {
      id: 5,
      clientName: "Lisa Wang",
      clientId: "CLT-005",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b332c89c?w=400",
      date: "2025-06-11",
      time: "3:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      sessionType: "Regular Session",
      status: "no-show",
      paymentStatus: "paid",
      sessionNotes:
        "Client did not show up for scheduled session. Full session fee charged as per policy.",
      isRecurring: false,
      actualDuration: "0 minutes",
    },
    {
      id: 6,
      clientName: "James Wilson",
      clientId: "CLT-006",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      date: "2025-06-10",
      time: "1:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      sessionType: "Regular Session",
      status: "completed",
      paymentStatus: "paid",
      sessionNotes:
        "Productive session focused on stress management. Client engaged well.",
      isRecurring: true,
      actualDuration: "60 minutes",
    },
    {
      id: 7,
      clientName: "Maria Garcia",
      clientId: "CLT-007",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      date: "2025-06-09",
      time: "5:00 PM",
      duration: "60 minutes",
      sessionFee: "$79.00",
      sessionType: "Regular Session",
      status: "completed",
      paymentStatus: "paid",
      sessionNotes:
        "Session completed successfully. Client has been making consistent progress.",
      isRecurring: false,
      actualDuration: "60 minutes",
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "no-show":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "rescheduled":
        return <Edit className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        );
      case "no-show":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            No Show
          </Badge>
        );
      case "rescheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Rescheduled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    // For session history, all payments are "paid" since past sessions must be paid for
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
        Paid
      </Badge>
    );
  };

  const formatFriendlyDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredSessions = sessionHistory.filter(session => {
    const matchesSearch =
      session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate summary stats
  const completedSessions = sessionHistory.filter(
    s => s.status === "completed"
  ).length;
  const totalRevenue = sessionHistory
    .filter(s => s.status === "completed" && s.paymentStatus === "paid")
    .reduce((sum, s) => sum + parseFloat(s.sessionFee.replace("$", "")), 0);

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-forest flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Session History ({filteredSessions.length})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by client name, ID, or session type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSessions
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-5 bg-sage/15 dark:bg-sage/10 border border-sage/40 dark:border-sage/30 rounded-lg hover:bg-sage/20 dark:hover:bg-sage/15 transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={session.profileImage}
                          alt={session.clientName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-sage/20 text-forest font-medium">
                          {session.clientName
                            .split(" ")
                            .map(n => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Client Name at the top */}
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-semibold text-forest text-lg">
                          {session.clientName}
                        </p>
                        {session.isRecurring ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Recurring
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 text-gray-700 border-gray-200"
                          >
                            One-time
                          </Badge>
                        )}
                      </div>

                      {/* Date and Time */}
                      <p className="text-sm text-moss font-medium mb-1">
                        {formatFriendlyDate(session.date)} at {session.time}
                      </p>

                      {/* Duration - standardized to 60 minutes */}
                      <p className="text-xs text-moss/60">
                        Duration: 60 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-forest">
                        {session.sessionFee}
                      </p>
                      <div className="flex space-x-1 mt-1">
                        {getStatusBadge(session.status)}
                        {getPaymentBadge(session.paymentStatus)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {session.sessionNotes && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewNotes?.(session.id)}
                          className="hover:bg-forest/10"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessionHistory;
