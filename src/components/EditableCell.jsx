import { useState, useEffect, useRef } from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/calculations'
import './EditableCell.css'

const EditableCell = ({ value, onSave, categoryId }) => {
  const { lang } = useFinance()
  const isPt = lang === 'pt'
  
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState('')
  const inputRef = useRef(null)
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])
  
  const handleDoubleClick = () => {
    // Show current value according to locale (comma for PT, dot for EN)
    setTempValue(value > 0 ? (isPt ? value.toString().replace('.', ',') : value.toString()) : '')
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const numericValue = parseToNumber(tempValue)
    if (!isNaN(numericValue) && numericValue >= 0) {
      onSave(categoryId, numericValue)
      setIsEditing(false)
    } else {
      handleCancel()
    }
  }
  
  const handleCancel = () => {
    setIsEditing(false)
    setTempValue('')
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }
  
  const handleChange = (e) => {
    // Allow digits and language-specific decimal separator
    const allowedRegex = isPt ? /[^0-9,]/g : /[^0-9.]/g
    const val = e.target.value.replace(allowedRegex, '')
    setTempValue(val)
  }
  
  const parseToNumber = (val) => {
    if (!val || val.trim() === '') return 0
    // Parse decimal separator based on language
    const cleanValue = isPt ? val.replace(',', '.') : val
    return parseFloat(cleanValue) || 0
  }
  
  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="editable-input"
        placeholder={isPt ? "0,00" : "0.00"}
      />
    )
  }
  
  return (
    <div 
      className="editable-cell"
      onDoubleClick={handleDoubleClick}
      title={isPt ? "Clique duplo para editar" : "Double click to edit"}
    >
      {formatCurrency(value)}
    </div>
  )
}

export default EditableCell
