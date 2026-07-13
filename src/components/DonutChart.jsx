import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './DonutChart.css'

const DonutChart = ({ categories, height = 300, innerRadius = 80, outerRadius = 120 }) => {
  // Filter out categories with 0% to avoid visual clutter
  const dataToShow = categories.filter(cat => cat.percentage > 0)
  
  const data = dataToShow.map(cat => ({
    name: cat.name,
    value: cat.percentage,
    color: cat.color
  }))

  const total = categories.reduce((sum, cat) => sum + (Number(cat.percentage) || 0), 0)
  
  return (
    <div className="donut-chart-wrapper" style={{ position: 'relative', width: '100%', height: height }}>
      {dataToShow.length === 0 ? (
        <div className="empty-chart" style={{ height: height }}>
          <p>Defina suas metas usando os sliders abaixo</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center-content">
            <span className="donut-center-label">TOTAL</span>
            <span className={`donut-center-value ${total !== 100 ? 'warning' : ''}`}>
              {total}%
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default DonutChart
