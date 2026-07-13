import { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import Header from '../components/Header'
import { translations } from '../utils/translations'
import { Plus, Trash2, Edit2, ShieldAlert, ArrowUpRight, ArrowDownRight, Check, Sparkles, HelpCircle } from 'lucide-react'
import { formatCurrency } from '../utils/calculations'
import InvestmentModal from '../components/InvestmentModal'
import ConfirmModal from '../components/ConfirmModal'
import './PortfolioPage.css'

const PortfolioPage = () => {
  const {
    lang,
    investments,
    totalInvestments,
    addInvestment,
    updateInvestment,
    removeInvestment,
    portfolioTargets,
    updatePortfolioTargets
  } = useFinance()

  const isPt = lang === 'pt'

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [investmentToDelete, setInvestmentToDelete] = useState(null)

  // Target values state
  const [targets, setTargets] = useState(() => ({
    cripto: portfolioTargets.cripto || 10,
    selic: portfolioTargets.selic || 30,
    fiis: portfolioTargets.fiis || 20,
    acoes: portfolioTargets.acoes || 20,
    internacional: portfolioTargets.internacional || 10,
    caixa: portfolioTargets.caixa || 10
  }))

  const assetClasses = useMemo(() => [
    { key: 'selic', namePt: 'Tesouro Selic / Renda Fixa', nameEn: 'Treasury Selic / Fixed Income', color: '#3b82f6' },
    { key: 'fiis', namePt: 'Fundos Imobiliários (FIIs)', nameEn: 'Real Estate Funds (FIIs)', color: '#10b981' },
    { key: 'acoes', namePt: 'Ações Brasileiras', nameEn: 'Brazilian Stocks', color: '#f59e0b' },
    { key: 'cripto', namePt: 'Criptomoedas', nameEn: 'Cryptocurrencies', color: '#8b5cf6' },
    { key: 'internacional', namePt: 'Ativos Internacionais', nameEn: 'International Assets', color: '#ec4899' },
    { key: 'caixa', namePt: 'Caixa / Oportunidade', nameEn: 'Cash / Liquidity', color: '#6b7280' }
  ], [])

  const sumTargets = useMemo(() => {
    return Object.values(targets).reduce((sum, val) => sum + Number(val || 0), 0)
  }, [targets])

  const isTargetValid = sumTargets === 100

  // Asset class dictionary for translation
  const assetClassNames = useMemo(() => {
    const dict = {}
    assetClasses.forEach(ac => {
      dict[ac.key] = isPt ? ac.namePt : ac.nameEn
    })
    return dict
  }, [assetClasses, isPt])

  // Save new target allocation
  const handleSaveTargets = () => {
    if (!isTargetValid) return
    updatePortfolioTargets(targets)
  }

  const handleTargetChange = (key, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val) || 0))
    setTargets(prev => ({ ...prev, [key]: num }))
  }

  const handleRestoreDefaults = () => {
    setTargets({
      cripto: 10,
      selic: 30,
      fiis: 20,
      acoes: 20,
      internacional: 10,
      caixa: 10
    })
  }

  // Calculate actual sums per asset class
  const classStats = useMemo(() => {
    const stats = {}
    assetClasses.forEach(ac => {
      stats[ac.key] = { amount: 0, percentage: 0 }
    })

    investments.forEach(inv => {
      const cls = inv.assetClass || 'caixa'
      if (stats[cls]) {
        stats[cls].amount += inv.amount || 0
      }
    })

    if (totalInvestments > 0) {
      assetClasses.forEach(ac => {
        stats[ac.key].percentage = (stats[ac.key].amount / totalInvestments) * 100
      })
    }

    return stats
  }, [investments, totalInvestments, assetClasses])

  // Rebalancing advice calculation
  const rebalanceData = useMemo(() => {
    return assetClasses.map(ac => {
      const targetPercent = portfolioTargets[ac.key] !== undefined ? portfolioTargets[ac.key] : targets[ac.key]
      const actualAmount = classStats[ac.key].amount
      const targetAmount = totalInvestments * (targetPercent / 100)
      const diff = targetAmount - actualAmount

      return {
        ...ac,
        targetPercent,
        actualAmount,
        targetAmount,
        diff
      }
    })
  }, [assetClasses, portfolioTargets, targets, classStats, totalInvestments])

  // Investment Crud Handlers
  const handleAddClick = () => {
    setEditingInvestment(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (inv) => {
    setEditingInvestment(inv)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (inv) => {
    setInvestmentToDelete(inv)
    setIsConfirmOpen(true)
  }

  const handleSaveInvestment = (data) => {
    if (editingInvestment) {
      updateInvestment(editingInvestment.id, {
        name: data.name,
        amount: data.amount,
        assetClass: data.assetClass || 'caixa'
      })
    } else {
      addInvestment(data.name, data.amount, data.assetClass || 'caixa')
    }
    setIsModalOpen(false)
  }

  const handleConfirmDelete = () => {
    if (investmentToDelete) {
      removeInvestment(investmentToDelete.id)
      setIsConfirmOpen(false)
      setInvestmentToDelete(null)
    }
  }

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content portfolio-page">
        {/* Top Summary Card */}
        <div className="portfolio-balance-card">
          <div className="balance-info-left">
            <h2 className="portfolio-title-text">{isPt ? 'Carteira de Investimentos' : 'Investment Portfolio'}</h2>
            <p className="portfolio-subtitle-text">
              {isPt 
                ? 'Monitore a alocação de suas classes de ativos e realize o rebalanceamento inteligente de patrimônio.' 
                : 'Monitor asset class distribution and perform smart portfolio rebalancing.'}
            </p>
          </div>
          <div className="total-portfolio-badge">
            <span className="badge-title">{isPt ? 'Total Investido' : 'Total Invested'}</span>
            <span className="badge-value">{formatCurrency(totalInvestments)}</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="portfolio-layout-grid">
          
          {/* Column Left: Assets Classes & Target Setup */}
          <div className="portfolio-left-column">
            
            {/* Allocation Target Settings Card */}
            <div className="allocation-targets-card">
              <div className="card-header-row">
                <h3>{isPt ? 'Definição de Metas' : 'Allocation Targets'}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={handleRestoreDefaults}
                    className="action-icon-btn"
                    style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}
                    title={isPt ? 'Restaurar alocação padrão sugerida pelo FinHelper' : 'Restore suggested default asset allocation'}
                  >
                    {isPt ? 'Padrão' : 'Default'}
                  </button>
                  <span className={`sum-badge ${isTargetValid ? 'valid' : 'invalid'}`}>
                    {isPt ? 'Total: ' : 'Total: '}{sumTargets}%
                  </span>
                </div>
              </div>
              <p className="card-description">
                {isPt 
                  ? 'Ajuste os alvos planejados para cada classe de ativos. A soma deve fechar em exatamente 100%.' 
                  : 'Adjust the target goals for each asset class. The sum must equal exactly 100%.'}
              </p>

              <div className="targets-inputs-list">
                {assetClasses.map(ac => (
                  <div key={ac.key} className="target-input-row" style={{ '--accent': ac.color }}>
                    <div className="class-indicator-dot">
                      <span className="dot-icon" style={{ backgroundColor: ac.color }} />
                      <span className="class-label">{isPt ? ac.namePt : ac.nameEn}</span>
                    </div>
                    <div className="number-input-wrapper">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={targets[ac.key]}
                        onChange={(e) => handleTargetChange(ac.key, e.target.value)}
                        className="target-pct-input"
                      />
                      <span className="pct-symbol">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className={`btn btn-primary w-full save-targets-btn ${!isTargetValid ? 'disabled' : ''}`}
                onClick={handleSaveTargets}
                disabled={!isTargetValid}
              >
                <Check size={16} /> {isPt ? 'Salvar Alvos' : 'Save Targets'}
              </button>
            </div>

            {/* Smart Portfolio Rebalancer Plan */}
            <div className="rebalancer-card">
              <div className="rebalancer-header">
                <Sparkles size={16} className="spark-icon" />
                <h3>{isPt ? 'Plano de Rebalanceamento' : 'Rebalancing Advice'}</h3>
              </div>
              <p className="card-description">
                {isPt 
                  ? 'Instruções baseadas em seus alvos para guiar os seus próximos aportes.'
                  : 'Actionable plan based on targets to guide your next deposits.'}
              </p>

              {totalInvestments === 0 ? (
                <div className="rebalancer-empty-state">
                  <HelpCircle size={32} />
                  <p>{isPt ? 'Adicione investimentos para calcular o plano.' : 'Add investments to calculate rebalance plan.'}</p>
                </div>
              ) : (
                <div className="rebalance-plan-list">
                  {rebalanceData.map(ac => {
                    const absDiff = Math.abs(ac.diff)
                    if (absDiff < 5) return null // Ignorar variações insignificantes

                    const isBuy = ac.diff > 0

                    return (
                      <div key={ac.key} className={`rebalance-item ${isBuy ? 'buy' : 'sell'}`}>
                        <div className="rebalance-left-info">
                          <span className="class-tag-name">{isPt ? ac.namePt : ac.nameEn}</span>
                          <span className="class-subtext">
                            {isPt ? 'Alvo: ' : 'Target: '}{ac.targetPercent}% | {isPt ? 'Atual: ' : 'Current: '}{classStats[ac.key].percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="rebalance-right-actions">
                          {isBuy ? (
                            <>
                              <ArrowUpRight size={16} className="rebalance-arrow buy" />
                              <span className="rebalance-advice buy">
                                {isPt ? 'Comprar ' : 'Buy '}{formatCurrency(absDiff)}
                              </span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight size={16} className="rebalance-arrow sell" />
                              <span className="rebalance-advice sell">
                                {isPt ? 'Aguardar ' : 'Hold/Reduce '}{formatCurrency(absDiff)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {rebalanceData.every(ac => Math.abs(ac.diff) < 5) && (
                    <div className="rebalancer-balanced-state">
                      <Check size={20} className="balanced-success-icon" />
                      <p>{isPt ? 'Sua carteira está perfeitamente balanceada!' : 'Your portfolio is perfectly balanced!'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Column Right: Comparative Allocation Graphs and Registered Assets */}
          <div className="portfolio-right-column">
            
            {/* Allocation Breakdown Progress Bars Card */}
            <div className="allocation-progress-card">
              <h3>{isPt ? 'Alocação Atual vs Alvo' : 'Current vs Target Allocation'}</h3>
              <p className="card-description">
                {isPt 
                  ? 'Comparação visual entre o percentual real da sua carteira e o alvo planejado.'
                  : 'Visual comparison between your current holdings share and the planned target.'}
              </p>

              <div className="progress-bars-stack">
                {assetClasses.map(ac => {
                  const target = portfolioTargets[ac.key] !== undefined ? portfolioTargets[ac.key] : targets[ac.key]
                  const actual = classStats[ac.key].percentage
                  const amount = classStats[ac.key].amount

                  return (
                    <div key={ac.key} className="progress-bar-group">
                      <div className="progress-bar-labels">
                        <span className="class-name">{isPt ? ac.namePt : ac.nameEn}</span>
                        <span className="class-values">
                          {formatCurrency(amount)} ({actual.toFixed(1)}% / {target}%)
                        </span>
                      </div>
                      
                      {/* Bar tracks */}
                      <div className="double-progress-track">
                        <div 
                          className="actual-progress-fill" 
                          style={{ width: `${actual}%`, backgroundColor: ac.color }}
                          title={`Actual: ${actual.toFixed(1)}%`}
                        />
                        <div 
                          className="target-marker-indicator" 
                          style={{ left: `${target}%` }}
                          title={`Target: ${target}%`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Assets Management Table */}
            <div className="portfolio-assets-table-card">
              <div className="card-header-row border-b">
                <h3>{isPt ? 'Ativos Cadastrados' : 'Registered Investments'}</h3>
                <button className="btn btn-primary btn-sm btn-icon" onClick={handleAddClick}>
                  <Plus size={14} /> {isPt ? 'Adicionar' : 'Add'}
                </button>
              </div>

              {investments.length === 0 ? (
                <div className="panel-empty-state">
                  <p>{isPt ? 'Nenhum investimento cadastrado neste mês.' : 'No investments logged in this month.'}</p>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddClick}>
                    {isPt ? 'Cadastrar Primeiro' : 'Log First Asset'}
                  </button>
                </div>
              ) : (
                <div className="portfolio-table-container">
                  <table className="portfolio-table">
                    <thead>
                      <tr>
                        <th>{isPt ? 'Nome' : 'Name'}</th>
                        <th>{isPt ? 'Classe' : 'Class'}</th>
                        <th className="text-right">{isPt ? 'Valor' : 'Value'}</th>
                        <th className="text-right">%</th>
                        <th className="text-center">{isPt ? 'Ações' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments.map(inv => {
                        const pct = totalInvestments > 0 ? (inv.amount / totalInvestments) * 100 : 0
                        return (
                          <tr key={inv.id}>
                            <td className="font-bold text-white">{inv.name}</td>
                            <td>
                              <span 
                                className="class-badge" 
                                style={{ 
                                  borderColor: `${(assetClasses.find(a => a.key === inv.assetClass) || {color: '#6b7280'}).color}30`,
                                  color: (assetClasses.find(a => a.key === inv.assetClass) || {color: '#6b7280'}).color 
                                }}
                              >
                                {assetClassNames[inv.assetClass || 'caixa']}
                              </span>
                            </td>
                            <td className="text-right font-mono text-white">{formatCurrency(inv.amount)}</td>
                            <td className="text-right font-mono">{pct.toFixed(1)}%</td>
                            <td className="text-center">
                              <div className="table-actions">
                                <button className="action-icon-btn edit" onClick={() => handleEditClick(inv)} title={isPt ? 'Editar' : 'Edit'}>
                                  <Edit2 size={13} />
                                </button>
                                <button className="action-icon-btn delete" onClick={() => handleDeleteClick(inv)} title={isPt ? 'Excluir' : 'Delete'}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Create / Edit Investment Modal with Asset Class selection dropdown */}
        {isModalOpen && (
          <InvestmentModalWithClass
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveInvestment}
            investment={editingInvestment}
            assetClasses={assetClasses}
            lang={lang}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title={isPt ? 'Excluir Investimento' : 'Delete Investment'}
          message={isPt ? 'Tem certeza que deseja excluir este investimento? Ele será desvinculado de sua subcategoria de Liberdade Financeira e do resumo de orçamento.' : 'Are you sure you want to delete this investment? It will be unlinked from your Financial Freedom subcategory and budget summary.'}
        />

      </main>
    </div>
  )
}

// Inline Sub-Component: Investment Modal incorporating class dropdown to avoid file creation overhead
const InvestmentModalWithClass = ({ isOpen, onClose, onSave, investment, assetClasses, lang }) => {
  const isPt = lang === 'pt'
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [assetClass, setAssetClass] = useState('caixa')

  useState(() => {
    if (investment) {
      setName(investment.name || '')
      setAmount(investment.amount ? investment.amount.toString() : '')
      setAssetClass(investment.assetClass || 'caixa')
    }
  }, [investment])

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(isPt ? 'Por favor, preencha todos os campos corretamente.' : 'Please fill in all fields correctly.')
      return
    }

    onSave({
      name: name.trim(),
      amount: parsedAmount,
      assetClass
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{investment ? (isPt ? 'Editar Investimento' : 'Edit Investment') : (isPt ? 'Novo Investimento' : 'New Investment')}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>{isPt ? 'Nome do Investimento' : 'Investment Name'}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isPt ? 'Ex: Bitcoin, CDB, Tesouro...' : 'Ex: Bitcoin, CDB, Treasury...'}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>{isPt ? 'Valor' : 'Amount'}</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>{isPt ? 'Classe de Ativo' : 'Asset Class'}</label>
            <select 
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value)}
              className="timezone-select w-full"
              style={{ background: 'var(--bg-primary, #09090b)', padding: '10px 14px', borderRadius: '10px', width: '100%', outline: 'none' }}
            >
              {assetClasses.map(ac => (
                <option key={ac.key} value={ac.key}>
                  {isPt ? ac.namePt : ac.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {isPt ? 'Cancelar' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary">
              {isPt ? 'Salvar' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PortfolioPage
