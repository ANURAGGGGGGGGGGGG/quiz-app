import { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './ProgressBar';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

// Decode HTML entities found in the OpenTriviaDB response.
const decodeHTMLEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

// Unbiased Fisher–Yates shuffle (Array.sort with Math.random is biased).
const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const DIFFICULTIES = [
  { value: '', label: 'Any' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

// Delay before advancing so the correct/incorrect feedback is readable.
const FEEDBACK_DELAY_MS = 1200;

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quizStarted, setQuizStarted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [answeredIndex, setAnsweredIndex] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [stateKey, setStateKey] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const advanceTimeoutRef = useRef(null);

  const clearAdvanceTimeout = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  // Clear any pending advance timer on unmount so stale callbacks
  // can't update state after the component is gone.
  useEffect(() => {
    return () => {
      clearAdvanceTimeout();
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        setCategoryOptions(data.trivia_categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!showScore) {
      return;
    }

    let rafId = null;
    const target = score;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [showScore, score]);

  const fetchQuestions = useCallback(async () => {
    clearAdvanceTimeout();
    setLoading(true);
    setError(null);
    setAnsweredIndex(null);
    setCorrectAnswer(null);
    setFeedbackVisible(false);
    setStateKey(prev => prev + 1);

    try {
      let apiUrl = `https://opentdb.com/api.php?amount=5`;
      if (selectedCategory) apiUrl += `&category=${selectedCategory}`;
      if (difficulty) apiUrl += `&difficulty=${difficulty}`;
      apiUrl += '&type=multiple';

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.response_code === 0) {
        const formattedQuestions = data.results.map(q => {
          const options = shuffle([...q.incorrect_answers, q.correct_answer]);
          return {
            question: decodeHTMLEntities(q.question),
            options: options.map(option => decodeHTMLEntities(option)),
            correctAnswer: decodeHTMLEntities(q.correct_answer)
          };
        });
        setQuestions(formattedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setDisplayScore(0);
        setQuizStarted(true);
      } else {
        setError('Could not load questions. Please try different options.');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, difficulty]);

  const handleAnswerClick = (selectedAnswer) => {
    // Ignore repeat clicks while feedback is showing.
    if (feedbackVisible) {
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setAnsweredIndex(currentQuestion.options.indexOf(selectedAnswer));
    setCorrectAnswer(currentQuestion.options.indexOf(currentQuestion.correctAnswer));
    setFeedbackVisible(true);

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      advanceTimeoutRef.current = setTimeout(() => {
        setCurrentQuestionIndex(nextQuestion);
        setAnsweredIndex(null);
        setCorrectAnswer(null);
        setFeedbackVisible(false);
      }, FEEDBACK_DELAY_MS);
    } else {
      advanceTimeoutRef.current = setTimeout(() => {
        setShowScore(true);
      }, FEEDBACK_DELAY_MS);
    }
  };

  const restartQuiz = () => {
    clearAdvanceTimeout();
    setStateKey(prev => prev + 1);
    setQuizStarted(false);
    setShowScore(false);
    setQuestions([]);
    setAnsweredIndex(null);
    setCorrectAnswer(null);
    setFeedbackVisible(false);
    setDisplayScore(0);
  };

  if (initialLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quizStarted) {
    return (
      <div className="error-container">
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button type="button" onClick={fetchQuestions} className="start-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-setup">
        <h2 className="setup-heading">Set up your quiz</h2>
        <p className="setup-sub">Pick a topic and difficulty, then dive in.</p>
        <div className="setup-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="">Any Category</option>
              {categoryOptions.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <span id="difficulty-label" className="segment-label">Difficulty</span>
            <div className="segmented" role="group" aria-labelledby="difficulty-label">
              {DIFFICULTIES.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className="segment"
                  aria-pressed={difficulty === option.value}
                  onClick={() => setDifficulty(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={fetchQuestions}
            className="start-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : (
              <>
                Start Quiz
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </button>
          <p className="setup-meta">5 questions &middot; Multiple choice &middot; Free to retry</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p className="loading-text">Loading Questions...</p>
      </div>
    );
  }

  // Guard against an empty question list (e.g. a failed fetch after start).
  if (questions.length === 0) {
    return (
      <div className="error-container">
        <h2 className="error-title">No questions found</h2>
        <p className="error-message">{error || 'Could not load questions. Please try different options.'}</p>
        <button type="button" onClick={restartQuiz} className="start-button">
          Back to Setup
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container" key={stateKey}>
      {showScore ? (
        <QuizResult
          score={displayScore}
          totalQuestions={questions.length}
          onRestart={restartQuiz}
          onRetry={fetchQuestions}
        />
      ) : (
        <>
          <div className="quiz-meta-row">
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="score-pill" aria-live="polite">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0Zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13Zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5ZM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8Zm7-7.657a.5.5 0 0 1 0 .707L8.707 2.343a.5.5 0 1 1-.707-.707L9.293.343a.5.5 0 0 1 .707 0ZM8.707 13.657a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0Zm7.586 1.414a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707ZM3.05 3.05a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L3.05 3.757a.5.5 0 0 1 0-.707Z" />
              </svg>
              {score} pts
            </span>
          </div>
          <ProgressBar
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
          <QuizQuestion
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            onAnswerSelected={handleAnswerClick}
            answeredIndex={answeredIndex}
            correctAnswer={correctAnswer}
            feedbackVisible={feedbackVisible}
            currentQuestionIndex={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </>
      )}
    </div>
  );
};

export default Quiz;