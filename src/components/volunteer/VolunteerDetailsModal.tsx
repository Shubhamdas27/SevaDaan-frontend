import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { VolunteerOpportunity } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

interface VolunteerDetailsModalProps {
  opportunity: VolunteerOpportunity;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (applicationData: any) => void;
}

export const VolunteerDetailsModal: React.FC<VolunteerDetailsModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onApply
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    motivation: '',
    experience: '',
    availability: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your volunteer application has been submitted successfully!', 'Application Sent');
      
      if (onApply) {
        onApply(applicationData);
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to submit application. Please try again.', 'Error');
    } finally {
      setIsApplying(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="pr-12">
            <h2 className="text-2xl font-bold mb-2">{opportunity.title}</h2>
            <div className="flex items-center text-blue-100">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{opportunity.location}</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Opportunity Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">About This Opportunity</h3>
                  <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">Duration</span>
                    </div>
                    <p className="text-gray-700">
                      {formatDate(opportunity.startDate)}
                      {opportunity.endDate && ` - ${formatDate(opportunity.endDate)}`}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">Time Commitment</span>
                    </div>
                    <p className="text-gray-700">{opportunity.requiredHours} hours required</p>
                  </div>
                </div>

                {opportunity.skills && opportunity.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Important Information</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        This is a volunteer position. No monetary compensation is provided, but you'll gain valuable experience and contribute to a meaningful cause.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Application Form */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Apply to Volunteer</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      value={applicationData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you want to volunteer? *
                    </label>
                    <textarea
                      value={applicationData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us about your motivation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relevant Experience
                    </label>
                    <textarea
                      value={applicationData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any relevant experience or skills..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability *
                    </label>
                    <textarea
                      value={applicationData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="When are you available? (days, hours, etc.)"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isApplying || !applicationData.name || !applicationData.email || !applicationData.motivation || !applicationData.availability}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg transition-all duration-200"
                    >
                      {isApplying ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Application...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Submit Application
                        </div>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 text-center">
                    By submitting, you agree to share your information with the NGO organizing this opportunity.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
