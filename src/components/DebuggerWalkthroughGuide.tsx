import React from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Bug, 
  Sparkles, 
  Eye, 
  Layers, 
  Terminal, 
  Play, 
  SkipForward, 
  SkipBack, 
  CheckCircle2, 
  Info,
  Table,
  Plus
} from 'lucide-react';

export interface WalkthroughStep {
  id: string;
  title: string;
  subtitle: string;
  targetViewMode: 'output' | 'debug' | 'split';
  targetTab?: 'variables' | 'trace' | 'callstack';
  content: string;
  sapTip: string;
  hotkey?: string;
  icon: React.ReactNode;
}

interface DebuggerWalkthroughGuideProps {
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onJumpToStep: (index: number) => void;
}

export const DEBUGGER_STEPS: WalkthroughStep[] = [
  {
    id: 'intro',
    title: '1. O que é o Debugger NetWeaver (/h)?',
    subtitle: 'Ambiente de depuração e inspeção do fluxo de dados ABAP',
    targetViewMode: 'debug',
    targetTab: 'variables',
    icon: <Bug className="w-5 h-5 text-amber-400" />,
    content:
      'No SAP clássico, digitar "/h" no campo de comando ativa a depuração. Aqui, o Debug Console replica a interface oficial do NetWeaver, permitindo inspecionar como as variáveis de memória, tabelas internas e registradores mudam a cada instrução executada.',
    sapTip: 'Dica SAP: Você pode alternar entre "Saída do Programa", "Debug Console" ou "Visão Dividida" a qualquer momento usando a barra superior.',
    hotkey: 'Comando OK-Code: /h',
  },
  {
    id: 'system_registers',
    title: '2. Registradores de Sistema (SY-SUBRC, SY-TABIX, SY-DBCNT)',
    subtitle: 'Status da última operação e ponteiros de controle',
    targetViewMode: 'debug',
    targetTab: 'variables',
    icon: <Info className="w-5 h-5 text-blue-400" />,
    content:
      'No topo do Debug Console, você tem acesso aos registradores de sistema mais vitais do ABAP: SY-SUBRC (código de retorno: 0 = sucesso, 4 = registro não encontrado), SY-TABIX (linha atual em processamento dentro de um LOOP ou READ TABLE), e SY-DBCNT (linhas lidas ou alteradas no banco).',
    sapTip: 'Regra de ouro: Em ABAP, sempre verifique "IF sy-subrc = 0" imediatamente após SELECTs e READ TABLEs!',
    hotkey: 'Registradores: SY-SUBRC, SY-TABIX, SY-DBCNT',
  },
  {
    id: 'stepping',
    title: '3. Execução Passo a Passo (F5 / F6)',
    subtitle: 'Navegando linha a linha no código executável',
    targetViewMode: 'debug',
    targetTab: 'variables',
    icon: <SkipForward className="w-5 h-5 text-emerald-400" />,
    content:
      'Use os botões de passo (Passo Anterior e Próximo Passo) ou as teclas F5/F6 para percorrer cada evento do programa. Ao avançar, veja o estado das variáveis e os loops sendo iterados passo a passo exatamente como no depurador clássico da SAP.',
    sapTip: 'Atalho clássico: F5 executa linha por linha entrando em sub-rotinas (Single Step); F6 executa a linha atual sem entrar em detalhes (Execute).',
    hotkey: 'Teclas de Atalho: F5 / F6 / F8',
  },
  {
    id: 'inspect_variables',
    title: '4. Inspecionando Variáveis e Tabelas Internas (ITAB)',
    subtitle: 'Memória detalhada de estruturas e coleções de dados',
    targetViewMode: 'debug',
    targetTab: 'variables',
    icon: <Table className="w-5 h-5 text-purple-400" />,
    content:
      'Na aba "Variáveis Monitoradas", cada linha exibe o nome do campo, tipo técnico e valor atual em memória. Quando uma variável possui estrutura (Work Area) ou é uma Tabela Interna (ITAB), você pode clicar na linha para abrir a visualização detalhada de colunas e registros!',
    sapTip: 'Convenção de nomes SAP: LT_ = Tabela Interna Local, LS_ = Estrutura/Work Area Local, GV_ = Variável Global.',
    hotkey: 'Clique para expandir registros',
  },
  {
    id: 'watchpoints',
    title: '5. Watchpoints Customizados & Filtros',
    subtitle: 'Monitore variáveis específicas de interesse na sua sessão',
    targetViewMode: 'debug',
    targetTab: 'variables',
    icon: <Plus className="w-5 h-5 text-amber-300" />,
    content:
      'Quer acompanhar uma variável específica? Digite o nome no campo "+ Watchpoint" e clique no botão de adição. Você também pode filtrar a lista instantaneamente clicando nos botões "Sistema (SY-*)", "Tabelas (ITAB)", "Estruturas (WA)" ou "Escalares".',
    sapTip: 'No SAP GUI real, um Watchpoint pausa a execução do programa automaticamente no momento exato em que a variável muda de valor!',
    hotkey: 'Adicionar Watchpoint (+)',
  },
  {
    id: 'trace_timeline',
    title: '6. Linha do Tempo de Execução (Trace) & Call Stack',
    subtitle: 'Histórico cronológico de cada instrução percorrida',
    targetViewMode: 'debug',
    targetTab: 'trace',
    icon: <Layers className="w-5 h-5 text-cyan-400" />,
    content:
      'Acesse a aba "Fluxo de Execução (Trace)" para visualizar o histórico completo de passos percorridos pelo interpretador ABAP, com trechos de código, eventos de início de seleção e a pilha de chamadas (Call Stack).',
    sapTip: 'Excelente para identificar loops infinitos ou instruções lentas que causam timeout (DUMP TIME_OUT).',
    hotkey: 'Aba: Fluxo de Execução (Trace)',
  },
];

export const DebuggerWalkthroughGuide: React.FC<DebuggerWalkthroughGuideProps> = ({
  currentStepIndex,
  onNext,
  onPrev,
  onClose,
  onJumpToStep,
}) => {
  const step = DEBUGGER_STEPS[currentStepIndex] || DEBUGGER_STEPS[0];
  const isLast = currentStepIndex === DEBUGGER_STEPS.length - 1;
  const isFirst = currentStepIndex === 0;

  return (
    <div className="bg-slate-900 text-white rounded-lg border-2 border-amber-500/80 shadow-2xl p-4 sm:p-5 relative animate-in fade-in slide-in-from-top-3 duration-200 font-sans max-w-2xl mx-auto my-2">
      {/* Header with Step indicator */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-md">
            {step.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded font-mono uppercase">
                Guia Interativo de Depuração
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Passo {currentStepIndex + 1} de {DEBUGGER_STEPS.length}
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white mt-0.5">
              {step.title}
            </h4>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          title="Fechar Guia"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body content */}
      <div className="space-y-3 text-xs sm:text-sm">
        <p className="text-slate-200 leading-relaxed">
          {step.content}
        </p>

        {/* SAP Pro Tip Box */}
        <div className="bg-blue-950/60 border border-blue-700/60 rounded-lg p-3 text-blue-200 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">Conceito Oficial SAP NetWeaver:</div>
            <div>{step.sapTip}</div>
            {step.hotkey && (
              <div className="font-mono text-[11px] text-blue-300 pt-0.5">
                ⚡ {step.hotkey}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Dots & Nav buttons */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-700/80">
        <div className="flex items-center space-x-1.5">
          {DEBUGGER_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => onJumpToStep(idx)}
              title={s.title}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'w-6 bg-amber-400 shadow-xs'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          )}

          <button
            onClick={isLast ? onClose : onNext}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>{isLast ? 'Entendi, Concluir Guia! ✓' : 'Próximo Passo'}</span>
            {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
