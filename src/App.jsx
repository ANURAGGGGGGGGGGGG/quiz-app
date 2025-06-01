import './App.css'
import Quiz from './components/Quiz'
import QuizHeader from './components/QuizHeader'

function App() {
  return (
    <div className="container bg-white rounded shadow p-4 my-4">
      <QuizHeader 
        title="React Quiz Challenge" 
        description="Test your knowledge with these quiz questions!" 
      />
      <Quiz />
    </div>
  )
}

export default App
