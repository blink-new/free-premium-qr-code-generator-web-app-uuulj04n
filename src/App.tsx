import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { CreateQRCode } from './pages/CreateQRCode'
import QRCodeManagement from './pages/QRCodeManagement'
import Analytics from './pages/Analytics'
import BulkOperations from './pages/BulkOperations'
import Settings from './pages/Settings'
import QRCodeDetail from './pages/QRCodeDetail'
import { Toaster } from './components/ui/toaster'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateQRCode />} />
          <Route path="/qr-codes" element={<QRCodeManagement />} />
          <Route path="/qr/:id" element={<QRCodeDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/bulk" element={<BulkOperations />} />
          <Route path="/team" element={<Navigate to="/dashboard" replace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/demo" element={<Navigate to="/" replace />} />
          <Route path="/features" element={<Navigate to="/" replace />} />
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route path="/api" element={<Navigate to="/" replace />} />
          <Route path="/templates" element={<Navigate to="/" replace />} />
          <Route path="/contact" element={<Navigate to="/" replace />} />
          <Route path="/privacy" element={<Navigate to="/" replace />} />
          <Route path="/terms" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App