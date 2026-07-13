import { useState, useMemo, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import Header from '../components/Header'
import { translations } from '../utils/translations'
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight, X, Globe } from 'lucide-react'
import './CalendarPage.css'

const CalendarPage = () => {
  const { lang, calendarEvents, addCalendarEvent, updateCalendarEvent, removeCalendarEvent } = useFinance()
  const isPt = lang === 'pt'

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('finhelper_timezone') || (isPt ? 'brasilia' : 'local')
  })

  // Save timezone preference
  useEffect(() => {
    localStorage.setItem('finhelper_timezone', timezone)
  }, [timezone])

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventColor, setEventColor] = useState('#3b82f6')

  const colors = [
    { name: isPt ? 'Vermelho' : 'Red', value: '#ef4444' },
    { name: isPt ? 'Azul' : 'Blue', value: '#3b82f6' },
    { name: isPt ? 'Verde' : 'Green', value: '#10b981' },
    { name: isPt ? 'Amarelo' : 'Yellow', value: '#f59e0b' },
    { name: isPt ? 'Roxo' : 'Purple', value: '#8b5cf6' },
    { name: isPt ? 'Rosa' : 'Pink', value: '#ec4899' },
  ]

  const monthNames = isPt
    ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayLabels = isPt
    ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Calculate local date string based on timezone setting
  const todayStr = useMemo(() => {
    const todayObj = new Date()
    if (timezone === 'brasilia') {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
        const parts = formatter.formatToParts(todayObj)
        const partMap = {}
        parts.forEach(p => { partMap[p.type] = p.value })
        return `${partMap.year}-${partMap.month}-${partMap.day}`
      } catch (e) {
        console.error('Intl formatting failed, falling back to local time', e)
      }
    }
    
    // Fallback or Local option
    const yearLocal = todayObj.getFullYear()
    const monthLocal = String(todayObj.getMonth() + 1).padStart(2, '0')
    const dateLocal = String(todayObj.getDate()).padStart(2, '0')
    return `${yearLocal}-${monthLocal}-${dateLocal}`
  }, [timezone])

  // Get calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const prevMonthTotalDays = new Date(year, month, 0).getDate()

    const days = []

    // Padding from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthTotalDays - i)
      const yr = prevDate.getFullYear()
      const mth = String(prevDate.getMonth() + 1).padStart(2, '0')
      const dt = String(prevDate.getDate()).padStart(2, '0')
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        dateStr: `${yr}-${mth}-${dt}`
      })
    }

    // Days of current month
    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i)
      const yr = currDate.getFullYear()
      const mth = String(currDate.getMonth() + 1).padStart(2, '0')
      const dt = String(currDate.getDate()).padStart(2, '0')
      days.push({
        date: currDate,
        isCurrentMonth: true,
        dateStr: `${yr}-${mth}-${dt}`
      })
    }

    // Padding from next month
    const totalSlots = 42 // 6 weeks standard grid
    const nextMonthPadding = totalSlots - days.length
    for (let i = 1; i <= nextMonthPadding; i++) {
      const nextDate = new Date(year, month + 1, i)
      const yr = nextDate.getFullYear()
      const mth = String(nextDate.getMonth() + 1).padStart(2, '0')
      const dt = String(nextDate.getDate()).padStart(2, '0')
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        dateStr: `${yr}-${mth}-${dt}`
      })
    }

    return days
  }, [year, month])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (dateStr) => {
    setSelectedDateStr(dateStr)
  }

  const openAddModal = () => {
    setEventToEdit(null)
    setTitle('')
    setDescription('')
    setEventColor('#3b82f6')
    setIsModalOpen(true)
  }

  const openEditModal = (evt) => {
    setEventToEdit(evt)
    setTitle(evt.title)
    setDescription(evt.description)
    setEventColor(evt.color)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    const eventData = {
      title,
      description,
      date: selectedDateStr,
      color: eventColor
    }

    if (eventToEdit) {
      updateCalendarEvent(eventToEdit.id, eventData)
    } else {
      addCalendarEvent(eventData)
    }

    setIsModalOpen(false)
    setTitle('')
    setDescription('')
  }

  // Get active events for selected date
  const selectedDayEvents = useMemo(() => {
    if (!selectedDateStr) return []
    return calendarEvents.filter(evt => evt.date === selectedDateStr)
  }, [calendarEvents, selectedDateStr])

  // Get event map for fast calendar dots rendering
  const eventMap = useMemo(() => {
    const map = {}
    calendarEvents.forEach(evt => {
      if (!map[evt.date]) map[evt.date] = []
      map[evt.date].push(evt)
    })
    return map
  }, [calendarEvents])

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content calendar-page">
        <div className="calendar-layout-grid">
          
          {/* Left: Monthly Calendar Component */}
          <div className="calendar-card">
            <div className="calendar-header-actions">
              <h2 className="calendar-title-text">
                {monthNames[month]} {year}
              </h2>
              <div className="calendar-nav-buttons">
                <button className="nav-btn" onClick={handlePrevMonth} title={isPt ? 'Mês Anterior' : 'Previous Month'}>
                  <ChevronLeft size={18} />
                </button>
                <button className="nav-btn" onClick={handleNextMonth} title={isPt ? 'Próximo Mês' : 'Next Month'}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              {/* Day Labels */}
              {dayLabels.map(label => (
                <div key={label} className="calendar-grid-label">
                  {label}
                </div>
              ))}

              {/* Day Slots */}
              {calendarDays.map((day, idx) => {
                const isSelected = selectedDateStr === day.dateStr
                const isToday = todayStr === day.dateStr
                const dayEvents = eventMap[day.dateStr] || []

                return (
                  <div
                    key={idx}
                    className={`calendar-day-slot ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(day.dateStr)}
                  >
                    <span className="day-number">{day.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <div className="day-event-indicators">
                        {dayEvents.slice(0, 3).map(evt => (
                          <span
                            key={evt.id}
                            className="event-dot"
                            style={{ backgroundColor: evt.color }}
                            title={evt.title}
                          />
                        ))}
                        {dayEvents.length > 3 && <span className="event-dot-more">+</span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Selected Day Details Panel & Timezone Settings */}
          <div className="calendar-side-panel">
            <div className="timezone-setting-box">
              <div className="timezone-header">
                <Globe size={14} className="timezone-icon" />
                <span>{isPt ? 'Fuso Horário' : 'Timezone'}</span>
              </div>
              <select 
                value={timezone} 
                onChange={(e) => setTimezone(e.target.value)}
                className="timezone-select"
              >
                <option value="brasilia">{isPt ? 'Horário de Brasília (GMT-3)' : 'Brasilia Time (GMT-3)'}</option>
                <option value="local">{isPt ? 'Fuso Horário Local (Browser)' : 'Local Time (Browser)'}</option>
              </select>
            </div>

            {selectedDateStr ? (
              <div className="selected-day-details">
                <div className="panel-header-section">
                  <h3>
                    {isPt ? 'Avisos para' : 'Alerts for'} {(() => {
                      const [y, m, d] = selectedDateStr.split('-')
                      return isPt ? `${d}/${m}/${y}` : `${m}/${d}/${y}`
                    })()}
                  </h3>
                  <button className="btn btn-primary btn-sm btn-icon" onClick={openAddModal}>
                    <Plus size={14} /> {isPt ? 'Adicionar' : 'Add'}
                  </button>
                </div>

                {selectedDayEvents.length === 0 ? (
                  <div className="panel-empty-state">
                    <p>{isPt ? 'Nenhum aviso ou compromisso agendado para este dia.' : 'No alerts or events scheduled for this day.'}</p>
                    <button className="btn btn-secondary btn-sm" onClick={openAddModal}>
                      {isPt ? 'Adicionar Primeiro' : 'Add First'}
                    </button>
                  </div>
                ) : (
                  <div className="panel-events-list">
                    {selectedDayEvents.map(evt => (
                      <div key={evt.id} className="event-item-card" style={{ borderLeftColor: evt.color }}>
                        <div className="event-item-body">
                          <h4 className="event-item-title">{evt.title}</h4>
                          {evt.description && <p className="event-item-desc">{evt.description}</p>}
                        </div>
                        <div className="event-item-actions">
                          <button className="action-icon-btn edit" onClick={() => openEditModal(evt)} title={isPt ? 'Editar' : 'Edit'}>
                            <Edit2 size={13} />
                          </button>
                          <button className="action-icon-btn delete" onClick={() => removeCalendarEvent(evt.id)} title={isPt ? 'Excluir' : 'Delete'}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="panel-select-prompt">
                <p>{isPt ? 'Selecione um dia no calendário para gerenciar seus avisos e pagamentos.' : 'Select a day on the calendar to manage your alerts and payments.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content compact-modal-calendar">
              <div className="modal-header">
                <h3>{eventToEdit ? (isPt ? 'Editar Aviso' : 'Edit Alert') : (isPt ? 'Novo Aviso' : 'New Alert')}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="event-form">
                <div className="form-group">
                  <label>{isPt ? 'Título' : 'Title'}</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder={isPt ? 'Ex: Pagar fatura do cartão' : 'Ex: Pay credit card bill'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{isPt ? 'Descrição (Opcional)' : 'Description (Optional)'}</label>
                  <textarea
                    placeholder={isPt ? 'Ex: Valor aproximado de 500' : 'Ex: Approx value of 500'}
                    maxLength={200}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>{isPt ? 'Cor do Alerta' : 'Alert Color'}</label>
                  <div className="color-presets-picker">
                    {colors.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        className={`color-preset-circle ${eventColor === c.value ? 'active' : ''}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                        onClick={() => setEventColor(c.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isPt ? 'Salvar' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CalendarPage
