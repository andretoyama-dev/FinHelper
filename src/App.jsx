import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import BudgetPage from './pages/BudgetPage'
import GoalsPage from './pages/GoalsPage'
import EvolutionPage from './pages/EvolutionPage'
import CompoundInterestPage from './pages/CompoundInterestPage'
import CalendarPage from './pages/CalendarPage'
import TipsPage from './pages/TipsPage'
import PortfolioPage from './pages/PortfolioPage'
import WelcomeModal from './components/WelcomeModal'
import GuidedTour from './components/GuidedTour'

function AppContent() {
  const { userName } = useFinance()
  const [showTour, setShowTour] = useState(false)

  // Auto-trigger tour on first visit (after welcome modal closes)
  useEffect(() => {
    if (userName && !localStorage.getItem('finhelper_tour_done')) {
      const timer = setTimeout(() => setShowTour(true), 600)
      return () => clearTimeout(timer)
    }
  }, [userName])

  // Expose tour trigger globally so Header can call it
  useEffect(() => {
    window.__startTour = () => setShowTour(true)
    return () => { delete window.__startTour }
  }, [])
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<BudgetPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/evolution" element={<EvolutionPage />} />
          <Route path="/interest" element={<CompoundInterestPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
      </Router>
      
      <WelcomeModal 
        isOpen={!userName} 
        onClose={() => {}} 
      />
    </>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}

export default App
