import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Select, 
  SelectItem, 
  Checkbox, 
  Button,
  Divider
} from '@heroui/react';
import type { Grade, CSDGrade, SubjectResult } from '../types';
import { gradeToPoints } from '../utils/calculator';

const GRADES: Grade[] = ['5**', '5*', '5', '4', '3', '2', '1', 'U'];

// HKDSE Category A Elective Subjects (Official list from HKEAA)
const CATEGORY_A_SUBJECTS = [
  // Arts & Humanities
  'Chinese Literature',
  'Literature in English',
  'Chinese History',
  'History',
  'Geography',
  'Economics',
  'Ethics and Religious Studies',
  
  // Sciences
  'Biology',
  'Chemistry',
  'Physics',
  
  // Business & Technology
  'Business, Accounting and Financial Studies',
  'Information and Communication Technology',
  'Technology and Living',
  'Design and Applied Technology',
  'Health Management and Social Care',
  
  // Mathematics Extended Parts
  'Mathematics Extended Part Module 1 (Calculus and Statistics)',
  'Mathematics Extended Part Module 2 (Algebra and Calculus)',
  
  // Arts & PE
  'Visual Arts',
  'Music',
  'Physical Education',
  
  // Tourism
  'Tourism and Hospitality Studies'
];

// HKDSE Category B - Applied Learning Subjects
// Note: There are 80+ Applied Learning courses. Users should select "Applied Learning" as a general category.
const CATEGORY_B_SUBJECTS = [
  'Applied Learning (Various courses)',
];

// HKDSE Category C - Other Language Subjects (2026 onwards - official list)
const CATEGORY_C_SUBJECTS = [
  'French',
  'German',
  'Japanese',
  'Korean',
  'Spanish',
  'Urdu'
];

const ALL_ELECTIVE_SUBJECTS = [
  ...CATEGORY_A_SUBJECTS,
  ...CATEGORY_B_SUBJECTS,
  ...CATEGORY_C_SUBJECTS
].sort();

interface Props {
  onCalculate: (
    results: SubjectResult[],
    chinese: Grade,
    english: Grade,
    math: Grade,
    csd: CSDGrade,
    electives: Grade[]
  ) => void;
}

export default function SubjectInput({ onCalculate }: Props) {
  const [chinese, setChinese] = useState<Grade>('3');
  const [english, setEnglish] = useState<Grade>('3');
  const [math, setMath] = useState<Grade>('2');
  const [csd, setCsd] = useState<CSDGrade>('Attained');
  
  const [elective1Name, setElective1Name] = useState<string>('Biology');
  const [elective1Grade, setElective1Grade] = useState<Grade>('3');
  
  const [elective2Name, setElective2Name] = useState<string>('Chemistry');
  const [elective2Grade, setElective2Grade] = useState<Grade>('3');
  
  const [elective3Name, setElective3Name] = useState<string>('Physics');
  const [elective3Grade, setElective3Grade] = useState<Grade>('2');
  
  const [hasElective2, setHasElective2] = useState(true);
  const [hasElective3, setHasElective3] = useState(true);

  const handleCalculate = () => {
    const subjects: SubjectResult[] = [
      { name: 'Chinese Language', grade: chinese, points: gradeToPoints(chinese) },
      { name: 'English Language', grade: english, points: gradeToPoints(english) },
      { name: 'Mathematics', grade: math, points: gradeToPoints(math) },
      { name: elective1Name, grade: elective1Grade, points: gradeToPoints(elective1Grade) }
    ];

    const electiveGrades: Grade[] = [elective1Grade];

    if (hasElective2) {
      subjects.push({ 
        name: elective2Name, 
        grade: elective2Grade, 
        points: gradeToPoints(elective2Grade) 
      });
      electiveGrades.push(elective2Grade);
    }

    if (hasElective3) {
      subjects.push({ 
        name: elective3Name, 
        grade: elective3Grade, 
        points: gradeToPoints(elective3Grade) 
      });
      electiveGrades.push(elective3Grade);
    }

    onCalculate(subjects, chinese, english, math, csd, electiveGrades);
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <h2 className="text-2xl font-bold">📝 Enter Your DSE Results</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {/* Core Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
              Core Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Chinese Language"
                placeholder="Select grade"
                selectedKeys={[chinese]}
                onChange={(e) => setChinese(e.target.value as Grade)}
                className="max-w-full"
                variant="bordered"
                color="primary"
              >
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="English Language"
                placeholder="Select grade"
                selectedKeys={[english]}
                onChange={(e) => setEnglish(e.target.value as Grade)}
                className="max-w-full"
                variant="bordered"
                color="primary"
              >
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Mathematics"
                placeholder="Select grade"
                selectedKeys={[math]}
                onChange={(e) => setMath(e.target.value as Grade)}
                className="max-w-full"
                variant="bordered"
                color="primary"
              >
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="mt-4">
              <Checkbox
                isSelected={csd === 'Attained'}
                onValueChange={(checked) => setCsd(checked ? 'Attained' : 'Not Attained')}
                color="success"
              >
                Citizenship and Social Development - Attained
              </Checkbox>
            </div>
          </div>

          <Divider />

          {/* Elective Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
              Elective Subjects
            </h3>
            
            {/* Elective 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Elective 1 Subject"
                placeholder="Select subject"
                selectedKeys={[elective1Name]}
                onChange={(e) => setElective1Name(e.target.value)}
                variant="bordered"
                color="success"
                description="Choose your first elective subject"
              >
                {ALL_ELECTIVE_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Elective 1 Grade"
                placeholder="Select grade"
                selectedKeys={[elective1Grade]}
                onChange={(e) => setElective1Grade(e.target.value as Grade)}
                variant="bordered"
                color="success"
              >
                {GRADES.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Elective 2 */}
            <Checkbox
              isSelected={hasElective2}
              onValueChange={setHasElective2}
              className="mb-2"
            >
              Add Elective 2
            </Checkbox>
            {hasElective2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Elective 2 Subject"
                  placeholder="Select subject"
                  selectedKeys={[elective2Name]}
                  onChange={(e) => setElective2Name(e.target.value)}
                  variant="bordered"
                  color="success"
                  description="Choose your second elective subject"
                >
                  {ALL_ELECTIVE_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Elective 2 Grade"
                  placeholder="Select grade"
                  selectedKeys={[elective2Grade]}
                  onChange={(e) => setElective2Grade(e.target.value as Grade)}
                  variant="bordered"
                  color="success"
                >
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {/* Elective 3 */}
            <Checkbox
              isSelected={hasElective3}
              onValueChange={setHasElective3}
              className="mb-2"
            >
              Add Elective 3
            </Checkbox>
            {hasElective3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Elective 3 Subject"
                  placeholder="Select subject"
                  selectedKeys={[elective3Name]}
                  onChange={(e) => setElective3Name(e.target.value)}
                  variant="bordered"
                  color="success"
                  description="Choose your third elective subject"
                >
                  {ALL_ELECTIVE_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Elective 3 Grade"
                  placeholder="Select grade"
                  selectedKeys={[elective3Grade]}
                  onChange={(e) => setElective3Grade(e.target.value as Grade)}
                  variant="bordered"
                  color="success"
                >
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </div>

          <Divider />

          <Button
            color="primary"
            size="lg"
            className="w-full md:w-auto font-bold"
            onPress={handleCalculate}
          >
            🎯 Calculate My DSE Score & Compare
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
