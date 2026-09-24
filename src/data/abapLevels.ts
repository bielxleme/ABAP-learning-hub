import { QuizDifficulty } from '../types';

export interface AbapLevelBoss {
  name: string;
  title: string;
  avatar: string; // emoji or icon
  description: string;
  hp: number;
  weakness: string;
}

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
  boss: AbapLevelBoss;
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
      'Avaliação oficial com 10 questões do Nível 1. Acerte 70% ou mais para obter o Certificado de Fundamentos e derrotar o Bug de Sintaxe Monolítico!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n1',
    titleReward: 'Consultora Júnior em Fundamentos ABAP',
    boss: {
      name: 'Bug de Sintaxe Monolítico',
      title: 'Guardião dos Pontos Finais Esquecidos',
      avatar: '🗿',
      description: 'Um golem de pedra antiga formado por códigos ABAP sem pontos finais (.) e variáveis não tipadas.',
      hp: 1000,
      weakness: 'Ponto final (.) e declarações DATA precisas',
    },
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
      'Avaliação oficial com 10 questões práticas do Nível 2. Acerte 70% ou mais para certificar-se em Dicionário SE11 e derrotar o Leviatã do Full Table Scan!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n2',
    titleReward: 'Operadora de Banco de Dados SAP',
    boss: {
      name: 'Leviatã do Full Table Scan',
      title: 'Devorador de Memória do Banco',
      avatar: '🐉',
      description: 'Uma serpente colossal que realiza SELECT * sem cláusula WHERE, travando as instâncias de diálogo do servidor.',
      hp: 1500,
      weakness: 'Cláusula WHERE com chaves primárias e SELECT SINGLE',
    },
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
      'Avaliação de 10 questões sobre processamento em memória e performance. Acerte 70% ou mais para banir o Dragão do LOOP Infinito!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n3',
    titleReward: 'Mestre de LOOPs & Tabelas Internas',
    boss: {
      name: 'Dragão do LOOP Infinito',
      title: 'Arauto do DUMP TIME_OUT',
      avatar: '🐲',
      description: 'Um dragão circular que prende o processamento em iterações sem fim e SELECTs dentro de loops.',
      hp: 2000,
      weakness: 'SORT com BINARY SEARCH, Field-Symbols e FOR ALL ENTRIES',
    },
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
      'Avaliação avançada sobre integrações e BAPIs. Desbloqueie a credencial de Arquiteta e derrote o Titã das RFCs Rompidas!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n4',
    titleReward: 'Arquiteta em Modularização & BAPIs SAP',
    boss: {
      name: 'Golem das RFCs Rompidas',
      title: 'Destruidor de Conexões Transacionais',
      avatar: '🤖',
      description: 'Um autômato gigante de ferro fundido que rejeita commits e espalha mensagens de erro na BAPIRET2.',
      hp: 2500,
      weakness: 'BAPI_TRANSACTION_COMMIT e tratamento de mensagens da BAPIRET2',
    },
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
      'O teste definitivo para se consagrar Consultora Sênior SAP S/4HANA e aniquilar o Monarca dos Short Dumps ST22!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n5',
    titleReward: 'Consultora Sênior SAP S/4HANA',
    boss: {
      name: 'Monarca dos Short Dumps ST22',
      title: 'Entidade do SYSTEM_NO_ROLL',
      avatar: '👑',
      description: 'O lorde sombrio das telas vermelhas do SAP GUI que surge com dumps catastróficos em produção.',
      hp: 3000,
      weakness: 'Sintaxe Clean ABAP 7.40+, @DATA inline e checagens seguras',
    },
  },
  {
    id: 'Nível 6',
    number: 6,
    title: 'Nível 6: Formulários, Spool & Internacionalização',
    subtitle: 'Smart Forms, Adobe Forms, SAPscript e Tradução SE63',
    description:
      'Aprenda a arquitetura conceitual de formulários empresariais SAP: Smart Forms (/1BCDWB/SF...), Adobe Document Services (ADS), ciclo SAPscript e tradução em múltiplos idiomas pela SE63.',
    icon: 'Printer',
    color: '#e11d48',
    topics: [
      'Arquitetura de Smart Forms e Função Dinâmica SSF_FUNCTION_MODULE_NAME',
      'Janela Principal (MAIN) vs Secundária (SECONDARY) e quebra de páginas',
      'Adobe Document Services (ADS): Interface de Dados vs Contexto XFA',
      'Ciclo de Vida do SAPscript: OPEN_FORM, WRITE_FORM e CLOSE_FORM',
      'Tags de Comando SAPscript: /: (Comandos) e /E (Elementos de Texto)',
      'Transação SE63 de Tradução de Textos, Telas e Mensagens',
      'Clean Code: Eliminação de Hardcoded Strings e uso de Text Symbols',
      'Gerenciamento de Spool, Pré-visualização e Impressão (SP01 / SP02)',
    ],
    simuladoTitle: 'Simulado Final - Nível 6: Formulários & Internacionalização',
    simuladoDescription:
      'Avaliação conceitual de arquitetura de formulários e tradução. Acerte 70% ou mais para obter a credencial e derrotar a Quimera do Spool Corrompido!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n6',
    titleReward: 'Especialista em Formulários & Internacionalização SAP',
    boss: {
      name: 'Quimera do Spool Corrompido',
      title: 'Monstro das Impressões Travadas na SP01',
      avatar: '📜',
      description: 'Uma fera híbrida feita de pergaminhos rasgados, filas de spool emperradas e textos em idiomas truncados.',
      hp: 3500,
      weakness: 'SSF_FUNCTION_MODULE_NAME, parâmetros de controle OTF e Text Symbols da SE63',
    },
  },
  {
    id: 'Nível 7',
    number: 7,
    title: 'Nível 7: ABAP OO Avançado & Arquitetura Corporativa',
    subtitle: 'Classes SE24, Interfaces, Herança, Exceções e Design Patterns',
    description:
      'Domine o paradigma orientado a objetos no SAP corporativo: visibilidade (PUBLIC/PROTECTED/PRIVATE), interfaces polimórficas, exceções baseadas em classe CX_ROOT, padrões Singleton/Factory e ABAP Unit.',
    icon: 'ShieldAlert',
    color: '#8b5cf6',
    topics: [
      'Classes Globais (SE24) e Locais: Definição e Implementação',
      'Seções de Visibilidade: PUBLIC, PROTECTED e PRIVATE',
      'Interfaces (zif_...): Polimorfismo, Inversão de Controle e Desacoplamento',
      'Herança (INHERITING FROM) e Métodos REDEFINITION',
      'Classes e Métodos ABSTRACT e FINAL',
      'Exceções Baseadas em Classes (TRY ... CATCH cx_root ... CLEANUP)',
      'Eventos em Classes (EVENTS, FOR EVENT OF, SET HANDLER)',
      'Design Patterns no SAP: Singleton, Factory, Strategy e Observer',
      'Testes Automatizados com ABAP Unit (FOR TESTING)',
    ],
    simuladoTitle: 'Simulado Final - Nível 7: ABAP OO & Design Patterns',
    simuladoDescription:
      'A prova máxima de maestria técnica para se consagrar Grã-Mestra em Arquitetura ABAP OO e aniquilar o Lorde Supremo CX_SY_REF_IS_INITIAL!',
    passingScore: 70,
    badgeRewardId: 'badge_simulado_n7',
    titleReward: 'Grã-Mestra em ABAP OO & Design Patterns',
    boss: {
      name: 'Lorde Supremo CX_SY_REF_IS_INITIAL',
      title: 'Soberano das Referências Nulas e Objetos Iniciais',
      avatar: '🧙‍♂️',
      description: 'O mais antigo e temido antagonista do SAP NetWeaver, capaz de colapsar qualquer transação ao acessar uma referência de objeto não instanciada.',
      hp: 4000,
      weakness: 'Blocos TRY / CATCH com CX_ROOT, Factory segura e interfaces polimórficas',
    },
  },
];
