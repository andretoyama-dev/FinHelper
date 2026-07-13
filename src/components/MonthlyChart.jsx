import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../utils/calculations'
import './MonthlyChart.css'

const MonthlyChart = ({ data, dataKey, title, colorVar, isPercentage = false }) => {
  // Use CSS variable directly
  const color = `var(${colorVar})`
  
  const formatValue = (value) => {
    if (isPercentage) return `${value.toFixed(1)}%`
    return formatCurrency(value)
  }
  
  // Custom Tooltip renderer to make it glassmorphic and elegant
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip-container">
          <p className="chart-tooltip-label">{label}</p>
          <p className="chart-tooltip-value" style={{ color: color }}>
            {formatValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }
  
  return (
    <div className="chart-card" style={{ '--glow-color': color }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`chartGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="monthLabel" 
            stroke="var(--text-muted)"
            tickLine={false}
            axisLine={false}
            dy={8}
            style={{ fontSize: '0.7rem', fontWeight: 500 }}
          />
          <YAxis 
            stroke="var(--text-muted)"
            tickLine={false}
            axisLine={false}
            dx={-8}
            style={{ fontSize: '0.7rem', fontWeight: 500 }}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#chartGrad-${dataKey})`}
            activeDot={{ r: 5, stroke: 'var(--bg-primary)', strokeWidth: 2, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyChart
