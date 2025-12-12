import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons } from '../../components/icons';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  ngo: string;
  ngoId: string;
  location: string;
  timeCommitment: string;
  skills: string[];
  status: 'open' | 'closed' | 'full';
  spotsAvailable: number;
  totalSpots: number;
  startDate: string;
  endDate?: string;
  requirements?: string;
  benefits: string[];
  contactPerson: string;
  contactEmail: string;
  urgency: 'low' | 'medium' | 'high';
}

interface ApplicationForm {
  opportunityId: string;
  opportunityTitle: string;
  ngoName: string;
  applicantName: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  availability: string;
  skills: string;
}

const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'urgent' | 'skills'>('all');
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    opportunityId: '',
    opportunityTitle: '',
    ngoName: '',
    applicantName: user?.name || '',
    email: user?.email || '',
    phone: '',
    experience: '',
    motivation: '',
    availability: '',
    skills: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const opportunities: VolunteerOpportunity[] = [
    {
      id: '1',
      title: 'Teaching Assistant for Rural Education',
      description: 'Help children in rural areas with basic education, math, and English skills. Work with our education team to provide quality learning experiences.',
      ngo: 'Education for All',
      ngoId: 'ngo_001',
      location: 'Nashik, Maharashtra',
      timeCommitment: '4 hours/week',
      skills: ['Teaching', 'English', 'Mathematics', 'Patience'],
      status: 'open',
      spotsAvailable: 3,
      totalSpots: 5,
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      requirements: 'Basic English proficiency, passion for teaching',
      benefits: ['Certificate of participation', 'Skill development', 'Community impact'],
      contactPerson: 'Priya Sharma',
      contactEmail: 'priya@educationforall.org',
      urgency: 'high'
    },
    {
      id: '2',
      title: 'Healthcare Support Volunteer',
      description: 'Assist in medical camps and health awareness programs. Help with patient registration, basic health checkups, and community outreach.',
      ngo: 'Hope for Tomorrow',
      ngoId: 'ngo_002',
      location: 'Mumbai, Maharashtra',
      timeCommitment: '6 hours/month',
      skills: ['Healthcare', 'Communication', 'Basic First Aid'],
      status: 'open',
      spotsAvailable: 2,
      totalSpots: 4,
      startDate: '2024-06-25',
      requirements: 'Basic first aid knowledge preferred',
      benefits: ['Medical training', 'Certificate', 'Networking opportunities'],
      contactPerson: 'Dr. Rajesh Kumar',
      contactEmail: 'dr.rajesh@hopefortomorrow.org',
      urgency: 'medium'
    },
    {
      id: '3',
      title: 'Environmental Conservation Drive',
      description: 'Join our tree plantation and environmental awareness campaigns. Help make communities greener and more sustainable.',
      ngo: 'Green Earth Foundation',
      ngoId: 'ngo_003',
      location: 'Pune, Maharashtra',
      timeCommitment: '8 hours/month',
      skills: ['Environmental awareness', 'Physical activity', 'Community engagement'],
      status: 'open',
      spotsAvailable: 10,
      totalSpots: 15,
      startDate: '2024-07-15',
      requirements: 'Enthusiasm for environmental causes',
      benefits: ['Environmental impact', 'Certificate', 'Team building'],
      contactPerson: 'Sanjay Gupta',
      contactEmail: 'sanjay@greenearth.org',
      urgency: 'low'
    },
    {
      id: '4',
      title: 'Elderly Care Support',
      description: 'Spend time with elderly residents, assist with activities, and provide companionship at care homes.',
      ngo: 'Care & Compassion',
      ngoId: 'ngo_004',
      location: 'Delhi, Delhi',
      timeCommitment: '3 hours/week',
      skills: ['Empathy', 'Communication', 'Patience', 'Care giving'],
      status: 'open',
      spotsAvailable: 1,
      totalSpots: 6,
      startDate: '2024-06-30',
      requirements: 'Compassionate nature, good communication skills',
      benefits: ['Personal fulfillment', 'Certificate', 'Life experience'],
      contactPerson: 'Meera Agarwal',
      contactEmail: 'meera@carecompassion.org',
      urgency: 'high'
    },
    {
      id: '5',
      title: 'Digital Literacy Trainer',
      description: 'Teach basic computer skills and digital literacy to underprivileged communities. Help bridge the digital divide.',
      ngo: 'Digital India Initiative',
      ngoId: 'ngo_005',
      location: 'Bangalore, Karnataka',
      timeCommitment: '5 hours/week',
      skills: ['Computer skills', 'Teaching', 'Technology', 'Patience'],
      status: 'full',
      spotsAvailable: 0,
      totalSpots: 3,
      startDate: '2024-06-20',
      endDate: '2024-09-20',
      requirements: 'Good computer knowledge, teaching experience preferred',
      benefits: ['Tech skills enhancement', 'Certificate', 'Community impact'],
      contactPerson: 'Amit Verma',
      contactEmail: 'amit@digitalindia.org',
      urgency: 'medium'
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    switch (filter) {
      case 'open': return opp.status === 'open';
      case 'urgent': return opp.urgency === 'high';
      case 'skills': return opp.skills.some(skill => 
        ['Teaching', 'Healthcare', 'Technology'].includes(skill)
      );
      default: return true;
    }
  });

  const handleViewDetails = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleApplyClick = (opportunity: VolunteerOpportunity) => {
    setApplicationForm({
      ...applicationForm,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      ngoName: opportunity.ngo
    });
    setShowApplicationForm(true);
  };
  const handleBookAppointment = (opportunity: VolunteerOpportunity) => {
    // Enhanced appointment booking with more realistic flow
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const appointmentDate = nextWeek.toLocaleDateString();
    
    const message = `
🗓️ Appointment Request Sent!

Your appointment request has been sent to:
• Contact: ${opportunity.contactPerson}
• Organization: ${opportunity.ngo}
• Email: ${opportunity.contactEmail}

Suggested Date: ${appointmentDate}

They will contact you within 24 hours to confirm the appointment details and discuss the volunteer opportunity: "${opportunity.title}"

You will receive a confirmation email shortly.
    `;
    
    alert(message);
    
    // Mock storing appointment request
    console.log('Appointment booked:', {
      opportunityId: opportunity.id,
      volunteerName: user?.name,
      volunteerEmail: user?.email,
      requestedDate: appointmentDate,
      contactPerson: opportunity.contactPerson,
      ngoContactEmail: opportunity.contactEmail
    });
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Mock API call - in real app, this would send to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock email to NGO
      console.log('Application submitted:', applicationForm);
      
      const successMessage = `
✅ Application Submitted Successfully!

Your application for "${applicationForm.opportunityTitle}" has been sent to ${applicationForm.ngoName}.

Application Details:
• Volunteer: ${applicationForm.applicantName}
• Email: ${applicationForm.email}
• Phone: ${applicationForm.phone}
• Position: ${applicationForm.opportunityTitle}

Next Steps:
1. You will receive a confirmation email shortly
2. ${applicationForm.ngoName} will review your application
3. They will contact you within 2-3 business days
4. If selected, you'll be invited for an interview or orientation

Thank you for your interest in volunteering!
      `;
      
      alert(successMessage);
      
      setShowApplicationForm(false);
      setSelectedOpportunity(null);
      setApplicationForm({
        opportunityId: '',
        opportunityTitle: '',
        ngoName: '',
        applicantName: user?.name || '',
        email: user?.email || '',
        phone: '',
        experience: '',
        motivation: '',
        availability: '',
        skills: ''
      });    } catch {
      alert('❌ Error submitting application. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-50';
      case 'full': return 'text-red-600 bg-red-50';
      case 'closed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Volunteer Opportunities
        </h1>
        <p className="text-gray-600">
          Discover meaningful volunteer opportunities and make a difference in your community.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.filter className="w-5 h-5 text-blue-600" />
            Filter Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({opportunities.length})
            </Button>
            <Button
              variant={filter === 'open' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('open')}
            >
              Open ({opportunities.filter(o => o.status === 'open').length})
            </Button>
            <Button
              variant={filter === 'urgent' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('urgent')}
            >
              Urgent ({opportunities.filter(o => o.urgency === 'high').length})
            </Button>
            <Button
              variant={filter === 'skills' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('skills')}
            >
              Skill Based ({opportunities.filter(o => o.skills.some(s => ['Teaching', 'Healthcare', 'Technology'].includes(s))).length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                    {opportunity.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(opportunity.urgency)}`}>
                    {opportunity.urgency} priority
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{opportunity.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icons.users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{opportunity.ngo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.location className="w-4 h-4 text-green-600" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.pending className="w-4 h-4 text-purple-600" />
                  <span>{opportunity.timeCommitment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.calendar className="w-4 h-4 text-orange-600" />
                  <span>Starts: {opportunity.startDate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {opportunity.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {opportunity.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                      +{opportunity.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {opportunity.status === 'open' && (
                <div className="text-sm">
                  <span className="font-medium text-green-600">
                    {opportunity.spotsAvailable} of {opportunity.totalSpots} spots available
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(opportunity)}
                  className="flex-1"
                >
                  View Details
                </Button>
                {opportunity.status === 'open' && (
                  <Button
                    size="sm"
                    onClick={() => handleApplyClick(opportunity)}
                    className="flex-1"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedOpportunity.title}</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedOpportunity(null)}
                >
                  <Icons.close className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedOpportunity.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Organization</h4>
                    <p className="text-gray-600">{selectedOpportunity.ngo}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{selectedOpportunity.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Time Commitment</h4>
                    <p className="text-gray-600">{selectedOpportunity.timeCommitment}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                    <p className="text-gray-600">
                      {selectedOpportunity.startDate} - {selectedOpportunity.endDate || 'Ongoing'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedOpportunity.requirements && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <p className="text-gray-600">{selectedOpportunity.requirements}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedOpportunity.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-gray-600">
                    {selectedOpportunity.contactPerson} - {selectedOpportunity.contactEmail}
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  {selectedOpportunity.status === 'open' && (
                    <>
                      <Button
                        onClick={() => handleApplyClick(selectedOpportunity)}
                        className="flex-1"
                      >
                        Apply for this Opportunity
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBookAppointment(selectedOpportunity)}
                        className="flex-1"
                      >
                        Book Appointment
                      </Button>
                    </>
                  )}
                  {selectedOpportunity.status === 'full' && (
                    <Button
                      variant="outline"
                      onClick={() => handleBookAppointment(selectedOpportunity)}
                      className="flex-1"
                    >
                      Join Waiting List
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Apply for Volunteer Position</h2>
                  <p className="text-gray-600">{applicationForm.opportunityTitle} at {applicationForm.ngoName}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowApplicationForm(false)}
                >
                  <Icons.close className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicationForm.applicantName}
                      onChange={(e) => setApplicationForm({...applicationForm, applicantName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      title="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                      title="Email Address"
                    />
                  </div>
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                    pattern="[+]?[0-9\s\-\(\)]+"
                    title="Please enter a valid phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    value={applicationForm.experience}
                    onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe any relevant volunteer experience or skills..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to volunteer? *
                  </label>
                  <textarea
                    required
                    value={applicationForm.motivation}
                    onChange={(e) => setApplicationForm({...applicationForm, motivation: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your motivation to volunteer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationForm.availability}
                    onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Weekends, 4 hours per week, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Qualifications
                  </label>
                  <textarea
                    value={applicationForm.skills}
                    onChange={(e) => setApplicationForm({...applicationForm, skills: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="List your relevant skills and qualifications..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>                  <Button
                    type="submit"
                    disabled={submitting || !applicationForm.applicantName || !applicationForm.email || !applicationForm.phone || !applicationForm.motivation || !applicationForm.availability}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <Icons.refresh className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Icons.search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;
