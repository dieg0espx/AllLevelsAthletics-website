"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminRedirect } from "@/components/admin-redirect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft,
  User,
  MapPin,
  Save,
  Edit,
  Lock,
  Phone
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, signOut, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Debug isSaving state changes specifically
  useEffect(() => {
    console.log('🔄 isSaving state changed to:', isSaving)
    if (isSaving) {
      console.trace('📍 isSaving set to true - stack trace:')
    }
  }, [isSaving])

  // Debug state changes
  useEffect(() => {
    console.log('🔄 State changed - isEditing:', isEditing, 'isSaving:', isSaving, 'isLoading:', isLoading)
  }, [isEditing, isSaving, isLoading])

  // Profile data from Supabase
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phoneCountryCode: "+1",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    dateOfBirth: ""
  })

  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountryCode: "+1",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    dateOfBirth: ""
  })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    // Fetch profile data from Supabase
    fetchProfileData()
    
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [user, router])

  const fetchProfileData = async () => {
    try {
      console.log('🔄 Fetching profile data for user:', user?.id)
      
      const response = await fetch(`/api/user-profile?userId=${user?.id}`)
      const data = await response.json()
      
      if (response.ok) {
        console.log('📋 Profile fetch response:', JSON.stringify(data, null, 2))
        if (data.profile) {
          console.log('📋 Profile data from API:', JSON.stringify(data.profile, null, 2))
          // Parse phone number if it includes country code
          const phoneData = parsePhoneNumber(data.profile.phone || "")
          
          // Parse full_name back into first and last name
          const fullName = data.profile.full_name || ""
          const nameParts = fullName.trim().split(" ")
          const firstName = nameParts[0] || ""
          const lastName = nameParts.slice(1).join(" ") || ""
          
          const newProfileData = {
            firstName: firstName,
            lastName: lastName,
            email: user?.email || "", // Get email from auth user, not profile
            phoneCountryCode: phoneData.countryCode,
            phone: phoneData.number,
            address: data.profile.address || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            zipCode: data.profile.zip_code || "",
            country: data.profile.country || "United States",
            dateOfBirth: data.profile.date_of_birth || ""
          }
          
          console.log('📋 Processed profile data:', JSON.stringify(newProfileData, null, 2))
          setProfileData(newProfileData)
          setOriginalData(newProfileData)
        } else {
          console.log('⚠️ No profile data returned from API')
        }
      } else {
        console.error('❌ Profile fetch failed:', response.status, data)
      }
    } catch (error) {
      console.error('💥 Error fetching profile data:', error)
    }
  }

  // Helper function to parse phone number with country code
  const parsePhoneNumber = (phoneString: string) => {
    if (!phoneString) return { countryCode: "+1", number: "" }
    
    // Check if phone starts with a country code
    const countryCodes = ["+1", "+52", "+33", "+44", "+49", "+39", "+34", "+55", "+86", "+81", "+91", "+61"]
    for (const code of countryCodes) {
      if (phoneString.startsWith(code)) {
        return {
          countryCode: code,
          number: phoneString.substring(code.length).trim()
        }
      }
    }
    
    // Default to US if no country code found
    return { countryCode: "+1", number: phoneString }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => {
      const newData = {
      ...prev,
        [field]: value
      }
      
      // Reset state when country changes
      if (field === 'country') {
        newData.state = ''
      }
      
      return newData
    })
  }

  const handleSave = async () => {
    console.log('🚀 handleSave function called')
    console.log('🚀 Setting isSaving to true')
    setIsSaving(true)
    try {
      console.log('🔄 Saving profile data...')
      
      // Combine country code and phone number
      const fullPhoneNumber = profileData.phoneCountryCode + " " + profileData.phone
      
      const requestData = {
        userId: user?.id,
        profileData: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          phone: fullPhoneNumber,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          country: profileData.country,
          date_of_birth: profileData.dateOfBirth
        }
      }
      
      console.log('📤 Sending profile data:', JSON.stringify(requestData, null, 2))
      
      const response = await fetch('/api/user-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const responseData = await response.json()
      console.log('📡 Profile save response:', JSON.stringify(responseData, null, 2))

      if (response.ok) {
        console.log('✅ Profile saved successfully')
        setOriginalData(profileData)
        setIsEditing(false)
        // Refresh profile data after successful save
        await fetchProfileData()
        // Refresh user auth data to update display name on dashboard
        await refreshUser()
      } else {
        console.error('❌ Failed to save profile:', responseData)
        const errorMessage = responseData.details || responseData.error || 'Unknown error occurred'
        console.error('Profile save failed:', errorMessage)
      }
    } catch (error) {
      console.error('💥 Error saving profile:', error)
    } finally {
      console.log('🚀 Setting isSaving to false in finally block')
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  // Phone number validation
  const validatePhoneNumber = (phone: string, countryCode: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '')
    
    // Validation rules based on country code
    switch (countryCode) {
      case '+1': // US/Canada
        return digits.length === 10
      case '+52': // Mexico
        return digits.length === 10
      case '+33': // France
        return digits.length === 9
      case '+44': // UK
        return digits.length === 10 || digits.length === 11
      case '+49': // Germany
        return digits.length >= 10 && digits.length <= 12
      case '+39': // Italy
        return digits.length === 10
      case '+34': // Spain
        return digits.length === 9
      case '+55': // Brazil
        return digits.length === 10 || digits.length === 11
      case '+86': // China
        return digits.length === 11
      case '+81': // Japan
        return digits.length === 10 || digits.length === 11
      case '+91': // India
        return digits.length === 10
      case '+61': // Australia
        return digits.length === 9
      default:
        return digits.length >= 7 && digits.length <= 15
    }
  }

  // Format phone number as user types
  const formatPhoneNumber = (phone: string, countryCode: string) => {
    const digits = phone.replace(/\D/g, '')
    
    switch (countryCode) {
      case '+1': // US/Canada: (XXX) XXX-XXXX
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      case '+52': // Mexico: XXX XXX XXXX
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
      default:
        return digits
    }
  }

  // Get state/province options based on country
  const getStateOptions = (country: string) => {
    switch (country) {
      case 'United States':
        return [
          { value: 'AL', label: 'Alabama' },
          { value: 'AK', label: 'Alaska' },
          { value: 'AZ', label: 'Arizona' },
          { value: 'AR', label: 'Arkansas' },
          { value: 'CA', label: 'California' },
          { value: 'CO', label: 'Colorado' },
          { value: 'CT', label: 'Connecticut' },
          { value: 'DE', label: 'Delaware' },
          { value: 'FL', label: 'Florida' },
          { value: 'GA', label: 'Georgia' },
          { value: 'HI', label: 'Hawaii' },
          { value: 'ID', label: 'Idaho' },
          { value: 'IL', label: 'Illinois' },
          { value: 'IN', label: 'Indiana' },
          { value: 'IA', label: 'Iowa' },
          { value: 'KS', label: 'Kansas' },
          { value: 'KY', label: 'Kentucky' },
          { value: 'LA', label: 'Louisiana' },
          { value: 'ME', label: 'Maine' },
          { value: 'MD', label: 'Maryland' },
          { value: 'MA', label: 'Massachusetts' },
          { value: 'MI', label: 'Michigan' },
          { value: 'MN', label: 'Minnesota' },
          { value: 'MS', label: 'Mississippi' },
          { value: 'MO', label: 'Missouri' },
          { value: 'MT', label: 'Montana' },
          { value: 'NE', label: 'Nebraska' },
          { value: 'NV', label: 'Nevada' },
          { value: 'NH', label: 'New Hampshire' },
          { value: 'NJ', label: 'New Jersey' },
          { value: 'NM', label: 'New Mexico' },
          { value: 'NY', label: 'New York' },
          { value: 'NC', label: 'North Carolina' },
          { value: 'ND', label: 'North Dakota' },
          { value: 'OH', label: 'Ohio' },
          { value: 'OK', label: 'Oklahoma' },
          { value: 'OR', label: 'Oregon' },
          { value: 'PA', label: 'Pennsylvania' },
          { value: 'RI', label: 'Rhode Island' },
          { value: 'SC', label: 'South Carolina' },
          { value: 'SD', label: 'South Dakota' },
          { value: 'TN', label: 'Tennessee' },
          { value: 'TX', label: 'Texas' },
          { value: 'UT', label: 'Utah' },
          { value: 'VT', label: 'Vermont' },
          { value: 'VA', label: 'Virginia' },
          { value: 'WA', label: 'Washington' },
          { value: 'WV', label: 'West Virginia' },
          { value: 'WI', label: 'Wisconsin' },
          { value: 'WY', label: 'Wyoming' },
          { value: 'DC', label: 'District of Columbia' }
        ]
      case 'Canada':
        return [
          { value: 'AB', label: 'Alberta' },
          { value: 'BC', label: 'British Columbia' },
          { value: 'MB', label: 'Manitoba' },
          { value: 'NB', label: 'New Brunswick' },
          { value: 'NL', label: 'Newfoundland and Labrador' },
          { value: 'NS', label: 'Nova Scotia' },
          { value: 'ON', label: 'Ontario' },
          { value: 'PE', label: 'Prince Edward Island' },
          { value: 'QC', label: 'Quebec' },
          { value: 'SK', label: 'Saskatchewan' },
          { value: 'NT', label: 'Northwest Territories' },
          { value: 'NU', label: 'Nunavut' },
          { value: 'YT', label: 'Yukon' }
        ]
      case 'Mexico':
        return [
          { value: 'AGU', label: 'Aguascalientes' },
          { value: 'BCN', label: 'Baja California' },
          { value: 'BCS', label: 'Baja California Sur' },
          { value: 'CAM', label: 'Campeche' },
          { value: 'CHP', label: 'Chiapas' },
          { value: 'CHH', label: 'Chihuahua' },
          { value: 'COA', label: 'Coahuila' },
          { value: 'COL', label: 'Colima' },
          { value: 'DIF', label: 'Ciudad de México' },
          { value: 'DUR', label: 'Durango' },
          { value: 'GUA', label: 'Guanajuato' },
          { value: 'GRO', label: 'Guerrero' },
          { value: 'HID', label: 'Hidalgo' },
          { value: 'JAL', label: 'Jalisco' },
          { value: 'MEX', label: 'México' },
          { value: 'MIC', label: 'Michoacán' },
          { value: 'MOR', label: 'Morelos' },
          { value: 'NAY', label: 'Nayarit' },
          { value: 'NLE', label: 'Nuevo León' },
          { value: 'OAX', label: 'Oaxaca' },
          { value: 'PUE', label: 'Puebla' },
          { value: 'QUE', label: 'Querétaro' },
          { value: 'ROO', label: 'Quintana Roo' },
          { value: 'SLP', label: 'San Luis Potosí' },
          { value: 'SIN', label: 'Sinaloa' },
          { value: 'SON', label: 'Sonora' },
          { value: 'TAB', label: 'Tabasco' },
          { value: 'TAM', label: 'Tamaulipas' },
          { value: 'TLA', label: 'Tlaxcala' },
          { value: 'VER', label: 'Veracruz' },
          { value: 'YUC', label: 'Yucatán' },
          { value: 'ZAC', label: 'Zacatecas' }
        ]
      case 'United Kingdom':
        return [
          { value: 'ENG', label: 'England' },
          { value: 'SCT', label: 'Scotland' },
          { value: 'WLS', label: 'Wales' },
          { value: 'NIR', label: 'Northern Ireland' }
        ]
      case 'Australia':
        return [
          { value: 'NSW', label: 'New South Wales' },
          { value: 'VIC', label: 'Victoria' },
          { value: 'QLD', label: 'Queensland' },
          { value: 'WA', label: 'Western Australia' },
          { value: 'SA', label: 'South Australia' },
          { value: 'TAS', label: 'Tasmania' },
          { value: 'ACT', label: 'Australian Capital Territory' },
          { value: 'NT', label: 'Northern Territory' }
        ]
      default:
        return [{ value: '', label: 'Select state/province' }]
    }
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
    <AdminRedirect>
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
      <main className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
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
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button 
                  onClick={() => {
                    console.log('🖱️ Edit Profile clicked, setting isEditing to true')
                    setIsEditing(true)
                  }} 
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('🖱️ Save Changes clicked, isSaving:', isSaving)
                      handleSave()
                    }} 
                    disabled={isSaving} 
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6 pt-4">
            {/* Personal Information */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-white/70">Your basic profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white/90">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white/90">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-white/5 border-gray-500/30 text-white/50"
                    />
                    <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/90 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      Phone Number
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={profileData.phoneCountryCode}
                        onValueChange={(value) => handleInputChange('phoneCountryCode', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-24 bg-white/10 border-orange-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-orange-500/30">
                          <SelectItem value="+1" className="text-white hover:bg-orange-500/20">🇺🇸 +1</SelectItem>
                          <SelectItem value="+52" className="text-white hover:bg-orange-500/20">🇲🇽 +52</SelectItem>
                          <SelectItem value="+33" className="text-white hover:bg-orange-500/20">🇫🇷 +33</SelectItem>
                          <SelectItem value="+44" className="text-white hover:bg-orange-500/20">🇬🇧 +44</SelectItem>
                          <SelectItem value="+49" className="text-white hover:bg-orange-500/20">🇩🇪 +49</SelectItem>
                          <SelectItem value="+39" className="text-white hover:bg-orange-500/20">🇮🇹 +39</SelectItem>
                          <SelectItem value="+34" className="text-white hover:bg-orange-500/20">🇪🇸 +34</SelectItem>
                          <SelectItem value="+55" className="text-white hover:bg-orange-500/20">🇧🇷 +55</SelectItem>
                          <SelectItem value="+86" className="text-white hover:bg-orange-500/20">🇨🇳 +86</SelectItem>
                          <SelectItem value="+81" className="text-white hover:bg-orange-500/20">🇯🇵 +81</SelectItem>
                          <SelectItem value="+91" className="text-white hover:bg-orange-500/20">🇮🇳 +91</SelectItem>
                          <SelectItem value="+61" className="text-white hover:bg-orange-500/20">🇦🇺 +61</SelectItem>
                        </SelectContent>
                      </Select>
                    <Input
                      id="phone"
                        type="tel"
                      value={profileData.phone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value, profileData.phoneCountryCode)
                          handleInputChange('phone', formatted)
                        }}
                      disabled={!isEditing}
                        className="flex-1 bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {profileData.phone && !validatePhoneNumber(profileData.phone, profileData.phoneCountryCode) && (
                      <p className="text-red-400 text-sm mt-1">
                        Please enter a valid phone number for {profileData.phoneCountryCode}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Role field removed - only admins can change roles */}
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
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white/90 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-white/90">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-white/90">State/Province</Label>
                    <Select
                      value={profileData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="bg-white/10 border-orange-500/30 text-white">
                        <SelectValue placeholder="Select state/province" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-orange-500/30 max-h-60">
                        {getStateOptions(profileData.country).map((state) => (
                          <SelectItem key={state.value} value={state.value} className="text-white hover:bg-orange-500/20">
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-white/90">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={profileData.zipCode}
                      onChange={(e) => {
                        // Format ZIP code based on country
                        let formatted = e.target.value
                        if (profileData.country === "United States") {
                          // US ZIP: 12345 or 12345-6789
                          formatted = e.target.value.replace(/\D/g, '')
                          if (formatted.length > 5) {
                            formatted = formatted.slice(0, 5) + '-' + formatted.slice(5, 9)
                          }
                        } else if (profileData.country === "Canada") {
                          // Canadian postal: A1A 1A1
                          formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                          if (formatted.length > 3) {
                            formatted = formatted.slice(0, 3) + ' ' + formatted.slice(3, 6)
                          }
                        }
                        handleInputChange('zipCode', formatted)
                      }}
                      disabled={!isEditing}
                      className="bg-white/10 border-orange-500/30 text-white placeholder:text-white/50"
                      placeholder={profileData.country === "United States" ? "12345" : profileData.country === "Canada" ? "A1A 1A1" : "12345"}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-white/90">Country</Label>
                  <Select
                    value={profileData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-white/10 border-orange-500/30 text-white">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-orange-500/30 max-h-60">
                      <SelectItem value="United States" className="text-white hover:bg-orange-500/20">🇺🇸 United States</SelectItem>
                      <SelectItem value="Canada" className="text-white hover:bg-orange-500/20">🇨🇦 Canada</SelectItem>
                      <SelectItem value="Mexico" className="text-white hover:bg-orange-500/20">🇲🇽 Mexico</SelectItem>
                      <SelectItem value="United Kingdom" className="text-white hover:bg-orange-500/20">🇬🇧 United Kingdom</SelectItem>
                      <SelectItem value="France" className="text-white hover:bg-orange-500/20">🇫🇷 France</SelectItem>
                      <SelectItem value="Germany" className="text-white hover:bg-orange-500/20">🇩🇪 Germany</SelectItem>
                      <SelectItem value="Italy" className="text-white hover:bg-orange-500/20">🇮🇹 Italy</SelectItem>
                      <SelectItem value="Spain" className="text-white hover:bg-orange-500/20">🇪🇸 Spain</SelectItem>
                      <SelectItem value="Brazil" className="text-white hover:bg-orange-500/20">🇧🇷 Brazil</SelectItem>
                      <SelectItem value="Australia" className="text-white hover:bg-orange-500/20">🇦🇺 Australia</SelectItem>
                      <SelectItem value="Japan" className="text-white hover:bg-orange-500/20">🇯🇵 Japan</SelectItem>
                      <SelectItem value="China" className="text-white hover:bg-orange-500/20">🇨🇳 China</SelectItem>
                      <SelectItem value="India" className="text-white hover:bg-orange-500/20">🇮🇳 India</SelectItem>
                      <SelectItem value="Other" className="text-white hover:bg-orange-500/20">🌍 Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Lock className="w-5 h-5 text-orange-400" />
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


            {/* Quick Actions */}
            <Card className="bg-white/5 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-400" />
                  Account Security
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      </div>
    </AdminRedirect>
  )
}
