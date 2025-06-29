// Filename: AdminClientsList.tsx
// Role: Admin-specific clients list component for therapist dashboard
// Purpose: Displays all clients from therapist's perspective with management capabilities
// Integration: Used by AdminDashboard in the clients tab

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Plus,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Admin client data structure
interface AdminClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  joinDate: string;
  lastSession: string;
  nextSession?: string;
  totalSessions: number;
  sessionType: "Individual" | "Recurring";
  paymentStatus: "current" | "overdue" | "pending";
  totalSpent: number;
  status: "active" | "inactive" | "paused";
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface AdminClientsListProps {
  onViewClient?: (clientId: string) => void;
  onEditClient?: (clientId: string) => void;
  onAddClient?: () => void;
}

const AdminClientsList: React.FC<AdminClientsListProps> = ({
  onViewClient,
  onEditClient,
  onAddClient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Mock admin clients data
  const [clients] = useState<AdminClient[]>([
    {
      id: "CLT-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      profileImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      joinDate: "2024-01-15",
      lastSession: "2025-06-15",
      nextSession: "2025-06-22",
      totalSessions: 12,
      sessionType: "Recurring",
      paymentStatus: "current",
      totalSpent: 2100,
      status: "active",
      notes: "Making excellent progress with anxiety management",
      emergencyContact: {
        name: "John Johnson",
        phone: "(555) 123-4568",
        relationship: "Spouse",
      },
    },
    {
      id: "CLT-002",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "(555) 234-5678",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      joinDate: "2024-03-20",
      lastSession: "2025-06-14",
      totalSessions: 8,
      sessionType: "Individual",
      paymentStatus: "current",
      totalSpent: 1600,
      status: "active",
      notes: "Recently started treatment, showing good engagement",
    },
    {
      id: "CLT-003",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "(555) 345-6789",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      joinDate: "2023-11-10",
      lastSession: "2025-06-13",
      nextSession: "2025-06-20",
      totalSessions: 25,
      sessionType: "Recurring",
      paymentStatus: "overdue",
      totalSpent: 4375,
      status: "active",
      notes: "Long-term client, consistent progress",
      emergencyContact: {
        name: "Maria Rodriguez",
        phone: "(555) 345-6790",
        relationship: "Mother",
      },
    },
    {
      id: "CLT-004",
      name: "David Thompson",
      email: "david.thompson@email.com",
      phone: "(555) 456-7890",
      joinDate: "2024-05-05",
      lastSession: "2025-05-30",
      totalSessions: 6,
      sessionType: "Individual",
      paymentStatus: "pending",
      totalSpent: 1050,
      status: "paused",
      notes: "Temporarily paused sessions due to work travel",
    },
    {
      id: "CLT-005",
      name: "Lisa Wang",
      email: "lisa.wang@email.com",
      phone: "(555) 567-8901",
      joinDate: "2024-02-28",
      lastSession: "2025-06-11",
      nextSession: "2025-06-18",
      totalSessions: 15,
      sessionType: "Recurring",
      paymentStatus: "current",
      totalSpent: 2625,
      status: "active",
      notes: "Consistent attendance, working on depression symptoms",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "current":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
            Current
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {paymentStatus}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || client.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate summary stats
  const activeClients = clients.filter(c => c.status === "active").length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const overduePayments = clients.filter(
    c => c.paymentStatus === "overdue"
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-moss">Total Clients</p>
                <p className="text-2xl font-bold text-forest">
                  {clients.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-moss">Active Clients</p>
                <p className="text-2xl font-bold text-forest">
                  {activeClients}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-moss">Total Revenue</p>
                <p className="text-2xl font-bold text-forest">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-moss">
                  Overdue Payments
                </p>
                <p className="text-2xl font-bold text-forest">
                  {overduePayments}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-forest flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Clients ({filteredClients.length})
            </CardTitle>
            <Button
              onClick={onAddClient}
              className="bg-forest hover:bg-moss text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or client ID..."
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
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={paymentFilter}
                onChange={e => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="all">All Payments</option>
                <option value="current">Current</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className="p-4 border border-sage/30 dark:border-sage/20 rounded-lg hover:bg-sage/10 dark:hover:bg-sage/5 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-forest/10 rounded-full flex-shrink-0">
                      <User className="h-6 w-6 text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-forest text-lg">
                          {client.name}
                        </h3>
                        <span className="text-sm text-moss/60">
                          ({client.id})
                        </span>
                        {getStatusBadge(client.status)}
                        {getPaymentBadge(client.paymentStatus)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-moss">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <a
                              href={`mailto:${client.email}`}
                              className="hover:text-forest transition-colors"
                            >
                              {client.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <a
                              href={`tel:${client.phone}`}
                              className="hover:text-forest transition-colors"
                            >
                              {client.phone}
                            </a>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Joined: {formatDate(client.joinDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              Total Spent: ${client.totalSpent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-moss/70">
                        <span>Sessions: {client.totalSessions}</span>
                        <span>Type: {client.sessionType}</span>
                        <span>
                          Last Session: {formatDate(client.lastSession)}
                        </span>
                        {client.nextSession && (
                          <span className="text-forest font-medium">
                            Next: {formatDate(client.nextSession)}
                          </span>
                        )}
                      </div>

                      {client.notes && (
                        <div className="mt-3 p-2 bg-white/50 dark:bg-black/10 rounded text-sm text-moss/80">
                          <span className="font-medium">Notes:</span>{" "}
                          {client.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewClient?.(client.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClient?.(client.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
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

export default AdminClientsList;
