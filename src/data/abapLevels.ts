import { QuizDifficulty } from '../types';

export interface AbapLevelInfo {
  id: QuizDifficulty;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  topics: string[];
  simuladoTitle: string;
  simuladoDescription: string;
  passingScore: number; // e.g. 70 (%)
  badgeRewardId: string;
  titleReward: string;
}

export const ABAP_LEVELS: AbapLevelInfo[] = [
  {
    id: 'Nível 1',
    number: 1,
    title: 'Nível 1: Fundamentos & Tipos ABAP',
    subtitle: 'Sintaxe básica, tipos elementares, variáveis e decisões',
    description:
      'Aprenda a estrutura de um programa ABAP (SE38), declaração de dados (DATA), tipos elementares (C, N, I, P, D, T, STRING), operadores matemáticos e condicionais IF / CASE.',
    icon: 'Terminal',
    color: '#0070f2',
    topics: [
      'Estrutura de Programas REPORT e Sintaxe',
      'Ponto final (.) e encadeamento com dois pontos (:)',
      'Tipos Elementares (C, N, I, P, D, T, F, STRING)',
      'Declaração DATA, VALUE e CONSTANTS',
      'Entradas de tela simples com PARAMETERS',
      'Estruturas de Decisão: IF / ELSEIF / ENDIF e CASE / WHEN',
      'Variáveis de Sistema (SY-SUBRC, SY-DATUM, SY-UZEIT, SY-UNAME)',
      'Saída de tela clássica: WRITE, ULINE, SKIP e Cores',
    ],
    simuladoTitle: 'Simulado Final - Nível 1: Fundamentos & Sintaxe',
    simuladoDescription:
      'Avaliação oficial com 10 questões aleatórias do Nível 1. Acerte 70% ou mais para obter o Certificado de Fundamentos e desbloquear o título exclusivo!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n1',
    titleReward: 'Consultora Júnior em Fundamentos ABAP',
  },
  {
    id: 'Nível 2',
    number: 2,
    title: 'Nível 2: Dicionário SE11 & Open SQL',
    subtitle: 'Tabelas transparentes, chaves, estruturas e queries no banco',
    description:
      'Domine o Dicionário de Dados SAP (SE11), criação e uso de Domínios, Elementos de Dados, tabelas padrão clássicas (MARA, MARC, KNA1, VBAK) e comandos Open SQL SELECT.',
    icon: 'Database',
    color: '#107e3e',
    topics: [
      'Transação SE11: Tabelas Transparentes, Domínios e Elementos de Dados',
      'Tabelas Padrão SAP (MARA, MARC, MARD, KNA1, LFA1, VBAK, EKKO)',
      'Chaves Primárias e Mandante (MANDT)',
      'Estruturas ABAP (TYPES BEGIN OF ... END OF)',
      'Comandos Open SQL: SELECT, FROM, INTO, WHERE',
      'SELECT SINGLE vs SELECT INTO TABLE',
      'Cláusula WHERE e Operadores Lógicos (EQ, NE, LIKE, BETWEEN, IN)',
      'Verificação de Registradores: SY-SUBRC e SY-DBCNT',
      'Telas de Seleção com Ranges: SELECT-OPTIONS',
    ],
    simuladoTitle: 'Simulado Final - Nível 2: Dicionário & Open SQL',
    simuladoDescription:
      'Avaliação oficial com 10 questões práticas do Nível 2. Acerte 70% ou mais para obter a certificação de Dicionário SE11 e o título de Operador(a) de Banco de Dados SAP!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n2',
    titleReward: 'Operadora de Banco de Dados SAP',
  },
  {
    id: 'Nível 3',
    number: 3,
    title: 'Nível 3: Tabelas Internas & Loops',
    subtitle: 'Work Areas, Field-Symbols, ordenação e manipulação em memória',
    description:
      'Aprofunde-se no coração do processamento ABAP: criação de tabelas internas (STANDARD, SORTED, HASHED), manipulação de Work Areas, Field-Symbols e Clean ABAP 7.40+.',
    icon: 'Repeat',
    color: '#d97706',
    topics: [
      'Tipos de Tabelas Internas (STANDARD, SORTED, HASHED)',
      'Work Areas (ls_...) e Field-Symbols (<fs_...>)',
      'LOOP AT itab INTO wa vs LOOP AT itab ASSIGNING <fs>',
      'Operações em Tabela: APPEND, INSERT, MODIFY, DELETE, CLEAR',
      'Leitura de Linhas: READ TABLE com BINARY SEARCH e expressões itab[ ... ]',
      'Ordenação com SORT e verificação SY-TABIX',
      'Anti-patterns de Performance: Evitar SELECT dentro de LOOP',
      'FOR ALL ENTRIES IN e INNER JOINs eficientes',
    ],
    simuladoTitle: 'Simulado Final - Nível 3: Tabelas Internas & Performance',
    simuladoDescription:
      'Avaliação de 10 questões sobre processamento em memória e performance. Acerte 70% ou mais para desbloquear o título de Mestre de LOOPs e Tabelas Internas!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n3',
    titleReward: 'Mestre de LOOPs & Tabelas Internas',
  },
  {
    id: 'Nível 4',
    number: 4,
    title: 'Nível 4: Modularização & BAPIs',
    subtitle: 'Subrotinas, Módulos de Função (SE37), BAPIs e Relatórios ALV',
    description:
      'Aprenda a estruturar software profissional com PERFORM / FORM, Chamadas de Função (CALL FUNCTION), BAPIs transacionais para criar documentos e exibição em ALV Grid.',
    icon: 'Layers',
    color: '#7c3aed',
    topics: [
      'Subrotinas: PERFORM e FORM com passagem por valor e referência',
      'Transação SE37: Módulos de Função e Grupos de Função',
      'BAPIs (Business Application Programming Interfaces)',
      'Tratamento de Mensagens e Tabela RETURN (BAPIRET2)',
      'Controle Transacional: BAPI_TRANSACTION_COMMIT e ROLLBACK',
      'Relatórios Interativos com ALV (REUSE_ALV_GRID_DISPLAY e SALV)',
      'Depuração Avançada com Breakpoints e Watchpoints (/h)',
    ],
    simuladoTitle: 'Simulado Final - Nível 4: Modularização & BAPIs',
    simuladoDescription:
      'Avaliação avançada sobre integrações e BAPIs. Desbloqueie a credencial de Arquiteta em Integrações SAP!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n4',
    titleReward: 'Arquiteta em Modularização & BAPIs SAP',
  },
  {
    id: 'Nível 5',
    number: 5,
    title: 'Nível 5: Clean ABAP & S/4HANA',
    subtitle: 'Sintaxe 7.40+, CDS Views, ABAP OO e Arquitetura Moderna',
    description:
      'O estado da arte no desenvolvimento SAP: expressões VALUE, COND, SWITCH, REDUCE, declarações inline @DATA(...), Core Data Services (CDS) e migração para S/4HANA.',
    icon: 'Sparkles',
    color: '#0891b2',
    topics: [
      'Sintaxe 7.40+: Declaração Inline @DATA(...) e @FINAL(...)',
      'Construtores de Expressão: VALUE #( ), CORRESPONDING #( )',
      'Operadores Condicionais: COND #( ) e SWITCH #( )',
      'Operadores de Tabela: FILTER #( ) e REDUCE #( )',
      'Introdução ao ABAP Orientado a Objetos (Classes SE24)',
      'CDS Views (Core Data Services) no SAP S/4HANA',
      'Code Inspector (SCI) e Princípios Clean ABAP',
    ],
    simuladoTitle: 'Simulado Final - Nível 5: Clean ABAP & S/4HANA',
    simuladoDescription:
      'O teste definitivo para se consagrar Consultora Sênior SAP S/4HANA e Mestre em Clean ABAP!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n5',
    titleReward: 'Consultora Sênior SAP S/4HANA',
  },
];
