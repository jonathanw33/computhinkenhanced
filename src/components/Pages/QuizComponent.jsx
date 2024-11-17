import React, { useState } from 'react';
import { ChevronRight, ChevronLeft,HomeIcon } from 'lucide-react';
import './QuizComponent.scss';
import { Link } from 'react-router-dom';

const ComputationalThinkingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'Which of the following best describes computational thinking?',
      options: [
        'A programming language',
        'A problem-solving approach that uses computer science principles',
        'A type of computer hardware',
        'A software development methodology'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'What is decomposition in computational thinking?',
      options: [
        'Breaking down complex problems into smaller parts',
        'Creating computer programs',
        'Testing software applications',
        'Designing user interfaces'
      ],
      correct: 0
    },
    {
      id: 3,
      question: 'Which characteristic is NOT typically associated with Hill Climbing algorithm?',
      options: [
        'It can get stuck in local optima',
        'It always finds the global optimum',
        'It is simple to implement',
        'It makes incremental improvements'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What is Simulated Annealing?',
      options: [
        'A cooling process for computers',
        'A deterministic search algorithm',
        'A probabilistic local search algorithm inspired by metallurgy',
        'A type of neural network'
      ],
      correct: 2
    },
    {
      id: 5,
      question: 'Which local search algorithm is inspired by natural selection?',
      options: [
        'Hill Climbing',
        'Simulated Annealing',
        'Genetic Algorithm',
        'Tabu Search'
      ],
      correct: 2
    },
    {
      id: 6,
      question: 'What is a key advantage of Tabu Search over basic Hill Climbing?',
      options: [
        'It runs faster',
        'It prevents revisiting recent solutions',
        'It requires less memory',
        'It always finds the global optimum'
      ],
      correct: 1
    },
    {
      id: 7,
      question: 'Pattern recognition in computational thinking helps us to:',
      options: [
        'Write code faster',
        'Identify similarities and common differences in problems',
        'Debug programs more efficiently',
        'Create better user interfaces'
      ],
      correct: 1
    },
    {
      id: 8,
      question: 'Which statement about local search algorithms is true?',
      options: [
        'They always find the best possible solution',
        'They are guaranteed to run in polynomial time',
        'They work by making incremental improvements to a solution',
        'They require a training dataset'
      ],
      correct: 2
    },
    {
      id: 9,
      question: 'Abstraction in computational thinking involves:',
      options: [
        'Writing complex code',
        'Focusing on important details while ignoring irrelevant ones',
        'Creating detailed documentation',
        'Testing all possible scenarios'
      ],
      correct: 1
    },
    {
      id: 10,
      question: 'Algorithm design in computational thinking is important because:',
      options: [
        'It makes the code look professional',
        'It helps create step-by-step solutions to problems',
        'It makes programs run faster',
        'It reduces the need for testing'
      ],
      correct: 1
    }
  ];

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="quiz-main">
      {!showResult ? (
        <div className="quiz-content">
          <div className="quiz-header">
            <div className="quiz-header-content">
              <h2>Computational Thinking Quiz</h2>
              <span className="quiz-counter">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="quiz-progress">
              <div
                className="quiz-progress-fill"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="quiz-body">
            <h3 className="quiz-question">{questions[currentQuestion].question}</h3>
            <div className="quiz-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`quiz-btn-prev ${currentQuestion === 0 ? 'disabled' : ''}`}
            >
              <ChevronLeft className="quiz-icon" />
              Previous
            </button>
            <button
              onClick={handleNext}
              className="quiz-btn-next"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="quiz-icon" />
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
            <h2>Quiz Results</h2>
            <div className="quiz-results-list">
              {questions.map((question, index) => (
                <div key={index} className="quiz-result-item">
                  <p className="quiz-result-question">{question.question}</p>
                  <div className={`quiz-result-answer ${answers[index] === question.correct ? 'correct' : 'incorrect'}`}>
                    <div>Your answer: {question.options[answers[index]]}</div>
                    {answers[index] !== question.correct && (
                      <div className="correct-answer">
                        Correct answer: {question.options[question.correct]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="quiz-score">
                Score: {questions.filter((q, i) => answers[i] === q.correct).length} out of {questions.length}
              </div>
              <Link to="/" className="quiz-home-button">
                <HomeIcon className="quiz-icon" />
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
  );
};

export default ComputationalThinkingQuiz;