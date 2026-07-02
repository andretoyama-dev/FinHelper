import { useFinance } from '../context/FinanceContext'
import { formatCurrency, getMonthYearString } from '../utils/calculations'
import { translations } from '../utils/translations'
import './MonthSelector.css'

const MonthSelector = () => {
  const { selectedMonth, changeMonth, monthlyIncome, updateMonthlyIncome, lang } = useFinance()
  
  const handleIncomeChange = (e) => {
    const value = parseFloat(e.target.value) || 0
    updateMonthlyIncome(value)
  }
  
  return (
    <div className="month-selector">
      <div className="month-navigation">
        <button 
          className="month-btn" 
          onClick={() => changeMonth(-1)}
          title={lang === 'en' ? 'Previous Month' : 'Mês Anterior'}
        >
          ‹
        </button>
        
        <span className="month-display">
          {getMonthYearString(selectedMonth)}
        </span>
        
        <button 
          className="month-btn" 
          onClick={() => changeMonth(1)}
          title={lang === 'en' ? 'Next Month' : 'Próximo Mês'}
        >
          ›
        </button>
      </div>
      
      <div className="income-input-wrapper">
        <label htmlFor="monthlyIncome">{translations[lang].monthlyIncome}</label>
        <input
          id="monthlyIncome"
          type="number"
          value={monthlyIncome}
          onChange={handleIncomeChange}
          placeholder={lang === 'en' ? '$ 0.00' : 'R$ 0,00'}
          min="0"
          step="100"
        />
        <span className="income-display">{formatCurrency(monthlyIncome)}</span>
      </div>
    </div>
  )
}

export default MonthSelector
