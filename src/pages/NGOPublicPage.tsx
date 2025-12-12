import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Icons } from '../components/icons';
import api from '../lib/api';

interface NGOPageData {
  ngo: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    mission: string;
    vision: string;
    logo: string;
    images: string[];
    address: {
      city: string;
      state: string;
      street: string;
    };
    website: string;
    email: string;
    phone: string;
    status: string;
    verificationDate: string;
    categories: string[];
    achievements: string[];
    socialMedia: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    stats: {
      totalDonations: number;
      totalVolunteers: number;
      totalBeneficiaries: number;
      activePrograms: number;
    };
  };
  activePrograms: Array<{
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    targetAmount: number;
    raisedAmount: number;
    volunteersNeeded: number;
    volunteersRegistered: number;
    startDate: string;
    endDate: string;
    category: string;
    status: string;
    featured: boolean;
    images: string[];
  }>;
}

const NGOPublicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<NGOPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNGOData();
  }, [slug]);

  const fetchNGOData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/ngos/public/${slug}`);
      setData(response.data.data);
    } catch (error: any) {
      console.error('Error fetching NGO data:', error);
      setError(error.response?.data?.message || 'Failed to load NGO information');
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (programId: string) => {
    navigate(`/donate/${programId}`);
  };

  const handleVolunteer = (programId: string) => {
    navigate(`/volunteer/apply/${programId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.error className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">NGO Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The NGO you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/ngos')}>Browse All NGOs</Button>
        </div>
      </div>
    );
  }

  const { ngo, activePrograms } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:40px_40px]" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {ngo.logo && (
                    <div className="w-20 h-20 bg-white rounded-xl p-3 shadow-2xl">
                      <img 
                        src={ngo.logo} 
                        alt={`${ngo.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {ngo.status === 'verified' && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm px-4 py-1.5">
                      <Icons.success className="w-4 h-4 mr-1.5" />
                      Verified Organization
                    </Badge>
                  )}
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  {ngo.name}
                </h1>
                
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {ngo.description}
                </p>

                <div className="flex items-center gap-3 text-blue-200 mb-8">
                  <Icons.location className="w-5 h-5" />
                  <span className="text-lg">{ngo.address.city}, {ngo.address.state}</span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl transition-all px-8 py-6 text-lg font-semibold"
                    onClick={() => activePrograms.length > 0 && handleDonate(activePrograms[0]._id)}
                  >
                    <Icons.favorite className="w-5 h-5 mr-2" />
                    Make a Donation
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all px-8 py-6 text-lg font-semibold"
                    onClick={() => activePrograms.length > 0 && handleVolunteer(activePrograms[0]._id)}
                  >
                    <Icons.users className="w-5 h-5 mr-2" />
                    Join as Volunteer
                  </Button>
                </div>
              </div>

              {/* Right - Featured Image/Stats */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-center">Our Impact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-400 mb-2">
                        {formatCurrency(ngo.stats.totalDonations)}
                      </div>
                      <div className="text-sm text-blue-200">Total Raised</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-2">
                        {ngo.stats.totalVolunteers}+
                      </div>
                      <div className="text-sm text-blue-200">Volunteers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400 mb-2">
                        {ngo.stats.totalBeneficiaries.toLocaleString()}+
                      </div>
                      <div className="text-sm text-blue-200">Lives Impacted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">
                        {ngo.stats.activePrograms}
                      </div>
                      <div className="text-sm text-blue-200">Active Programs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Icons.target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{ngo.mission}</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Icons.eye className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{ngo.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join us in making a difference through our active initiatives
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePrograms.map((program) => (
                <Card key={program._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl">
                  {program.images.length > 0 && (
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={program.images[0]} 
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-program.jpg';
                        }}
                      />
                      {program.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-orange-500 text-white border-0 px-3 py-1">
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-0 px-3 py-1">
                          {program.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{program.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{program.shortDescription}</p>

                    {/* Funding Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Funding Progress</span>
                        <span className="text-sm font-bold text-emerald-600">
                          {getProgressPercentage(program.raisedAmount, program.targetAmount).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={program.raisedAmount} 
                        max={program.targetAmount} 
                        className="mb-2 h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatCurrency(program.raisedAmount)} raised</span>
                        <span>{formatCurrency(program.targetAmount)} goal</span>
                      </div>
                    </div>

                    {/* Volunteer Progress */}
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Volunteers</span>
                        <span className="text-sm font-bold text-blue-600">
                          {program.volunteersRegistered}/{program.volunteersNeeded}
                        </span>
                      </div>
                      <Progress 
                        value={program.volunteersRegistered} 
                        max={program.volunteersNeeded} 
                        className="h-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold"
                        onClick={() => handleDonate(program._id)}
                      >
                        <Icons.favorite className="w-4 h-4 mr-1.5" />
                        Donate
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold transition-all"
                        onClick={() => handleVolunteer(program._id)}
                        disabled={program.volunteersRegistered >= program.volunteersNeeded}
                      >
                        <Icons.users className="w-4 h-4 mr-1.5" />
                        {program.volunteersRegistered >= program.volunteersNeeded ? 'Full' : 'Join'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {ngo.achievements.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Recognition & Achievements</h2>
                <p className="text-xl text-gray-600">Celebrating our milestones and impact</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {ngo.achievements.map((achievement, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-orange-100 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icons.award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-snug">{achievement}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-xl text-blue-200">We'd love to hear from you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.location className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="font-bold text-lg mb-3">Our Location</h3>
                <p className="text-blue-100 leading-relaxed">
                  {ngo.address.street}<br />
                  {ngo.address.city}, {ngo.address.state}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.phone className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="font-bold text-lg mb-3">Call Us</h3>
                <a href={`tel:${ngo.phone}`} className="text-blue-100 hover:text-white transition-colors">
                  {ngo.phone}
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center hover:bg-white/15 transition-all">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.email className="w-8 h-8 text-purple-300" />
                </div>
                <h3 className="font-bold text-lg mb-3">Email Us</h3>
                <a href={`mailto:${ngo.email}`} className="text-blue-100 hover:text-white transition-colors break-all">
                  {ngo.email}
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
              <div className="flex justify-center gap-4">
                {ngo.socialMedia.facebook && (
                  <a href={ngo.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                     aria-label="Follow us on Facebook"
                     className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 hover:scale-110 transition-all shadow-lg">
                    <Icons.facebook className="w-6 h-6" />
                  </a>
                )}
                {ngo.socialMedia.twitter && (
                  <a href={ngo.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                     aria-label="Follow us on Twitter"
                     className="w-14 h-14 bg-sky-500 rounded-xl flex items-center justify-center text-white hover:bg-sky-600 hover:scale-110 transition-all shadow-lg">
                    <Icons.twitter className="w-6 h-6" />
                  </a>
                )}
                {ngo.socialMedia.instagram && (
                  <a href={ngo.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                     aria-label="Follow us on Instagram"
                     className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg">
                    <Icons.instagram className="w-6 h-6" />
                  </a>
                )}
                {ngo.socialMedia.linkedin && (
                  <a href={ngo.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                     aria-label="Follow us on LinkedIn"
                     className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center text-white hover:bg-blue-800 hover:scale-110 transition-all shadow-lg">
                    <Icons.linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>

              {ngo.website && (
                <div className="mt-8">
                  <a 
                    href={ngo.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-xl font-semibold transition-all"
                  >
                    <Icons.externalLink className="w-5 h-5" />
                    Visit Our Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join us in creating lasting impact in our communities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl"
              onClick={() => activePrograms.length > 0 && handleDonate(activePrograms[0]._id)}
            >
              <Icons.favorite className="w-5 h-5 mr-2" />
              Donate Today
            </Button>
            <Button 
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg font-bold"
              onClick={() => activePrograms.length > 0 && handleVolunteer(activePrograms[0]._id)}
            >
              <Icons.users className="w-5 h-5 mr-2" />
              Become a Volunteer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOPublicPage;
