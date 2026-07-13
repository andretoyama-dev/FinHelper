import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import './GoalModal.css'

const t = {
  pt: {
    editTitle: 'Editar Objetivo',
    addTitle: 'Novo Objetivo',
    nameLabel: 'Nome do Objetivo *',
    namePlaceholder: 'Ex: Viagem para Europa, Reserva...',
    targetAmountLabel: 'Valor Alvo *',
    currentAmountLabel: 'Valor Atual (Guardado)',
    cancel: 'Cancelar',
    save: 'Salvar Alterações',
    add: 'Criar Objetivo',
    errorName: 'Nome é obrigatório',
    errorTarget: 'Valor alvo deve ser maior que zero',
    errorCurrent: 'Valor atual não pode ser negativo'
  },
  en: {
    editTitle: 'Edit Goal',
    addTitle: 'New Goal',
    nameLabel: 'Goal Name *',
    namePlaceholder: 'e.g. Europe Trip, Emergency Fund...',
    targetAmountLabel: 'Target Amount *',
    currentAmountLabel: 'Current Amount (Saved)',
    cancel: 'Cancel',
    save: 'Save Changes',
    add: 'Create Goal',
    errorName: 'Name is required',
    errorTarget: 'Target amount must be greater than zero',
    errorCurrent: 'Current amount cannot be negative'
  }
}

const GoalModal = ({ isOpen, onClose, goalToEdit = null }) => {
  const { addGoal, updateGoal, lang } = useFinance()
  const isPt = lang === 'pt'
  
  const [formData, setFormData] = useState({
    name: goalToEdit ? goalToEdit.name : '',
    targetAmount: goalToEdit ? goalToEdit.targetAmount : 0,
    currentAmount: goalToEdit ? goalToEdit.currentAmount : 0
  })
  
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError(t[lang].errorName)
      return
    }
    
    const target = Number(formData.targetAmount)
    const current = Number(formData.currentAmount || 0)

    if (target <= 0) {
      setError(t[lang].errorTarget)
      return
    }

    if (current < 0) {
      setError(t[lang].errorCurrent)
      return
    }

    const goalData = {
      name: formData.name.trim(),
      targetAmount: target,
      currentAmount: current
    }

    if (goalToEdit) {
      const result = updateGoal(goalToEdit.id, goalData)
      if (!result.success) {
        setError(result.error || 'Error updating')
        return
      }
    } else {
      const result = addGoal(goalData)
      if (!result.success) {
        setError(result.error || 'Error creating')
        return
      }
    }
    
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content goal-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{goalToEdit ? t[lang].editTitle : t[lang].addTitle}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>{t[lang].nameLabel}</label>
            <input 
              type="text" 
              placeholder={t[lang].namePlaceholder}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>{t[lang].targetAmountLabel}</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={formData.targetAmount === 0 ? '' : formData.targetAmount}
              onChange={e => setFormData({...formData, targetAmount: e.target.value === '' ? 0 : Number(e.target.value)})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>{t[lang].currentAmountLabel}</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={formData.currentAmount === 0 ? '' : formData.currentAmount}
              onChange={e => setFormData({...formData, currentAmount: e.target.value === '' ? 0 : Number(e.target.value)})}
            />
          </div>
          
          {error && <p className="error-msg">{error}</p>}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t[lang].cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {goalToEdit ? t[lang].save : t[lang].add}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalModal
