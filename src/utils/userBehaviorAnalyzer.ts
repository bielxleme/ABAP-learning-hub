import { UserProfile, UserAnswerHistory, UserErrorRecord, QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';

export interface CategoryPerformance {
  categoryKey: string;
  categoryLabel: string;
  totalAttempts: number;
  correctCount: number;
  accuracyRate: number; // 0 - 100
  averageTimeSeconds: number;
  description?: string;
}

export interface FailedQuestionItem {
  questionId: string;
  questionTitle: string;
  level: string;
  userAnswer: string;
  feedback?: string;
  timestamp: string;
  exerciseNumber: number;
  conceptTag?: string;
  type?: string;
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
  categoryStats: CategoryPerformance[]; // Macro Categorias (DDIC, Programas, etc.)
  topicStats: CategoryPerformance[];    // Tipos & Descrições (Formulários, Tabelas, Reports, etc.)
  failedQuestionsByLevel: Record<string, FailedQuestionItem[]>;
  totalFailedQuestions: number;
}

/**
 * Calculates the 1-based exercise number within a level for a question
 */
export function getExerciseNumberInLevel(questionId: string, level: string): number {
  const levelQuestions = QUIZ_QUESTIONS.filter((q) => q.level === level);
  const idx = levelQuestions.findIndex((q) => q.id === questionId);
  return idx >= 0 ? idx + 1 : 1;
}

// 1. Mapeamento por TIPO & DESCRIÇÃO ESPECÍFICA (Subtópicos reais)
export function mapToDetailedTopic(title: string, concept?: string): { key: string; label: string; desc: string } {
  const t = (title + ' ' + (concept || '')).toUpperCase();

  // Formulários & Spool (Apenas questões genuínas de Smart Forms, SAPscript, Adobe Forms, Spool, SE63)
  if (
    t.includes('SMART FORM') || 
    t.includes('SMARTFORMS') || 
    t.includes('SAPSCRIPT') || 
    t.includes('ADOBE FORM') || 
    t.includes('SPOOL') || 
    t.includes('SE63') || 
    t.includes('TRADUÇÃO')
  ) {
    return { key: 'FORMULARIOS', label: 'Formulários (Smart Forms & SAPscript)', desc: 'Layouts, drivers de impressão, janelas e traduções SE63' };
  }

  // Tabelas Internas & LOOPs
  if (
    t.includes('TABELA INTERNA') || 
    t.includes('ITAB') || 
    t.includes('LOOP AT') || 
    t.includes('FIELD-SYMBOL') || 
    t.includes('READ TABLE') || 
    t.includes('APPEND') || 
    t.includes('INSERT') || 
    t.includes('COLLECT') || 
    t.includes('SORT') || 
    t.includes('BINARY SEARCH') ||
    t.includes('TABLE EXPRESSION')
  ) {
    return { key: 'TABELAS_INTERNAS', label: 'Tabelas Internas & LOOPs (ITAB)', desc: 'Manipulação em memória, ponteiros field-symbols e buscas' };
  }

  // Consultas Open SQL & Banco de Dados
  if (
    t.includes('SELECT') || 
    t.includes('OPEN SQL') || 
    t.includes('WHERE') || 
    t.includes('JOIN') || 
    t.includes('SY-DBCNT') || 
    t.includes('SINGLE') || 
    t.includes('FOR ALL ENTRIES')
  ) {
    return { key: 'OPEN_SQL', label: 'Consultas Open SQL & Banco de Dados', desc: 'SELECT SINGLE, filtros WHERE, cursores e performance de banco' };
  }

  // Dicionário de Dados (SE11 / Tabelas Transparentes)
  if (
    t.includes('SE11') || 
    t.includes('DICIONÁRIO') || 
    t.includes('DOMÍNIO') || 
    t.includes('ELEMENTO DE DADOS') || 
    t.includes('TRANSPARENTE') || 
    t.includes('MANDT') || 
    t.includes('MARA') || 
    t.includes('KNA1') || 
    t.includes('VBAK') || 
    t.includes('LFA1')
  ) {
    return { key: 'DDIC_DETALHADO', label: 'Dicionário de Dados (SE11 & Tabelas)', desc: 'Tabelas transparentes, domínios e elementos de dados' };
  }

  // Pontuação & Terminadores de Linha
  if (
    t.includes('PONTO FINAL') || 
    t.includes('PUNCTUATION') || 
    t.includes('TERMINADOR') || 
    t.includes('ENCADEAMENTO') || 
    t.includes('COMENTÁRIOS')
  ) {
    return { key: 'PONTUACAO_SINTAXE', label: 'Pontuação (.) & Sintaxe Básica', desc: 'Regras de ponto final, operadores encadeados e comentários' };
  }

  // Tipos de Dados Elementares & Variáveis
  if (
    t.includes('TIPO ') || 
    t.includes('TIPOS ELEMENTARES') || 
    t.includes('DATA:') || 
    t.includes('CONSTANTS') || 
    t.includes('HORÁRIOS') || 
    t.includes('DATAS') || 
    t.includes('INTEIROS') || 
    t.includes('VALORES DECIMAIS')
  ) {
    return { key: 'TIPOS_DADOS', label: 'Tipos de Dados Elementares & Variáveis', desc: 'Tipos C, I, P, D, T, STRING e constantes imutáveis' };
  }

  // Reports & Lógica de Programação SE38
  if (
    t.includes('REPORT') || 
    t.includes('PROGRAMA EXECUTÁVEL') || 
    t.includes('PARAMETERS') || 
    t.includes('SELECTION-SCREEN') || 
    t.includes('IF') || 
    t.includes('CASE') || 
    t.includes('CONDICIONAIS') || 
    t.includes('WRITE') || 
    t.includes('ULINE') || 
    t.includes('SKIP') ||
    t.includes('STRINGS')
  ) {
    return { key: 'REPORTS_LOGICA', label: 'Reports & Telas de Seleção (SE38)', desc: 'Cabeçalhos REPORT, parâmetros, saídas WRITE e fluxo de decisão' };
  }

  // ABAP Orientado a Objetos
  if (
    t.includes('CLASSE') || 
    t.includes('INTERFACE') || 
    t.includes('OO') || 
    t.includes('HERANÇA') || 
    t.includes('POLIMORFISMO') || 
    t.includes('TRY') || 
    t.includes('CATCH') || 
    t.includes('CX_') || 
    t.includes('SINGLETON') || 
    t.includes('HANDLER')
  ) {
    return { key: 'ABAP_OO', label: 'ABAP Orientado a Objetos (Classes & Interfaces)', desc: 'Encapsulamento, seções de visibilidade, interfaces e herança' };
  }

  // S/4HANA & Tecnologias Modernas
  if (
    t.includes('CDS') || 
    t.includes('S/4HANA') || 
    t.includes('RAP') || 
    t.includes('AMDP') || 
    t.includes('ODATA') || 
    t.includes('FIORI') || 
    t.includes('CLEAN ABAP') || 
    t.includes('7.40')
  ) {
    return { key: 'S4HANA_MODERNO', label: 'S/4HANA & Recursos Modernos (7.40+)', desc: 'CDS Views, expressões inline @DATA, construtores VALUE' };
  }

  return { key: 'GERAL', label: 'Conceitos Gerais NetWeaver', desc: 'Fundamentos e visão geral do ecossistema SAP' };
}

// 2. Mapeamento por MACRO CATEGORIA (DDIC, Programas, Tabelas, Formulários, OO)
export function mapToMacroCategory(title: string, concept?: string): { key: string; label: string; desc: string } {
  const det = mapToDetailedTopic(title, concept).key;

  switch (det) {
    case 'DDIC_DETALHADO':
      return { key: 'DDIC', label: 'DDIC (Dicionário de Dados)', desc: 'Transação SE11, tabelas transparentes, domínios e chaves de banco' };
    case 'REPORTS_LOGICA':
    case 'PONTUACAO_SINTAXE':
    case 'TIPOS_DADOS':
    case 'OPEN_SQL':
      return { key: 'PROGRAMAS', label: 'Programas & Lógica Executável (SE38)', desc: 'Comandos clássicos e modernos, relatórios, sintaxe e consultas' };
    case 'TABELAS_INTERNAS':
      return { key: 'TABELAS', label: 'Tabelas Internas & Estruturas', desc: 'Tabelas padrão, ordenadas, hash, LOOPs e expressões em memória' };
    case 'FORMULARIOS':
      return { key: 'FORMULARIOS', label: 'Formulários & Saídas (Spool / Smart Forms)', desc: 'Impressão de documentos comerciais, Smart Forms, SAPscript e SE63' };
    case 'ABAP_OO':
      return { key: 'ABAP_OO', label: 'ABAP Orientado a Objetos (SE24)', desc: 'Classes globais/locais, interfaces, herança e Clean Code' };
    case 'S4HANA_MODERNO':
      return { key: 'S4HANA', label: 'SAP S/4HANA & Tecnologias Modernas', desc: 'Paradigma Code Pushdown, CDS Views, ABAP RAP e Open SQL moderno' };
    default:
      return { key: 'PROGRAMAS', label: 'Programas & Lógica Executável (SE38)', desc: 'Programação geral e lógica de execução' };
  }
}

export function analyzeUserBehavior(
  profile: UserProfile,
  answerHistory: UserAnswerHistory[],
  errorLogs: UserErrorRecord[] = []
): UserBehaviorSummary {
  // Maps for accumulating statistics
  const topicMap = new Map<string, { label: string; desc: string; total: number; correct: number; totalTime: number; count: number }>();
  const categoryMap = new Map<string, { label: string; desc: string; total: number; correct: number; totalTime: number; count: number }>();

  // Detect explicit punctuation errors from editor/logs
  const punctuationErrors = errorLogs.filter(
    (e) => e.category === 'PUNCTUATION_PERIOD' || (e.detail || '').toLowerCase().includes('ponto final')
  );
  const hasPunctuationFailures = punctuationErrors.length > 0;

  // Process answered quizzes
  answerHistory.forEach((ans) => {
    // Topic mapping (detailed)
    const topic = mapToDetailedTopic(ans.questionTitle);
    const existingTopic = topicMap.get(topic.key) || { label: topic.label, desc: topic.desc, total: 0, correct: 0, totalTime: 0, count: 0 };
    existingTopic.total += 1;
    if (ans.isCorrect) existingTopic.correct += 1;
    existingTopic.totalTime += ans.timeSpentSeconds || 15;
    existingTopic.count += 1;
    topicMap.set(topic.key, existingTopic);

    // Macro category mapping
    const macro = mapToMacroCategory(ans.questionTitle);
    const existingMacro = categoryMap.get(macro.key) || { label: macro.label, desc: macro.desc, total: 0, correct: 0, totalTime: 0, count: 0 };
    existingMacro.total += 1;
    if (ans.isCorrect) existingMacro.correct += 1;
    existingMacro.totalTime += ans.timeSpentSeconds || 15;
    existingMacro.count += 1;
    categoryMap.set(macro.key, existingMacro);
  });

  // Calculate detailed Topic Stats
  const topicStats: CategoryPerformance[] = [];
  topicMap.forEach((val, key) => {
    const accuracy = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
    const avgTime = val.count > 0 ? Math.round(val.totalTime / val.count) : 15;
    topicStats.push({
      categoryKey: key,
      categoryLabel: val.label,
      description: val.desc,
      totalAttempts: val.total,
      correctCount: val.correct,
      accuracyRate: accuracy,
      averageTimeSeconds: avgTime,
    });
  });

  // Calculate Macro Category Stats
  const categoryStats: CategoryPerformance[] = [];
  let totalAllAttempts = 0;
  let totalAllCorrect = 0;

  categoryMap.forEach((val, key) => {
    const accuracy = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
    const avgTime = val.count > 0 ? Math.round(val.totalTime / val.count) : 15;
    totalAllAttempts += val.total;
    totalAllCorrect += val.correct;
    categoryStats.push({
      categoryKey: key,
      categoryLabel: val.label,
      description: val.desc,
      totalAttempts: val.total,
      correctCount: val.correct,
      accuracyRate: accuracy,
      averageTimeSeconds: avgTime,
    });
  });

  const overallAccuracy = totalAllAttempts > 0 ? Math.round((totalAllCorrect / totalAllAttempts) * 100) : 100;

  // Build Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Check specific topics that were ACTUALLY answered by user
  topicStats.forEach((t) => {
    if (t.totalAttempts >= 2 && t.accuracyRate >= 70) {
      if (t.categoryKey === 'PONTUACAO_SINTAXE' && hasPunctuationFailures) {
        // Do not add punctuation to strengths if user failed code punctuation!
        return;
      }
      if (t.categoryKey === 'OPEN_SQL') {
        strengths.push('Parabéns, está mandando muito bem nos comandos de SELECT e queries Open SQL, continue assim ;)');
      } else if (t.categoryKey === 'TABELAS_INTERNAS') {
        strengths.push('Excelente domínio em Tabelas Internas! Seus LOOPs e leituras de ITAB estão rápidos e limpos.');
      } else if (t.categoryKey === 'REPORTS_LOGICA') {
        strengths.push('Ótimo domínio em estrutura de relatórios SE38, parâmetros de seleção e comandos de fluxo.');
      } else if (t.categoryKey === 'TIPOS_DADOS') {
        strengths.push('Excelente precisão nos tipos de dados fundamentais (I, C, P, D, T, STRING) e declarações com DATA.');
      } else if (t.categoryKey === 'DDIC_DETALHADO') {
        strengths.push('Forte conhecimento no Dicionário de Dados (SE11), tabelas transparentes e modelo de dados SAP.');
      } else if (t.categoryKey === 'ABAP_OO') {
        strengths.push('Show de bola em ABAP OO! Compreensão sólida de seções de visibilidade, classes e interfaces.');
      } else if (t.categoryKey === 'FORMULARIOS') {
        strengths.push('Muito bem em Formulários e Spool! Domínio claro das arquiteturas de saída e internacionalização.');
      } else {
        strengths.push(`Ótimo aproveitamento em ${t.categoryLabel} (${t.accuracyRate}% de acertos).`);
      }
    } else if (t.totalAttempts >= 2 && t.accuracyRate < 60) {
      if (t.categoryKey === 'OPEN_SQL') {
        weaknesses.push('Opa, está errando bastante nos comandos de seleção de dados (SELECT), vamos praticar mais? Senão o RH vai te chamar hehe.');
      } else if (t.categoryKey === 'TABELAS_INTERNAS') {
        weaknesses.push('Atenção redobrada nas Tabelas Internas: cuidado com READ sem BINARY SEARCH e LOOPs sem ponteiros FIELD-SYMBOLS.');
      } else if (t.categoryKey === 'REPORTS_LOGICA') {
        weaknesses.push('Atenção nos comandos de tela de seleção e lógica de relatórios clássicos (SE38).');
      } else {
        weaknesses.push(`Vale a pena revisar com calma o módulo de ${t.categoryLabel}, seu aproveitamento está em ${t.accuracyRate}%.`);
      }
    }
  });

  // Specifically evaluate punctuation errors
  if (hasPunctuationFailures) {
    weaknesses.unshift(
      'Atenção com a pontuação (.) no editor ABAP: você registrou erro por esquecer o ponto final em instruções. Lembre-se: em ABAP, todo comando sem exceção deve ser encerrado com ponto final.'
    );
  }

  // Friendly fallbacks if user is just starting out
  if (strengths.length === 0) {
    if (totalAllAttempts === 0) {
      strengths.push('Perfil recém-iniciado! Complete os primeiros exercícios para destacar suas especialidades técnicas.');
    } else {
      strengths.push('Boa dedicação inicial! Continue praticando os quizzes para consolidar seus pontos fortes.');
    }
  }

  if (weaknesses.length === 0 && totalAllAttempts > 0 && !hasPunctuationFailures) {
    weaknesses.push('Nenhuma falha crítica detectada até o momento. Mantenha a consistência diária nos exercícios!');
  }

  // Find slowest topic
  let slowestTopic: UserBehaviorSummary['slowestTopic'] = null;
  const topicsWithAttempts = topicStats.filter((t) => t.totalAttempts >= 2);
  if (topicsWithAttempts.length > 0) {
    topicsWithAttempts.sort((a, b) => b.averageTimeSeconds - a.averageTimeSeconds);
    const slowest = topicsWithAttempts[0];
    slowestTopic = {
      categoryLabel: slowest.categoryLabel,
      averageTimeSeconds: slowest.averageTimeSeconds,
      tip: `Exercícios deste tópico levaram em média ${slowest.averageTimeSeconds}s. Revise os conceitos com o Mentor IA ou no Dicionário de Referência.`,
    };
  }

  // Build list of failed questions organized by level (caderno de erros)
  const failedMap: Record<string, FailedQuestionItem[]> = {};
  const processedQuestionIds = new Set<string>();

  // Check failed answers in history
  const failedAnswers = answerHistory.filter((a) => !a.isCorrect);
  failedAnswers.forEach((ans) => {
    if (processedQuestionIds.has(ans.questionId)) return;
    processedQuestionIds.add(ans.questionId);

    const questionMeta = QUIZ_QUESTIONS.find((q) => q.id === ans.questionId);
    const levelKey = ans.level || questionMeta?.level || 'Nível 1';
    const exerciseNum = getExerciseNumberInLevel(ans.questionId, levelKey);

    if (!failedMap[levelKey]) {
      failedMap[levelKey] = [];
    }

    failedMap[levelKey].push({
      questionId: ans.questionId,
      questionTitle: ans.questionTitle,
      level: levelKey,
      userAnswer: ans.userAnswer,
      feedback: ans.feedback || questionMeta?.explanation,
      timestamp: ans.timestamp || ans.date || new Date().toISOString(),
      exerciseNumber: exerciseNum,
      conceptTag: questionMeta?.conceptTag,
      type: questionMeta?.type,
    });
  });

  // Sort failed questions by exercise number inside each level
  Object.keys(failedMap).forEach((lvl) => {
    failedMap[lvl].sort((a, b) => a.exerciseNumber - b.exerciseNumber);
  });

  const totalFailed = Object.values(failedMap).reduce((acc, list) => acc + list.length, 0);

  // Verdict & Quotes
  let humorousQuote = '“Se o compilador não deu erro, ainda dá tempo de dar erro em PRD.” — Desenvolvedor Sênior SAP';
  let behavioralVerdict = 'Aprendiz Dedicada em Ritmo Constante';

  if (overallAccuracy >= 85 && totalAllAttempts >= 6) {
    behavioralVerdict = 'Consultora Prodígio de Alta Precisão (Quase um BASIS!)';
    humorousQuote = '“Quem nunca esqueceu um WHERE no UPDATE em desenvolvimento, não sabe a adrenalina de ser ABAP.”';
  } else if (overallAccuracy < 55 && totalAllAttempts >= 4) {
    behavioralVerdict = 'Corajosa Enfrentadora de Dumps (Foco em Recuperação)';
    humorousQuote = '“O ST22 não é um inimigo, é apenas o SAP pedindo carinho e mais um bloco TRY / CATCH.”';
  }

  const recommendedAction = 
    hasPunctuationFailures
      ? 'Atenção aos pontos finais (.) no código: revise a regra básica de sintaxe ABAP.'
      : weaknesses.length > 0 && weaknesses[0].includes('SELECT')
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
    categoryStats,
    topicStats,
    failedQuestionsByLevel: failedMap,
    totalFailedQuestions: totalFailed,
  };
}
