import React, { useState, useEffect } from 'react';
import { Award, Clock, Users, TrendingUp, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  hours: number;
  events: number;
  badges: number;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'stable';
  category?: string;
}

const LeaderboardView: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('monthly');
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockLeaderboard: LeaderboardEntry[] = [
            {
              rank: 1,
              userId: 'user-1',
              name: 'Amit Sharma',
              avatar: '/images/avatars/avatar1.jpg',
              hours: 78,
              events: 12,
              badges: 8,
              isCurrentUser: false,
              trend: 'stable',
              category: 'Environment'
            },
            {
              rank: 2,
              userId: 'user-2',
              name: 'Priya Patel',
              avatar: '/images/avatars/avatar2.jpg',
              hours: 65,
              events: 10,
              badges: 6,
              isCurrentUser: false,
              trend: 'up',
              category: 'Healthcare'
            },
            {
              rank: 3,
              userId: 'user-3',
              name: 'Rahul Verma',
              avatar: '/images/avatars/avatar3.jpg',
              hours: 62,
              events: 9,
              badges: 6,
              isCurrentUser: false,
              trend: 'down',
              category: 'Education'
            },
            {
              rank: 4,
              userId: 'current-user',
              name: 'You',
              avatar: '/images/avatars/avatar-current.jpg',
              hours: 48,
              events: 5,
              badges: 3,
              isCurrentUser: true,
              trend: 'up',
              category: 'Environment'
            },
            {
              rank: 5,
              userId: 'user-4',
              name: 'Deepika Singh',
              avatar: '/images/avatars/avatar4.jpg',
              hours: 45,
              events: 7,
              badges: 4,
              isCurrentUser: false,
              trend: 'stable',
              category: 'Hunger Relief'
            },
            {
              rank: 6,
              userId: 'user-5',
              name: 'Rajesh Kumar',
              avatar: '/images/avatars/avatar5.jpg',
              hours: 42,
              events: 6,
              badges: 3,
              isCurrentUser: false,
              trend: 'up',
              category: 'Healthcare'
            },
            {
              rank: 7,
              userId: 'user-6',
              name: 'Anjali Das',
              avatar: '/images/avatars/avatar6.jpg',
              hours: 38,
              events: 6,
              badges: 3,
              isCurrentUser: false,
              trend: 'down',
              category: 'Education'
            },
            {
              rank: 8,
              userId: 'user-7',
              name: 'Vijay Reddy',
              avatar: '/images/avatars/avatar7.jpg',
              hours: 35,
              events: 5,
              badges: 2,
              isCurrentUser: false,
              trend: 'stable',
              category: 'Environment'
            },
            {
              rank: 9,
              userId: 'user-8',
              name: 'Neha Gupta',
              avatar: '/images/avatars/avatar8.jpg',
              hours: 32,
              events: 5,
              badges: 2,
              isCurrentUser: false,
              trend: 'down',
              category: 'Community Development'
            },
            {
              rank: 10,
              userId: 'user-9',
              name: 'Suresh Menon',
              avatar: '/images/avatars/avatar9.jpg',
              hours: 30,
              events: 4,
              badges: 2,
              isCurrentUser: false,
              trend: 'stable',
              category: 'Hunger Relief'
            }
          ];

          setLeaderboard(mockLeaderboard);
          setFilteredLeaderboard(mockLeaderboard);
          
          // Find current user's rank
          const userEntry = mockLeaderboard.find(entry => entry.isCurrentUser);
          if (userEntry) {
            setCurrentUserRank(userEntry.rank);
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching leaderboard data', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter leaderboard based on search query and filters
  useEffect(() => {
    let result = [...leaderboard];
    
    // Apply category filter if not 'all'
    if (filterCategory !== 'all') {
      result = result.filter(entry => entry.category === filterCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredLeaderboard(result);
  }, [searchQuery, filterCategory, leaderboard]);

  // Get unique categories
  const categories = ['all', ...new Set(leaderboard.map(entry => entry.category).filter(Boolean))];
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {currentUserRank !== null && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">
                Your current ranking: <span className="text-primary-600 font-bold">#{currentUserRank}</span>
              </h3>
              <p className="text-sm text-gray-600">
                {currentUserRank <= 3 
                  ? 'Congratulations! You\'re in the top 3 volunteers!'
                  : currentUserRank <= 10
                    ? 'You\'re in the top 10! Keep it up!'
                    : 'Volunteer more to climb the leaderboard!'}
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm">
            See How to Improve
          </Button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search volunteers..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <label htmlFor="timeRangeSelect" className="sr-only">
            Select time range
          </label>
          <select
            id="timeRangeSelect"
            className="rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filterTimeRange}
            onChange={(e) => setFilterTimeRange(e.target.value)}
            aria-label="Select time range"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
            <option value="alltime">All Time</option>
          </select>
        </div>
      </div>
      
      {/* Extended Filters */}
      {isFilterOpen && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <label htmlFor="categorySelect" className="sr-only">
                Select category
              </label>
              <select
                id="categorySelect"
                className="w-full rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Select category"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center">
                <Award className="h-7 w-7 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-900">Gold Medalist</p>
                <h3 className="font-bold text-amber-900">{loading ? '...' : filteredLeaderboard[0]?.name}</h3>
                <p className="text-xs text-amber-800">{loading ? '' : `${filteredLeaderboard[0]?.hours} hours`}</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-amber-500">#1</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Award className="h-7 w-7 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Silver Medalist</p>
                <h3 className="font-bold text-gray-900">{loading ? '...' : filteredLeaderboard[1]?.name}</h3>
                <p className="text-xs text-gray-800">{loading ? '' : `${filteredLeaderboard[1]?.hours} hours`}</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-500">#2</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50/50 to-amber-100/50 border-amber-200/50">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-7 w-7 text-amber-700/70" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-amber-900/80">Bronze Medalist</p>
                <h3 className="font-bold text-amber-900/80">{loading ? '...' : filteredLeaderboard[2]?.name}</h3>
                <p className="text-xs text-amber-800/80">{loading ? '' : `${filteredLeaderboard[2]?.hours} hours`}</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-amber-500/70">#3</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              {filteredLeaderboard.length === 0 ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers found</h3>
                  <p className="text-gray-500">
                    Try changing your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Rank</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Volunteer</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Category</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> Hours
                          </div>
                        </th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" /> Events
                          </div>
                        </th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" /> Badges
                          </div>
                        </th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLeaderboard.map(entry => (
                        <tr 
                          key={entry.userId} 
                          className={`hover:bg-gray-50 ${entry.isCurrentUser ? 'bg-primary-50' : ''}`}
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            <div className="flex items-center">
                              {entry.rank <= 3 ? (
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-2 
                                  ${entry.rank === 1 ? 'bg-amber-100 text-amber-600' : 
                                    entry.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                                    'bg-amber-50 text-amber-700/70'}`}
                                >
                                  <Award className="h-3.5 w-3.5" />
                                </div>
                              ) : null}
                              <span className={entry.rank <= 3 ? 'font-bold' : ''}>
                                #{entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {entry.avatar ? (
                                  <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xs font-medium text-gray-600">
                                    {entry.name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span className={`ml-2 ${entry.isCurrentUser ? 'font-bold text-primary-700' : ''}`}>
                                {entry.name} {entry.isCurrentUser && '(You)'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.category || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {entry.hours}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.events}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.badges}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {getTrendIcon(entry.trend)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardView;
