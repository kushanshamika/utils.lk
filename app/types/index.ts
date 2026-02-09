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

export interface Province {
  id: string;
  name: string;
}

export interface District {
  id: string;
  provinceId: string;
  name: string;
}

export interface DivisionalSecretariat {
  id: string;
  districtId: string;
  name: string;
}

export interface GramaNiladhariDivision {
  id: string;
  divisionalSecretariatId: string;
  name: string;
}

export interface Village {
  id: string;
  gramaNiladhariDivisionId: string;
  name: string;
}

export interface AdministrativeHierarchy {
  village: Village;
  gramaNiladhariDivision: GramaNiladhariDivision;
  divisionalSecretariat: DivisionalSecretariat;
  district: District;
  province: Province;
}