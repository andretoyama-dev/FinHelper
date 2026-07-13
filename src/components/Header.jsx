import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { translations } from '../utils/translations'
import ConfirmModal from './ConfirmModal'
import { 
  LayoutDashboard, Target, TrendingUp, Calculator,
  Download, Upload, FileText, FileSpreadsheet, Database, 
  Trash2, Globe, MoreHorizontal, HelpCircle,
  Calendar, Lightbulb, Briefcase
} from 'lucide-react'
import './Header.css'

const Header = () => {
  const location = useLocation()
  const { userName, exportData, importData, resetAll, lang, setLang } = useFinance()
  
  const [showMenu, setShowMenu] = useState(false)
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false)
  const fileInputRef = useRef(null)
  const menuRef = useRef(null)
  
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = (format) => {
    exportData(format)
    setShowMenu(false)
  }
  
  const handleImportClick = () => {
    fileInputRef.current?.click()
    setShowMenu(false)
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
    }
  }

  const isPt = lang === 'pt'

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: isPt ? 'Orçamento' : 'Budget', tourId: 'nav-budget' },
    { path: '/goals', icon: Target, label: isPt ? 'Metas' : 'Goals', tourId: 'nav-goals' },
    { path: '/calendar', icon: Calendar, label: isPt ? 'Calendário' : 'Calendar', tourId: 'nav-calendar' },
    { path: '/evolution', icon: TrendingUp, label: isPt ? 'Evolução' : 'Evolution', tourId: 'nav-evolution' },
    { path: '/portfolio', icon: Briefcase, label: isPt ? 'Carteira' : 'Portfolio', tourId: 'nav-portfolio' },
    { path: '/interest', icon: Calculator, label: isPt ? 'Calculadora' : 'Calculator', tourId: 'nav-interest' },
    { path: '/tips', icon: Lightbulb, label: isPt ? 'Dicas' : 'Tips', tourId: 'nav-tips' },
  ]
  
  return (
    <header className="header">
      {/* Navigation */}
      <nav className="header-nav">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-pill ${isActive ? 'active' : ''}`}
              data-tour={item.tourId}
            >
              <Icon size={15} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Right Actions */}
      <div className="header-right">
        {/* Language Toggle */}
        <button 
          className="header-btn" 
          onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
          title={isPt ? 'Switch to English' : 'Mudar para Português'}
        >
          <Globe size={15} />
          <span>{lang === 'en' ? 'PT' : 'EN'}</span>
        </button>

        {/* More Menu */}
        <div className="header-menu-wrapper" ref={menuRef}>
          <button 
            className="header-btn"
            onClick={() => setShowMenu(!showMenu)}
            title={isPt ? 'Opções' : 'Options'}
            data-tour="menu"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="header-dropdown">
              <button onClick={() => handleExport('pdf')}>
                <FileText size={14} />
                {translations[lang].exportPDF}
              </button>
              <button onClick={() => handleExport('excel')}>
                <FileSpreadsheet size={14} />
                {translations[lang].exportExcel}
              </button>
              <button onClick={() => handleExport('json')}>
                <Database size={14} />
                {translations[lang].exportJSON}
              </button>
              <div className="header-dropdown-divider" />
              <button onClick={handleImportClick}>
                <Upload size={14} />
                {translations[lang].importJSON}
              </button>
              <div className="header-dropdown-divider" />
              <button className="danger" onClick={() => { setShowMenu(false); setIsConfirmResetOpen(true) }}>
                <Trash2 size={14} />
                {isPt ? 'Resetar Dados' : 'Reset Data'}
              </button>
              <div className="header-dropdown-divider" />
              <button onClick={() => { setShowMenu(false); window.__startTour?.() }}>
                <HelpCircle size={14} />
                {isPt ? 'Tour Guiado' : 'Guided Tour'}
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="header-avatar" title={userName || 'User'}>
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
      
      {/* Hidden file input */}
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
        title={isPt ? 'Resetar Todos os Dados' : 'Reset All Data'}
        message={isPt ? 'Tem certeza que deseja resetar TODOS os dados? Isso irá limpar tudo incluindo seu nome. Esta ação não pode ser desfeita.' : 'Are you sure you want to reset ALL data? This will clear everything including your name. This cannot be undone.'}
      />
    </header>
  )
}

export default Header
