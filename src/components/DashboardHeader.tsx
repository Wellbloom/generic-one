import {
  Bell,
  ChevronDown,
  X,
  Calendar,
  CreditCard,
  Shield,
  Phone,
  CheckCircle,
  User,
  LogOut,
  Clock,
  XCircle,
  RefreshCw,
  DollarSign,
  CalendarX,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_DATA } from "@/constants";
import logoImage from "@/assets/images/jean-grey-logo.png";
import doctorImage from "@/assets/images/jean-grey.jpeg";
// Using a standardized mock client profile image from Unsplash
const clientProfileImage =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80";
import { useState } from "react";

interface DashboardHeaderProps {
  // Props for recurring sessions setup mode
  isSetupMode?: boolean;
  currentStep?: number;
  totalSteps?: number;
  onExitSetup?: () => void;
  // New prop to detect admin mode
  isAdminMode?: boolean;
  onShowProfile?: () => void;
}

// Mock notification data for admin mode
const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "New Session Booked",
    message: "Sarah Johnson booked a session for tomorrow at 2:00 PM",
    timestamp: "5 minutes ago",
    profileImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    clientName: "Sarah Johnson",
    isNew: true,
    icon: Calendar,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Processed",
    message:
      "Michael Chen's payment of $175 was automatically deducted for upcoming session",
    timestamp: "1 hour ago",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    clientName: "Michael Chen",
    isNew: true,
    icon: DollarSign,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    type: "reschedule",
    title: "Session Rescheduled",
    message:
      "Emily Rodriguez moved her Thursday 3:00 PM session to Friday 1:00 PM",
    timestamp: "2 hours ago",
    profileImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    clientName: "Emily Rodriguez",
    isNew: false,
    icon: RefreshCw,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    type: "cancellation",
    title: "Session Cancelled",
    message: "David Thompson cancelled his Monday 4:00 PM session",
    timestamp: "3 hours ago",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    clientName: "David Thompson",
    isNew: false,
    icon: CalendarX,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 5,
    type: "payment",
    title: "Payment Reminder Sent",
    message:
      "Lisa Wang will be charged $175 in 24 hours for her upcoming session",
    timestamp: "4 hours ago",
    profileImage:
      "https://images.unsplash.com/photo-1494790108755-2616c27d9b4b?w=400&h=400&fit=crop&crop=face",
    clientName: "Lisa Wang",
    isNew: false,
    icon: Clock,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 6,
    type: "booking",
    title: "Trial Session Booked",
    message:
      "Alex Martinez scheduled a trial session for next Tuesday at 11:00 AM",
    timestamp: "6 hours ago",
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    clientName: "Alex Martinez",
    isNew: false,
    icon: Calendar,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: 7,
    type: "payment",
    title: "Payment Failed",
    message: "Jessica Brown's payment of $175 failed - please follow up",
    timestamp: "8 hours ago",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    clientName: "Jessica Brown",
    isNew: false,
    icon: XCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 8,
    type: "reschedule",
    title: "Multiple Reschedules",
    message:
      "Robert Kim requested to reschedule his weekly sessions to different time slots",
    timestamp: "1 day ago",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    clientName: "Robert Kim",
    isNew: false,
    icon: RefreshCw,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isSetupMode = false,
  currentStep = 0,
  totalSteps = 6,
  onExitSetup,
  isAdminMode = false,
  onShowProfile,
}) => {
  const { user, signOut } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const steps = [
    { title: "Schedule Selection", icon: <Calendar className="h-5 w-5" /> },
    { title: "Pricing Plan", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Therapeutic Agreement", icon: <Shield className="h-5 w-5" /> },
    { title: "Payment Method", icon: <CreditCard className="h-5 w-5" /> },
    { title: "Emergency Contact", icon: <Phone className="h-5 w-5" /> },
    { title: "Confirmation", icon: <CheckCircle className="h-5 w-5" /> },
  ];

  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleProfileClick = () => {
    if (onShowProfile) {
      onShowProfile();
    } else {
      setShowProfileModal(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Determine profile image and name based on mode
  const profileImage = isAdminMode ? doctorImage : clientProfileImage;
  const displayName = isAdminMode
    ? MOCK_DATA.therapist.name
    : MOCK_DATA.client.name;

  // Get unread notifications count
  const unreadCount = mockNotifications.filter(n => n.isNew).length;

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "border-l-blue-500";
      case "payment":
        return "border-l-green-500";
      case "reschedule":
        return "border-l-orange-500";
      case "cancellation":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 shadow-sm border-b border-border/40">
      <div className="container mx-auto px-4 py-4">
        {isSetupMode ? (
          /* Setup Mode: Custom layout with much wider progress bar */
          <nav className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center flex-shrink-0">
              <a href="/" className="flex items-center">
                <img
                  src={logoImage}
                  alt="Silvia Labra Osuna"
                  className="h-16 w-auto object-contain"
                />
              </a>
            </div>

            {/* Center: Progress Section - Taking up maximum available space */}
            <div className="flex items-center space-x-6 flex-1 justify-center px-12">
              <div className="flex items-center space-x-3 text-forest flex-shrink-0">
                <div className="p-2 bg-forest/10 rounded-lg">
                  {steps[currentStep]?.icon}
                </div>
              </div>
              <div className="flex-1 max-w-none w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-forest">
                    Step {currentStep + 1} of {totalSteps}:{" "}
                    <span className="font-medium text-forest/80">
                      {steps[currentStep]?.title}
                    </span>
                  </span>
                  <span className="text-sm font-medium text-forest/70 bg-forest/10 px-3 py-1 rounded-full">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-3 bg-sage/30 w-full" />
              </div>
            </div>

            {/* Right: Exit Button */}
            <div className="flex items-center flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onExitSetup}
                className="border-moss/30 text-moss hover:bg-moss/10 whitespace-nowrap"
              >
                <X className="h-4 w-4 mr-1" />
                Exit Setup
              </Button>
            </div>
          </nav>
        ) : (
          /* Normal Mode: Standard layout */
          <nav className="flex items-center justify-between">
            {/* Logo - Always shown */}
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <img
                  src={logoImage}
                  alt="Silvia Labra Osuna"
                  className="h-16 w-auto object-contain"
                />
              </a>
            </div>

            {/* Normal Mode: Notifications and Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications - Only show detailed notifications in admin mode */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative hover:bg-gray-50 p-3"
                >
                  <Bell className="h-9 w-9 text-gray-600" />
                  {isAdminMode && unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500 min-w-4">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Notifications Dropdown - Enhanced for Admin Mode */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Notifications
                          </h3>
                          {isAdminMode && (
                            <p className="text-sm text-gray-600">
                              {unreadCount} new notification
                              {unreadCount !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNotifications(false)}
                          className="hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto">
                      {isAdminMode ? (
                        // Admin mode - detailed notifications
                        <>
                          {mockNotifications.map(notification => {
                            const IconComponent = notification.icon;
                            return (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationTypeColor(notification.type)} ${
                                  notification.isNew ? "bg-blue-50/30" : ""
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  {/* Client Profile Image */}
                                  <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage
                                      src={notification.profileImage}
                                      alt={notification.clientName}
                                    />
                                    <AvatarFallback>
                                      {notification.clientName
                                        .split(" ")
                                        .map(n => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>

                                  {/* Notification Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <div
                                        className={`p-1 rounded-full ${notification.bgColor}`}
                                      >
                                        <IconComponent
                                          className={`h-3 w-3 ${notification.iconColor}`}
                                        />
                                      </div>
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {notification.title}
                                      </p>
                                      {notification.isNew && (
                                        <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs text-gray-500">
                                        {notification.timestamp}
                                      </p>
                                      <p className="text-xs text-gray-600 font-medium">
                                        {notification.clientName}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* View All Notifications */}
                          <div className="p-4 bg-gray-50 border-t">
                            <Button
                              variant="ghost"
                              className="w-full text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              View All Notifications
                            </Button>
                          </div>
                        </>
                      ) : (
                        // Client mode - simple notifications
                        <>
                          <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <Calendar className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Session Reminder
                                </p>
                                <p className="text-sm text-gray-600">
                                  Your session with Jean Grey is tomorrow at
                                  2:00 PM
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  2 hours ago
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <CreditCard className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Payment Processed
                                </p>
                                <p className="text-sm text-gray-600">
                                  Your payment of $170 has been processed
                                  successfully
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  1 day ago
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 hover:bg-gray-50">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Session Completed
                                </p>
                                <p className="text-sm text-gray-600">
                                  Your session notes have been updated
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  2 days ago
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Section with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-sage/10 rounded-lg px-2 py-1 transition-colors">
                    {/* Profile Image - Using Shay Singh's profile image */}
                    <img
                      src={doctorImage}
                      alt="Jean Grey"
                      className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                    />

                    {/* Username */}
                    <span className="text-moss font-medium">{displayName}</span>

                    {/* Down Chevron */}
                    <ChevronDown className="w-4 h-4 text-moss" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isAdminMode && (
                    <>
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
