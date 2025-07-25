import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blink } from '../blink/client';
import { QRCode } from '../types/qr';
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Calendar,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';

export default function QRCodeManagement() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const loadQRCodes = async () => {
    try {
      const codes = await blink.db.qrCodes.list({
        orderBy: { createdAt: 'desc' }
      });
      setQrCodes(codes);
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCodes();
  }, []);

  const filteredCodes = qrCodes.filter(code => {
    const matchesSearch = code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || code.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSelectCode = (codeId: string) => {
    setSelectedCodes(prev => 
      prev.includes(codeId) 
        ? prev.filter(id => id !== codeId)
        : [...prev, codeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCodes.length === filteredCodes.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(filteredCodes.map(code => code.id));
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (confirm('Are you sure you want to delete this QR code?')) {
      try {
        await blink.db.qrCodes.delete(codeId);
        setQrCodes(prev => prev.filter(code => code.id !== codeId));
      } catch (error) {
        console.error('Failed to delete QR code:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedCodes.length} QR codes?`)) {
      try {
        for (const codeId of selectedCodes) {
          await blink.db.qrCodes.delete(codeId);
        }
        setQrCodes(prev => prev.filter(code => !selectedCodes.includes(code.id)));
        setSelectedCodes([]);
      } catch (error) {
        console.error('Failed to delete QR codes:', error);
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return '🔗';
      case 'vcard': return '👤';
      case 'wifi': return '📶';
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'phone': return '📞';
      case 'social': return '📱';
      case 'calendar': return '📅';
      case 'location': return '📍';
      default: return '📄';
    }
  };

  const getStatusBadge = (code: QRCode) => {
    const isExpired = code.expiresAt && new Date(code.expiresAt) < new Date();
    const isActive = Number(code.isActive) > 0;
    
    if (isExpired) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>;
    }
    if (!isActive) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Paused</span>;
    }
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My QR Codes</h1>
          <p className="text-gray-600">Manage and track all your QR codes</p>
        </div>
        <Link
          to="/create"
          className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create New QR Code
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="url">URL</option>
              <option value="vcard">Business Card</option>
              <option value="wifi">WiFi</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="phone">Phone</option>
              <option value="social">Social</option>
              <option value="calendar">Calendar</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCodes.length > 0 && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg flex items-center justify-between">
            <span className="text-indigo-700 font-medium">
              {selectedCodes.length} QR code{selectedCodes.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedCodes([])}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Codes Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredCodes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first QR code to get started'
              }
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create QR Code
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCodes.length === filteredCodes.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name & Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCodes.includes(code.id)}
                        onChange={() => handleSelectCode(code.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getTypeIcon(code.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{code.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{code.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(code.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-1 text-indigo-600" />
                        {code.scanCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(code)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/qr/${code.id}`}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {/* TODO: Implement edit */}}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* TODO: Implement duplicate */}}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* TODO: Implement download */}}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCode(code.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}