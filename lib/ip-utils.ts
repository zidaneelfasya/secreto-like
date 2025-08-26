import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
  // List of headers to check for client IP (in priority order)
  const ipHeaders = [
    'cf-connecting-ip', // Cloudflare
    'x-forwarded-for', // Most common proxy header
    'x-real-ip', // Nginx proxy
    'x-client-ip', // Another common header
    'x-cluster-client-ip', // Cluster environments
    'x-forwarded', // Less common
    'forwarded-for', // Less common
    'forwarded', // HTTP Forwarded header (RFC 7239)
  ];

  for (const header of ipHeaders) {
    const value = request.headers.get(header);
    if (value) {
      // For x-forwarded-for, there can be multiple IPs separated by commas
      // The first one is usually the original client IP
      const ip = value.split(',')[0].trim();
      
      if (ip && isValidIP(ip)) {
        return cleanIP(ip);
      }
    }
  }

  // Fallback to connection remote address (usually not available in serverless)
  try {
    const connectionIP = (request as unknown as Record<string, unknown>).ip || 
                        ((request as unknown as Record<string, unknown>).connection as Record<string, unknown>)?.remoteAddress;
    if (connectionIP && typeof connectionIP === 'string' && isValidIP(connectionIP)) {
      return cleanIP(connectionIP);
    }
  } catch {
    // Ignore connection IP extraction errors
  }

  return 'unknown';
}

function cleanIP(ip: string): string {
  // Remove IPv6-mapped IPv4 prefix
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  // Handle localhost cases
  if (ip === '::1') {
    return 'localhost (IPv6)';
  }
  if (ip === '127.0.0.1') {
    return 'localhost (IPv4)';
  }

  return ip;
}

function isValidIP(ip: string): boolean {
  // Basic validation for IPv4 and IPv6
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::ffff:[0-9.]+$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function getLocationFromHeaders(request: NextRequest): string {
  // Try to get location from various headers
  const cfCountry = request.headers.get('cf-ipcountry'); // Cloudflare country
  const acceptLanguage = request.headers.get('accept-language');
  // const cfTimezone = request.headers.get('cf-timezone'); // Cloudflare timezone - commented out as unused
  
  if (cfCountry) {
    return cfCountry;
  }
  
  if (acceptLanguage) {
    const lang = acceptLanguage.split(',')[0].split('-');
    if (lang.length > 1) {
      return lang[1].toUpperCase(); // Get country code from language
    }
    return lang[0];
  }
  
  return 'unknown';
}

export function logRequestInfo(request: NextRequest): void {
  console.log('Request Debug Info:', {
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('user-agent'),
    contentType: request.headers.get('content-type'),
    acceptLanguage: request.headers.get('accept-language'),
    forwarded: request.headers.get('x-forwarded-for'),
    realIp: request.headers.get('x-real-ip'),
    cfConnectingIp: request.headers.get('cf-connecting-ip'),
    cfCountry: request.headers.get('cf-ipcountry'),
    headers: Object.fromEntries(request.headers.entries()),
  });
}
