import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Camera,
  Save,
  Edit,
  Shield,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MOCK_DATA } from "@/constants";
import doctorImage from "@/assets/images/jean-grey.jpeg";

interface TherapistProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  bio: string;
  specializations: string[];
  yearsOfExperience: number;
  licenseNumber: string;
  education: string[];
  certifications: string[];
  languages: string[];
  profileImage: string;
}

export default function TherapistProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<TherapistProfileData>({
    firstName: "Jean",
    lastName: "Grey",
    email: "wellbloom@jean-grey.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    timezone: "Pacific Time (PT)",
    bio: "I am a Licensed Clinical Psychologist and Dance/Movement Therapist with over 15 years of experience helping individuals heal through integrative therapeutic approaches. My practice combines traditional psychotherapy with creative expression, movement, and mindfulness techniques to support holistic healing and personal transformation.",
    specializations: [
      "Dance/Movement Therapy",
      "Trauma-Informed Care",
      "Anxiety & Depression",
      "Body-Based Therapy",
      "Creative Arts Therapy",
      "Mindfulness & Meditation",
      "Somatic Experiencing",
      "EMDR Therapy",
    ],
    yearsOfExperience: 15,
    licenseNumber: "LMFT-98765-CA",
    education: [
      "Ph.D. in Clinical Psychology - California Institute of Integral Studies",
      "M.A. in Dance/Movement Therapy - Columbia College Chicago",
      "B.A. in Psychology - University of California, Berkeley",
    ],
    certifications: [
      "Licensed Marriage & Family Therapist (LMFT)",
      "Registered Dance/Movement Therapist (R-DMT)",
      "EMDR Certified Therapist",
      "Somatic Experiencing Practitioner",
      "Mindfulness-Based Stress Reduction (MBSR) Instructor",
    ],
    languages: ["English", "Spanish", "Portuguese"],
    profileImage: doctorImage,
  });

  const handleInputChange = (
    field: keyof TherapistProfileData,
    value: string | number | string[]
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-48 h-48 mb-4">
          <img
            src={doctorImage}
            alt="Jean Grey"
            className="w-full h-full rounded-full object-cover shadow-lg"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-forest">Therapist Profile</h2>
            <p className="text-moss/70 dark:text-moss/80">
              Manage your personal and professional information
            </p>
          </div>

          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="bg-forest hover:bg-moss"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Image and Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Photo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-forest/10 rounded-full flex items-center justify-center mx-auto">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-forest" />
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-forest">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-moss/70">
                Licensed Clinical Psychologist & Dance/Movement Therapist
              </p>
              <p className="text-sm text-moss/60">{profileData.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-moss/70">
                  First Name
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.firstName}
                    onChange={e =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-forest font-medium mt-1">
                    {profileData.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-moss/70">
                  Last Name
                </label>
                {isEditing ? (
                  <Input
                    value={profileData.lastName}
                    onChange={e =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="mt-1"
                  />
                ) : (
                  <p className="text-forest font-medium mt-1">
                    {profileData.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">Phone</label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.phone}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Location
              </label>
              {isEditing ? (
                <Input
                  value={profileData.location}
                  onChange={e => handleInputChange("location", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.location}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Timezone
              </label>
              {isEditing ? (
                <Input
                  value={profileData.timezone}
                  onChange={e => handleInputChange("timezone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.timezone}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Languages
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileData.languages.map((language, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-forest/5 border-forest/20"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Professional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-moss/70">
                Years of Experience
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  value={profileData.yearsOfExperience}
                  onChange={e =>
                    handleInputChange(
                      "yearsOfExperience",
                      parseInt(e.target.value)
                    )
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.yearsOfExperience} years
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                License Number
              </label>
              {isEditing ? (
                <Input
                  value={profileData.licenseNumber}
                  onChange={e =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  className="mt-1"
                />
              ) : (
                <p className="text-forest font-medium mt-1">
                  {profileData.licenseNumber}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Education
              </label>
              <div className="mt-2 space-y-2">
                {profileData.education.map((edu, index) => (
                  <p key={index} className="text-forest text-sm">
                    • {edu}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Certifications
              </label>
              <div className="mt-2 space-y-2">
                {profileData.certifications.map((cert, index) => (
                  <p key={index} className="text-forest text-sm">
                    • {cert}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-moss/70">
                Specializations
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {profileData.specializations.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-forest/5 border-forest/20"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Professional Bio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={profileData.bio}
              onChange={e => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full"
              placeholder="Write a brief professional bio..."
            />
          ) : (
            <p className="text-forest leading-relaxed">{profileData.bio}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
