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
  Divider
} from '@heroui/react';
import type { SubjectResult } from '../types';
import { calculateBest5, calculatePercentile } from '../utils/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  results: SubjectResult[];
}

export default function ResultsDashboard({ results }: Props) {
  const { best5, totalPoints } = calculateBest5(results.map(r => ({ name: r.name, grade: r.grade })));
  const percentile = calculatePercentile(totalPoints);

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

  return (
    <div className="space-y-6">
      {/* Best 5 Score Card */}
      <Card className="shadow-xl border-2 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-col items-start gap-2 pb-2">
          <h2 className="text-2xl font-bold">🎯 Your Best 5 Score</h2>
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
                color={getPercentileColor(percentile)} 
                size="lg" 
                variant="flat"
                className="text-lg font-bold px-4 py-2"
              >
                Top {(100 - percentile).toFixed(1)}%
              </Chip>
              <p className="text-sm text-gray-500 mt-2">
                Better than {percentile.toFixed(1)}% of candidates
              </p>
            </div>
          </div>

          <Progress
            value={percentile}
            color={getPercentileColor(percentile)}
            size="lg"
            className="mb-4"
            showValueLabel={true}
            label="Your Percentile Rank"
          />
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
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">42,909</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Candidates
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (Taking 5+ Category A/B subjects)
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {percentile > 70 ? '🌟' : percentile > 50 ? '👍' : '💪'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Your Performance
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {percentile >= 90 ? 'Outstanding!' : percentile >= 70 ? 'Excellent!' : percentile >= 50 ? 'Good!' : 'Keep improving!'}
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
