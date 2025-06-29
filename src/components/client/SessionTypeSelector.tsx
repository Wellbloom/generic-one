// Filename: SessionTypeSelector.tsx
// Role: Modal component for selecting between individual and recurring session options
// Purpose: Provides a choice modal when user clicks "Book Session" to streamline the booking flow
// Integration: Used in ClientDashboard to replace separate individual/recurring buttons

import { Calendar, User, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRICING } from "@/constants";

interface SessionTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndividual: () => void;
  onSelectRecurring: () => void;
}

const SessionTypeSelector: React.FC<SessionTypeSelectorProps> = ({
  isOpen,
  onClose,
  onSelectIndividual,
  onSelectRecurring,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-forest text-center">
            Choose Your Session Type
          </DialogTitle>
          <p className="text-moss/70 text-center mt-2">
            Select how you'd like to book your therapy sessions
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Individual Session Option */}
          <Card
            className="border-2 border-forest/20 hover:border-forest/40 transition-colors cursor-pointer group"
            onClick={onSelectIndividual}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-forest/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-forest/20 transition-colors">
                <User className="h-8 w-8 text-forest" />
              </div>
              <CardTitle className="text-forest">Individual Session</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-moss/80 text-sm">
                Book a single therapy session with flexible scheduling
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-moss/70">Duration:</span>
                  <span className="font-medium text-forest">60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moss/70">Price:</span>
                  <span className="font-medium text-forest">${PRICING.individualSession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moss/70">Scheduling:</span>
                  <span className="font-medium text-forest">Flexible</span>
                </div>
              </div>
              <Button
                className="w-full bg-forest hover:bg-moss text-white group-hover:bg-moss"
                onClick={e => {
                  e.stopPropagation();
                  onSelectIndividual();
                }}
              >
                Book Individual Session
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Recurring Sessions Option */}
          <Card
            className="border-2 border-purple-200 hover:border-purple-400 transition-colors cursor-pointer group"
            onClick={onSelectRecurring}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">
                Recurring Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-moss/80 text-sm">
                Set up regular weekly sessions with consistent scheduling
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-moss/70">Duration:</span>
                  <span className="font-medium text-forest">60 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moss/70">Price:</span>
                  <span className="font-medium text-forest">${PRICING.recurringSession}/session</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moss/70">Scheduling:</span>
                  <span className="font-medium text-forest">Weekly</span>
                </div>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={e => {
                  e.stopPropagation();
                  onSelectRecurring();
                }}
              >
                Setup Recurring Sessions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTypeSelector;
