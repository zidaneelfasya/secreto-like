// Validation utilities for message content and UUIDs

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function sanitizeMessage(message: string): string {
  // Remove null bytes and replacement characters
  return message
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/\uFFFD/g, '') // Remove replacement characters
    .trim();
}

export function validateMessageContent(content: string): { isValid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Message content is required' };
  }

  const sanitized = sanitizeMessage(content);
  
  if (sanitized.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (sanitized.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }

  // Check for suspicious patterns that might indicate malformed JSON
  if (content.includes('\\x') || content.includes('\\u') || content.includes('\\"')) {
    return { isValid: false, error: 'Message contains invalid characters' };
  }

  return { isValid: true };
}

export function validateRecipientId(recipientId: string): { isValid: boolean; error?: string } {
  if (!recipientId || typeof recipientId !== 'string') {
    return { isValid: false, error: 'Recipient ID is required' };
  }

  if (!validateUUID(recipientId)) {
    return { isValid: false, error: 'Invalid recipient ID format' };
  }

  return { isValid: true };
}
