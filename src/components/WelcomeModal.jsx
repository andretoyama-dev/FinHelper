import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { translations } from '../utils/translations'
import './WelcomeModal.css'

const WelcomeModal = ({ isOpen, onClose }) => {
  const { setUserName, lang } = useFinance()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  if (!isOpen) return null
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError(translations[lang].welcomeNameError)
      return
    }
    
    if (name.trim().length < 2) {
      setError(translations[lang].welcomeLengthError)
      return
    }
    
    setUserName(name.trim())
    onClose()
  }
  
  return (
    <div className="modal-overlay welcome-modal-overlay">
      <div className="modal-content welcome-modal-content">
        <div className="welcome-header">
          <h1 className="welcome-title">{translations[lang].welcomeTitle}</h1>
          <p className="welcome-subtitle">
            {translations[lang].welcomeSubtitle}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="welcome-form">
          <div className="form-group">
            <label htmlFor="userName">{translations[lang].welcomeNameLabel}</label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder={translations[lang].welcomePlaceholder}
              autoFocus
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            {translations[lang].welcomeBtn}
          </button>
        </form>
        
        <div className="welcome-features">
          <p className="features-title">{translations[lang].welcomeFeaturesTitle}</p>
          <ul>
            <li>{translations[lang].welcomeFeature1}</li>
            <li>{translations[lang].welcomeFeature2}</li>
            <li>{translations[lang].welcomeFeature3}</li>
            <li>{translations[lang].welcomeFeature4}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
