import React from 'react';

const ProgressBar = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuetext={`Question ${currentQuestion} of ${totalQuestions}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;