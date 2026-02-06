import { NICInfo, NICValidationResult } from '@/types';

/**
 * Validates and extracts information from Sri Lankan NIC number
 * Supports both old format (9 digits + letter) and new format (12 digits)
 */
export function validateAndExtractNIC(nicInput: string): NICValidationResult {
  const nic = nicInput.trim().toUpperCase();

  // Check if it's old format (9 digits + V/X)
  const oldFormatRegex = /^(\d{2})(\d{3})(\d{4})([VX])$/;
  const oldMatch = nic.match(oldFormatRegex);

  if (oldMatch) {
    return processOldFormat(oldMatch, nic);
  }

  // Check if it's new format (12 digits)
  const newFormatRegex = /^(\d{4})(\d{3})(\d{4})(\d)$/;
  const newMatch = nic.match(newFormatRegex);

  if (newMatch) {
    return processNewFormat(newMatch, nic);
  }

  return {
    isValid: false,
    error: 'Invalid NIC format. Please enter a valid Sri Lankan NIC number.',
  };
}

/**
 * Process old NIC format (e.g., 911042754V)
 */
function processOldFormat(match: RegExpMatchArray, nic: string): NICValidationResult {
  const [, yearStr, dayStr] = match;
  
  const year = parseInt(yearStr, 10);
  let dayOfYear = parseInt(dayStr, 10);

  // Determine gender and actual day of year
  const isFemale = dayOfYear > 500;
  if (isFemale) {
    dayOfYear -= 500;
  }

  // Validate day of year
  if (dayOfYear < 1 || dayOfYear > 366) {
    return {
      isValid: false,
      error: 'Invalid day of year in NIC number.',
    };
  }

  // Determine full year (assuming 1900s for years >= 00, 2000s otherwise)
  // People born in 1900-1999 would have NICs issued
  const fullYear = year >= 0 && year <= 99 ? (year <= 30 ? 2000 + year : 1900 + year) : year;

  // Calculate date of birth
  const dateOfBirth = getDayOfYear(fullYear, dayOfYear);
  
  if (!dateOfBirth) {
    return {
      isValid: false,
      error: 'Invalid date calculated from NIC number.',
    };
  }

  // Calculate age
  const age = calculateAge(dateOfBirth);

  return {
    isValid: true,
    info: {
      nic,
      dateOfBirth,
      age,
      gender: isFemale ? 'Female' : 'Male',
      format: 'Old',
    },
  };
}

/**
 * Process new NIC format (e.g., 199119202757)
 */
function processNewFormat(match: RegExpMatchArray, nic: string): NICValidationResult {
  const [, yearStr, dayStr] = match;
  
  const year = parseInt(yearStr, 10);
  let dayOfYear = parseInt(dayStr, 10);

  // Determine gender and actual day of year
  const isFemale = dayOfYear > 500;
  if (isFemale) {
    dayOfYear -= 500;
  }

  // Validate day of year
  if (dayOfYear < 1 || dayOfYear > 366) {
    return {
      isValid: false,
      error: 'Invalid day of year in NIC number.',
    };
  }

  // Validate year
  if (year < 1900 || year > new Date().getFullYear()) {
    return {
      isValid: false,
      error: 'Invalid year in NIC number.',
    };
  }

  // Calculate date of birth
  const dateOfBirth = getDayOfYear(year, dayOfYear);
  
  if (!dateOfBirth) {
    return {
      isValid: false,
      error: 'Invalid date calculated from NIC number.',
    };
  }

  // Calculate age
  const age = calculateAge(dateOfBirth);

  return {
    isValid: true,
    info: {
      nic,
      dateOfBirth,
      age,
      gender: isFemale ? 'Female' : 'Male',
      format: 'New',
    },
  };
}

/**
 * Get the date from day of year
 * Day 001 = January 1, Day 032 = February 1, etc.
 * Using local date to avoid timezone conversion issues
 */
function getDayOfYear(year: number, dayOfYear: number): Date | null {
  try {
    let adjustedDay = dayOfYear;

    // Check if it's NOT a leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

    // If it's not a leap year and the day is after Feb 29th (day 60)
    // We subtract 1 to align with JavaScript's 365-day calendar for that year
    if (!isLeapYear && dayOfYear > 60) {
      adjustedDay = dayOfYear - 1;
    }

    // Create date at Jan 1st
    const date = new Date(year, 0, 1);
    // Set the date (using adjustedDay - 1 because setDate is 1-based)
    date.setDate(adjustedDay);
    
    // Safety check
    if (date.getFullYear() !== year) {
      return null;
    }
    
    return date;
  } catch {
    return null;
  }
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}