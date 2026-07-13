import React, { useRef, useState, useEffect } from 'react'

const RadialProgressAdjuster = ({ cat, onChange }) => {
  const svgRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(cat.percentage))

  // Map category IDs to gradient color pairs
  const getGradientColors = (id) => {
    switch (id) {
      case 'custos-fixos':
        return { start: '#4a90e2', end: '#06b6d4' } // Blue -> Cyan
      case 'liberdade':
        return { start: '#8b5cf6', end: '#d946ef' } // Amethyst Purple -> Fuchsia
      case 'conforto':
        return { start: '#00d4aa', end: '#10b981' } // Mint Teal -> Emerald Green
      case 'metas':
        return { start: '#f5d547', end: '#fb923c' } // Gold Yellow -> Orange
      case 'prazeres':
        return { start: '#d946ef', end: '#f43f5e' } // Magenta Pink -> Rose
      case 'conhecimento':
        return { start: '#fb923c', end: '#facc15' } // Orange -> Yellow
      default:
        return { start: cat.color, end: cat.color }
    }
  }

  const { start, end } = getGradientColors(cat.id)

  // SVG Geometry (Compact size 100 for zero scroll screen optimization)
  const size = 100
  const center = size / 2
  const strokeWidth = 6
  const radius = (size - strokeWidth - 10) / 2 // r = 42
  const circumference = 2 * Math.PI * radius // ~263.89
  const strokeDashoffset = circumference - (cat.percentage / 100) * circumference

  // Calculate coordinates for the thumb handle
  const rad = ((cat.percentage / 100) * 360 - 90) * (Math.PI / 180)
  const thumbX = center + radius * Math.cos(rad)
  const thumbY = center + radius * Math.sin(rad)

  const handleUpdateFromCoords = (clientX, clientY) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = clientX - cx
    const dy = clientY - cy

    let angle = Math.atan2(dy, dx) + Math.PI / 2
    if (angle < 0) {
      angle += 2 * Math.PI
    }

    const percentage = Math.round((angle / (2 * Math.PI)) * 100)
    onChange(Math.min(100, Math.max(0, percentage)))
  }

  // Handle drag mechanics
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    handleUpdateFromCoords(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      handleUpdateFromCoords(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleUpdateFromCoords(e.clientX, e.clientY)
      }
    }

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        handleUpdateFromCoords(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  // Reset local input when percentage prop changes
  useEffect(() => {
    setInputValue(String(cat.percentage))
  }, [cat.percentage])

  // Direct text edit
  const handleTextClick = () => {
    setIsEditing(true)
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    let val = parseInt(inputValue, 10)
    if (isNaN(val)) val = 0
    val = Math.min(100, Math.max(0, val))
    onChange(val)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    } else if (e.key === 'Escape') {
      setInputValue(String(cat.percentage))
      setIsEditing(false)
    }
  }

  return (
    <div className={`radial-adjuster-wrapper ${isDragging ? 'dragging' : ''}`}>
      <div 
        className="radial-svg-container"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        ref={svgRef}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radial-svg">
          <defs>
            <linearGradient id={`grad-${cat.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={start} />
              <stop offset="100%" stopColor={end} />
            </linearGradient>
            <filter id={`shadow-${cat.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="3" floodColor={cat.color} floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--bg-primary)"
            strokeWidth={strokeWidth}
            className="radial-track-bg"
          />

          {/* Active Gradient Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#grad-${cat.id})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            filter={`url(#shadow-${cat.id})`}
            className="radial-track-fill"
          />

          {/* Draggable Circle Thumb */}
          <circle
            cx={thumbX}
            cy={thumbY}
            r={7}
            fill="#ffffff"
            stroke={cat.color}
            strokeWidth={2}
            className="radial-thumb"
          />
        </svg>

        {/* Central Display Value */}
        <div className="radial-center-content">
          {isEditing ? (
            <input
              type="number"
              className="radial-input"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              autoFocus
              min="0"
              max="100"
            />
          ) : (
            <span 
              className="radial-percentage-display" 
              style={{ color: cat.color }}
              onClick={handleTextClick}
            >
              {cat.percentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RadialProgressAdjuster
