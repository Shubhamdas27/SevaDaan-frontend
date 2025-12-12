import React, { useState, useEffect } from 'react';
import { Map, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { SERVICE_LOCATIONS } from '../../../data/mock';

const ServiceHeatmap: React.FC = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [serviceData] = useState(SERVICE_LOCATIONS);

  // Leaflet map initialization
  useEffect(() => {
    // We'll dynamically load Leaflet.js when the component mounts
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        initializeMap();
        return;
      }

      try {
        // Load Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        linkElement.crossOrigin = '';
        document.head.appendChild(linkElement);

        // Load Leaflet JS
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        scriptElement.crossOrigin = '';
        document.body.appendChild(scriptElement);

        scriptElement.onload = () => {
          initializeMap();
        };
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    const initializeMap = () => {
      if (!window.L || document.getElementById('service-map')?.hasChildNodes()) {
        return;
      }

      const map = window.L.map('service-map').setView([20.5937, 78.9629], 5); // Center on India

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add markers for each service location
      serviceData.forEach((location) => {
        const size = Math.min(30, Math.max(15, location.serviceCount / 5 + 10));
        
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-container">
                  <div class="marker" style="width: ${size}px; height: ${size}px; background-color: rgba(59, 130, 246, 0.7); border-radius: 50%; border: 2px solid #fff;"></div>
                 </div>`,
          iconSize: [size, size],
          iconAnchor: [size/2, size/2]
        });

        const marker = window.L.marker([location.latitude, location.longitude], { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
          <strong>${location.location}</strong><br>
          Services provided: ${location.serviceCount}<br>
          Beneficiaries: ${location.beneficiaries}
        `);
      });

      setIsMapLoaded(true);
    };

    loadLeaflet();

    // Cleanup
    return () => {
      // Remove Leaflet script if component unmounts before loading completes
      const leafletScript = document.querySelector('script[src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"]');
      if (leafletScript) {
        leafletScript.remove();
      }
    };
  }, [serviceData]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Service Coverage Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="service-map" className="w-full h-96 rounded-lg bg-slate-100 relative">
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Map className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-slate-500">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Top Serviced Areas</h3>
            <ol className="space-y-2 text-sm">
              {serviceData.slice(0, 3).map(location => (
                <li key={location.id} className="flex items-start">
                  <span className="mr-2 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary-500" />
                  </span>
                  <span>
                    <strong>{location.location}</strong>
                    <br />
                    <span className="text-slate-500 text-xs">
                      {location.serviceCount} services | {location.beneficiaries} beneficiaries
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Service Growth (YoY)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Urban Services</span>
                <span className="text-success-600">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rural Services</span>
                <span className="text-success-600">+32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Coverage</span>
                <span className="text-success-600">+28%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceHeatmap;
