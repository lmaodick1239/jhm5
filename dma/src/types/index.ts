// Grade types
export type Grade = '5**' | '5*' | '5' | '4' | '3' | '2' | '1' | 'U';
export type CSDGrade = 'Attained' | 'Not Attained';

// Subject result
export interface SubjectResult {
  name: string;
  grade: Grade;
  points: number;
}

// Calculator input
export interface CalculatorInput {
  chineseLanguage: Grade;
  englishLanguage: Grade;
  mathematics: Grade;
  citizenshipSD: CSDGrade;
  elective1?: { name: string; grade: Grade };
  elective2?: { name: string; grade: Grade };
  elective3?: { name: string; grade: Grade };
  mathsExtended?: Grade;
}

// Statistics data types
export interface AchievementStats {
  level: string;
  count: number;
  percentage: number;
}

export interface Best5Distribution {
  scoreRange: string;
  count: number;
  percentage: number;
  cumulative: number;
}

export interface UniversityRequirement {
  name: string;
  description: string;
  met: boolean;
  requiredPattern: string;
}

export interface PercentileData {
  overall: number;
  subjectSpecific: { [subject: string]: number };
}

export interface CalculationResult {
  subjects: SubjectResult[];
  best5Score: number;
  best5Subjects: SubjectResult[];
  percentile: PercentileData;
  requirements: UniversityRequirement[];
  totalCandidates: number;
}
