import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Header from '../components/Header'
import { Sparkles, Landmark, Compass, Award, ShieldAlert, BadgeDollarSign } from 'lucide-react'
import './TipsPage.css'

const TipsPage = () => {
  const { lang } = useFinance()
  const isPt = lang === 'pt'

  const [activeTab, setActiveTab] = useState('phase1')

  const tipsData = {
    phase1: {
      title: isPt ? 'Fase 1: Preparando o Terreno' : 'Phase 1: Preparing the Ground',
      subtitle: isPt ? 'Os fundamentos essenciais antes de começar a investir.' : 'Essential fundamentals before you start investing.',
      badge: isPt ? 'Iniciante' : 'Beginner',
      icon: ShieldAlert,
      color: '#ef4444',
      items: [
        {
          title: isPt ? 'Quitação de Dívidas Caras' : 'Paying off High-Interest Debt',
          desc: isPt 
            ? 'Antes de focar em investimentos, livre-se das dívidas com juros altos (cartão de crédito, cheque especial). Os juros cobrados nas dívidas são quase sempre maiores do que a rentabilidade de qualquer investimento de mercado.'
            : 'Before focusing on investments, eliminate high-interest debt (credit cards, overdrafts). The interest charged on debts is almost always higher than the returns from any market investment.'
        },
        {
          title: isPt ? 'Construção da Reserva de Emergência' : 'Building an Emergency Fund',
          desc: isPt 
            ? 'Crie um colchão financeiro equivalente a 6 meses de suas despesas essenciais. O objetivo não é rentabilidade, mas sim segurança e liquidez diária. Em caso de imprevistos, você não precisará resgatar investimentos de longo prazo com prejuízo.'
            : 'Create a financial cushion equivalent to 6 months of your essential expenses. The goal is not high returns, but security and daily liquidity. In case of unexpected events, you won\'t need to redeem long-term investments at a loss.'
        },
        {
          title: isPt ? 'Onde Alocar a Reserva' : 'Where to Put Your Emergency Fund',
          desc: isPt 
            ? 'Busque investimentos super seguros e com liquidez imediata (resgate no mesmo dia), como o Tesouro Selic no Tesouro Direto, CDB de liquidez diária de grandes bancos (100% do CDI) ou contas remuneradas seguras.'
            : 'Look for super secure investments with immediate liquidity (same-day redemption), such as Treasury Selic in the Direct Treasury, daily liquidity CDB from major banks (100% of CDI) or secure remunerated accounts.'
        }
      ]
    },
    phase2: {
      title: isPt ? 'Fase 2: Renda Fixa Segura' : 'Phase 2: Safe Fixed Income',
      subtitle: isPt ? 'Onde seu capital trabalha com previsibilidade e baixo risco.' : 'Where your capital works with predictability and low risk.',
      badge: isPt ? 'Intermediário' : 'Intermediate',
      icon: Landmark,
      color: '#3b82f6',
      items: [
        {
          title: isPt ? 'O que é Renda Fixa?' : 'What is Fixed Income?',
          desc: isPt 
            ? 'São títulos de dívida onde você "empresta" seu dinheiro para um banco, empresa ou governo em troca de juros. Os rendimentos podem ser pós-fixados (atrelados ao CDI/Selic), pré-fixados (taxa fixa ex: 11% ao ano) ou híbridos (IPCA + taxa).'
            : 'These are debt securities where you "lend" your money to a bank, company, or government in exchange for interest. Returns can be post-fixed (linked to CDI/Selic), pre-fixed (fixed rate e.g., 11% per year) or hybrid (IPCA + fixed rate).'
        },
        {
          title: isPt ? 'CDB, LCI e LCA' : 'CDB, LCI and LCA',
          desc: isPt 
            ? 'CDBs são emitidos por bancos. LCIs e LCAs são focadas nos setores imobiliário e do agronegócio e têm um grande diferencial: são isentas de Imposto de Renda para pessoas físicas. Excelentes para prazos curtos e médios.'
            : 'CDBs are issued by banks. LCIs and LCAs focus on real estate and agribusiness sectors and have a huge advantage: they are exempt from Income Tax for individuals. Excellent for short and medium terms.'
        },
        {
          title: isPt ? 'Entenda o FGC' : 'Understand the FGC (Credit Guarantee Fund)',
          desc: isPt 
            ? 'O Fundo Garantidor de Crédito é a sua segurança na Renda Fixa privada. Se o banco onde você investiu quebrar, o FGC garante a devolução de até R$ 250.000 por CPF e por instituição financeira.'
            : 'The Credit Guarantor Fund is your security in private Fixed Income. If the bank where you invested goes bankrupt, the FGC guarantees the return of up to R$ 250,000 per CPF and per financial institution.'
        }
      ]
    },
    phase3: {
      title: isPt ? 'Fase 3: Renda Variável Iniciante' : 'Phase 3: Beginner Variable Income',
      subtitle: isPt ? 'Participando do crescimento de grandes negócios e imóveis.' : 'Participating in the growth of major businesses and real estate.',
      badge: isPt ? 'Avançado' : 'Advanced',
      icon: Compass,
      color: '#10b981',
      items: [
        {
          title: isPt ? 'Fundos Imobiliários (FIIs)' : 'Real Estate Funds (FIIs)',
          desc: isPt 
            ? 'Permitem que você compre pequenas fatias de grandes imóveis do país (shoppings, galpões logísticos, edifícios comerciais). A grande vantagem é receber rendimentos mensais (dividendos) direto na conta, isentos de Imposto de Renda.'
            : 'Allow you to buy small shares of major real properties (malls, logistic warehouses, commercial buildings). The main advantage is receiving monthly income (dividends) directly in your account, tax-free.'
        },
        {
          title: isPt ? 'Ações de Grandes Empresas' : 'Stocks in Major Companies',
          desc: isPt 
            ? 'Comprar uma ação significa tornar-se sócio de uma empresa. Para iniciantes, o ideal é focar em empresas consolidadas, lucrativas e boas pagadoras de dividendos, pertencentes a setores perenes como energia elétrica, bancos e saneamento.'
            : 'Buying a stock means becoming a partner in a company. For beginners, the ideal is to focus on established, profitable companies that pay solid dividends, belonging to resilient sectors like utilities, banks, and sanitation.'
        },
        {
          title: isPt ? 'A Regra do Longo Prazo' : 'The Long-Term Golden Rule',
          desc: isPt 
            ? 'Na Renda Variável, as cotações flutuam diariamente. O segredo do sucesso é focar no longo prazo, reinvestir os dividendos recebidos para gerar juros compostos e não se desesperar com as oscilações de curto prazo do mercado.'
            : 'In Variable Income, prices fluctuate daily. The secret to success is to focus on the long term, reinvest the dividends received to compound your wealth, and not panic with short-term market fluctuations.'
        }
      ]
    },
    phase4: {
      title: isPt ? 'Fase 4: Diversificação & Visão Global' : 'Phase 4: Diversification & Global View',
      subtitle: isPt ? 'Protegendo seu patrimônio com ativos globais.' : 'Protecting your wealth with global assets.',
      badge: isPt ? 'Master' : 'Master',
      icon: Award,
      color: '#8b5cf6',
      items: [
        {
          title: isPt ? 'ETFs Internacionais' : 'International ETFs',
          desc: isPt 
            ? 'Investir apenas no Brasil deixa você exposto ao risco político e cambial de um único país emergente. ETFs como o IVVB11 ou WRLD11 permitem investir em milhares de empresas mundiais (como Apple, Microsoft, Amazon) de forma simples.'
            : 'Investing only in Brazil leaves you exposed to political and currency risks of a single emerging country. ETFs like IVVB11 or WRLD11 allow you to invest in thousands of global companies (like Apple, Microsoft, Amazon) easily.'
        },
        {
          title: isPt ? 'Alocação Estratégica de Ativos' : 'Asset Allocation Strategy',
          desc: isPt 
            ? 'Defina percentuais ideais para cada tipo de investimento baseados no seu perfil (ex: 60% Renda Fixa, 20% FIIs, 15% Ações, 5% Internacional). Faça aportes mensais direcionando o dinheiro para o ativo que estiver abaixo da meta.'
            : 'Define target percentages for each asset class based on your profile (e.g., 60% Fixed Income, 20% FIIs, 15% Stocks, 5% International). Invest monthly by sending money to the asset class currently below its target.'
        },
        {
          title: isPt ? 'A Regra de Ouro' : 'The Golden Rule',
          desc: isPt 
            ? 'Mais importante do que tentar acertar a melhor ação da moda é manter a constância de aportes mensais, diversificar amplamente para mitigar riscos, e manter o foco no seu trabalho para aumentar sua capacidade de poupança.'
            : 'More important than trying to pick the trendiest stock of the day is keeping a consistent monthly savings habit, diversifying broadly to mitigate risks, and focusing on your career to boost your saving capacity.'
        }
      ]
    }
  }

  const activePhase = tipsData[activeTab]
  const PhaseIcon = activePhase.icon

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content tips-page">
        {/* Intro */}
        <div className="tips-hero-card">
          <div className="tips-hero-text">
            <h2>{isPt ? 'Trilha do Aprendizado Financeiro' : 'Financial Learning Path'}</h2>
            <p>
              {isPt 
                ? 'Aprenda a organizar e planejar seus investimentos de forma estruturada, seguindo os passos recomendados por investidores profissionais.' 
                : 'Learn to organize and plan your investments in a structured way, following the steps recommended by professional investors.'}
            </p>
          </div>
          <Sparkles className="hero-sparkle" size={60} />
        </div>

        {/* Disclaimer Section */}
        <div className="tips-disclaimer-box">
          <p>
            {isPt 
              ? 'Aviso: As informações apresentadas nesta página têm fins exclusivamente educativos. Cada pessoa possui uma realidade financeira e perfil de risco único, portanto nada aqui deve ser interpretado como regra funcional rígida ou recomendação direta de investimento. Essas são apenas as recomendações mais discutidas no mercado financeiro.'
              : 'Disclaimer: The information presented on this page is for educational purposes only. Each individual has a unique financial reality and risk profile, so nothing here should be interpreted as a rigid functional rule or direct investment recommendation. These are merely the most discussed suggestions in the financial market.'}
          </p>
        </div>

        {/* Phase Navigator Tabs */}
        <div className="phase-navigation-tabs">
          {Object.keys(tipsData).map(key => {
            const phase = tipsData[key]
            const isSelected = activeTab === key
            return (
              <button
                key={key}
                className={`phase-tab-pill ${isSelected ? 'active' : ''}`}
                style={{ '--accent': phase.color }}
                onClick={() => setActiveTab(key)}
              >
                <span className="phase-tab-badge" style={{ backgroundColor: phase.color }}>{phase.badge}</span>
                <span className="phase-tab-title">{isPt ? (key === 'phase1' ? 'Fase 1' : key === 'phase2' ? 'Fase 2' : key === 'phase3' ? 'Fase 3' : 'Fase 4') : (key === 'phase1' ? 'Phase 1' : key === 'phase2' ? 'Phase 2' : key === 'phase3' ? 'Phase 3' : 'Phase 4')}</span>
              </button>
            )
          })}
        </div>

        {/* Active Phase Details Container */}
        <div className="phase-details-container" style={{ borderTopColor: activePhase.color }}>
          <div className="phase-details-header">
            <div className="phase-icon-wrapper" style={{ color: activePhase.color, backgroundColor: `${activePhase.color}15` }}>
              <PhaseIcon size={24} />
            </div>
            <div>
              <h3 className="phase-title">{activePhase.title}</h3>
              <p className="phase-subtitle">{activePhase.subtitle}</p>
            </div>
          </div>

          <div className="phase-items-grid">
            {activePhase.items.map((item, idx) => (
              <div key={idx} className="phase-item-card">
                <div className="phase-item-header">
                  <div className="item-number-badge" style={{ borderColor: activePhase.color, color: activePhase.color }}>
                    {idx + 1}
                  </div>
                  <h4>{item.title}</h4>
                </div>
                <p className="item-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Budgeting Method Box */}
        <div className="budgeting-method-card">
          <div className="method-icon-wrapper">
            <BadgeDollarSign size={28} />
          </div>
          <div className="method-text">
            <h4>{isPt ? 'Distribuição Recomendada do Orçamento' : 'Recommended Budget Distribution'}</h4>
            <p>
              {isPt 
                ? 'Os percentuais recomendados exibidos em seu painel de Orçamento (35% para Custos Fixos, 15% para Conforto, 10% para Metas, 10% para Prazeres, 25% para Liberdade Financeira e 5% para Conhecimento) refletem as recomendações padrões mais consolidadas do mercado financeiro para uma vida financeira equilibrada. Você pode adaptar esses limites livremente na aba de Metas conforme seus objetivos pessoais.'
                : 'The recommended percentages shown in your Budget panel (35% for Fixed Costs, 15% for Comfort, 10% for Goals, 10% for Pleasures, 25% for Financial Freedom, and 5% for Knowledge) reflect the most established default recommendations from the financial market for a balanced life. You can freely adapt these limits in the Goals tab to match your personal goals.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TipsPage
