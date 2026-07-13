import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/calculations'
import './ComparisonCard.css'

const ComparisonCard = ({ title, valueA, valueB, delta, isPercentage = false }) => {
  const { lang } = useFinance()
  const isPt = lang === 'pt'

  const formatValue = (value) => {
    if (isPercentage) return `${value.toFixed(1)}%`
    return formatCurrency(value)
  }
  
  const formatDelta = (delta) => {
    if (isPercentage) {
      return `${delta.isPositive ? '+' : ''}${delta.absolute.toFixed(1)}pp`
    }
    return `${delta.isPositive ? '+' : ''}${formatCurrency(delta.absolute)}`
  }

  // Calculate split progress percentages
  const total = valueA + valueB
  const pctA = total > 0 ? (valueA / total) * 100 : 50
  const pctB = total > 0 ? (valueB / total) * 100 : 50
  
  const deltaColor = delta.isPositive ? 'var(--success)' : delta.isNegative ? 'var(--danger)' : 'rgba(255,255,255,0.1)'

  return (
    <div className="comparison-card" style={{ '--glow-color': deltaColor }}>
      <h4>{title}</h4>
      <div className="comparison-values">
        <div className="value-item">
          <span className="label">{isPt ? 'Mês A' : 'Month A'}</span>
          <span className="value">{formatValue(valueA)}</span>
        </div>
        <div className="value-item">
          <span className="label">{isPt ? 'Mês B' : 'Month B'}</span>
          <span className="value">{formatValue(valueB)}</span>
        </div>
      </div>

      {/* Comparative Progress Split Bar */}
      <div className="comp-bar-wrapper">
        <div className="comp-bar-track">
          <div className="comp-bar-fill fill-a" style={{ width: `${pctA}%` }} />
          <div className="comp-bar-fill fill-b" style={{ width: `${pctB}%`, backgroundColor: deltaColor }} />
        </div>
        <div className="comp-bar-labels">
          <span>{pctA.toFixed(0)}% (A)</span>
          <span>{pctB.toFixed(0)}% (B)</span>
        </div>
      </div>

      <div className={`delta ${delta.isPositive ? 'positive' : delta.isNegative ? 'negative' : 'neutral'}`}>
        <span className="delta-value">{formatDelta(delta)}</span>
        <span className="delta-percent">({delta.isPositive ? '+' : ''}{delta.percent.toFixed(1)}%)</span>
      </div>
    </div>
  )
}

export default ComparisonCard
