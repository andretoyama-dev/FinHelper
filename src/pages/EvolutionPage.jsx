import { useState, useMemo, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import { aggregateMonthlyData, calculateDelta, formatMonthLabel } from '../utils/monthlyAggregation'
import { formatCurrency } from '../utils/calculations'
import { translations } from '../utils/translations'
import Header from '../components/Header'
import MonthlyChart from '../components/MonthlyChart'
import ComparisonCard from '../components/ComparisonCard'
import CategoryComparisonTable from '../components/CategoryComparisonTable'
import './EvolutionPage.css'

const EvolutionPage = () => {
  const { monthlyData, categoriesGoals, lang } = useFinance()
  const [activeTab, setActiveTab] = useState('evolution')
  const [monthA, setMonthA] = useState('')
  const [monthB, setMonthB] = useState('')
  
  // Aggregate data with proper spent calculation
  const aggregatedData = useMemo(() => 
    aggregateMonthlyData(monthlyData, categoriesGoals),
    [monthlyData, categoriesGoals]
  )
  
  const availableMonths = useMemo(() => 
    Object.keys(monthlyData).sort(), // YYYY-MM format
    [monthlyData]
  )
  
  // Set default months for comparison
  useEffect(() => {
    if (availableMonths.length >= 2) {
      setMonthA(availableMonths[availableMonths.length - 2])
      setMonthB(availableMonths[availableMonths.length - 1])
    } else if (availableMonths.length === 1) {
      setMonthA(availableMonths[0])
      setMonthB(availableMonths[0])
    }
  }, [availableMonths])
  
  // Get data for comparison
  const dataA = aggregatedData.find(d => d.month === monthA)
  const dataB = aggregatedData.find(d => d.month === monthB)
  
  // Calculate deltas for comparison
  const deltas = useMemo(() => {
    if (!dataA || !dataB) return null
    
    return {
      totalExpenses: calculateDelta(dataA.totalExpenses, dataB.totalExpenses),
      savings: calculateDelta(dataA.savings, dataB.savings),
      savingsRate: calculateDelta(dataA.savingsRate, dataB.savingsRate),
      totalInvestments: calculateDelta(dataA.totalInvestments, dataB.totalInvestments),
      totalDebts: calculateDelta(dataA.totalDebts, dataB.totalDebts),
      remainingMoney: calculateDelta(dataA.remainingMoney, dataB.remainingMoney)
    }
  }, [dataA, dataB])

  const t = translations[lang] || translations.en
  
  // Empty state
  if (aggregatedData.length === 0) {
    return (
      <div className="page evolution-page">
        <Header />
        <main className="page-content">
          <div className="evolution-header">
            <div className="header-meta">
              <h1>{t.evolutionPage.title}</h1>
              <p className="subtitle">{t.evolutionPage.subtitle}</p>
            </div>
          </div>
          <div className="empty-state">
            <p className="primary-empty-msg">{t.evolutionPage.emptyState}</p>
            <p className="desc">{t.evolutionPage.emptyStateDesc}</p>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="page evolution-page">
      <Header />
      
      <main className="page-content">
        <div className="evolution-header">
          <div className="header-meta">
            <h1>{t.evolutionPage.title}</h1>
            <p className="subtitle">{t.evolutionPage.subtitle}</p>
          </div>
        </div>
        
        {/* Segmented sliding pill tabs control */}
        <div className="evolution-tabs-container">
          <div className="segmented-control">
            <div 
              className="segmented-pill-bg" 
              style={{ transform: activeTab === 'comparison' ? 'translateX(100%)' : 'translateX(0)' }} 
            />
            <button 
              className={`segmented-btn ${activeTab === 'evolution' ? 'active' : ''}`}
              onClick={() => setActiveTab('evolution')}
            >
              {t.evolutionPage.tabEvolution}
            </button>
            <button 
              className={`segmented-btn ${activeTab === 'comparison' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparison')}
            >
              {t.evolutionPage.tabComparison}
            </button>
          </div>
        </div>
        
        {/* Evolution Tab */}
        {activeTab === 'evolution' && (
          <div className="charts-grid">
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalExpenses"
              title={t.evolutionPage.chartExpenses}
              colorVar="--danger"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="savings"
              title={t.evolutionPage.chartSavings}
              colorVar="--success"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="savingsRate"
              title={t.evolutionPage.chartSavingsRate}
              colorVar="--accent-primary"
              isPercentage
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalInvestments"
              title={t.evolutionPage.chartInvestments}
              colorVar="--accent-secondary"
            />
            <MonthlyChart 
              data={aggregatedData}
              dataKey="totalDebts"
              title={t.evolutionPage.chartDebts}
              colorVar="--warning"
            />
          </div>
        )}
        
        {/* Comparison Tab */}
        {activeTab === 'comparison' && dataA && dataB && deltas && (
          <div className="comparison-content">
            {/* Month selectors */}
            <div className="month-selectors">
              <div className="selector-group">
                <label>{t.evolutionPage.monthA}</label>
                <div className="select-wrapper">
                  <select value={monthA} onChange={(e) => setMonthA(e.target.value)}>
                    {availableMonths.map(m => (
                      <option key={m} value={m}>{formatMonthLabel(m)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="selector-group">
                <label>{t.evolutionPage.monthB}</label>
                <div className="select-wrapper">
                  <select value={monthB} onChange={(e) => setMonthB(e.target.value)}>
                    {availableMonths.map(m => (
                      <option key={m} value={m}>{formatMonthLabel(m)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Comparison cards */}
            <div className="comparison-cards">
              <ComparisonCard 
                title={t.evolutionPage.cardExpenses}
                valueA={dataA.totalExpenses}
                valueB={dataB.totalExpenses}
                delta={deltas.totalExpenses}
              />
              <ComparisonCard 
                title={t.evolutionPage.cardSavings}
                valueA={dataA.savings}
                valueB={dataB.savings}
                delta={deltas.savings}
              />
              <ComparisonCard 
                title={t.evolutionPage.cardSavingsRate}
                valueA={dataA.savingsRate}
                valueB={dataB.savingsRate}
                delta={deltas.savingsRate}
                isPercentage
              />
              <ComparisonCard 
                title={t.evolutionPage.cardInvestments}
                valueA={dataA.totalInvestments}
                valueB={dataB.totalInvestments}
                delta={deltas.totalInvestments}
              />
              <ComparisonCard 
                title={t.evolutionPage.cardDebts}
                valueA={dataA.totalDebts}
                valueB={dataB.totalDebts}
                delta={deltas.totalDebts}
              />
              <ComparisonCard 
                title={t.evolutionPage.cardRemaining}
                valueA={dataA.remainingMoney}
                valueB={dataB.remainingMoney}
                delta={deltas.remainingMoney}
              />
            </div>
            
            {/* Category comparison table */}
            <CategoryComparisonTable 
              categoriesGoals={categoriesGoals}
              categorySpentA={dataA.categorySpent}
              categorySpentB={dataB.categorySpent}
              monthLabelA={formatMonthLabel(monthA)}
              monthLabelB={formatMonthLabel(monthB)}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default EvolutionPage
