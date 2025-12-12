import React from 'react';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const About: React.FC = () => {
  const timeline = [
    {
      year: '2024',
      title: 'Platform Development',
      description: 'SevaDaan platform was conceptualized and developed entirely by Anushka Jain using modern technologies to revolutionize NGO-donor connections.',
    },
    {
      year: '2025',
      title: 'Launch & Growth',
      description: 'Successfully launched with comprehensive features including volunteer management, grant system, and real-time analytics.',
    },
    {
      year: 'Future',
      title: 'Expansion Plans',
      description: 'Planning to scale nationwide, integrate AI-powered matching, and expand to international markets.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:40px_40px]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">About SevaDaan</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              A modern platform empowering NGOs and connecting them with donors and volunteers to create meaningful social impact across India.
            </p>
          </div>
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
                    <Icons.favorite className="w-6 h-6 text-primary-500" />
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

        {/* Developer Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet The Developer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SevaDaan was single-handedly developed by Anushka Jain with passion and dedication to make social impact accessible to everyone
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-2xl border-0">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-32"></div>
              <CardContent className="p-8 -mt-16 relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                        <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-pink-600">
                          AJ
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Anushka Jain</h3>
                    <p className="text-lg text-purple-600 font-semibold mb-4">Full Stack Developer & Sole Creator</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Passionate about leveraging technology for social good. Single-handedly designed and developed the entire SevaDaan platform from concept to deployment to bridge the gap between NGOs, volunteers, and donors, making social impact more accessible and transparent.
                    </p>

                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <a 
                        href="mailto:anushkajain2903@gmail.com"
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icons.email className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 font-medium">Email</div>
                          <div className="text-sm text-gray-900 font-semibold">anushkajain2903@gmail.com</div>
                        </div>
                      </a>

                      <a 
                        href="tel:+919425748913"
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icons.phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-gray-500 font-medium">Phone</div>
                          <div className="text-sm text-gray-900 font-semibold">+91 94257 48913</div>
                        </div>
                      </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center md:justify-start gap-4">
                      <a
                        href="https://github.com/Anushka2903"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                      >
                        <Icons.github className="w-5 h-5" />
                        <span className="font-semibold">GitHub</span>
                      </a>
                      <a
                        href="https://www.linkedin.com/in/anushka-jain-40538135b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                      >
                        <Icons.linkedin className="w-5 h-5" />
                        <span className="font-semibold">LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>
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

        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:40px_40px]" />
          </div>
          <div className="relative p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Whether you're an NGO looking to expand your reach, a donor wanting to make a difference, or a volunteer ready to contribute, we welcome you to join our platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 border-0"
              >
                <Icons.arrowRight className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Button 
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;