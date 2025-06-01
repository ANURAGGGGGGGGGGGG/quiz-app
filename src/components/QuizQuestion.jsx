import React from 'react';

const QuizQuestion = ({ question, options, onAnswerSelected }) => {
  return (
    <div className="mb-4">
      <h3 className="fw-semibold mb-3">{question}</h3>
      <div className="d-grid gap-2">
        {options.map((option, index) => (
          <button
            key={index}
            className="btn btn-outline-secondary text-start"
            onClick={() => onAnswerSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;