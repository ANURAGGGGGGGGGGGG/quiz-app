import React from 'react';

const QuizHeader = ({ title, description }) => {
  return (
    <div className="mb-4">
      <h1 className="display-5 fw-bold mb-2">{title}</h1>
      {description && <p className="text-muted">{description}</p>}
    </div>
  );
};

export default QuizHeader;