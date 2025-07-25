import React, { useState, useEffect, useCallback } from 'react';
import { blink } from '../blink/client';
import { 
  BarChart3, 
  TrendingUp, 
  Smartphone, 
  Download,
  Eye,
  Users,
  Clock,
  MapPin
} from 'lucide-react';

interface AnalyticsData {
  totalScans: number;
  uniqueScans: number;
  topQRCodes: Array<{
    id: string;
    name: string;
    scans: number;
    type: string;
  }>;
  scansByCountry: Array<{
    country: string;
    scans: number;
  }>;
  scansByDevice: Array<{
    device: string;
    scans: number;
  }>;
  scansByTime: Array<{
    date: string;
    scans: number;
  }>;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalScans: 0,
    uniqueScans: 0,
    topQRCodes: [],
    scansByCountry: [],
    scansByDevice: [],
    scansByTime: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const generateTimeSeriesData = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        scans: Math.floor(Math.random() * 50) + 10
      });
    }
    
    return data;
  };

  const loadAnalytics = useCallback(async () => {
    try {
      // Load QR codes and simulate analytics data
      const qrCodes = await blink.db.qrCodes.list({
        orderBy: { createdAt: 'desc' }
      });

      // Simulate analytics data (in real app, this would come from scans table)
      const mockAnalytics: AnalyticsData = {
        totalScans: qrCodes.reduce((sum, code) => sum + (code.scanCount || 0), 0),
        uniqueScans: Math.floor(qrCodes.reduce((sum, code) => sum + (code.scanCount || 0), 0) * 0.8),
        topQRCodes: qrCodes
          .map(code => ({
            id: code.id,
            name: code.name,
            scans: code.scanCount || 0,
            type: code.type
          }))
          .sort((a, b) => b.scans - a.scans)
          .slice(0, 5),
        scansByCountry: [
          { country: 'United States', scans: 245 },
          { country: 'United Kingdom', scans: 189 },
          { country: 'Germany', scans: 156 },
          { country: 'France', scans: 134 },
          { country: 'Canada', scans: 98 }
        ],
        scansByDevice: [
          { device: 'Mobile', scans: 456 },
          { device: 'Desktop', scans: 234 },
          { device: 'Tablet', scans: 132 }
        ],
        scansByTime: generateTimeSeriesData(timeRange)
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const StatCard = ({ icon: Icon, title, value, change, color = 'indigo' }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    change?: string;
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track performance across all your QR codes</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Eye}
          title="Total Scans"
          value={analyticsData.totalScans}
          change="+12% from last period"
          color="indigo"
        />
        <StatCard
          icon={Users}
          title="Unique Scans"
          value={analyticsData.uniqueScans}
          change="+8% from last period"
          color="green"
        />
        <StatCard
          icon={BarChart3}
          title="Active QR Codes"
          value={analyticsData.topQRCodes.length}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg. Daily Scans"
          value={Math.floor(analyticsData.totalScans / 30)}
          change="+15% from last period"
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Scan Timeline</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.scansByTime.slice(-7).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="flex items-center flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.scans / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.scans}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.scansByDevice.map((item, index) => {
              const total = analyticsData.scansByDevice.reduce((sum, d) => sum + d.scans, 0);
              const percentage = Math.round((item.scans / total) * 100);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-indigo-600' : 
                      index === 1 ? 'bg-green-500' : 'bg-amber-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">{item.device}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{percentage}%</span>
                    <span className="text-sm text-gray-500">({item.scans})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing QR Codes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing QR Codes</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.topQRCodes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-500">No QR codes with scans yet</p>
              </div>
            ) : (
              analyticsData.topQRCodes.map((code, index) => (
                <div key={code.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-indigo-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{code.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{code.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{code.scans}</p>
                    <p className="text-xs text-gray-500">scans</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.scansByCountry.map((item, index) => {
              const maxScans = Math.max(...analyticsData.scansByCountry.map(c => c.scans));
              const percentage = (item.scans / maxScans) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.country}</span>
                  <div className="flex items-center flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.scans}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}