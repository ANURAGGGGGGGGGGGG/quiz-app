import './App.css'
import Quiz from './components/Quiz'
import QuizHeader from './components/QuizHeader'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="ambient" aria-hidden="true">
        <span className="blob-a" />
        <span className="blob-b" />
      </div>
      <div className="app-card theme-container">
        <div className="app-topbar">
          <QuizHeader
            title="React Quiz Challenge"
            description="Five questions. One leaderboard — you."
          />
          <ThemeToggle />
        </div>
        <Quiz />
      </div>
      <p className="app-footnote">Questions by OpenTriviaDB</p>
    </ThemeProvider>
  )
}

export default App