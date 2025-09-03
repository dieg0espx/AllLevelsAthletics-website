"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Edit,
  Shield,
  Bell,
  Globe,
  Lock
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock data - replace with real data from your backend
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Fitness St, Gym City, GC 12345",
    city: "Gym City",
    state: "GC",
    zipCode: "12345",
    country: "United States",
    dateOfBirth: "1990-01-01",
    emergencyContact: {
      name: "John Doe",
      relationship: "Spouse",
      phone: "+1 (555) 987-6543"
    },
    preferences: {
      notifications: true,
      marketingEmails: false,
      workoutReminders: true,
      progressUpdates: true
    }
  })

  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    const timer = setTimeout(() => setIsLoading(false), 1000)
    setOriginalData(profileData)
    return () => clearTimeout(timer)
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmergencyContactChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }))
  }

  const handlePreferenceChange = (field: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setOriginalData(profileData)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white">Loading Profile...</h1>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-orange-500/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-orange-400">My Information</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-white/90 hover:text-orange-400 hover:bg-white/10"
              >
                Back to Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/90 hover:text-red-400 hover:bg-white/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <User className="w-6 h-6 text-orange-400" />
                Profile Information
              </h2>
              <p className="text-white/70">Update your personal information and preferences</p>
            </div>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancel} variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-white/70">Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white/90">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white/90">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-white/5 border-gray-500/30 text-white/50"
                    />
                    <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-white/90">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  Address Information
                </CardTitle>
                <CardDescription className="text-white/70">Your shipping and billing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-white/90">Street Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-white/90">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-white/90">State</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-white/90">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country" className="text-white/90">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-400" />
                  Emergency Contact
                </CardTitle>
                <CardDescription className="text-white/70">Someone to contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyName" className="text-white/90">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profileData.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship" className="text-white/90">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profileData.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="emergencyPhone" className="text-white/90">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={profileData.emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Status</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Member Since</span>
                  <span className="text-white">{new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Last Login</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-400" />
                  Notifications
                </CardTitle>
                <CardDescription className="text-white/70">Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(profileData.preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-white/90 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <input
                      id={key}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                      disabled={!isEditing}
                      className="w-4 h-4 text-orange-500 bg-white/10 border-orange-500/30 rounded focus:ring-orange-500/50"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <User className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
