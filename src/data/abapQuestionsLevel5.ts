import { QuizQuestion } from '../types';

export const ABAP_QUESTIONS_LEVEL_5: QuizQuestion[] = [
  {
    id: 'n5_001',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Arquitetura S/4HANA: Code Pushdown',
    question: 'O que preconiza o princípio de "Code Pushdown" na arquitetura do SAP S/4HANA com SAP HANA?',
    options: [
      'Transferir a execução de cálculos complexos, agregações e filtros pesados para dentro da camada do banco de dados (in-memory) em vez de puxar milhões de registros brutos para a aplicação ABAP.',
      'Diminuir a quantidade de linhas de código nos programas REPORT.',
      'Armazenar o código-fonte em repositórios Git externos.',
      'Compilar o código ABAP para JavaScript no navegador.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Como o SAP HANA é um banco de dados in-memory orientado a colunas com enorme poder de processamento massivo, o princípio "Code-to-Data" executa filtros e joins diretamente no DB.',
    conceptTag: 'SAP S/4HANA & HANA',
    xpReward: 50,
  },
  {
    id: 'n5_002',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Core Data Services (CDS Views)',
    question: 'Qual é a ferramenta oficial recomendada pela SAP para modelagem e desenvolvimento de Core Data Services (CDS Views)?',
    options: [
      'ABAP Development Tools (ADT) no Eclipse.',
      'Transação SE38 no SAP GUI.',
      'Microsoft Visual Studio 2010.',
      'Transação SE11 no SAP GUI.'
    ],
    correctAnswerIndex: 0,
    explanation: 'CDS Views e recursos modernos do S/4HANA são desenvolvidos exclusivamente no Eclipse via plugin ADT (ABAP Development Tools).',
    conceptTag: 'CDS Views',
    xpReward: 45,
  },
  {
    id: 'n5_003',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'AMDP - ABAP Managed Database Procedures',
    question: 'Qual interface marcadora deve ser implementada por uma classe ABAP para permitir a escrita de métodos AMDP em SQLScript nativo do HANA?',
    options: [
      'IF_AMDP_MARKER_HDB',
      'IF_HANA_SQL_NATIVE',
      'IF_DATABASE_PROCEDURE',
      'IF_S4HANA_RUNNER'
    ],
    correctAnswerIndex: 0,
    explanation: 'A interface IF_AMDP_MARKER_HDB indica ao compilador ABAP que a classe gerencia procedimentos de banco de dados executados no motor SAP HANA.',
    conceptTag: 'AMDP e SQLScript',
    xpReward: 50,
  },
  {
    id: 'n5_004',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'ABAP RESTful Application Programming Model (RAP)',
    question: 'No modelo ABAP RAP, qual artefato define o comportamento transacional (operações Create, Update, Delete, Actions e Locks) de uma entidade?',
    options: [
      'Behavior Definition (BDEF).',
      'Interface View (ZI_).',
      'Service Definition (SRVD).',
      'Data Definition (DDLS).'
    ],
    correctAnswerIndex: 0,
    explanation: 'A Behavior Definition (BDEF) especifica as capacidades transacionais (CUD, validações, determinações, autorizações) que o motor RAP executará.',
    conceptTag: 'ABAP RAP & Fiori',
    xpReward: 55,
  },
  {
    id: 'n5_005',
    level: 'Nível 5',
    type: 'code_exercise',
    title: 'Desafio: Consulta Open SQL Moderna com Cláusula Escrita',
    question: 'Escreva um SELECT moderno no S/4HANA selecionando os campos matnr e maktx da tabela makt em lt_materiais escapando variáveis com @ e usando vírgulas.',
    codeSnippet: `* Escreva a query na sintaxe moderna ABAP 7.50+:
`,
    expectedCodePatterns: {
      requiredTokens: ['SELECT', 'MATNR,', 'MAKTX', 'FROM MAKT', 'INTO TABLE @DATA(LT_MATERIAIS)'],
      sampleSolution: `SELECT matnr, maktx FROM makt INTO TABLE @DATA(lt_materiais).`,
    },
    explanation: 'No ABAP moderno, campos são separados por vírgula e variáveis do host são prefixadas com @ (ex: @DATA(lt_dados)).',
    conceptTag: 'Desafio de Código',
    xpReward: 55,
  },
  {
    id: 'n5_006',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Protocolo OData no SAP Gateway',
    question: 'Qual é o formato de dados mais comumente utilizado para comunicação entre os aplicativos frontend SAP Fiori (SAPUI5) e os serviços OData do backend?',
    options: [
      'JSON (JavaScript Object Notation).',
      'Binário raw compactado.',
      'CSV com tabulações.',
      'EDIFACT bancário.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Aplicações modernas Fiori consomem serviços RESTful OData (v2 ou v4) serializados em JSON.',
    conceptTag: 'OData & SAP Gateway',
    xpReward: 45,
  },
  {
    id: 'n5_007',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Simplificações de Tabelas no S/4HANA (MATDOC e ACDOCA)',
    question: 'No SAP S/4HANA Finance, centenas de tabelas clássicas agregadas (como BSIS, BSAS, GLT0) foram unificadas no "Universal Journal". Qual é essa tabela central?',
    options: [
      'ACDOCA',
      'MATDOC',
      'BSEG_NEW',
      'FAGLFLEXT_S4'
    ],
    correctAnswerIndex: 0,
    explanation: 'A tabela ACDOCA (Universal Journal) centraliza informações contábeis, controladoria, ativos e rentabilidade em uma única tabela colunar gigantesca.',
    conceptTag: 'SAP S/4HANA & HANA',
    xpReward: 50,
  },
  {
    id: 'n5_008',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Service Binding no ABAP RAP',
    question: 'Para que serve um Service Binding no desenvolvimento de APIs e aplicações Fiori no modelo RAP?',
    options: [
      'Para vincular a Service Definition a um protocolo de comunicação específico (ex: OData V4 - UI ou OData V4 - Web API) e publicar o serviço para teste.',
      'Para reiniciar os nós de cluster da aplicação.',
      'Para traduzir labels para o alemão.',
      'Para compilar o código em C++.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O Service Binding conecta a definição semântica do serviço ao protocolo de transporte (OData V2/V4) e provê a ferramenta Fiori Elements Preview.',
    conceptTag: 'ABAP RAP & Fiori',
    xpReward: 50,
  },
  {
    id: 'n5_009',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'CDS Associations vs SQL JOINS',
    question: 'Qual é a grande vantagem arquitetural de definir associações (ASSOCIATION [0..*] TO ...) em uma CDS View em vez de INNER/LEFT JOINs físicos obrigatórios?',
    options: [
      'Associações são "lazy": o JOIN no banco de dados só é efetivamente executado se a consulta consumidora requisitar campos da entidade associada.',
      'Associações não consomem licença da SAP.',
      'Elas impedem consultas concorrentes.',
      'Elas rodam apenas no SAP GUI.'
    ],
    correctAnswerIndex: 0,
    explanation: 'As associações do CDS representam relações semânticas entre entidades sob demanda ("on-demand joins"), evitando custo de join se os campos não forem selecionados.',
    conceptTag: 'CDS Views',
    xpReward: 55,
  },
  {
    id: 'n5_010',
    level: 'Nível 5',
    type: 'multiple_choice',
    title: 'Determinations e Validations no RAP',
    question: 'Em uma Behavior Definition (BDEF) do RAP, quando é disparada uma DETERMINATION?',
    options: [
      'Automaticamente pelo framework RAP quando certos campos são modificados ou na criação do registro, para calcular valores derivados (ex: calcular total ou gerar UUID).',
      'Apenas quando o usuário clica com o botão direito no mouse.',
      'Exclusivamente em caso de queda de energia no data center.',
      'Sempre antes da validação de senha no SAP GUI.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Determinations realizam cálculos derivados e preenchimentos automáticos do modelo de negócios em momentos específicos do ciclo de vida transacional.',
    conceptTag: 'ABAP RAP & Fiori',
    xpReward: 55,
  }
];
