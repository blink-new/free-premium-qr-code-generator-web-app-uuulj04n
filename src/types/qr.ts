export interface QRCode {
  id: string
  userId: string
  name: string
  type: QRCodeType
  content: QRCodeContent
  designSettings?: QRDesignSettings
  isDynamic: boolean
  shortUrl?: string
  passwordHash?: string
  expiresAt?: string
  maxScans?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type QRCodeType = 
  | 'url' 
  | 'vcard' 
  | 'wifi' 
  | 'email' 
  | 'sms' 
  | 'phone' 
  | 'social' 
  | 'app' 
  | 'file' 
  | 'calendar' 
  | 'location'

export interface QRCodeContent {
  url?: string
  title?: string
  description?: string
  // vCard fields
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  // WiFi fields
  ssid?: string
  password?: string
  security?: 'WPA' | 'WEP' | 'nopass'
  hidden?: boolean
  // Email fields
  to?: string
  subject?: string
  body?: string
  // SMS fields
  number?: string
  message?: string
  // Social fields
  platform?: string
  username?: string
  // Calendar fields
  eventTitle?: string
  startDate?: string
  endDate?: string
  location?: string
  // Location fields
  latitude?: number
  longitude?: number
}

export interface QRDesignSettings {
  foregroundColor: string
  backgroundColor: string
  logoUrl?: string
  logoSize?: number
  template?: string
  frameStyle?: string
  eyePattern?: string
  size: number
}

export interface QRScan {
  id: string
  qrCodeId: string
  scannedAt: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  country?: string
  city?: string
  deviceType?: string
  browser?: string
  os?: string
}

export interface Campaign {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: string
}

export interface QRAnalytics {
  totalScans: number
  uniqueScans: number
  scansByDate: { date: string; scans: number }[]
  scansByCountry: { country: string; scans: number }[]
  scansByDevice: { device: string; scans: number }[]
  scansByBrowser: { browser: string; scans: number }[]
}