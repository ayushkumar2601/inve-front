import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiTests = [
    {
      name: 'Health Check',
      test: () => apiService.healthCheck(),
      description: 'Basic backend connectivity'
    },
    {
      name: 'Products Endpoint',
      test: () => apiService.getProducts(),
      description: 'Products API endpoint'
    },
    {
      name: 'Suppliers Endpoint',
      test: () => apiService.getSuppliers(),
      description: 'Suppliers API endpoint'
    },
    {
      name: 'Orders Endpoint',
      test: () => apiService.getPurchaseOrders(),
      description: 'Purchase orders API endpoint'
    },
    {
      name: 'Alerts Endpoint',
      test: () => apiService.getAlerts(),
      description: 'Alerts API endpoint'
    }
  ];

  const runTests = async () => {
    setIsLoading(true);
    const results = [];

    for (const apiTest of apiTests) {
      try {
        const startTime = performance.now();
        const response = await apiTest.test();
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        results.push({
          name: apiTest.name,
          description: apiTest.description,
          status: 'success',
          responseTime,
          response: response,
          error: null
        });
      } catch (error) {
        results.push({
          name: apiTest.name,
          description: apiTest.description,
          status: 'error',
          responseTime: null,
          response: null,
          error: error.message
        });
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Backend API Connection Test
          {isLoading && <Loader className="h-5 w-5 animate-spin" />}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test the connection between frontend and backend services
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Tests...' : 'Run API Tests'}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  {result.responseTime && (
                    <span className="text-sm text-gray-500">
                      {result.responseTime}ms
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{result.description}</p>
                
                {result.error && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-red-800 text-sm font-medium">Error:</p>
                    <p className="text-red-700 text-sm">{result.error}</p>
                  </div>
                )}
                
                {result.response && (
                  <div className="bg-gray-50 border rounded p-2">
                    <p className="text-gray-800 text-sm font-medium">Response:</p>
                    <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                      {JSON.stringify(result.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTestComponent; 