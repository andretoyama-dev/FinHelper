import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { translations } from '../utils/translations'
import ConfirmModal from './ConfirmModal'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const { userName, theme, toggleTheme, exportData, importData, resetAll, lang, setLang } = useFinance()
  
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false)
  const fileInputRef = useRef(null)
  
  const handleExport = (format) => {
    exportData(format)
    setShowExportMenu(false)
  }
  
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const result = await importData(file)
      if (result.success) {
        alert(translations[lang].importSuccess)
      } else {
        alert(`${translations[lang].importError}${result.error}`)
      }
      setShowImportModal(false)
    }
  }
  
  return (
    <header className="header">
      <div className="header-logo-container">
        <Link to="/">
          <img 
            src={`${import.meta.env.BASE_URL}FinHelper_Logo.png`} 
            alt="FinHelper" 
            className="header-logo" 
          />
        </Link>
      </div>
      <nav className="header-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          {translations[lang].budget}
        </Link>
        <Link 
          to="/goals" 
          className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
        >
          {translations[lang].goals}
        </Link>
        <Link 
          to="/evolution" 
          className={`nav-link ${location.pathname === '/evolution' ? 'active' : ''}`}
        >
          {translations[lang].evolution}
        </Link>
      </nav>
      
      <div className="header-actions">
        {/* Language Switcher */}
        <button 
          className="icon-btn lang-toggle-btn" 
          onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
          title={lang === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
          style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace', minWidth: '32px' }}
        >
          {lang === 'en' ? 'PT' : 'EN'}
        </button>

        {/* Reset All Button */}
        <button 
          className="icon-btn" 
          onClick={() => setIsConfirmResetOpen(true)}
          title={translations[lang].resetMonth}
        >
          🗑️
        </button>
        
        {/* Theme Toggle */}
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? translations[lang].lightMode : translations[lang].darkMode}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        
        {/* Export Button */}
        <div className="dropdown">
          <button 
            className="icon-btn"
            onClick={() => setShowExportMenu(!showExportMenu)}
            title={translations[lang].exportData}
          >
            📥
          </button>
          
          {showExportMenu && (
            <div className="dropdown-menu">
              <button onClick={() => handleExport('pdf')}>
                {translations[lang].exportPDF}
              </button>
              <button onClick={() => handleExport('excel')}>
                {translations[lang].exportExcel}
              </button>
              <button onClick={() => handleExport('json')}>
                {translations[lang].exportJSON}
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleImportClick}>
                {translations[lang].importJSON}
              </button>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="user-profile">
          <span className="user-greeting">{translations[lang].hello}{userName || translations[lang].user}</span>
          <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : 'U'}</div>
        </div>
      </div>
      
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={() => {
          resetAll()
          setIsConfirmResetOpen(false)
        }}
        title={lang === 'en' ? 'Reset All Data' : 'Resetar Todos os Dados'}
        message={lang === 'en' ? 'Are you sure you want to reset ALL data? This will clear everything including your name. This cannot be undone.' : 'Tem certeza que deseja resetar TODOS os dados? Isso irá limpar tudo incluindo seu nome. Esta ação não pode ser desfeita.'}
      />
    </header>
  )
}

export default Header
