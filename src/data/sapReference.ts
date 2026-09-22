import { Badge, SapTableRecord } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_step',
    title: 'Login no SAP GUI',
    description: 'Completou seu primeiro quiz no Learning Hub.',
    icon: 'LogIn',
    category: 'quiz',
    unlockedTitle: 'Iniciante no SAP GUI (SE38)',
  },
  {
    id: 'badge_select_10',
    title: '10 Consultas Realizadas',
    description: 'Acertou 10 exercícios de consultas e comandos SQL na base SAP.',
    icon: 'Database',
    category: 'quiz',
    unlockedTitle: 'Operadora de Banco de Dados SAP',
  },
  {
    id: 'badge_select_master',
    title: 'Mestre em SELECT',
    description: 'Acertou desafios avançados de consultas em tabelas mestre MARA e KNA1.',
    icon: 'Search',
    category: 'quiz',
    unlockedTitle: 'Especialista em Open SQL SAP',
  },
  {
    id: 'badge_sysubrc_zero',
    title: 'SY-SUBRC = 0',
    description: 'Acertou 5 quizzes seguidos sem errar nenhuma resposta.',
    icon: 'CheckCircle2',
    category: 'quiz',
    unlockedTitle: 'Perfeccionista de Código (SY-SUBRC = 0)',
  },
  {
    id: 'badge_debugger_master',
    title: 'Depurador NetWeaver (/h)',
    description: 'Inspecionou variáveis e executou o passo a passo com F5/F6 no depurador.',
    icon: 'Bug',
    category: 'editor',
    unlockedTitle: 'Depuradora Oficial /h e ST05',
  },
  {
    id: 'badge_simulado_n1',
    title: 'Certificação Nível 1',
    description: 'Aprovada no Simulado Geral do Nível 1 com pontuação superior a 70%.',
    icon: 'Award',
    category: 'simulado',
    unlockedTitle: 'Consultora Júnior em Fundamentos ABAP',
  },
  {
    id: 'badge_simulado_n2',
    title: 'Certificação Nível 2',
    description: 'Aprovada no Simulado Geral do Nível 2 de Dicionário SE11 e Open SQL.',
    icon: 'Award',
    category: 'simulado',
    unlockedTitle: 'Especialista em Dicionário SE11 & Open SQL',
  },
  {
    id: 'badge_loop_tamer',
    title: 'Domadora de LOOPs',
    description: 'Completou os exercícios sobre tabelas internas e Field-Symbols.',
    icon: 'Repeat',
    category: 'quiz',
    unlockedTitle: 'Mestre de LOOPs & Tabelas Internas',
  },
  {
    id: 'badge_bapi_ninja',
    title: 'BAPI Ninja',
    description: 'Desbloqueou desafios sobre BAPIs, RFCs e transações padrão.',
    icon: 'Zap',
    category: 'quiz',
    unlockedTitle: 'Arquiteta em Integrações & BAPIs SAP',
  },
  {
    id: 'badge_clean_abap',
    title: 'Clean ABAP 7.40+',
    description: 'Usou construtores modernos VALUE #( ) e declaração inline @DATA( ).',
    icon: 'Sparkles',
    category: 'editor',
    unlockedTitle: 'Arquiteta Clean ABAP 7.40+',
  },
  {
    id: 'badge_simulator_pro',
    title: 'Compilador Ativo',
    description: 'Executou simulações de código com sucesso na Saída Clássica Spool.',
    icon: 'Play',
    category: 'editor',
    unlockedTitle: 'Engenheira de Relatórios Clássicos',
  },
  {
    id: 'badge_ai_mentee',
    title: 'Consultora Conectada',
    description: 'Tirou dúvidas técnicas de alto nível com o SAP Mentor AI.',
    icon: 'Bot',
    category: 'chat',
    unlockedTitle: 'Especialista Orientada por IA',
  },
  {
    id: 'badge_streak_3',
    title: 'Foco Diário',
    description: 'Manteve sua sequência diária de estudos ativa.',
    icon: 'Flame',
    category: 'streak',
    unlockedTitle: 'Desenvolvedora com Foco Diário',
  },
  {
    id: 'badge_streak_7',
    title: 'Constância de Produção',
    description: 'Estudou por 7 dias seguidos mantendo o streak vivo no SAP GUI.',
    icon: 'Flame',
    category: 'streak',
    unlockedTitle: 'Consultora Sênior Dedicada PRD',
  },
];

// Mock SAP Database tables for realistic simulator executions
export const MOCK_MARA: SapTableRecord[] = [
  { MATNR: '100-100', MTART: 'ROH', MEINS: 'KG', MAKTX: 'Aço Carbono Industrial 50mm', MATKL: '0100', ERNAM: 'BLEME' },
  { MATNR: '100-200', MTART: 'KA',  MEINS: 'UN', MAKTX: 'Kit Consignado Válvula Hidráulica', MATKL: '0200', ERNAM: 'BLEME' },
  { MATNR: '100-201', MTART: 'KA',  MEINS: 'UN', MAKTX: 'Sensor de Pressão Eletrônico KA', MATKL: '0200', ERNAM: 'CONSULT' },
  { MATNR: '200-300', MTART: 'FERT', MEINS: 'PC', MAKTX: 'Turbina a Gás Montada Modelo G4', MATKL: '0300', ERNAM: 'JDOE' },
  { MATNR: '200-400', MTART: 'HALB', MEINS: 'PC', MAKTX: 'Eixo Rotativo Sub-conjunto', MATKL: '0150', ERNAM: 'JDOE' },
  { MATNR: '300-500', MTART: 'HAWA', MEINS: 'CX', MAKTX: 'Rolamento Blindado Importado', MATKL: '0400', ERNAM: 'BLEME' },
  { MATNR: '300-550', MTART: 'KA',  MEINS: 'PC', MAKTX: 'Módulo de Controle Eletrônico KA', MATKL: '0200', ERNAM: 'BLEME' },
];

export const MOCK_VBAK: SapTableRecord[] = [
  { VBELN: '0000010021', ERDAT: '20260915', ERNAM: 'BLEME', AUART: 'OR', KUNNR: '0000100050', NETWR: '14500.00', WAERK: 'BRL' },
  { VBELN: '0000010022', ERDAT: '20260918', ERNAM: 'JDOE',  AUART: 'QT', KUNNR: '0000100080', NETWR: '8900.00',  WAERK: 'BRL' },
  { VBELN: '0000010023', ERDAT: '20260920', ERNAM: 'BLEME', AUART: 'OR', KUNNR: '0000100050', NETWR: '32400.50', WAERK: 'BRL' },
  { VBELN: '0000010024', ERDAT: '20260921', ERNAM: 'ADMIN', AUART: 'FD', KUNNR: '0000100120', NETWR: '2100.00',  WAERK: 'USD' },
];

export const MOCK_KNA1: SapTableRecord[] = [
  { KUNNR: '0000100050', NAME1: 'Indústria Metalúrgica Brasil S/A', ORT01: 'São Paulo', LAND1: 'BR', PSTLZ: '01310-100' },
  { KUNNR: '0000100080', NAME1: 'Logística e Transportes Globais', ORT01: 'Campinas', LAND1: 'BR', PSTLZ: '13080-000' },
  { KUNNR: '0000100120', NAME1: 'Petroquímica do Nordeste Ltda',  ORT01: 'Salvador', LAND1: 'BR', PSTLZ: '40000-000' },
];

export const SAP_KEYWORD_DOCS: Record<string, { summary: string; syntax: string; tip: string }> = {
  'SELECT': {
    summary: 'Instrução Open SQL para buscar dados das tabelas do banco de dados SAP.',
    syntax: 'SELECT [SINGLE] campos FROM tabela INTO [TABLE] destino WHERE condicoes.',
    tip: 'Sempre limite os campos necessários em vez de SELECT * para manter alta performance.',
  },
  'DATA': {
    summary: 'Declaração de variáveis simples, estruturas ou tabelas internas na memória.',
    syntax: 'DATA: gv_var TYPE string, gs_wa TYPE mara, gt_tab TYPE TABLE OF mara.',
    tip: 'No ABAP 7.40+, prefira declaração inline com DATA(...) diretamente no ponto de uso.',
  },
  'PARAMETERS': {
    summary: 'Define um campo de entrada único na tela de seleção inicial do relatório.',
    syntax: 'PARAMETERS: p_matnr TYPE mara-matnr OBLIGATORY DEFAULT \'100-100\'.',
    tip: 'Gera uma variável simples de tela com apenas 1 valor por vez.',
  },
  'SELECT-OPTIONS': {
    summary: 'Define uma tabela de seleção complexa na tela (com intervalos, múltiplos valores, exclusões).',
    syntax: 'SELECT-OPTIONS: s_matnr FOR mara-matnr.',
    tip: 'Estrutura internamente com campos SIGN, OPTION, LOW e HIGH.',
  },
  'LOOP AT': {
    summary: 'Itera sobre os registros de uma tabela interna.',
    syntax: 'LOOP AT gt_tabela INTO gs_wa [ASSIGNING <fs_wa>]. ... ENDLOOP.',
    tip: 'Use ASSIGNING FIELD-SYMBOL para evitar cópias de memória desnecessárias e obter maior velocidade.',
  },
  'READ TABLE': {
    summary: 'Lê uma linha específica de uma tabela interna usando chave ou índice.',
    syntax: 'READ TABLE gt_tabela INTO gs_wa WITH KEY campo = valor BINARY SEARCH.',
    tip: 'Lembre-se: BINARY SEARCH exige que a tabela interna esteja pré-ordenada com SORT!',
  },
  'CALL FUNCTION': {
    summary: 'Executa um Módulo de Função (Function Module) ou BAPI registrada no SAP.',
    syntax: 'CALL FUNCTION \'BAPI_...\' EXPORTING ... IMPORTING ... EXCEPTIONS ...',
    tip: 'BAPIs que realizam gravação no banco necessitam de CALL FUNCTION \'BAPI_TRANSACTION_COMMIT\'.',
  },
  'SY-SUBRC': {
    summary: 'Variável de sistema que guarda o código de retorno da última operação executada.',
    syntax: 'IF sy-subrc = 0. "Sucesso! ELSE. "Não encontrado ou erro. ENDIF.',
    tip: 'Valor 0 significa êxito; valores diferentes (ex: 4) indicam falha ou registro inexistente.',
  },
  'AT SELECTION-SCREEN': {
    summary: 'Evento disparado para validar dados inseridos pelo usuário na tela de seleção.',
    syntax: 'AT SELECTION-SCREEN ON p_matnr. IF p_matnr IS INITIAL. MESSAGE \'Obrigatório\' TYPE \'E\'. ENDIF.',
    tip: 'Ideal para validar parâmetros antes de iniciar a busca pesada no banco de dados.',
  },
  'TYPES': {
    summary: 'Cria novos tipos de dados personalizados pelo desenvolvedor sem alocar memória imediatamente.',
    syntax: 'TYPES: BEGIN OF ty_material, matnr TYPE mara-matnr, maktx TYPE makt-maktx, END OF ty_material.',
    tip: 'Use para modelar estruturas complexas que serão reutilizadas em tabelas e work areas.',
  },
};

export const OFFICIAL_SAP_LINKS = [
  {
    title: 'SAP Help Portal - ABAP Keyword Documentation',
    url: 'https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm',
    desc: 'Documentação oficial de cada instrução e comando ABAP.',
  },
  {
    title: 'SAP Community - ABAP Development',
    url: 'https://community.sap.com/topics/abap',
    desc: 'Artigos técnicos, fóruns e dúvidas respondidas pela comunidade global SAP.',
  },
  {
    title: 'Clean ABAP Style Guide (GitHub Oficial)',
    url: 'https://github.com/SAP/styleguides/blob/main/clean-abap/CleanABAP.md',
    desc: 'Guia de estilo oficial da SAP para escrever código ABAP limpo, moderno e legível.',
  },
  {
    title: 'SAP Learning Hub',
    url: 'https://learning.sap.com/',
    desc: 'Cursos oficiais, trilhas de certificação e materiais de formação SAP.',
  },
];

export const INITIAL_ABAP_CODE = `*&---------------------------------------------------------------------*
*& Report Z_APRENDIZADO_ABAP
*& Título: Consulta de Materiais Consignados (Tipo KA)
*&---------------------------------------------------------------------*
REPORT z_aprendizado_abap.

TABLES: mara.

* Parâmetro de tela para filtrar tipo de material
PARAMETERS: p_mtart TYPE mara-mtart DEFAULT 'KA' OBLIGATORY.

* Definição de tipos
TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         meins TYPE mara-meins,
         maktx TYPE maktx,
       END OF ty_material.

DATA: lt_materiais TYPE TABLE OF ty_material,
      ls_material  TYPE ty_material.

START-OF-SELECTION.
  " Seleciona os campos MATNR e MTART da tabela MARA
  SELECT matnr, mtart, meins, maktx
    FROM mara
    INTO TABLE @lt_materiais
    WHERE mtart = @p_mtart.

  IF sy-subrc = 0.
    WRITE: /(60) 'LISTAGEM DE MATERIAIS ENCONTRADOS NO SAP' COLOR COL_HEADING.
    ULINE.

    LOOP AT lt_materiais INTO ls_material.
      WRITE: / ls_material-matnr COLOR COL_KEY,
               ls_material-mtart COLOR COL_NORMAL,
               ls_material-meins,
               ls_material-maktx.
    ENDLOOP.

    WRITE: / 'Total de registros lidos:', lines( lt_materiais ) COLOR COL_TOTAL.
  ELSE.
    WRITE: / 'Nenhum material encontrado com o tipo:', p_mtart COLOR COL_NEGATIVE.
  ENDIF.
`;
