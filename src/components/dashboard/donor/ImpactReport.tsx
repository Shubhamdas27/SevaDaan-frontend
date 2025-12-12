import React, { useState, useEffect } from 'react';
import { Share2, Download, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  PieChart as RechartsPieChart,
  Pie, 
  LineChart as RechartsLineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface ImpactMetric {
  category: string;
  value: number;
  description: string;
}

interface DonationByCategory {
  name: string;
  value: number;
  color: string;
}

interface MonthlyDonation {
  month: string;
  amount: number;
}

interface ProgramImpact {
  programName: string;
  ngoName: string;
  peopleHelped: number;
  description: string;
}

const ImpactReport: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [donationsByCategory, setDonationsByCategory] = useState<DonationByCategory[]>([]);
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([]);
  const [programImpacts, setProgramImpacts] = useState<ProgramImpact[]>([]);
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | 'all'>('1y');

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          // Impact metrics
          setImpactMetrics([
            {
              category: 'Children Educated',
              value: 120,
              description: 'Number of children who received education support through your donations'
            },
            {
              category: 'Trees Planted',
              value: 75,
              description: 'Number of trees planted through environmental programs you supported'
            },
            {
              category: 'Meals Provided',
              value: 450,
              description: 'Number of meals provided to people in need through your contributions'
            },
            {
              category: 'Healthcare Services',
              value: 35,
              description: 'Number of people who received medical services through programs you supported'
            }
          ]);
          
          // Donation by category
          setDonationsByCategory([
            { name: 'Education', value: 5000, color: '#4f46e5' },
            { name: 'Healthcare', value: 3000, color: '#06b6d4' },
            { name: 'Environment', value: 2000, color: '#10b981' },
            { name: 'Food Security', value: 1500, color: '#f59e0b' },
            { name: 'Community Development', value: 1000, color: '#8b5cf6' }
          ]);
          
          // Monthly donations
          setMonthlyDonations([
            { month: 'Jan', amount: 1200 },
            { month: 'Feb', amount: 900 },
            { month: 'Mar', amount: 1500 },
            { month: 'Apr', amount: 1000 },
            { month: 'May', amount: 800 },
            { month: 'Jun', amount: 1700 },
            { month: 'Jul', amount: 1300 },
            { month: 'Aug', amount: 1100 },
            { month: 'Sep', amount: 1400 },
            { month: 'Oct', amount: 2000 },
            { month: 'Nov', amount: 1800 },
            { month: 'Dec', amount: 2500 }
          ]);
          
          // Program impacts
          setProgramImpacts([
            {
              programName: 'Education for All',
              ngoName: 'Care Foundation',
              peopleHelped: 80,
              description: 'Provided educational support including books, uniforms, and tuition assistance to underprivileged children'
            },
            {
              programName: 'Rural Healthcare',
              ngoName: 'Hope Initiative',
              peopleHelped: 120,
              description: 'Supported mobile medical units providing free healthcare services to remote villages'
            },
            {
              programName: 'Tree Plantation Drive',
              ngoName: 'Green Earth',
              peopleHelped: 0,
              description: '75 trees planted across urban areas to increase green cover and reduce pollution'
            },
            {
              programName: 'Food Distribution',
              ngoName: 'Helping Hands',
              peopleHelped: 250,
              description: 'Provided food packages to families affected by economic hardship'
            }
          ]);
          
          setLoading(false);
        }, 1200);
      } catch (error) {
        console.error('Error fetching impact data', error);
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total donations
  const totalDonations = donationsByCategory.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate total people helped
  const totalPeopleHelped = programImpacts.reduce((sum, program) => sum + program.peopleHelped, 0);

  const handlePrintReport = () => {
    // In a real app, this would trigger printing functionality
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('Downloading PDF impact report...');
  };

  const handleShareReport = () => {
    // In a real app, this would open a sharing dialog
    alert('Sharing impact report...');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Your Donation Impact</h2>
          <p className="text-sm text-gray-500">
            See the real-world impact of your generosity
          </p>
        </div>
        
        <div className="mt-3 md:mt-0 flex space-x-3">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${timeRange === '6m' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('6m')}
            >
              6 Months
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${timeRange === '1y' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('1y')}
            >
              1 Year
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${timeRange === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handlePrintReport}
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={handleShareReport}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 uppercase">Total Donations</p>
                  <h3 className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(totalDonations)}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 uppercase">Programs Supported</p>
                  <h3 className="mt-2 text-3xl font-bold text-gray-900">{programImpacts.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500 uppercase">People Helped</p>
                  <h3 className="mt-2 text-3xl font-bold text-gray-900">{totalPeopleHelped}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation by Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Donations by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={donationsByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {donationsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Donation Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={monthlyDonations}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        tickFormatter={(value) => 
                          new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            notation: 'compact',
                            maximumFractionDigits: 0
                          }).format(value)
                        }
                      />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        name="Donation Amount" 
                        stroke="#4f46e5" 
                        activeDot={{ r: 8 }} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {impactMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                    <p className="text-sm font-medium text-primary-600 mb-2">{metric.category}</p>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Program Impact Details */}
          <Card>
            <CardHeader>
              <CardTitle>Programs You've Supported</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {programImpacts.map((program, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{program.programName}</h3>
                        <p className="text-sm text-gray-500">{program.ngoName}</p>
                      </div>
                      {program.peopleHelped > 0 ? (
                        <div className="mt-2 md:mt-0 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          {program.peopleHelped} people helped
                        </div>
                      ) : (
                        <div className="mt-2 md:mt-0 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          Environmental Impact
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{program.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ImpactReport;
