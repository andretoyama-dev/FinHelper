import { useState, useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import ConfirmModal from './ConfirmModal'
import { EditIcon, DeleteIcon } from './Icons'
import './CategoryManagerModal.css'

const CategoryManagerModal = ({ isOpen, onClose }) => {
  const { 
    categoriesGoals, 
    updateCategory, 
    deleteCategory,
    validateBudgetTotal
  } = useFinance()
  
  const [editingId, setEditingId] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    percentage: 0
  })
  
  const [error, setError] = useState('')
  
  // Confirm delete state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  
  // Filtered list
  const visibleCategories = useMemo(() => {
    return categoriesGoals
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
  }, [categoriesGoals])
  
  // Current Total Percentage (excluding editing category)
  const currentTotalPercentage = useMemo(() => {
    return categoriesGoals
      .filter(cat => cat.id !== editingId)
      .reduce((sum, cat) => sum + (cat.percentage || 0), 0)
  }, [categoriesGoals, editingId])
  
  const handleEdit = (category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      color: category.color,
      percentage: category.percentage || 0
    })
    setError('')
  }
  
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', color: '#3b82f6', percentage: 0 })
    setError('')
  }
  
  const handleSave = () => {
    if (!formData.name) {
      setError('Nome é obrigatório')
      return
    }
    
    // Validate Budget
    const newTotal = currentTotalPercentage + Number(formData.percentage)
    if (newTotal > 100) {
      setError(`O orçamento total ultrapassaria 100% (Atual: ${currentTotalPercentage}%)`)
      return
    }
    
    if (editingId) {
      const result = updateCategory(editingId, formData)
      if (result.success) {
        handleCancelEdit()
      } else {
        setError(result.error)
      }
    }
  }
  
  const handleDelete = (id) => {
    setCategoryToDelete(id)
    setIsConfirmOpen(true)
    setDeleteError('')
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      const result = deleteCategory(categoryToDelete)
      if (!result.success) {
        setDeleteError(result.error)
        // Keep modal open to show error, then close after a delay
        setTimeout(() => {
          setIsConfirmOpen(false)
          setCategoryToDelete(null)
          setDeleteError('')
        }, 2000)
        return
      }
    }
    setIsConfirmOpen(false)
    setCategoryToDelete(null)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content category-manager-modal">
        <div className="modal-header">
          <h2>Gerenciar Categorias</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="budget-status-bar">
          <div className="status-label">
            <span>Orçamento Total Alocado</span>
            <span className={currentTotalPercentage + (editingId ? Number(formData.percentage) : 0) > 100 ? 'text-danger' : ''}>
              {currentTotalPercentage + (editingId ? Number(formData.percentage) : 0)}%
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${currentTotalPercentage > 100 ? 'danger' : ''}`}
              style={{ width: `${Math.min(currentTotalPercentage + (editingId ? Number(formData.percentage) : 0), 100)}%` }}
            ></div>
          </div>
        </div>

        {editingId && (
          <div className="category-form">
            <h3>Editar Categoria</h3>
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Nome da Categoria" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="color" 
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
                title="Cor da Categoria"
              />
              <div className="percentage-input">
                <input 
                  type="number" 
                  placeholder="%" 
                  min="0" 
                  max="100" 
                  value={formData.percentage}
                  onChange={e => setFormData({...formData, percentage: Number(e.target.value)})}
                />
                <span>%</span>
              </div>
              <button className="btn-primary" onClick={handleSave}>
                Salvar
              </button>
              <button className="btn-secondary" onClick={handleCancelEdit}>Cancelar</button>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>
        )}

        <div className="categories-list-header">
          <h3>Categorias Existentes</h3>
        </div>

        <div className="categories-list">
          {visibleCategories.map(cat => (
            <div key={cat.id} className="category-item">
              <div className="category-info">
                <span className="color-dot" style={{ backgroundColor: cat.color }}></span>
                <span className="category-name">{cat.name}</span>
                <span className="category-percentage">{cat.percentage}%</span>
              </div>
              <div className="category-actions">
                <button onClick={() => handleEdit(cat)} title="Editar">
                  <EditIcon size={14} />
                </button>
                <button className="btn-delete" onClick={() => handleDelete(cat.id)} title="Excluir">
                  <DeleteIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setCategoryToDelete(null) }}
          onConfirm={confirmDelete}
          title="Excluir Categoria"
          message={deleteError || 'Tem certeza? Isso excluirá permanentemente a categoria. Só permitido se não houver uso histórico.'}
        />
      </div>
    </div>
  )
}

export default CategoryManagerModal
