import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import './InvestmentModal.css'

const t = {
  pt: {
    editTitle: 'Editar Investimento',
    addTitle: 'Novo Investimento',
    nameLabel: 'Nome do Investimento *',
    namePlaceholder: 'Ex: Bitcoin, CDB, Tesouro Direto...',
    amountLabel: 'Valor *',
    amountPlaceholder: '0,00',
    cancel: 'Cancelar',
    save: 'Salvar',
    add: 'Adicionar',
    alertError: 'Por favor, preencha todos os campos corretamente.'
  },
  en: {
    editTitle: 'Edit Investment',
    addTitle: 'New Investment',
    nameLabel: 'Investment Name *',
    namePlaceholder: 'e.g. Bitcoin, CDB, Treasury...',
    amountLabel: 'Amount *',
    amountPlaceholder: '0.00',
    cancel: 'Cancel',
    save: 'Save',
    add: 'Add',
    alertError: 'Please fill in all fields correctly.'
  }
}

const InvestmentModal = ({ isOpen, onClose, onSave, investment = null }) => {
  const { lang } = useFinance()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  
  useEffect(() => {
    if (investment) {
      setName(investment.name || '')
      setAmount(investment.amount ? investment.amount.toString() : '')
    } else {
      setName('')
      setAmount('')
    }
  }, [investment, isOpen])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const parsedAmount = parseFloat(amount)
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert(t[lang].alertError)
      return
    }
    
    onSave({
      name: name.trim(),
      amount: parsedAmount
    })
    
    setName('')
    setAmount('')
  }
  
  const handleClose = () => {
    setName('')
    setAmount('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{investment ? t[lang].editTitle : t[lang].addTitle}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="investment-name">{t[lang].nameLabel}</label>
            <input
              id="investment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t[lang].namePlaceholder}
              autoFocus
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="investment-amount">{t[lang].amountLabel}</label>
            <input
              id="investment-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t[lang].amountPlaceholder}
              required
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {t[lang].cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {investment ? t[lang].save : t[lang].add}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvestmentModal
