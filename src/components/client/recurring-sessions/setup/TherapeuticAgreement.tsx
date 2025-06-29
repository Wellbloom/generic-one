// Filename: TherapeuticAgreement.tsx
// Role: Interactive therapeutic agreement signing component
// Purpose: Allows users to read, acknowledge key terms, and digitally sign the therapeutic agreement.
// Integration: Used in PayAsYouGoSetup.tsx as step 3 of the setup process.

import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  FileText,
  Check,
  Edit,
  AlertTriangle,
  Lock,
  MessageSquare,
  Repeat,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TherapeuticFrameAgreement } from "@/types/PayAsYouGoTypes";
import { AppNotifications } from "@/utils/NotificationService";

// This would typically come from a service or CMS
const agreementContent = {
  version: "v2.2.0",
  title: "Therapeutic Framework & Consent",
  text: `
    <p>Welcome to your therapeutic journey. This document outlines the framework of our professional relationship, ensuring clarity, safety, and mutual understanding. By signing, you agree to these terms.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">1. Confidentiality</h3>
    <p>Your privacy is paramount. Everything you share is strictly confidential, except where disclosure is required by law (e.g., risk of harm to self or others, child protection concerns). All your data is managed in compliance with HIPAA standards.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">2. Sessions & Scheduling</h3>
    <p>Sessions are 50 minutes long and will occur at the recurring times you have selected. Punctuality is appreciated to make the most of our time together.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">3. Payment & Billing</h3>
    <p>You will be billed on a pay-as-you-go basis. Your payment method will be charged automatically 48 hours before each scheduled session. This is an ongoing subscription tied to your recurring schedule.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">4. Cancellation Policy</h3>
    <p>A minimum of 24 hours' notice is required to cancel or reschedule a session. Cancellations made with less than 24 hours' notice, or missed sessions, will be charged the full session fee.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">5. Communication</h3>
    <p>Communication between sessions will be limited to scheduling or administrative matters. We will not engage in therapeutic work via email or text message to ensure the integrity of the process.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">6. Emergency Procedures</h3>
    <p>This service is not for crisis support. If you are experiencing a mental health crisis, please call 911 or go to your nearest emergency room. You agree that we may contact your emergency contact if we have a serious concern for your safety.</p>
    <h3 class="font-bold mt-4 mb-2 text-forest">7. Consent to Treatment</h3>
    <p>By signing this agreement, you voluntarily consent to receive psychotherapy services. You understand that you have the right to withdraw your consent and terminate therapy at any time.</p>
  `,
};

const keyTerms = [
  {
    id: "confidentialityPolicy",
    label: "I understand the confidentiality policy.",
    icon: <Lock className="h-5 w-5 text-forest" />,
  },
  {
    id: "recurringBilling",
    label: "I agree to the recurring, per-session billing.",
    icon: <Repeat className="h-5 w-5 text-forest" />,
  },
  {
    id: "cancellationPolicy",
    label: "I accept the 24-hour cancellation policy.",
    icon: <Bell className="h-5 w-5 text-forest" />,
  },
  {
    id: "emergencyProtocol",
    label: "I acknowledge this is not a crisis service.",
    icon: <AlertTriangle className="h-5 w-5 text-forest" />,
  },
];

interface PayAsYouGoTherapeuticAgreementProps {
  onAgreementSign: (agreement: Partial<TherapeuticFrameAgreement>) => void;
  isSigned: boolean;
  agreementData?: Partial<TherapeuticFrameAgreement> | null;
}

const PayAsYouGoTherapeuticAgreement: React.FC<
  PayAsYouGoTherapeuticAgreementProps
> = ({ onAgreementSign, isSigned, agreementData }) => {
  const [acknowledged, setAcknowledged] = useState({
    confidentialityPolicy: false,
    recurringBilling: false,
    cancellationPolicy: false,
    emergencyProtocol: false,
    recordingConsent: false, // Defaulted as per type, though not shown
    noShowPolicy: false, // Covered by cancellation
  });
  const [signature, setSignature] = useState("");
  const [showError, setShowError] = useState(false);

  const allTermsAcknowledged = keyTerms.every(term => acknowledged[term.id]);
  const isFormComplete = allTermsAcknowledged && signature.trim() !== "";

  const handleAcknowledgeChange = (id: string, checked: boolean) => {
    setAcknowledged(prev => ({ ...prev, [id]: checked }));
  };

  const handleSign = () => {
    if (!isFormComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // Show success toast notification
    AppNotifications.agreementSigned();

    onAgreementSign({
      accepted: true,
      acceptedDate: new Date(),
      documentVersion: agreementContent.version,
      digitalSignature: signature.trim(),
      agreementText: agreementContent.text,
      keyTermsAcknowledged: {
        ...acknowledged,
        cancellationPolicy: acknowledged.cancellationPolicy,
        noShowPolicy: acknowledged.cancellationPolicy, // Link these two
      },
    });
  };

  useEffect(() => {
    if (isFormComplete) {
      setShowError(false);
    }
  }, [isFormComplete]);

  return (
    <div className="space-y-6">
      {/* Show signed status if signed */}
      {isSigned && (
        <Alert className="border-green-300 bg-green-50 text-green-900">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="font-semibold">Agreement Signed</AlertTitle>
          <AlertDescription>
            Thank you. Your therapeutic agreement has been securely saved.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-forest">
            <Shield className="mr-2 h-5 w-5" />
            {agreementContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border border-sage/50 bg-white/50 p-4">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: agreementContent.text }}
            />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-forest">
            Acknowledgement of Key Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyTerms.map(term => (
            <div key={term.id} className="flex items-center space-x-3">
              {term.icon}
              <Checkbox
                id={term.id}
                checked={isSigned || acknowledged[term.id]}
                onCheckedChange={checked =>
                  !isSigned && handleAcknowledgeChange(term.id, !!checked)
                }
                disabled={isSigned}
              />
              <Label htmlFor={term.id} className="text-moss/90">
                {term.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-forest">
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="signature">
            {isSigned
              ? "Signed by:"
              : "Please type your full name to sign this agreement."}
          </Label>
          <div className="relative mt-2">
            <Edit className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
            <Input
              id="signature"
              placeholder="Your Full Name"
              value={signature}
              onChange={e => !isSigned && setSignature(e.target.value)}
              className="pl-9"
              disabled={isSigned}
            />
          </div>

          {/* Show signed confirmation under digital signature when signed */}
          {isSigned && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Agreement Successfully Signed
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Signed on{" "}
                    {agreementData?.acceptedDate
                      ? new Date(
                          agreementData.acceptedDate
                        ).toLocaleDateString()
                      : "today"}{" "}
                    • Document version {agreementContent.version}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showError && !isSigned && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete</AlertTitle>
          <AlertDescription>
            Please acknowledge all key terms and provide your digital signature
            to continue.
          </AlertDescription>
        </Alert>
      )}

      {!isSigned && (
        <div className="flex justify-end">
          <Button
            onClick={handleSign}
            disabled={!isFormComplete}
            size="lg"
            className="bg-forest text-white hover:bg-forest/90"
          >
            <Check className="mr-2 h-4 w-4" />
            Agree & Sign
          </Button>
        </div>
      )}
    </div>
  );
};

export default PayAsYouGoTherapeuticAgreement;
