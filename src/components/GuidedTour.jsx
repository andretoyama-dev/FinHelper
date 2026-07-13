import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import './GuidedTour.css'

const TOUR_STEPS = [
  {
    target: null,
    titlePt: 'Bem-vindo ao FinHelper!',
    titleEn: 'Welcome to FinHelper!',
    descPt: 'Vamos fazer um tour rápido para você conhecer todas as funcionalidades do sistema. Serão poucos passos!',
    descEn: "Let's take a quick tour so you can learn all the system features. Just a few steps!",
    placement: 'center',
    page: '/'
  },
  {
    target: '#tour-income',
    titlePt: 'Defina sua Renda',
    titleEn: 'Set Your Income',
    descPt: 'Comece inserindo sua renda mensal aqui. Este é o valor base para o cálculo de todo o orçamento.',
    descEn: 'Start by entering your monthly income here. This is the base value for all budget calculations.',
    placement: 'bottom',
    page: '/'
  },
  {
    target: '#tour-overview',
    titlePt: 'Visão Geral',
    titleEn: 'Monthly Overview',
    descPt: 'Aqui você vê o resumo financeiro do mês: renda, despesas, investimentos e saldo disponível em tempo real.',
    descEn: 'Here you see the monthly financial summary: income, expenses, investments, and available balance in real-time.',
    placement: 'bottom',
    page: '/'
  },
  {
    target: '#tour-summary',
    titlePt: 'Resumo por Categoria',
    titleEn: 'Category Summary',
    descPt: 'Cada linha mostra uma categoria do orçamento com planejado, gasto real, restante e utilização. Clique na seta para ver subcategorias.',
    descEn: 'Each row shows a budget category with planned, actual spending, remaining, and utilization. Click the arrow to see subcategories.',
    placement: 'right',
    page: '/'
  },
  {
    target: '#tour-investments',
    titlePt: 'Liberdade Financeira',
    titleEn: 'Financial Freedom',
    descPt: 'Acompanhe seus investimentos e aplicações nesta área. O total investido é integrado diretamente no resumo do seu orçamento.',
    descEn: 'Track your investments and assets in this area. The total invested is integrated directly into your budget summary.',
    placement: 'right',
    page: '/'
  },
  {
    target: '#tour-financial-goals',
    titlePt: 'Objetivos Financeiros',
    titleEn: 'Financial Goals',
    descPt: 'Defina suas metas de poupança (ex: reserva de emergência, viagem) e acompanhe a barra de progresso até completá-las.',
    descEn: 'Define your savings goals (e.g. emergency fund, travel) and track the progress bar until you complete them.',
    placement: 'right',
    page: '/'
  },
  {
    target: '#tour-debts',
    titlePt: 'Controle de Dívidas',
    titleEn: 'Debt Control',
    descPt: 'Cadastre suas contas e dívidas para ter visibilidade de prazos. Marque como pagas conforme liquidar os valores.',
    descEn: 'Register your bills and debts to have visibility of deadlines. Mark them as paid as you settle the amounts.',
    placement: 'left',
    page: '/'
  },
  {
    target: '.goals-layout',
    titlePt: 'Configurar Metas',
    titleEn: 'Configure Goals',
    descPt: 'Aqui você personaliza as fatias do seu orçamento usando controles radiais interativos. A soma deve fechar em exatamente 100%.',
    descEn: 'Here you customize your budget shares using interactive radial controls. The total sum must equal exactly 100%.',
    placement: 'left',
    page: '/goals'
  },
  {
    target: '.calendar-card',
    titlePt: 'Calendário Financeiro',
    titleEn: 'Financial Calendar',
    descPt: 'Agende vencimentos de contas, compromissos e tarefas importantes com sinalizadores coloridos.',
    descEn: 'Schedule bill due dates, commitments, and important tasks with colorful visual alerts.',
    placement: 'right',
    page: '/calendar'
  },
  {
    target: '.segmented-control',
    titlePt: 'Histórico & Comparação',
    titleEn: 'History & Comparison',
    descPt: 'Alterne entre os gráficos de evolução histórica dos meses e a ferramenta de comparação direta de desempenho entre dois períodos.',
    descEn: 'Toggle between historical evolution charts of the months and the direct performance comparison tool between two periods.',
    placement: 'bottom',
    page: '/evolution'
  },
  {
    target: '.portfolio-balance-card',
    titlePt: 'Carteira de Investimentos',
    titleEn: 'Investment Portfolio',
    descPt: 'Defina suas metas de alocação por classe de ativos (como Cripto, Selic, FIIs, etc) e acompanhe seu rebalanceamento ideal.',
    descEn: 'Define target allocations per asset class (such as Crypto, Selic, FIIs, etc) and track your target balance recommendations.',
    placement: 'bottom',
    page: '/portfolio'
  },
  {
    target: '.ci-sidebar',
    titlePt: 'Calculadora de Juros',
    titleEn: 'Interest Calculator',
    descPt: 'Simule o crescimento de seus investimentos com juros compostos inserindo o aporte mensal, taxa e período de anos.',
    descEn: 'Simulate the growth of your investments with compound interest by entering monthly contributions, rate, and period of years.',
    placement: 'right',
    page: '/interest'
  },
  {
    target: '.tips-hero-card',
    titlePt: 'Dicas & Insights',
    titleEn: 'Tips & Insights',
    descPt: 'Estude o passo a passo recomendado por investidores profissionais da fase básica até a avançada.',
    descEn: 'Study the step-by-step path recommended by professional investors from basic to advanced phases.',
    placement: 'bottom',
    page: '/tips'
  },
  {
    target: '[data-tour="menu"]',
    titlePt: 'Exportar & Importar',
    titleEn: 'Export & Import',
    descPt: 'Nenhum dado pessoal é salvo nos servidores, tudo fica guardado localmente no seu navegador. Para não perder seus resultados, lembre-se de sempre exportar seus dados em JSON através deste menu.',
    descEn: 'No personal data is saved on servers, everything is kept locally in your browser. To avoid losing your results, remember to always export your data in JSON using this menu.',
    placement: 'bottom',
    page: '/'
  },
  {
    target: null,
    titlePt: 'Tudo Pronto!',
    titleEn: "You're All Set!",
    descPt: 'Agora você sabe tudo que precisa! Comece adicionando sua renda e explore cada seção. Você pode refazer este tour a qualquer momento pelo menu de opções.',
    descEn: 'Now you know everything you need! Start by adding your income and explore each section. You can retake this tour at any time from the options menu.',
    placement: 'center',
    page: '/'
  },
]

const GuidedTour = ({ isOpen, onClose }) => {
  const { lang } = useFinance()
  const navigate = useNavigate()
  const location = useLocation()
  const [step, setStep] = useState(0)
  const [spotlightRect, setSpotlightRect] = useState(null)
  const [tooltipStyle, setTooltipStyle] = useState({ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
  const [isAnimating, setIsAnimating] = useState(false)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [hasOtherModal, setHasOtherModal] = useState(false)
  const tooltipRef = useRef(null)
  const isPt = lang === 'pt'

  const currentStep = TOUR_STEPS[step]
  const totalSteps = TOUR_STEPS.length

  // Position the spotlight and tooltip
  const positionElements = useCallback((shouldScroll = false) => {
    if (!currentStep || !isOpen) return

    if (!currentStep.target || currentStep.placement === 'center') {
      setSpotlightRect(null)
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      })
      return
    }

    const el = document.querySelector(currentStep.target)
    if (!el) {
      setSpotlightRect(null)
      setTooltipStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      })
      return
    }

    // Automatically scroll page to center target element only on step change
    if (shouldScroll) {
      el.scrollIntoView({ behavior: 'auto', block: 'center' })
    }

    const rect = el.getBoundingClientRect()
    const pad = 8

    setSpotlightRect({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    })

    // Calculate tooltip position using dynamic box height if rendered
    const tooltipW = 360
    const tooltipH = tooltipRef.current ? tooltipRef.current.offsetHeight : 220
    const gap = 16
    let style = { position: 'fixed' }

    switch (currentStep.placement) {
      case 'bottom':
        style.top = Math.min(rect.bottom + gap, window.innerHeight - tooltipH - 24)
        style.left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16))
        break
      case 'top':
        style.top = Math.max(16, rect.top - tooltipH - gap)
        style.left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16))
        break
      case 'left':
        style.top = Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipH / 2, window.innerHeight - tooltipH - 24))
        style.left = Math.max(16, rect.left - tooltipW - gap)
        break
      case 'right':
        style.top = Math.max(16, Math.min(rect.top + rect.height / 2 - tooltipH / 2, window.innerHeight - tooltipH - 24))
        style.left = Math.min(rect.right + gap, window.innerWidth - tooltipW - 16)
        break
      default:
        style.top = rect.bottom + gap
        style.left = rect.left
    }

    setTooltipStyle(style)
  }, [currentStep, isOpen])

  useEffect(() => {
    if (!isOpen) return
    
    let isTransition = false
    if (currentStep?.page && location.pathname !== currentStep.page) {
      setIsChangingPage(true)
      navigate(currentStep.page)
      isTransition = true
    }
    
    // Wait for DOM to settle, then position
    const delay = isTransition ? 450 : 50
    const t = setTimeout(() => {
      positionElements(true)
      setIsChangingPage(false)
    }, delay)
    
    return () => clearTimeout(t)
  }, [step, isOpen, currentStep, navigate, location.pathname, positionElements])

  // Reposition on resize and polling (NO scroll event listener to keep elements fixed where they appear)
  useEffect(() => {
    if (!isOpen) return
    const handler = () => {
      positionElements(false)
      // Detect if other modal overlays exist in DOM (excluding tour elements)
      const otherModal = document.querySelector('.modal-overlay:not(.tour-overlay), .welcome-modal, .reset-modal')
      setHasOtherModal(!!otherModal)
    }
    window.addEventListener('resize', handler)
    
    // Periodically poll to adapt to inputs expansion and dynamic layouts shifts
    const interval = setInterval(handler, 200)
    
    return () => {
      window.removeEventListener('resize', handler)
      clearInterval(interval)
    }
  }, [isOpen, positionElements])

  // Reset step when opening
  useEffect(() => {
    if (isOpen) setStep(0)
  }, [isOpen])

  const goNext = () => {
    if (step < totalSteps - 1) {
      setIsAnimating(true)
      setTimeout(() => { setStep(s => s + 1); setIsAnimating(false) }, 150)
    } else {
      handleFinish()
    }
  }

  const goPrev = () => {
    if (step > 0) {
      setIsAnimating(true)
      setTimeout(() => { setStep(s => s - 1); setIsAnimating(false) }, 150)
    }
  }

  const handleFinish = () => {
    localStorage.setItem('finhelper_tour_done', 'true')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={`tour-overlay ${isChangingPage || hasOtherModal ? 'is-changing-page' : ''}`}>
      {spotlightRect ? (
        <div 
          className="tour-spotlight"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
          }}
        />
      ) : (
        <div className="tour-backdrop-full" />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`tour-tooltip ${isAnimating ? 'animating' : ''} ${currentStep?.placement === 'center' ? 'is-center' : ''}`}
        style={tooltipStyle}
      >
        {/* Step counter */}
        <div className="tour-tooltip-header">
          <div className="tour-step-counter">
            <Sparkles size={14} />
            <span>{step + 1} / {totalSteps}</span>
          </div>
          <button className="tour-close-btn" onClick={handleFinish}>
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="tour-progress-track">
          <div className="tour-progress-fill" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>

        {/* Page Change dynamic badge */}
        {currentStep?.page && currentStep.placement !== 'center' && (
          <div className="tour-page-badge">
            <span>{isPt ? 'Página Atual: ' : 'Current Page: '}</span>
            <strong>
              {currentStep.page === '/' 
                ? (isPt ? 'Orçamento' : 'Budget') 
                : currentStep.page === '/portfolio'
                ? (isPt ? 'Carteira' : 'Portfolio')
                : currentStep.page === '/goals' 
                ? (isPt ? 'Metas' : 'Goals') 
                : currentStep.page === '/evolution' 
                ? (isPt ? 'Evolução' : 'Evolution') 
                : currentStep.page === '/interest'
                ? (isPt ? 'Calculadora' : 'Calculator')
                : currentStep.page === '/calendar'
                ? (isPt ? 'Calendário' : 'Calendar')
                : (isPt ? 'Dicas' : 'Tips')}
            </strong>
          </div>
        )}

        {/* Content */}
        <h3 className="tour-title">
          {isPt ? currentStep?.titlePt : currentStep?.titleEn}
        </h3>
        <p className="tour-desc">
          {isPt ? currentStep?.descPt : currentStep?.descEn}
        </p>

        {/* Navigation */}
        <div className="tour-actions">
          <button
            className="tour-btn tour-btn-skip"
            onClick={handleFinish}
          >
            {isPt ? 'Pular tour' : 'Skip tour'}
          </button>
          <div className="tour-btn-group">
            {step > 0 && (
              <button className="tour-btn tour-btn-prev" onClick={goPrev}>
                <ChevronLeft size={16} />
                {isPt ? 'Anterior' : 'Previous'}
              </button>
            )}
            <button className="tour-btn tour-btn-next" onClick={goNext}>
              {step === totalSteps - 1
                ? (isPt ? 'Concluir' : 'Finish')
                : (isPt ? 'Próximo' : 'Next')}
              {step < totalSteps - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidedTour
