// Filename: FinalConfirmation.tsx
// Role: Final confirmation step for Recurring Sessions subscription setup
// Purpose: Shows comprehensive summary of all user selections before completing setup with individual session billing
// Integration: Used in PayAsYouGoSetup.tsx as step 6 (final step) of the setup process

import React from "react";
import {
  CheckCircle,
  Calendar,
  CreditCard,
  Shield,
  Phone,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Mail,
  Heart,
  AlertCircle,
  Edit3,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  EmergencyContact,
  PaymentMethodInfo,
  TherapeuticFrameAgreement,
} from "@/types/PayAsYouGoTypes";
import { PRICING } from "@/constants";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  timeSlot: string;
  timezone: string;
  isEnabled: boolean;
}

interface PayAsYouGoFinalConfirmationProps {
  selectedSchedules: RecurringSchedule[];
  therapeuticAgreement: Partial<TherapeuticFrameAgreement> | null;
  paymentMethod: Partial<PaymentMethodInfo> | null;
  emergencyContacts: EmergencyContact[];
  onConfirm: () => void;
  isProcessing: boolean;
  onEditStep: (step: number) => void;
}

// Days of the week mapping
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Time formatting
const formatTime = (timeSlot: string) => {
  const [hours, minutes] = timeSlot.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

const PayAsYouGoFinalConfirmation: React.FC<
  PayAsYouGoFinalConfirmationProps
> = ({
  selectedSchedules,
  therapeuticAgreement,
  paymentMethod,
  emergencyContacts,
  onConfirm,
  isProcessing,
  onEditStep,
}) => {
  const enabledSchedules = selectedSchedules.filter(s => s.isEnabled);
  const primaryContact = emergencyContacts.find(c => c.isPrimary);
  const totalWeeklySessions = enabledSchedules.length;
  const estimatedMonthlyCost = totalWeeklySessions * 4 * 70; // Rough estimate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-forest/10 dark:bg-forest/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-forest">Review & Confirm</h2>
        </div>
        <p className="text-moss/70 dark:text-moss/80 mt-2">
          Please review your recurring sessions subscription details before
          confirming.
        </p>
      </div>

      {/* Subscription Summary */}
      <Card className="bg-gradient-to-r from-forest/5 to-sage/5 border-forest/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-forest">
            <DollarSign className="h-5 w-5" />
            <span>Subscription Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <Calendar className="h-8 w-8 text-forest mx-auto mb-2" />
              <p className="text-2xl font-bold text-forest">
                {totalWeeklySessions}
              </p>
              <p className="text-sm text-moss/70">Sessions per week</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-8 w-8 text-forest mx-auto mb-2" />
              <p className="text-2xl font-bold text-forest">${PRICING.recurringSession}</p>
              <p className="text-sm text-moss/70">Per session</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <Clock className="h-8 w-8 text-forest mx-auto mb-2" />
              <p className="text-2xl font-bold text-forest">$9</p>
              <p className="text-sm text-moss/70">Savings each session</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card className="border-sage/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-forest" />
              <span className="text-forest font-semibold">
                Your Weekly Schedule
              </span>
              <Badge className="bg-forest/10 text-forest border-forest/20">
                {totalWeeklySessions} session
                {totalWeeklySessions !== 1 ? "s" : ""}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(1)}
              className="text-forest border-forest/30 hover:bg-forest/10"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enabledSchedules.map((schedule, index) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-3 bg-sage/10 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-forest/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-forest">
                      {DAYS_OF_WEEK[schedule.dayOfWeek]}s
                    </p>
                    <p className="text-sm text-moss/70">
                      {formatTime(schedule.timeSlot)} ({schedule.timezone})
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  $70
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border-sage/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-forest" />
              <span className="text-forest font-semibold">Payment Method</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(4)}
              className="text-forest border-forest/30 hover:bg-forest/10"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Payment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethod?.id ? (
            <div className="flex items-center justify-between p-3 bg-sage/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-forest/10 rounded-lg">
                  <CreditCard className="h-4 w-4 text-forest" />
                </div>
                <div>
                  <p className="font-medium text-forest">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-moss/70">
                    {paymentMethod.brand?.toUpperCase()} • Expires{" "}
                    {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Verified
              </Badge>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Payment method will be set up during checkout
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="border-sage/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-forest" />
              <span className="text-forest font-semibold">
                Emergency Contacts
              </span>
              <Badge className="bg-forest/10 text-forest border-forest/20">
                {emergencyContacts.length} contact
                {emergencyContacts.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditStep(5)}
              className="text-forest border-forest/30 hover:bg-forest/10"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Contacts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map(contact => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-sage/10 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-forest/10 rounded-lg">
                    {contact.isPrimary ? (
                      <Heart className="h-4 w-4 text-red-500" />
                    ) : (
                      <Users className="h-4 w-4 text-forest" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-forest">{contact.name}</p>
                      {contact.isPrimary && (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-moss/70">
                      {contact.relationship} • {contact.phoneNumber}
                    </p>
                    {contact.email && (
                      <p className="text-sm text-moss/60">{contact.email}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Therapeutic Agreement Status */}
      <Card className="border-sage/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-forest" />
              <span className="text-forest font-semibold">
                Therapeutic Agreement
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(3)}
                className="text-forest border-forest/30 hover:bg-forest/10"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Agreement
              </Button>
              {therapeuticAgreement?.accepted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditStep(3)}
                  className="text-forest border-forest/30 hover:bg-forest/10"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Update
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {therapeuticAgreement?.accepted ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Agreement Signed</p>
                  <p className="text-sm text-green-700">
                    Signed on{" "}
                    {therapeuticAgreement.acceptedDate
                      ? new Date(
                          therapeuticAgreement.acceptedDate
                        ).toLocaleDateString()
                      : "today"}
                  </p>
                  {therapeuticAgreement.digitalSignature && (
                    <p className="text-sm text-green-700">
                      Digital signature: {therapeuticAgreement.digitalSignature}
                    </p>
                  )}
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Complete
              </Badge>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Agreement Pending</p>
                <p className="text-sm text-yellow-700">
                  Please complete the therapeutic agreement to proceed
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Schedule & Important Information */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <DollarSign className="h-5 w-5" />
            <span>Billing Schedule & Important Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Billing Schedule */}
          <div>
            <p className="font-medium text-yellow-800 mb-2">
              Your next charges:
            </p>
            <ul className="text-sm space-y-1 text-yellow-700">
              {enabledSchedules.slice(0, 3).map((schedule, index) => {
                const nextDate = new Date();
                nextDate.setDate(
                  nextDate.getDate() +
                    ((schedule.dayOfWeek - nextDate.getDay() + 7) % 7)
                );
                const chargeDate = new Date(nextDate);
                chargeDate.setDate(chargeDate.getDate() - 2); // 48 hours before

                return (
                  <li key={schedule.id} className="flex justify-between">
                    <span>
                      {DAYS_OF_WEEK[schedule.dayOfWeek]} session at{" "}
                      {formatTime(schedule.timeSlot)}
                    </span>
                    <span className="font-medium">
                      ${PRICING.recurringSession} on {chargeDate.toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
              {enabledSchedules.length > 3 && (
                <li className="text-yellow-600 font-medium">
                  ...and {enabledSchedules.length - 3} more sessions
                </li>
              )}
            </ul>
          </div>

          <Separator className="bg-yellow-300" />

          {/* Important Information */}
          <div>
            <p className="font-medium text-yellow-800 mb-2">
              Important Information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              <li>
                <strong>Billing:</strong> ${PRICING.recurringSession} charged 48 hours before each
                session • Email confirmations sent
              </li>
              <li>
                <strong>Flexibility:</strong> Modify, pause, or cancel anytime •
                24-hour cancellation required
              </li>
              <li>
                <strong>Privacy:</strong> All sessions confidential & HIPAA
                compliant • Emergency contacts used only when necessary
              </li>
              <li>
                <strong>Subscription:</strong> Continues until cancelled •
                Missed sessions without notice still charged
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayAsYouGoFinalConfirmation;
