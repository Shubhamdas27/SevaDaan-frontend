import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { businessIntelligenceService } from '../services/businessIntelligenceService';
import { 
  PerformanceScorecard, 
  CompetitiveAnalysis, 
  CostEfficiencyAnalysis, 
  ImpactMeasurement 
} from '../types/businessIntelligence';
import { CheckCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react';

const BusinessIntelligenceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    scorecard: PerformanceScorecard | null;
    competitive: CompetitiveAnalysis | null;
    costAnalysis: CostEfficiencyAnalysis | null;
    impact: ImpactMeasurement | null;
    errors: string[];
  }>({
    scorecard: null,
    competitive: null,
    costAnalysis: null,
    impact: null,
    errors: []
  });
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const errors: string[] = [];
    let scorecard: PerformanceScorecard | null = null;
    let competitive: CompetitiveAnalysis | null = null;
    let costAnalysis: CostEfficiencyAnalysis | null = null;
    let impact: ImpactMeasurement | null = null;

    try {
      // Test Performance Scorecard
      console.log('Testing Performance Scorecard...');
      scorecard = await businessIntelligenceService.generatePerformanceScorecard('ngo', 'quarterly');
      console.log('✅ Performance Scorecard generated successfully');
    } catch (error) {
      const errorMsg = `❌ Performance Scorecard failed: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    try {
      // Test Competitive Analysis
      console.log('Testing Competitive Analysis...');
      competitive = await businessIntelligenceService.getCompetitiveAnalysis('ngo', 'india');
      console.log('✅ Competitive Analysis generated successfully');
    } catch (error) {
      const errorMsg = `❌ Competitive Analysis failed: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    try {
      // Test Cost Efficiency Analysis
      console.log('Testing Cost Efficiency Analysis...');
      costAnalysis = await businessIntelligenceService.analyzeCostEfficiency();
      console.log('✅ Cost Efficiency Analysis generated successfully');
    } catch (error) {
      const errorMsg = `❌ Cost Efficiency Analysis failed: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    try {
      // Test Impact Measurement
      console.log('Testing Impact Measurement...');
      impact = await businessIntelligenceService.measureImpact(['education', 'healthcare', 'environment']);
      console.log('✅ Impact Measurement generated successfully');
    } catch (error) {
      const errorMsg = `❌ Impact Measurement failed: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }

    setTestResults({
      scorecard,
      competitive,
      costAnalysis,
      impact,
      errors
    });
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const renderTestResult = (title: string, data: any, error?: string) => {
    const hasData = data !== null;
    const hasError = error !== undefined;

    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {hasData && !hasError ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              hasData && !hasError ? 'text-green-600' : 'text-red-600'
            }`}>
              {hasData && !hasError ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>
        
        {hasError && (
          <div className="text-sm text-red-700 bg-red-50 p-3 rounded mb-3">
            {error}
          </div>
        )}
        
        {hasData && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(data, null, 2).substring(0, 500)}...
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Intelligence Test Suite</h1>
              <p className="text-gray-600 mt-2">Testing Phase 5 advanced analytics features</p>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
            </button>
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Performance Scorecard', data: testResults.scorecard },
              { label: 'Competitive Analysis', data: testResults.competitive },
              { label: 'Cost Efficiency', data: testResults.costAnalysis },
              { label: 'Impact Measurement', data: testResults.impact }
            ].map((test, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  test.data ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {test.data ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="font-medium text-gray-900">{test.label}</h3>
                <p className={`text-sm ${test.data ? 'text-green-600' : 'text-red-600'}`}>
                  {test.data ? 'Passed' : 'Failed'}
                </p>
              </div>
            ))}
          </div>

          {testResults.errors.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-red-900 mb-2">Error Summary</h3>
              <ul className="space-y-1">
                {testResults.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Detailed Test Results */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Test Results</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderTestResult(
              'Performance Scorecard',
              testResults.scorecard,
              testResults.errors.find(e => e.includes('Performance Scorecard'))
            )}
            
            {renderTestResult(
              'Competitive Analysis',
              testResults.competitive,
              testResults.errors.find(e => e.includes('Competitive Analysis'))
            )}
            
            {renderTestResult(
              'Cost Efficiency Analysis',
              testResults.costAnalysis,
              testResults.errors.find(e => e.includes('Cost Efficiency'))
            )}
            
            {renderTestResult(
              'Impact Measurement',
              testResults.impact,
              testResults.errors.find(e => e.includes('Impact Measurement'))
            )}
          </div>
        </div>

        {/* Sample Data Verification */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Data Verification</h2>
          
          {testResults.scorecard && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Performance Scorecard Sample</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-900">
                    {testResults.scorecard.overallScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-blue-700">Overall Score</div>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-900">
                    {testResults.scorecard.categories.length}
                  </div>
                  <div className="text-sm text-green-700">Categories</div>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-900">
                    {testResults.scorecard.recommendations.length}
                  </div>
                  <div className="text-sm text-purple-700">Recommendations</div>
                </div>
              </div>
            </div>
          )}

          {testResults.competitive && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Competitive Analysis Sample</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-yellow-50 rounded">
                  <div className="text-2xl font-bold text-yellow-900">
                    #{testResults.competitive.organizationRank}
                  </div>
                  <div className="text-sm text-yellow-700">Current Rank</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded">
                  <div className="text-2xl font-bold text-indigo-900">
                    {testResults.competitive.benchmarks.length}
                  </div>
                  <div className="text-sm text-indigo-700">Benchmarks</div>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <div className="text-2xl font-bold text-red-900">
                    {testResults.competitive.improvementAreas.length}
                  </div>
                  <div className="text-sm text-red-700">Improvement Areas</div>
                </div>
              </div>
            </div>
          )}

          {testResults.costAnalysis && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Cost Efficiency Sample</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-900">
                    ₹{testResults.costAnalysis.costPerBeneficiary.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-700">Cost per Beneficiary</div>
                </div>
                <div className="p-3 bg-teal-50 rounded">
                  <div className="text-2xl font-bold text-teal-900">
                    {testResults.costAnalysis.programROI.length}
                  </div>
                  <div className="text-sm text-teal-700">ROI Programs</div>
                </div>
                <div className="p-3 bg-pink-50 rounded">
                  <div className="text-2xl font-bold text-pink-900">
                    {testResults.costAnalysis.resourceUtilization.length}
                  </div>
                  <div className="text-sm text-pink-700">Resources Tracked</div>
                </div>
              </div>
            </div>
          )}

          {testResults.impact && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Impact Measurement Sample</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-emerald-50 rounded">
                  <div className="text-2xl font-bold text-emerald-900">
                    {testResults.impact.socialReturn.ratio.toFixed(1)}:1
                  </div>
                  <div className="text-sm text-emerald-700">SROI Ratio</div>
                </div>
                <div className="p-3 bg-violet-50 rounded">
                  <div className="text-2xl font-bold text-violet-900">
                    {testResults.impact.outcomeMetrics.length}
                  </div>
                  <div className="text-sm text-violet-700">Outcome Metrics</div>
                </div>
                <div className="p-3 bg-cyan-50 rounded">
                  <div className="text-2xl font-bold text-cyan-900">
                    {testResults.impact.longTermImpact.length}
                  </div>
                  <div className="text-sm text-cyan-700">Long-term Indicators</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Implementation Status */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Phase 5 Implementation Status</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">✅ Completed Features</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Business Intelligence Service</li>
                <li>• Performance Scorecard Generation</li>
                <li>• Competitive Analysis Framework</li>
                <li>• Cost Efficiency Tracking</li>
                <li>• Social Impact Measurement</li>
                <li>• Executive Dashboard with Advanced Visualizations</li>
                <li>• Real-time Data Processing</li>
                <li>• Comprehensive KPI Tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">🚀 Phase 5 Capabilities</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Executive-level strategic insights</li>
                <li>• Performance benchmarking against industry standards</li>
                <li>• ROI analysis and cost optimization</li>
                <li>• Social Return on Investment (SROI) calculation</li>
                <li>• Predictive analytics foundation</li>
                <li>• Multi-dimensional data visualization</li>
                <li>• Automated report generation</li>
                <li>• Strategic decision support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BusinessIntelligenceTest;
