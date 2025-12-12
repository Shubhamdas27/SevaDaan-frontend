import React, { useState, useEffect } from 'react';
import { X, User, Users, Mail, Phone, Calendar, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import apiService from '../../lib/apiService';

interface AddVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVolunteerAdded: () => void;
}

const AddVolunteerModal: React.FC<AddVolunteerModalProps> = ({
  isOpen,
  onClose,
  onVolunteerAdded
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    programId: '',
    skills: '',
    experience: '',
    motivation: '',
    daysPerWeek: 1,
    hoursPerDay: 1,
    preferredTime: 'flexible' as 'morning' | 'afternoon' | 'evening' | 'flexible',
    startDate: '',
    workLocation: 'onsite' as 'onsite' | 'remote' | 'hybrid',
    education: '',
    occupation: ''
  });
  
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
    }
  }, [isOpen]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPrograms();
      const programsArray = response.data || response;
      const filteredPrograms = programsArray.filter((p: any) => 
        p.volunteersRegistered < p.volunteersNeeded || p.volunteersNeeded === 0
      );
      setPrograms(filteredPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.programId || !formData.skills) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create the volunteer data structure expected by backend
      const volunteerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        programId: formData.programId,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: formData.experience,
        motivation: formData.motivation,
        availability: {
          daysPerWeek: formData.daysPerWeek,
          hoursPerDay: formData.hoursPerDay,
          preferredTime: formData.preferredTime,
          startDate: new Date(formData.startDate),
          endDate: undefined
        },
        preferences: {
          workLocation: formData.workLocation,
          travelWillingness: false,
          languagesSpoken: ['English']
        },
        background: {
          education: formData.education,
          occupation: formData.occupation
        },
        documents: {}
      };

      await apiService.addVolunteer(volunteerData);
      toast.success('Volunteer added successfully!');
      onVolunteerAdded();
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        programId: '',
        skills: '',
        experience: '',
        motivation: '',
        daysPerWeek: 1,
        hoursPerDay: 1,
        preferredTime: 'flexible',
        startDate: '',
        workLocation: 'onsite',
        education: '',
        occupation: ''
      });
      
    } catch (error: any) {
      console.error('Error adding volunteer:', error);
      toast.error(error.response?.data?.message || 'Failed to add volunteer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-indigo-600" />
              Add New Volunteer
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Close modal"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Full Name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Email Address"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Phone Number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-1">
                  Program *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    id="programId"
                    name="programId"
                    value={formData.programId}
                    onChange={handleInputChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Select Program"
                    required
                  >
                    <option value="">Select a program</option>
                    {programs.map(program => (
                      <option key={program._id} value={program._id}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills and Experience */}
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills * (comma-separated)
              </label>
              <input
                id="skills"
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Teaching, Communication, Project Management"
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Skills"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education
                </label>
                <input
                  id="education"
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Education Background"
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  id="occupation"
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Current Occupation"
                />
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Previous Experience"
              />
            </div>

            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
                Motivation
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Motivation for Volunteering"
              />
            </div>

            {/* Availability */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
                  Days/Week
                </label>
                <input
                  id="daysPerWeek"
                  type="number"
                  name="daysPerWeek"
                  value={formData.daysPerWeek}
                  onChange={handleInputChange}
                  min="1"
                  max="7"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Days per week available"
                />
              </div>

              <div>
                <label htmlFor="hoursPerDay" className="block text-sm font-medium text-gray-700 mb-1">
                  Hours/Day
                </label>
                <input
                  id="hoursPerDay"
                  type="number"
                  name="hoursPerDay"
                  value={formData.hoursPerDay}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Hours per day available"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Preferred time of day"
                >
                  <option value="flexible">Flexible</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div>
                <label htmlFor="workLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location
                </label>
                <select
                  id="workLocation"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Preferred work location"
                >
                  <option value="onsite">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="startDate"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Volunteer start date"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {submitting ? 'Adding...' : 'Add Volunteer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVolunteerModal;
