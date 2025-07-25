import React, { useState } from 'react';
import { blink } from '../blink/client';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Plus,
  Trash2
} from 'lucide-react';

interface BulkQRData {
  name: string;
  url: string;
  type: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export default function BulkOperations() {
  const [bulkData, setBulkData] = useState<BulkQRData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data: BulkQRData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2 && values[0] && values[1]) {
          data.push({
            name: values[0],
            url: values[1],
            type: 'url',
            status: 'pending'
          });
        }
      }
      
      setBulkData(data);
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,URL\nMy Website,https://example.com\nCompany Page,https://company.com\nProduct Link,https://product.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const processBulkCreation = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < bulkData.length; i++) {
      const item = bulkData[i];
      
      try {
        await blink.db.qrCodes.create({
          name: item.name,
          type: 'url',
          content: { url: item.url },
          designSettings: {
            foregroundColor: '#000000',
            backgroundColor: '#ffffff',
            size: 256
          },
          isDynamic: true,
          isActive: true,
          scanCount: 0
        });

        setBulkData(prev => prev.map((data, index) => 
          index === i ? { ...data, status: 'success' } : data
        ));
      } catch (error) {
        setBulkData(prev => prev.map((data, index) => 
          index === i ? { 
            ...data, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : data
        ));
      }

      setProgress(((i + 1) / bulkData.length) * 100);
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsProcessing(false);
  };

  const addManualRow = () => {
    setBulkData(prev => [...prev, {
      name: '',
      url: '',
      type: 'url',
      status: 'pending'
    }]);
  };

  const updateRow = (index: number, field: 'name' | 'url', value: string) => {
    setBulkData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeRow = (index: number) => {
    setBulkData(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Operations</h1>
        <p className="text-gray-600">Create multiple QR codes at once using CSV import</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Import QR Codes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload CSV file</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
            
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">CSV Format Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• First row should contain headers: Name, URL</li>
              <li>• Each subsequent row represents one QR code</li>
              <li>• Name: Display name for the QR code</li>
              <li>• URL: Destination website URL</li>
              <li>• Maximum 100 QR codes per batch</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Manual Entry</h2>
          <button
            onClick={addManualRow}
            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Row
          </button>
        </div>

        {bulkData.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No QR codes to process</p>
            <p className="text-sm text-gray-400">Upload a CSV file or add rows manually</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            {isProcessing && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Processing QR Codes...</span>
                  <span className="text-sm text-blue-700">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bulkData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {isProcessing && progress > (index / bulkData.length) * 100 ? (
                            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                          ) : (
                            getStatusIcon(item.status)
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateRow(index, 'name', e.target.value)}
                          disabled={isProcessing}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                          placeholder="QR Code Name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => updateRow(index, 'url', e.target.value)}
                          disabled={isProcessing}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                          placeholder="https://example.com"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeRow(index)}
                          disabled={isProcessing}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                {bulkData.length} QR code{bulkData.length !== 1 ? 's' : ''} ready to process
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setBulkData([])}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Clear All
                </button>
                <button
                  onClick={processBulkCreation}
                  disabled={isProcessing || bulkData.length === 0 || bulkData.some(item => !item.name || !item.url)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                      Processing...
                    </>
                  ) : (
                    'Create QR Codes'
                  )}
                </button>
              </div>
            </div>

            {/* Results Summary */}
            {!isProcessing && bulkData.some(item => item.status !== 'pending') && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Processing Results</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bulkData.filter(item => item.status === 'success').length}
                    </div>
                    <div className="text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {bulkData.filter(item => item.status === 'error').length}
                    </div>
                    <div className="text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {bulkData.filter(item => item.status === 'pending').length}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}