import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getMonthYearString } from '../utils/calculations'
import { translations } from '../utils/translations'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import './MonthSelector.css'

const MonthSelector = () => {
  const { 
    selectedMonth, 
    changeMonth, 
    monthlyIncome, 
    updateMonthlyIncome, 
    lang,
    totalExpenses,
    totalPaidDebts,
    savingsRate 
  } = useFinance()
  
  const handleIncomeChange = (e) => {
    const rawValue = e.target.value
    if (rawValue === '') {
      updateMonthlyIncome(0)
      return
    }
    const value = parseFloat(rawValue)
    if (!isNaN(value)) {
      updateMonthlyIncome(value)
    }
  }

  const availableBalance = monthlyIncome - totalExpenses - totalPaidDebts
  
  return (
    <div className="month-selector-bar" id="tour-income">
      <div className="month-navigation">
        <button 
          className="month-btn" 
          onClick={() => changeMonth(-1)}
          title={lang === 'en' ? 'Previous Month' : 'Mês Anterior'}
        >
          <ChevronLeftIcon size={14} />
        </button>
        
        <span className="month-display">
          {getMonthYearString(selectedMonth)}
        </span>
        
        <button 
          className="month-btn" 
          onClick={() => changeMonth(1)}
          title={lang === 'en' ? 'Next Month' : 'Próximo Mês'}
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>
      
      <div className="income-input-group">
        <label htmlFor="monthlyIncome">{translations[lang].monthlyIncome}:</label>
        <div className="income-input-wrapper">
          <input
            id="monthlyIncome"
            type="number"
            value={monthlyIncome === 0 ? '' : monthlyIncome}
            onChange={handleIncomeChange}
            placeholder={lang === 'en' ? '$ 0.00' : 'R$ 0,00'}
            min="0"
            step="100"
          />
          <span className="income-display">{formatCurrency(monthlyIncome)}</span>
        </div>
      </div>

      <div className="period-essentials">
        <div className="essential-metric">
          <span className="metric-label">{translations[lang].savingsRate}:</span>
          <span className="metric-val">{savingsRate.toFixed(0)}%</span>
        </div>
        <div className="essential-metric">
          <span className="metric-label">{translations[lang].availableBalance}:</span>
          <span className="metric-val highlight">{formatCurrency(availableBalance)}</span>
        </div>
      </div>
    </div>
  )
}

export default MonthSelector
