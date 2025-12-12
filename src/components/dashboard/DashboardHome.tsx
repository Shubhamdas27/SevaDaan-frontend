import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icons } from '../icons';
import { Spinner } from '../ui/Spinner';

// Dashboard Stats Interface
interface DashboardStats {
  totalPrograms?: number;
  totalVolunteers?: number;
  totalDonations?: number;
  totalBeneficiaries?: number;
  totalApplications?: number;
  totalHoursVolunteered?: number;
  totalNGOsSupported?: number;
  totalCertificates?: number;
  donationAmount?: number;
}

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate loading and set demo data
    const timer = setTimeout(() => {
      const mockStats = getDemoStatsForRole(user?.role || 'citizen');
      setStats(mockStats);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user?.role]);

  const getDemoStatsForRole = (role: string): DashboardStats => {
    switch (role) {
      case 'ngo':
        return {
          totalPrograms: 15,
          totalVolunteers: 48,
          donationAmount: 285000,
          totalBeneficiaries: 420
        };
      case 'ngo_admin':
        return {
          totalPrograms: 25,
          totalVolunteers: 85,
          donationAmount: 580000,
          totalBeneficiaries: 750
        };
      case 'ngo_manager':
        return {
          totalPrograms: 12,
          totalVolunteers: 25,
          donationAmount: 125000,
          totalBeneficiaries: 180
        };
      case 'volunteer':
        return {
          totalHoursVolunteered: 245,
          totalPrograms: 8,
          totalCertificates: 5,
          totalBeneficiaries: 65
        };
      case 'donor':
        return {
          totalDonations: 12,
          donationAmount: 85000,
          totalNGOsSupported: 6,
          totalCertificates: 12
        };
      case 'citizen':
        return {
          totalApplications: 4,
          totalPrograms: 2,
          totalCertificates: 1,
          totalBeneficiaries: 0
        };
      default:
        return {
          totalPrograms: 10,
          totalVolunteers: 25,
          donationAmount: 50000,
          totalBeneficiaries: 100
        };
    }
  };

  const getRoleBasedCards = () => {
    if (!stats) return [];

    switch (user?.role) {
      case 'ngo':
      case 'ngo_admin':
        return [
          {
            title: 'Total Programs',
            value: stats.totalPrograms || 0,
            icon: Icons.calendar,
            color: 'bg-blue-500',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          {
            title: 'Active Volunteers',
            value: stats.totalVolunteers || 0,
            icon: Icons.users,
            color: 'bg-green-500',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          {
            title: 'Total Donations',
            value: `₹${(stats.donationAmount || 0).toLocaleString()}`,
            icon: Icons.dollarSign,
            color: 'bg-purple-500',
            bgColor: 'from-purple-50 to-purple-100',
            borderColor: 'border-purple-200'
          },
          {
            title: 'Beneficiaries',
            value: stats.totalBeneficiaries || 0,
            icon: Icons.favorite,
            color: 'bg-orange-500',
            bgColor: 'from-orange-50 to-orange-100',
            borderColor: 'border-orange-200'
          }
        ];

      case 'ngo_manager':
        return [
          {
            title: 'Managed Programs',
            value: stats.totalPrograms || 0,
            icon: Icons.calendar,
            color: 'bg-blue-500',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          {
            title: 'Team Volunteers',
            value: stats.totalVolunteers || 0,
            icon: Icons.users,
            color: 'bg-green-500',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          {
            title: 'Program Budget',
            value: `₹${(stats.donationAmount || 0).toLocaleString()}`,
            icon: Icons.dollarSign,
            color: 'bg-purple-500',
            bgColor: 'from-purple-50 to-purple-100',
            borderColor: 'border-purple-200'
          },
          {
            title: 'People Helped',
            value: stats.totalBeneficiaries || 0,
            icon: Icons.favorite,
            color: 'bg-orange-500',
            bgColor: 'from-orange-50 to-orange-100',
            borderColor: 'border-orange-200'
          }
        ];

      case 'volunteer':
        return [
          {
            title: 'Hours Volunteered',
            value: stats.totalHoursVolunteered || 0,
            icon: Icons.pending,
            color: 'bg-blue-500',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          {
            title: 'Programs Joined',
            value: stats.totalPrograms || 0,
            icon: Icons.calendar,
            color: 'bg-green-500',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          {
            title: 'Certificates Earned',
            value: stats.totalCertificates || 0,
            icon: Icons.award,
            color: 'bg-yellow-500',
            bgColor: 'from-yellow-50 to-yellow-100',
            borderColor: 'border-yellow-200'
          },
          {
            title: 'People Helped',
            value: stats.totalBeneficiaries || 0,
            icon: Icons.favorite,
            color: 'bg-red-500',
            bgColor: 'from-red-50 to-red-100',
            borderColor: 'border-red-200'
          }
        ];

      case 'donor':
        return [
          {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: Icons.dollarSign,
            color: 'bg-green-500',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          {
            title: 'Amount Donated',
            value: `₹${(stats.donationAmount || 0).toLocaleString()}`,
            icon: Icons.payment,
            color: 'bg-blue-500',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          {
            title: 'NGOs Supported',
            value: stats.totalNGOsSupported || 0,
            icon: Icons.users,
            color: 'bg-purple-500',
            bgColor: 'from-purple-50 to-purple-100',
            borderColor: 'border-purple-200'
          },
          {
            title: 'Tax Certificates',
            value: stats.totalCertificates || 0,
            icon: Icons.document,
            color: 'bg-orange-500',
            bgColor: 'from-orange-50 to-orange-100',
            borderColor: 'border-orange-200'
          }
        ];

      case 'citizen':
        return [
          {
            title: 'My Applications',
            value: stats.totalApplications || 0,
            icon: Icons.document,
            color: 'bg-blue-500',
            bgColor: 'from-blue-50 to-blue-100',
            borderColor: 'border-blue-200'
          },
          {
            title: 'Programs Enrolled',
            value: stats.totalPrograms || 0,
            icon: Icons.calendar,
            color: 'bg-green-500',
            bgColor: 'from-green-50 to-green-100',
            borderColor: 'border-green-200'
          },
          {
            title: 'Certificates',
            value: stats.totalCertificates || 0,
            icon: Icons.award,
            color: 'bg-yellow-500',
            bgColor: 'from-yellow-50 to-yellow-100',
            borderColor: 'border-yellow-200'
          },
          {
            title: 'Services Received',
            value: stats.totalBeneficiaries || 0,
            icon: Icons.favorite,
            color: 'bg-red-500',
            bgColor: 'from-red-50 to-red-100',
            borderColor: 'border-red-200'
          }
        ];

      default:
        return [];
    }
  };

  const getWelcomeMessage = () => {
    const roleNames = {
      ngo: 'NGO Administrator',
      ngo_admin: 'NGO Admin',
      ngo_manager: 'NGO Manager',
      volunteer: 'Volunteer',
      donor: 'Donor',
      citizen: 'Citizen'
    };
    
    return `Welcome back, ${user?.name}! Here's your ${roleNames[user?.role as keyof typeof roleNames] || 'dashboard'} overview.`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = getRoleBasedCards();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Hello, {user?.name}! 👋</h1>
        <p className="text-indigo-100 mt-2">{getWelcomeMessage()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Card key={index} className={`bg-gradient-to-br ${card.bgColor} ${card.borderColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.activity className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user?.role === 'ngo' || user?.role === 'ngo_admin' ? (
              <>
                <Button className="h-16 flex flex-col items-center justify-center">
                  <Icons.add className="h-5 w-5 mb-1" />
                  Create Program
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.users className="h-5 w-5 mb-1" />
                  Manage Volunteers
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.dollarSign className="h-5 w-5 mb-1" />
                  View Donations
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.document className="h-5 w-5 mb-1" />
                  Generate Report
                </Button>
              </>
            ) : user?.role === 'volunteer' ? (
              <>
                <Button className="h-16 flex flex-col items-center justify-center">
                  <Icons.search className="h-5 w-5 mb-1" />
                  Find Opportunities
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.pending className="h-5 w-5 mb-1" />
                  Log Hours
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.award className="h-5 w-5 mb-1" />
                  My Certificates
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.calendar className="h-5 w-5 mb-1" />
                  My Schedule
                </Button>
              </>
            ) : user?.role === 'donor' ? (
              <>
                <Button className="h-16 flex flex-col items-center justify-center">
                  <Icons.dollarSign className="h-5 w-5 mb-1" />
                  Make Donation
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.document className="h-5 w-5 mb-1" />
                  Tax Certificates
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.barChart className="h-5 w-5 mb-1" />
                  Donation History
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.search className="h-5 w-5 mb-1" />
                  Find NGOs
                </Button>
              </>
            ) : user?.role === 'citizen' ? (
              <>
                <Button className="h-16 flex flex-col items-center justify-center">
                  <Icons.search className="h-5 w-5 mb-1" />
                  Find Programs
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.document className="h-5 w-5 mb-1" />
                  Apply for Help
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.calendar className="h-5 w-5 mb-1" />
                  My Programs
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.award className="h-5 w-5 mb-1" />
                  My Certificates
                </Button>
              </>
            ) : (
              <>
                <Button className="h-16 flex flex-col items-center justify-center">
                  <Icons.search className="h-5 w-5 mb-1" />
                  Explore
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.settings className="h-5 w-5 mb-1" />
                  Settings
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.document className="h-5 w-5 mb-1" />
                  Reports
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Icons.users className="h-5 w-5 mb-1" />
                  Community
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icons.activity className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Icons.calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New program created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Icons.users className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">5 new volunteers joined</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Icons.dollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Received donation of ₹10,000</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
