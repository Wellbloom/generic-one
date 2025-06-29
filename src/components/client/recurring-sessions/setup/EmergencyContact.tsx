// Filename: EmergencyContact.tsx
// Role: Emergency contact setup component for Recurring Sessions subscription
// Purpose: Allows users to add multiple emergency contacts with comprehensive information for recurring sessions
// Integration: Used in PayAsYouGoSetup.tsx as step 5 of the setup process

import React, { useState, useEffect } from "react";
import {
  Phone,
  Plus,
  User,
  Mail,
  MapPin,
  Trash2,
  Edit3,
  AlertTriangle,
  Shield,
  CheckCircle,
  Heart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  canContactDuringTherapy: boolean;
  notes?: string;
}

interface PayAsYouGoEmergencyContactProps {
  onContactsSave: (contacts: EmergencyContact[]) => void;
  savedContacts?: EmergencyContact[];
  errors?: string[];
}

// Common relationship options
const RELATIONSHIP_OPTIONS = [
  { value: "spouse", label: "Spouse/Partner" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Close Friend" },
  { value: "relative", label: "Other Family Member" },
  { value: "physician", label: "Primary Care Physician" },
  { value: "therapist", label: "Other Therapist/Counselor" },
  { value: "attorney", label: "Attorney" },
  { value: "other", label: "Other" },
];

const PayAsYouGoEmergencyContact: React.FC<PayAsYouGoEmergencyContactProps> = ({
  onContactsSave,
  savedContacts = [],
  errors = [],
}) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    savedContacts.length > 0 ? savedContacts : []
  );
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Create new contact
  const createNewContact = () => {
    const newContact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: "",
      relationship: "",
      phoneNumber: "",
      email: "",
      address: "",
      isPrimary: contacts.length === 0, // First contact is primary by default
      canContactDuringTherapy: false, // Keep for now to maintain interface compatibility
      notes: "",
    };

    setContacts(prev => [...prev, newContact]);
    setEditingContactId(newContact.id);
  };

  // Update contact
  const updateContact = (
    contactId: string,
    updates: Partial<EmergencyContact>
  ) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId ? { ...contact, ...updates } : contact
      )
    );
  };

  // Remove contact
  const removeContact = (contactId: string) => {
    const contactToRemove = contacts.find(c => c.id === contactId);
    const updatedContacts = contacts.filter(c => c.id !== contactId);

    // If removing primary contact, make the first remaining contact primary
    if (contactToRemove?.isPrimary && updatedContacts.length > 0) {
      updatedContacts[0].isPrimary = true;
    }

    setContacts(updatedContacts);
    if (editingContactId === contactId) {
      setEditingContactId(null);
    }
  };

  // Set primary contact
  const setPrimaryContact = (contactId: string) => {
    setContacts(prev =>
      prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === contactId,
      }))
    );
  };

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return cleaned;
  };

  // Validate contacts
  const validateContacts = () => {
    const errors: string[] = [];

    if (contacts.length === 0) {
      errors.push("At least one emergency contact is required");
      setValidationErrors(errors);
      return false;
    }

    const primaryContacts = contacts.filter(c => c.isPrimary);
    if (primaryContacts.length === 0) {
      errors.push("Please designate one contact as primary");
    }

    for (const contact of contacts) {
      if (!contact.name.trim()) {
        errors.push(`Contact name is required for all contacts`);
        break;
      }
      if (!contact.relationship.trim()) {
        errors.push(`Relationship is required for all contacts`);
        break;
      }
      if (!contact.phoneNumber.trim()) {
        errors.push(`Phone number is required for all contacts`);
        break;
      }
      if (
        contact.phoneNumber &&
        !/^\(\d{3}\) \d{3}-\d{4}$/.test(contact.phoneNumber)
      ) {
        errors.push(`Please enter valid phone numbers for all contacts`);
        break;
      }
      if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        errors.push(`Please enter valid email addresses`);
        break;
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const primaryContact = contacts.find(c => c.isPrimary);

  // Only show summary for contacts that have at least name and phone filled out
  const validContacts = contacts.filter(
    contact => contact.name.trim() && contact.phoneNumber.trim()
  );
  const validPrimaryContact = validContacts.find(c => c.isPrimary);

  // Auto-save contacts whenever they change
  useEffect(() => {
    if (validContacts.length > 0) {
      const isValid = validateContacts();
      if (isValid) {
        onContactsSave(contacts);
      }
    }
  }, [contacts, onContactsSave]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-forest/10 dark:bg-forest/20 rounded-lg">
            <Phone className="h-6 w-6 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-forest">Emergency Contacts</h2>
        </div>
        <p className="text-moss/70 dark:text-moss/80 mt-2">
          Add trusted contacts who can be reached in case of emergency during
          therapy sessions.
        </p>
      </div>

      {/* Important Information */}
      <Alert className="border-blue-300 bg-blue-50 text-blue-900">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertTitle className="font-semibold">Privacy & Security</AlertTitle>
        <AlertDescription>
          Emergency contacts will only be contacted in genuine emergency
          situations. Your therapy content remains confidential.
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {(errors.length > 0 || validationErrors.length > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Please correct the following:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {[...errors, ...validationErrors].map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <Card className="border-2 border-dashed border-sage/30 dark:border-sage/20">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-moss/50 dark:text-moss/60 mx-auto mb-4" />
              <p className="text-moss/70 dark:text-moss/80 mb-4">
                No emergency contacts added yet
              </p>
              <Button
                onClick={createNewContact}
                className="bg-forest text-white hover:bg-forest/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Emergency Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          contacts.map((contact, index) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isEditing={editingContactId === contact.id}
              onEdit={() => setEditingContactId(contact.id)}
              onSave={() => setEditingContactId(null)}
              onRemove={() => removeContact(contact.id)}
              onUpdate={updates => updateContact(contact.id, updates)}
              onSetPrimary={() => setPrimaryContact(contact.id)}
              formatPhoneNumber={formatPhoneNumber}
            />
          ))
        )}
      </div>

      {/* Add More Button */}
      {contacts.length > 0 && contacts.length < 5 && (
        <div className="text-center">
          <Button
            onClick={createNewContact}
            variant="outline"
            className="border-forest/30 text-forest hover:bg-forest/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Contact
          </Button>
        </div>
      )}
    </div>
  );
};

// Individual Contact Card Component
interface ContactCardProps {
  contact: EmergencyContact;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<EmergencyContact>) => void;
  onSetPrimary: () => void;
  formatPhoneNumber: (value: string) => string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isEditing,
  onEdit,
  onSave,
  onRemove,
  onUpdate,
  onSetPrimary,
  formatPhoneNumber,
}) => {
  // Individual contact validation
  const validateIndividualContact = (contact: EmergencyContact) => {
    const errors: string[] = [];

    if (!contact.name.trim()) {
      errors.push("Full name is required");
    }

    if (!contact.relationship.trim()) {
      errors.push("Relationship is required");
    }

    if (!contact.phoneNumber.trim()) {
      errors.push("Phone number is required");
    } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(contact.phoneNumber)) {
      errors.push("Please enter a valid phone number");
    }

    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.push("Please enter a valid email address");
    }

    return errors;
  };

  const contactErrors = isEditing ? validateIndividualContact(contact) : [];
  const isContactValid = contactErrors.length === 0;

  if (isEditing) {
    return (
      <Card className="border-forest/30 bg-forest/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-forest">
            <div className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5" />
              <span>Edit Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`primary-${contact.id}`}
                checked={contact.isPrimary}
                onCheckedChange={checked => onUpdate({ isPrimary: !!checked })}
              />
              <Label htmlFor={`primary-${contact.id}`} className="text-sm">
                Primary Contact
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Individual Contact Validation Errors */}
          {contactErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Please complete the following:</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {contactErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`name-${contact.id}`}>Full Name *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                <Input
                  id={`name-${contact.id}`}
                  placeholder="John Doe"
                  value={contact.name}
                  onChange={e => onUpdate({ name: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`relationship-${contact.id}`}>
                Relationship *
              </Label>
              <Select
                value={contact.relationship}
                onValueChange={value => onUpdate({ relationship: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`phone-${contact.id}`}>Phone Number *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                <Input
                  id={`phone-${contact.id}`}
                  placeholder="(555) 123-4567"
                  value={contact.phoneNumber}
                  onChange={e =>
                    onUpdate({ phoneNumber: formatPhoneNumber(e.target.value) })
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`email-${contact.id}`}>Email (Optional)</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                <Input
                  id={`email-${contact.id}`}
                  type="email"
                  placeholder="john@example.com"
                  value={contact.email || ""}
                  onChange={e => onUpdate({ email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor={`address-${contact.id}`}>Address (Optional)</Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-moss/50" />
              <Input
                id={`address-${contact.id}`}
                placeholder="123 Main St, City, State"
                value={contact.address || ""}
                onChange={e => onUpdate({ address: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`notes-${contact.id}`}>
              Additional Notes (Optional)
            </Label>
            <Input
              id={`notes-${contact.id}`}
              placeholder="Any special instructions or notes..."
              value={contact.notes || ""}
              onChange={e => onUpdate({ notes: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={onRemove}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
            <Button
              onClick={onSave}
              disabled={!isContactValid}
              size="sm"
              className={`${
                isContactValid
                  ? "bg-forest text-white hover:bg-forest/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`transition-all ${contact.isPrimary ? "border-forest/50 bg-forest/5" : "border-sage/30 bg-white"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div
              className={`p-2 rounded-lg ${contact.isPrimary ? "bg-forest/15" : "bg-sage/10"}`}
            >
              {contact.isPrimary ? (
                <Shield className="h-5 w-5 text-forest" />
              ) : (
                <User className="h-5 w-5 text-moss" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-forest">{contact.name}</p>
                {contact.isPrimary && (
                  <Badge className="bg-forest/10 text-forest border-forest/20 text-xs font-medium">
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-sm text-moss/70">
                {
                  RELATIONSHIP_OPTIONS.find(
                    r => r.value === contact.relationship
                  )?.label
                }{" "}
                • {contact.phoneNumber}
              </p>
              {contact.email && (
                <p className="text-sm text-moss/60">{contact.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!contact.isPrimary && (
              <Button
                onClick={onSetPrimary}
                variant="ghost"
                size="sm"
                className="text-forest hover:bg-forest/10 text-xs"
              >
                Set Primary
              </Button>
            )}
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-moss hover:bg-moss/10"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayAsYouGoEmergencyContact;
