import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface APITestResult {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

const APITest: React.FC = () => {
  const [results, setResults] = useState<APITestResult[]>([]);

  const testEndpoints = [
    { name: 'Health Check', endpoint: '/health', auth: false },
    { name: 'Programs', endpoint: '/programs', auth: false },
    { name: 'Programs Featured', endpoint: '/programs/featured', auth: false },
    { name: 'Programs Stats', endpoint: '/programs/stats', auth: false },
    { name: 'Volunteer Opportunities', endpoint: '/volunteer-opportunities', auth: false },
    { name: 'NGOs', endpoint: '/ngos', auth: false },
    { name: 'Dashboard NGO Stats', endpoint: '/dashboard/ngo-stats', auth: true },
  ];

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setResults([]);
    
    for (const test of testEndpoints) {
      setResults(prev => [...prev, { endpoint: test.endpoint, status: 'loading' }]);
      
      try {
        const response = await api.get(test.endpoint);
        setResults(prev => prev.map(r => 
          r.endpoint === test.endpoint 
            ? { endpoint: test.endpoint, status: 'success', data: response.data }
            : r
        ));
      } catch (error: any) {
        setResults(prev => prev.map(r => 
          r.endpoint === test.endpoint 
            ? { 
                endpoint: test.endpoint, 
                status: 'error', 
                error: error.response?.data?.message || error.message 
              }
            : r
        ));
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tests</h1>
      
      <button 
        onClick={runTests}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Tests Again
      </button>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${
              result.status === 'loading' ? 'bg-yellow-50 border-yellow-200' :
              result.status === 'success' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{result.endpoint}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                result.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                result.status === 'success' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {result.status}
              </span>
            </div>
            
            {result.status === 'error' && (
              <p className="text-red-600 mt-2 text-sm">{result.error}</p>
            )}
            
            {result.status === 'success' && result.data && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Response: {typeof result.data === 'object' ? JSON.stringify(result.data).substring(0, 100) + '...' : result.data}
                </p>
                {result.data.data && Array.isArray(result.data.data) && (
                  <p className="text-sm text-blue-600">
                    Count: {result.data.data.length} items
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APITest;
