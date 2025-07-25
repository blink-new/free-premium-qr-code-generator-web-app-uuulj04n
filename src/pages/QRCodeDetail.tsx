import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blink } from '../blink/client';
import { QRCode } from '../types/qr';
import { generateQRCode } from '../utils/qr-generator';
import { 
  ArrowLeft,
  Download,
  Edit,
  Copy,
  Trash2,
  Eye,
  BarChart3,
  Calendar,
  Globe,
  Smartphone,
  Share2,
  Settings,
  Pause,
  Play
} from 'lucide-react';

export default function QRCodeDetail() {
  const { id } = useParams<{ id: string }>();
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const loadQRCode = async (qrId: string) => {
    try {
      const code = await blink.db.qrCodes.list({
        where: { id: qrId }
      });
      
      if (code.length > 0) {
        const qrData = code[0];
        setQrCode(qrData);
        
        // Generate QR code image
        const imageUrl = await generateQRCode(
          qrData.content.url || JSON.stringify(qrData.content),
          qrData.designSettings || {}
        );
        setQrImageUrl(imageUrl);
      }
    } catch (error) {
      console.error('Failed to load QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadQRCode(id);
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!qrCode) return;
    
    try {
      const newStatus = Number(qrCode.isActive) > 0 ? false : true;
      await blink.db.qrCodes.update(qrCode.id, { isActive: newStatus });
      setQrCode(prev => prev ? { ...prev, isActive: newStatus ? "1" : "0" } : null);
    } catch (error) {
      console.error('Failed to toggle QR code status:', error);
    }
  };

  const handleDelete = async () => {
    if (!qrCode || !confirm('Are you sure you want to delete this QR code?')) return;
    
    try {
      await blink.db.qrCodes.delete(qrCode.id);
      window.location.href = '/qr-codes';
    } catch (error) {
      console.error('Failed to delete QR code:', error);
    }
  };

  const handleDownload = () => {
    if (!qrImageUrl) return;
    
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `${qrCode?.name || 'qr-code'}.png`;
    link.click();
  };

  const handleCopyLink = () => {
    if (qrCode?.content.url) {
      navigator.clipboard.writeText(qrCode.content.url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Code Not Found</h2>
        <p className="text-gray-600 mb-4">The QR code you're looking for doesn't exist.</p>
        <Link
          to="/qr-codes"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to QR Codes
        </Link>
      </div>
    );
  }

  const isActive = Number(qrCode.isActive) > 0;
  const isExpired = qrCode.expiresAt && new Date(qrCode.expiresAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/qr-codes"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{qrCode.name}</h1>
            <p className="text-gray-600 capitalize">{qrCode.type} QR Code</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleStatus}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isActive ? 'Pause' : 'Activate'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* QR Code Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Preview</h2>
            
            <div className="text-center">
              {qrImageUrl ? (
                <img 
                  src={qrImageUrl} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto border rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 mx-auto bg-gray-100 border rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}
              
              <div className="mt-4 space-y-2">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isExpired 
                    ? 'bg-red-100 text-red-800'
                    : isActive 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {isExpired ? 'Expired' : isActive ? 'Active' : 'Paused'}
                </div>
                
                <p className="text-sm text-gray-600">
                  Created {new Date(qrCode.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Details and Analytics */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'settings', label: 'Settings', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <p className="text-sm text-gray-900">{qrCode.name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <p className="text-sm text-gray-900 capitalize">{qrCode.type}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <p className="text-sm text-gray-900 break-all">
                          {qrCode.content.url || JSON.stringify(qrCode.content)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Scans</label>
                        <p className="text-sm text-gray-900">{qrCode.scanCount || 0}</p>
                      </div>
                      
                      {qrCode.expiresAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expires</label>
                          <p className="text-sm text-gray-900">
                            {new Date(qrCode.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {qrCode.maxScans && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Scan Limit</label>
                          <p className="text-sm text-gray-900">{qrCode.maxScans}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{qrCode.scanCount || 0}</div>
                        <div className="text-sm text-blue-800">Total Scans</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">0</div>
                        <div className="text-sm text-green-800">Today</div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">0</div>
                        <div className="text-sm text-purple-800">This Week</div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-amber-600">0</div>
                        <div className="text-sm text-amber-800">This Month</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Scan Analytics</h3>
                    
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h4>
                      <p className="text-gray-600">
                        Analytics will appear here once your QR code starts getting scanned.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">QR Code Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Dynamic QR Code</h4>
                          <p className="text-sm text-gray-500">Allow editing destination after creation</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          Number(qrCode.isDynamic) > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {Number(qrCode.isDynamic) > 0 ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Password Protection</h4>
                          <p className="text-sm text-gray-500">Require password to access</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          qrCode.passwordHash
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {qrCode.passwordHash ? 'Protected' : 'Not Protected'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Status</h4>
                          <p className="text-sm text-gray-500">Current QR code status</p>
                        </div>
                        <button
                          onClick={handleToggleStatus}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {isActive ? 'Active' : 'Paused'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
                    
                    <button
                      onClick={handleDelete}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}