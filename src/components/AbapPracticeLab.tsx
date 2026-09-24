import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Database, 
  Table, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  RotateCcw, 
  Code2, 
  Eye, 
  Check, 
  Filter,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Info,
  List,
  X,
  Compass,
  Zap
} from 'lucide-react';
import { LabExercise, ObsoleteCommandInfo, VersionNoticeInfo } from '../types';
import { ABAP_PRACTICE_LAB_EXERCISES } from '../data/abapPracticeLabData';
import { evaluateAbapCodeSubmission } from '../utils/abapSyntaxValidator';
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

  // Advanced syntax feedback states
  const [obsoleteCommands, setObsoleteCommands] = useState<ObsoleteCommandInfo[]>([]);
  const [versionNotices, setVersionNotices] = useState<VersionNoticeInfo[]>([]);
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState<boolean>(false);

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
      setObsoleteCommands([]);
      setVersionNotices([]);
      setDetectedFeatures([]);
    }
  }, [currentExercise?.id]);

  const handleSelectExercise = (idx: number) => {
    setActiveExerciseIndex(idx);
    setIsMobileListOpen(false);
  };

  const handleVerifyCode = () => {
    if (!currentExercise) return;

    // Evaluates with support for Open SQL, inline declarations, host vars, obsolete detection & 7.55+ notices
    const evalResult = evaluateAbapCodeSubmission(userCode, currentExercise.solutionPattern);

    setSubmitted(true);
    setIsSuccess(evalResult.passed);
    setObsoleteCommands(evalResult.obsoleteCommands);
    setVersionNotices(evalResult.versionNotices);
    setDetectedFeatures(evalResult.detectedFeatures);

    if (evalResult.passed) {
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
      const errDetail = evalResult.errorMessage || 'A instrução fornecida precisa de ajustes na sintaxe ou cláusulas.';
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

  const handlePrevious = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
    }
  };

  const handleReset = () => {
    if (currentExercise) {
      setUserCode(currentExercise.initialCode || '');
      setSubmitted(false);
      setIsSuccess(false);
      setFeedback('');
      setObsoleteCommands([]);
      setVersionNotices([]);
      setDetectedFeatures([]);
    }
  };

  const completedCount = ABAP_PRACTICE_LAB_EXERCISES.filter((ex) =>
    completedExerciseIds.includes(ex.id)
  ).length;

  return (
    <div className="space-y-4">
      {/* Top Banner: Module Overview & Stats */}
      <div className="bg-gradient-to-r from-[#0d2137] via-[#1b2a4a] to-[#0a3a60] text-white rounded-lg p-3 sm:p-5 shadow-lg border border-[#2b4c7e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Módulo Prático Intensivo
              </span>
              <span className="text-xs text-blue-200 hidden sm:inline">
                105 Exercícios Práticos de Código
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-bold flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Laboratório: SELECT & Tabelas Internas</span>
            </h2>
            <p className="text-xs text-blue-200/90 max-w-2xl hidden sm:block">
              Pratique consultas Open SQL e manipulação de tabelas internas linha a linha com suporte a sintaxe clássica e moderna (@DATA, host variables e expressões).
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-900/70 border border-blue-400/30 rounded-lg p-2.5 sm:p-3 flex sm:flex-col items-center justify-between sm:justify-center sm:text-right shrink-0 gap-2">
            <div className="text-[11px] text-blue-200 font-medium">Progresso Geral</div>
            <div className="text-lg sm:text-2xl font-bold text-amber-400 font-mono">
              {completedCount} / {ABAP_PRACTICE_LAB_EXERCISES.length}
            </div>
            <div className="w-24 sm:w-40 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / ABAP_PRACTICE_LAB_EXERCISES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Clean Filter Toolbar (Optimized for Mobile) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-3 mt-3 border-t border-blue-900/50 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-blue-300 font-semibold flex items-center gap-1 shrink-0 text-xs">
              <Filter className="w-3.5 h-3.5" />
              Filtro:
            </span>
            <button
              onClick={() => { setSelectedCategory('all'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              Todos (105)
            </button>
            <button
              onClick={() => { setSelectedCategory('SELECT & Open SQL'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'SELECT & Open SQL'
                  ? 'bg-[#0070f2] text-white shadow-xs font-bold'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>SELECT (55)</span>
            </button>
            <button
              onClick={() => { setSelectedCategory('Tabelas Internas (ITAB)'); setActiveExerciseIndex(0); }}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'Tabelas Internas (ITAB)'
                  ? 'bg-[#0070f2] text-white shadow-xs font-bold'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Table className="w-3 h-3 text-emerald-400" />
              <span>ITABs (50)</span>
            </button>
          </div>

          {/* Level Filter + Focus Mode */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => { setSelectedLevel('all'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'all' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Todos
              </button>
              <button
                onClick={() => { setSelectedLevel('Nível 1'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'Nível 1' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Nível 1
              </button>
              <button
                onClick={() => { setSelectedLevel('Nível 2'); setActiveExerciseIndex(0); }}
                className={`px-2 py-0.5 rounded text-xs ${selectedLevel === 'Nível 2' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                Nível 2
              </button>
            </div>

            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                isFocusMode
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFocusMode ? 'Sair do Foco' : 'Modo Foco'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE QUICK NAVIGATION BAR & STEP GUIDE (Organizado e sem excesso de botões na tela do celular) */}
      <div className="bg-white rounded-lg border border-slate-200 p-2.5 sm:p-3 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0070f2] flex items-center justify-center font-bold text-xs shrink-0">
            {activeExerciseIndex + 1}
          </div>
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Exercício </span>
            <span className="font-bold text-slate-800">{activeExerciseIndex + 1} de {filteredExercises.length}</span>
          </div>
        </div>

        {/* Previous / List / Next Quick Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePrevious}
            disabled={activeExerciseIndex === 0}
            className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Button to open full exercise list drawer on mobile */}
          <button
            onClick={() => setIsMobileListOpen(true)}
            className="px-2.5 py-1.5 rounded bg-blue-50 border border-blue-300 text-[#0070f2] text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5"
            title="Ver lista de exercícios"
          >
            <List className="w-3.5 h-3.5" />
            <span>Lista ({filteredExercises.length})</span>
          </button>

          <button
            onClick={handleNext}
            disabled={activeExerciseIndex >= filteredExercises.length - 1}
            className="px-2.5 py-1.5 rounded bg-[#1b2a4a] text-white text-xs font-semibold hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace: Active Workspace First (Desktop Sidebar beside it) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Exercises Navigator (Desktop only - On mobile it's an on-demand drawer) */}
        {!isFocusMode && (
          <div className="hidden lg:flex lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-3 space-y-2 max-h-[660px] flex-col">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
              <span>Lista de Exercícios ({filteredExercises.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">
                #{activeExerciseIndex + 1} selecionado
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

        {/* Right Column: Code Editor & Execution Panel (First on mobile screens!) */}
        <div className={`${isFocusMode ? 'lg:col-span-12' : 'lg:col-span-8'} bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4`}>
          {currentExercise ? (
            <>
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
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
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Recompensa</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-600 font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    +{currentExercise.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="p-3 sm:p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-800 space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <Compass className="w-4 h-4 text-[#0070f2]" />
                  <span>Objetivo do Exercício:</span>
                </div>
                <p className="leading-relaxed font-sans text-slate-700">
                  {currentExercise.instruction}
                </p>
                <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1 border-t border-blue-200/60">
                  <Info className="w-3 h-3 text-[#0070f2] shrink-0" />
                  <span>
                    Compatível com <strong>Open SQL clássico</strong> (<code>into wa</code>) e <strong>Open SQL 7.40+</strong> (<code>into @data(wa)</code>).
                  </span>
                </div>
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
                      <span>{showHint ? 'Ocultar Dica' : 'Dica'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-slate-500 hover:text-slate-700 text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSolution ? 'Ocultar' : 'Gabarito'}</span>
                    </button>
                  </div>
                </div>

                {showHint && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 animate-in fade-in">
                    <span className="font-bold">Dica Técnica: </span>
                    {currentExercise.explanation}
                  </div>
                )}

                {showSolution && (
                  <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-lg border border-slate-700 space-y-1 animate-in fade-in">
                    <div className="text-[10px] text-slate-400 font-sans font-bold uppercase">Solução Modelo SAP:</div>
                    <pre className="whitespace-pre-wrap selection:bg-emerald-800">{currentExercise.solutionPattern.sampleSolution}</pre>
                  </div>
                )}

                <div className="relative border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0070f2]">
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={6}
                    className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 focus:outline-none leading-relaxed resize-y selection:bg-blue-600"
                    placeholder="Escreva seu comando ABAP (ex: SELECT SINGLE * FROM mara INTO @DATA(wa_mara) WHERE matnr = '100-100')..."
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Primary Feedback Message */}
              {submitted && (
                <div className="space-y-3 animate-in fade-in">
                  <div className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2 ${
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
                        {isSuccess ? 'Sucesso na Execução!' : 'Atenção à Instrução ABAP:'}
                      </div>
                      <div>{feedback}</div>
                      {isSuccess && (
                        <div className="text-xs text-emerald-800/90 pt-1 font-mono">
                          {currentExercise.explanation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detected Modern Features Pills */}
                  {detectedFeatures.length > 0 && (
                    <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-blue-900 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Sintaxe Moderna Reconhecida:
                      </span>
                      {detectedFeatures.map((feat, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 font-mono text-[11px] px-2 py-0.5 rounded font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ABAP 7.55+ Notice (Superior ao ABAP 7.50) */}
                  {versionNotices.length > 0 && (
                    <div className="p-3 bg-sky-50 border border-sky-300 rounded-lg text-xs space-y-1.5 text-sky-950">
                      <div className="font-bold flex items-center gap-1.5 text-sky-900">
                        <Info className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>Aviso de Versão Superior (ABAP 7.55+ / S/4HANA):</span>
                      </div>
                      {versionNotices.map((v, idx) => (
                        <div key={idx} className="space-y-0.5 pl-5">
                          <div className="font-semibold text-sky-800">{v.feature} ({v.version})</div>
                          <p className="text-slate-700 leading-relaxed">{v.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Obsolete Command Detected Advisory (com Nova Nomenclatura e Exemplo na Hora!) */}
                  {obsoleteCommands.length > 0 && (
                    <div className="p-3 sm:p-4 bg-amber-50/90 border border-amber-300 rounded-lg text-xs space-y-2.5 text-amber-950">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Comando Obsoleto Detectado (Guia de Modernização):</span>
                      </div>
                      <p className="text-slate-700">
                        Sua resposta foi avaliada, porém contém instruções consideradas obsoletas ou descontinuadas em novos desenvolvimentos no SAP NetWeaver 7.40+ / 7.50 e S/4HANA.
                      </p>

                      <div className="space-y-2 pt-1">
                        {obsoleteCommands.map((obs, idx) => (
                          <div key={idx} className="p-2.5 bg-white rounded border border-amber-200 space-y-1.5">
                            <div className="font-bold text-amber-900 flex items-center justify-between">
                              <span>{obs.title}</span>
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-normal">
                                Obsoleto
                              </span>
                            </div>
                            <p className="text-slate-600">{obs.description}</p>
                            <div className="text-xs">
                              <span className="font-semibold text-slate-800">Nova Nomenclatura Recomendada: </span>
                              <span className="font-mono text-emerald-700 font-bold">{obs.modernAlternative}</span>
                            </div>

                            {/* Live code example on the spot */}
                            <div className="pt-1">
                              <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                                Exemplo Prático de Substituição na Hora:
                              </div>
                              <pre className="p-2 bg-slate-900 text-amber-200 font-mono text-[11px] rounded overflow-x-auto whitespace-pre-wrap">
                                {obs.exampleCode}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Toolbar: Clean, prominent verification button on mobile */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reiniciar</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-5 py-2.5 bg-[#0070f2] hover:bg-[#0863cb] text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verificar Código</span>
                  </button>

                  {activeExerciseIndex < filteredExercises.length - 1 && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-3.5 py-2.5 bg-[#1b2a4a] hover:bg-blue-900 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span className="hidden sm:inline">Próximo</span>
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

      {/* MOBILE EXERCISE LIST MODAL / DRAWER (Aparece quando o usuário clica em "Lista", evitando 105 botões poluidos) */}
      {isMobileListOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-3.5 bg-[#1b2a4a] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Selecionar Exercício ({filteredExercises.length})</h3>
              </div>
              <button
                onClick={() => setIsMobileListOpen(false)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-100">
              {filteredExercises.map((ex, idx) => {
                const isCurrent = idx === activeExerciseIndex;
                const isCompleted = completedExerciseIds.includes(ex.id);

                return (
                  <button
                    key={ex.id}
                    onClick={() => handleSelectExercise(idx)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-blue-50 border border-blue-500 font-bold text-blue-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center space-x-1.5 text-[10px]">
                        <span className="font-bold px-1.5 py-0.2 rounded bg-slate-100">
                          {ex.level}
                        </span>
                        <span className="text-slate-400 font-mono">#{ex.id.replace('lab_', '')}</span>
                      </div>
                      <div className="text-xs truncate">{ex.title}</div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="text-[10px] text-amber-600 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          +{ex.xpReward} XP
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={() => setIsMobileListOpen(false)}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-xs"
              >
                Fechar Lista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
