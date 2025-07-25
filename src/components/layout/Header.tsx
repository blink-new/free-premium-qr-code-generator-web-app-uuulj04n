import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Bell, Plus, Search, Settings, LogOut, User, QrCode } from 'lucide-react'
import { blink } from '../../blink/client'

interface HeaderProps {
  showSearch?: boolean
}

export function Header({ showSearch = false }: HeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleLogout = () => {
    blink.auth.logout()
    navigate('/')
  }

  if (loading) {
    return (
      <header className="border-b bg-white">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-2">
            <QrCode className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">QRGen Pro</span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <QrCode className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">QRGen Pro</span>
        </Link>

        {/* Search Bar */}
        {showSearch && user && (
          <div className="mx-6 flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search QR codes..."
                className="pl-10"
              />
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              {/* Create Button */}
              <Button asChild>
                <Link to="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create QR Code
                </Link>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Free Plan</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}