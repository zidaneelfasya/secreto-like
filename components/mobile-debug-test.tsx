'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function MobileDebugTest() {
  const [message, setMessage] = useState('Test message from mobile');
  const [recipientId, setRecipientId] = useState('test-recipient-id');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log(`Testing ${endpoint}...`);
      
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          recipientId,
          content: message,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        responseData = {
          error: 'Failed to parse JSON',
          rawResponse: responseText,
          parseError: parseError instanceof Error ? parseError.message : 'Unknown parse error'
        };
      }

      setResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        rawResponse: responseText,
      });
      
    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mobile Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Message:</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter test message"
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Recipient ID:</label>
          <input
            type="text"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="Enter recipient ID"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={() => testEndpoint('mobile-debug')} 
            disabled={isLoading}
            className="w-full"
          >
            Test Mobile Debug Endpoint
          </Button>
          
          <Button 
            onClick={() => testEndpoint('send-message')} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            Test Send Message Endpoint
          </Button>
        </div>

        {result && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
