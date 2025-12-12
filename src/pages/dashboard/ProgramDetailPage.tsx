import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../components/icons';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

interface ProgramStats {
  totalBeneficiaries: number;
  activeBeneficiaries: number;
  completedBeneficiaries: number;
  totalVolunteers: number;
  activeVolunteers: number;
  totalBudget: number;
  usedBudget: number;
  progressPercentage: number;
  upcomingEvents: number;
  completedEvents: number;
}

interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  location: string;
  budget: number;
  ngoWebsite: string;
  stats: ProgramStats;
  recentActivities: Array<{
    id: string;
    type: 'volunteer_joined' | 'beneficiary_added' | 'event_completed' | 'donation_received';
    description: string;
    timestamp: string;
    user: string;
  }>;
}

const ProgramDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch program details
    setTimeout(() => {
      const mockProgram: ProgramDetail = {
        id: id || '1',
        title: 'Education for Rural Children',
        description: 'Providing quality education and learning materials to children in rural areas. This comprehensive program focuses on improving literacy rates and educational outcomes in underserved communities.',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        location: 'Rural Maharashtra',
        budget: 500000,
        ngoWebsite: 'https://helpindia.org',
        stats: {
          totalBeneficiaries: 150,
          activeBeneficiaries: 142,
          completedBeneficiaries: 8,
          totalVolunteers: 25,
          activeVolunteers: 22,
          totalBudget: 500000,
          usedBudget: 320000,
          progressPercentage: 64,
          upcomingEvents: 5,
          completedEvents: 12
        },
        recentActivities: [
          {
            id: '1',
            type: 'volunteer_joined',
            description: 'Priya Sharma joined as a volunteer teacher',
            timestamp: '2 hours ago',
            user: 'Priya Sharma'
          },
          {
            id: '2',
            type: 'beneficiary_added',
            description: '5 new children enrolled in the program',
            timestamp: '1 day ago',
            user: 'Field Coordinator'
          },
          {
            id: '3',
            type: 'event_completed',
            description: 'Monthly assessment completed for Grade 5',
            timestamp: '3 days ago',
            user: 'Teaching Team'
          },
          {
            id: '4',
            type: 'donation_received',
            description: 'Received ₹25,000 donation for learning materials',
            timestamp: '5 days ago',
            user: 'Anonymous Donor'
          }
        ]
      };
      setProgram(mockProgram);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleVisitWebsite = () => {
    if (program?.ngoWebsite) {
      window.open(program.ngoWebsite, '_blank');
    }
  };  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'volunteer_joined': return <Icons.users className="w-4 h-4 text-blue-600" />;
      case 'beneficiary_added': return <Icons.user className="w-4 h-4 text-green-600" />;
      case 'event_completed': return <Icons.success className="w-4 h-4 text-purple-600" />;
      case 'donation_received': return <Icons.favorite className="w-4 h-4 text-red-600" />;
      default: return <Icons.info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!program) {
    return (      <div className="text-center py-12">
        <Icons.error className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Program Not Found</h2>
        <p className="text-gray-600 mb-4">The program you're looking for doesn't exist.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <Icons.arrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
            <p className="text-gray-600">Program Details & Statistics</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(program.status)}>
            {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
          </Badge>
          <Button onClick={handleVisitWebsite} className="flex items-center">
            <Icons.externalLink className="w-4 h-4 mr-2" />
            Visit NGO Website
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                <p className="text-2xl font-bold text-gray-900">{program.stats.totalBeneficiaries}</p>
              </div>
              <Icons.users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-green-600">
                {program.stats.activeBeneficiaries} active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{program.stats.activeVolunteers}</p>
              </div>
              <Icons.favorite className="w-8 h-8 text-red-600" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                of {program.stats.totalVolunteers} total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(program.stats.usedBudget / 100000).toFixed(1)}L
                </p>
              </div>
              <Icons.dollarSign className="w-8 h-8 text-green-600" />
            </div>              <div className="mt-2">
                <ProgressBar 
                  value={(program.stats.usedBudget / program.stats.totalBudget) * 100}
                  variant="success"
                  size="md"
                />
              <span className="text-sm text-gray-600">
                {((program.stats.usedBudget / program.stats.totalBudget) * 100).toFixed(1)}% used
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{program.stats.progressPercentage}%</p>
              </div>
              <Icons.trendUp className="w-8 h-8 text-purple-600" />            </div>              <div className="mt-2">
                <ProgressBar 
                  value={program.stats.progressPercentage}
                  variant="primary"
                  size="md"
                />
              <span className="text-sm text-green-600">On track</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Program Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{program.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Start Date</h4>
                  <p className="text-gray-600">{new Date(program.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">End Date</h4>
                  <p className="text-gray-600">
                    {program.endDate ? new Date(program.endDate).toLocaleDateString() : 'Ongoing'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600">{program.location}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Total Budget</h4>
                  <p className="text-gray-600">₹{(program.budget / 100000).toFixed(1)}L</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Upcoming Events</h4>
                  <p className="text-gray-600">{program.stats.upcomingEvents}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Completed Events</h4>
                  <p className="text-gray-600">{program.stats.completedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {program.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <Button variant="outline">
          <Icons.edit className="w-4 h-4 mr-2" />
          Edit Program
        </Button>
        <Button variant="outline">
          <Icons.download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline">
          <Icons.users className="w-4 h-4 mr-2" />
          Manage Volunteers
        </Button>
        <Button>
          <Icons.add className="w-4 h-4 mr-2" />
          Add Beneficiary
        </Button>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
