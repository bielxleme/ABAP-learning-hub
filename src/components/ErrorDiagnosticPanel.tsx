import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Database, 
  Table, 
  FileCode2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { UserErrorRecord, UserAnswerHistory } from '../types';

interface ErrorDiagnosticPanelProps {
  errorLogs: UserErrorRecord[];
  answerHistory: UserAnswerHistory[];
  onPracticeTopic?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION') => void;
  onClearResolvedErrors?: () => void;
}

export const ErrorDiagnosticPanel: React.FC<ErrorDiagnosticPanelProps> = ({
  errorLogs = [],
  answerHistory = [],
  onPracticeTopic,
  onClearResolvedErrors,
}) => {
  const totalAnswers = answerHistory.length;
  const correctAnswers = answerHistory.filter((a) => a.isCorrect).length;
  const wrongAnswers = answerHistory.filter((a) => !a.isCorrect).length;
  const totalErrors = errorLogs.length + wrongAnswers;

  const accuracyRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 100;

  // Category counts
  const selectErrors = errorLogs.filter((e) => e.category === 'SELECT_SQL').length +
    answerHistory.filter((a) => !a.isCorrect && (a.questionTitle.toLowerCase().includes('select') || a.level === 'Nível 2')).length;

  const itabErrors = errorLogs.filter((e) => e.category === 'INTERNAL_TABLES').length +
    answerHistory.filter((a) => !a.isCorrect && (a.questionTitle.toLowerCase().includes('tabela') || a.questionTitle.toLowerCase().includes('loop') || a.questionTitle.toLowerCase().includes('read'))).length;

  const syntaxErrors = errorLogs.filter((e) => e.category === 'PUNCTUATION_PERIOD' || e.category === 'GENERAL_SYNTAX').length;
  const declarationErrors = errorLogs.filter((e) => e.category === 'DATA_DECLARATION').length;

  // Trend: compare first half vs second half of recent answers
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (answerHistory.length >= 6) {
    const half = Math.floor(answerHistory.length / 2);
    const older = answerHistory.slice(0, half);
    const newer = answerHistory.slice(half);

    const olderRate = older.filter((a) => a.isCorrect).length / older.length;
    const newerRate = newer.filter((a) => a.isCorrect).length / newer.length;

    if (newerRate > olderRate + 0.1) trend = 'improving';
    else if (newerRate < olderRate - 0.1) trend = 'declining';
  }

  // Generate personalized study recommendations based on committed errors
  const recommendations: { title: string; desc: string; category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION'; actionLabel: string }[] = [];

  if (selectErrors > 0) {
    recommendations.push({
      title: 'Dominar a Cláusula INTO TABLE e SELECT SINGLE',
      desc: `Detectamos ${selectErrors} erros em consultas SQL. Lembre-se: em consultas para tabelas internas, sempre utilize "INTO TABLE" em vez de "INTO", e especifique campos ao invés de SELECT *.`,
      category: 'SELECT_SQL',
      actionLabel: 'Treinar SELECTs no Laboratório',
    });
  }

  if (itabErrors > 0) {
    recommendations.push({
      title: 'Uso de Field-Symbols e BINARY SEARCH',
      desc: `Identificamos ${itabErrors} dificuldades com Tabelas Internas. Pratique iterações com ASSIGNING FIELD-SYMBOL(<fs>) e lembre-se do pré-requisito de SORT itab BY antes de READ com BINARY SEARCH.`,
      category: 'INTERNAL_TABLES',
      actionLabel: 'Praticar Tabelas Internas',
    });
  }

  if (syntaxErrors > 0) {
    recommendations.push({
      title: 'Atenção ao Ponto Final (.) em Cada Instrução',
      desc: `O compilador acusou ${syntaxErrors} erros de sintaxe por falta de ponto final. No ABAP, toda instrução termina obrigatoriamente com ponto (.) ou dois-pontos em cadeias (WRITE: / ...).`,
      category: 'PUNCTUATION_PERIOD',
      actionLabel: 'Ver Regras no Dicionário',
    });
  }

  // Default recommendation if no errors yet
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Excelente Desempenho!',
      desc: 'Você cometeu pouquíssimos erros! Continue praticando os desafios dos Níveis 1 e 2 no Laboratório Prático para fixar 100% da sintaxe.',
      category: 'SELECT_SQL',
      actionLabel: 'Explorar Desafios Avançados',
    });
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18233c] via-[#243354] to-[#162033] text-white rounded-lg p-5 shadow-md border border-[#30446b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Diagnóstico Inteligente de Aprendizado</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Centro de Diagnóstico & Correção de Erros ABAP</span>
            </h2>
            <p className="text-xs text-blue-200 mt-1 max-w-xl">
              O sistema analisa cada erro cometido no Editor SE38 e nos desafios práticos, calculando sua evolução ao longo do tempo e recomendando treinos específicos.
            </p>
          </div>

          {/* Status Badge */}
          <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-center sm:text-right shrink-0">
            <div className="text-[11px] text-slate-400">Taxa Geral de Acertos</div>
            <div className={`text-2xl font-bold font-mono ${accuracyRate >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {accuracyRate}%
            </div>
            <div className="text-[10px] text-slate-400">
              {correctAnswers} acertos • {totalErrors} erros
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Evolution Trend & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Gráfico e Tendência de Melhora/Piora */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0070f2]" />
              <span>Tendência de Evolução no Tempo</span>
            </h3>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
              trend === 'improving'
                ? 'bg-emerald-100 text-emerald-800'
                : trend === 'declining'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {trend === 'improving' && <TrendingUp className="w-3.5 h-3.5" />}
              {trend === 'declining' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend === 'improving' ? 'Em Melhora Constante' : trend === 'declining' ? 'Atenção: Queda Recente' : 'Desempenho Estável'}
            </span>
          </div>

          {/* Visual Mini Progress Bars */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Acertos Recentes</span>
                <span className="font-mono font-bold text-emerald-700">{correctAnswers}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Erros ou Dificuldades</span>
                <span className="font-mono font-bold text-red-600">{totalErrors}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalAnswers > 0 ? (wrongAnswers / totalAnswers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
            {trend === 'improving' 
              ? 'Parabéns! Sua taxa de acertos nas últimas tentativas cresceu significativamente.'
              : trend === 'declining'
              ? 'Notamos uma concentração de erros nas últimas tentativas. Use os treinos sugeridos abaixo para recuperar seu ritmo.'
              : 'Você mantém uma taxa contínua e equilibrada de resolução de exercícios.'}
          </p>
        </div>

        {/* Card 2: Distribuição por Tipo de Erro */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Distribuição por Tópico Crítico</span>
            </h3>
            <span className="text-[10px] text-slate-400">Total analisado</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-slate-700">Comandos SELECT & Open SQL</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {selectErrors} ocorrências
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2">
                <Table className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-700">Tabelas Internas (ITAB) & Loops</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {itabErrors} ocorrências
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-slate-700">Pontuação e Ponto Final (.)</span>
              </div>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {syntaxErrors} ocorrências
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations & Practice Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0070f2]" />
              <span>Plano Personalizado de Estudo e Recuperação</span>
            </h3>
            <p className="text-xs text-slate-500">
              Clique em "Melhorar" para praticar desafios formulados especificamente para suprir as lacunas encontradas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <div 
              key={i}
              className="p-3.5 rounded-lg border border-blue-100 bg-blue-50/40 hover:bg-blue-50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{rec.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rec.desc}
                </p>
              </div>

              {onPracticeTopic && (
                <button
                  type="button"
                  onClick={() => onPracticeTopic(rec.category)}
                  className="self-start px-3 py-1.5 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Error Activity Log */}
      {errorLogs.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800">
              Histórico Detalhado de Erros Observados ({errorLogs.length})
            </h3>
            {onClearResolvedErrors && (
              <button
                type="button"
                onClick={onClearResolvedErrors}
                className="text-[11px] text-slate-500 hover:text-slate-700 underline"
              >
                Limpar Histórico Resolvido
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {errorLogs.map((err) => (
              <div 
                key={err.id}
                className="p-2.5 rounded border border-slate-200 bg-slate-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{err.title}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 rounded font-mono">
                      {err.source === 'editor_syntax' ? 'Editor SE38' : 'Quiz'}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">{err.detail}</div>
                </div>

                <div className="text-[10px] text-slate-400 shrink-0">
                  {new Date(err.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
