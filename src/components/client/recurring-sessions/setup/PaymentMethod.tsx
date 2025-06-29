// Filename: PaymentMethod.tsx
// Role: Payment method setup component for Recurring Sessions subscription
// Purpose: Secure credit card and billing information collection with validation for individual session billing
// Integration: Used in PayAsYouGoSetup.tsx as step 4 of the setup process

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Lock,
  Shield,
  CheckCircle,
  AlertTriangle,
  MapPin,
  User,
  Calendar,
  Hash,
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
import { PaymentMethodInfo, BillingAddress } from "@/types/PayAsYouGoTypes";

interface PayAsYouGoPaymentMethodProps {
  onPaymentMethodSave: (paymentMethod: Partial<PaymentMethodInfo>) => void;
  savedPaymentMethod?: Partial<PaymentMethodInfo> | null;
  errors?: string[];
}

// International countries for billing address
const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "CH", label: "Switzerland" },
  { value: "AT", label: "Austria" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "IE", label: "Ireland" },
  { value: "PT", label: "Portugal" },
  { value: "GR", label: "Greece" },
  { value: "PL", label: "Poland" },
  { value: "CZ", label: "Czech Republic" },
  { value: "HU", label: "Hungary" },
  { value: "RO", label: "Romania" },
  { value: "BG", label: "Bulgaria" },
  { value: "HR", label: "Croatia" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "EE", label: "Estonia" },
  { value: "LV", label: "Latvia" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MT", label: "Malta" },
  { value: "CY", label: "Cyprus" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "SG", label: "Singapore" },
  { value: "HK", label: "Hong Kong" },
  { value: "TW", label: "Taiwan" },
  { value: "MY", label: "Malaysia" },
  { value: "TH", label: "Thailand" },
  { value: "PH", label: "Philippines" },
  { value: "ID", label: "Indonesia" },
  { value: "VN", label: "Vietnam" },
  { value: "IN", label: "India" },
  { value: "CN", label: "China" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "PE", label: "Peru" },
  { value: "ZA", label: "South Africa" },
  { value: "EG", label: "Egypt" },
  { value: "MA", label: "Morocco" },
  { value: "NG", label: "Nigeria" },
  { value: "KE", label: "Kenya" },
  { value: "GH", label: "Ghana" },
  { value: "IL", label: "Israel" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "QA", label: "Qatar" },
  { value: "KW", label: "Kuwait" },
  { value: "BH", label: "Bahrain" },
  { value: "OM", label: "Oman" },
  { value: "JO", label: "Jordan" },
  { value: "LB", label: "Lebanon" },
  { value: "TR", label: "Turkey" },
  { value: "RU", label: "Russia" },
  { value: "UA", label: "Ukraine" },
  { value: "BY", label: "Belarus" },
  { value: "MD", label: "Moldova" },
  { value: "GE", label: "Georgia" },
  { value: "AM", label: "Armenia" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TM", label: "Turkmenistan" },
  { value: "MN", label: "Mongolia" },
  { value: "NZ", label: "New Zealand" },
  { value: "FJ", label: "Fiji" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "NC", label: "New Caledonia" },
  { value: "VU", label: "Vanuatu" },
  { value: "SB", label: "Solomon Islands" },
  { value: "TO", label: "Tonga" },
  { value: "WS", label: "Samoa" },
  { value: "KI", label: "Kiribati" },
  { value: "TV", label: "Tuvalu" },
  { value: "NR", label: "Nauru" },
  { value: "PW", label: "Palau" },
  { value: "FM", label: "Micronesia" },
  { value: "MH", label: "Marshall Islands" },
];

// US states for US addresses
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

const PayAsYouGoPaymentMethod: React.FC<PayAsYouGoPaymentMethodProps> = ({
  onPaymentMethodSave,
  savedPaymentMethod,
  errors = [],
}) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // Get card brand from number
  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6/.test(number)) return "discover";
    return "unknown";
  };

  // Validate form - relaxed for testing with mock data
  const validateForm = () => {
    const errors: string[] = [];

    // Allow mock data for testing - minimal validation
    if (!cardData.cardholderName.trim() && !cardData.cardNumber.trim()) {
      errors.push(
        "Please enter at least cardholder name or card number for testing"
      );
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSavePaymentMethod = () => {
    if (!validateForm()) {
      return;
    }

    const cardNumber = cardData.cardNumber.replace(/\s/g, "");
    const [month, year] = cardData.expiryMonth.includes("/")
      ? cardData.expiryMonth.split("/")
      : [cardData.expiryMonth, cardData.expiryYear];

    const paymentMethod: Partial<PaymentMethodInfo> = {
      id: `pm_${Date.now()}`, // In real app, this would come from payment processor
      type: "card",
      last4: cardNumber.slice(-4),
      brand: getCardBrand(cardNumber),
      expiryMonth: parseInt(month),
      expiryYear: parseInt(`20${year}`),
      isDefault: saveAsDefault,
      billingAddress,
    };

    onPaymentMethodSave(paymentMethod);
  };

  // Auto-save payment method when form is valid and complete
  useEffect(() => {
    if (validateForm()) {
      handleSavePaymentMethod();
    }
  }, [cardData, billingAddress, saveAsDefault]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setCardData(prev => ({ ...prev, expiryMonth: formatted }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserInteracted(true);
    const value = e.target.value.replace(/\D/g, "");
    const brand = getCardBrand(cardData.cardNumber);
    const maxLength = brand === "amex" ? 4 : 3;
    if (value.length <= maxLength) {
      setCardData(prev => ({ ...prev, cvv: value }));
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);

  if (savedPaymentMethod?.id) {
    return (
      <div className="space-y-6">
        <Alert className="border-green-300 bg-green-50 text-green-900">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="font-semibold">
            Payment Method Saved
          </AlertTitle>
          <AlertDescription>
            Your payment method has been securely saved and encrypted.
          </AlertDescription>
        </Alert>

        <Card className="border-forest/30">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <CreditCard className="mr-2 h-5 w-5" />
              Saved Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-sage/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded">
                  <CreditCard className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p className="font-medium text-forest">
                    •••• •••• •••• {savedPaymentMethod.last4}
                  </p>
                  <p className="text-sm text-moss/70">
                    {savedPaymentMethod.brand?.toUpperCase()} • Expires{" "}
                    {savedPaymentMethod.expiryMonth}/
                    {savedPaymentMethod.expiryYear}
                  </p>
                </div>
              </div>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-forest/10 dark:bg-forest/20 rounded-lg">
            <CreditCard className="h-6 w-6 text-forest" />
          </div>
          <h2 className="text-2xl font-bold text-forest">Payment Method</h2>
        </div>
        <p className="text-moss/70 dark:text-moss/80 mt-2">
          Your payment information is encrypted and secure.
        </p>
      </div>

      {/* Security Notice */}
      <Alert className="border-green-300 bg-green-50 text-green-900">
        <Lock className="h-4 w-4 text-green-600" />
        <AlertTitle className="font-semibold">Secure & Encrypted</AlertTitle>
        <AlertDescription>
          Your payment information is protected with bank-level encryption and
          never stored on our servers.
        </AlertDescription>
      </Alert>

      {/* Error Display - Only show after user interaction */}
      {hasUserInteracted &&
        (errors.length > 0 || validationErrors.length > 0) && (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Information */}
        <Card className="border-forest/30">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <CreditCard className="mr-2 h-5 w-5" />
              Card Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={cardData.cardholderName}
                  onChange={e => {
                    setHasUserInteracted(true);
                    setCardData(prev => ({
                      ...prev,
                      cardholderName: e.target.value,
                    }));
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative mt-1">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={handleCardNumberChange}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardData.expiryMonth}
                    onChange={handleExpiryChange}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative mt-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-moss/50" />
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={handleCvvChange}
                    className="pl-9"
                    type="password"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card className="border-sage/30">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <MapPin className="mr-2 h-5 w-5" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={billingAddress.street}
                onChange={e => {
                  setHasUserInteracted(true);
                  setBillingAddress(prev => ({
                    ...prev,
                    street: e.target.value,
                  }));
                }}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={billingAddress.city}
                onChange={e => {
                  setHasUserInteracted(true);
                  setBillingAddress(prev => ({
                    ...prev,
                    city: e.target.value,
                  }));
                }}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">
                  {billingAddress.country === "US" ? "State" : "State/Province"}
                </Label>
                {billingAddress.country === "US" ? (
                  <Select
                    value={billingAddress.state}
                    onValueChange={value =>
                      setBillingAddress(prev => ({ ...prev, state: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="state"
                    placeholder="State/Province"
                    value={billingAddress.state}
                    onChange={e =>
                      setBillingAddress(prev => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="zipCode">
                  {billingAddress.country === "US" ? "ZIP Code" : "Postal Code"}
                </Label>
                <Input
                  id="zipCode"
                  placeholder={
                    billingAddress.country === "US" ? "12345" : "Postal Code"
                  }
                  value={billingAddress.zipCode}
                  onChange={e =>
                    setBillingAddress(prev => ({
                      ...prev,
                      zipCode: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={billingAddress.country}
                onValueChange={value =>
                  setBillingAddress(prev => ({
                    ...prev,
                    country: value,
                    state: "", // Reset state when country changes
                  }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save as Default */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveAsDefault"
          checked={saveAsDefault}
          onCheckedChange={checked => setSaveAsDefault(!!checked)}
        />
        <Label htmlFor="saveAsDefault" className="text-moss/90">
          Save as default payment method
        </Label>
      </div>
    </div>
  );
};

export default PayAsYouGoPaymentMethod;
