import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, calculateBudget, calculateUtilization } from '../utils/calculations'
import { translations } from '../utils/translations'
import Header from '../components/Header'
import MonthSelector from '../components/MonthSelector'
import EditableCell from '../components/EditableCell'
import InvestmentModal from '../components/InvestmentModal'
import DebtModal from '../components/DebtModal'
import ConfirmModal from '../components/ConfirmModal'
import SubcategoryModal from '../components/SubcategoryModal'
import SubcategoryRow from '../components/SubcategoryRow'
import CategoryManagerModal from '../components/CategoryManagerModal'
import GoalsSection from '../components/GoalsSection'

import { EditIcon, DeleteIcon, PlusIcon, SettingsIcon, ActivityIcon, SparklesIcon, ShieldAlertIcon } from '../components/Icons'
import './BudgetPage.css'

const BudgetPage = () => {
  const navigate = useNavigate()
  const {
    lang,
    userName,
    monthlyIncome,
    categoriesGoals,
    categorySpent,
    expenses,
    totalExpenses,
    savingsAmount,
    savingsRate,
    topCategory,
    updateCategorySpent,
    investments,
    totalInvestments,
    addInvestment,
    updateInvestment,
    removeInvestment,
    debts,
    totalDebts,
    totalPaidDebts,
    totalUnpaidDebts,
    addDebt,
    updateDebt,
    removeDebt,
    toggleDebtPaid,
    addSubcategory,
    updateSubcategory,
    removeSubcategory,
  } = useFinance()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState(null)
  
  // Confirmation modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [investmentToDelete, setInvestmentToDelete] = useState(null)
  
  // Investment handlers
  const handleAddInvestment = () => {
    setEditingInvestment(null)
    setIsModalOpen(true)
  }
  
  const handleEditInvestment = (investment) => {
    setEditingInvestment(investment)
    setIsModalOpen(true)
  }
  
  const handleSaveInvestment = (data) => {
    if (editingInvestment) {
      updateInvestment(editingInvestment.id, data)
    } else {
      addInvestment(data.name, data.amount)
    }
    setIsModalOpen(false)
    setEditingInvestment(null)
  }
  
  const handleDeleteInvestment = (investment) => {
    setInvestmentToDelete(investment)
    setIsConfirmOpen(true)
  }
  
  const confirmDelete = () => {
    if (investmentToDelete) {
      removeInvestment(investmentToDelete.id)
    }
    setIsConfirmOpen(false)
    setInvestmentToDelete(null)
  }
  
  const cancelDelete = () => {
    setIsConfirmOpen(false)
    setInvestmentToDelete(null)
  }
  
  // Debt modal state
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState(null)
  const [isDebtConfirmOpen, setIsDebtConfirmOpen] = useState(false)
  const [debtToDelete, setDebtToDelete] = useState(null)
  
  // Subcategory state
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  
  // Debt handlers
  const handleAddDebt = () => {
    setEditingDebt(null)
    setIsDebtModalOpen(true)
  }
  
  const handleEditDebt = (debt) => {
    setEditingDebt(debt)
    setIsDebtModalOpen(true)
  }
  
  const handleSaveDebt = (data) => {
    if (editingDebt) {
      updateDebt(editingDebt.id, data)
    } else {
      addDebt(data.name, data.amount, data.dueDate, data.isPaid)
    }
    setIsDebtModalOpen(false)
    setEditingDebt(null)
  }
  
  const handleDeleteDebt = (debt) => {
    setDebtToDelete(debt)
    setIsDebtConfirmOpen(true)
  }
  
  const confirmDeleteDebt = () => {
    if (debtToDelete) {
      removeDebt(debtToDelete.id)
    }
    setIsDebtConfirmOpen(false)
    setDebtToDelete(null)
  }
  
  const cancelDeleteDebt = () => {
    setIsDebtConfirmOpen(false)
    setDebtToDelete(null)
  }
  
  // Subcategory handlers
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }
  
  const handleAddSubcategory = (category) => {
    setSelectedCategory(category)
    setIsSubcategoryModalOpen(true)
  }
  
  const handleSaveSubcategory = (data) => {
    if (selectedCategory) {
      addSubcategory(selectedCategory.id, data)
    }
    setIsSubcategoryModalOpen(false)
    setSelectedCategory(null)
  }
  
  const handleUpdateSubcategory = (categoryId, subcategoryId, updates) => {
    updateSubcategory(categoryId, subcategoryId, updates)
  }
  
  const handleRemoveSubcategory = (categoryId, subcategoryId) => {
    removeSubcategory(categoryId, subcategoryId)
  }
  
  const getCompactFinancialHealth = () => {
    const isPt = lang === 'pt'
    const savings = monthlyIncome - totalExpenses
    
    if (monthlyIncome <= 0) {
      return {
        title: isPt ? 'Renda Não Definida' : 'Income Not Set',
        text: isPt ? 'Defina sua renda mensal para iniciar a análise.' : 'Define your monthly income to start the analysis.',
        type: 'info'
      }
    }

    if (savings < 0) {
      return {
        title: isPt ? 'Atenção ao Orçamento' : 'Budget Warning',
        text: isPt ? 'Gastos excederam a renda. Considere reduzir custos discricionários.' : 'Expenses exceeded income. Consider reducing discretionary costs.',
        type: 'warning'
      }
    }

    if (savingsRate >= 25) {
      return {
        title: isPt ? 'Excelente Saúde' : 'Excellent Health',
        text: isPt ? `Você poupou ${savingsRate.toFixed(0)}% da renda este mês. Continue assim!` : `You saved ${savingsRate.toFixed(0)}% of income this month. Keep it up!`,
        type: 'success'
      }
    }

    if (savingsRate >= 10) {
      return {
        title: isPt ? 'Orçamento Seguro' : 'Secure Budget',
        text: isPt ? `Você poupou ${savingsRate.toFixed(0)}% da renda. Boa consistência.` : `You saved ${savingsRate.toFixed(0)}% of income. Good consistency.`,
        type: 'success'
      }
    }

    return {
      title: isPt ? 'Alerta de Poupança' : 'Savings Alert',
      text: isPt ? 'Taxa de poupança abaixo de 10%. Tente cortar gastos extras.' : 'Savings rate below 10%. Try cutting extra expenses.',
      type: 'warning'
    }
  }

  const healthInfo = getCompactFinancialHealth()

  return (
    <div className="page budget-page">
      <Header />
      
      <main className="page-content">
        <div className="budget-top-bar">
          <MonthSelector />
        </div>

        {/* Compact Monthly Overview (Full Width) */}
        <div className="monthly-overview-bar" id="tour-overview">
          <div className="overview-card income">
            <span className="card-label">{translations[lang].monthlyIncome}</span>
            <span className="card-val">{formatCurrency(monthlyIncome)}</span>
          </div>
          <div className="overview-card expenses">
            <span className="card-label">{translations[lang].regularExpenses}</span>
            <span className="card-val">{formatCurrency(totalExpenses - totalInvestments)}</span>
          </div>
          <div className="overview-card investments">
            <span className="card-label">{translations[lang].investmentsTitle}</span>
            <span className="card-val">{formatCurrency(totalInvestments)}</span>
          </div>
          <div className="overview-card remaining">
            <span className="card-label">{translations[lang].availableBalance}</span>
            <span className="card-val">{formatCurrency(monthlyIncome - totalExpenses - totalPaidDebts)}</span>
          </div>
        </div>

        {/* Bloco de Saúde Financeira Compacto */}
        <div className={`financial-health-advisor compact ${healthInfo.type}`}>
          <div className="advisor-header">
            {healthInfo.type === 'warning' ? (
              <ShieldAlertIcon size={14} className="icon-warning" />
            ) : (
              <SparklesIcon size={14} className="icon-success" />
            )}
            <span className="advisor-title">{healthInfo.title}:</span>
          </div>
          <span className="advisor-text">{healthInfo.text}</span>
        </div>
        
        {/* Layout Principal: 2 Colunas */}
        <div className="budget-layout">
          {/* Coluna Esquerda: Resumo + Dívidas */}
          <div className="left-column">
            {/* Resumo */}
            <div className="budget-section summary-section" id="tour-summary">
              <div className="section-header">
                <h2>{translations[lang].summary}</h2>
                <button 
                  className="manage-categories-btn" 
                  onClick={() => setIsCategoryManagerOpen(true)}
                >
                  <SettingsIcon size={14} /> {translations[lang].manageCategories}
                </button>
              </div>
              
              <div className="summary-table">
                <div className="table-header">
                  <div>{translations[lang].categoryLabel}</div>
                  <div>{translations[lang].actual} / {translations[lang].planned}</div>
                  <div>{translations[lang].remainingCat}</div>
                </div>
                
                {categoriesGoals.map(cat => {
                  const budget = calculateBudget(monthlyIncome, cat.percentage)
                  // For Liberdade financeira, use totalInvestments instead of manual spent
                  const spent = cat.id === 'liberdade' ? totalInvestments : (categorySpent[cat.id] || 0)
                  const utilization = calculateUtilization(spent, budget)
                  const remaining = budget - spent
                  const isExpanded = expandedCategories[cat.id]
                  const hasSubcategories = cat.subcategories && cat.subcategories.length > 0
                  
                  let rowHighlight = ''
                  if (utilization > 100) {
                    rowHighlight = 'row-danger'
                  } else if (utilization > 80) {
                    rowHighlight = 'row-warning'
                  }
                  
                  return (
                    <div key={cat.id} className="category-wrapper">
                      {/* Main category row */}
                      <div className={`table-row ${rowHighlight}`}>
                        {/* Category Meta: Title + Inline Usage Info */}
                        <div className="category-meta">
                          <div className="category-title-area">
                            <span 
                              className="chevron-inline"
                              onClick={() => toggleCategory(cat.id)}
                              title={isExpanded ? "Recolher" : "Expandir"}
                            >
                              {isExpanded ? '▼' : '▶'}
                            </span>
                            <span className="cat-color-dot-large" style={{ backgroundColor: cat.color }} />
                            <span 
                              className="category-name-text clickable" 
                              onClick={() => toggleCategory(cat.id)}
                            >
                              {translations[lang].categories[cat.id] || cat.name}
                            </span>
                          </div>
                          
                          {/* Embutida: Barra de progresso ultra fina e percentual */}
                          <div className="category-usage-wrapper">
                            <div className="category-usage-bar-track">
                              <div 
                                className="category-usage-bar-fill"
                                style={{ 
                                  width: `${Math.min(utilization, 100)}%`,
                                  backgroundColor: utilization > 100 ? 'var(--danger)' : cat.color
                                }}
                              />
                            </div>
                            <span className={`category-usage-text ${utilization > 100 ? 'text-danger' : ''}`}>
                              {utilization.toFixed(1)}% {translations[lang].utilization.toLowerCase()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Gasto / Recomendado */}
                        <div className="category-actual-planned">
                          {cat.id === 'liberdade' || hasSubcategories ? (
                            <span className="non-editable-val">{formatCurrency(spent)}</span>
                          ) : (
                            <EditableCell 
                              value={spent}
                              onSave={updateCategorySpent}
                              categoryId={cat.id}
                            />
                          )}
                          <span className="value-divider">/</span>
                          <span className="planned-val">{formatCurrency(budget)}</span>
                        </div>

                        {/* Restante */}
                        <div className={`cell-remaining ${remaining < 0 ? 'negative' : ''}`}>
                          {formatCurrency(remaining)}
                        </div>
                      </div>
                      
                      {/* Expanded subcategories row (full width) */}
                      {isExpanded && (
                        <div className="expanded-row">
                          <div className="subcat-box">
                            {/* Subcategories list */}
                            {hasSubcategories && (
                              <div className="subcat-list">
                                {cat.subcategories.map(sub => (
                                  <SubcategoryRow
                                    key={sub.id}
                                    subcategory={sub}
                                    onUpdate={(subId, updates) => handleUpdateSubcategory(cat.id, subId, updates)}
                                    onDelete={(subId) => handleRemoveSubcategory(cat.id, subId)}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Footer with button and subtotal */}
                            <div className="subcat-footer">
                              <button 
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleAddSubcategory(cat)}
                              >
                                <PlusIcon size={12} /> {translations[lang].addSubcategory}
                              </button>
                              
                              {hasSubcategories && (
                                <div className="subcat-subtotal">
                                  <span>Subtotal:</span>
                                  <span className="subtotal-value">{formatCurrency(spent)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                <div className="table-footer">
                  <div className="table-footer-row">
                    <div className="footer-cell-label">Total</div>
                    <div className="total-actual-planned">
                      <span>{formatCurrency(totalExpenses)}</span>
                      <span className="value-divider">/</span>
                      <span>{formatCurrency(monthlyIncome)}</span>
                    </div>
                    <div className={`cell-remaining ${monthlyIncome - totalExpenses < 0 ? 'negative' : ''}`}>
                      {formatCurrency(monthlyIncome - totalExpenses)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dívidas */}
            <div className="budget-section debts-section" id="tour-debts">
                <div className="section-header">
                  <h2>{translations[lang].debtsTitle}</h2>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddDebt}>
                    <PlusIcon size={14} /> {translations[lang].addDebt}
                  </button>
                </div>
                
                {debts.length === 0 ? (
                  <div className="empty-state-compact">
                    <span>{translations[lang].noDebtsLogged}</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleAddDebt}>
                      {translations[lang].emptyStartNow}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="debts-compact-list">
                      {debts.map(debt => {
                        const dueDate = debt.dueDate ? new Date(debt.dueDate) : null
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const isOverdue = !debt.isPaid && dueDate && dueDate < today
                        
                        let statusColorClass = 'pending'
                        let statusLabel = translations[lang].unpaid
                        if (debt.isPaid) {
                          statusColorClass = 'paid'
                          statusLabel = translations[lang].paid
                        } else if (isOverdue) {
                          statusColorClass = 'overdue'
                          statusLabel = lang === 'pt' ? 'Atrasada' : 'Overdue'
                        }

                        return (
                          <div key={debt.id} className={`debt-list-item ${debt.isPaid ? 'is-paid' : ''}`}>
                            <div className="debt-checkbox-cell">
                              <label className="debt-check-wrapper" title={debt.isPaid ? translations[lang].paid : translations[lang].unpaid}>
                                <input
                                  type="checkbox"
                                  checked={debt.isPaid}
                                  onChange={() => toggleDebtPaid(debt.id)}
                                  className="debt-check-input"
                                />
                                <span className="debt-check-mark" />
                              </label>
                            </div>
                            
                            <div className="debt-info-cell">
                              <span className="debt-name">{debt.name}</span>
                              <span className="debt-due">
                                {dueDate 
                                  ? dueDate.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') 
                                  : (lang === 'pt' ? 'Sem vencimento' : 'No date')}
                              </span>
                            </div>
                            
                            <div className="debt-amount-cell">
                              {formatCurrency(debt.amount)}
                            </div>
                            
                            <div className="debt-status-cell">
                              <span className={`status-badge ${statusColorClass}`}>
                                {statusLabel}
                              </span>
                            </div>

                            <div className="debt-actions">
                              <button 
                                onClick={() => handleEditDebt(debt)}
                                className="action-icon-btn edit"
                                title="Editar"
                              >
                                <EditIcon size={12} />
                              </button>
                              <button 
                                className="action-icon-btn delete"
                                onClick={() => handleDeleteDebt(debt)}
                                title="Excluir"
                              >
                                <DeleteIcon size={12} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="debts-footer">
                      <div className="footer-stats">
                        <span className="footer-stat">
                          <span className="stat-label">{translations[lang].paidDebts}:</span>
                          <span className="stat-value paid">{formatCurrency(totalPaidDebts)}</span>
                        </span>
                        <span className="footer-stat">
                          <span className="stat-label">{translations[lang].unpaidDebts}:</span>
                          <span className="stat-value pending">{formatCurrency(totalUnpaidDebts)}</span>
                        </span>
                      </div>
                      <div className="footer-total">
                        <span className="footer-label">Total</span>
                        <span className="footer-value">{formatCurrency(totalDebts)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Coluna Direita: Investimentos + Objetivos */}
            <div className="right-column">
              {/* Liberdade Financeira - Investimentos */}
              <div className="budget-section investments-section" id="tour-investments">
                <div className="section-header">
                  <h2>{translations[lang].financialFreedomTitle}</h2>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddInvestment}>
                    <PlusIcon size={14} /> {translations[lang].addInvestment}
                  </button>
                </div>
                
                {investments.length === 0 ? (
                  <div className="empty-state-compact">
                    <span>{translations[lang].noInvestmentsLogged}</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleAddInvestment}>
                      {translations[lang].emptyStartNow}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="investments-compact-list">
                      {investments.map(inv => {
                        const percentage = totalInvestments > 0 ? (inv.amount / totalInvestments) * 100 : 0
                        
                        return (
                          <div key={inv.id} className="investment-list-item">
                            <span className="investment-name" title={inv.name}>{inv.name}</span>
                            <div className="investment-details-inline">
                              <span className="investment-amount">{formatCurrency(inv.amount)}</span>
                              <span className="investment-percentage">({percentage.toFixed(0)}%)</span>
                              <div className="investment-actions">
                                <button 
                                  onClick={() => handleEditInvestment(inv)}
                                  className="action-icon-btn edit"
                                  title="Editar"
                                >
                                  <EditIcon size={12} />
                                </button>
                                <button 
                                  className="action-icon-btn delete"
                                  onClick={() => handleDeleteInvestment(inv)}
                                  title="Excluir"
                                >
                                  <DeleteIcon size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="investments-footer">
                      <span className="footer-label">{translations[lang].totalInvested}</span>
                      <span className="footer-value">{formatCurrency(totalInvestments)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Objetivos Financeiros */}
              <GoalsSection />
            </div>
          </div>
        
        {/* Investment Modal */}
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvestment}
          investment={editingInvestment}
        />
        
        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title={lang === 'pt' ? 'Excluir Investimento' : 'Delete Investment'}
          message={lang === 'pt' ? `Tem certeza que deseja excluir "${investmentToDelete?.name}"?` : `Are you sure you want to delete "${investmentToDelete?.name}"?`}
        />
        
        {/* Debt Modal */}
        <DebtModal
          isOpen={isDebtModalOpen}
          onClose={() => setIsDebtModalOpen(false)}
          onSave={handleSaveDebt}
          debt={editingDebt}
        />
        
        {/* Confirm Delete Debt Modal */}
        <ConfirmModal
          isOpen={isDebtConfirmOpen}
          onClose={cancelDeleteDebt}
          onConfirm={confirmDeleteDebt}
          title={lang === 'pt' ? 'Excluir Dívida' : 'Delete Debt'}
          message={lang === 'pt' ? `Tem certeza que deseja excluir "${debtToDelete?.name}"?` : `Are you sure you want to delete "${debtToDelete?.name}"?`}
        />
        
        {/* Subcategory Modal */}
        <SubcategoryModal
          isOpen={isSubcategoryModalOpen}
          onClose={() => setIsSubcategoryModalOpen(false)}
          onSave={handleSaveSubcategory}
          categoryName={selectedCategory?.name || ''}
        />
        
        <CategoryManagerModal 
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      </main>
    </div>
  )
}

export default BudgetPage
