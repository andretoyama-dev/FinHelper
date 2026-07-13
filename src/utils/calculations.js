// Utility functions for financial calculations

export const formatCurrency = (value) => {
  let lang = 'en'
  try {
    const raw = localStorage.getItem('lang')
    if (raw) {
      lang = JSON.parse(raw)
    }
  } catch (e) {
    // fallback
  }

  // Handle NaN or invalid values gracefully to avoid "R$ NaN" or "$NaN"
  const val = Number(value)
  if (isNaN(val)) return lang === 'en' ? '$ 0.00' : 'R$ 0,00'

  if (lang === 'en') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val)
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val)
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const calculateBudget = (income, percentage) => {
  return (income * percentage) / 100
}

export const calculateTotalSpent = (expenses, categoryId) => {
  return expenses
    .filter(expense => expense.categoryId === categoryId)
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export const calculateUtilization = (spent, budget) => {
  const b = Number(budget)
  const s = Number(spent)
  if (isNaN(b) || isNaN(s) || b === 0) return 0
  return (s / b) * 100
}

export const calculateSavingsRate = (income, totalExpenses) => {
  const inc = Number(income)
  const exp = Number(totalExpenses)
  if (isNaN(inc) || isNaN(exp) || inc === 0) return 0
  return ((inc - exp) / inc) * 100
}

export const getTopCategory = (expenses, categories) => {
  if (expenses.length === 0) return null
  
  const categoryTotals = {}
  
  expenses.forEach(expense => {
    if (!categoryTotals[expense.categoryId]) {
      categoryTotals[expense.categoryId] = 0
    }
    categoryTotals[expense.categoryId] += expense.amount
  })
  
  let topCategoryId = null
  let maxAmount = 0
  
  Object.entries(categoryTotals).forEach(([id, amount]) => {
    if (amount > maxAmount) {
      maxAmount = amount
      topCategoryId = id
    }
  })
  
  const topCategory = categories.find(cat => cat.id === topCategoryId)
  
  return {
    category: topCategory,
    amount: maxAmount
  }
}

export const redistributeGoals = (categories, changedIndex, newValue) => {
  const updatedCategories = categories.map(cat => ({
    ...cat,
    percentage: Number(cat.percentage) || 0
  }))
  
  const targetValue = Number(newValue)
  if (isNaN(targetValue)) return updatedCategories

  updatedCategories[changedIndex].percentage = targetValue
  
  // Calculate total of other categories
  let totalOthers = 0
  updatedCategories.forEach((cat, i) => {
    if (i !== changedIndex) {
      totalOthers += Number(cat.percentage) || 0
    }
  })
  
  // Calculate remaining percentage
  const remaining = 100 - targetValue
  
  if (totalOthers === 0) {
    // If all others are zero, distribute evenly
    const count = categories.length - 1
    if (count > 0) {
      const perCategory = remaining / count
      updatedCategories.forEach((cat, i) => {
        if (i !== changedIndex) {
          cat.percentage = Math.round(perCategory)
        }
      })
    }
  } else {
    // Redistribute proportionally
    const ratio = remaining / totalOthers
    updatedCategories.forEach((cat, i) => {
      if (i !== changedIndex) {
        cat.percentage = Math.round(cat.percentage * ratio)
      }
    })
  }
  
  // Ensure total is exactly 100%
  const total = updatedCategories.reduce((sum, cat) => sum + (Number(cat.percentage) || 0), 0)
  if (total !== 100 && updatedCategories.length > 0) {
    // Find a valid index to adjust (prefer first non-changed index)
    const adjustIndex = changedIndex === 0 && updatedCategories.length > 1 ? 1 : 0;
    updatedCategories[adjustIndex].percentage += (100 - total)
  }
  
  return updatedCategories
}

export const getMonthYearString = (date) => {
  let lang = 'en'
  try {
    const raw = localStorage.getItem('lang')
    if (raw) {
      lang = JSON.parse(raw)
    }
  } catch (e) {
    // fallback
  }

  const year = date.getFullYear()
  if (lang === 'en') {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const month = months[date.getMonth()]
    return `${month} ${year}`
  } else {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const month = months[date.getMonth()]
    return `${month}/${year}`
  }
}

export const getMonthKey = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}`
}
