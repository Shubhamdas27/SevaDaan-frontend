import React, { useState } from 'react';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useContact } from '../hooks/useApiHooks';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { loading, submitContact } = useContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContact({
        name,
        email,
        subject,
        message
      });
      
      // Show success toast
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error: any) {
      // Show error toast
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/90 max-w-3xl">
            Have questions or need assistance? We're here to help. Reach out to our team through any of the channels below.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.location className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Office Address</h3>
                      <p className="text-slate-600">
                        123 NGO Street, Sector 15<br />
                        New Delhi, 110001<br />
                        India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.email className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-slate-600">
                        Support: support@sevadaan.org<br />
                        General: info@sevadaan.org<br />
                        Press: media@sevadaan.org
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icons.phone className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-slate-600">
                        Toll Free: 1800-123-4567<br />
                        Support: +91 11 2345 6789<br />
                        Hours: Mon-Fri, 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    leftIcon={<Icons.user className="h-5 w-5" />}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    leftIcon={<Icons.email className="h-5 w-5" />}
                    required
                  />

                  <Input
                    label="Subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="input w-full h-32"
                      placeholder="Type your message here..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={loading}
                    rightIcon={!loading && <Icons.send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-2">FAQ</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Check our frequently asked questions before reaching out. You might find the answer you're looking for!
                  </p>
                  <Button variant="outline" className="w-full">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;