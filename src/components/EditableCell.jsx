import { useState, useEffect, useRef } from 'react'
import './EditableCell.css'

const EditableCell = ({ value, onSave, categoryId }) => {
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
    // Show the current value as a simple number for editing
    setTempValue(value > 0 ? value.toString().replace('.', ',') : '')
    setIsEditing(true)
  }
  
  const handleSave = () => {
    const numericValue = parseToNumber(tempValue)
    if (!isNaN(numericValue) && numericValue >= 0) {
      onSave(categoryId, numericValue)
      setIsEditing(false)
    } else {
      // Invalid value, cancel
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
    // Allow digits, comma and dot for decimal input
    const val = e.target.value.replace(/[^0-9.,]/g, '')
    setTempValue(val)
  }
  
  const parseToNumber = (val) => {
    if (!val || val.trim() === '') return 0
    // Replace comma with dot for parseFloat
    const cleanValue = val.replace(',', '.')
    return parseFloat(cleanValue) || 0
  }
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val)
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
        placeholder="0,00"
      />
    )
  }
  
  return (
    <div 
      className="editable-cell"
      onDoubleClick={handleDoubleClick}
      title="Clique duplo para editar"
    >
      {formatCurrency(value)}
    </div>
  )
}

export default EditableCell
