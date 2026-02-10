import { School } from '@/types/school';
import schoolsData from '@/data/schools.json';

// Type assertion
const schools = schoolsData as School[];

/**
 * Search schools by name or address
 */
export function searchSchools(searchTerm: string, limit = 50): School[] {
  if (!searchTerm.trim()) {
    return [];
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return schools
    .filter((school) => 
      school.school_name.toLowerCase().includes(lowerSearchTerm) ||
      school.school_address.toLowerCase().includes(lowerSearchTerm) ||
      school.census_no.includes(searchTerm)
    )
    .slice(0, limit);
}

/**
 * Get school by census number
 */
export function getSchoolByCensusNo(censusNo: string): School | null {
  return schools.find(school => school.census_no === censusNo) || null;
}

/**
 * Get total count of schools
 */
export function getSchoolCount(): number {
  return schools.length;
}

/**
 * Get all schools (use with caution for large datasets)
 */
export function getAllSchools(): School[] {
  return schools;
}