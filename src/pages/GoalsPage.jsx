import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { redistributeGoals } from '../utils/calculations'
import Header from '../components/Header'
import DonutChart from '../components/DonutChart'
import RadialProgressAdjuster from '../components/RadialProgressAdjuster'
import { translations } from '../utils/translations'
import { 
  Briefcase, 
  Rocket, 
  Sofa, 
  Target, 
  PartyPopper, 
  BookOpen, 
  Check,
  AlertTriangle
} from 'lucide-react'
import './GoalsPage.css'

const getCategoryIcon = (id) => {
  switch (id) {
    case 'custos-fixos':
      return Briefcase
    case 'liberdade':
      return Rocket
    case 'conforto':
      return Sofa
    case 'metas':
      return Target
    case 'prazeres':
      return PartyPopper
    case 'conhecimento':
      return BookOpen
    default:
      return Target
  }
}

const GoalsPage = () => {
  const navigate = useNavigate()
  const { categoriesGoals, updateCategoryGoal, resetGoals, lang } = useFinance()
  
  const [localGoals, setLocalGoals] = useState(categoriesGoals)
  const [showResetModal, setShowResetModal] = useState(false)
  const [justHit100, setJustHit100] = useState(false)
  
  const handleSliderChange = (index, newValue) => {
    const updated = redistributeGoals(localGoals, index, parseInt(newValue, 10))
    setLocalGoals(updated)
  }
  
  const handleResetClick = () => {
    setShowResetModal(true)
  }
  
  const handleResetConfirm = () => {
    resetGoals()
    setLocalGoals(categoriesGoals)
    setShowResetModal(false)
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  
  const handleResetCancel = () => {
    setShowResetModal(false)
  }
  
  const handleSave = () => {
    localGoals.forEach(cat => {
      updateCategoryGoal(cat.id, cat.percentage)
    })
    navigate('/')
  }
  
  const totalPercentage = localGoals.reduce((sum, cat) => sum + cat.percentage, 0)
  
  // Bounce animation when hitting 100%
  useEffect(() => {
    if (totalPercentage === 100) {
      setJustHit100(true)
      const timer = setTimeout(() => setJustHit100(false), 800)
      return () => clearTimeout(timer)
    }
  }, [totalPercentage])

  const t = translations[lang] || translations.en

  return (
    <div className="page goals-page">
      <Header />
      <main className="page-content">
        <div className="goals-layout">
          {/* Coluna Esquerda: Gráfico de Rosca */}
          <div className="goals-section chart-section">
            {totalPercentage !== 100 && (
              <div className="chart-header">
                <p className="warning-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> {t.goalsStudio.warning}
                </p>
              </div>
            )}
            
            <DonutChart categories={localGoals} height={120} innerRadius={35} outerRadius={55} />
            
            <div className="chart-legend">
              {localGoals.map(cat => (
                <div key={cat.id} className="legend-item">
                  <div className="legend-left">
                    <span className="legend-color" style={{ backgroundColor: cat.color }} />
                    <span className="legend-name">{t.categories[cat.id] || cat.name}</span>
                  </div>
                  <span className="legend-percentage">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Coluna Direita: Studio Cards */}
          <div className="goals-section sliders-section">
            {/* Top allocation progress bar summary */}
            <div className={`budget-summary-card ${justHit100 ? 'trigger-bounce' : ''} ${totalPercentage === 100 ? 'is-complete' : ''}`}>
              <div className="summary-info">
                <span className="summary-label">{t.goalsStudio.summaryTitle}</span>
                <span className="summary-status">
                  {totalPercentage === 100 && (
                    <span className="haptic-check-bounce">
                      <Check size={16} className="check-icon-active" />
                    </span>
                  )}
                  <strong>{totalPercentage}%</strong> {t.goalsStudio.used}
                  {totalPercentage < 100 && ` (${100 - totalPercentage}% ${t.goalsStudio.remaining})`}
                </span>
              </div>
              <div className="summary-progress-bar-bg">
                <div 
                  className={`summary-progress-bar-fill ${
                    totalPercentage === 100 ? 'status-green' : totalPercentage > 100 ? 'status-red' : 'status-orange'
                  }`}
                  style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="budget-studio-grid">
              {localGoals.map((cat, index) => {
                const IconComponent = getCategoryIcon(cat.id);
                const description = t.categoryDescriptions[cat.id] || '';
                return (
                  <div key={cat.id} className="studio-card" style={{ '--glow-color': cat.color }}>
                    {/* Left Side: SVG Dial */}
                    <div className="studio-card-left">
                      <RadialProgressAdjuster 
                        cat={cat} 
                        onChange={(newVal) => handleSliderChange(index, newVal)} 
                      />
                    </div>
                    
                    {/* Right Side: Meta controls */}
                    <div className="studio-card-right">
                      <div className="studio-card-header">
                        <div className="studio-card-icon" style={{ color: cat.color, backgroundColor: `${cat.color}15` }}>
                          <IconComponent size={18} />
                        </div>
                        <h3>{t.categories[cat.id] || cat.name}</h3>
                      </div>
                      
                      <p className="card-desc">{description}</p>
                      
                      <div className="radial-controls-pill">
                        <button 
                          className="btn-control-step minus" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSliderChange(index, Math.max(0, cat.percentage - 1));
                          }}
                          title="Diminuir 1%"
                        >
                          −
                        </button>
                        <div className="control-divider" />
                        <button 
                          className="btn-control-step plus" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSliderChange(index, Math.min(100, cat.percentage + 1));
                          }}
                          title="Aumentar 1%"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="goals-actions">
              <button className="btn btn-secondary btn-outline-reset" onClick={handleResetClick}>
                {lang === 'pt' ? 'Resetar valores' : 'Reset values'}
              </button>
              <button 
                className={`btn btn-primary btn-save-studio ${totalPercentage === 100 ? 'ready' : ''}`}
                onClick={handleSave}
                disabled={totalPercentage !== 100}
              >
                {lang === 'pt' ? 'Salvar' : 'Save'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="modal-overlay" onClick={handleResetCancel}>
            <div className="modal-content reset-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} className="warning-icon" style={{ color: 'var(--accent-primary, #d4a259)' }} /> {t.goalsStudio.confirmResetTitle}
                </h2>
              </div>
              
              <div className="modal-body">
                <p className="modal-text">
                  {t.goalsStudio.confirmResetText}
                </p>
                
                <div className="recommended-values">
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#4a90e2' }} />
                    <span className="value-label">{t.categories['custos-fixos']}:</span>
                    <span className="value-percent">35%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#00d4aa' }} />
                    <span className="value-label">{t.categories['conforto']}:</span>
                    <span className="value-percent">15%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#f5d547' }} />
                    <span className="value-label">{t.categories['metas']}:</span>
                    <span className="value-percent">10%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#d946ef' }} />
                    <span className="value-label">{t.categories['prazeres']}:</span>
                    <span className="value-percent">10%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#8b5cf6' }} />
                    <span className="value-label">{t.categories['liberdade']}:</span>
                    <span className="value-percent">25%</span>
                  </div>
                  <div className="value-item">
                    <span className="value-dot" style={{ backgroundColor: '#fb923c' }} />
                    <span className="value-label">{t.categories['conhecimento']}:</span>
                    <span className="value-percent">5%</span>
                  </div>
                </div>
                
                <p className="modal-warning">
                  {t.goalsStudio.warningSubstitute}
                </p>
              </div>
              
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleResetCancel}>
                  {t.confirmResetCancel || (lang === 'pt' ? 'Cancelar' : 'Cancel')}
                </button>
                <button className="btn btn-danger" onClick={handleResetConfirm}>
                  {t.confirmResetConfirm || (lang === 'pt' ? 'Sim, Resetar' : 'Yes, Reset')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default GoalsPage
