/**
 * Validation and sanitization utilities
 */

/**
 * Sanitize string input by trimming and removing excessive whitespace
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email) {
  const sanitized = sanitizeString(email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email address');
  }
  
  return sanitized;
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone) {
  const sanitized = sanitizeString(phone);
  // Allow international format with +, spaces, dashes, and parentheses
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  
  if (!phoneRegex.test(sanitized)) {
    throw new Error('Invalid phone number format');
  }
  
  return sanitized;
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(dateString) {
  const selectedDate = new Date(dateString);
  const today = new Date();
  
  // Set time to midnight for comparison
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (isNaN(selectedDate.getTime())) {
    throw new Error('Invalid date');
  }
  
  if (selectedDate < today) {
    throw new Error('Date cannot be in the past');
  }
  
  return dateString;
}

/**
 * Validate and sanitize name
 */
export function validateName(name) {
  const sanitized = sanitizeString(name);
  
  if (sanitized.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  
  if (sanitized.length > 100) {
    throw new Error('Name is too long');
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and Unicode characters
  const nameRegex = /^[\p{L}\s\-'\.]+$/u;
  if (!nameRegex.test(sanitized)) {
    throw new Error('Name contains invalid characters');
  }
  
  return sanitized;
}

/**
 * Sanitize and validate notes/message
 */
export function sanitizeNotes(notes) {
  if (!notes) return '';
  
  const sanitized = sanitizeString(notes);
  
  if (sanitized.length > 5000) {
    throw new Error('Notes are too long (maximum 5000 characters)');
  }
  
  return sanitized;
}

/**
 * Validate file upload
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  } = options;
  
  if (!file) return null;
  
  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed types: ' + allowedTypes.map(t => t.split('/')[1]).join(', '));
  }
  
  return file;
}

/**
 * Get minimum date for appointment (today)
 */
export function getMinDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get maximum date for appointment (1 year from now)
 */
export function getMaxDate() {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate.toISOString().split('T')[0];
}
