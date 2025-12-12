import React, { useState } from 'react';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const EmergencyHelp: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [emergencyType, setEmergencyType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [nearbyHelp, setNearbyHelp] = useState<any[]>([]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call to find nearby help
    setTimeout(() => {
      setNearbyHelp([
        {
          id: 1,
          name: 'Care Foundation',
          type: 'NGO',
          distance: '2.5 km',
          phone: '+91 98765 43210',
          services: ['Medical', 'Food', 'Shelter'],
        },
        {
          id: 2,
          name: 'Dr. Sarah Khan',
          type: 'Volunteer',
          distance: '3.1 km',
          phone: '+91 98765 43211',
          services: ['Medical'],
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-error-700 py-16 text-white">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Icons.error className="w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Emergency Help</h1>
          </div>
          <p className="text-white max-w-3xl">
            Need immediate assistance? Fill out this form and we'll connect you with nearby NGOs and volunteers who can help.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Request Emergency Help</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input w-full"
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Icons.phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input pl-10 w-full"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Icons.location className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input pl-10 w-full"
                        placeholder="Enter your location"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                    >
                      Get Location
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="emergency-type" className="block text-sm font-medium text-slate-700 mb-2">
                    Type of Emergency
                  </label>
                  <select
                    id="emergency-type"
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="input w-full"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="food">Food Emergency</option>
                    <option value="shelter">Need Shelter</option>
                    <option value="rescue">Need Rescue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input w-full h-32"
                    placeholder="Please describe your emergency situation..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={loading}
                >
                  Request Emergency Help
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                    <div className="flex items-center">
                      <Icons.phone className="w-5 h-5 text-error-600 mr-3" />
                      <div>
                        <div className="font-medium">Ambulance</div>
                        <div className="text-sm text-slate-500">Medical Emergency</div>
                      </div>
                    </div>
                    <a href="tel:102" className="text-error-600 font-bold">102</a>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                    <div className="flex items-center">
                      <Icons.phone className="w-5 h-5 text-error-600 mr-3" />
                      <div>
                        <div className="font-medium">Police</div>
                        <div className="text-sm text-slate-500">Law Enforcement</div>
                      </div>
                    </div>
                    <a href="tel:100" className="text-error-600 font-bold">100</a>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                    <div className="flex items-center">
                      <Icons.phone className="w-5 h-5 text-error-600 mr-3" />
                      <div>
                        <div className="font-medium">Fire Brigade</div>
                        <div className="text-sm text-slate-500">Fire Emergency</div>
                      </div>
                    </div>
                    <a href="tel:101" className="text-error-600 font-bold">101</a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {nearbyHelp.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Nearby Help</h2>
                  <div className="space-y-4">
                    {nearbyHelp.map((helper) => (
                      <div key={helper.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{helper.name}</h3>
                            <Badge variant="primary">{helper.type}</Badge>
                          </div>
                          <span className="text-sm text-slate-500">{helper.distance}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icons.phone className="w-4 h-4 text-slate-400" />
                          <a href={`tel:${helper.phone}`} className="text-primary-600">
                            {helper.phone}
                          </a>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {helper.services.map((service: string) => (
                            <Badge key={service} variant="accent">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyHelp;