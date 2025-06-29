// Filename: ClientDetailsModal.tsx
// Role: Modal dialog for displaying detailed client information
// Purpose: Shows comprehensive client details when therapist clicks on client name
// Integration: Used by AdminUpcomingSessions and AdminClientsList components

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  Edit,
  X,
  Save,
  CheckCircle,
  User,
} from "lucide-react";

// Simplified client data structure for detailed view
interface ClientDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  sessionHistory: {
    completedSessions: number;
    planType: "recurring" | "pay-as-you-go" | "none";
    nextSession: string | null;
    totalSpent: number;
  };
  therapyInfo: {
    startDate: string;
    sessionType: "recurring" | "one-time";
    preferredTime: string;
    notes: string;
  };
}

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  isOpen,
  onClose,
  clientId,
}) => {
  // Mock client data with actual profile images
  const [clientDetails] = useState<ClientDetails>({
    id: clientId,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=150&h=150&fit=crop&crop=face",
    emergencyContact: {
      name: "John Johnson",
      phone: "(555) 987-6543",
      relationship: "Spouse",
    },
    sessionHistory: {
      completedSessions: 8,
      planType: "recurring",
      nextSession: "January 3, 2025 at 2:00 PM",
      totalSpent: 1400,
    },
    therapyInfo: {
      startDate: "October 1, 2024",
      sessionType: "recurring",
      preferredTime: "Tuesdays at 2:00 PM",
      notes:
        "Working on anxiety management and stress reduction techniques. Responds well to CBT approaches. Shows good progress with mindfulness exercises.",
    },
  });

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(
    clientDetails.therapyInfo.notes
  );

  const handleSaveNotes = () => {
    // In a real app, this would save to the backend
    console.log("Saving notes:", editedNotes);
    setIsEditingNotes(false);
  };

  const handleCancelEditNotes = () => {
    setEditedNotes(clientDetails.therapyInfo.notes);
    setIsEditingNotes(false);
  };

  const getPlanTypeBadge = (planType: string) => {
    switch (planType) {
      case "recurring":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Recurring Plan
          </Badge>
        );
      case "pay-as-you-go":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Pay-as-you-go Plan
          </Badge>
        );
      case "none":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            No Active Plan
          </Badge>
        );
      default:
        return <Badge variant="secondary">{planType}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-forest">
            Client Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-r from-sage/20 to-sage/10 rounded-lg">
            <img
              src={clientDetails.profileImage}
              alt={clientDetails.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-semibold text-forest mb-3">
                {clientDetails.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Mail className="h-4 w-4 text-moss" />
                  <a
                    href={`mailto:${clientDetails.email}`}
                    className="text-moss hover:text-forest transition-colors"
                  >
                    {clientDetails.email}
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <Phone className="h-4 w-4 text-moss" />
                  <a
                    href={`tel:${clientDetails.phone}`}
                    className="text-moss hover:text-forest transition-colors"
                  >
                    {clientDetails.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Session Overview - Clean Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-forest mb-1">
                  {clientDetails.sessionHistory.completedSessions}
                </div>
                <div className="text-sm text-moss/70">Sessions Completed</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-forest mb-1">
                  ${clientDetails.sessionHistory.totalSpent}
                </div>
                <div className="text-sm text-moss/70">Total Spent</div>
              </CardContent>
            </Card>

            <Card className="text-center col-span-2">
              <CardContent className="p-4">
                <div className="mb-2">
                  {getPlanTypeBadge(clientDetails.sessionHistory.planType)}
                </div>
                <div className="text-sm text-moss/70">Current Plan</div>
              </CardContent>
            </Card>
          </div>

          {/* Next Session & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-forest text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Next Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clientDetails.sessionHistory.nextSession ? (
                  <p className="text-moss font-medium">
                    {clientDetails.sessionHistory.nextSession}
                  </p>
                ) : (
                  <p className="text-moss/60 italic">No upcoming sessions</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-forest text-lg">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium text-moss">
                    {clientDetails.emergencyContact.name}
                  </p>
                  <p className="text-sm text-moss/70">
                    {clientDetails.emergencyContact.relationship}
                  </p>
                  <a
                    href={`tel:${clientDetails.emergencyContact.phone}`}
                    className="text-sm text-moss hover:text-forest transition-colors"
                  >
                    {clientDetails.emergencyContact.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Therapy Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-forest">
                <Clock className="h-5 w-5 mr-2" />
                Therapy Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-moss mb-1">
                    Start Date
                  </p>
                  <p className="text-moss/80">
                    {clientDetails.therapyInfo.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-moss mb-1">
                    Session Type
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {clientDetails.therapyInfo.sessionType === "recurring"
                      ? "Recurring Sessions"
                      : "One-time Sessions"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-moss mb-1">
                    Preferred Time
                  </p>
                  <p className="text-moss/80">
                    {clientDetails.therapyInfo.preferredTime}
                  </p>
                </div>
              </div>

              {/* Therapist Notes - Editable */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-moss">
                    Therapist Notes
                  </p>
                  {!isEditingNotes && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editedNotes}
                      onChange={e => setEditedNotes(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Add your notes about this client..."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        className="bg-forest hover:bg-moss"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditNotes}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-sage/10 p-4 rounded-md">
                    <p className="text-moss/80 leading-relaxed">
                      {clientDetails.therapyInfo.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsModal;
