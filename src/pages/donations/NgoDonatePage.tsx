import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DonationForm from '../../components/donations/DonationForm';
import { Card } from '../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';

// Define types
interface NGO {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  mission?: string;
  vision?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  totalDonations?: number;
  donorCount?: number;
  totalAmount?: number;
}

interface Program {
  id: string;
  title: string;
  description: string;
  image?: string;
  goalAmount?: number;
  collectedAmount?: number;
  status: 'active' | 'upcoming' | 'completed';
  startDate?: string;
  endDate?: string;
}

const NgoDonatePage: React.FC = () => {
  const { ngoId } = useParams<{ ngoId: string }>();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [selectedProgram, setSelectedProgram] = useState<string>('general');
  
  // Fetch NGO data
  useEffect(() => {
    const fetchNgoData = async () => {
      try {
        // Fetch NGO details
        const ngoResponse = await axios.get(`/api/v1/ngos/${ngoId}`);
        setNgo(ngoResponse.data);
        
        // Fetch active programs
        const programsResponse = await axios.get(`/api/v1/programs?ngoId=${ngoId}&status=active`);
        setPrograms(programsResponse.data.data);
          // Fetch donation statistics
        const statsResponse = await axios.get(`/api/v1/donations/stats/${ngoId}`);
        setNgo(prev => prev ? {...prev, ...statsResponse.data} : null);
      } catch (error) {
        console.error('Error fetching NGO data:', error);
        toast.error('Failed to load NGO information');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (ngoId) {
      fetchNgoData();
    }
  }, [ngoId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!ngo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">NGO not found</h2>
        <p className="mt-2">The NGO you're looking for does not exist or has been removed.</p>
      </div>
    );
  }
  
  // Find the selected program
  const selectedProgramData = programs.find(p => p.id === selectedProgram);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* NGO Header */}
      <div className="mb-8">
        <div className="relative h-48 overflow-hidden rounded-lg mb-6">
          {ngo.coverImage ? (
            <img 
              src={ngo.coverImage} 
              alt={ngo.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
          )}
          
          <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/70 to-transparent w-full">
            <div className="flex items-center">
              {ngo.logo && (
                <img 
                  src={ngo.logo} 
                  alt={ngo.name} 
                  className="w-16 h-16 rounded-full border-2 border-white mr-4 object-cover"
                />
              )}
              <h1 className="text-3xl font-bold text-white">{ngo.name}</h1>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Card className="p-4 flex-1 text-center">
            <p className="text-sm text-gray-500">Total Donations</p>
            <p className="text-2xl font-bold">{ngo.totalDonations || 0}</p>
          </Card>
          <Card className="p-4 flex-1 text-center">
            <p className="text-sm text-gray-500">Donors</p>
            <p className="text-2xl font-bold">{ngo.donorCount || 0}</p>
          </Card>
          <Card className="p-4 flex-1 text-center">
            <p className="text-sm text-gray-500">Amount Raised</p>
            <p className="text-2xl font-bold">₹{ngo.totalAmount?.toLocaleString() || 0}</p>
          </Card>
        </div>
      </div>
      
      {/* Donation Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Make a Donation</h2>
          
          {programs.length > 0 ? (
            <Tabs defaultValue="general" value={selectedProgram} onValueChange={setSelectedProgram}>
              <TabsList className="w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                {programs.map(program => (
                  <TabsTrigger key={program.id} value={program.id}>
                    {program.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="general">
                <Card className="p-4">
                  <p className="text-gray-700">{ngo.description}</p>
                </Card>
              </TabsContent>
              
              {programs.map(program => (
                <TabsContent key={program.id} value={program.id}>
                  <Card className="p-4">
                    {program.image && (
                      <img 
                        src={program.image} 
                        alt={program.title} 
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                    <p className="text-gray-700 mb-3">{program.description}</p>
                      {program.goalAmount && (
                      <>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>
                              {Math.round(
                                (program.collectedAmount || 0) / (program.goalAmount || 1) * 100
                              )}%
                            </span>                          </div>                          <div className="bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              // Dynamic width needed for progress bar
                              // eslint-disable-next-line
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round(
                                    (program.collectedAmount || 0) / (program.goalAmount || 1) * 100
                                  )
                                )}%`
                              } as React.CSSProperties}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-gray-500">
                          <span>₹{program.collectedAmount?.toLocaleString() || 0} raised</span>
                          <span>
                            Goal: ₹
                            {(program.goalAmount !== undefined
                              ? program.goalAmount.toLocaleString()
                              : '0')}
                          </span>
                        </div>
                      </>
                    )}
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card className="p-4">
              <p className="text-gray-700">{ngo.description}</p>
            </Card>
          )}
        </div>
        
        <div>
          <DonationForm 
            ngoId={ngo.id} 
            ngoName={ngo.name}
            programId={selectedProgram === 'general' ? undefined : selectedProgram}
            programName={selectedProgramData?.title}
          />
        </div>
      </div>
    </div>
  );
};

export default NgoDonatePage;
