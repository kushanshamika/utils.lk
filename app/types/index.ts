export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string; // emoji or icon identifier
  category?: string;
  isNew?: boolean;
}

export interface PostalCode {
  code: string;
  name: string;
}

export interface NICInfo {
  nic: string;
  dateOfBirth: Date;
  age: number;
  gender: 'Male' | 'Female';
  format: 'Old' | 'New';
}

export interface NICValidationResult {
  isValid: boolean;
  info?: NICInfo;
  error?: string;
}