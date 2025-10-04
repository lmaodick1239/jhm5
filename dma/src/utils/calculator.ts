import type { Grade } from '../types';

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
 */
export function calculatePercentile(best5Score: number): number {
  // This is a simplified version. In the full implementation,
  // we'll load actual CSV data and calculate precise percentile
  const distributionData = [
    { scoreRange: '35-33', cumulative: 0.7 },
    { scoreRange: '32-30', cumulative: 2.3 },
    { scoreRange: '29-27', cumulative: 5.4 },
    { scoreRange: '26-24', cumulative: 10.6 },
    { scoreRange: '23-21', cumulative: 19.6 },
    { scoreRange: '20-18', cumulative: 31.6 },
    { scoreRange: '17-15', cumulative: 41.5 },
    { scoreRange: '14-12', cumulative: 44.3 }
  ];

  // Find matching range
  for (const range of distributionData) {
    const [max, min] = range.scoreRange.split('-').map(Number);
    if (best5Score >= min && best5Score <= max) {
      return 100 - range.cumulative;
    }
  }

  // Default fallback
  return best5Score > 35 ? 99 : best5Score < 12 ? 1 : 50;
}
