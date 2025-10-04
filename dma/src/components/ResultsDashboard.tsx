import { 
  Card, 
  CardHeader, 
  CardBody, 
  Progress, 
  Chip, 
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch
} from '@heroui/react';
import type { SubjectResult } from '../types';
import { 
  calculateBest5, 
  calculatePercentileFromData, 
  getPercentileMessage,
  getScoreRangeStats,
  totalCandidates,
  qualifiedCandidates
} from '../utils/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface Props {
  results: SubjectResult[];
}

export default function ResultsDashboard({ results }: Props) {
  const [useDaySchool, setUseDaySchool] = useState(true);
  
  const { best5, totalPoints } = calculateBest5(results.map(r => ({ name: r.name, grade: r.grade })));
  const percentileData = calculatePercentileFromData(totalPoints, useDaySchool);
  const percentileMessage = getPercentileMessage(percentileData.percentile);
  const scoreRangeStats = getScoreRangeStats(totalPoints, useDaySchool);

  // Prepare chart data
  const chartData = best5.map(subject => ({
    name: subject.name.length > 15 ? subject.name.substring(0, 15) + '...' : subject.name,
    points: subject.points,
    grade: subject.grade
  }));

  // Determine percentile color
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return 'success';
    if (percentile >= 70) return 'primary';
    if (percentile >= 50) return 'warning';
    return 'danger';
  };

  const candidateType = useDaySchool ? 'Day School' : 'All';
  const totalSat = useDaySchool ? totalCandidates.daySchool : totalCandidates.allCandidates;
  const totalQualified = useDaySchool ? qualifiedCandidates.daySchool : qualifiedCandidates.allCandidates;

  return (
    <div className="space-y-6">
      {/* Best 5 Score Card */}
      <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-col items-start gap-2 pb-2">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold">🎯 Your Best 5 Score</h2>
            <Switch
              isSelected={useDaySchool}
              onValueChange={setUseDaySchool}
              size="sm"
            >
              <span className="text-sm">
                {useDaySchool ? 'Day School' : 'All Candidates'}
              </span>
            </Switch>
          </div>
          <p className="text-xs text-gray-500">
            Comparing against {candidateType} candidates who achieved (332A)22 or above
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalPoints}
              </p>
              <p className="text-sm text-gray-500 mt-1">out of 35 points</p>
            </div>
            <div className="text-right">
              <Chip 
                color={getPercentileColor(percentileData.percentile)} 
                size="lg" 
                variant="flat"
                className="text-lg font-bold px-4 py-2"
              >
                Top {(100 - percentileData.percentile).toFixed(1)}%
              </Chip>
              <p className="text-sm text-gray-500 mt-2">
                Better than {percentileData.percentile.toFixed(1)}% of qualified candidates
              </p>
            </div>
          </div>

          <Progress
            value={percentileData.percentile}
            color={getPercentileColor(percentileData.percentile)}
            size="lg"
            className="mb-4"
            showValueLabel={true}
            label="Your Percentile Rank"
          />

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Students You Beat</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {percentileData.studentsBelow.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                out of {percentileData.totalStudents.toLocaleString()} qualified
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Score Range</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                {percentileData.scoreRange}
              </p>
              {scoreRangeStats && (
                <p className="text-xs text-gray-500 mt-1">
                  {scoreRangeStats.studentsInRange.toLocaleString()} students in this range
                </p>
              )}
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Performance</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {percentileMessage.emoji}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {percentileMessage.message}
              </p>
            </div>
          </div>

          {/* Additional Context */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              📊 <strong>{totalQualified.toLocaleString()}</strong> out of <strong>{totalSat.toLocaleString()}</strong> {candidateType.toLowerCase()} candidates achieved (332A)22 or above in 2024 HKDSE.
              {percentileData.studentsAbove > 0 && (
                <> Only <strong>{percentileData.studentsAbove.toLocaleString()}</strong> students scored higher than you.</>
              )}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Best 5 Subjects Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <h3 className="text-xl font-bold">📊 Best 5 Subjects Breakdown</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p className="text-blue-600">Grade: {payload[0].payload.grade}</p>
                        <p>Points: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="points" fill="#0070f3" name="Points" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* All Subjects Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <h3 className="text-xl font-bold">📋 All Your Subjects</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Subject results table">
            <TableHeader>
              <TableColumn>SUBJECT</TableColumn>
              <TableColumn>GRADE</TableColumn>
              <TableColumn>POINTS</TableColumn>
              <TableColumn>BEST 5</TableColumn>
            </TableHeader>
            <TableBody>
              {results.map((subject, index) => {
                const isInBest5 = best5.some(b => b.name === subject.name);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>
                      <Chip 
                        color={subject.points >= 5 ? 'success' : subject.points >= 3 ? 'primary' : 'default'}
                        variant="flat"
                      >
                        {subject.grade}
                      </Chip>
                    </TableCell>
                    <TableCell className="font-bold">{subject.points}</TableCell>
                    <TableCell>
                      {isInBest5 && (
                        <Chip color="success" variant="dot" size="sm">
                          ✓ Included
                        </Chip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Statistics Comparison */}
      <Card className="shadow-lg">
        <CardHeader>
          <h3 className="text-xl font-bold">📈 2024 HKDSE Statistics Comparison</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{totalQualified.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Qualified Candidates
              </p>
              <p className="text-xs text-gray-500 mt-2">
                ({candidateType}) achieved (332A)22+
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {percentileMessage.emoji}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your Performance
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {percentileMessage.message}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                {(totalPoints / 35 * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Score Achievement
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Of maximum possible score
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
