// Filename: TherapeuticFrameViewer.tsx
// Role: Therapeutic Frame Agreement viewer and management
// Purpose: Displays signed therapeutic agreements with easy access and review capabilities
// Integration: Used in Dashboard and Plan Management for transparency and legal compliance

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  CheckCircle,
  Calendar,
  User,
  Shield,
  Download,
  Eye,
  AlertTriangle,
  Info,
  Lock,
  Signature,
} from "lucide-react";
import { TherapeuticFrameAgreement } from "@/types/PayAsYouGoTypes";

interface TherapeuticFrameViewerProps {
  isOpen: boolean;
  onClose: () => void;
  agreement?: TherapeuticFrameAgreement | null;
  compact?: boolean;
  onViewFull?: () => void;
}

// Mock therapeutic frame agreement data
const mockAgreement: TherapeuticFrameAgreement = {
  accepted: true,
  acceptedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  documentVersion: "v2.1.0",
  digitalSignature: "Jane Doe",
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  witnessEmail: "therapist@wellbloom.com",
  agreementText: `THERAPEUTIC FRAMEWORK AGREEMENT

Welcome to your therapeutic journey with Wellbloom. This agreement establishes the framework for our therapeutic relationship and outlines important policies and procedures.

1. CONFIDENTIALITY AND PRIVACY
Your privacy is paramount. All sessions are confidential and protected under HIPAA regulations. Information will only be shared with your explicit consent or as required by law (such as imminent danger to self or others).

2. SESSION STRUCTURE AND EXPECTATIONS
- Sessions are 50-60 minutes in duration
- Regular attendance supports therapeutic progress
- Please arrive on time and prepared to engage
- Sessions are conducted via secure video platform

3. CANCELLATION AND RESCHEDULING POLICY
- 24-hour notice required for cancellations to avoid fees
- Emergency cancellations will be handled case-by-case
- Frequent cancellations may require discussion about commitment

4. PAYMENT AND BILLING
- Payment is processed automatically 48 hours before each session
- Failed payments may result in session cancellation
- Refunds are available for therapist-initiated cancellations

5. EMERGENCY PROTOCOLS
- This service is not for crisis intervention
- In emergencies, contact 911 or your local emergency services
- Crisis hotlines: 988 (Suicide & Crisis Lifeline)
- Your emergency contact will be notified if necessary

6. RECORDING AND DOCUMENTATION
- Sessions may be recorded for quality assurance with your consent
- You have the right to request recordings be deleted
- Clinical notes are maintained for continuity of care

7. THERAPEUTIC BOUNDARIES
- Maintain professional therapeutic relationship
- No personal relationships outside of therapy
- Respect mutual boundaries and guidelines

8. TECHNOLOGY AND PLATFORM USE
- Ensure reliable internet connection
- Use private, secure location for sessions
- Technical issues should be reported immediately

9. TERMINATION OF SERVICES
- Either party may terminate services with appropriate notice
- Referrals will be provided if needed
- Final session recommended for closure

By accepting this agreement, you acknowledge understanding and agreement to these terms and commit to active participation in your therapeutic process.

Last updated: ${new Date().toLocaleDateString()}
Document version: v2.1.0`,
  keyTermsAcknowledged: {
    recurringBilling: true,
    cancellationPolicy: true,
    emergencyProtocol: true,
    confidentialityPolicy: true,
    recordingConsent: true,
    noShowPolicy: true,
  },
};

const TherapeuticFrameViewer: React.FC<TherapeuticFrameViewerProps> = ({
  isOpen,
  onClose,
  agreement = mockAgreement,
  compact = false,
  onViewFull,
}) => {
  const [activeTab, setActiveTab] = useState("terms");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadAgreement = () => {
    if (!agreement) return;

    const element = document.createElement("a");
    const file = new Blob([agreement.agreementText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `therapeutic-framework-agreement-${agreement.documentVersion}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderCompactView = () => (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-900/10 dark:to-blue-800/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-forest">Therapeutic Framework</p>
                <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Signed</span>
                </Badge>
              </div>
              <p className="text-sm text-moss/70">
                Signed on{" "}
                {agreement?.acceptedDate
                  ? formatDate(agreement.acceptedDate)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAgreement}
              className="border-blue-300 text-blue-600 hover:bg-blue-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewFull}
              className="border-blue-300 text-blue-600 hover:bg-blue-100"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (compact) {
    return renderCompactView();
  }

  if (!agreement) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              No Therapeutic Framework Found
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-moss/70 mb-4">
              No therapeutic framework agreement is currently on file.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              <span className="text-forest">
                Therapeutic Framework Agreement
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Signed & Active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadAgreement}
                className="border-blue-300 text-blue-600 hover:bg-blue-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="terms">Key Terms</TabsTrigger>
            <TabsTrigger value="agreement">Full Agreement</TabsTrigger>
            <TabsTrigger value="signature">Signature Details</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Acknowledged Key Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(agreement.keyTermsAcknowledged).map(
                    ([key, acknowledged]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border ${
                          acknowledged
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {acknowledged ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`font-medium ${
                              acknowledged
                                ? "text-green-800 dark:text-green-200"
                                : "text-red-800 dark:text-red-200"
                            }`}
                          >
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            acknowledged
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                          }`}
                        >
                          {acknowledged
                            ? "Acknowledged and accepted"
                            : "Not acknowledged"}
                        </p>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 p-4 bg-sage/10 dark:bg-sage/5 rounded-lg">
                  <h4 className="font-medium text-forest mb-2">
                    What These Terms Mean:
                  </h4>
                  <ul className="text-sm text-moss/70 space-y-1">
                    <li>
                      <strong>Recurring Billing:</strong> Automatic payment
                      processing for ongoing sessions
                    </li>
                    <li>
                      <strong>Cancellation Policy:</strong> 24-hour notice
                      required to avoid fees
                    </li>
                    <li>
                      <strong>Emergency Protocol:</strong> Understanding of
                      crisis procedures and limitations
                    </li>
                    <li>
                      <strong>Confidentiality Policy:</strong> HIPAA-compliant
                      privacy protections
                    </li>
                    <li>
                      <strong>Recording Consent:</strong> Permission for session
                      recording and storage
                    </li>
                    <li>
                      <strong>No Show Policy:</strong> Consequences for missed
                      appointments
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <FileText className="h-5 w-5 mr-2" />
                  Therapeutic Framework Agreement
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-moss/70">
                  <span>Version: {agreement.documentVersion}</span>
                  <span>•</span>
                  <span>Signed: {formatDate(agreement.acceptedDate!)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-forest leading-relaxed">
                    {agreement.agreementText}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-forest">
                  <Signature className="h-5 w-5 mr-2" />
                  Digital Signature Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <User className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">
                        Digital Signature
                      </span>
                    </div>
                    <p className="text-green-700 dark:text-green-300 font-mono">
                      {agreement.digitalSignature}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">
                        Signed Date & Time
                      </span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">
                      {formatDate(agreement.acceptedDate!)}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 mr-2 text-purple-600" />
                      <span className="font-medium text-purple-800 dark:text-purple-200">
                        Document Version
                      </span>
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 font-mono">
                      {agreement.documentVersion}
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Lock className="h-4 w-4 mr-2 text-orange-600" />
                      <span className="font-medium text-orange-800 dark:text-orange-200">
                        Witness
                      </span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-300">
                      {agreement.witnessEmail}
                    </p>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    This digital signature is legally binding and was captured
                    with secure authentication. Technical details including IP
                    address and browser information are stored for verification
                    purposes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapeuticFrameViewer;
