export type QuizDifficulty = 'Nível 1' | 'Nível 2' | 'Nível 3' | 'Nível 4' | 'Nível 5';
export type QuestionType = 'multiple_choice' | 'code_exercise' | 'theory';

export interface QuizQuestion {
  id: string;
  level: QuizDifficulty;
  type: QuestionType;
  title: string;
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswerIndex?: number;
  expectedCodePatterns?: {
    requiredTokens: string[];
    forbiddenTokens?: string[];
    regex?: RegExp;
    sampleSolution: string;
  };
  explanation: string;
  conceptTag: string;
  xpReward: number;
}

export interface UserAnswerHistory {
  questionId: string;
  questionTitle: string;
  level: QuizDifficulty;
  type: QuestionType;
  isCorrect: boolean;
  userAnswer: string;
  date: string;
  feedback: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'quiz' | 'editor' | 'chat' | 'streak' | 'simulado';
  unlockedTitle?: string; // Título exclusivo concedido ao desbloquear esta conquista
}

export interface SimuladoResult {
  level: QuizDifficulty;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: string;
  earnedBadge?: string;
  earnedTitle?: string;
}

export interface UserErrorRecord {
  id: string;
  source: 'editor_syntax' | 'quiz_challenge';
  category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'LOOPS_CONDITIONS' | 'GENERAL_SYNTAX';
  title: string;
  detail: string;
  codeSnippet?: string;
  timestamp: string;
  resolved?: boolean;
}

export interface LabExercise {
  id: string;
  title: string;
  level: 'Nível 1' | 'Nível 2';
  category: 'SELECT & Open SQL' | 'Tabelas Internas (ITAB)';
  instruction: string;
  initialCode: string;
  solutionPattern: {
    requiredTokens: string[];
    forbiddenTokens?: string[];
    sampleSolution: string;
  };
  explanation: string;
  xpReward: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  email?: string;
  googleLinked?: boolean;
  password?: string; // Optional user password for secure logon
  xp: number;
  level: number;
  rankTitle: string;
  unlockedTitles?: string[]; // Lista de títulos conquistados pelo usuário
  equippedTitle?: string; // Título atualmente selecionado/equipado
  streakDays: number;
  lastActiveDate: string;
  completedQuestionIds: string[];
  badges: string[]; // badge ids
  simuladosHistory?: SimuladoResult[];
  errorLogs?: UserErrorRecord[];
  soundEnabled: boolean;
}

export interface AbapSyntaxError {
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface SapTableRecord {
  [field: string]: string | number;
}

export interface SapVariableWatch {
  name: string;
  category: 'system' | 'table' | 'structure' | 'variable';
  type: string;
  value: string;
  description: string;
  status?: 'ok' | 'changed' | 'warning' | 'error';
  fields?: Record<string, string | number>;
  tableRowsPreview?: SapTableRecord[];
}

export interface DebugTraceStep {
  step: number;
  event: string;
  line: number;
  codeSnippet: string;
  sySubrc: number;
  syTabix?: number;
  syDbcnt?: number;
  description: string;
  activeVariables: Record<string, string>;
}

export interface DebugConsoleData {
  systemVariables: Record<string, string | number>;
  monitoredVariables: SapVariableWatch[];
  executionTrace: DebugTraceStep[];
  callStack: string[];
}

export interface SimulationResult {
  success: boolean;
  type: 'classic_write' | 'alv_grid' | 'error_dump';
  statusMessage: string;
  sySubrc: number;
  syTabix?: number;
  classicLines?: string[];
  alvData?: {
    tableName: string;
    columns: string[];
    rows: SapTableRecord[];
  };
  dumpInfo?: {
    runtimeError: string;
    exception: string;
    shortText: string;
    whatHappened: string;
    howToCorrect: string;
  };
  debugConsole?: DebugConsoleData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeReference?: string;
}
