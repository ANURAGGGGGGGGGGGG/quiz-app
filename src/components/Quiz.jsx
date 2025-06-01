import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

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
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        console.log('Categories data:', data);
        setCategoryOptions(data.trivia_categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        // Set both loading states to false when categories fetch completes
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching questions...');
    
    try {
      // Build the API URL with selected parameters
      let apiUrl = `https://opentdb.com/api.php?amount=5`;
      
      if (selectedCategory) {
        apiUrl += `&category=${selectedCategory}`;
      }
      
      if (difficulty) {
        apiUrl += `&difficulty=${difficulty}`;
      }
      
      apiUrl += '&type=multiple';
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('API response:', data);
      
      if (data.response_code === 0) {
        // Format questions for our app
        const formattedQuestions = data.results.map(q => {
          // Combine correct and incorrect answers and shuffle them
          const options = [...q.incorrect_answers, q.correct_answer]
            .sort(() => Math.random() - 0.5);
          
          return {
            question: decodeHTMLEntities(q.question),
            options: options.map(option => decodeHTMLEntities(option)),
            correctAnswer: decodeHTMLEntities(q.correct_answer)
          };
        });
        
        console.log('Formatted questions:', formattedQuestions);
        setQuestions(formattedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setQuizStarted(true);
      } else {
        console.error('API returned error code:', data.response_code);
        setError('Could not load questions. Please try different options.');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please check your connection and try again.');
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  // Helper function to decode HTML entities in the API response
  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };

  const handleAnswerClick = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setShowScore(false);
  };

  if (initialLoading) {
    return <div className="d-flex justify-content-center py-4"><h2 className="fs-4 fw-semibold">Loading...</h2></div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h2 className="fs-4 fw-semibold mb-2">Error</h2>
        <p className="mb-3">{error}</p>
        <button onClick={restartQuiz} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="fs-4 fw-bold mb-3">Quiz Setup</h2>
        
        <div className="d-flex flex-column gap-3">
          <div className="mb-3 text-start">
            <label htmlFor="category" className="form-label">Category:</label>
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
          
          <div className="mb-3 text-start">
            <label htmlFor="difficulty" className="form-label">Difficulty:</label>
            <select 
              id="difficulty" 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-select"
            >
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <button 
            onClick={fetchQuestions} 
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-4">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading Questions...</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {showScore ? (
        <QuizResult 
          score={score} 
          totalQuestions={questions.length} 
          onRestart={restartQuiz} 
        />
      ) : (
        <>
          <ProgressBar 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={questions.length} 
          />
          
          <QuizQuestion 
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            onAnswerSelected={handleAnswerClick}
          />
        </>
      )}
    </div>
  );
};

export default Quiz;