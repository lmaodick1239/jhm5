import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { getHighScore } from '../utils/gameUtils';

/**
 * MainMenu Component
 * Displays the main menu with game mode selection, instructions, about, and high score
 */
const MainMenu = ({ onStartGame }) => {
  const [highScore, setHighScore] = useState(0);
  const { isOpen: isInstructionsOpen, onOpen: onInstructionsOpen, onClose: onInstructionsClose } = useDisclosure();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const { isOpen: isModeSelectOpen, onOpen: onModeSelectOpen, onClose: onModeSelectClose } = useDisclosure();

  // Load high score on component mount
  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  const handleStartGame = (mode) => {
    onModeSelectClose();
    onStartGame(mode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="chalk-swipe-enter w-full max-w-2xl">
        {/* Main Title Card */}
        <Card className="chalk-border bg-chalkboard-green/50 backdrop-blur-sm mb-8">
          <CardBody className="p-8 text-center">
            <h1 className="text-6xl md:text-7xl font-bold chalk-text mb-4">
              Math Reaction
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold chalk-text text-chalk-yellow">
              Challenge
            </h2>
            <p className="text-xl chalk-text mt-4 opacity-80">
              Test your math skills and reaction speed!
            </p>
          </CardBody>
        </Card>

        {/* High Score Display */}
        {highScore > 0 && (
          <Card className="chalk-border bg-chalkboard-light/50 backdrop-blur-sm mb-6">
            <CardBody className="p-4 text-center">
              <p className="text-2xl chalk-text">
                🏆 High Score: <span className="text-chalk-yellow font-bold">{highScore}</span>
              </p>
            </CardBody>
          </Card>
        )}

        {/* Main Action Buttons */}
        <div className="space-y-4">
          {/* Primary Start Game Button - Large and Prominent */}
          <Button
            size="lg"
            color="success"
            variant="shadow"
            className="w-full text-3xl py-8 font-bold chalk-border"
            onClick={onModeSelectOpen}
          >
            🎮 Start Game
          </Button>

          {/* Secondary Buttons - Smaller */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              size="md"
              color="primary"
              variant="bordered"
              className="chalk-border text-xl py-6"
              onClick={onInstructionsOpen}
            >
              📖 Instructions
            </Button>

            <Button
              size="md"
              color="primary"
              variant="bordered"
              className="chalk-border text-xl py-6"
              onClick={onAboutOpen}
            >
              ℹ️ About
            </Button>

            <Button
              size="md"
              color="primary"
              variant="bordered"
              className="chalk-border text-xl py-6"
              onClick={() => setHighScore(getHighScore())}
            >
              🏆 High Score: {highScore}
            </Button>
          </div>
        </div>

        {/* Mode Selection Modal */}
        <Modal
          isOpen={isModeSelectOpen}
          onOpenChange={onModeSelectClose}
          size="2xl"
          backdrop="opaque"
          placement="center"
          scrollBehavior="inside"
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
                  <h3 className="text-3xl chalk-text font-bold">Select Game Mode</h3>
                </ModalHeader>
            <ModalBody>
              <div className="space-y-3">
                <Button
                  size="lg"
                  color="success"
                  variant="shadow"
                  className="w-full text-2xl py-6 chalk-border"
                  onClick={() => handleStartGame('EASY')}
                >
                  🟢 Easy Mode
                  <span className="block text-sm opacity-80">10 questions • Numbers 1-10</span>
                </Button>

                <Button
                  size="lg"
                  color="warning"
                  variant="shadow"
                  className="w-full text-2xl py-6 chalk-border"
                  onClick={() => handleStartGame('MEDIUM')}
                >
                  🟡 Medium Mode
                  <span className="block text-sm opacity-80">15 questions • Numbers 1-50</span>
                </Button>

                <Button
                  size="lg"
                  color="danger"
                  variant="shadow"
                  className="w-full text-2xl py-6 chalk-border"
                  onClick={() => handleStartGame('HARD')}
                >
                  🔴 Hard Mode
                  <span className="block text-sm opacity-80">20 questions • Numbers 1-100</span>
                </Button>

                <Button
                  size="lg"
                  color="secondary"
                  variant="shadow"
                  className="w-full text-2xl py-6 chalk-border bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => handleStartGame('INFINITY')}
                >
                  ♾️ Infinity Mode
                  <span className="block text-sm opacity-80">3 Lives • Increasing Difficulty</span>
                </Button>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={onClose}
                className="chalk-text"
              >
                Cancel
              </Button>
            </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Instructions Modal */}
        <Modal
          isOpen={isInstructionsOpen}
          onOpenChange={onInstructionsClose}
          size="2xl"
          backdrop="opaque"
          placement="center"
          scrollBehavior="inside"
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
                  <h3 className="text-3xl chalk-text font-bold">📖 How to Play</h3>
                </ModalHeader>
            <ModalBody>
              <div className="space-y-4 chalk-text text-lg">
                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Game Objective</h4>
                  <p>Solve math problems as quickly as possible! Select the correct answer from four options.</p>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Scoring</h4>
                  <p>• Each correct answer: <strong className="text-chalk-green">+100 points</strong></p>
                  <p>• Your highest score in Infinity Mode is saved automatically!</p>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Game Modes</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Easy:</strong> 10 questions with numbers 1-10</li>
                    <li><strong>Medium:</strong> 15 questions with numbers 1-50</li>
                    <li><strong>Hard:</strong> 20 questions with numbers 1-100</li>
                    <li><strong>Infinity:</strong> Endless questions with 3 lives</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Infinity Mode</h4>
                  <p>• Start with <strong className="text-chalk-red">3 lives (strikes)</strong></p>
                  <p>• Lose one life for each wrong answer</p>
                  <p>• Game ends when you run out of lives</p>
                  <p>• Difficulty increases as your score grows!</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm opacity-90">
                    <li>0-500: Easy difficulty</li>
                    <li>501-1500: Medium difficulty</li>
                    <li>1501+: Hard difficulty and beyond</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Answer Feedback</h4>
                  <p>• Correct answer highlights in <span className="text-chalk-green font-bold">green</span></p>
                  <p>• Wrong answer highlights in <span className="text-chalk-red font-bold">red</span></p>
                  <p>• Short pause after each answer before next question</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="shadow"
                onClick={onClose}
                className="chalk-border"
              >
                Got it!
              </Button>
            </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* About Modal */}
        <Modal
          isOpen={isAboutOpen}
          onOpenChange={onAboutClose}
          size="2xl"
          backdrop="opaque"
          placement="center"
          scrollBehavior="inside"
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
                  <h3 className="text-3xl chalk-text font-bold">ℹ️ About</h3>
                </ModalHeader>
            <ModalBody>
              <div className="space-y-4 chalk-text text-lg">
                <div>
                  <h4 className="text-2xl font-bold text-chalk-yellow mb-2">Math Reaction Challenge</h4>
                  <p>A fun and educational math game designed to improve your mental calculation skills and reaction time!</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-chalk-blue mb-2">Features</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Four difficulty levels to challenge yourself</li>
                    <li>Beautiful chalkboard visual theme</li>
                    <li>Infinity Mode with progressive difficulty</li>
                    <li>High score tracking with localStorage</li>
                    <li>Instant answer feedback</li>
                    <li>Responsive design for all devices</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-chalk-blue mb-2">Technologies Used</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>React 18 with React Compiler</li>
                    <li>Vite Build Tool</li>
                    <li>HeroUI Component Library</li>
                    <li>Tailwind CSS</li>
                    <li>Framer Motion</li>
                  </ul>
                </div>

                <div className="chalk-border bg-chalkboard-light/30 p-4 rounded-lg">
                  <h4 className="text-xl font-bold text-chalk-yellow mb-3 text-center">👨‍💻 Creator Information</h4>
                  <div className="text-center space-y-2">
                    <p className="text-lg">Created by <span className="font-bold text-chalk-blue">lmaodick</span></p>
                    <p className="text-sm opacity-80">Educational Math Game </p>
                    <div className="flex justify-center gap-4 mt-3 text-sm">
                      {/* <span>📧 [Your Email]</span> */}
                      <span>🌐 [Your Website]</span>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-2xl">🎓📚✨</p>
                  <p className="text-sm opacity-70 mt-2">Version 1.0.0 • 2025</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="shadow"
                onClick={onClose}
                className="chalk-border"
              >
                Close
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

export default MainMenu;
