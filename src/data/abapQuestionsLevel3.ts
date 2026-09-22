import { QuizQuestion } from '../types';

export const ABAP_QUESTIONS_LEVEL_3: QuizQuestion[] = [
  {
    id: 'n3_001',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Work Area vs Field-Symbol no LOOP',
    question: 'Por que o uso de "LOOP AT itab ASSIGNING FIELD-SYMBOL(<fs>)" é significativamente mais performático do que "LOOP AT itab INTO wa"?',
    options: [
      'Porque FIELD-SYMBOL aponta diretamente para o endereço de memória da linha existente sem fazer cópia byte a byte dos dados para a work area.',
      'Porque FIELD-SYMBOL bloqueia a linha no banco de dados automaticamente.',
      'Porque o comando INTO foi descontinuado no SAP NetWeaver 7.0.',
      'Porque FIELD-SYMBOL executa as instruções em threads paralelas na CPU.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Ao usar ASSIGNING FIELD-SYMBOL(<fs>), o ABAP cria um ponteiro direto para a linha da tabela na memória, eliminando o custo de cópia de bytes a cada iteração (especialmente para tabelas com milhares de linhas e muitas colunas).',
    conceptTag: 'Tabelas Internas',
    xpReward: 35,
  },
  {
    id: 'n3_002',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'READ TABLE com BINARY SEARCH',
    question: 'Qual é o pré-requisito mandatório e inegociável para utilizar a opção BINARY SEARCH no comando READ TABLE itab WITH KEY ...?',
    options: [
      'A tabela interna deve conter no máximo 100 linhas.',
      'A tabela interna deve estar rigorosamente ORDENADA (SORT itab BY ...) pelos mesmos campos informados na chave de busca.',
      'A tabela deve ser do tipo HASHED TABLE.',
      'O comando só funciona se executado dentro de uma função RFC.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A busca binária divide o conjunto ao meio a cada iteração (complexidade O(log N)). Se a tabela não estiver previamente ordenada pelos campos da busca, o algoritmo falha e retorna SY-SUBRC = 4 ou encontra o registro incorreto.',
    conceptTag: 'Tabelas Internas',
    xpReward: 35,
  },
  {
    id: 'n3_003',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Registrador de Sistema SY-TABIX',
    question: 'Em operações com tabelas internas indexadas (como dentro de um LOOP AT ou após um READ TABLE), o que a variável SY-TABIX informa?',
    options: [
      'O número total de colunas da tabela.',
      'O índice numérico (número da linha) atual da tabela interna.',
      'A quantidade de memória em megabytes utilizada.',
      'O status da conexão com a BAPI.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SY-TABIX guarda o índice (1-based) da linha atualmente lida ou processada na tabela interna.',
    conceptTag: 'Variáveis de Sistema',
    xpReward: 30,
  },
  {
    id: 'n3_004',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Instrução APPEND vs INSERT',
    question: 'Qual é a diferença funcional entre os comandos APPEND wa TO itab e INSERT wa INTO itab INDEX 1?',
    options: [
      'APPEND insere o registro sempre no final da tabela interna; INSERT permite especificar a posição exata (INDEX) onde a nova linha será posicionada.',
      'APPEND funciona apenas para bancos de dados.',
      'INSERT apaga os dados anteriores da tabela.',
      'Não há diferença técnica entre os dois.'
    ],
    correctAnswerIndex: 0,
    explanation: 'APPEND sempre acrescenta a linha ao final de tabelas Standard. INSERT permite inserir em posições arbitrárias de tabelas indexadas ou em tabelas ordenadas/hash.',
    conceptTag: 'Tabelas Internas',
    xpReward: 30,
  },
  {
    id: 'n3_005',
    level: 'Nível 3',
    type: 'code_exercise',
    title: 'Desafio: LOOP AT com FIELD-SYMBOL e Verificação',
    question: 'Escreva um LOOP na tabela lt_materiais atribuindo para o field-symbol <fs_mat> e faça um WRITE na descrição <fs_mat>-maktx.',
    codeSnippet: `* Escreva o LOOP moderno:`,
    expectedCodePatterns: {
      requiredTokens: ['LOOP AT', 'LT_MATERIAIS', 'ASSIGNING FIELD-SYMBOL(<FS_MAT>)', 'WRITE', 'ENDLOOP'],
      sampleSolution: `LOOP AT lt_materiais ASSIGNING FIELD-SYMBOL(<fs_mat>).
  WRITE: / <fs_mat>-matnr, <fs_mat>-maktx.
ENDLOOP.`,
    },
    explanation: 'Padrão recomendado pelas diretrizes oficiais do Clean ABAP moderno.',
    conceptTag: 'Desafio de Código',
    xpReward: 50,
  },
  {
    id: 'n3_006',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'BAPIs e Controle Transacional',
    question: 'Por que após chamar uma BAPI de criação de documento (ex: BAPI_SALESORDER_CREATEFROMDAT2) é obrigatório chamar o módulo BAPI_TRANSACTION_COMMIT?',
    options: [
      'Para reiniciar os servidores de impressão.',
      'Porque as BAPIs executam as operações no buffer e dependem de um commit explícito para persistir definitivamente as transações no banco de dados.',
      'Para atualizar a documentação na SE11.',
      'Para fazer logout da sessão do usuário.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ao contrário de transações de tela manuais, BAPIs seguem o princípio de desacoplamento transacional: só gravam no banco se o chamador disparar BAPI_TRANSACTION_COMMIT (ou descartam com ROLLBACK em caso de erro).',
    conceptTag: 'BAPIs e Integrações',
    xpReward: 40,
  },
  {
    id: 'n3_007',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Estrutura BAPIRET2 de Retorno',
    question: 'Em uma chamada de BAPI, qual campo da tabela de retorno (BAPIRET2) deve ser inspecionado para determinar se ocorreu um erro impeditivo?',
    options: [
      'Campo TYPE = "E" (Erro) ou TYPE = "A" (Abend).',
      'Campo ROW = 999.',
      'Campo NUMBER = 000.',
      'Campo LOG_MSG = "FAIL".'
    ],
    correctAnswerIndex: 0,
    explanation: 'No padrão BAPIRET2 da SAP, os tipos de mensagem são S (Sucesso), I (Informação), W (Aviso/Warning), E (Erro) e A (Abend/Interrupção). Erros críticos são representados por E ou A.',
    conceptTag: 'BAPIs e Integrações',
    xpReward: 35,
  },
  {
    id: 'n3_008',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Tabela do Tipo HASHED TABLE',
    question: 'Qual é a principal vantagem de performance de uma HASHED TABLE em relação a uma STANDARD TABLE?',
    options: [
      'A busca por chave única possui tempo constante O(1), independentemente de a tabela ter 10 linhas ou 1 milhão de linhas.',
      'Ela ocupa 90% menos memória RAM.',
      'Ela grava os dados diretamente em disco SSD.',
      'Permite índices numéricos negativos.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Hashed tables usam algoritmo de espalhamento (hash algorithm). O acesso por chave única (WITH TABLE KEY) é O(1) e não depende do volume de dados.',
    conceptTag: 'Tabelas Internas',
    xpReward: 40,
  },
  {
    id: 'n3_009',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Comando COLLECT vs INSERT',
    question: 'Para que serve a instrução COLLECT wa INTO itab em ABAP?',
    options: [
      'Para enviar e-mails em lote.',
      'Para somar campos numéricos automaticamente se a chave alfanumérica já existir na tabela interna, ou inserir a nova linha caso não exista.',
      'Para excluir linhas duplicadas sem aviso.',
      'Para compactar a tabela em formato ZIP.'
    ],
    correctAnswerIndex: 1,
    explanation: 'COLLECT verifica se já existe uma linha com os mesmos campos-chave não numéricos. Se existir, ele soma os campos numéricos; se não, insere.',
    conceptTag: 'Tabelas Internas',
    xpReward: 35,
  },
  {
    id: 'n3_010',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Eliminando Duplicatas: DELETE ADJACENT DUPLICATES',
    question: 'Por que antes de executar DELETE ADJACENT DUPLICATES FROM itab COMPARING f1 f2 é indispensável rodar um SORT itab BY f1 f2?',
    options: [
      'Porque a instrução só compara linhas adjacentes (vizinhas consecutivas). Se as linhas duplicadas não estiverem juntas, elas não serão eliminadas.',
      'Porque o compilador ABAP bloqueia o comando sem SORT.',
      'Porque o SORT converte os campos para maiúsculo.',
      'Porque o banco de dados exige índice secundário.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Como o nome indica (ADJACENT), o comando só compara a linha N com a linha N+1. Se duplicatas estiverem espalhadas em posições diferentes, apenas o SORT as coloca lado a lado.',
    conceptTag: 'Tabelas Internas',
    xpReward: 35,
  },
  {
    id: 'n3_011',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Table Expressions (ABAP 7.40+)',
    question: 'Na sintaxe ABAP 7.40+, qual expressão substitui o comando tradicional "READ TABLE itab INTO wa WITH KEY id = 10."?',
    options: [
      'wa = itab[ id = 10 ].',
      'wa = READ( itab, id = 10 ).',
      'wa = itab.find( id => 10 ).',
      'wa = itab->get( 10 ).'
    ],
    correctAnswerIndex: 0,
    explanation: 'Table expressions utilizam colchetes: wa = itab[ id = 10 ]. Caso o registro não seja encontrado, é disparada a exceção cx_sy_itab_line_not_found ou pode-se usar VALUE #( itab[ id = 10 ] OPTIONAL ).',
    conceptTag: 'Clean ABAP 7.40+',
    xpReward: 40,
  },
  {
    id: 'n3_012',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Operador CORRESPONDING #( )',
    question: 'O que o construtor moderno "ls_destino = CORRESPONDING #( ls_origem )." realiza?',
    options: [
      'Copia automaticamente apenas os campos que possuem nomes e tipos compatíveis entre as duas estruturas.',
      'Copia todos os bytes cegamente pela ordem das colunas.',
      'Compara se duas estruturas são idênticas retornando booleano.',
      'Exclui os campos não correspondentes da estrutura de origem.'
    ],
    correctAnswerIndex: 0,
    explanation: 'CORRESPONDING faz o mapeamento por nome de campos em tempo de compilação/execução, substituindo com muito mais elegância o antigo MOVE-CORRESPONDING.',
    conceptTag: 'Clean ABAP 7.40+',
    xpReward: 35,
  },
  {
    id: 'n3_013',
    level: 'Nível 3',
    type: 'code_exercise',
    title: 'Desafio: Table Expression com OPTIONAL',
    question: 'Escreva a atribuição moderna de wa a partir da tabela lt_clientes onde kunnr = "0000100000", usando OPTIONAL para não disparar exceção.',
    codeSnippet: `* Preencha a linha com a expressão moderna:
wa = `,
    expectedCodePatterns: {
      requiredTokens: ['VALUE #(', 'LT_CLIENTES[', 'KUNNR', 'OPTIONAL'],
      sampleSolution: `wa = VALUE #( lt_clientes[ kunnr = '0000100000' ] OPTIONAL ).`,
    },
    explanation: 'Padrão recomendado no Clean ABAP: o OPTIONAL evita a necessidade de TRY / CATCH caso o registro não exista.',
    conceptTag: 'Desafio de Código',
    xpReward: 50,
  },
  {
    id: 'n3_014',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Transação ST05 - SQL Trace',
    question: 'Para que serve primordialmente a transação ST05 na rotina de um desenvolvedor ABAP?',
    options: [
      'Para rastrear e analisar as declarações SQL enviadas ao banco de dados, avaliando índices utilizados, tempo de execução e linhas lidas.',
      'Para criar ordens de transporte CTS.',
      'Para cadastrar novos usuários no ambiente SAP.',
      'Para desenhar telas com o Screen Painter.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A ST05 é a principal ferramenta de rastreamento de SQL, RFCs e Enqueues no SAP NetWeaver, essencial para diagnosticar gargalos de performance.',
    conceptTag: 'Performance e Análise',
    xpReward: 40,
  },
  {
    id: 'n3_015',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Transação SAT (Runtime Analysis)',
    question: 'Qual é o objetivo da transação SAT (sucessora da SE30)?',
    options: [
      'Executar medição detalhada do tempo de execução de um programa, discriminando o tempo gasto no servidor de aplicação (ABAP) vs servidor de banco (DB).',
      'Configurar roteamento de e-mails no SAPconnect.',
      'Criar domínios na SE11.',
      'Ativar o debugger remoto.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A SAT faz a análise de tempo de execução com gráficos de árvore de chamadas (hit lists), indicando exatamente quais métodos, forms ou queries consomem CPU.',
    conceptTag: 'Performance e Análise',
    xpReward: 40,
  },
  {
    id: 'n3_016',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Exibição de Relatórios com CL_SALV_TABLE',
    question: 'Qual é o método estático padrão da classe CL_SALV_TABLE para gerar uma instância rápida de ALV Grid?',
    options: [
      'cl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo_alv) CHANGING t_table = lt_dados ).',
      'cl_salv_table=>create_new_grid( ).',
      'cl_salv_table=>display_popup( ).',
      'cl_salv_table=>init_session( ).'
    ],
    correctAnswerIndex: 0,
    explanation: 'CL_SALV_TABLE=>FACTORY cria o objeto ALV de forma simples e orientada a objetos, necessitando apenas chamar lo_alv->display() em seguida.',
    conceptTag: 'ALV e Relatórios',
    xpReward: 40,
  },
  {
    id: 'n3_017',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Construção Condicional COND #( )',
    question: 'Em ABAP 7.40+, o que faz o operador "COND #( WHEN status = "P" THEN "Pago" ELSE "Pendente" )"?',
    options: [
      'Atua como uma expressão ternária/condicional em linha, retornando o valor correspondente à condição verdadeira.',
      'Cria uma tela de diálogo no SAP GUI.',
      'Envia uma notificação push.',
      'Verifica permissões de autorização do usuário.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O operador de construção COND permite avaliar expressões lógicas em linha sem a necessidade de blocos imperativos IF / ELSE.',
    conceptTag: 'Clean ABAP 7.40+',
    xpReward: 35,
  },
  {
    id: 'n3_018',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'Operador FOR ... IN em Tabelas',
    question: 'Para que serve a expressão "VALUE #( FOR ls IN lt_origem ( ls-campo ) )"?',
    options: [
      'Para iterar e mapear/transformar dados de uma tabela interna para outra em uma única instrução funcional concisa.',
      'Para apagar todas as variáveis da memória.',
      'Para pausar o processamento por N segundos.',
      'Para disparar um job em segundo plano (SM36).'
    ],
    correctAnswerIndex: 0,
    explanation: 'O operador FOR em construtores de tabela substitui loops manuais com APPEND, permitindo mapeamentos e projeções elegantes em linha.',
    conceptTag: 'Clean ABAP 7.40+',
    xpReward: 40,
  },
  {
    id: 'n3_019',
    level: 'Nível 3',
    type: 'multiple_choice',
    title: 'ATC - ABAP Test Cockpit',
    question: 'Qual é o papel do ABAP Test Cockpit (transação ATC) na governança de desenvolvimento SAP?',
    options: [
      'Verificar a qualidade estática do código, conferindo regras de sintaxe, performance, segurança e aderência aos padrões da empresa.',
      'Gerenciar a folha de pagamento de consultores.',
      'Monitorar a temperatura física dos servidores de aplicação.',
      'Emitir notas fiscais eletrônicas de teste.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O ATC é a ferramenta padrão corporativa da SAP para auditoria de código, garantindo que boas práticas e verificações de segurança sejam cumpridas antes da liberação de transports.',
    conceptTag: 'Qualidade e Governança',
    xpReward: 35,
  },
  {
    id: 'n3_020',
    level: 'Nível 3',
    type: 'code_exercise',
    title: 'Desafio: Exibição Rápida com CL_SALV_TABLE',
    question: 'Complete o código para instanciar a factory da classe cl_salv_table passando lt_relatorio e chamando o método display.',
    codeSnippet: `cl_salv_table=>factory(
  IMPORTING
    r_salv_table = DATA(lo_alv)
  CHANGING
    t_table      = lt_relatorio ).

* Chame o método de exibição:
`,
    expectedCodePatterns: {
      requiredTokens: ['LO_ALV->DISPLAY( )'],
      sampleSolution: `lo_alv->display( ).`,
    },
    explanation: 'O método DISPLAY() da instância renderiza a grade ALV com ordenação, filtros e exportação Excel nativos.',
    conceptTag: 'Desafio de Código',
    xpReward: 45,
  }
];
