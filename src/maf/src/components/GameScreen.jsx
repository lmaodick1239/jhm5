import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import {
  generateQuestion,
  DIFFICULTY_LEVELS,
  getDifficultyByScore,
  POINTS_PER_CORRECT,
  MAX_LIVES,
  saveHighScore,
} from '../utils/gameUtils';

/**
 * GameScreen Component
 * Main game interface with questions, answers, score tracking, and game logic
 */
const GameScreen = ({ mode, onBackToMenu }) => {
  // Game state
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerId, setTimerId] = useState(null);

  const { isOpen: isGameOverOpen, onOpen: onGameOverOpen, onClose: onGameOverClose } = useDisclosure();

  const isInfinityMode = mode === 'INFINITY';
  const totalQuestions = DIFFICULTY_LEVELS[mode]?.questionCount || 10;

  // Initialize first question
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswerLocked && !gameOver) {
      const id = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      setTimerId(id);
      return () => clearTimeout(id);
    } else if (timeLeft === 0 && !isAnswerLocked) {
      // Time's up - treat as wrong answer
      handleTimeout();
    }
  }, [timeLeft, isAnswerLocked, gameOver]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  // Generate a new question based on current difficulty
  const generateNewQuestion = () => {
    let settings;

    if (isInfinityMode) {
      settings = getDifficultyByScore(score);
    } else {
      settings = DIFFICULTY_LEVELS[mode];
    }

    const question = generateQuestion(settings);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setTimeLeft(10); // Reset timer for new question
  };

  // Handle timeout
  const handleTimeout = () => {
    setIsAnswerLocked(true);
    setSelectedAnswer(null); // No answer was selected

    // Timeout counts as wrong answer
    if (isInfinityMode) {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        // Game over in Infinity Mode
        handleGameOver();
        return;
      }
    }

    // Wait 1 second before moving to next question
    setTimeout(() => {
      if (isInfinityMode) {
        // Continue to next question
        setQuestionNumber(questionNumber + 1);
        generateNewQuestion();
      } else {
        // Check if standard mode is complete
        if (questionNumber >= totalQuestions) {
          handleGameOver();
        } else {
          setQuestionNumber(questionNumber + 1);
          generateNewQuestion();
        }
      }
    }, 1000);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (isAnswerLocked) return;

    // Clear any existing timer
    if (timerId) {
      clearTimeout(timerId);
    }

    setSelectedAnswer(answer);
    setIsAnswerLocked(true);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      // Correct answer
      setScore(score + POINTS_PER_CORRECT);
    } else {
      // Wrong answer
      if (isInfinityMode) {
        setLives(lives - 1);
        if (lives - 1 <= 0) {
          // Game over in Infinity Mode
          handleGameOver();
          return;
        }
      }
    }

    // Wait 1 second before moving to next question
    setTimeout(() => {
      if (isInfinityMode) {
        // Continue to next question
        setQuestionNumber(questionNumber + 1);
        generateNewQuestion();
      } else {
        // Check if standard mode is complete
        if (questionNumber >= totalQuestions) {
          handleGameOver();
        } else {
          setQuestionNumber(questionNumber + 1);
          generateNewQuestion();
        }
      }
    }, 1000);
  };

  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    
    if (isInfinityMode) {
      const isNewHigh = saveHighScore(score);
      setIsNewHighScore(isNewHigh);
    }
    
    onGameOverOpen();
  };

  // Get button color based on answer state
  const getButtonColor = (answer) => {
    if (!isAnswerLocked) return 'primary';
    
    if (answer === currentQuestion.correctAnswer) {
      return 'success'; // Green for correct
    } else if (answer === selectedAnswer) {
      return 'danger'; // Red for wrong selected answer
    }
    
    return 'default';
  };

  // Get button variant based on answer state
  const getButtonVariant = (answer) => {
    if (!isAnswerLocked) return 'bordered';
    
    if (answer === currentQuestion.correctAnswer || answer === selectedAnswer) {
      return 'shadow';
    }
    
    return 'bordered';
  };

  // Get current difficulty level for display
  const getCurrentDifficultyLevel = () => {
    if (!isInfinityMode) return DIFFICULTY_LEVELS[mode].name;
    
    if (score >= 2000) return 'Very Hard';
    if (score >= 1500) return 'Expert';
    if (score >= 1000) return 'Hard';
    if (score >= 500) return 'Medium';
    return 'Easy';
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl chalk-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="chalk-swipe-enter w-full max-w-3xl">
        {/* Score and Stats Header */}
        <Card className="chalk-border bg-chalkboard-green/50 backdrop-blur-sm mb-6">
          <CardBody className="p-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex-1">
                <p className="text-lg chalk-text opacity-80">Score</p>
                <p className="text-4xl font-bold chalk-text text-chalk-yellow">{score}</p>
              </div>

              {!isInfinityMode && (
                <div className="flex-1 text-center">
                  <p className="text-lg chalk-text opacity-80">Question</p>
                  <p className="text-4xl font-bold chalk-text">
                    {questionNumber} / {totalQuestions}
                  </p>
                </div>
              )}

              {isInfinityMode && (
                <div className="flex-1 text-center">
                  <p className="text-lg chalk-text opacity-80">Lives</p>
                  <p className="text-4xl font-bold chalk-text text-chalk-red">
                    {'❤️'.repeat(lives)}
                    {'🖤'.repeat(MAX_LIVES - lives)}
                  </p>
                </div>
              )}

              <div className="flex-1 text-right">
                <p className="text-lg chalk-text opacity-80">Level</p>
                <p className="text-2xl font-bold chalk-text text-chalk-blue">
                  {getCurrentDifficultyLevel()}
                </p>
              </div>
            </div>

            {!isInfinityMode && (
              <div className="mt-4">
                <Progress
                  value={(questionNumber / totalQuestions) * 100}
                  color="success"
                  className="chalk-border"
                  size="md"
                />
              </div>
            )}
          </CardBody>
        </Card>

        {/* Question Card */}
        <Card className="chalk-border bg-chalkboard-light/50 backdrop-blur-sm mb-6">
          <CardBody className="p-8 text-center">
            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl chalk-text opacity-70">
                {isInfinityMode ? `Question ${questionNumber}` : `Question ${questionNumber} of ${totalQuestions}`}
              </p>
              <div className={`text-4xl font-bold chalk-text ${timeLeft <= 3 ? 'text-chalk-red animate-pulse' : 'text-chalk-blue'}`}>
                ⏱️ {timeLeft}s
              </div>
            </div>
            <h2 className="text-7xl md:text-8xl font-bold chalk-text">
              {currentQuestion.question}
            </h2>
            <p className="text-3xl chalk-text mt-4 opacity-50">= ?</p>
          </CardBody>
        </Card>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.answers.map((answer, index) => {
            const isCorrect = answer === currentQuestion.correctAnswer;
            const isSelected = answer === selectedAnswer;
            const showResult = isAnswerLocked;
            
            let buttonClasses = 'chalk-border text-4xl py-12 font-bold';
            
            if (showResult) {
              if (isCorrect) {
                buttonClasses += ' !bg-green-800 !text-white border-green-600';
              } else if (isSelected) {
                buttonClasses += ' !bg-red-800 !text-white border-red-600 pulse-animation';
              }
            }
            
            return (
              <Button
                key={index}
                size="lg"
                color={getButtonColor(answer)}
                variant={getButtonVariant(answer)}
                className={buttonClasses}
                onClick={() => handleAnswerSelect(answer)}
                isDisabled={isAnswerLocked}
              >
                {answer}
              </Button>
            );
          })}
        </div>

        {/* Back Button */}
        <Button
          color="danger"
          variant="light"
          className="w-full text-lg chalk-text"
          onClick={onBackToMenu}
        >
          ← Back to Menu
        </Button>

        {/* Game Over Modal */}
        <Modal
          isOpen={isGameOverOpen}
          onOpenChange={onGameOverClose}
          size="2xl"
          backdrop="opaque"
          placement="center"
          scrollBehavior="inside"
          isDismissable={false}
          hideCloseButton
          motionProps={{
            variants: {
              enter: {
                opacity: 1,
                transition: {
                  duration: 0,
                },
              },
              exit: {
                opacity: 0,
                transition: {
                  duration: 0,
                },
              },
            },
          }}
          classNames={{
            base: "chalk-border bg-chalkboard",
            header: "border-b border-chalk-white/20",
            body: "py-6",
            footer: "border-t border-chalk-white/20"
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h3 className="text-4xl chalk-text font-bold text-center">
                    {isInfinityMode ? '🎮 Game Over!' : '🎉 Game Complete!'}
                  </h3>
                </ModalHeader>
            <ModalBody>
              <div className="space-y-6 chalk-text text-center">
                {isNewHighScore && (
                  <div className="bg-chalk-yellow/20 p-4 rounded-lg chalk-border">
                    <p className="text-3xl font-bold text-chalk-yellow mb-2">
                      🏆 NEW HIGH SCORE! 🏆
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-2xl opacity-80 mb-2">Final Score</p>
                  <p className="text-6xl font-bold text-chalk-yellow">{score}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div className="chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                    <p className="opacity-80">Questions</p>
                    <p className="text-2xl font-bold">
                      {isInfinityMode ? questionNumber - 1 : totalQuestions}
                    </p>
                  </div>

                  <div className="chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                    <p className="opacity-80">Correct</p>
                    <p className="text-2xl font-bold text-chalk-green">
                      {score / POINTS_PER_CORRECT}
                    </p>
                  </div>

                  {isInfinityMode && (
                    <>
                      <div className="chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                        <p className="opacity-80">Final Level</p>
                        <p className="text-2xl font-bold text-chalk-blue">
                          {getCurrentDifficultyLevel()}
                        </p>
                      </div>

                      <div className="chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                        <p className="opacity-80">Accuracy</p>
                        <p className="text-2xl font-bold">
                          {questionNumber > 1 
                            ? Math.round((score / POINTS_PER_CORRECT / (questionNumber - 1)) * 100)
                            : 0}%
                        </p>
                      </div>
                    </>
                  )}

                  {!isInfinityMode && (
                    <div className="col-span-2 chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                      <p className="opacity-80">Accuracy</p>
                      <p className="text-2xl font-bold">
                        {Math.round((score / POINTS_PER_CORRECT / totalQuestions) * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                {isInfinityMode && !isNewHighScore && (
                  <div className="text-sm opacity-70">
                    <p>Keep playing to beat your high score!</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-center gap-3">
              <Button
                color="success"
                variant="shadow"
                size="lg"
                className="chalk-border text-xl px-8"
                onClick={() => {
                  onGameOverClose();
                  // Reset game state for replay
                  setScore(0);
                  setQuestionNumber(1);
                  setLives(MAX_LIVES);
                  setGameOver(false);
                  setIsNewHighScore(false);
                  generateNewQuestion();
                }}
              >
                🔄 Play Again
              </Button>

              <Button
                color="primary"
                variant="bordered"
                size="lg"
                className="chalk-border text-xl px-8"
                onClick={() => {
                  onGameOverClose();
                  onBackToMenu();
                }}
              >
                🏠 Main Menu
              </Button>
            </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default GameScreen;
