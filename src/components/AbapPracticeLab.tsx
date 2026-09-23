import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Database, 
  Table, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  Code2, 
  Eye, 
  Check, 
  Filter,
  Maximize2,
  Minimize2,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { LabExercise } from '../types';
import { ABAP_PRACTICE_LAB_EXERCISES } from '../data/abapPracticeLabData';
import { sounds } from '../utils/soundEffects';

interface AbapPracticeLabProps {
  completedExerciseIds: string[];
  onCompleteExercise: (exerciseId: string, xpEarned: number, category: string) => void;
  onRecordError?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES', title: string, detail: string, code: string) => void;
  soundEnabled: boolean;
}

export const AbapPracticeLab: React.FC<AbapPracticeLabProps> = ({
  completedExerciseIds,
  onCompleteExercise,
  onRecordError,
  soundEnabled,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'SELECT & Open SQL' | 'Tabelas Internas (ITAB)'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'Nível 1' | 'Nível 2'>('all');
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Filtered exercises list
  const filteredExercises = ABAP_PRACTICE_LAB_EXERCISES.filter((ex) => {
    const matchCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchLevel = selectedLevel === 'all' || ex.level === selectedLevel;
    return matchCategory && matchLevel;
  });

  const currentExercise: LabExercise | undefined = filteredExercises[activeExerciseIndex] || filteredExercises[0];

  // Initialize editor with exercise code when currentExercise changes
  React.useEffect(() => {
    if (currentExercise) {
      setUserCode(currentExercise.initialCode || '');
      setSubmitted(false);
      setIsSuccess(false);
      setFeedback('');
      setShowHint(false);
      setShowSolution(false);
    }
  }, [currentExercise?.id]);

  const handleSelectExercise = (idx: number) => {
    setActiveExerciseIndex(idx);
  };

  const handleVerifyCode = () => {
    if (!currentExercise) return;
    const normalizedInput = userCode.toUpperCase().replace(/\s+/g, ' ');
    const { requiredTokens, forbiddenTokens } = currentExercise.solutionPattern;

    let passed = true;
    let missingToken = '';

    for (const token of requiredTokens) {
      const normalizedToken = token.toUpperCase().replace(/\s+/g, ' ');
      if (!normalizedInput.includes(normalizedToken)) {
        passed = false;
        missingToken = token;
        break;
      }
    }

    if (forbiddenTokens && passed) {
      for (const token of forbiddenTokens) {
        if (normalizedInput.includes(token.toUpperCase())) {
          passed = false;
          missingToken = `Evite usar o comando: ${token}`;
          break;
        }
      }
    }

    setSubmitted(true);
    setIsSuccess(passed);

    if (passed) {
      if (soundEnabled) sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setFeedback('Excelente! Sintaxe e comandos ABAP aplicados com perfeição!');
      onCompleteExercise(
        currentExercise.id,
        currentExercise.xpReward,
        currentExercise.category === 'SELECT & Open SQL' ? 'SELECT' : 'ITAB'
      );
    } else {
      if (soundEnabled) sounds.playError();
      const errDetail = missingToken.startsWith('Evite')
        ? missingToken
        : `A instrução ABAP esperada "${missingToken}" não foi encontrada no código.`;
      setFeedback(errDetail);

      if (onRecordError) {
        onRecordError(
          currentExercise.category === 'SELECT & Open SQL' ? 'SELECT_SQL' : 'INTERNAL_TABLES',
          currentExercise.title,
          errDetail,
          userCode
        );
      }
    }
  };

  const handleNext = () => {
    if (activeExerciseIndex < filteredExercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
    }
  };

  const handleReset = () => {
    if (currentExercise) {
      setUserCode(currentExercise.initialCode || '');
      setSubmitted(false);
      setIsSuccess(false);
      setFeedback('');
    }
  };

  const completedCount = ABAP_PRACTICE_LAB_EXERCISES.filter((ex) =>
    completedExerciseIds.includes(ex.id)
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner: Module Overview & Stats */}
      <div className="bg-gradient-to-r from-[#0d2137] via-[#1b2a4a] to-[#0a3a60] text-white rounded-lg p-4 sm:p-5 shadow-lg border border-[#2b4c7e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Módulo Prático Intensivo
              </span>
              <span className="text-xs text-blue-200">
                100+ Exercícios de Código Hands-on
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>Laboratório de Código: SELECT & Tabelas Internas</span>
            </h2>
            <p className="text-xs text-blue-200/90 max-w-2xl">
              Pratique consultas Open SQL e manipulação de tabelas internas linha a linha com feedback instantâneo e validação de boas práticas SAP.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/60 backdrop-blur-xs border border-blue-400/30 rounded-lg p-3 text-center sm:text-right shrink-0">
            <div className="text-[11px] text-blue-200 font-medium">Progresso no Laboratório</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
              {completedCount} / {ABAP_PRACTICE_LAB_EXERCISES.length}
            </div>
            <div className="w-36 sm:w-44 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / ABAP_PRACTICE_LAB_EXERCISES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 mt-3 border-t border-blue-900/50 text-xs">
          {/* Category Filter */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-blue-300 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Tópico:
            </span>
            <button
              onClick={() => { setSelectedCategory('all'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              Todos ({ABAP_PRACTICE_LAB_EXERCISES.length})
            </button>
            <button
              onClick={() => { setSelectedCategory('SELECT & Open SQL'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                selectedCategory === 'SELECT & Open SQL'
                  ? 'bg-[#0070f2] text-white shadow-xs'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>SELECT & Open SQL (55)</span>
            </button>
            <button
              onClick={() => { setSelectedCategory('Tabelas Internas (ITAB)'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                selectedCategory === 'Tabelas Internas (ITAB)'
                  ? 'bg-[#0070f2] text-white shadow-xs'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Table className="w-3 h-3 text-emerald-400" />
              <span>Tabelas Internas (50)</span>
            </button>
          </div>

          {/* Level Filter + Focus Mode */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => { setSelectedLevel('all'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'all' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Todos Níveis
              </button>
              <button
                onClick={() => { setSelectedLevel('Nível 1'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'Nível 1' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Nível 1 (Iniciante)
              </button>
              <button
                onClick={() => { setSelectedLevel('Nível 2'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'Nível 2' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Nível 2 (Intermediário)
              </button>
            </div>

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                isFocusMode
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFocusMode ? 'Sair do Foco' : 'Modo Foco'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Exercises List + Active Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Exercises Navigator (Hidden in Focus Mode) */}
        {!isFocusMode && (
          <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-3 space-y-2 max-h-[640px] flex flex-col">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
              <span>Lista de Exercícios ({filteredExercises.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Exercício {activeExerciseIndex + 1} selecionado
              </span>
            </div>

            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredExercises.map((ex, idx) => {
                const isCurrent = idx === activeExerciseIndex;
                const isCompleted = completedExerciseIds.includes(ex.id);

                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectExercise(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2 ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                          ex.level === 'Nível 1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {ex.level}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{ex.id.replace('lab_', '')}
                        </span>
                      </div>
                      <div className="font-semibold text-xs text-slate-800 truncate">
                        {ex.title}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-amber-600 font-mono font-bold bg-amber-50 px-1 rounded">
                          +{ex.xpReward} XP
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Column: Code Editor & Execution Panel */}
        <div className={`${isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4`}>
          {currentExercise ? (
            <>
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      currentExercise.level === 'Nível 1' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {currentExercise.level}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      {currentExercise.category === 'SELECT & Open SQL' ? (
                        <Database className="w-3 h-3 text-[#0070f2]" />
                      ) : (
                        <Table className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>{currentExercise.category}</span>
                    </span>
                    {completedExerciseIds.includes(currentExercise.id) && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Concluído
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentExercise.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Recompensa</span>
                  <span className="text-sm font-bold text-amber-600 font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    +{currentExercise.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Instruction Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-800 space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
                  <Code2 className="w-4 h-4 text-[#0070f2]" />
                  <span>Instruções do Desafio:</span>
                </div>
                <p className="leading-relaxed">
                  {currentExercise.instruction}
                </p>
              </div>

              {/* Code Editor Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Editor NetWeaver ABAP SE38</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-[#0070f2] hover:text-blue-800 text-xs flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{showHint ? 'Ocultar Dica' : 'Dica Técnica'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSolution ? 'Ocultar Solução' : 'Ver Gabarito'}</span>
                    </button>
                  </div>
                </div>

                {showHint && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 animate-in fade-in">
                    <span className="font-bold">Dica: </span>
                    {currentExercise.explanation}
                  </div>
                )}

                {showSolution && (
                  <div className="p-2.5 bg-slate-900 text-emerald-300 font-mono text-xs rounded border border-slate-700 space-y-1 animate-in fade-in">
                    <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">Solução Modelo SAP:</div>
                    <pre className="whitespace-pre-wrap">{currentExercise.solutionPattern.sampleSolution}</pre>
                  </div>
                )}

                <div className="relative border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={6}
                    className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 focus:outline-none leading-relaxed resize-y selection:bg-blue-600"
                    placeholder="Escreva sua consulta SELECT ou código de tabela interna ABAP..."
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Feedback Message */}
              {submitted && (
                <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2 animate-in fade-in ${
                  isSuccess 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold">
                      {isSuccess ? 'Sucesso na Execução!' : 'Atenção à Sintaxe ABAP:'}
                    </div>
                    <div>{feedback}</div>
                    {isSuccess && (
                      <div className="text-xs text-emerald-800/90 pt-1 font-mono">
                        {currentExercise.explanation}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Código</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-4 py-2 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded text-xs sm:text-sm font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verificar Código</span>
                  </button>

                  {activeExerciseIndex < filteredExercises.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-3.5 py-2 bg-[#1b2a4a] hover:bg-blue-900 text-white rounded text-xs sm:text-sm font-semibold transition-colors shadow-sm flex items-center gap-1"
                    >
                      <span>Próximo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Nenhum exercício encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
