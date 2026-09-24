import { UserProfile, UserAnswerHistory, UserErrorRecord } from '../types';

export interface CategoryPerformance {
  categoryKey: string;
  categoryLabel: string;
  totalAttempts: number;
  correctCount: number;
  accuracyRate: number; // 0 - 100
  averageTimeSeconds: number;
}

export interface UserBehaviorSummary {
  strengths: string[];
  weaknesses: string[];
  slowestTopic: {
    categoryLabel: string;
    averageTimeSeconds: number;
    tip: string;
  } | null;
  overallAccuracy: number;
  behavioralVerdict: string;
  humorousQuote: string;
  recommendedAction: string;
  categoryStats: CategoryPerformance[];
}

// Map keywords/tags to standard categories
function mapTopicToCategory(titleOrConcept: string): { key: string; label: string } {
  const t = (titleOrConcept || '').toUpperCase();
  if (t.includes('SELECT') || t.includes('SQL') || t.includes('WHERE') || t.includes('MARA') || t.includes('KNA1') || t.includes('SE11')) {
    return { key: 'SELECT_SQL', label: 'Comandos de Seleção (SELECT & Open SQL)' };
  }
  if (t.includes('TABELA') || t.includes('ITAB') || t.includes('LOOP') || t.includes('FIELD-SYMBOL') || t.includes('READ TABLE') || t.includes('SORT')) {
    return { key: 'INTERNAL_TABLES', label: 'Tabelas Internas & LOOPs (ITAB)' };
  }
  if (t.includes('PONTO') || t.includes('PERIOD') || t.includes('SINTAXE') || t.includes('REPORT') || t.includes('TIPOS')) {
    return { key: 'SYNTAX_FUNDAMENTALS', label: 'Sintaxe Básica, Pontuação (.) & Tipos' };
  }
  if (t.includes('BAPI') || t.includes('FUNCTION') || t.includes('PERFORM') || t.includes('RFC') || t.includes('ALV')) {
    return { key: 'BAPIS_MODULARIZATION', label: 'Modularização, Funções SE37 & BAPIs' };
  }
  if (t.includes('7.40') || t.includes('CLEAN') || t.includes('CDS') || t.includes('S/4HANA') || t.includes('@DATA')) {
    return { key: 'CLEAN_ABAP', label: 'Clean ABAP 7.40+ & S/4HANA' };
  }
  if (t.includes('SMART') || t.includes('FORM') || t.includes('SPOOL') || t.includes('SE63') || t.includes('TRADUÇÃO')) {
    return { key: 'FORMS_SPOOL', label: 'Formulários (Smart Forms), Spool & SE63' };
  }
  if (t.includes('CLASSE') || t.includes('INTERFACE') || t.includes('OO') || t.includes('HERANÇA') || t.includes('TRY')) {
    return { key: 'ABAP_OO', label: 'ABAP Orientado a Objetos (SE24)' };
  }
  return { key: 'GENERAL', label: 'Conceitos Gerais NetWeaver' };
}

export function analyzeUserBehavior(
  profile: UserProfile,
  answerHistory: UserAnswerHistory[],
  errorLogs: UserErrorRecord[] = []
): UserBehaviorSummary {
  const categoryMap = new Map<string, { label: string; total: number; correct: number; totalTime: number; timeCount: number }>();

  // Aggregate answer history
  answerHistory.forEach((ans) => {
    const { key, label } = mapTopicToCategory(ans.questionTitle);
    const existing = categoryMap.get(key) || { label, total: 0, correct: 0, totalTime: 0, timeCount: 0 };

    existing.total += 1;
    if (ans.isCorrect) existing.correct += 1;

    const timeSpent = ans.timeSpentSeconds || 15; // default reasonable estimate if untracked
    existing.totalTime += timeSpent;
    existing.timeCount += 1;

    categoryMap.set(key, existing);
  });

  // Also factor in errorLogs if answerHistory is small
  errorLogs.forEach((err) => {
    const key = err.category || 'SELECT_SQL';
    const label = 
      key === 'SELECT_SQL' ? 'Comandos de Seleção (SELECT & Open SQL)' :
      key === 'INTERNAL_TABLES' ? 'Tabelas Internas & LOOPs (ITAB)' :
      key === 'PUNCTUATION_PERIOD' ? 'Sintaxe Básica, Pontuação (.) & Tipos' :
      key === 'DATA_DECLARATION' ? 'Declaração de Dados (DATA)' : 'Geral';

    const existing = categoryMap.get(key) || { label, total: 0, correct: 0, totalTime: 0, timeCount: 0 };
    existing.total += 1; // registered an error
    existing.totalTime += 25; // error usually takes longer
    existing.timeCount += 1;
    categoryMap.set(key, existing);
  });

  // Calculate statistics per category
  const stats: CategoryPerformance[] = [];
  let totalAllAttempts = 0;
  let totalAllCorrect = 0;

  categoryMap.forEach((val, key) => {
    const accuracy = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
    const avgTime = val.timeCount > 0 ? Math.round(val.totalTime / val.timeCount) : 15;

    totalAllAttempts += val.total;
    totalAllCorrect += val.correct;

    stats.push({
      categoryKey: key,
      categoryLabel: val.label,
      totalAttempts: val.total,
      correctCount: val.correct,
      accuracyRate: accuracy,
      averageTimeSeconds: avgTime,
    });
  });

  const overallAccuracy = totalAllAttempts > 0 ? Math.round((totalAllCorrect / totalAllAttempts) * 100) : 100;

  // Identify strengths & weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  stats.forEach((s) => {
    if (s.totalAttempts >= 2) {
      if (s.accuracyRate >= 70) {
        if (s.categoryKey === 'SELECT_SQL') {
          strengths.push('Parabéns, está mandando muito bem nos comandos de SELECT e queries Open SQL, continue assim ;)');
        } else if (s.categoryKey === 'INTERNAL_TABLES') {
          strengths.push('Excelente domínio em Tabelas Internas! Seus LOOPs e leituras de ITAB estão rápidos e limpos.');
        } else if (s.categoryKey === 'CLEAN_ABAP') {
          strengths.push('Show de bola! Construtores modernos VALUE #( ) e sintaxe inline @DATA já fazem parte do seu sangue!');
        } else {
          strengths.push(`Ótimo aproveitamento em ${s.categoryLabel} (${s.accuracyRate}% de acertos).`);
        }
      } else if (s.accuracyRate < 60) {
        if (s.categoryKey === 'SELECT_SQL') {
          weaknesses.push('Opa, está errando bastante nos comandos de seleção de dados (SELECT), vamos praticar mais? Senão o RH vai te chamar hehe.');
        } else if (s.categoryKey === 'INTERNAL_TABLES') {
          weaknesses.push('Atenção redobrada nas Tabelas Internas: cuidado com READ sem BINARY SEARCH e LOOPs lentos para não travar a base!');
        } else if (s.categoryKey === 'SYNTAX_FUNDAMENTALS') {
          weaknesses.push('Cuidado com o ponto final (.) esquecido e tipos básicos! O compilador do SAP não perdoa uma vírgula no lugar do ponto.');
        } else if (s.categoryKey === 'BAPIS_MODULARIZATION') {
          weaknesses.push('Atenção nas chamadas de BAPI e controle transacional: lembre-se sempre de inspecionar a tabela BAPIRET2 antes do COMMIT.');
        } else {
          weaknesses.push(`Vale a pena revisar com calma o módulo de ${s.categoryLabel}, o aproveitamento está em ${s.accuracyRate}%.`);
        }
      }
    }
  });

  // Fallbacks if user is just starting out
  if (strengths.length === 0) {
    if (totalAllAttempts === 0) {
      strengths.push('Perfil recém-criado! Seu potencial de evolução em SAP ABAP está pronto para decolar.');
    } else {
      strengths.push('Boa persistência inicial! Você está acumulando experiência valiosa no ambiente NetWeaver.');
    }
  }

  if (weaknesses.length === 0 && totalAllAttempts > 0) {
    weaknesses.push('Nenhuma falha crítica detectada até o momento. Mantenha a consistência diária nos exercícios!');
  }

  // Find the topic that takes the longest average time to complete
  let slowestTopic: UserBehaviorSummary['slowestTopic'] = null;
  const topicsWithAttempts = stats.filter((s) => s.totalAttempts >= 2);
  if (topicsWithAttempts.length > 0) {
    topicsWithAttempts.sort((a, b) => b.averageTimeSeconds - a.averageTimeSeconds);
    const slowest = topicsWithAttempts[0];
    slowestTopic = {
      categoryLabel: slowest.categoryLabel,
      averageTimeSeconds: slowest.averageTimeSeconds,
      tip: `Exercícios deste tópico estão levando cerca de ${slowest.averageTimeSeconds}s para serem resolvidos. Dedique 10 minutos para revisar os conceitos na documentação da SE11 ou tirar dúvidas com o Mentor IA.`,
    };
  }

  // Humorous quote & Verdict
  let humorousQuote = '“Se o compilador não deu erro, ainda dá tempo de dar erro em PRD.” — Desenvolvedor Sênior SAP';
  let behavioralVerdict = 'Aprendiz Dedicada em Ritmo Constante';

  if (overallAccuracy >= 85 && totalAllAttempts >= 8) {
    behavioralVerdict = 'Consultora Prodígio de Alta Precisão (Quase um BASIS!)';
    humorousQuote = '“Quem nunca esqueceu um WHERE no UPDATE em desenvolvimento, não sabe a adrenalina de ser ABAP.”';
  } else if (overallAccuracy < 55 && totalAllAttempts >= 6) {
    behavioralVerdict = 'Corajosa Enfrentadora de Dumps (Foco em Recuperação)';
    humorousQuote = '“O ST22 não é um inimigo, é apenas o SAP pedindo carinho e mais um bloco TRY / CATCH.”';
  }

  const recommendedAction = 
    weaknesses.length > 0 && weaknesses[0].includes('SELECT')
      ? 'Fazer o Laboratório Prático de SELECT SINGLE & Open SQL no Editor SE38.'
      : slowestTopic
      ? `Revisar os quizzes teóricos de ${slowestTopic.categoryLabel}.`
      : 'Continuar a sequência no próximo nível para desbloquear mais títulos e classes de RPG.';

  return {
    strengths,
    weaknesses,
    slowestTopic,
    overallAccuracy,
    behavioralVerdict,
    humorousQuote,
    recommendedAction,
    categoryStats: stats,
  };
}
