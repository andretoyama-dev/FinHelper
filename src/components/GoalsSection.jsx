import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/calculations'
import GoalModal from './GoalModal'
import ConfirmModal from './ConfirmModal'
import { EditIcon, DeleteIcon, PlusIcon } from './Icons'
import { translations } from '../utils/translations'
import './GoalsSection.css'

const GoalsSection = () => {
  const { financialGoals, deleteGoal, lang } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState(null)

  const handleEdit = (goal) => {
    setGoalToEdit(goal)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    setGoalToDelete(id)
    setIsConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete)
    }
    setIsConfirmOpen(false)
    setGoalToDelete(null)
  }

  const handleAdd = () => {
    setGoalToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="budget-section financial-goals-section" id="tour-financial-goals">
      <div className="section-header">
        <h2>{translations[lang].financialGoalsTitle}</h2>
        <button className="btn btn-secondary btn-sm" onClick={handleAdd}>
          <PlusIcon size={14} /> {translations[lang].createGoal}
        </button>
      </div>

      {financialGoals.length === 0 ? (
        <div className="empty-state-compact">
          <span>{translations[lang].noFinancialGoals}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleAdd}>
            {translations[lang].emptyStartNow}
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {financialGoals.map(goal => {
            const percentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
            const isCompleted = goal.currentAmount >= goal.targetAmount
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)

            return (
              <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                <div className="goal-header">
                  <h3>{goal.name}</h3>
                  <div className="goal-actions">
                    <button onClick={() => handleEdit(goal)} className="action-icon-btn edit" title="Editar">
                      <EditIcon size={12} />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="action-icon-btn delete" title="Excluir">
                      <DeleteIcon size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="goal-progress-container">
                  <div className="goal-progress-bar">
                    <div 
                      className="goal-progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="goal-percentage">{percentage.toFixed(0)}%</span>
                </div>
                
                <div className="goal-details">
                  <div className="goal-values">
                    <span className="current">{formatCurrency(goal.currentAmount)}</span>
                    <span className="separator">/</span>
                    <span className="target">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  {!isCompleted && (
                    <div className="goal-remaining">
                      {translations[lang].missingAmount} {formatCurrency(remaining)}
                    </div>
                  )}
                  {isCompleted && (
                    <div className="goal-status-badge">
                      {translations[lang].completedGoal}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setGoalToDelete(null) }}
        onConfirm={confirmDelete}
        title="Excluir Objetivo"
        message="Tem certeza que deseja excluir este objetivo financeiro?"
      />
    </div>
  )
}

export default GoalsSection
