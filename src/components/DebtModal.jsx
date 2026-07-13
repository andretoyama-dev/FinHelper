import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import './DebtModal.css'

const t = {
  pt: {
    editTitle: 'Editar Dívida',
    addTitle: 'Adicionar Dívida',
    nameLabel: 'Nome da Dívida *',
    namePlaceholder: 'Ex: Cartão de Crédito, Conta de Luz...',
    amountLabel: 'Valor *',
    amountPlaceholder: '0,00',
    dueDateLabel: 'Data de Vencimento',
    noDueDateLabel: 'Sem data de vencimento',
    markAsPaid: 'Marcar como paga',
    cancel: 'Cancelar',
    save: 'Salvar',
    add: 'Adicionar',
    alertError: 'Por favor, preencha todos os campos corretamente'
  },
  en: {
    editTitle: 'Edit Debt',
    addTitle: 'Add Debt',
    nameLabel: 'Debt Name *',
    namePlaceholder: 'e.g. Credit Card, Electricity Bill...',
    amountLabel: 'Amount *',
    amountPlaceholder: '0.00',
    dueDateLabel: 'Due Date',
    noDueDateLabel: 'No due date',
    markAsPaid: 'Mark as paid',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    alertError: 'Please fill in all fields correctly'
  }
}

const DebtModal = ({ isOpen, onClose, onSave, debt }) => {
  const { lang } = useFinance()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [noDueDate, setNoDueDate] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      if (debt) {
        setName(debt.name || '')
        setAmount(debt.amount?.toString() || '')
        setDueDate(debt.dueDate ? debt.dueDate.split('T')[0] : '')
        setNoDueDate(!debt.dueDate)
        setIsPaid(debt.isPaid || false)
      } else {
        setName('')
        setAmount('')
        setDueDate(new Date().toISOString().split('T')[0])
        setNoDueDate(false)
        setIsPaid(false)
      }
    }
  }, [isOpen, debt])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const amountNum = parseFloat(amount)
    
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert(t[lang].alertError)
      return
    }
    
    onSave({
      name: name.trim(),
      amount: amountNum,
      dueDate: noDueDate ? null : new Date(dueDate).toISOString(),
      isPaid
    })
    
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content debt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{debt ? t[lang].editTitle : t[lang].addTitle}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="debt-name">{t[lang].nameLabel}</label>
              <input
                type="text"
                id="debt-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t[lang].namePlaceholder}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="debt-amount">{t[lang].amountLabel}</label>
              <input
                type="number"
                id="debt-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t[lang].amountPlaceholder}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group checkbox-group no-duedate-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={noDueDate}
                  onChange={(e) => {
                    setNoDueDate(e.target.checked)
                    if (e.target.checked) setDueDate('')
                  }}
                />
                <span>{t[lang].noDueDateLabel}</span>
              </label>
            </div>
            
            {!noDueDate && (
              <div className="form-group">
                <label htmlFor="debt-dueDate">{t[lang].dueDateLabel} *</label>
                <input
                  type="date"
                  id="debt-dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required={!noDueDate}
                />
              </div>
            )}
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                />
                <span>{t[lang].markAsPaid}</span>
              </label>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t[lang].cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {debt ? t[lang].save : t[lang].add}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DebtModal
