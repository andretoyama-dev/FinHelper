import { useState } from 'react'
import { formatCurrency } from '../utils/calculations'
import ConfirmModal from './ConfirmModal'
import { DeleteIcon } from './Icons'
import './SubcategoryRow.css'

const SubcategoryRow = ({ subcategory, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(subcategory.value)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const handleSave = () => {
    // Replace comma with dot for proper float parsing (Brazilian format)
    const cleanValue = String(editValue).replace(',', '.')
    const newValue = parseFloat(cleanValue) || 0
    onUpdate(subcategory.id, { value: newValue })
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(subcategory.value)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    setIsConfirmDeleteOpen(true)
  }

  const confirmDelete = () => {
    onDelete(subcategory.id)
    setIsConfirmDeleteOpen(false)
  }

  return (
    <div className="subcategory-row">
      <div className="subcategory-name">{subcategory.name}</div>
      
      <div className="subcategory-value">
        {isEditing ? (
          <input
            type="number"
            step="0.01"
            min="0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="subcategory-input"
          />
        ) : (
          <span 
            onClick={() => setIsEditing(true)}
            className="subcategory-value-display"
          >
            {formatCurrency(subcategory.value)}
          </span>
        )}
      </div>
      
      <button 
        onClick={handleDelete}
        className="subcategory-delete-btn"
        title="Remover subcategoria"
      >
        <DeleteIcon size={14} />
      </button>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Subcategoria"
        message={`Tem certeza que deseja excluir a subcategoria "${subcategory.name}"?`}
      />
    </div>
  )
}

export default SubcategoryRow
