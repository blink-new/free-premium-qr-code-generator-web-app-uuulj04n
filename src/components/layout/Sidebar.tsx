import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { 
  LayoutDashboard, 
  QrCode, 
  BarChart3, 
  Upload, 
  Settings, 
  HelpCircle,
  Users
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My QR Codes', href: '/qr-codes', icon: QrCode },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Bulk Actions', href: '/bulk', icon: Upload },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}