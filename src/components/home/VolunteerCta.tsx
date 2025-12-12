import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { VolunteerOpportunity } from '../../types';
import { formatDate } from '../../lib/utils';

interface VolunteerCtaProps {
  opportunities: VolunteerOpportunity[];
  loading?: boolean;
  error?: string | null;
}

const VolunteerCta: React.FC<VolunteerCtaProps> = ({ opportunities, loading, error }) => {
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Make a Difference by Volunteering</h2>
            <Spinner size="lg" variant="white" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Make a Difference by Volunteering</h2>
            <p className="text-coral-200">Error loading volunteer opportunities: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-700 to-primary-800 text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Make a Difference by Volunteering</h2>
            <p className="text-white/90 mb-8 text-lg">
              Your time and skills can create meaningful impact in communities across India. Join our volunteer network and be part of the change.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Flexible Time Commitment</h3>
                  <p className="text-white/80">
                    Volunteer for a few hours or commit to regular engagement based on your availability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Local Opportunities</h3>
                  <p className="text-white/80">
                    Find volunteer opportunities in your area or join virtual initiatives from anywhere.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Community Connection</h3>
                  <p className="text-white/80">
                    Connect with like-minded individuals and build relationships while serving communities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Skill Development</h3>
                  <p className="text-white/80">
                    Gain valuable experience and develop new skills while making a positive impact.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link to="/volunteer">
                <Button variant="primary" size="lg" className="btn-coral text-white">
                  Explore Volunteer Opportunities
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-6">Featured Opportunities</h3>
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <Link 
                  key={opportunity.id} 
                  to="/programs"
                  className="block bg-white/10 rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer hover:scale-[1.02] transform"
                >
                  <h4 className="font-semibold mb-2">{opportunity.title}</h4>
                  <div className="flex items-center text-sm text-white/80 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/80 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDate(opportunity.startDate)}{opportunity.endDate ? ` - ${formatDate(opportunity.endDate)}` : ''}</span>
                  </div>
                  <p className="text-sm text-white/80 mb-3">
                    {opportunity.description.length > 100
                      ? `${opportunity.description.substring(0, 100)}...`
                      : opportunity.description
                    }
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs bg-white/20 px-2 py-1 rounded">
                      {opportunity.requiredHours} hours needed
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerCta;