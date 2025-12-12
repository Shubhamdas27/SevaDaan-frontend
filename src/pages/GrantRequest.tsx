import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const GrantRequest: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [usagePlan, setUsagePlan] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/grants');
    }, 1500);
  };

  if (!user || user.role !== 'ngo') {
    return (
      <Layout>
        <div className="container py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 text-warning-800">
                <Icons.error className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2">NGO Access Only</h3>
                  <p className="text-sm text-warning-600">
                    Only verified NGOs can post grant requests. Please{' '}
                    <a href="/login" className="font-medium underline">log in</a> or{' '}
                    <a href="/register" className="font-medium underline">register</a> as an NGO to continue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Grant Request</h1>
          <p className="text-white/90 max-w-3xl">
            Post your funding needs and connect with potential donors. Be clear and specific about your requirements and how the funds will be utilized.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Grant Title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Educational Support for Rural Schools"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input w-full h-32"
                    placeholder="Describe your project and funding needs in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Amount Required (₹)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="50000"
                    leftIcon={<Icons.money className="h-5 w-5" />}
                    required
                  />

                  <Input
                    label="Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    leftIcon={<Icons.calendar className="h-5 w-5" />}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Usage Plan
                  </label>
                  <textarea
                    value={usagePlan}
                    onChange={(e) => setUsagePlan(e.target.value)}
                    className="input w-full h-32"
                    placeholder="Provide a detailed plan of how the funds will be utilized..."
                    required
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Icons.document className="w-4 h-4 text-primary-500" />
                    Required Documents
                  </h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• NGO Registration Certificate</li>
                    <li>• Last Year's Annual Report</li>
                    <li>• Project Proposal</li>
                    <li>• Budget Breakdown</li>
                  </ul>
                  <div className="mt-4">
                    <label htmlFor="documents" className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Documents
                    </label>
                    <input
                      id="documents"
                      type="file"
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100"
                      multiple
                      aria-describedby="documents-help"
                    />
                    <p id="documents-help" className="text-xs text-slate-500 mt-1">
                      Select multiple files including your registration certificate, annual report, etc.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-primary-600 border-slate-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                    I confirm that all the information provided is accurate and I have the authority to request funds on behalf of the organization.
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={loading}
                >
                  Submit Grant Request
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Tips for a Strong Grant Request</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Be specific about your funding needs</li>
                  <li>• Provide clear impact metrics</li>
                  <li>• Include a detailed timeline</li>
                  <li>• Highlight community benefits</li>
                  <li>• Attach supporting documents</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Review Process</h3>
                <div className="space-y-3">
                  <Badge variant="primary">1-2 Business Days</Badge>
                  <p className="text-sm text-slate-600">
                    Our team will review your request and verify all submitted documents. You'll be notified via email once your grant request is approved and published.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GrantRequest;