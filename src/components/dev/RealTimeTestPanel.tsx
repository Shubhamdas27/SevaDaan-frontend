import React, { useState } from 'react';
import { realTimeService } from '../../services/realTimeService';
import { Play, Square, Zap, Users, DollarSign, Award, Target } from 'lucide-react';

const RealTimeTestPanel: React.FC = () => {
  const [demoMode, setDemoMode] = useState(false);
  const [stopDemo, setStopDemo] = useState<(() => void) | null>(null);

  const handleStartDemo = () => {
    const stopFunction = realTimeService.startDemoMode();
    setStopDemo(() => stopFunction);
    setDemoMode(true);
  };

  const handleStopDemo = () => {
    if (stopDemo) {
      stopDemo();
      setStopDemo(null);
    }
    setDemoMode(false);
  };

  const triggerEvent = (eventType: string) => {
    switch (eventType) {
      case 'donation':
        realTimeService.recordDonation(Math.floor(Math.random() * 10000) + 1000, 'Test Donor');
        break;
      case 'volunteer':
        realTimeService.approveVolunteer(3);
        break;
      case 'certificate':
        realTimeService.issueCertificate('Test User', 'Test Program');
        break;
      case 'program':
        realTimeService.addProgram({ name: `Test Program ${Date.now()}`, budget: 50000 });
        break;
      case 'manager':
        realTimeService.addManager({ name: 'Test Manager', email: 'test@example.com' });
        break;
      default:
        realTimeService.triggerDemoActivity();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Real-Time Test Panel</h3>
        <Zap className="w-4 h-4 text-yellow-500" />
      </div>
      
      <div className="space-y-3">
        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Demo Mode</span>
          <button
            onClick={demoMode ? handleStopDemo : handleStartDemo}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
              demoMode 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {demoMode ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{demoMode ? 'Stop' : 'Start'}</span>
          </button>
        </div>

        {/* Manual Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => triggerEvent('donation')}
            className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100"
          >
            <DollarSign className="w-3 h-3" />
            <span>Donation</span>
          </button>
          
          <button
            onClick={() => triggerEvent('volunteer')}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
          >
            <Users className="w-3 h-3" />
            <span>Volunteer</span>
          </button>
          
          <button
            onClick={() => triggerEvent('certificate')}
            className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs hover:bg-yellow-100"
          >
            <Award className="w-3 h-3" />
            <span>Certificate</span>
          </button>
          
          <button
            onClick={() => triggerEvent('program')}
            className="flex items-center space-x-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs hover:bg-purple-100"
          >
            <Target className="w-3 h-3" />
            <span>Program</span>
          </button>
        </div>

        <button
          onClick={() => triggerEvent('random')}
          className="w-full flex items-center justify-center space-x-1 px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs hover:bg-gray-100"
        >
          <Zap className="w-3 h-3" />
          <span>Random Event</span>
        </button>
      </div>
    </div>
  );
};

export default RealTimeTestPanel;
