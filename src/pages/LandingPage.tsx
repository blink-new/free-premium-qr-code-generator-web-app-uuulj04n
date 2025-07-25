import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Header } from '../components/layout/Header'
import { 
  QrCode, 
  Zap, 
  BarChart3, 
  Palette, 
  Globe, 
  Shield, 
  Download,
  Check,
  X,
  Star,
  Users,
  TrendingUp
} from 'lucide-react'
import { generateQRCode } from '../utils/qr-generator'

const features = [
  {
    icon: Zap,
    title: '100% Free Premium Features',
    description: 'All advanced features that competitors charge $8-42/month for, completely free forever.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Geographic data, device breakdown, scan patterns, and detailed insights without limits.'
  },
  {
    icon: Palette,
    title: 'Professional Customization',
    description: 'Upload logos, customize colors, choose templates, and create branded QR codes.'
  },
  {
    icon: Globe,
    title: 'Dynamic QR Codes',
    description: 'Edit destination URLs after printing. Perfect for campaigns and marketing materials.'
  },
  {
    icon: Shield,
    title: 'Advanced Security',
    description: 'Password protection, expiry dates, scan limits, and secure tracking.'
  },
  {
    icon: Download,
    title: 'Multiple Formats',
    description: 'Download as PNG, SVG, PDF. Perfect for print, web, and professional use.'
  }
]

const competitors = [
  {
    name: 'QRGen Pro',
    price: 'Free',
    features: {
      qrCodes: 'Unlimited',
      scans: 'Unlimited',
      analytics: true,
      customization: true,
      dynamic: true,
      api: true,
      support: true
    },
    highlight: true
  },
  {
    name: 'QR Code Generator Pro',
    price: '$8-42/mo',
    features: {
      qrCodes: '100-1000',
      scans: '100-10k',
      analytics: true,
      customization: true,
      dynamic: true,
      api: false,
      support: false
    }
  },
  {
    name: 'Beaconstac',
    price: '$9-75/mo',
    features: {
      qrCodes: '50-500',
      scans: '1k-50k',
      analytics: true,
      customization: true,
      dynamic: true,
      api: true,
      support: true
    }
  },
  {
    name: 'QR-Code-Generator.com',
    price: '$5-35/mo',
    features: {
      qrCodes: '25-500',
      scans: '500-25k',
      analytics: false,
      customization: true,
      dynamic: false,
      api: false,
      support: false
    }
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechStart Inc.',
    content: 'Finally, a QR code generator that doesn\'t charge premium prices for basic features. The analytics are incredible!',
    rating: 5
  },
  {
    name: 'Mike Rodriguez',
    role: 'Small Business Owner',
    content: 'Saved me $500/year compared to other services. The customization options are exactly what I needed.',
    rating: 5
  },
  {
    name: 'Emily Watson',
    role: 'Event Coordinator',
    content: 'Dynamic QR codes are a game-changer for our events. We can update information without reprinting materials.',
    rating: 5
  }
]

export function LandingPage() {
  const [demoUrl, setDemoUrl] = useState('https://qrgen.pro')
  const [demoQR, setDemoQR] = useState('')

  const generateDemoQR = useCallback(async () => {
    try {
      const qrCode = await generateQRCode(demoUrl, {
        foregroundColor: '#6366f1',
        backgroundColor: '#ffffff',
        size: 200
      })
      setDemoQR(qrCode)
    } catch (error) {
      console.error('Error generating demo QR:', error)
    }
  }, [demoUrl])

  useEffect(() => {
    generateDemoQR()
  }, [demoUrl, generateDemoQR])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-amber-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
              🎉 100% Free Premium Features
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create Professional QR Codes
              <span className="text-indigo-600"> Free Forever</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get all the premium features that competitors charge $8-42/month for, completely free. 
              No scan limits, no watermarks, no ads. Just professional QR codes with advanced analytics.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start Creating Free QR Codes
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/demo">
                  View Live Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Try It Now - Live QR Generator
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Enter any URL below and see your QR code generated instantly
            </p>
          </div>
          
          <div className="mt-16 mx-auto max-w-4xl">
            <Card className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Enter URL to generate QR code:
                  </label>
                  <Input
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="text-lg"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDemoUrl('https://qrgen.pro')}
                    >
                      Website
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDemoUrl('https://instagram.com/yourhandle')}
                    >
                      Instagram
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDemoUrl('mailto:hello@example.com')}
                    >
                      Email
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  {demoQR && (
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <img src={demoQR} alt="Generated QR Code" className="w-48 h-48" />
                    </div>
                  )}
                  <Button onClick={generateDemoQR} variant="outline">
                    Regenerate QR Code
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Premium Features, Zero Cost
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to create, customize, and track professional QR codes
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Pay When You Can Get It Free?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Compare QRGen Pro with expensive alternatives
            </p>
          </div>
          
          <div className="mt-16 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    QR Codes
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Scans
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Analytics
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Dynamic
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    API
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {competitors.map((competitor, index) => (
                  <tr key={index} className={competitor.highlight ? 'bg-indigo-50' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`font-semibold ${competitor.highlight ? 'text-indigo-900' : 'text-gray-900'}`}>
                          {competitor.name}
                        </span>
                        {competitor.highlight && (
                          <Badge className="ml-2 bg-indigo-100 text-indigo-700">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${competitor.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
                        {competitor.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {competitor.features.qrCodes}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {competitor.features.scans}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {competitor.features.analytics ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {competitor.features.dynamic ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {competitor.features.api ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by Thousands of Users
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our users are saying about QRGen Pro
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-sm text-gray-500">{testimonial.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-indigo-200 mr-2" />
                <span className="text-4xl font-bold text-white">50K+</span>
              </div>
              <p className="mt-2 text-indigo-200">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <QrCode className="h-8 w-8 text-indigo-200 mr-2" />
                <span className="text-4xl font-bold text-white">2M+</span>
              </div>
              <p className="mt-2 text-indigo-200">QR Codes Generated</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-indigo-200 mr-2" />
                <span className="text-4xl font-bold text-white">100M+</span>
              </div>
              <p className="mt-2 text-indigo-200">Total Scans Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to Create Professional QR Codes?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of users who've switched from expensive alternatives
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Get Started Free - No Credit Card Required
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free forever • No hidden fees • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold text-white">QRGen Pro</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The world's most advanced QR code generator. Create, customize, and track professional QR codes with premium features - completely free.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/api" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link to="/templates" className="text-gray-400 hover:text-white">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400">
              © 2024 QRGen Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}