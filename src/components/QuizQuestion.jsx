import React from 'react';

const QuizQuestion = ({ question, options, onAnswerSelected, answeredIndex, correctAnswer, feedbackVisible, currentQuestionIndex, totalQuestions }) => {
  return (
    <div className="question-section">
      <div className="question-count">Question {currentQuestionIndex} of {totalQuestions}</div>
      <h3 className="question-text">{question}</h3>
      <div className="answer-section">
        {options.map((option, index) => {
          let optionClass = 'answer-button';
          // Stagger entrance only before answering — otherwise it would
          // override the correct/incorrect feedback animation.
          const staggerClass = feedbackVisible ? '' : `answer-option-${(index % 4) + 1}`;
          const isCorrect = feedbackVisible && index === correctAnswer;
          const isIncorrect = feedbackVisible && index === answeredIndex && index !== correctAnswer;

          if (feedbackVisible) {
            if (isCorrect) {
              optionClass += ' correct';
            } else if (isIncorrect) {
              optionClass += ' incorrect';
            } else {
              optionClass += ' disabled';
            }
          }

          return (
            <button
              key={index}
              type="button"
              className={`${optionClass} ${staggerClass}`}
              onClick={() => onAnswerSelected(option)}
              disabled={feedbackVisible}
              aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
            >
              <span className="answer-letter" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="answer-label">{option}</span>
              {feedbackVisible && (isCorrect || isIncorrect) && (
                <span className="answer-icon" aria-hidden="true">
                  {isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;