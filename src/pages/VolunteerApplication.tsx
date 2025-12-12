import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Spinner } from '../components/ui/Spinner';
import { Icons } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../lib/api';

interface Program {
  _id: string;
  title: string;
  description: string;
  ngo: {
    _id: string;
    name: string;
    logo?: string;
  };
  volunteersNeeded: number;
  volunteersRegistered: number;
  requirements: string[];
}

const VolunteerApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    motivation: '',
    availability: {
      daysPerWeek: 1,
      hoursPerDay: 2,
      preferredDays: [] as string[],
      startDate: '',
      endDate: ''
    },
    preferences: {
      workType: [] as string[],
      location: '',
      transportation: ''
    },
    background: {
      education: '',
      occupation: '',
      previousVolunteering: false
    }
  });

  const workTypes = [
    'field_work',
    'digital_marketing', 
    'community_outreach',
    'education',
    'event_planning',
    'administrative'
  ];

  const dayOptions = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  const transportationOptions = [
    'public_transport',
    'own_vehicle',
    'bicycle',
    'walking'
  ];

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/programs/${id}`);
      setProgram(response.data.data);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const prevSection = prev[section as keyof typeof prev] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...prevSection,
          [field]: value
        }
      };
    });
  };

  const handleArrayInputChange = (section: string, field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const prevSection = prev[section as keyof typeof prev] as Record<string, any>;
      const currentArray = prevSection[field] || [];
      const newArray = checked 
        ? [...currentArray, value]
        : currentArray.filter((item: string) => item !== value);
      
      return {
        ...prev,
        [section]: {
          ...prevSection,
          [field]: newArray
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!program || !user) {
      alert('Please login to apply');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);

      const applicationData = {
        programId: program._id,
        ngoId: program.ngo._id,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        motivation: formData.motivation,
        availability: {
          ...formData.availability,
          startDate: formData.availability.startDate ? new Date(formData.availability.startDate) : new Date(),
          endDate: formData.availability.endDate ? new Date(formData.availability.endDate) : null
        },
        preferences: formData.preferences,
        background: formData.background
      };

      const response = await api.post('/volunteers/apply', applicationData);

      if (response.data.success) {
        // Emit real-time notification via socket
        if (socket) {
          socket.emit('volunteer-application', {
            ngoId: program.ngo._id,
            programId: program._id,
            volunteerName: user.name,
            programTitle: program.title
          });
        }

        alert('Application submitted successfully! You will be notified once it\'s reviewed.');
        navigate('/volunteer');
      }

    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.message || 'Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.warning className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h1>
          <Button onClick={() => navigate('/volunteer')}>Browse Opportunities</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <Icons.arrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {program.ngo.logo ? (
                  <img 
                    src={program.ngo.logo} 
                    alt={`${program.ngo.name} logo`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icons.users className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Volunteer for {program.title}</h1>
                <p className="text-gray-600 mb-4">{program.ngo.name}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Volunteers Needed:</span> {program.volunteersNeeded}
                  </div>
                  <div>
                    <span className="font-medium">Applied:</span> {program.volunteersRegistered}
                  </div>
                  <div>
                    <span className="font-medium">Remaining:</span> {program.volunteersNeeded - program.volunteersRegistered}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icons.add className="w-5 h-5 text-blue-500" />
                  Volunteer Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Expertise *
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., Photography, Teaching, Event Management (comma separated)"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">List your relevant skills separated by commas</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Volunteering Experience
                    </label>
                    <Textarea
                      placeholder="Describe any previous volunteering experience or community involvement..."
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Motivation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to volunteer? *
                    </label>
                    <Textarea
                      placeholder="Tell us what motivates you to volunteer for this program..."
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Days per week
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="7"
                          value={formData.availability.daysPerWeek}
                          onChange={(e) => handleNestedInputChange('availability', 'daysPerWeek', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hours per day
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={formData.availability.hoursPerDay}
                          onChange={(e) => handleNestedInputChange('availability', 'hoursPerDay', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Days
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {dayOptions.map((day) => (
                          <label key={day} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.availability.preferredDays.includes(day)}
                              onChange={(e) => handleArrayInputChange('availability', 'preferredDays', day, e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <span className="text-sm capitalize">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available from
                        </label>
                        <Input
                          type="date"
                          value={formData.availability.startDate}
                          onChange={(e) => handleNestedInputChange('availability', 'startDate', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available until (optional)
                        </label>
                        <Input
                          type="date"
                          value={formData.availability.endDate}
                          onChange={(e) => handleNestedInputChange('availability', 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Work Preferences</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type of work you're interested in
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {workTypes.map((type) => (
                          <label key={type} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.preferences.workType.includes(type)}
                              onChange={(e) => handleArrayInputChange('preferences', 'workType', type, e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Location
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Mumbai, Remote, Specific area"
                        value={formData.preferences.location}
                        onChange={(e) => handleNestedInputChange('preferences', 'location', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transportation
                      </label>
                      <select
                        value={formData.preferences.transportation}
                        onChange={(e) => handleNestedInputChange('preferences', 'transportation', e.target.value)}
                        aria-label="Transportation method"
                        title="Select your preferred transportation method"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select transportation method</option>
                        {transportationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Background */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Background Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Bachelor's in Engineering, MBA"
                        value={formData.background.education}
                        onChange={(e) => handleNestedInputChange('background', 'education', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Occupation
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Software Engineer, Student, Retired"
                        value={formData.background.occupation}
                        onChange={(e) => handleNestedInputChange('background', 'occupation', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.background.previousVolunteering}
                          onChange={(e) => handleNestedInputChange('background', 'previousVolunteering', e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">I have previous volunteering experience</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                    >
                      {submitting ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : (
                        <Icons.send className="w-5 h-5 mr-2" />
                      )}
                      {submitting ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                    
                    <div className="mt-3 text-center text-xs text-gray-500">
                      You will be notified once your application is reviewed
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Program Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>About this Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {program.description}
                </p>
                
                {program.requirements && program.requirements.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Requirements:</h4>
                    <ul className="space-y-1">
                      {program.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <Icons.success className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-900">Application Process</span>
                  </div>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>1. Submit your application</p>
                    <p>2. NGO reviews your profile</p>
                    <p>3. You'll be notified of the decision</p>
                    <p>4. If approved, you'll receive onboarding details</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApplication;
