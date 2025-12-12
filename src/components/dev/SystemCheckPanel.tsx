import React, { useState } from 'react';
import { runFrontendCheck } from '../../utils/frontendSystemCheck';
import { useAuth } from '../../context/AuthContext';

interface SystemCheckResult {
  type: 'page' | 'component' | 'api';
  name: string;
  success: boolean;
  message: string;
}

const SystemCheckPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SystemCheckResult[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const { user } = useAuth();

  // Only show for admins and in development
  const isDev = import.meta.env.DEV;
  const isAdmin = user?.role === 'ngo_admin';
  const showCheckPanel = isDev || isAdmin;

  const runCheck = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setResults([]);
    
    try {
      const checkResults = await runFrontendCheck();
      
      const formattedResults: SystemCheckResult[] = [
        ...Object.entries(checkResults.pages).map(([name, result]) => ({
          type: 'page' as const,
          name,
          success: result.success,
          message: result.message
        })),
        ...Object.entries(checkResults.components).map(([name, result]) => ({
          type: 'component' as const,
          name,
          success: result.success,
          message: result.message
        })),
        ...Object.entries(checkResults.apis).map(([name, result]) => ({
          type: 'api' as const,
          name,
          success: result.success,
          message: result.message
        }))
      ];
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Error running system check:', error);
      setResults([{
        type: 'api',
        name: 'System Check',
        success: false,
        message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  if (!showCheckPanel) return null;
  return (
    <>
      {/* Floating button to open panel */}
      <button
        className="fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 hover:scale-110 transition-all duration-200 z-50"
        onClick={() => setShowPanel(true)}
        title="Open System Check Panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </button>

      {/* System check panel */}
      {showPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) setShowPanel(false);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-5/6 max-w-3xl animate-slide-up">
            {/* Panel header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">SevaDaan System Check</h2>
              <button 
                onClick={() => setShowPanel(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close panel"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

              {/* Panel body */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center text-gray-500 my-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="mt-2">Click "Run System Check" to verify your SevaDaan platform</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-medium">Results</h3>
                      <div>
                        <span className="text-green-500 font-medium mr-4">
                          ✅ {results.filter(r => r.success).length} Passed
                        </span>
                        <span className="text-red-500 font-medium">
                          ❌ {results.filter(r => !r.success).length} Failed
                        </span>
                      </div>
                    </div>
                    
                    {/* Group results by type */}
                    {['page', 'component', 'api'].map((type) => {
                      const typeResults = results.filter(r => r.type === type);
                      if (typeResults.length === 0) return null;
                      
                      return (
                        <div key={type} className="mb-6">
                          <h4 className="text-md font-semibold capitalize mb-2">{type}s</h4>                          <div className="bg-gray-50 rounded-lg p-2">                            {typeResults.map((result, idx) => (
                              <div 
                                key={`${result.type}-${result.name}-${idx}`}
                                className={`p-2 mb-1 rounded-md transition-all duration-200 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}
                              >
                                <div className="flex items-start">
                                  <span className="mr-2">{result.success ? '✅' : '❌'}</span>
                                  <div>
                                    <div className="font-medium">{result.name}</div>
                                    <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                                      {result.message}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Panel footer */}
              <div className="bg-gray-100 p-4 flex justify-between">
                <button
                  className={`px-4 py-2 rounded-md ${
                    isRunning 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                  onClick={runCheck}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⟳</span>
                      Running...
                    </>
                  ) : 'Run System Check'}
                </button>
                <button                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPanel(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default SystemCheckPanel;
