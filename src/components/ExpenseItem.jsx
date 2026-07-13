import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency, formatDate } from '../utils/calculations'
import ConfirmModal from './ConfirmModal'
import { DeleteIcon } from './Icons'
import './ExpenseItem.css'

const ExpenseItem = ({ expense, onDelete }) => {
  const { categoriesGoals } = useFinance()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  const category = categoriesGoals.find(cat => cat.id === expense.categoryId)
  
  const handleDelete = () => {
    setIsConfirmOpen(true)
  }

  const confirmDelete = () => {
    onDelete(expense.id)
    setIsConfirmOpen(false)
  }
  
  return (
    <>
      <div className="expense-item">
        <div 
          className="expense-category-indicator" 
          style={{ backgroundColor: category?.color || '#ccc' }}
        />
        
        <div className="expense-details">
          <div className="expense-header">
            <span className="expense-category-name">{category?.name || 'Sem categoria'}</span>
            <span className="expense-amount">{formatCurrency(expense.amount)}</span>
          </div>
          
          <div className="expense-info">
            <span className="expense-description">
              {expense.description || 'Sem descrição'}
            </span>
            <span className="expense-date">{formatDate(expense.date)}</span>
          </div>
        </div>
        
        <button className="delete-btn" onClick={handleDelete} title="Excluir gasto">
          <DeleteIcon size={14} />
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Gasto"
        message={`Tem certeza que deseja excluir "${expense.description || 'este gasto'}"?`}
      />
    </>
  )
}

export default ExpenseItem
