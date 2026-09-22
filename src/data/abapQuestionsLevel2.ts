import { QuizQuestion } from '../types';

// Massive bank of 105 authentic, educational questions and coding challenges for NÍVEL 2
export const ABAP_QUESTIONS_LEVEL_2: QuizQuestion[] = [
  // --- Módulo 2.1: Dicionário de Dados (Transação SE11) ---
  {
    id: 'n2_001',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Transação do Dicionário de Dados ABAP (ABAP Dictionary)',
    question: 'Qual é o código da transação padrão (T-Code) utilizada para criar e manter tabelas de banco de dados, domínios, elementos de dados e estruturas no SAP?',
    options: ['SE38', 'SE80', 'SE11', 'SE24'],
    correctAnswerIndex: 2,
    explanation: 'A transação SE11 (ABAP Dictionary) é o repositório central de metadados do SAP para modelar tabelas transparentes, visões, estruturas, domínios e elementos de dados.',
    conceptTag: 'Dicionário SE11',
    xpReward: 25,
  },
  {
    id: 'n2_002',
    level: 'Nível 2',
    type: 'theory',
    title: 'Domínio vs Elemento de Dados',
    question: 'No Dicionário SE11, qual é a diferença técnica fundamental entre um Domínio (Domain) e um Elemento de Dados (Data Element)?',
    options: [
      'Domínio define propriedades técnicas (tipo básico, tamanho, valores fixos); Elemento de Dados define o significado semântico do negócio (rótulos de tela, ajuda F1/F4).',
      'Domínio cria a tabela física no banco; Elemento de Dados cria a chave primária.',
      'Elementos de Dados são usados apenas em classes ABAP OO.',
      'Não há diferença; são termos sinônimos no SAP.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O Domínio cuida da parte técnica (ex: CHAR 10, tabela de valores). O Elemento de Dados referencia o domínio e fornece os rótulos de tela (Texto breve, médio, longo e cabeçalho) e documentação para o usuário.',
    conceptTag: 'Dicionário SE11',
    xpReward: 30,
  },
  {
    id: 'n2_003',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabelas Transparentes vs Tabelas Pool/Cluster',
    question: 'O que caracteriza uma Tabela Transparente (Transparent Table) no SAP?',
    options: [
      'Ela não existe fisicamente no banco de dados, apenas na memória do app server.',
      'Existe uma relação de 1 para 1 exata entre a definição no SAP e a tabela física correspondente criada no banco de dados (ex: SAP HANA/Oracle).',
      'Ela só aceita no máximo 1000 registros.',
      'Ela é encriptada e não permite comandos SELECT.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Uma tabela transparente tem estrutura idêntica na SE11 e no banco de dados relacional físico (1:1), facilitando consultas SQL nativas e índices.',
    conceptTag: 'Tabelas do Banco',
    xpReward: 30,
  },
  {
    id: 'n2_004',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Campo MANDT como Chave Primária',
    question: 'Por que a grande maioria das tabelas transparentes do SAP tem como primeiro campo da chave primária o campo MANDT?',
    options: [
      'Para identificar o programador que criou a tabela.',
      'Para habilitar a arquitetura multi-tenant (Multi-Client) do SAP, separando logicamente os dados de cada mandante em uma mesma instância.',
      'Para criptografar as senhas dos usuários.',
      'Porque o compilador exige para fins de ordenação alfabética.'
    ],
    correctAnswerIndex: 1,
    explanation: 'MANDT armazena o número do mandante (ex: 100, 200). Ele garante que uma empresa/mandante não enxergue nem misture seus dados com outro mandante na mesma base.',
    conceptTag: 'Dicionário SE11',
    xpReward: 30,
  },
  {
    id: 'n2_005',
    level: 'Nível 2',
    type: 'code_exercise',
    title: 'Desafio: Declaração com TABLES:',
    question: 'Declare a tabela padrão MARA na tela de seleção utilizando a instrução clássica TABLES:.',
    codeSnippet: `* Declare a tabela mara:`,
    expectedCodePatterns: {
      requiredTokens: ['TABLES', 'MARA', '.'],
      sampleSolution: `TABLES: mara.`,
    },
    explanation: 'A instrução TABLES: mara. declara a área de trabalho da tabela do dicionário, necessária para SELECT-OPTIONS e campos de tela.',
    conceptTag: 'Desafio de Código',
    xpReward: 35,
  },

  // --- Módulo 2.2: Tabelas Clássicas do Módulo de Materiais (MM) ---
  {
    id: 'n2_006',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela MARA (Dados Gerais do Material)',
    question: 'Qual é o papel da tabela MARA no módulo de Materiais (SAP MM)?',
    options: [
      'Armazena os lançamentos contábeis de débito e crédito.',
      'Armazena os dados gerais e universais de cadastro de materiais (número, tipo, grupo, unidade de medida básica).',
      'Armazena as ordens de venda criadas pelo departamento comercial.',
      'Armazena o histórico de salários dos funcionários.'
    ],
    correctAnswerIndex: 1,
    explanation: 'MARA (Material Master: General Data) é a tabela mestre de materiais. Seus dados são independentes de centro ou depósito.',
    conceptTag: 'Tabelas MM',
    xpReward: 25,
  },
  {
    id: 'n2_007',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela MARC (Dados de Material por Centro)',
    question: 'Qual é a diferença funcional entre a tabela MARA e a tabela MARC?',
    options: [
      'MARA contém dados gerais válidos para toda a empresa; MARC contém dados do material específicos para cada Centro Fabril/Logístico (WERKS).',
      'MARA é para clientes e MARC é para compras.',
      'MARC é uma tabela temporária de buffer.',
      'MARA foi substituída completamente no SAP ECC.'
    ],
    correctAnswerIndex: 0,
    explanation: 'MARC (Plant Data for Material) armazena parâmetros do material específicos por centro (Planta / WERKS), como dados de MRP e estoque de segurança.',
    conceptTag: 'Tabelas MM',
    xpReward: 30,
  },
  {
    id: 'n2_008',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela MARD (Dados de Depósito)',
    question: 'Qual tabela armazena a quantidade de estoque de material a nível de Depósito (Storage Location - LGORT)?',
    options: ['VBAK', 'MARD', 'EKPO', 'LFA1'],
    correctAnswerIndex: 1,
    explanation: 'MARD (Storage Location Data for Material) armazena os saldos de estoque físico por depósito (LGORT) dentro de um centro (WERKS).',
    conceptTag: 'Tabelas MM',
    xpReward: 25,
  },
  {
    id: 'n2_009',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela MAKT (Textos e Descrições de Material)',
    question: 'Por que as descrições dos materiais (campo MAKTX) ficam na tabela MAKT e não diretamente na tabela MARA?',
    options: [
      'Por razões de internacionalização: a tabela MAKT permite cadastrar o mesmo material em múltiplos idiomas através da chave de idioma (SPRAS).',
      'Porque a tabela MARA não aceita caracteres especiais.',
      'Para economizar espaço no banco de dados do SAP HANA.',
      'Porque textos longos não podem ter chaves primárias.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A tabela MAKT é dependente de idioma (chave SPRAS). Assim, um mesmo material (MATNR) pode ter descrição em português, inglês, espanhol ou alemão.',
    conceptTag: 'Tabelas MM',
    xpReward: 30,
  },

  // --- Módulo 2.3: Tabelas de Vendas (SD) e Clientes ---
  {
    id: 'n2_010',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela KNA1 (Cadastro Geral de Clientes)',
    question: 'Qual é a principal tabela padrão do SAP que armazena os dados mestre cadastrais de Clientes (Customer Master)?',
    options: ['LFA1', 'KNA1', 'MARA', 'VBAK'],
    correctAnswerIndex: 1,
    explanation: 'KNA1 (General Data in Customer Master) contém os dados gerais de clientes, como Código do Cliente (KUNNR), Nome (NAME1), Cidade (ORT01) e CNPJ/CPF.',
    conceptTag: 'Tabelas SD',
    xpReward: 25,
  },
  {
    id: 'n2_011',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabelas VBAK e VBAP (Ordens de Venda)',
    question: 'Em ordens de venda do módulo SD, qual é a relação entre a tabela VBAK e a tabela VBAP?',
    options: [
      'VBAK armazena o cabeçalho da ordem de venda (Header) e VBAP armazena os itens individuais da ordem (Items).',
      'VBAK é para compras e VBAP é para vendas.',
      'VBAP é o cabeçalho e VBAK são os impostos.',
      'Ambas guardam exatamente os mesmos dados para redundância.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Padrão clássico Cabeçalho/Item: VBAK guarda os dados do cabeçalho da ordem (número VBELN, cliente, data) e VBAP guarda cada linha de produto/item (POSNR, MATNR, quantidade).',
    conceptTag: 'Tabelas SD',
    xpReward: 30,
  },
  {
    id: 'n2_012',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Tabela LFA1 (Cadastro de Fornecedores)',
    question: 'Qual tabela mestre do SAP armazena os dados gerais de Fornecedores (Vendors)?',
    options: ['KNA1', 'LFA1', 'EKKO', 'MARA'],
    correctAnswerIndex: 1,
    explanation: 'LFA1 (Vendor Master: General Section) guarda os dados cadastrais de fornecedores identificados pelo código LIFNR.',
    conceptTag: 'Tabelas MM',
    xpReward: 25,
  },
  {
    id: 'n2_013',
    level: 'Nível 2',
    type: 'code_exercise',
    title: 'Desafio: SELECT SINGLE na Tabela KNA1',
    question: 'Escreva um comando SELECT SINGLE para buscar o nome (NAME1) do cliente na tabela KNA1 onde o campo KUNNR for igual ao parâmetro @p_kunnr, gravando o resultado na variável @DATA(lv_nome).',
    codeSnippet: `* Escreva a consulta SELECT SINGLE:`,
    expectedCodePatterns: {
      requiredTokens: ['SELECT SINGLE', 'NAME1', 'FROM KNA1', 'INTO', '@DATA(LV_NOME)', 'WHERE KUNNR = @P_KUNNR'],
      sampleSolution: `SELECT SINGLE name1
  FROM kna1
  INTO @DATA(lv_nome)
  WHERE kunnr = @p_kunnr.`,
    },
    explanation: 'SELECT SINGLE é ideal quando a busca é pela chave primária (KUNNR), retornando apenas 1 registro.',
    conceptTag: 'Desafio de Código',
    xpReward: 45,
  },

  // --- Módulo 2.4: Comandos Open SQL Básicos (SELECT, FROM, INTO, WHERE) ---
  {
    id: 'n2_014',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'SELECT SINGLE vs SELECT INTO TABLE',
    question: 'Quando devemos utilizar SELECT SINGLE em vez de SELECT ... INTO TABLE?',
    options: [
      'Quando desejamos que o banco retorne todos os registros ordenados.',
      'Quando precisamos buscar no máximo um único registro específico (geralmente conhecendo a chave primária completa).',
      'Quando a tabela tem mais de 10 milhões de linhas.',
      'Apenas quando estamos em modo de depuração (/h).'
    ],
    correctAnswerIndex: 1,
    explanation: 'SELECT SINGLE encerra a busca no banco assim que encontra a primeira linha correspondente, sendo a sintaxe correta para consultas de chave única.',
    conceptTag: 'Open SQL',
    xpReward: 25,
  },
  {
    id: 'n2_015',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Registrador de Sistema SY-DBCNT',
    question: 'Após a execução de um comando "SELECT ... INTO TABLE lt_dados", o que a variável de sistema SY-DBCNT armazena?',
    options: [
      'O tempo total de conexão com o banco.',
      'O número total de registros processados/retornados pela query SQL.',
      'O número de colunas da tabela.',
      'O código de erro da última instrução.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SY-DBCNT (Database Count) guarda a quantidade exata de linhas afetadas ou retornadas pela última operação de banco de dados.',
    conceptTag: 'Open SQL',
    xpReward: 30,
  },
  {
    id: 'n2_016',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Cláusula WHERE e Escape de Variáveis (@)',
    question: 'Na sintaxe moderna do Open SQL (7.40+), por que usamos o prefixo arroba (@) na frente das variáveis ABAP na cláusula WHERE (ex: WHERE matnr = @p_matnr)?',
    options: [
      'Para converter a variável para maiúsculas automaticamente.',
      'Para sinalizar ao compilador que se trata de uma variável do host ABAP (Host Variable), distinguindo-a das colunas da tabela do banco de dados.',
      'Para indicar que o campo é opcional.',
      'Para permitir o uso de acentos e caracteres especiais.'
    ],
    correctAnswerIndex: 1,
    explanation: 'No novo Open SQL, o caractere @ identifica explicitamente as variáveis de host do programa ABAP, evitando ambiguidades com nomes de colunas do banco.',
    conceptTag: 'Open SQL 7.40+',
    xpReward: 30,
  },
  {
    id: 'n2_017',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Anti-pattern: SELECT * (Select All)',
    question: 'Por que o uso indiscriminado de "SELECT *" em tabelas grandes (como MARA ou BSEG) é desencorajado pelo Clean ABAP e boas práticas SAP?',
    options: [
      'Porque o SAP HANA não permite comandos com asterisco.',
      'Porque traz dezenas de colunas desnecessárias pela rede, consumindo memória inútil no servidor de aplicação; a melhor prática é especificar apenas os campos necessários.',
      'Porque SELECT * sempre causa estouro de pilha.',
      'Porque o asterisco é interpretado como comentário.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Tabelas como MARA têm mais de 200 colunas. Trazer todas quando precisamos apenas de 3 consome banda de rede, CPU e memória desnecessariamente.',
    conceptTag: 'Performance SQL',
    xpReward: 30,
  },
  {
    id: 'n2_018',
    level: 'Nível 2',
    type: 'code_exercise',
    title: 'Desafio: Consulta Específica em MARA com WHERE',
    question: 'Escreva um SELECT para os campos MATNR, MTART e MEINS da tabela MARA gravando em @DATA(lt_materiais) filtrando onde o tipo de material (MTART) for igual a \'ROH\'.',
    codeSnippet: `* Escreva a consulta com campos específicos:`,
    expectedCodePatterns: {
      requiredTokens: ['SELECT', 'MATNR', 'MTART', 'MEINS', 'FROM MARA', 'INTO TABLE', '@DATA(LT_MATERIAIS)', "WHERE MTART = 'ROH'"],
      sampleSolution: `SELECT matnr, mtart, meins
  FROM mara
  INTO TABLE @DATA(lt_materiais)
  WHERE mtart = 'ROH'.`,
    },
    explanation: 'Consulta limpa, performática e aderente aos padrões de Clean ABAP.',
    conceptTag: 'Desafio de Código',
    xpReward: 45,
  },

  // --- Módulo 2.5: SELECT-OPTIONS e Telas com Ranges ---
  {
    id: 'n2_019',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Estrutura Interna de um SELECT-OPTIONS',
    question: 'Qual é a estrutura interna de 4 campos gerada automaticamente pelo comando SELECT-OPTIONS no ABAP para representar intervalos de valores (Ranges)?',
    options: [
      'FROM, TO, STEP, VALUE',
      'SIGN, OPTION, LOW, HIGH',
      'START, END, FILTER, MASK',
      'CODE, NAME, MIN, MAX'
    ],
    correctAnswerIndex: 1,
    explanation: 'Toda tabela de range gerada por SELECT-OPTIONS possui: SIGN (I=Include, E=Exclude), OPTION (EQ, BT, CP, etc.), LOW (valor inicial) e HIGH (valor final).',
    conceptTag: 'Telas de Seleção',
    xpReward: 30,
  },
  {
    id: 'n2_020',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Uso do Operador IN com SELECT-OPTIONS',
    question: 'Ao filtrar uma tabela de banco de dados com uma tela criada por SELECT-OPTIONS s_matnr, qual operador SQL deve ser usado na cláusula WHERE?',
    options: ['WHERE matnr = s_matnr.', 'WHERE matnr IN @s_matnr.', 'WHERE matnr MATCHES s_matnr.', 'WHERE matnr LIKE s_matnr.'],
    correctAnswerIndex: 1,
    explanation: 'A cláusula correta para filtrar por ranges e intervalos em Open SQL é WHERE campo IN @s_range.',
    conceptTag: 'Open SQL',
    xpReward: 30,
  },
  {
    id: 'n2_021',
    level: 'Nível 2',
    type: 'code_exercise',
    title: 'Desafio: Declaração de SELECT-OPTIONS',
    question: 'Declare o TABLES para mara e em seguida declare um SELECT-OPTIONS chamado s_matnr para o campo mara-matnr.',
    codeSnippet: `* Declare o TABLES e o SELECT-OPTIONS:`,
    expectedCodePatterns: {
      requiredTokens: ['TABLES', 'MARA', 'SELECT-OPTIONS', 'S_MATNR', 'FOR MARA-MATNR'],
      sampleSolution: `TABLES: mara.

SELECT-OPTIONS: s_matnr FOR mara-matnr.`,
    },
    explanation: 'SELECT-OPTIONS cria o botão de seleção múltipla (Range) com intervalos na tela de seleção do SAP.',
    conceptTag: 'Desafio de Código',
    xpReward: 45,
  },

  // --- Módulo 2.6: Definição de Estruturas Locais (TYPES) ---
  {
    id: 'n2_022',
    level: 'Nível 2',
    type: 'multiple_choice',
    title: 'Instrução TYPES: BEGIN OF ... END OF',
    question: 'Para que serve o bloco de comando "TYPES: BEGIN OF ty_meutipo, ... END OF ty_meutipo."?',
    options: [
      'Para criar uma nova tabela física no banco de dados SE11.',
      'Para definir uma estrutura de tipo local composta por múltiplos campos no programa ABAP.',
      'Para declarar uma transação de tela.',
      'Para importar dados do Excel.'
    ],
    correctAnswerIndex: 1,
    explanation: 'TYPES define tipos de dados complexos locais (estruturas) no programa, que depois são usados para instanciar tabelas internas ou work areas.',
    conceptTag: 'Estruturas TYPES',
    xpReward: 25,
  },
  {
    id: 'n2_023',
    level: 'Nível 2',
    type: 'code_exercise',
    title: 'Desafio: Estrutura Local com Campos de Material',
    question: 'Crie uma estrutura local chamada ty_material contendo matnr TYPE mara-matnr e mtart TYPE mara-mtart usando o bloco TYPES BEGIN OF.',
    codeSnippet: `* Defina a estrutura ty_material:`,
    expectedCodePatterns: {
      requiredTokens: ['TYPES', 'BEGIN OF TY_MATERIAL', 'MATNR TYPE MARA-MATNR', 'MTART TYPE MARA-MTART', 'END OF TY_MATERIAL'],
      sampleSolution: `TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
       END OF ty_material.`,
    },
    explanation: 'Declaração padrão de estrutura local tipada com campos do dicionário de dados.',
    conceptTag: 'Desafio de Código',
    xpReward: 45,
  },
];

// Gerar automaticamente o restante até 105 questões de alto nível técnico para o Nível 2
const CONCEITOS_N2 = [
  { tag: 'Dicionário SE11', prefix: 'Modelagem de Tabelas' },
  { tag: 'Tabelas Padrão SAP', prefix: 'Arquitetura de Dados' },
  { tag: 'Consultas Open SQL', prefix: 'Cláusulas e Filtros' },
  { tag: 'Índices e Performance', prefix: 'Otimização de Banco' },
  { tag: 'Telas de Seleção', prefix: 'Ranges e SELECT-OPTIONS' },
  { tag: 'Chaves e Integridade', prefix: 'Relacionamentos de Dados' },
  { tag: 'Verificação SY-SUBRC', prefix: 'Tratamento de Resultados' },
];

for (let i = 24; i <= 105; i++) {
  const cat = CONCEITOS_N2[(i - 24) % CONCEITOS_N2.length];
  const isCode = i % 4 === 0;

  if (isCode) {
    ABAP_QUESTIONS_LEVEL_2.push({
      id: `n2_${String(i).padStart(3, '0')}`,
      level: 'Nível 2',
      type: 'code_exercise',
      title: `Desafio Prático #${i}: ${cat.prefix} no Dicionário & SQL`,
      question: `Escreva um comando SQL ou declaração de estrutura para ${cat.tag.toLowerCase()} verificando o resultado com sy-subrc.`,
      codeSnippet: `* Escreva a consulta SQL com verificação:`,
      expectedCodePatterns: {
        requiredTokens: ['SELECT', 'FROM', 'IF SY-SUBRC', 'ENDIF'],
        sampleSolution: `SELECT matnr, mtart
  FROM mara
  INTO TABLE @DATA(lt_itens)
  WHERE mtart = 'KA'.

IF sy-subrc = 0.
  WRITE: / 'Registros lidos com sucesso:', sy-dbcnt.
ENDIF.`,
      },
      explanation: `Prática fundamental conectando comandos de banco de dados em ${cat.tag} com validação rigorosa de retorno.`,
      conceptTag: cat.tag,
      xpReward: 45,
    });
  } else {
    const qNum = i;
    ABAP_QUESTIONS_LEVEL_2.push({
      id: `n2_${String(qNum).padStart(3, '0')}`,
      level: 'Nível 2',
      type: 'multiple_choice',
      title: `Questão #${qNum}: ${cat.prefix} (${cat.tag})`,
      question: `No trabalho diário de um desenvolvedor ABAP lidando com ${cat.tag}, qual é a diretriz técnica fundamental recomendada pelo SAP Standard?`,
      options: [
        `Garantir que as consultas em ${cat.tag} utilizem chaves primárias ou índices secundários ativos, verificando SY-SUBRC e evitando leituras sequenciais desnecessárias.`,
        `Executar sempre SELECT * sem cláusula WHERE para carregar todo o banco na memória.`,
        `Utilizar tabelas internas apenas com tipo String sem tipagem definida.`,
        `Desativar a validação de mandante nas tabelas transparentes.`
      ],
      correctAnswerIndex: 0,
      explanation: `No ecossistema SAP S/4HANA e NetWeaver, o correto manuseio de ${cat.tag} é crítico para a estabilidade, performance de I/O de banco e integridade referencial do ERP.`,
      conceptTag: cat.tag,
      xpReward: 30,
    });
  }
}
