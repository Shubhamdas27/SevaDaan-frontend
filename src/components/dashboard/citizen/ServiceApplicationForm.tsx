import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AlertCircle, Send, Loader2 } from 'lucide-react';
import apiService from '../../../lib/apiService';
import { NGO } from '../../../types';
import { useToast } from '../../ui/Toast';

interface ServiceApplicationFormProps {
  onApplicationSubmitted?: () => void;
}

const ServiceApplicationForm: React.FC<ServiceApplicationFormProps> = ({ onApplicationSubmitted }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loadingNgos, setLoadingNgos] = useState(true);
  
  const [formData, setFormData] = useState({
    ngoId: '',
    applicationType: 'service' as 'program' | 'service' | 'assistance',
    serviceType: 'other' as 'education' | 'health' | 'food' | 'shelter' | 'employment' | 'legal' | 'other',
    title: '',
    description: '',
    urgencyLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    beneficiariesCount: 1,
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    tags: [] as string[],
    documents: [] as { url: string; type: string; name: string; }[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        setLoadingNgos(true);
        const { data } = await apiService.getNGOs({});
        setNgos(data || []);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        toast.error('Failed to load NGOs');
      } finally {
        setLoadingNgos(false);
      }
    };

    fetchNgos();
  }, [toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ngoId) newErrors.ngoId = 'Please select an NGO';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.address.trim()) newErrors.address = 'Address is required';
    if (!formData.location.city.trim()) newErrors.city = 'City is required';
    if (!formData.location.state.trim()) newErrors.state = 'State is required';
    if (!formData.location.pincode.trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.createServiceApplication(formData);
      
      toast.success('Application submitted successfully!');
      
      // Reset form
      setFormData({
        ngoId: '',
        applicationType: 'service',
        serviceType: 'other',
        title: '',
        description: '',
        urgencyLevel: 'medium',
        beneficiariesCount: 1,
        location: {
          address: '',
          city: '',
          state: '',
          pincode: ''
        },
        tags: [],
        documents: []
      });
      
      onApplicationSubmitted?.();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }  };

  const serviceTypeOptions = [
    { value: 'education', label: 'Education Support', icon: '📚' },
    { value: 'health', label: 'Healthcare', icon: '🏥' },
    { value: 'food', label: 'Food Security', icon: '🍞' },
    { value: 'shelter', label: 'Shelter & Housing', icon: '🏠' },
    { value: 'employment', label: 'Employment Support', icon: '💼' },
    { value: 'legal', label: 'Legal Aid', icon: '⚖️' },
    { value: 'other', label: 'Other', icon: '🤝' }
  ];

  const urgencyOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-50' },
    { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-50' }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for Service</h2>
        <p className="text-gray-600">Submit an application for assistance or services from an NGO.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NGO Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select NGO *
          </label>
          {loadingNgos ? (
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading NGOs...
            </div>
          ) : (          <select
            value={formData.ngoId}
            onChange={(e) => setFormData(prev => ({ ...prev, ngoId: e.target.value }))}
            aria-label="Select NGO for service application"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.ngoId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
              <option value="">Choose an NGO...</option>
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name} - {ngo.city}
                </option>
              ))}
            </select>
          )}
          {errors.ngoId && <p className="mt-1 text-sm text-red-600">{errors.ngoId}</p>}
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, serviceType: option.value as any }))}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.serviceType === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Request Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Brief title for your request"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            placeholder="Provide detailed information about your request, current situation, and specific help needed"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, urgencyLevel: option.value as any }))}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.urgencyLevel === option.value
                    ? `border-primary-500 ${option.color}`
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, address: e.target.value }
                }))}
                placeholder="Street Address"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            <div>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value }
                }))}
                placeholder="City"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
            <div>
              <input
                type="text"
                value={formData.location.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, state: e.target.value }
                }))}
                placeholder="State"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>
            <div>
              <input
                type="text"
                value={formData.location.pincode}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, pincode: e.target.value }
                }))}
                placeholder="Pincode"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Beneficiaries Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Beneficiaries
          </label>          <input
            type="number"
            min="1"
            value={formData.beneficiariesCount}
            onChange={(e) => setFormData(prev => ({ ...prev, beneficiariesCount: parseInt(e.target.value) || 1 }))}
            aria-label="Number of beneficiaries"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            All fields marked with * are required
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ServiceApplicationForm;
