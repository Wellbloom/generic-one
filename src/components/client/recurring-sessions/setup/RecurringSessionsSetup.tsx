// Filename: RecurringSessionsSetup.tsx
// Role: Main client recurring sessions setup wizard
// Purpose: Guides clients through multi-step setup process for recurring therapy sessions with individual billing
// Integration: Primary entry point for client recurring sessions functionality, used in ClientDashboard

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  CreditCard,
  Shield,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// Removed Dialog imports - now using full-screen layout
import ScheduleSelector from "./ScheduleSelector";
import PricingConfirmation from "./PricingConfirmation";
import TherapeuticAgreement from "./TherapeuticAgreement";
import PaymentMethod from "./PaymentMethod";
import EmergencyContact from "./EmergencyContact";
import FinalConfirmation from "./FinalConfirmation";
import {
  TherapeuticFrameAgreement,
  PaymentMethodInfo,
  EmergencyContact as EmergencyContactType,
} from "@/types/PayAsYouGoTypes";

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  timeSlot: string;
  timezone: string;
  isEnabled: boolean;
}

interface RecurringSessionsSetupProps {
  onClose: () => void;
  onComplete: (subscriptionData: any) => void;
  onStepChange?: (step: number) => void;
}

const RecurringSessionsSetup: React.FC<RecurringSessionsSetupProps> = ({
  onClose,
  onComplete,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<
    RecurringSchedule[]
  >([]);
  const [agreementData, setAgreementData] =
    useState<Partial<TherapeuticFrameAgreement> | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<Partial<PaymentMethodInfo> | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContactType[]
  >([]);

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Flag to prevent scroll when agreement is signed
  const [preventScroll, setPreventScroll] = useState(false);

  // Removed auto-progression - user must manually click Next button

  const steps = [
    { title: "Schedule Selection", icon: <Calendar className="h-5 w-5" /> },
    { title: "Pricing Plan", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Therapeutic Agreement", icon: <Shield className="h-5 w-5" /> },
    { title: "Payment Method", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Emergency Contact", icon: <Phone className="h-5 w-5" /> },
    { title: "Confirmation", icon: <CheckCircle className="h-5 w-5" /> },
  ];

  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  // Scroll to top when component mounts or step changes (but not when agreement is signed)
  useEffect(() => {
    if (scrollContainerRef.current && !preventScroll) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Reset prevent scroll flag after handling
    if (preventScroll) {
      setPreventScroll(false);
    }
  }, [currentStep, preventScroll]);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: // Schedule Selection
        return selectedSchedules.filter(s => s.isEnabled).length > 0;
      case 2: // Therapeutic Agreement
        return agreementData?.accepted === true;
      case 3: // Payment Method
        return true; // Allow mock data for testing
      case 4: // Emergency Contact (Optional)
        return true; // Emergency contacts are now optional
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1 && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when moving to previous step
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleAgreementSign = (
    agreement: Partial<TherapeuticFrameAgreement>
  ) => {
    // Set prevent scroll flag to avoid jumping to top when agreement is signed
    setPreventScroll(true);
    setAgreementData(agreement);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      // Generate upcoming sessions for the next 4 occurrences of each enabled schedule
      const upcomingSessions = [];
      const enabledSchedules = selectedSchedules.filter(s => s.isEnabled);

      enabledSchedules.forEach(schedule => {
        const now = new Date();

        // Generate next 4 sessions for this schedule
        for (let i = 0; i < 4; i++) {
          const currentDay = now.getDay();
          let daysUntilTarget = (schedule.dayOfWeek - currentDay + 7) % 7;
          if (daysUntilTarget === 0 && i === 0) daysUntilTarget = 7; // If today, start next week

          const sessionDate = new Date(now);
          sessionDate.setDate(now.getDate() + daysUntilTarget + i * 7);

          // Set the time
          const [hours, minutes] = schedule.timeSlot.split(":").map(Number);
          sessionDate.setHours(hours, minutes, 0, 0);

          const newSession = {
            id: `session-${schedule.id}-${i}`,
            date: sessionDate,
            dayOfWeek: schedule.dayOfWeek,
            timeSlot: schedule.timeSlot,
            timezone: schedule.timezone,
            status: "scheduled",
            amount: 79,
            duration: 60, // minutes
            type: "recurring",
            zoomLink: `https://zoom.us/j/recurring${Date.now()}${i}`,
          };

          upcomingSessions.push(newSession);
        }
      });

      // Sort sessions by date
      upcomingSessions.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Include actual schedule and pricing data
      const subscriptionData = {
        schedules: enabledSchedules,
        upcomingSessions: upcomingSessions,
        pricing: {
          pricePerSession: 79, // Standard price
        },
        therapeuticAgreement: agreementData,
        paymentMethod: paymentMethod,
        emergencyContacts: emergencyContacts,
      };

      await onComplete(subscriptionData);
      onClose();
    } catch (error) {
      console.error(
        "❌ RecurringSessionsSetup: Error creating subscription:",
        error
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage/5 dark:bg-sage/10 flex flex-col">
      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 0 ? (
              <ScheduleSelector
                selectedSchedules={selectedSchedules}
                onSchedulesChange={setSelectedSchedules}
                maxSchedules={7}
                errors={[]}
              />
            ) : currentStep === 1 ? (
              <PricingConfirmation selectedSchedules={selectedSchedules} />
            ) : currentStep === 2 ? (
              <TherapeuticAgreement
                onAgreementSign={handleAgreementSign}
                isSigned={agreementData?.accepted === true}
                agreementData={agreementData}
              />
            ) : currentStep === 3 ? (
              <PaymentMethod
                onPaymentMethodSave={setPaymentMethod}
                savedPaymentMethod={paymentMethod}
                errors={[]}
              />
            ) : currentStep === 4 ? (
              <EmergencyContact
                onContactsSave={setEmergencyContacts}
                savedContacts={emergencyContacts}
                errors={[]}
              />
            ) : currentStep === 5 ? (
              <FinalConfirmation
                selectedSchedules={selectedSchedules}
                therapeuticAgreement={agreementData}
                paymentMethod={paymentMethod}
                emergencyContacts={emergencyContacts}
                onConfirm={handleSubmit}
                isProcessing={isProcessing}
                onEditStep={step => {
                  setCurrentStep(step);
                  // Scroll to top when jumping to a step
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-forest">
                    {steps[currentStep].icon}
                    <span>{steps[currentStep].title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center">
                    <p className="text-moss/70 mb-4">
                      Step {currentStep + 1}: {steps[currentStep].title}
                    </p>
                    <p className="text-sm text-moss/60">
                      This is where the {steps[currentStep].title.toLowerCase()}{" "}
                      component would be rendered.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-sage/30 dark:border-sage/20 px-6 py-6 pb-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStep === 0 || isProcessing}
            size="lg"
            className="border-moss/30 text-moss hover:bg-moss/10 px-6 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                size="lg"
                className="bg-forest text-white hover:bg-forest/90 px-8 py-3"
              >
                {isProcessing ? "Processing..." : "Complete Setup"}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                disabled={!canProceedToNextStep() || isProcessing}
                size="lg"
                className="bg-forest text-white hover:bg-forest/90 px-8 py-3"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecurringSessionsSetup;
