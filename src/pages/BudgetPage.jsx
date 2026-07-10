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
import DonutChart from '../components/DonutChart'
import { EditIcon, DeleteIcon, PlusIcon, SettingsIcon } from '../components/Icons'
import './BudgetPage.css'

const BudgetPage = () => {
  const navigate = useNavigate()
  const {
    lang,
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
  
  return (
    <div className="page budget-page">
      <Header />
      
      <main className="page-content">
        <div className="budget-top-bar">
          <MonthSelector />
          <button 
            className="manage-categories-btn" 
            onClick={() => setIsCategoryManagerOpen(true)}
          >
            <SettingsIcon size={14} /> Gerenciar Categorias
          </button>
        </div>

        {/* Compact Monthly Overview (Full Width) */}
        <div className="monthly-overview-bar">
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
          <div className="overview-card debts">
            <span className="card-label">{translations[lang].paidDebts}</span>
            <span className="card-val">{formatCurrency(totalPaidDebts)}</span>
          </div>
          <div className="overview-card remaining">
            <span className="card-label">{translations[lang].availableBalance}</span>
            <span className="card-val">{formatCurrency(monthlyIncome - totalExpenses - totalPaidDebts)}</span>
          </div>
        </div>
        
        {/* Layout Principal: 2 Colunas */}
        <div className="budget-layout">
          {/* Coluna Esquerda: Resumo + Investimentos */}
          <div className="left-column">
            {/* Resumo */}
            <div className="budget-section summary-section">
              <h2>Resumo</h2>
              
              <div className="summary-table">
                <div className="table-header">
                  <div>Categoria</div>
                  <div>{translations[lang].planned}</div>
                  <div>{translations[lang].actual}</div>
                  <div>{translations[lang].remainingCat}</div>
                  <div>Utilizado</div>
                  <div>Status</div>
                </div>
                
                {categoriesGoals.map(cat => {
                  const budget = calculateBudget(monthlyIncome, cat.percentage)
                  // For Liberdade financeira, use totalInvestments instead of manual spent
                  const spent = cat.id === 'liberdade' ? totalInvestments : (categorySpent[cat.id] || 0)
                  const utilization = calculateUtilization(spent, budget)
                  const remaining = budget - spent
                  const isExpanded = expandedCategories[cat.id]
                  const hasSubcategories = cat.subcategories && cat.subcategories.length > 0
                  
                  let statusClass = 'status-badge-ok'
                  let statusText = translations[lang].statusOnTrack
                  let rowHighlight = ''

                  if (spent === 0) {
                    statusClass = 'status-badge-not-started'
                    statusText = translations[lang].statusNotStarted
                  } else if (utilization > 100) {
                    statusClass = 'status-badge-exceeded'
                    statusText = translations[lang].statusExceeded
                    rowHighlight = 'row-danger'
                  } else if (utilization > 80) {
                    statusClass = 'status-badge-near-limit'
                    statusText = translations[lang].statusNearLimit
                    rowHighlight = 'row-warning'
                  }
                  
                  return (
                    <div key={cat.id} className="category-wrapper">
                      {/* Main category row */}
                      <div className={`table-row ${rowHighlight}`}>
                        {/* Category name with chevron inside */}
                        <div 
                          className="row-label clickable"
                          onClick={() => toggleCategory(cat.id)}
                          title={isExpanded ? "Recolher" : "Expandir"}
                        >
                          <span className="chevron-inline">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                          <span className="cat-color" style={{ backgroundColor: cat.color }} />
                          {translations[lang].categories[cat.id] || cat.name}
                        </div>
                        
                        {/* Planejado (Planned/Budget) */}
                        <div>{formatCurrency(budget)}</div>

                        {/* Realizado (Actual/Spent) - read-only if has subcategories or is Liberdade */}
                        {cat.id === 'liberdade' || hasSubcategories ? (
                          <div className="non-editable-cell">{formatCurrency(spent)}</div>
                        ) : (
                          <EditableCell 
                            value={spent}
                            onSave={updateCategorySpent}
                            categoryId={cat.id}
                          />
                        )}

                        {/* Restante */}
                        <div className={`cell-remaining ${remaining < 0 ? 'negative' : ''}`}>
                          {formatCurrency(remaining)}
                        </div>
                        
                        {/* Utilizado */}
                        <div className="utilization">{utilization.toFixed(1)}%</div>

                        {/* Status badge */}
                        <div>
                          <span className={`status-badge-indicator ${statusClass}`}>
                            {statusText}
                          </span>
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
                                <PlusIcon size={12} /> Adicionar subcategoria
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
                    <div>{formatCurrency(monthlyIncome)}</div>
                    <div>{formatCurrency(totalExpenses)}</div>
                    <div className={`cell-remaining ${monthlyIncome - totalExpenses < 0 ? 'negative' : ''}`}>
                      {formatCurrency(monthlyIncome - totalExpenses)}
                    </div>
                    <div className="footer-cell-utilization">
                      {monthlyIncome > 0 ? ((totalExpenses / monthlyIncome) * 100).toFixed(1) : 0}%
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liberdade Financeira - Investimentos */}
            <div className="budget-section investments-section">
              <div className="section-header">
                <h2>Liberdade Financeira</h2>
                <button className="btn btn-secondary btn-sm" onClick={handleAddInvestment}>
                  <PlusIcon size={14} /> Adicionar investimento
                </button>
              </div>
              
              {investments.length === 0 ? (
                <div className="empty-state-compact">
                  <span>📈 Nenhum investimento cadastrado ainda.</span>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddInvestment}>
                    Começar agora
                  </button>
                </div>
              ) : (
                <>
                  <div className="investments-list">
                    <div className="investments-table">
                      <div className="table-header">
                        <div>Investimento</div>
                        <div>Valor</div>
                        <div>%</div>
                        <div></div>
                      </div>
                      
                      {investments.map(inv => {
                        const percentage = totalInvestments > 0 ? (inv.amount / totalInvestments) * 100 : 0
                        
                        return (
                          <div key={inv.id} className="table-row">
                            <div>{inv.name}</div>
                            <div>{formatCurrency(inv.amount)}</div>
                            <div>{percentage.toFixed(1)}%</div>
                            <div className="investment-actions">
                              <button 
                                onClick={() => handleEditInvestment(inv)}
                                title="Editar"
                              >
                                <EditIcon size={14} />
                              </button>
                              <button 
                                className="btn-delete"
                                onClick={() => handleDeleteInvestment(inv)}
                                title="Excluir"
                              >
                                <DeleteIcon size={14} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="investments-footer">
                    <span className="footer-label">Total investido</span>
                    <span className="footer-value">{formatCurrency(totalInvestments)}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Seções Inferiores: Objetivos e Dívidas Lado a Lado no Desktop */}
            <div className="bottom-grid">
              <GoalsSection />

              {/* Dívidas */}
              <div className="budget-section debts-section">
                <div className="section-header">
                  <h2>Dívidas</h2>
                  <button className="btn btn-secondary btn-sm" onClick={handleAddDebt}>
                    <PlusIcon size={14} /> Adicionar dívida
                  </button>
                </div>
                
                {debts.length === 0 ? (
                  <div className="empty-state-compact">
                    <span>💸 Nenhuma dívida cadastrada ainda.</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleAddDebt}>
                      Começar agora
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="debts-list">
                      <div className="debts-table">
                        <div className="table-header">
                          <div>Nome</div>
                          <div>Valor</div>
                          <div>Vencimento</div>
                          <div>Status</div>
                          <div></div>
                        </div>
                        
                        {debts.map(debt => {
                          const dueDate = new Date(debt.dueDate)
                          const isOverdue = !debt.isPaid && dueDate < new Date()
                          
                          return (
                            <div key={debt.id} className={`table-row ${debt.isPaid ? 'paid' : ''}`}>
                              <div>{debt.name}</div>
                              <div>{formatCurrency(debt.amount)}</div>
                              <div>{dueDate.toLocaleDateString('pt-BR')}</div>
                              <div>
                                <label className="debt-status-toggle">
                                  <input
                                    type="checkbox"
                                    checked={debt.isPaid}
                                    onChange={() => toggleDebtPaid(debt.id)}
                                  />
                                  <span className={`status-badge ${debt.isPaid ? 'paid' : isOverdue ? 'overdue' : 'pending'}`}>
                                    {debt.isPaid ? '✓' : isOverdue ? '⚠' : '⏳'} {debt.isPaid ? translations[lang].paid : isOverdue ? (lang === 'en' ? 'Overdue' : 'Atrasada') : translations[lang].unpaid}
                                  </span>
                                </label>
                              </div>
                              <div className="debt-actions">
                                <button 
                                  onClick={() => handleEditDebt(debt)}
                                  title="Editar"
                                >
                                  <EditIcon size={14} />
                                </button>
                                <button 
                                  className="btn-delete"
                                  onClick={() => handleDeleteDebt(debt)}
                                  title="Excluir"
                                >
                                  <DeleteIcon size={14} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="debts-footer">
                      <div className="footer-stats">
                        <span className="footer-stat">
                          <span className="stat-label">Pagas:</span>
                          <span className="stat-value paid">{formatCurrency(totalPaidDebts)}</span>
                        </span>
                        <span className="footer-stat">
                          <span className="stat-label">Pendentes:</span>
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
          </div>
          
          {/* Coluna Direita: Alocação do Orçamento */}
          <div className="budget-section goals-section">
            <div className="section-header">
              <h2>{translations[lang].budgetDistribution}</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/goals')}>
                <SettingsIcon size={14} /> {translations[lang].edit}
              </button>
            </div>
            
            <div className="goals-list">
              {categoriesGoals.map(cat => {
                const budget = calculateBudget(monthlyIncome, cat.percentage)
                // For Liberdade financeira, use totalInvestments to stay consistent with Resumo
                const spent = cat.id === 'liberdade' ? totalInvestments : (categorySpent[cat.id] || 0)
                const utilization = calculateUtilization(spent, budget)
                
                return (
                  <div key={cat.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-name">
                        <span className="cat-color-dot" style={{ backgroundColor: cat.color }} />
                        {translations[lang].categories[cat.id] || cat.name}
                      </span>
                      <span className={`goal-percentage ${utilization > 100 ? 'over-budget' : ''}`}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                    <div className="goal-progress-bar">
                      <div 
                        className={`goal-progress-fill ${utilization > 100 ? 'over-budget' : ''}`}
                        style={{ 
                          width: `${Math.min(utilization, 100)}%`,
                          backgroundColor: utilization > 100 ? 'var(--danger)' : cat.color 
                        }}
                      />
                    </div>
                    <div className="goal-footer">
                      <span>{formatCurrency(spent)}</span>
                      <span>{formatCurrency(budget)}</span>
                    </div>
                    {utilization > 100 && (
                      <div className="over-budget-badge">{translations[lang].overBudget}</div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="sidebar-divider" />
            <DonutChart categories={categoriesGoals} />
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
          title="Excluir Investimento"
          message={`Tem certeza que deseja excluir "${investmentToDelete?.name}"?`}
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
          title="Excluir Dívida"
          message={`Tem certeza que deseja excluir "${debtToDelete?.name}"?`}
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
