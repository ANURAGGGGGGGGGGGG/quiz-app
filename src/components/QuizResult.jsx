import React from 'react';

const QuizResult = ({ score, totalQuestions, onRestart }) => {
  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Determine message based on score percentage
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
    <div className="text-center p-3">
      <h2 className="fw-bold mb-3">Quiz Completed!</h2>
      
      <div className="mb-3">
        <div className="d-flex justify-content-center align-items-baseline">
          <span className="display-4 fw-bold text-primary">{score}</span>
          <span className="fs-4 text-secondary">/{totalQuestions}</span>
        </div>
        <div className="fs-5 text-secondary">{percentage}%</div>
      </div>
      
      <p className="mb-4">{message}</p>
      
      <button 
        onClick={onRestart} 
        className="btn btn-primary"
      >
        Try Again
      </button>
    </div>
  );
};

export default QuizResult;