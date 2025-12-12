import React, { useState } from 'react';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useContact } from '../hooks/useApiHooks';
import { TEAM_MEMBERS } from '../data/mock';

const WhoWeAre: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { loading, submitContact } = useContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContact({
        name,
        email,
        subject: 'Contact from Who We Are page',
        message
      });
      
      // Show success toast
      toast.success('Thank you for reaching out! We\'ll get back to you soon.');
      
      // Reset form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      // Show error toast
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  const timeline = [
    {
      year: '2022',
      title: 'Platform Launch',
      description: 'SevaDaan was launched with the mission to connect NGOs with donors and volunteers.',
    },
    {
      year: '2023',
      title: 'Expanded Reach',
      description: 'Reached 100+ NGOs and facilitated over ₹1 crore in donations.',
    },
    {
      year: '2024',
      title: 'New Features',
      description: 'Introduced grant management and volunteer coordination systems.',
    },
    {
      year: '2025',
      title: 'Future Goals',
      description: 'Aiming to reach 1000+ NGOs and expand to international markets.',
    },
  ];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Inside SevaDaan</h1>
          <p className="text-white/90 max-w-3xl">
            Discover our story, meet our team, and learn how we're connecting NGOs with communities to create meaningful social impact across India.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <p className="text-lg text-slate-600 mb-8">
            SevaDaan is dedicated to bridging the gap between NGOs, donors, and volunteers. We believe in creating a transparent and efficient platform that enables meaningful social impact and sustainable development across India.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icons.target className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium mb-2">Vision</h3>
                    <p className="text-slate-600">
                      To become India's most trusted platform for social impact, facilitating seamless collaboration between NGOs and supporters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icons.user className="w-6 h-6 text-primary-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium mb-2">Values</h3>
                    <p className="text-slate-600">
                      Transparency, accountability, and dedication to creating positive social change in communities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">150+</div>
                <div className="text-slate-600">NGOs Registered</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">₹1.5Cr+</div>
                <div className="text-slate-600">Donations Facilitated</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                <div className="text-slate-600">Volunteers Connected</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
                <div className="text-slate-600">States Covered</div>
              </CardContent>
            </Card>
          </div>
        </div>



        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((item) => (
              <Card key={item.year}>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-24">
                      <div className="text-xl font-bold text-primary-600">{item.year}</div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Your Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<Icons.user className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Icons.email className="h-5 w-5" />}
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
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={loading}
                  rightIcon={!loading && <Icons.message className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Icons.location className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Office Address</h3>
                      <p className="text-slate-600">
                        123 NGO Street, Sector 15<br />
                        New Delhi, 110001<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Icons.email className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-slate-600">
                        Support: support@sevadaan.org<br />
                        General: info@sevadaan.org<br />
                        Press: media@sevadaan.org
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Icons.phone className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-slate-600">
                        Toll Free: 1800-123-4567<br />
                        Support: +91 11 2345 6789<br />
                        Hours: Mon-Fri, 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
                <div className="flex space-x-4">
                  <a
                    href="https://linkedin.com/company/sevadaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on LinkedIn"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
                  >
                    <Icons.externalLink className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/sevadaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Twitter"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
                  >
                    <Icons.externalLink className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com/sevadaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow us on Instagram"
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors"
                  >
                    <Icons.externalLink className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WhoWeAre;