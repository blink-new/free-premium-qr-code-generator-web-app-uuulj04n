import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Switch } from '../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { 
  ExternalLink, 
  User, 
  Wifi, 
  Mail, 
  MessageSquare, 
  Phone, 
  Share2,
  Download,
  Calendar,
  MapPin,
  Palette,
  Upload,
  Eye,
  Settings
} from 'lucide-react'
import { blink } from '../blink/client'
import { QRCodeType, QRCodeContent, QRDesignSettings } from '../types/qr'
import { generateQRCode, generateQRData, downloadQRCode } from '../utils/qr-generator'

const qrTypes = [
  { id: 'url', name: 'Website URL', icon: ExternalLink, description: 'Link to any website or webpage' },
  { id: 'vcard', name: 'Business Card', icon: User, description: 'Digital contact information' },
  { id: 'wifi', name: 'WiFi Network', icon: Wifi, description: 'WiFi connection details' },
  { id: 'email', name: 'Email', icon: Mail, description: 'Pre-filled email message' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'Text message with content' },
  { id: 'phone', name: 'Phone', icon: Phone, description: 'Direct phone call' },
  { id: 'social', name: 'Social Media', icon: Share2, description: 'Social media profiles' },
  { id: 'calendar', name: 'Calendar Event', icon: Calendar, description: 'Add event to calendar' },
  { id: 'location', name: 'Location', icon: MapPin, description: 'Geographic coordinates' }
]

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'youtube', name: 'YouTube' }
]

const colorPresets = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff' },
  { name: 'Indigo', fg: '#6366f1', bg: '#ffffff' },
  { name: 'Green', fg: '#059669', bg: '#ffffff' },
  { name: 'Red', fg: '#dc2626', bg: '#ffffff' },
  { name: 'Purple', fg: '#7c3aed', bg: '#ffffff' },
  { name: 'Dark', fg: '#ffffff', bg: '#1f2937' }
]

export function CreateQRCode() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState<QRCodeType>(
    (searchParams.get('type') as QRCodeType) || 'url'
  )
  
  // Form data
  const [qrName, setQrName] = useState('')
  const [content, setContent] = useState<QRCodeContent>({})
  const [isDynamic, setIsDynamic] = useState(true)
  const [designSettings, setDesignSettings] = useState<QRDesignSettings>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    size: 512
  })
  
  // Preview
  const [qrPreview, setQrPreview] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const generatePreview = useCallback(async () => {
    try {
      const qrData = generateQRData(selectedType, content)
      if (qrData) {
        const preview = await generateQRCode(qrData, designSettings)
        setQrPreview(preview)
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }, [selectedType, content, designSettings])

  useEffect(() => {
    generatePreview()
  }, [selectedType, content, designSettings, generatePreview])

  const handleCreateQR = async () => {
    if (!user || !qrName.trim()) return

    setIsGenerating(true)
    try {
      const qrData = generateQRData(selectedType, content)
      const shortUrl = isDynamic ? `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined

      await blink.db.qrCodes.create({
        id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        name: qrName,
        type: selectedType,
        content: JSON.stringify(content),
        designSettings: JSON.stringify(designSettings),
        isDynamic: isDynamic ? 1 : 0,
        shortUrl,
        isActive: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      navigate('/qr-codes')
    } catch (error) {
      console.error('Error creating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (qrPreview) {
      downloadQRCode(qrPreview, qrName || 'qr-code')
    }
  }

  const renderContentForm = () => {
    switch (selectedType) {
      case 'url':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={content.url || ''}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="My Website"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your website"
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
              />
            </div>
          </div>
        )

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={content.firstName || ''}
                  onChange={(e) => setContent({ ...content, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={content.lastName || ''}
                  onChange={(e) => setContent({ ...content, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={content.company || ''}
                onChange={(e) => setContent({ ...content, company: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={content.jobTitle || ''}
                onChange={(e) => setContent({ ...content, jobTitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={content.phone || ''}
                  onChange={(e) => setContent({ ...content, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={content.email || ''}
                  onChange={(e) => setContent({ ...content, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={content.website || ''}
                onChange={(e) => setContent({ ...content, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={content.address || ''}
                onChange={(e) => setContent({ ...content, address: e.target.value })}
              />
            </div>
          </div>
        )

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ssid">Network Name (SSID)</Label>
              <Input
                id="ssid"
                value={content.ssid || ''}
                onChange={(e) => setContent({ ...content, ssid: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={content.password || ''}
                onChange={(e) => setContent({ ...content, password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="security">Security Type</Label>
              <Select
                value={content.security || 'WPA'}
                onValueChange={(value) => setContent({ ...content, security: value as 'WPA' | 'WEP' | 'nopass' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">No Password</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hidden"
                checked={content.hidden || false}
                onCheckedChange={(checked) => setContent({ ...content, hidden: checked })}
              />
              <Label htmlFor="hidden">Hidden Network</Label>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To Email</Label>
              <Input
                id="to"
                type="email"
                value={content.to || ''}
                onChange={(e) => setContent({ ...content, to: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={content.subject || ''}
                onChange={(e) => setContent({ ...content, subject: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={content.body || ''}
                onChange={(e) => setContent({ ...content, body: e.target.value })}
              />
            </div>
          </div>
        )

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="number">Phone Number</Label>
              <Input
                id="number"
                value={content.number || ''}
                onChange={(e) => setContent({ ...content, number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={content.message || ''}
                onChange={(e) => setContent({ ...content, message: e.target.value })}
              />
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={content.phone || ''}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
              />
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={content.platform || ''}
                onValueChange={(value) => setContent({ ...content, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@username"
                value={content.username || ''}
                onChange={(e) => setContent({ ...content, username: e.target.value })}
              />
            </div>
          </div>
        )

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={content.eventTitle || ''}
                onChange={(e) => setContent({ ...content, eventTitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={content.startDate || ''}
                  onChange={(e) => setContent({ ...content, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={content.endDate || ''}
                  onChange={(e) => setContent({ ...content, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={content.location || ''}
                onChange={(e) => setContent({ ...content, location: e.target.value })}
              />
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={content.latitude || ''}
                  onChange={(e) => setContent({ ...content, latitude: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={content.longitude || ''}
                  onChange={(e) => setContent({ ...content, longitude: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create QR Code</h1>
              <p className="text-gray-600">Generate professional QR codes with advanced customization</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="1">1. Type & Content</TabsTrigger>
                    <TabsTrigger value="2">2. Customize Design</TabsTrigger>
                    <TabsTrigger value="3">3. Generate & Download</TabsTrigger>
                  </TabsList>

                  {/* Step 1: Type Selection & Content */}
                  <TabsContent value="1" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Choose QR Code Type</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {qrTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setSelectedType(type.id as QRCodeType)}
                              className={`p-4 border rounded-lg text-left transition-colors ${
                                selectedType === type.id
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <type.icon className={`h-6 w-6 mb-2 ${
                                selectedType === type.id ? 'text-indigo-600' : 'text-gray-600'
                              }`} />
                              <h3 className="font-medium text-gray-900">{type.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>QR Code Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="qrName">QR Code Name</Label>
                          <Input
                            id="qrName"
                            placeholder="My QR Code"
                            value={qrName}
                            onChange={(e) => setQrName(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="dynamic"
                            checked={isDynamic}
                            onCheckedChange={setIsDynamic}
                          />
                          <Label htmlFor="dynamic">Dynamic QR Code</Label>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Dynamic QR codes can be edited after creation without reprinting
                        </p>

                        {renderContentForm()}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Step 2: Design Customization */}
                  <TabsContent value="2" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Palette className="mr-2 h-5 w-5" />
                          Design Customization
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Color Presets */}
                        <div>
                          <Label>Color Presets</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {colorPresets.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => setDesignSettings({
                                  ...designSettings,
                                  foregroundColor: preset.fg,
                                  backgroundColor: preset.bg
                                })}
                                className="p-3 border rounded-lg text-center hover:border-gray-300"
                              >
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: preset.fg }}
                                  />
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: preset.bg }}
                                  />
                                </div>
                                <span className="text-xs">{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Colors */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="foreground">Foreground Color</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                id="foreground"
                                type="color"
                                value={designSettings.foregroundColor}
                                onChange={(e) => setDesignSettings({
                                  ...designSettings,
                                  foregroundColor: e.target.value
                                })}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={designSettings.foregroundColor}
                                onChange={(e) => setDesignSettings({
                                  ...designSettings,
                                  foregroundColor: e.target.value
                                })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="background">Background Color</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Input
                                id="background"
                                type="color"
                                value={designSettings.backgroundColor}
                                onChange={(e) => setDesignSettings({
                                  ...designSettings,
                                  backgroundColor: e.target.value
                                })}
                                className="w-12 h-10 p-1"
                              />
                              <Input
                                value={designSettings.backgroundColor}
                                onChange={(e) => setDesignSettings({
                                  ...designSettings,
                                  backgroundColor: e.target.value
                                })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Size */}
                        <div>
                          <Label htmlFor="size">Size (pixels)</Label>
                          <Select
                            value={designSettings.size.toString()}
                            onValueChange={(value) => setDesignSettings({
                              ...designSettings,
                              size: parseInt(value)
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="256">256x256 (Small)</SelectItem>
                              <SelectItem value="512">512x512 (Medium)</SelectItem>
                              <SelectItem value="1024">1024x1024 (Large)</SelectItem>
                              <SelectItem value="2048">2048x2048 (Extra Large)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Logo Upload */}
                        <div>
                          <Label>Logo (Coming Soon)</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Logo upload feature coming soon</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Step 3: Generate & Download */}
                  <TabsContent value="3" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Download className="mr-2 h-5 w-5" />
                          Generate & Download
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Ready to create your QR code?</h3>
                            <p className="text-sm text-gray-600">
                              Your QR code will be saved to your account and ready for download
                            </p>
                          </div>
                          <Button 
                            onClick={handleCreateQR}
                            disabled={isGenerating || !qrName.trim()}
                            size="lg"
                          >
                            {isGenerating ? 'Creating...' : 'Create QR Code'}
                          </Button>
                        </div>

                        {qrPreview && (
                          <div className="flex items-center justify-between pt-4 border-t">
                            <span className="text-sm text-gray-600">Preview ready</span>
                            <Button variant="outline" onClick={handleDownload}>
                              <Download className="mr-2 h-4 w-4" />
                              Download Preview
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={currentStep === 3}
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="mr-2 h-5 w-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {qrPreview ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border-2 border-gray-200 inline-block">
                          <img 
                            src={qrPreview} 
                            alt="QR Code Preview" 
                            className="w-48 h-48 mx-auto"
                          />
                        </div>
                        <div className="text-left space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <Badge>{qrTypes.find(t => t.id === selectedType)?.name}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dynamic:</span>
                            <span>{isDynamic ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Size:</span>
                            <span>{designSettings.size}x{designSettings.size}px</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                          <Settings className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mt-4">Configure your QR code to see preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}