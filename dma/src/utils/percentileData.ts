/**
 * Percentile data loader for HKDSE Best 5 score distribution
 * Data source: table3f_en.csv (2024 HKDSE results)
 */

export interface Best5Distribution {
  scoreRange: string;
  minScore: number;
  maxScore: number;
  daySchoolCount: number;
  daySchoolCumulative: number;
  daySchoolPercentage: number;
  allCandidatesCount: number;
  allCandidatesCumulative: number;
  allCandidatesPercentage: number;
}

/**
 * Parsed data from table3f_en.csv
 * Based on 2024 HKDSE official statistics
 */
export const best5DistributionData: Best5Distribution[] = [
  {
    scoreRange: '35/34/33',
    minScore: 33,
    maxScore: 35,
    daySchoolCount: 283,
    daySchoolCumulative: 283,
    daySchoolPercentage: 0.7,
    allCandidatesCount: 296,
    allCandidatesCumulative: 296,
    allCandidatesPercentage: 0.6
  },
  {
    scoreRange: '32/31/30',
    minScore: 30,
    maxScore: 32,
    daySchoolCount: 643,
    daySchoolCumulative: 926,
    daySchoolPercentage: 1.6,
    allCandidatesCount: 671,
    allCandidatesCumulative: 967,
    allCandidatesPercentage: 1.4
  },
  {
    scoreRange: '29/28/27',
    minScore: 27,
    maxScore: 29,
    daySchoolCount: 1253,
    daySchoolCumulative: 2179,
    daySchoolPercentage: 3.1,
    allCandidatesCount: 1306,
    allCandidatesCumulative: 2273,
    allCandidatesPercentage: 2.7
  },
  {
    scoreRange: '26/25/24',
    minScore: 24,
    maxScore: 26,
    daySchoolCount: 2138,
    daySchoolCumulative: 4317,
    daySchoolPercentage: 5.3,
    allCandidatesCount: 2256,
    allCandidatesCumulative: 4529,
    allCandidatesPercentage: 4.6
  },
  {
    scoreRange: '23/22/21',
    minScore: 21,
    maxScore: 23,
    daySchoolCount: 3648,
    daySchoolCumulative: 7965,
    daySchoolPercentage: 9.0,
    allCandidatesCount: 3801,
    allCandidatesCumulative: 8330,
    allCandidatesPercentage: 7.8
  },
  {
    scoreRange: '20/19/18',
    minScore: 18,
    maxScore: 20,
    daySchoolCount: 4887,
    daySchoolCumulative: 12852,
    daySchoolPercentage: 12.0,
    allCandidatesCount: 5109,
    allCandidatesCumulative: 13439,
    allCandidatesPercentage: 10.4
  },
  {
    scoreRange: '17/16/15',
    minScore: 15,
    maxScore: 17,
    daySchoolCount: 4011,
    daySchoolCumulative: 16863,
    daySchoolPercentage: 9.9,
    allCandidatesCount: 4187,
    allCandidatesCumulative: 17626,
    allCandidatesPercentage: 8.5
  },
  {
    scoreRange: '14/13/12',
    minScore: 12,
    maxScore: 14,
    daySchoolCount: 1164,
    daySchoolCumulative: 18027,
    daySchoolPercentage: 2.9,
    allCandidatesCount: 1224,
    allCandidatesCumulative: 18850,
    allCandidatesPercentage: 2.5
  }
];

/**
 * Total candidates who sat for the exam
 */
export const totalCandidates = {
  daySchool: 40666,
  allCandidates: 49026
};

/**
 * Total candidates who achieved (332A)22 or above
 * This is the denominator for percentile calculations
 */
export const qualifiedCandidates = {
  daySchool: 18027,
  allCandidates: 18850
};

/**
 * Calculate percentile for a given Best 5 score
 * @param score - Best 5 score (0-35)
 * @param useDaySchool - Whether to use day school data (default) or all candidates
 * @returns Percentile (0-100) - percentage of students you scored better than
 */
export function calculatePercentileFromData(
  score: number,
  useDaySchool: boolean = true
): {
  percentile: number;
  totalStudents: number;
  studentsBelow: number;
  studentsAbove: number;
  scoreRange: string;
} {
  // Handle edge cases
  if (score < 0) score = 0;
  if (score > 35) score = 35;

  const data = useDaySchool ? 'daySchool' : 'allCandidates';
  const total = qualifiedCandidates[data];
  
  // Find the score range this score falls into
  let studentsAtOrAbove = 0;
  let matchedRange = '';
  let foundRange = false;

  for (const range of best5DistributionData) {
    if (score >= range.minScore && score <= range.maxScore) {
      studentsAtOrAbove = useDaySchool ? range.daySchoolCumulative : range.allCandidatesCumulative;
      matchedRange = range.scoreRange;
      foundRange = true;
      break;
    }
  }

  // If score is below 12 (lowest tracked range)
  if (!foundRange && score < 12) {
    studentsAtOrAbove = total;
    matchedRange = 'Below 12';
  }

  // If score is above 35 (highest possible)
  if (!foundRange && score > 35) {
    studentsAtOrAbove = 0;
    matchedRange = '35';
  }

  const studentsBelow = total - studentsAtOrAbove;
  const percentile = (studentsBelow / total) * 100;

  return {
    percentile: Math.max(0, Math.min(100, percentile)),
    totalStudents: total,
    studentsBelow,
    studentsAbove: studentsAtOrAbove,
    scoreRange: matchedRange
  };
}

/**
 * Get detailed statistics for a score range
 */
export function getScoreRangeStats(score: number, useDaySchool: boolean = true) {
  const range = best5DistributionData.find(
    r => score >= r.minScore && score <= r.maxScore
  );

  if (!range) {
    return null;
  }

  return {
    scoreRange: range.scoreRange,
    studentsInRange: useDaySchool ? range.daySchoolCount : range.allCandidatesCount,
    percentageInRange: useDaySchool ? range.daySchoolPercentage : range.allCandidatesPercentage,
    cumulativeCount: useDaySchool ? range.daySchoolCumulative : range.allCandidatesCumulative,
    cumulativePercentage: (useDaySchool ? range.daySchoolCumulative : range.allCandidatesCumulative) / 
                          (useDaySchool ? qualifiedCandidates.daySchool : qualifiedCandidates.allCandidates) * 100
  };
}

/**
 * Get comparison message based on percentile
 */
export function getPercentileMessage(percentile: number): {
  message: string;
  emoji: string;
  color: 'success' | 'primary' | 'warning' | 'danger';
} {
  if (percentile >= 95) {
    return {
      message: 'Outstanding! Top 5% of all candidates!',
      emoji: '🌟',
      color: 'success'
    };
  } else if (percentile >= 90) {
    return {
      message: 'Excellent! Top 10% of all candidates!',
      emoji: '⭐',
      color: 'success'
    };
  } else if (percentile >= 75) {
    return {
      message: 'Very Good! Top quartile performance!',
      emoji: '🎯',
      color: 'primary'
    };
  } else if (percentile >= 50) {
    return {
      message: 'Good! Above average performance!',
      emoji: '👍',
      color: 'primary'
    };
  } else if (percentile >= 25) {
    return {
      message: 'Fair. Room for improvement.',
      emoji: '📚',
      color: 'warning'
    };
  } else {
    return {
      message: 'Keep working hard! You can improve!',
      emoji: '💪',
      color: 'warning'
    };
  }
}
