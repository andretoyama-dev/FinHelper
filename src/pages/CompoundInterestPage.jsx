import { useState, useMemo } from 'react'
import Header from '../components/Header'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/calculations'
import { translations } from '../utils/translations'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Calendar } from 'lucide-react'
import './CompoundInterestPage.css'

const CompoundInterestPage = () => {
  const { lang } = useFinance()
  const isPt = lang === 'pt'

  const [initialAmount, setInitialAmount] = useState(1000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualRate, setAnnualRate] = useState(12)
  const [periodYears, setPeriodYears] = useState(10)

  const data = useMemo(() => {
    const monthlyRate = annualRate / 100 / 12
    const totalMonths = periodYears * 12
    const rows = []
    let balance = initialAmount
    let totalInvested = initialAmount

    rows.push({
      month: 0,
      label: isPt ? 'Início' : 'Start',
      invested: initialAmount,
      interest: 0,
      balance: initialAmount
    })

    for (let m = 1; m <= totalMonths; m++) {
      const interestThisMonth = balance * monthlyRate
      balance = balance + interestThisMonth + monthlyContribution
      totalInvested += monthlyContribution

      if (m % 12 === 0 || m === totalMonths) {
        rows.push({
          month: m,
          label: isPt ? `Ano ${Math.ceil(m / 12)}` : `Year ${Math.ceil(m / 12)}`,
          invested: Math.round(totalInvested * 100) / 100,
          interest: Math.round((balance - totalInvested) * 100) / 100,
          balance: Math.round(balance * 100) / 100
        })
      }
    }

    return rows
  }, [initialAmount, monthlyContribution, annualRate, periodYears, isPt])

  const finalRow = data[data.length - 1]
  const totalInterest = finalRow ? finalRow.interest : 0
  const finalBalance = finalRow ? finalRow.balance : 0
  const totalInvested = finalRow ? finalRow.invested : 0

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="ci-tooltip">
          <p className="ci-tooltip-label">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="ci-tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="page ci-page">
      <Header />
      <main className="page-content">
        <div className="ci-layout">
          {/* Left: Inputs + Metrics */}
          <div className="ci-sidebar">
            <div className="ci-inputs-card">
              <h3>{translations[lang].ciPage.parameters}</h3>
              
              <div className="ci-field">
                <label>{translations[lang].ciPage.initialAmount}</label>
                <div className="ci-input-wrapper">
                  <span className="ci-prefix">{isPt ? 'R$' : '$'}</span>
                  <input
                    type="number"
                    value={initialAmount === 0 ? '' : initialAmount}
                    onChange={e => {
                      const val = e.target.value
                      setInitialAmount(val === '' ? 0 : Math.max(0, Number(val)))
                    }}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="ci-field">
                <label>{translations[lang].ciPage.monthlyContribution}</label>
                <div className="ci-input-wrapper">
                  <span className="ci-prefix">{isPt ? 'R$' : '$'}</span>
                  <input
                    type="number"
                    value={monthlyContribution === 0 ? '' : monthlyContribution}
                    onChange={e => {
                      const val = e.target.value
                      setMonthlyContribution(val === '' ? 0 : Math.max(0, Number(val)))
                    }}
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div className="ci-field">
                <label>{translations[lang].ciPage.annualRate}</label>
                <div className="ci-input-wrapper">
                  <span className="ci-prefix">%</span>
                  <input
                    type="number"
                    value={annualRate === 0 ? '' : annualRate}
                    onChange={e => {
                      const val = e.target.value
                      setAnnualRate(val === '' ? 0 : Math.max(0, Number(val)))
                    }}
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="ci-field">
                <label>{translations[lang].ciPage.periodYears}</label>
                <div className="ci-input-wrapper">
                  <span className="ci-prefix" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={14} /></span>
                  <input
                    type="number"
                    value={periodYears === 0 ? '' : periodYears}
                    onChange={e => {
                      const val = e.target.value
                      setPeriodYears(val === '' ? 0 : Math.max(0, Math.min(50, Number(val))))
                    }}
                    min="1"
                    max="50"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="ci-metrics">
              <div className="ci-metric" style={{ '--metric-color': '#4a90e2' }}>
                <span className="ci-metric-label">{translations[lang].ciPage.totalInvested}</span>
                <span className="ci-metric-value">{formatCurrency(totalInvested)}</span>
              </div>
              <div className="ci-metric" style={{ '--metric-color': '#22c55e' }}>
                <span className="ci-metric-label">{translations[lang].ciPage.totalInterest}</span>
                <span className="ci-metric-value">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="ci-metric" style={{ '--metric-color': '#d4a259' }}>
                <span className="ci-metric-label">{translations[lang].ciPage.finalBalance}</span>
                <span className="ci-metric-value">{formatCurrency(finalBalance)}</span>
              </div>
            </div>
          </div>

          {/* Right: Chart + Table */}
          <div className="ci-main">
            <div className="ci-chart-card">
              <h3>{translations[lang].ciPage.growthProjection}</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4a90e2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="var(--text-muted)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: '0.7rem', fontWeight: 500 }}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: '0.7rem', fontWeight: 500 }}
                    tickFormatter={v => formatCurrency(v)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: '0.75rem', paddingTop: '8px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="invested"
                    name={isPt ? 'Investido' : 'Invested'}
                    stroke="#4a90e2"
                    strokeWidth={2}
                    fill="url(#gradInvested)"
                    activeDot={{ r: 4, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name={isPt ? 'Saldo Total' : 'Total Balance'}
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="url(#gradBalance)"
                    activeDot={{ r: 4, stroke: 'var(--bg-primary)', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Data table */}
            <div className="ci-table-card">
              <h3>{translations[lang].ciPage.detailedEvolution}</h3>
              <div className="ci-table-wrapper">
                <table className="ci-table">
                  <thead>
                    <tr>
                      <th>{translations[lang].ciPage.period}</th>
                      <th>{translations[lang].ciPage.totalInvested}</th>
                      <th>{translations[lang].ciPage.accumInterest}</th>
                      <th>{translations[lang].ciPage.balance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i}>
                        <td>{row.label}</td>
                        <td>{formatCurrency(row.invested)}</td>
                        <td className="interest-cell">{formatCurrency(row.interest)}</td>
                        <td className="balance-cell">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CompoundInterestPage
