import type { Grade } from '../types';
import { 
  calculatePercentileFromData, 
  getPercentileMessage, 
  getScoreRangeStats,
  totalCandidates,
  qualifiedCandidates
} from './percentileData';

// Re-export percentile utilities for convenience
export { 
  calculatePercentileFromData, 
  getPercentileMessage, 
  getScoreRangeStats,
  totalCandidates,
  qualifiedCandidates
};

/**
 * Convert DSE grade to point value
 * 5** = 7, 5* = 6, 5 = 5, 4 = 4, 3 = 3, 2 = 2, 1 = 1, U = 0
 */
export function gradeToPoints(grade: Grade): number {
  const gradeMap: Record<Grade, number> = {
    '5**': 7,
    '5*': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    '1': 1,
    'U': 0
  };
  return gradeMap[grade];
}

/**
 * Calculate Best 5 subjects from all subjects
 */
export function calculateBest5(subjects: Array<{ name: string; grade: Grade }>): {
  best5: Array<{ name: string; grade: Grade; points: number }>;
  totalPoints: number;
} {
  const subjectsWithPoints = subjects.map(s => ({
    ...s,
    points: gradeToPoints(s.grade)
  }));

  // Sort by points descending and take top 5
  const sorted = [...subjectsWithPoints].sort((a, b) => b.points - a.points);
  const best5 = sorted.slice(0, 5);
  const totalPoints = best5.reduce((sum, s) => sum + s.points, 0);

  return { best5, totalPoints };
}

/**
 * Check if pattern meets 3322+2 (JUPAS minimum)
 * Chinese >= 3, English >= 3, Math >= 2, CSD = Attained, 2 electives >= 2
 */
export function check3322Pattern(
  chinese: Grade,
  english: Grade,
  math: Grade,
  csd: string,
  electives: Grade[]
): boolean {
  const chinesePoints = gradeToPoints(chinese);
  const englishPoints = gradeToPoints(english);
  const mathPoints = gradeToPoints(math);
  const csdMet = csd === 'Attained';

  const electivesLevel2Plus = electives.filter(g => gradeToPoints(g) >= 2).length;

  return (
    chinesePoints >= 3 &&
    englishPoints >= 3 &&
    mathPoints >= 2 &&
    csdMet &&
    electivesLevel2Plus >= 2
  );
}

/**
 * Check if pattern meets 332A
 * Chinese >= 3, English >= 3, Math >= 2, CSD = Attained
 */
export function check332APattern(
  chinese: Grade,
  english: Grade,
  math: Grade,
  csd: string
): boolean {
  const chinesePoints = gradeToPoints(chinese);
  const englishPoints = gradeToPoints(english);
  const mathPoints = gradeToPoints(math);
  const csdMet = csd === 'Attained';

  return (
    chinesePoints >= 3 &&
    englishPoints >= 3 &&
    mathPoints >= 2 &&
    csdMet
  );
}

/**
 * Check if pattern meets 222A (Minimum requirement)
 * Chinese >= 2, English >= 2, Math >= 2, CSD = Attained
 */
export function check222APattern(
  chinese: Grade,
  english: Grade,
  math: Grade,
  csd: string
): boolean {
  const chinesePoints = gradeToPoints(chinese);
  const englishPoints = gradeToPoints(english);
  const mathPoints = gradeToPoints(math);
  const csdMet = csd === 'Attained';

  return (
    chinesePoints >= 2 &&
    englishPoints >= 2 &&
    mathPoints >= 2 &&
    csdMet
  );
}

/**
 * Calculate percentile based on Best 5 score
 * Using table3f data (Best 5 distribution)
 * @param best5Score - Best 5 score (0-35)
 * @param useDaySchool - Whether to use day school data (default) or all candidates
 * @deprecated Use calculatePercentileFromData from percentileData.ts instead
 */
export function calculatePercentile(best5Score: number, useDaySchool: boolean = true): number {
  // Import the new function
  const { calculatePercentileFromData } = require('./percentileData');
  const result = calculatePercentileFromData(best5Score, useDaySchool);
  return result.percentile;
}
