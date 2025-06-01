import './App.css'
import Quiz from './components/Quiz'
import QuizHeader from './components/QuizHeader'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="container rounded shadow p-4 my-4 theme-container">
        <div className="d-flex justify-content-end mb-3">
          <ThemeToggle />
        </div>
        <QuizHeader 
          title="React Quiz Challenge" 
          description="Test your knowledge with these quiz questions!" 
        />
        <Quiz />
      </div>
    </ThemeProvider>
  )
}

export default App
