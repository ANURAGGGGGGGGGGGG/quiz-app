import React from 'react';

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const QuizResult = ({ score, totalQuestions, onRestart, onRetry }) => {
  const safeTotal = Math.max(totalQuestions, 1);
  const percentage = Math.round((score / safeTotal) * 100);
  const ringOffset = RING_CIRCUMFERENCE * (1 - Math.min(percentage, 100) / 100);

  let message = '';
  if (percentage >= 80) {
    message = 'Excellent! You really know your stuff!';
  } else if (percentage >= 60) {
    message = 'Good job! You have a solid understanding.';
  } else if (percentage >= 40) {
    message = 'Not bad! Keep learning and try again.';
  } else {
    message = 'Keep studying and try again soon!';
  }

  return (
    <div className="results-container">
      <h2 className="results-title">Quiz Completed!</h2>

      <div className="score-ring" role="img" aria-label={`Scored ${score} out of ${totalQuestions}, ${percentage} percent`}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle
            className="ring-track"
            cx="70"
            cy="70"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="11"
          />
          <circle
            className="ring-value"
            cx="70"
            cy="70"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="11"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 70 70)"
          />
          <text x="70" y="66" textAnchor="middle" className="score-ring-text">
            {score}/{totalQuestions}
          </text>
          <text x="70" y="90" textAnchor="middle" className="score-ring-sub">
            {percentage}%
          </text>
        </svg>
      </div>

      <div className="results-percentage">{percentage}% correct</div>

      <p className="results-message">{message}</p>

      <div className="results-actions">
        <button
          type="button"
          onClick={onRetry}
          className="restart-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Retry Quiz
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="ghost-button"
        >
          Change Setup
        </button>
      </div>
    </div>
  );
};

export default QuizResult;