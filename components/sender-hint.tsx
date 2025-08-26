'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Globe, Monitor, MapPin } from 'lucide-react';
import { Message } from '@/lib/services/client';
import { UAParser } from 'ua-parser-js';

interface SenderHintProps {
  message: Message;
}

export default function SenderHint({ message }: SenderHintProps) {
  const [showHint, setShowHint] = useState(false);

  const parseUserAgent = (userAgent: string | null) => {
    if (!userAgent) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
    
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    const browser = result.browser.name || 'Unknown';
    const os = result.os.name || 'Unknown';
    const deviceType = result.device.type || 'desktop';
    const device = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
    
    return { browser, os, device };
  };

  const { browser, os, device } = parseUserAgent(message.sender_user_agent);

  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowHint(!showHint)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        <Info className="h-3 w-3 mr-1" />
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </Button>
      
      {showHint && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" />
              Sender Information
            </CardTitle>
            <CardDescription className="text-xs">
              Information about the device and location of the sender
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Monitor className="h-3 w-3 text-blue-500" />
                <span className="font-medium">Device:</span>
                <Badge variant="outline" className="text-xs">
                  {device} • {os} • {browser}
                </Badge>
              </div>
              
              {message.sender_ip && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-green-500" />
                  <span className="font-medium">IP:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {message.sender_ip}
                  </code>
                </div>
              )}
              
              {/* {message.sender_location && message.sender_location !== 'unknown' && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-orange-500" />
                  <span className="font-medium">Location:</span>
                  <Badge variant="outline" className="text-xs">
                    {message.sender_location}
                  </Badge>
                </div>
              )} */}
            </div>
            
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>* This information is collected for security and moderation purposes.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
