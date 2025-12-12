import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Icons } from '../components/icons';
import { usePrograms } from '../hooks/useApiHooks';
import { Program } from '../types';

const ProgramDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { programs, loading, error, fetchPrograms } = usePrograms();
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (programs && id) {
      const foundProgram = programs.find((p: Program) => p.id === id);
      setProgram(foundProgram || null);
    }
  }, [programs, id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-red-600 mb-4">Error loading program: {error}</p>
          <Button onClick={() => navigate('/programs')}>
            Back to Programs
          </Button>
        </div>
      </Layout>
    );
  }

  if (!program) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Program not found</h2>
          <Button onClick={() => navigate('/programs')}>
            Back to Programs
          </Button>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const participationPercentage = program.capacity && program.currentParticipants !== undefined
    ? Math.round((program.currentParticipants / program.capacity) * 100)
    : 0;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-12 text-white">
        <div className="container">
          <Button
            variant="ghost"
            onClick={() => navigate('/programs')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <Icons.arrowLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold">{program.title}</h1>
            <StatusBadge status={program.status} variant="solid" size="lg" />
          </div>
          
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Icons.calendar className="w-5 h-5" />
              <span>
                {formatDate(program.startDate)}
                {program.endDate && ` - ${formatDate(program.endDate)}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.location className="w-5 h-5" />
              <span>{program.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Beautiful Program Image */}
            {program.imageUrl && (
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0 relative group">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            )}

            {/* Beautiful Description */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                    <Icons.info className="w-6 h-6 text-white" />
                  </div>
                  About This Program
                </h2>
              </div>
              <CardContent className="p-6">
                <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                  {program.description}
                </p>
              </CardContent>
            </Card>

            {/* Beautiful What You'll Do */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                    <Icons.document className="w-6 h-6 text-white" />
                  </div>
                  What You'll Do
                </h2>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <p className="text-slate-700 text-lg">Participate in program activities and community engagement</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <p className="text-slate-700 text-lg">Support the program objectives and help beneficiaries</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <p className="text-slate-700 text-lg">Collaborate with team members and NGO staff</p>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <p className="text-slate-700 text-lg">Contribute to program success and community development</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beautiful Eligibility Criteria */}
            {program.eligibilityCriteria && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Icons.users className="w-6 h-6 text-white" />
                    </div>
                    Eligibility Criteria
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg">
                    <p className="text-slate-700 text-lg leading-relaxed">{program.eligibilityCriteria}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Beautiful Participation Stats */}
            {program.capacity && program.currentParticipants !== undefined && (
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">Participation</h3>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/90 font-medium">Participants</span>
                      <span className="font-bold text-white">
                        {program.currentParticipants} / {program.capacity}
                      </span>
                    </div>
                    <ProgressBar 
                      value={program.currentParticipants} 
                      max={program.capacity}
                      variant={program.status === 'completed' ? 'success' : 'primary'}
                    />
                    <p className="text-xs text-white/80 mt-2 text-center font-medium">
                      {participationPercentage}% capacity filled
                    </p>
                  </div>
                  
                  <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <p className="text-white/90 text-sm font-medium mb-1">Available Spots</p>
                    <p className="text-3xl font-bold text-white">
                      {program.capacity - program.currentParticipants}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Beautiful Quick Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-5 text-center text-gray-800 border-b-2 border-gray-100 pb-3">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                      <Icons.calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Start Date</p>
                      <p className="font-bold text-gray-800">{formatDate(program.startDate)}</p>
                    </div>
                  </div>
                  
                  {program.endDate && (
                    <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                        <Icons.calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">End Date</p>
                        <p className="font-bold text-gray-800">{formatDate(program.endDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
                      <Icons.location className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Location</p>
                      <p className="font-bold text-gray-800">{program.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg">
                      <Icons.activity className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 font-medium mb-1">Status</p>
                      <StatusBadge status={program.status} variant="solid" size="sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beautiful CTA Buttons */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-6">
                <h3 className="text-white font-bold text-lg mb-4 text-center">Take Action</h3>
                <div className="space-y-3">
                  <Link to="/volunteer">
                    <Button 
                      size="lg" 
                      className="w-full bg-white text-purple-600 hover:bg-purple-50 font-bold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl group"
                    >
                      <Icons.heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      Volunteer for This Program
                    </Button>
                  </Link>
                  
                  <Link to="/grants">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl group"
                    >
                      <Icons.donation className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Support with Donation
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Beautiful Share Section */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-center text-gray-800">Share This Program</h3>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Icons.share className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1 border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <Icons.email className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProgramDetails;
