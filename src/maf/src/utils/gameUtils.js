/**
 * Game Utilities - Math Reaction Challenge
 * Contains functions for question generation, difficulty management, and scoring
 */

// Difficulty levels with their question count and number ranges
export const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    questionCount: 10,
    minNumber: 1,
    maxNumber: 10,
    operations: ['+', '-'],
  },
  MEDIUM: {
    name: 'Medium',
    questionCount: 15,
    minNumber: 1,
    maxNumber: 50,
    operations: ['+', '-', '×'],
  },
  HARD: {
    name: 'Hard',
    questionCount: 20,
    minNumber: 1,
    maxNumber: 100,
    operations: ['+', '-', '×', '÷'],
  },
  INFINITY: {
    name: 'Infinity Mode',
    questionCount: Infinity,
    minNumber: 1,
    maxNumber: 10,
    operations: ['+', '-'],
  }
};

// Points awarded per correct answer
export const POINTS_PER_CORRECT = 100;

// Lives in Infinity Mode
export const MAX_LIVES = 3;

/**
 * Get difficulty settings based on score in Infinity Mode
 * @param {number} score - Current player score
 * @returns {object} Difficulty settings
 */
export const getDifficultyByScore = (score) => {
  if (score >= 2000) {
    return {
      minNumber: 10,
      maxNumber: 200,
      operations: ['+', '-', '×', '÷'],
    };
  } else if (score >= 1500) {
    return {
      minNumber: 5,
      maxNumber: 150,
      operations: ['+', '-', '×', '÷'],
    };
  } else if (score >= 1000) {
    return {
      minNumber: 1,
      maxNumber: 100,
      operations: ['+', '-', '×', '÷'],
    };
  } else if (score >= 500) {
    return {
      minNumber: 1,
      maxNumber: 50,
      operations: ['+', '-', '×'],
    };
  } else {
    // 0-499: Easy
    return {
      minNumber: 1,
      maxNumber: 10,
      operations: ['+', '-'],
    };
  }
};

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculate the result of an operation
 * @param {number} num1 - First operand
 * @param {number} num2 - Second operand
 * @param {string} operation - Operation symbol
 * @returns {number} Result
 */
const calculateResult = (num1, num2, operation) => {
  switch (operation) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    case '÷':
      return Math.floor(num1 / num2);
    default:
      return 0;
  }
};

/**
 * Generate a math question with multiple choice answers
 * @param {object} settings - Difficulty settings (minNumber, maxNumber, operations)
 * @returns {object} Question object with question text and answer options
 */
export const generateQuestion = (settings) => {
  const { minNumber, maxNumber, operations } = settings;
  
  // Select a random operation
  const operation = operations[getRandomInt(0, operations.length - 1)];
  
  let num1, num2, correctAnswer;
  
  // For division, ensure the result is a whole number
  if (operation === '÷') {
    num2 = getRandomInt(Math.max(2, minNumber), Math.min(10, maxNumber));
    const quotient = getRandomInt(minNumber, Math.floor(maxNumber / num2));
    num1 = quotient * num2;
    correctAnswer = quotient;
  } else {
    num1 = getRandomInt(minNumber, maxNumber);
    num2 = getRandomInt(minNumber, maxNumber);
    
    // For subtraction, ensure positive result
    if (operation === '-' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }
    
    correctAnswer = calculateResult(num1, num2, operation);
  }
  
  // Generate wrong answers
  const wrongAnswers = new Set();
  while (wrongAnswers.size < 3) {
    const offset = getRandomInt(-10, 10);
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
      wrongAnswers.add(wrongAnswer);
    }
  }
  
  // Create answer options and shuffle them
  const answers = [correctAnswer, ...Array.from(wrongAnswers)];
  const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
  
  return {
    question: `${num1} ${operation} ${num2}`,
    correctAnswer,
    answers: shuffledAnswers,
  };
};

/**
 * Save high score to localStorage
 * @param {number} score - Score to save
 */
export const saveHighScore = (score) => {
  const currentHighScore = getHighScore();
  if (score > currentHighScore) {
    localStorage.setItem('mathReactionHighScore', score.toString());
    return true;
  }
  return false;
};

/**
 * Get high score from localStorage
 * @returns {number} High score
 */
export const getHighScore = () => {
  const highScore = localStorage.getItem('mathReactionHighScore');
  return highScore ? parseInt(highScore, 10) : 0;
};

/**
 * Reset high score
 */
export const resetHighScore = () => {
  localStorage.removeItem('mathReactionHighScore');
};
