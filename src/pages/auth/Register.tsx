import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Building, Calendar, MapPin, Phone, 
  Globe, CreditCard, Check, ArrowRight, Heart, Users, Gift
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { UserRole } from '../../types';

interface NGOFormData {
  // Basic Details
  name: string;
  registrationNumber: string;
  type: 'trust' | 'society' | 'section8' | '';
  registrationDate: string;
  legalStatus: string;
  address: string;
  pincode: string;
  operationalAreas: string[];

  // Representative Details
  repName: string;
  repDesignation: string;
  repPhone: string;
  repEmail: string;
  repIdType: 'aadhaar' | 'pan' | 'passport' | '';
  repIdNumber: string;

  // Documents
  registrationCertificate: File | null;
  panCard: File | null;
  taxExemptionCert: File | null;
  fcraCertificate: File | null;
  annualReport: File | null;
  financialStatement: File | null;

  // Online Presence
  website: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  mediaLinks: string[];

  // Bank Details
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledCheque: File | null;

  // Additional Info
  logo: File | null;
  mission: string;
  vision: string;
  targetBeneficiaries: string;
  impactMetrics: string;
}

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [role, setRole] = useState<UserRole>('citizen');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Basic user registration fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // NGO specific form data
  const [ngoData, setNgoData] = useState<NGOFormData>({
    name: '',
    registrationNumber: '',
    type: '',
    registrationDate: '',
    legalStatus: '',
    address: '',
    pincode: '',
    operationalAreas: [],
    repName: '',
    repDesignation: '',
    repPhone: '',
    repEmail: '',
    repIdType: '',
    repIdNumber: '',
    registrationCertificate: null,
    panCard: null,
    taxExemptionCert: null,
    fcraCertificate: null,
    annualReport: null,
    financialStatement: null,
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    mediaLinks: [],
    bankAccountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    cancelledCheque: null,
    logo: null,
    mission: '',
    vision: '',
    targetBeneficiaries: '',
    impactMetrics: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (role === 'ngo' && (!isPhoneVerified || !isEmailVerified)) {
      toast.error('Please verify both phone and email before proceeding');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      toast.success('Account created successfully! Welcome to SevaDaan!');
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      toast.error((err as Error).message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFileUpload = (field: keyof NGOFormData, file: File | null) => {
    setNgoData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const sendOTP = async (type: 'phone' | 'email') => {
    // Simulate OTP sending
    toast.info(`OTP sent to your ${type}. Please check and verify.`);
    setTimeout(() => {
      if (type === 'phone') {
        setIsPhoneVerified(true);
        toast.success('Phone number verified successfully!');
      } else {
        setIsEmailVerified(true);
        toast.success('Email address verified successfully!');
      }
    }, 1500);
  };

  const renderBasicForm = () => (
    <div className="space-y-6">
      <Input
        id="name"
        label="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Rajat Dalal"
        leftIcon={<User className="h-5 w-5" />}
        required
      />

      <Input
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        leftIcon={<Mail className="h-5 w-5" />}
        autoComplete="email"
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        leftIcon={<Lock className="h-5 w-5" />}
        helpText="Password must be at least 8 characters long"
        autoComplete="new-password"
        minLength={8}
        required
      />

      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        leftIcon={<Lock className="h-5 w-5" />}
        autoComplete="new-password"
        minLength={8}
        error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
        required
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          I am registering as
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="mb-1">
            <RoleOption
              id="citizen"
              label="Citizen"
              description="Access programs and resources"
              selected={role === 'citizen'}
              onClick={() => setRole('citizen')}
            />
          </div>
          <div className="mb-1">
            <RoleOption
              id="volunteer"
              label="Volunteer"
              description="Offer your time and skills"
              selected={role === 'volunteer'}
              onClick={() => setRole('volunteer')}
            />
          </div>
          <div className="mb-1">
            <RoleOption
              id="ngo"
              label="NGO"
              description="List programs and recruit volunteers"
              selected={role === 'ngo'}
              onClick={() => setRole('ngo')}
            />
          </div>
          <div className="mb-1">
            <RoleOption
              id="donor"
              label="Donor"
              description="Support causes with donations"
              selected={role === 'donor'}
              onClick={() => setRole('donor')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNGOBasicDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Organization Details</h3>
      
      <div>
        <label htmlFor="ngoName" className="block text-sm font-medium text-slate-700">
          NGO Name (as registered)
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="ngoName"
            name="ngoName"
            type="text"
            value={ngoData.name}
            onChange={(e) => setNgoData(prev => ({ ...prev, name: e.target.value }))}
            className="input pl-10 w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Registration Number
          </label>
          <input
            type="text"
            value={ngoData.registrationNumber}
            onChange={(e) => setNgoData(prev => ({ ...prev, registrationNumber: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="Enter registration number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Type of NGO
          </label>
          <select
            id="ngoType"
            aria-label="Type of NGO"
            value={ngoData.type}
            onChange={(e) => setNgoData(prev => ({ ...prev, type: e.target.value as NGOFormData['type'] }))}
            className="input w-full mt-1"
            required
          >
            <option value="">Select type</option>
            <option value="trust">Trust</option>
            <option value="society">Society</option>
            <option value="section8">Section 8 Company</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Date of Registration
          </label>
            <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="registrationDate"
              type="date"
              value={ngoData.registrationDate}
              onChange={(e) => setNgoData(prev => ({ ...prev, registrationDate: e.target.value }))}
              className="input pl-10 w-full"
              required
              title="Date of registration"
              placeholder="Select registration date"
            />
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Legal Status
          </label>
          <input
            type="text"
            value={ngoData.legalStatus}
            onChange={(e) => setNgoData(prev => ({ ...prev, legalStatus: e.target.value }))}
            className="input w-full mt-1"
            placeholder="e.g., Trust Act, Societies Registration Act"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Registered Address
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          <textarea
            value={ngoData.address}
            onChange={(e) => setNgoData(prev => ({ ...prev, address: e.target.value }))}
            className="input pl-10 w-full h-24"
            required
            placeholder="Enter registered address"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Pincode
          </label>
          <input
            type="text"
            value={ngoData.pincode}
            onChange={(e) => setNgoData(prev => ({ ...prev, pincode: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="Enter pincode"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Operational Areas
          </label>
          <input
            type="text"
            placeholder="Enter cities/states separated by commas"
            value={ngoData.operationalAreas.join(', ')}
            onChange={(e) => setNgoData(prev => ({ 
              ...prev, 
              operationalAreas: e.target.value.split(',').map(area => area.trim()) 
            }))}
            className="input w-full mt-1"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderRepresentativeDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Authorized Representative Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={ngoData.repName}
              onChange={(e) => setNgoData(prev => ({ ...prev, repName: e.target.value }))}
              className="input pl-10 w-full"
              required
              placeholder="Enter full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Designation
          </label>
          <input
            type="text"
            value={ngoData.repDesignation}
            onChange={(e) => setNgoData(prev => ({ ...prev, repDesignation: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="e.g., President, Secretary"
            title="Enter designation (e.g., President, Secretary)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                value={ngoData.repPhone}
                onChange={(e) => setNgoData(prev => ({ ...prev, repPhone: e.target.value }))}
                className="input pl-10 w-full"
                required
                placeholder="Enter phone number"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => sendOTP('phone')}
              disabled={isPhoneVerified}
            >
              {isPhoneVerified ? (
                <Check className="w-4 h-4 text-success-500" />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={ngoData.repEmail}
                onChange={(e) => setNgoData(prev => ({ ...prev, repEmail: e.target.value }))}
                className="input pl-10 w-full"
                required
                placeholder="Enter email address"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => sendOTP('email')}
              disabled={isEmailVerified}
            >
              {isEmailVerified ? (
                <Check className="w-4 h-4 text-success-500" />
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            ID Proof Type
          </label>
          <select
            id="repIdType"
            aria-label="ID Proof Type"
            value={ngoData.repIdType}
            onChange={(e) => setNgoData(prev => ({ ...prev, repIdType: e.target.value as NGOFormData['repIdType'] }))}
            className="input w-full mt-1"
            required
          >
            <option value="">Select ID type</option>
            <option value="aadhaar">Aadhaar</option>
            <option value="pan">PAN</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            ID Number
          </label>
          <input
            type="text"
            value={ngoData.repIdNumber}
            onChange={(e) => setNgoData(prev => ({ ...prev, repIdNumber: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="Enter ID number"
            title="Enter ID number"
          />
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Official Documentation</h3>
      
      <div className="space-y-4">
        <DocumentUpload
          label="NGO Registration Certificate"
          file={ngoData.registrationCertificate}
          onChange={(file) => handleFileUpload('registrationCertificate', file)}
          required
        />

        <DocumentUpload
          label="PAN Card of NGO"
          file={ngoData.panCard}
          onChange={(file) => handleFileUpload('panCard', file)}
          required
        />

        <DocumentUpload
          label="12A/80G Certificate"
          file={ngoData.taxExemptionCert}
          onChange={(file) => handleFileUpload('taxExemptionCert', file)}
          description="For tax exemption (if available)"
        />

        <DocumentUpload
          label="FCRA Certificate"
          file={ngoData.fcraCertificate}
          onChange={(file) => handleFileUpload('fcraCertificate', file)}
          description="If receiving foreign funds"
        />

        <DocumentUpload
          label="Latest Annual Report"
          file={ngoData.annualReport}
          onChange={(file) => handleFileUpload('annualReport', file)}
          required
        />

        <DocumentUpload
          label="Financial Statement"
          file={ngoData.financialStatement}
          onChange={(file) => handleFileUpload('financialStatement', file)}
          description="Last financial year (optional but recommended)"
        />
      </div>
    </div>
  );

  const renderOnlinePresence = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Online Presence</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Website URL
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="url"
            value={ngoData.website}
            onChange={(e) => setNgoData(prev => ({ ...prev, website: e.target.value }))}
            className="input pl-10 w-full"
            placeholder="https://example.org"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Facebook Page
          </label>
          <input
            type="url"
            value={ngoData.socialLinks.facebook}
            onChange={(e) => setNgoData(prev => ({ 
              ...prev, 
              socialLinks: { ...prev.socialLinks, facebook: e.target.value }
            }))}
            className="input w-full mt-1"
            placeholder="https://facebook.com/your-ngo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Twitter Profile
          </label>
          <input
            type="url"
            value={ngoData.socialLinks.twitter}
            onChange={(e) => setNgoData(prev => ({ 
              ...prev, 
              socialLinks: { ...prev.socialLinks, twitter: e.target.value }
            }))}
            className="input w-full mt-1"
            placeholder="https://twitter.com/your-ngo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            LinkedIn Page
          </label>
          <input
            type="url"
            value={ngoData.socialLinks.linkedin}
            onChange={(e) => setNgoData(prev => ({ 
              ...prev, 
              socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
            }))}
            className="input w-full mt-1"
            placeholder="https://linkedin.com/company/your-ngo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Instagram Profile
          </label>
          <input
            type="url"
            value={ngoData.socialLinks.instagram}
            onChange={(e) => setNgoData(prev => ({ 
              ...prev, 
              socialLinks: { ...prev.socialLinks, instagram: e.target.value }
            }))}
            className="input w-full mt-1"
            placeholder="https://instagram.com/your-ngo"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Media Coverage Links
        </label>
        <div className="mt-1 space-y-2">
          {ngoData.mediaLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => {
                  const newLinks = [...ngoData.mediaLinks];
                  newLinks[index] = e.target.value;
                  setNgoData(prev => ({ ...prev, mediaLinks: newLinks }));
                }}
                className="input w-full"
                placeholder="https://example.com/article"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNgoData(prev => ({
                    ...prev,
                    mediaLinks: prev.mediaLinks.filter((_, i) => i !== index)
                  }));
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setNgoData(prev => ({
                ...prev,
                mediaLinks: [...prev.mediaLinks, '']
              }));
            }}
          >
            Add Media Link
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Bank Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Account Holder Name
        </label>
        <input
          type="text"
          value={ngoData.bankAccountName}
          onChange={(e) => setNgoData(prev => ({ ...prev, bankAccountName: e.target.value }))}
          className="input w-full mt-1"
          required
          placeholder="Enter account holder name"
          title="Enter account holder name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Bank Name
          </label>
          <input
            type="text"
            value={ngoData.bankName}
            onChange={(e) => setNgoData(prev => ({ ...prev, bankName: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="Enter bank name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Account Number
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={ngoData.accountNumber}
              onChange={(e) => setNgoData(prev => ({ ...prev, accountNumber: e.target.value }))}
              className="input pl-10 w-full"
              required
              placeholder="Enter account number"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            IFSC Code
          </label>
          <input
            type="text"
            value={ngoData.ifscCode}
            onChange={(e) => setNgoData(prev => ({ ...prev, ifscCode: e.target.value }))}
            className="input w-full mt-1"
            required
            placeholder="Enter IFSC code"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Cancelled Cheque
          </label>
          <div className="mt-1">
            <input
              type="file"
              onChange={(e) => handleFileUpload('cancelledCheque', e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
              accept="image/*,application/pdf"
              title="Upload cancelled cheque"
              placeholder="Upload cancelled cheque"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Additional Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">
          NGO Logo
        </label>
        <div className="mt-1">
          <input
            id="ngo-logo-upload"
            type="file"
            onChange={(e) => handleFileUpload('logo', e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
            accept="image/*"
            title="Upload NGO logo"
            placeholder="Upload NGO logo"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Mission Statement
        </label>
        <textarea
          value={ngoData.mission}
          onChange={(e) => setNgoData(prev => ({ ...prev, mission: e.target.value }))}
          className="input w-full mt-1 h-24"
          placeholder="Describe your organization's mission..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Vision Statement
        </label>
        <textarea
          value={ngoData.vision}
          onChange={(e) => setNgoData(prev => ({ ...prev, vision: e.target.value }))}
          className="input w-full mt-1 h-24"
          placeholder="Describe your organization's vision..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Target Beneficiaries
        </label>
        <textarea
          value={ngoData.targetBeneficiaries}
          onChange={(e) => setNgoData(prev => ({ ...prev, targetBeneficiaries: e.target.value }))}
          className="input w-full mt-1 h-24"
          placeholder="Describe who your organization helps..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Impact Metrics
        </label>
        <textarea
          value={ngoData.impactMetrics}
          onChange={(e) => setNgoData(prev => ({ ...prev, impactMetrics: e.target.value }))}
          className="input w-full mt-1 h-24"
          placeholder="Describe your organization's impact..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-3xl w-full space-y-8 relative z-10">
        {/* Header Section */}
        <div className="text-center">
          <Link to="/" className="inline-block group">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Seva</span>
                <span className="text-slate-800">Daan</span>
              </h1>
            </div>
          </Link>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Create your account
            </h2>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              Join our community to connect with NGOs, volunteer opportunities, and make a meaningful impact
            </p>
          </div>
        </div>

        {/* Main Registration Card */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2"></div>
          <CardContent className="pt-6 pb-6 px-4 md:px-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {role === 'ngo' ? (
                <>
                  {/* NGO Registration Steps */}
                  <div className="border-b border-slate-200 pb-4">
                    <div className="grid grid-cols-3 gap-2">
                      {['Basic Info', 'Representative', 'Documents', 'Online', 'Bank Details', 'Additional'].map((tab, index) => (
                        <Button
                          key={tab}
                          type="button"
                          variant={step === index + 1 ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => setStep(index + 1)}
                          className="text-xs md:text-sm transition-colors"
                        >
                          <span className="flex items-center">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-medium mr-1 ${
                              step === index + 1 
                                ? 'bg-white text-primary-600' 
                                : step > index + 1 
                                ? 'bg-green-500 text-white' 
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {step > index + 1 ? <Check className="w-3 h-3" /> : index + 1}
                            </span>
                            <span className="truncate">{tab}</span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 animate-fadeIn">
                    {step === 1 && renderNGOBasicDetails()}
                    {step === 2 && renderRepresentativeDetails()}
                    {step === 3 && renderDocuments()}
                    {step === 4 && renderOnlinePresence()}
                    {step === 5 && renderBankDetails()}
                    {step === 6 && renderAdditionalInfo()}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step > 1 ? step - 1 : 1)}
                      disabled={step === 1}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      Previous
                    </Button>
                    
                    {step < 6 ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setStep(step < 6 ? step + 1 : 6)}
                        className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        {!isLoading && <Check className="w-4 h-4 mr-2" />}
                        Complete Registration
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {renderBasicForm()}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 text-base font-medium shadow-md"
                    isLoading={isLoading}
                  >
                    {!isLoading && <ArrowRight className="w-5 h-5 mr-2" />}
                    Create Account
                  </Button>
                </>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-center mt-6 p-3 bg-slate-50 rounded-md border border-slate-200">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-slate-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-semibold text-primary-600 hover:text-primary-500 transition-colors duration-300 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

interface RoleOptionProps {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const RoleOption: React.FC<RoleOptionProps> = ({ id, label, description, selected, onClick }) => {
  const getRoleIcon = () => {
    switch (id) {
      case 'citizen':
        return <User className="h-6 w-6" />;
      case 'volunteer':
        return <Users className="h-6 w-6" />;
      case 'ngo':
        return <Building className="h-6 w-6" />;
      case 'donor':
        return <Gift className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getRoleColor = () => {
    switch (id) {
      case 'citizen':
        return selected ? 'bg-blue-500' : 'bg-blue-100';
      case 'volunteer':
        return selected ? 'bg-green-500' : 'bg-green-100';
      case 'ngo':
        return selected ? 'bg-purple-500' : 'bg-purple-100';
      case 'donor':
        return selected ? 'bg-orange-500' : 'bg-orange-100';
      default:
        return selected ? 'bg-primary-500' : 'bg-primary-100';
    }
  };

  return (
    <div
      className={`role-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <input
        type="radio"
        id={id}
        name="role"
        className="sr-only"
        checked={selected}
        onChange={() => {}}
      />
      <label htmlFor={id} className="cursor-pointer w-full">
        <div className="flex items-center space-x-3">
          <div className={`role-icon ${getRoleColor()} ${selected ? 'text-white' : 'text-slate-600'}`}>
            {getRoleIcon()}
          </div>
          <div>
            <div className={`font-semibold ${selected ? 'text-primary-700' : 'text-slate-800'}`}>
              {label}
            </div>
            <div className={`text-sm mt-1 ${selected ? 'text-primary-600' : 'text-slate-500'}`}>
              {description}
            </div>
          </div>
        </div>
      </label>
      {selected && (
        <div className="absolute top-3 right-3 bg-primary-500 text-white rounded-md p-1 shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

interface DocumentUploadProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  description?: string;
  required?: boolean;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label,
  file,
  onChange,
  description,
  required
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
      <div className="mt-1">
        <input
          type="file"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100"
          accept="application/pdf,image/*"
          required={required}
          title={label}
          placeholder={`Upload ${label}`}
        />
      </div>
      {file && (
        <p className="text-xs text-slate-500 mt-1">
          Selected file: {file.name}
        </p>
      )}
    </div>
  );
};

export default Register;