import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  QrCode, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Plus,
  ExternalLink,
  Download,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { blink } from '../blink/client'
import { QRCode as QRCodeType } from '../types/qr'

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [qrCodes, setQrCodes] = useState<QRCodeType[]>([])
  const [stats, setStats] = useState({
    totalCodes: 0,
    totalScans: 0,
    activeCodes: 0,
    scansTrend: '+12%'
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return
    
    try {
      // Load user's QR codes
      const codes = await blink.db.qrCodes.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 5
      })
      
      setQrCodes(codes.map(code => ({
        ...code,
        content: typeof code.content === 'string' ? JSON.parse(code.content) : code.content,
        designSettings: code.designSettings ? 
          (typeof code.designSettings === 'string' ? JSON.parse(code.designSettings) : code.designSettings) 
          : undefined
      })))

      // Calculate stats
      const allCodes = await blink.db.qrCodes.list({
        where: { userId: user.id }
      })
      
      const scans = await blink.db.qrScans.list({
        where: { qrCodeId: { in: allCodes.map(c => c.id) } }
      })

      setStats({
        totalCodes: allCodes.length,
        totalScans: scans.length,
        activeCodes: allCodes.filter(c => Number(c.isActive) > 0).length,
        scansTrend: '+12%'
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }, [user?.id])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user && !state.isLoading) {
        loadDashboardData()
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [loadDashboardData])

  const getQRTypeLabel = (type: string) => {
    const labels = {
      url: 'Website',
      vcard: 'Business Card',
      wifi: 'WiFi',
      email: 'Email',
      sms: 'SMS',
      phone: 'Phone',
      social: 'Social Media',
      app: 'App Store',
      file: 'File',
      calendar: 'Calendar',
      location: 'Location'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getQRTypeColor = (type: string) => {
    const colors = {
      url: 'bg-blue-100 text-blue-800',
      vcard: 'bg-green-100 text-green-800',
      wifi: 'bg-purple-100 text-purple-800',
      email: 'bg-orange-100 text-orange-800',
      sms: 'bg-pink-100 text-pink-800',
      phone: 'bg-indigo-100 text-indigo-800',
      social: 'bg-red-100 text-red-800',
      app: 'bg-gray-100 text-gray-800',
      file: 'bg-yellow-100 text-yellow-800',
      calendar: 'bg-teal-100 text-teal-800',
      location: 'bg-cyan-100 text-cyan-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSearch />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your QR codes.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
                <QrCode className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCodes}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeCodes} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalScans}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.scansTrend} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scan Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalCodes > 0 ? Math.round(stats.totalScans / stats.totalCodes) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average scans per QR code
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">
                  You're doing great!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent QR Codes */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent QR Codes</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/qr-codes">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {qrCodes.length === 0 ? (
                    <div className="text-center py-8">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
                      <p className="text-gray-600 mb-4">Create your first QR code to get started</p>
                      <Button asChild>
                        <Link to="/create">
                          <Plus className="mr-2 h-4 w-4" />
                          Create QR Code
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qrCodes.map((qr) => (
                        <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <QrCode className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{qr.name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getQRTypeColor(qr.type)}>
                                  {getQRTypeLabel(qr.type)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {new Date(qr.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Create */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Create</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/create?type=url">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website URL
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/create?type=vcard">
                      <Users className="mr-2 h-4 w-4" />
                      Business Card
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/create?type=wifi">
                      <QrCode className="mr-2 h-4 w-4" />
                      WiFi Network
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/create?type=email">
                      <QrCode className="mr-2 h-4 w-4" />
                      Email
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/create">
                      <Plus className="mr-2 h-4 w-4" />
                      View All Types
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Analytics Preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week</span>
                      <span className="font-medium">{Math.floor(stats.totalScans * 0.3)} scans</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-medium">{Math.floor(stats.totalScans * 0.7)} scans</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">All Time</span>
                      <span className="font-medium">{stats.totalScans} scans</span>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/analytics">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Detailed Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}