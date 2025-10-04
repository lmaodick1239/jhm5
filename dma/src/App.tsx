import { useState } from 'react';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import SubjectInput from './components/SubjectInput';
import ResultsDashboard from './components/ResultsDashboard';
import RequirementsChecker from './components/RequirementsChecker';
import type { SubjectResult, Grade, CSDGrade } from './types';

function App() {
  const [results, setResults] = useState<SubjectResult[] | null>(null);
  const [coreSubjects, setCoreSubjects] = useState<{
    chinese: Grade;
    english: Grade;
    math: Grade;
    csd: CSDGrade;
    electives: Grade[];
  } | null>(null);

  const handleCalculate = (
    subjectResults: SubjectResult[],
    chinese: Grade,
    english: Grade,
    math: Grade,
    csd: CSDGrade,
    electives: Grade[]
  ) => {
    setResults(subjectResults);
    setCoreSubjects({ chinese, english, math, csd, electives });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 shadow-xl">
          <CardHeader className="flex flex-col items-start gap-2 pb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              🎓 DSE Score Calculator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Calculate your HKDSE results and compare with 2024 Hong Kong statistics
            </p>
          </CardHeader>
          <CardBody>
            <Divider className="my-4" />
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Enter your DSE subject results below to see your percentile ranking, 
              Best 5 score, and university entrance eligibility.
            </p>
          </CardBody>
        </Card>

        <SubjectInput onCalculate={handleCalculate} />

        {results && (
          <>
            <ResultsDashboard results={results} />
            
            {coreSubjects && (
              <RequirementsChecker
                chinese={coreSubjects.chinese}
                english={coreSubjects.english}
                math={coreSubjects.math}
                csd={coreSubjects.csd}
                electives={coreSubjects.electives}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
