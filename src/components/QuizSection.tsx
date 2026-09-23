import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Code, 
  BookOpen, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Lightbulb, 
  ChevronRight,
  Filter,
  Check,
  Maximize2,
  Minimize2,
  FileCheck2,
  Layers,
  Database,
  Table,
  AlertTriangle,
  BrainCircuit
} from 'lucide-react';
import { QuizDifficulty, QuestionType, QuizQuestion, UserAnswerHistory, SimuladoResult, UserErrorRecord } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { ABAP_LEVELS } from '../data/abapLevels';
import { SimuladoModal } from './SimuladoModal';
import { AbapPracticeLab } from './AbapPracticeLab';
import { ErrorDiagnosticPanel } from './ErrorDiagnosticPanel';
import { sounds } from '../utils/soundEffects';

interface QuizSectionProps {
  completedQuestionIds: string[];
  onAnswerQuestion: (history: UserAnswerHistory, xpEarned: number) => void;
  onSimuladoCompleted?: (result: SimuladoResult) => void;
  errorLogs?: UserErrorRecord[];
  answerHistory?: UserAnswerHistory[];
  onRecordError?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX', title: string, detail: string, codeSnippet?: string) => void;
  soundEnabled: boolean;
  initialSubTab?: 'general' | 'lab' | 'diagnostic';
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  completedQuestionIds,
  onAnswerQuestion,
  onSimuladoCompleted,
  errorLogs = [],
  answerHistory = [],
  onRecordError,
  soundEnabled,
  initialSubTab = 'general',
}) => {
  const [subTab, setSubTab] = useState<'general' | 'lab' | 'diagnostic'>(initialSubTab);
  const [selectedLevel, setSelectedLevel] = useState<QuizDifficulty | 'Todos'>('Todos');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Focus Mode toggle
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Simulado Modal state
  const [isSimuladoOpen, setIsSimuladoOpen] = useState(false);

  // States for active question interaction
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userCodeInput, setUserCodeInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Filtered list of questions
  const filteredQuestions = QUIZ_QUESTIONS.filter((q) => {
    if (selectedLevel !== 'Todos' && q.level !== selectedLevel) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    return true;
  });

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[activeQuestionIndex];

  // Reset answer states when question changes
  const handleSelectQuestion = (index: number) => {
    setActiveQuestionIndex(index);
    setSelectedOption(null);
    setUserCodeInput(filteredQuestions[index]?.codeSnippet || '');
    setSubmitted(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setShowHint(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || submitted) return;

    let correct = false;
    let feedback = '';

    if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'theory') {
      if (selectedOption === null) return;
      correct = selectedOption === currentQuestion.correctAnswerIndex;
      if (correct) {
        feedback = 'Resposta exata! Você compreendeu perfeitamente este conceito fundamental do ABAP.';
      } else {
        feedback = 'Incorreto. Leia com atenção a explicação técnica abaixo para fixar este padrão SAP.';
      }
    } else if (currentQuestion.type === 'code_exercise') {
      const codeUpper = userCodeInput.toUpperCase();
      const patterns = currentQuestion.expectedCodePatterns;

      if (!patterns) {
        correct = true;
      } else {
        // Check required tokens
        const missing = patterns.requiredTokens.filter((token) => !codeUpper.includes(token));
        const hasForbidden = patterns.forbiddenTokens?.some((token) => codeUpper.includes(token));

        if (missing.length === 0 && !hasForbidden) {
          correct = true;
          feedback = 'Excelente! Seu código atende a todas as especificações e regras solicitadas no exercício.';
        } else if (hasForbidden) {
          correct = false;
          feedback = `Erro: O código usou instruções não recomendadas para este caso específico (ex.: ${patterns.forbiddenTokens?.join(', ')}).`;
        } else {
          correct = false;
          feedback = `Incompleto: Seu código precisa conter as seguintes palavras-chave ou campos: ${missing.slice(0, 3).join(', ')}.`;
        }
      }
    }

    setSubmitted(true);
    setIsCorrect(correct);
    setFeedbackMessage(feedback);

    if (correct) {
      if (soundEnabled) sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      onAnswerQuestion(
        {
          questionId: currentQuestion.id,
          questionTitle: currentQuestion.title,
          level: currentQuestion.level,
          type: currentQuestion.type,
          isCorrect: true,
          userAnswer:
            currentQuestion.type === 'code_exercise'
              ? userCodeInput
              : String(selectedOption),
          date: new Date().toISOString(),
          feedback: currentQuestion.explanation,
        },
        currentQuestion.xpReward
      );
    } else {
      if (soundEnabled) sounds.playError();
      if (onRecordError) {
        const titleLow = currentQuestion.title.toLowerCase();
        let cat: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX' = 'GENERAL_SYNTAX';
        if (titleLow.includes('select') || titleLow.includes('sql') || titleLow.includes('join') || currentQuestion.level === 'Nível 2') {
          cat = 'SELECT_SQL';
        } else if (titleLow.includes('tabela') || titleLow.includes('itab') || titleLow.includes('loop') || titleLow.includes('read') || titleLow.includes('append')) {
          cat = 'INTERNAL_TABLES';
        } else if (titleLow.includes('data') || titleLow.includes('type')) {
          cat = 'DATA_DECLARATION';
        }
        onRecordError(cat, currentQuestion.title, feedback || currentQuestion.explanation, userCodeInput || undefined);
      }
      onAnswerQuestion(
        {
          questionId: currentQuestion.id,
          questionTitle: currentQuestion.title,
          level: currentQuestion.level,
          type: currentQuestion.type,
          isCorrect: false,
          userAnswer:
            currentQuestion.type === 'code_exercise'
              ? userCodeInput
              : String(selectedOption),
          date: new Date().toISOString(),
          feedback: currentQuestion.explanation,
        },
        0
      );
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < filteredQuestions.length - 1) {
      handleSelectQuestion(activeQuestionIndex + 1);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
    setFeedbackMessage('');
  };

  // Completed percentage calculation
  const totalInFilter = filteredQuestions.length;
  const completedInFilter = filteredQuestions.filter((q) => completedQuestionIds.includes(q.id)).length;
  const pct = totalInFilter > 0 ? Math.round((completedInFilter / totalInFilter) * 100) : 0;

  // Get current active level meta if a single level is selected
  const currentLevelInfo = selectedLevel !== 'Todos' 
    ? ABAP_LEVELS.find((l) => l.id === selectedLevel) 
    : null;

  return (
    <div className="space-y-4">
      {/* Sub-Module Navigation Switch */}
      <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
          <button
            type="button"
            onClick={() => setSubTab('general')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'general'
                ? 'bg-[#1b2a4a] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-blue-300" />
            <span>Banco de Quizzes (5 Níveis)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('lab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'lab'
                ? 'bg-[#0070f2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-300" />
            <span>Laboratório: SELECT & ITABs</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              100+ Exercícios
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('diagnostic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'diagnostic'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
            <span>Diagnóstico de Erros & Recuperação</span>
            {errorLogs.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                {errorLogs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* RENDER SUB-TAB 2: ABAP PRACTICE LAB */}
      {subTab === 'lab' && (
        <AbapPracticeLab
          completedExerciseIds={completedQuestionIds}
          soundEnabled={soundEnabled}
          onCompleteExercise={(exerciseId: string, xpEarned: number, category: string) => {
            onAnswerQuestion(
              {
                questionId: exerciseId,
                questionTitle: `[LAB] Exercício Prático (${category})`,
                level: 'Nível 1',
                type: 'code_exercise',
                isCorrect: true,
                userAnswer: 'Código validado com sucesso no Laboratório.',
                date: new Date().toISOString(),
                feedback: 'Parabéns pela execução correta no Laboratório ABAP!',
              },
              xpEarned
            );
          }}
          onRecordError={onRecordError ? (cat, title, detail, code) => onRecordError(cat, title, detail, code) : undefined}
        />
      )}

      {/* RENDER SUB-TAB 3: ERROR DIAGNOSTIC PANEL */}
      {subTab === 'diagnostic' && (
        <ErrorDiagnosticPanel
          errorLogs={errorLogs}
          answerHistory={answerHistory}
          onPracticeTopic={() => setSubTab('lab')}
        />
      )}

      {/* RENDER SUB-TAB 1: GENERAL QUIZ BANK */}
      {subTab === 'general' && (
        <div className="space-y-4">
      {/* Header filter bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#0070f2]" />
            Dificuldade:
          </span>
          {(['Todos', 'Nível 1', 'Nível 2', 'Nível 3', 'Nível 4', 'Nível 5'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setActiveQuestionIndex(0);
                setSubmitted(false);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedLevel === lvl
                  ? 'bg-[#1b2a4a] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-slate-300 mx-1">|</span>

          <span className="font-bold text-slate-700">Tipo:</span>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'multiple_choice', label: 'Múltipla Escolha' },
            { id: 'code_exercise', label: 'Exercício de Código' },
            { id: 'theory', label: 'Teórica' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedType(t.id as any);
                setActiveQuestionIndex(0);
                setSubmitted(false);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedType === t.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            title={isFocusMode ? "Desativar Modo Foco" : "Ativar Modo Foco (Oculta listas e foca 100% no desafio)"}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold transition-all border ${
              isFocusMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFocusMode ? 'Sair do Modo Foco' : 'Modo Foco'}</span>
          </button>

          {/* Level Completion Pill */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Progresso:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {completedInFilter}/{totalInFilter} concluídos ({pct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Level Info & Official Simulado Banner */}
      {currentLevelInfo && !isFocusMode && (
        <div className="bg-gradient-to-r from-[#1b2a4a] to-[#253966] text-white p-4 rounded-lg border border-[#304875] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-blue-500 text-white px-2 py-0.5 rounded">
                Trilha {currentLevelInfo.id}
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {currentLevelInfo.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentLevelInfo.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentLevelInfo.topics.slice(0, 4).map((top, idx) => (
                <span key={idx} className="text-[10px] bg-white/10 text-blue-200 px-2 py-0.5 rounded">
                  {top}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsSimuladoOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg text-xs font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Fazer Simulado Oficial ({currentLevelInfo.id})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main layout: Question list sidebar + Active Question Card */}
      <div className={`grid grid-cols-1 ${isFocusMode ? 'lg:grid-cols-1 max-w-4xl mx-auto' : 'lg:grid-cols-4'} gap-4`}>
        {/* Left List of Questions (hidden in Focus Mode) */}
        {!isFocusMode && (
          <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 shadow-xs p-3 space-y-2 max-h-[620px] overflow-y-auto">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>Desafios ({filteredQuestions.length})</span>
              <span className="text-emerald-600 font-bold">{completedInFilter} ✓</span>
            </div>

            <div className="space-y-1">
              {filteredQuestions.map((q, idx) => {
                const isCompleted = completedQuestionIds.includes(q.id);
                const isActive = idx === activeQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(idx)}
                    className={`w-full text-left p-2 rounded text-xs transition-all flex items-start space-x-2 ${
                      isActive
                        ? 'bg-blue-50 border border-blue-400 text-blue-900 font-medium'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : q.type === 'code_exercise' ? (
                        <Code className="w-3.5 h-3.5 text-purple-600" />
                      ) : q.type === 'theory' ? (
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-semibold">{q.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span>{q.level}</span>
                        <span>•</span>
                        <span className="text-amber-600 font-bold">+{q.xpReward} XP</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Active Question Card */}
        <div className={isFocusMode ? 'w-full' : 'lg:col-span-3'}>
          {currentQuestion ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 sm:p-6 space-y-4">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#1b2a4a] text-white text-xs font-bold px-2 py-0.5 rounded">
                    {currentQuestion.level}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                    {currentQuestion.conceptTag}
                  </span>
                  <span className="text-xs text-slate-500">
                    {currentQuestion.type === 'multiple_choice'
                      ? 'Múltipla Escolha'
                      : currentQuestion.type === 'code_exercise'
                      ? 'Exercício Prático de Código'
                      : 'Pergunta Teórica'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    +{currentQuestion.xpReward} XP
                  </span>
                  {completedQuestionIds.includes(currentQuestion.id) && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Já Concluído
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Prompt */}
              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentQuestion.title}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed font-sans">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Case 1: Multiple Choice or Theory Options */}
              {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'theory') && currentQuestion.options && (
                <div className="space-y-2 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isThisCorrect = submitted && idx === currentQuestion.correctAnswerIndex;
                    const isThisWrong = submitted && isSelected && !isThisCorrect;

                    let btnClass = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (isSelected && !submitted) {
                      btnClass = 'border-[#0070f2] bg-blue-50 text-blue-900 font-medium ring-1 ring-[#0070f2]';
                    } else if (isThisCorrect) {
                      btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                    } else if (isThisWrong) {
                      btnClass = 'border-red-500 bg-red-50 text-red-900';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={submitted}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center font-bold text-xs select-none shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-mono text-xs sm:text-sm break-all">{option}</span>
                        </div>
                        {isThisCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {isThisWrong && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Case 2: Code Exercise input */}
              {currentQuestion.type === 'code_exercise' && (
                <div className="space-y-3 pt-2">
                  <div className="bg-[#0f172a] rounded-lg border border-slate-700 overflow-hidden">
                    <div className="bg-[#1e293b] px-3 py-1.5 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300">
                      <span className="font-mono text-emerald-400">ABAP Code Input:</span>
                      <span className="text-[11px] text-slate-400">Escreva a sintaxe solicitada</span>
                    </div>
                    <textarea
                      id="quiz-code-input"
                      value={userCodeInput}
                      onChange={(e) => setUserCodeInput(e.target.value)}
                      disabled={submitted && isCorrect}
                      rows={6}
                      className="w-full bg-transparent text-slate-100 font-mono text-xs sm:text-sm p-3 focus:outline-none leading-relaxed"
                      placeholder="* Escreva seu código ABAP aqui..."
                    />
                  </div>

                  {/* Hint Toggle */}
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showHint ? 'Ocultar Solução de Referência' : 'Ver Solução Esperada'}</span>
                    </button>

                    {currentQuestion.expectedCodePatterns && (
                      <span className="text-slate-400 text-[11px]">
                        Requer: {currentQuestion.expectedCodePatterns.requiredTokens.slice(0, 3).join(', ')}...
                      </span>
                    )}
                  </div>

                  {showHint && currentQuestion.expectedCodePatterns && (
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs space-y-1.5 animate-in fade-in">
                      <div className="font-bold text-amber-900">Solução de Referência ABAP:</div>
                      <pre className="bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-xs overflow-x-auto">
                        {currentQuestion.expectedCodePatterns.sampleSolution}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Alert if submitted */}
              {submitted && (
                <div
                  className={`p-4 rounded-lg border text-xs sm:text-sm space-y-2 animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-base">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Parabéns! Resposta Correta (+{currentQuestion.xpReward} XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span>Atenção aos detalhes técnicos</span>
                      </>
                    )}
                  </div>

                  <p className="font-medium">{feedbackMessage}</p>

                  <div className="pt-2 border-t border-slate-200/60 font-sans text-slate-800 leading-relaxed text-xs">
                    <span className="font-bold">Explicação Técnica da SAP: </span>
                    {currentQuestion.explanation}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-medium">
                  Questão {activeQuestionIndex + 1} de {filteredQuestions.length}
                </div>

                <div className="flex items-center space-x-2">
                  {!submitted ? (
                    <button
                      id="btn-submit-answer"
                      onClick={handleSubmitAnswer}
                      disabled={
                        (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'theory') &&
                        selectedOption === null
                      }
                      className="px-4 py-2 bg-[#0070f2] hover:bg-[#0863cb] disabled:opacity-50 text-white rounded text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                    >
                      Confirmar Resposta
                    </button>
                  ) : (
                    <>
                      {!isCorrect && (
                        <button
                          onClick={handleRetry}
                          className="flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tentar Novamente</span>
                        </button>
                      )}

                      {activeQuestionIndex < filteredQuestions.length - 1 ? (
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-[#1b2a4a] hover:bg-blue-900 text-white rounded text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                        >
                          <span>Próximo Desafio</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                          Todos os desafios desta categoria concluídos!
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500 space-y-2">
              <p>Nenhuma pergunta encontrada com os filtros selecionados.</p>
              <button
                onClick={() => {
                  setSelectedLevel('Todos');
                  setSelectedType('all');
                }}
                className="text-xs text-[#0070f2] font-semibold underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
      )}

      {/* Level Simulado Modal */}
      <SimuladoModal
        level={selectedLevel === 'Todos' ? 'Nível 1' : selectedLevel}
        isOpen={isSimuladoOpen}
        onClose={() => setIsSimuladoOpen(false)}
        onSimuladoCompleted={(result) => {
          if (onSimuladoCompleted) {
            onSimuladoCompleted(result);
          }
        }}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
