import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Chip, Divider } from '@heroui/react';
import type { Grade, CSDGrade } from '../types';
import { check3322Pattern, check332APattern, check222APattern } from '../utils/calculator';

interface Props {
  chinese: Grade;
  english: Grade;
  math: Grade;
  csd: CSDGrade;
  electives: Grade[];
}

interface Requirement {
  name: string;
  description: string;
  pattern: string;
  met: boolean;
  importance: 'high' | 'medium' | 'low';
}

export default function RequirementsChecker({ chinese, english, math, csd, electives }: Props) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);

  useEffect(() => {
    const reqs: Requirement[] = [
      {
        name: '3322+2 (JUPAS Minimum)',
        description: 'Minimum requirement for most JUPAS programmes',
        pattern: 'Chinese ≥3, English ≥3, Math ≥2, CSD Attained, 2 Electives ≥2',
        met: check3322Pattern(chinese, english, math, csd, electives),
        importance: 'high'
      },
      {
        name: '332A Core Subjects',
        description: 'Core subjects requirement for university admission',
        pattern: 'Chinese ≥3, English ≥3, Math ≥2, CSD Attained',
        met: check332APattern(chinese, english, math, csd),
        importance: 'high'
      },
      {
        name: '222A Minimum Entry',
        description: 'Basic minimum requirement',
        pattern: 'Chinese ≥2, English ≥2, Math ≥2, CSD Attained',
        met: check222APattern(chinese, english, math, csd),
        importance: 'medium'
      }
    ];

    setRequirements(reqs);
  }, [chinese, english, math, csd, electives]);

  const metCount = requirements.filter(r => r.met).length;
  const totalCount = requirements.length;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col items-start gap-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-bold">🎓 University Requirements</h3>
          <Chip 
            color={metCount === totalCount ? 'success' : metCount > 0 ? 'warning' : 'danger'}
            variant="flat"
            size="lg"
          >
            {metCount} / {totalCount} Met
          </Chip>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Check if your results meet common university entrance requirements
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div key={index}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-lg">{req.name}</h4>
                    <Chip
                      color={req.met ? 'success' : 'danger'}
                      variant="flat"
                      size="sm"
                      startContent={req.met ? '✓' : '✗'}
                    >
                      {req.met ? 'Met' : 'Not Met'}
                    </Chip>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {req.description}
                  </p>
                  <p className="text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {req.pattern}
                  </p>
                </div>
              </div>
              {index < requirements.length - 1 && <Divider className="mt-4" />}
            </div>
          ))}
        </div>

        {metCount === totalCount && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              🎉 Congratulations! You meet all the common university entrance requirements!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              You are eligible to apply for most JUPAS programmes.
            </p>
          </div>
        )}

        {metCount === 0 && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 font-medium">
              ⚠️ You don't currently meet the university entrance requirements
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Consider retaking subjects or explore alternative pathways.
            </p>
          </div>
        )}

        {metCount > 0 && metCount < totalCount && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">
              📌 You meet some requirements
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Review the requirements above to see which ones you need to improve.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
