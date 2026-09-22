import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Check, 
  X 
} from 'lucide-react';
import { QuizDifficulty, QuizQuestion, SimuladoResult, UserProfile } from '../types';
import { ABAP_LEVELS } from '../data/abapLevels';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { sounds } from '../utils/soundEffects';

interface SimuladoModalProps {
  level: QuizDifficulty;
  isOpen: boolean;
  onClose: () => void;
  onSimuladoCompleted: (result: SimuladoResult) => void;
  soundEnabled: boolean;
}

export const SimuladoModal: React.FC<SimuladoModalProps> = ({
  level,
  isOpen,
  onClose,
  onSimuladoCompleted,
  soundEnabled,
}) => {
  const levelMeta = useMemo(() => {
    return ABAP_LEVELS.find((l) => l.id === level) || ABAP_LEVELS[0];
  }, [level]);

  // Select 10 questions for the simulado from this level
  const simuladoQuestions: QuizQuestion[] = useMemo(() => {
    const pool = QUIZ_QUESTIONS.filter((q) => q.level === level);
    if (pool.length <= 10) return pool;
    // Shuffle and pick 10
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, [level, isOpen]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number | string }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<SimuladoResult | null>(null);

  if (!isOpen) return null;

  const currentQ = simuladoQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isFinished || !currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleFinishSimulado = () => {
    let score = 0;
    simuladoQuestions.forEach((q) => {
      const userAns = selectedAnswers[q.id];
      if (q.type === 'multiple_choice' || q.type === 'theory') {
        if (userAns === q.correctAnswerIndex) score++;
      } else if (q.type === 'code_exercise') {
        const strAns = typeof userAns === 'string' ? userAns.toUpperCase() : '';
        const reqTokens = q.expectedCodePatterns?.requiredTokens || [];
        const missing = reqTokens.filter((t) => !strAns.includes(t));
        if (missing.length === 0 && strAns.length > 5) score++;
      }
    });

    const total = simuladoQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= levelMeta.passingScore;

    const res: SimuladoResult = {
      level,
      score,
      totalQuestions: total,
      percentage,
      passed,
      date: new Date().toISOString(),
      earnedBadge: passed ? levelMeta.badgeRewardId : undefined,
      earnedTitle: passed ? levelMeta.titleReward : undefined,
    };

    setFinalResult(res);
    setIsFinished(true);

    if (passed) {
      if (soundEnabled) sounds.playLevelUp();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } else {
      if (soundEnabled) sounds.playError();
    }

    onSimuladoCompleted(res);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
    setFinalResult(null);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-700 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#1b2a4a] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#304875]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#0070f2] flex items-center justify-center text-white shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {levelMeta.simuladoTitle}
              </h2>
              <span className="text-xs text-blue-200">
                Avaliação de Certificação SAP • Nota de Corte: {levelMeta.passingScore}%
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isFinished ? (
            <>
              {/* Progress and status */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800">
                  Questão {currentIndex + 1} de {simuladoQuestions.length}
                </span>
                <span className="text-slate-500">
                  Respondidas: {answeredCount} de {simuladoQuestions.length}
                </span>
              </div>

              {/* Question Card */}
              {currentQ && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#0070f2] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                      {currentQ.conceptTag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {currentQ.title}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>

                  {/* Options */}
                  {currentQ.options && (
                    <div className="space-y-2 pt-2">
                      {currentQ.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[currentQ.id] === oIdx;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(oIdx)}
                            className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-start space-x-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-[#0070f2] text-blue-950 font-bold ring-2 ring-[#0070f2]/30 shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                isSelected
                                  ? 'bg-[#0070f2] text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1 leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Code question */}
                  {currentQ.type === 'code_exercise' && (
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Digite sua solução ABAP:
                      </label>
                      <textarea
                        rows={4}
                        value={String(selectedAnswers[currentQ.id] || '')}
                        onChange={(e) =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [currentQ.id]: e.target.value,
                          }))
                        }
                        placeholder={currentQ.codeSnippet || 'Escreva o comando ABAP aqui...'}
                        className="w-full font-mono text-xs sm:text-sm p-3 bg-slate-900 text-emerald-300 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Result Screen */
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                  finalResult?.passed
                    ? 'bg-emerald-100 text-emerald-600 border-4 border-emerald-500'
                    : 'bg-amber-100 text-amber-600 border-4 border-amber-500'
                }`}
              >
                {finalResult?.passed ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {finalResult?.passed ? 'Parabéns! Você foi Aprovada!' : 'Não foi dessa vez, continue praticando!'}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {finalResult?.passed
                    ? `Você atingiu ${finalResult.percentage}% de aproveitamento (acertou ${finalResult.score} de ${finalResult.totalQuestions} questões). Seu título e badge oficial foram desbloqueados!`
                    : `Você obteve ${finalResult?.percentage}%. A nota de corte mínima é ${levelMeta.passingScore}%. Revise os conceitos do nível e tente novamente!`}
                </p>
              </div>

              {/* Reward Banner if passed */}
              {finalResult?.passed && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl p-4 max-w-md mx-auto text-left shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Recompensas de Carreira Desbloqueadas:</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-700">
                      • <strong>Novo Título:</strong> <span className="text-[#0070f2] font-bold">{levelMeta.titleReward}</span>
                    </div>
                    <div className="text-xs text-slate-700">
                      • <strong>Badge Oficial:</strong> Certificação de {levelMeta.title}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                Anterior
              </button>

              <div className="flex items-center space-x-2">
                {currentIndex < simuladoQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(simuladoQuestions.length - 1, prev + 1))}
                    className="px-4 py-1.5 bg-[#0070f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                  >
                    <span>Próxima</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishSimulado}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Finalizar e Enviar Simulado</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refazer Simulado</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#0070f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
