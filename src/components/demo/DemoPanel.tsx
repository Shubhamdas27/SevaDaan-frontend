import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface DemoCredential {
  role: string;
  email: string;
  password: string;
  color: string;
  features: string[];
}

const DemoPanel: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const demoCredentials: DemoCredential[] = [
    {
      role: 'Admin',
      email: 'admin@sevadaan.com',
      password: 'password123',
      color: 'bg-purple-500',
      features: ['User Management', 'NGO Approval', 'System Analytics', 'Platform Configuration']
    },
    {
      role: 'NGO',
      email: 'ngo@helpindia.org',
      password: 'password123',
      color: 'bg-blue-500',
      features: ['Create Programs', 'Manage Volunteers', 'View Donations', 'Generate Reports']
    },
    {
      role: 'NGO Admin',
      email: 'ngoadmin@helpindia.org',
      password: 'password123',
      color: 'bg-indigo-500',
      features: ['Full NGO Management', 'Staff Management', 'Advanced Analytics', 'System Settings']
    },
    {
      role: 'NGO Manager',
      email: 'ngomanager@helpindia.org',
      password: 'password123',
      color: 'bg-green-500',
      features: ['Program Oversight', 'Volunteer Coordination', 'Task Management', 'Progress Tracking']
    },
    {
      role: 'Volunteer',
      email: 'volunteer@helpindia.org',
      password: 'password123',
      color: 'bg-orange-500',
      features: ['Browse Opportunities', 'Log Hours', 'Get Certificates', 'Track Impact']
    },
    {
      role: 'Donor',
      email: 'donor@example.com',
      password: 'password123',
      color: 'bg-red-500',
      features: ['Make Donations', 'View Impact', 'Download Receipts', 'Track Contributions']
    },
    {
      role: 'Citizen',
      email: 'citizen@example.com',
      password: 'password123',
      color: 'bg-teal-500',
      features: ['Apply for Services', 'Track Applications', 'Get Support', 'Access Resources']
    }
  ];

  const handleQuickLogin = async (cred: DemoCredential) => {
    setLoading(cred.email);
    try {
      await login(cred.email, cred.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Login failed. Please check if the backend is running.');
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Test the Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore all features with our demo accounts. Click Quick Login to test instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoCredentials.map((cred, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`${cred.color} px-6 py-4`}>
                <h3 className="text-xl font-bold text-white flex items-center">
                  👤 {cred.role}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <button
                      onClick={() => copyToClipboard(cred.email)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      title="Click to copy"
                    >
                      {cred.email} 📋
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Password:</span>
                    <button
                      onClick={() => copyToClipboard(cred.password)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-mono"
                      title="Click to copy"
                    >
                      {cred.password} 📋
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {cred.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleQuickLogin(cred)}
                  disabled={loading === cred.email}
                  className={`w-full ${cred.color} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center disabled:opacity-50`}
                >
                  {loading === cred.email ? (
                    <>⏳ Logging in...</>
                  ) : (
                    <>🚀 Quick Login</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              🎯 Testing Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  ⚙️ Backend Status:
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✅ Server running on port 3000</li>
                  <li>✅ MongoDB connected</li>
                  <li>✅ Socket.IO enabled</li>
                  <li>✅ Sample data seeded</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  📊 Sample Data:
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 217 Users across all roles</li>
                  <li>• 3 Active NGOs</li>
                  <li>• 8 Programs</li>
                  <li>• Donations, Volunteers, Grants</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPanel;
