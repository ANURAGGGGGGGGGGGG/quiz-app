import React from 'react';

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  
  return (
    <div className="mb-4">
      <div className="progress" style={{ height: '10px' }}>
        <div 
          className="progress-bar bg-success" 
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div className="small text-muted mt-1">
        Question {currentQuestion} of {totalQuestions}
      </div>
    </div>
  );
};

export default ProgressBar;