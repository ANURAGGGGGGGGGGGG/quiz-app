import React from 'react';

const QuizHeader = ({ title, description }) => {
  return (
    <div className="quiz-header">
      <div className="brand-tile" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.45" />
        </svg>
      </div>
      <div>
        <span className="eyebrow">Trivia &middot; 5 questions &middot; Multiple choice</span>
        <h1 className="quiz-title">{title}</h1>
        {description && <p className="quiz-description">{description}</p>}
      </div>
    </div>
  );
};

export default QuizHeader;