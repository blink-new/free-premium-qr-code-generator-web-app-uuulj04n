import QRCode from 'qrcode'
import { QRCodeContent, QRCodeType, QRDesignSettings } from '../types/qr'

export const generateQRData = (type: QRCodeType, content: QRCodeContent): string => {
  switch (type) {
    case 'url':
      return content.url || ''
    
    case 'vcard':
      return `BEGIN:VCARD
VERSION:3.0
FN:${content.firstName} ${content.lastName}
ORG:${content.company}
TITLE:${content.jobTitle}
TEL:${content.phone}
EMAIL:${content.email}
URL:${content.website}
ADR:;;${content.address};;;;
END:VCARD`
    
    case 'wifi':
      return `WIFI:T:${content.security};S:${content.ssid};P:${content.password};H:${content.hidden ? 'true' : 'false'};;`
    
    case 'email':
      return `mailto:${content.to}?subject=${encodeURIComponent(content.subject || '')}&body=${encodeURIComponent(content.body || '')}`
    
    case 'sms':
      return `sms:${content.number}?body=${encodeURIComponent(content.message || '')}`
    
    case 'phone':
      return `tel:${content.phone}`
    
    case 'social': {
      const socialUrls = {
        instagram: `https://instagram.com/${content.username}`,
        twitter: `https://twitter.com/${content.username}`,
        linkedin: `https://linkedin.com/in/${content.username}`,
        facebook: `https://facebook.com/${content.username}`,
        tiktok: `https://tiktok.com/@${content.username}`,
        youtube: `https://youtube.com/@${content.username}`
      }
      return socialUrls[content.platform as keyof typeof socialUrls] || content.url || ''
    }
    
    case 'calendar': {
      const startDate = content.startDate ? new Date(content.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''
      const endDate = content.endDate ? new Date(content.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : ''
      return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${content.eventTitle}
DTSTART:${startDate}
DTEND:${endDate}
LOCATION:${content.location}
END:VEVENT
END:VCALENDAR`
    }
    
    case 'location':
      return `geo:${content.latitude},${content.longitude}`
    
    default:
      return content.url || ''
  }
}

export const generateQRCode = async (
  data: string,
  settings: QRDesignSettings
): Promise<string> => {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: settings.size,
      margin: 2,
      color: {
        dark: settings.foregroundColor,
        light: settings.backgroundColor
      },
      errorCorrectionLevel: 'M'
    })

    // If no logo, return the basic QR code
    if (!settings.logoUrl) {
      return qrDataURL
    }

    // Create canvas to add logo
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return qrDataURL

    canvas.width = settings.size
    canvas.height = settings.size

    // Draw QR code
    const qrImage = new Image()
    qrImage.src = qrDataURL
    
    return new Promise((resolve) => {
      qrImage.onload = () => {
        ctx.drawImage(qrImage, 0, 0, settings.size, settings.size)

        // Draw logo if provided
        if (settings.logoUrl) {
          const logo = new Image()
          logo.crossOrigin = 'anonymous'
          logo.src = settings.logoUrl
          
          logo.onload = () => {
            const logoSize = settings.logoSize || settings.size * 0.2
            const x = (settings.size - logoSize) / 2
            const y = (settings.size - logoSize) / 2
            
            // Draw white background for logo
            ctx.fillStyle = settings.backgroundColor
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)
            
            // Draw logo
            ctx.drawImage(logo, x, y, logoSize, logoSize)
            
            resolve(canvas.toDataURL())
          }
          
          logo.onerror = () => resolve(qrDataURL)
        } else {
          resolve(canvas.toDataURL())
        }
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export const downloadQRCode = (dataURL: string, filename: string, format: 'png' | 'svg' | 'pdf' = 'png') => {
  const link = document.createElement('a')
  link.download = `${filename}.${format}`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}