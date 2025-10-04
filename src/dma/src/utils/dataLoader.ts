import Papa from 'papaparse';

export interface CSVRow {
  [key: string]: string;
}

/**
 * Load and parse a CSV file from the data directory
 */
export async function loadCSV(filename: string): Promise<CSVRow[]> {
  try {
    const response = await fetch(`/data/${filename}`);
    const csvText = await response.text();
    
    const result = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for now
      transformHeader: (header) => header.trim()
    });

    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
    }

    return result.data;
  } catch (error) {
    console.error(`Error loading CSV file ${filename}:`, error);
    return [];
  }
}

/**
 * Load Best 5 distribution data (table3f)
 */
export async function loadBest5Distribution() {
  const data = await loadCSV('2024_HKDSE_results_statistics_table3f_en.csv');
  
  return data.map(row => ({
    scoreRange: row['Description'] || '',
    dayCandidates: parseInt(row['Day School Candidates - No.'] || '0'),
    dayCumulative: parseFloat(row['Day School Candidates - Cumulative total'] || '0'),
    allCandidates: parseInt(row['All Candidates - No.'] || '0'),
    allCumulative: parseFloat(row['All Candidates - Cumulative total'] || '0')
  }));
}

/**
 * Load achievement level statistics (table3b)
 */
export async function loadAchievementStats() {
  const data = await loadCSV('2024_HKDSE_results_statistics_table3b_en.csv');
  
  return data.map(row => ({
    description: row['Description'] || '',
    type: row['Type'] || '',
    dayMale: parseInt(row['Day school candidates taking at least five Category A / B subjects - Male'] || '0'),
    dayFemale: parseInt(row['Day school candidates taking at least five Category A / B subjects - Female'] || '0'),
    dayTotal: parseInt(row['Day school candidates taking at least five Category A / B subjects - Total'] || '0'),
    allMale: parseInt(row['All candidates taking at least five Category A / B subjects - Male'] || '0'),
    allFemale: parseInt(row['All candidates taking at least five Category A / B subjects - Female'] || '0'),
    allTotal: parseInt(row['All candidates taking at least five Category A / B subjects - Total'] || '0')
  }));
}

/**
 * Load general statistics (table3a)
 */
export async function loadGeneralStats() {
  const data = await loadCSV('2024_HKDSE_results_statistics_table3a_en.csv');
  
  return data.map(row => ({
    description: row['Description'] || '',
    type: row['Type'] || '',
    dayMale: row['Day school candidates taking at least five Category A / B subjects - Male'] || '0',
    dayFemale: row['Day school candidates taking at least five Category A / B subjects - Female'] || '0',
    dayTotal: row['Day school candidates taking at least five Category A / B subjects - Total'] || '0',
    allMale: row['All candidates taking at least five Category A / B subjects - Male'] || '0',
    allFemale: row['All candidates taking at least five Category A / B subjects - Female'] || '0',
    allTotal: row['All candidates taking at least five Category A / B subjects - Total'] || '0'
  }));
}

/**
 * Load Chinese-English attainment correlation (table3h for day school)
 */
export async function loadChineseEnglishCorrelation() {
  const data = await loadCSV('2024_HKDSE_results_statistics_table3h_en.csv');
  
  // Skip header rows and process the grade distribution
  return data.filter(row => row['Attainment in Chinese Language'] && 
                             row['Attainment in Chinese Language'] !== 'Total' &&
                             row['Type'] === 'Number');
}

/**
 * Calculate precise percentile from Best 5 distribution data
 */
export function calculatePrecisePercentile(best5Score: number, distributionData: any[]): number {
  // Find the matching score range
  for (const row of distributionData) {
    const desc = row.scoreRange;
    
    // Parse score ranges like "35/34/33" or "32/31/30"
    if (desc.includes('/')) {
      const scores = desc.split('/').map((s: string) => parseInt(s.trim()));
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      
      if (best5Score >= minScore && best5Score <= maxScore) {
        // Use cumulative percentage - higher cumulative means lower percentile rank
        return 100 - row.allCumulative;
      }
    }
    
    // Parse score ranges like "26-24" or "20-18"
    if (desc.includes('-')) {
      const [maxStr, minStr] = desc.split('-');
      const maxScore = parseInt(maxStr.trim());
      const minScore = parseInt(minStr.trim());
      
      if (best5Score >= minScore && best5Score <= maxScore) {
        return 100 - row.allCumulative;
      }
    }
  }
  
  // Fallback
  if (best5Score >= 35) return 99;
  if (best5Score <= 12) return 10;
  return 50;
}
