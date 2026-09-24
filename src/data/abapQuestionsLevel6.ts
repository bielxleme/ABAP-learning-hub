import { QuizQuestion } from '../types';

// Banco de questões de alta qualidade para NÍVEL 6: Formulários, Spool e Internacionalização
// Foco em conceitos teóricos, arquitetura e chamadas de código sem depender de ferramentas gráficas do SAP GUI
export const ABAP_QUESTIONS_LEVEL_6: QuizQuestion[] = [
  {
    id: 'n6_001',
    level: 'Nível 6',
    type: 'theory',
    title: 'Smart Forms: Obtenção do Módulo de Função Gerado',
    question: 'Como o programa chamador (driver program) descobre dinamicamente o nome do módulo de função gerado pelo SAP para um Smart Form?',
    options: [
      'Executando uma query na tabela TFDIR buscando pelo nome do formulário.',
      'Chamando o módulo de função padrão SSF_FUNCTION_MODULE_NAME passando o nome do Smart Form.',
      'O nome é sempre fixo no formato CALL FUNCTION z_smartform_name.',
      'Lendo o parâmetro de memória SMARTFORM_FM na transação SMARTFORMS.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ao ativar um Smart Form, o SAP gera um módulo de função interno (iniciado por /1BCDWB/SF...). O driver program deve obrigatoriamente chamar a função padrão SSF_FUNCTION_MODULE_NAME para obter essa string antes de executá-la.',
    conceptTag: 'Smart Forms',
    xpReward: 35,
  },
  {
    id: 'n6_002',
    level: 'Nível 6',
    type: 'multiple_choice',
    title: 'Smart Forms: Tipo de Janela com Quebra de Página Automática',
    question: 'Em um Smart Form, qual tipo de janela é capaz de quebrar páginas automaticamente quando a tabela de itens excede o espaço físico da folha?',
    options: [
      'Janela Secundária (SECONDARY)',
      'Janela Principal (MAIN)',
      'Janela Final (FINAL)',
      'Janela de Cabeçalho (COPIES)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Apenas a janela do tipo MAIN (Janela Principal) possui a capacidade nativa de fluxo contínuo de dados e quebra dinâmica de páginas para itens repetidos em faturas ou pedidos.',
    conceptTag: 'Smart Forms',
    xpReward: 35,
  },
  {
    id: 'n6_003',
    level: 'Nível 6',
    type: 'theory',
    title: 'SAPscript: Ciclo de Vida e Drivers de Impressão',
    question: 'Qual é a sequência canônica de funções ABAP utilizada para controlar a sessão de impressão de um formulário SAPscript clássico?',
    options: [
      'START_FORM -> PRINT_FORM -> END_FORM',
      'OPEN_FORM -> WRITE_FORM -> CLOSE_FORM',
      'SSF_OPEN -> SSF_WRITE -> SSF_CLOSE',
      'PRINT_SPOOL_OPEN -> PRINT_LINE -> PRINT_SPOOL_CLOSE'
    ],
    correctAnswerIndex: 1,
    explanation: 'Em relatórios de impressão SAPscript clássicos, o ciclo de vida do spool é iniciado com OPEN_FORM, o conteúdo é alimentado via WRITE_FORM (chamando elementos de texto /E) e finalizado com CLOSE_FORM.',
    conceptTag: 'SAPscript',
    xpReward: 35,
  },
  {
    id: 'n6_004',
    level: 'Nível 6',
    type: 'multiple_choice',
    title: 'SAPscript: Indicador de Linha de Comando',
    question: 'No editor clássico de formulários SAPscript, qual indicador na coluna de formato (Tag Column) indica uma linha de comando executável (como comandos IF, NEW-PAGE ou INCLUDE)?',
    options: [
      '* (asterisco)',
      '/: (barra e dois pontos)',
      '/E (barra e letra E)',
      '= (sinal de igual)'
    ],
    correctAnswerIndex: 1,
    explanation: 'A tag /: sinaliza linhas de comando SAPscript (ex.: /: NEW-PAGE, /: IF &EKKO-BSART& = \'NB\'). Já o /E define um elemento de texto acionado pelo driver program.',
    conceptTag: 'SAPscript',
    xpReward: 30,
  },
  {
    id: 'n6_005',
    level: 'Nível 6',
    type: 'theory',
    title: 'Internacionalização: Transação de Tradução Oficial',
    question: 'Qual é a transação central do SAP NetWeaver utilizada para traduzir textos de telas, títulos de relatórios, Text Symbols, mensagens e Smart Forms para outros idiomas?',
    options: [
      'SE38',
      'SE91',
      'SE63',
      'ST05'
    ],
    correctAnswerIndex: 2,
    explanation: 'A transação SE63 é o ambiente de tradução central do SAP NetWeaver, permitindo traduzir todos os objetos de texto ABAP do idioma de desenvolvimento (ex.: PT ou DE) para inglês ou outros idiomas.',
    conceptTag: 'Tradução SE63',
    xpReward: 30,
  },
  {
    id: 'n6_006',
    level: 'Nível 6',
    type: 'multiple_choice',
    title: 'Clean ABAP: Hardcoded Strings vs Text Symbols',
    question: 'Em conformidade com as diretrizes Clean ABAP e internacionalização, por que comandos como WRITE: \'Total de Vendas\' são reprovados pelo Code Inspector (SCI)?',
    options: [
      'Porque textos entre aspas ocupam o dobro de memória RAM no Application Server.',
      'Porque são strings hardcoded que não podem ser traduzidas na SE63 para outros idiomas pelo cliente.',
      'Porque a palavra reservada WRITE só aceita variáveis numéricas.',
      'Porque textos em português causam crash em sistemas S/4HANA instalados no exterior.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Textos literais hardcoded impossibilitam a tradução do sistema. O padrão correto é utilizar Text Symbols como TEXT-001 ou com fallback TEXT-001(\'Total de Vendas\').',
    conceptTag: 'Internacionalização',
    xpReward: 35,
  },
  {
    id: 'n6_007',
    level: 'Nível 6',
    type: 'theory',
    title: 'Adobe Document Services (ADS): Arquitetura e Contexto',
    question: 'Qual componente é responsável pela separação entre a Interface de Dados (ABAP) e o Layout Visual (XFA/XML) nos formulários Adobe Forms (PDF)?',
    options: [
      'O módulo de função SSF_FUNCTION_MODULE_NAME.',
      'A Interface (onde são declarados dados e código de seleção) e o Contexto (onde os nós são vinculados ao layout).',
      'O dicionário de dados SE11 de forma automática sem contexto intermediário.',
      'O Gateway OData /IWFND/.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Nos Adobe Forms (transação SFP), o formulário é desacoplado em duas camadas: a Interface (declaração de dados de entrada/saída) e o Contexto (mapeamento hierárquico dos campos que estarão disponíveis no Adobe LiveCycle Designer).',
    conceptTag: 'Adobe Forms',
    xpReward: 40,
  },
  {
    id: 'n6_008',
    level: 'Nível 6',
    type: 'multiple_choice',
    title: 'Spool SAP: Transações de Monitoramento',
    question: 'Quais transações são utilizadas no SAP para inspecionar ordens de spool geradas, visualizar prévias de impressão e checar erros de saída de impressora?',
    options: [
      'SP01 e SP02',
      'SM50 e SM66',
      'ST22 e SM21',
      'SE16N e SQVI'
    ],
    correctAnswerIndex: 0,
    explanation: 'A SP01 permite consultar todas as ordens de spool do sistema (com filtros por usuário, data e impressora), e a SP02 exibe diretamente as próprias ordens de spool do usuário atual.',
    conceptTag: 'Spool & Impressão',
    xpReward: 30,
  },
  {
    id: 'n6_009',
    level: 'Nível 6',
    type: 'theory',
    title: 'Smart Forms: Supressão de Diálogo de Impressão',
    question: 'Para emitir um Smart Form silenciosamente direto para PDF ou e-mail sem abrir a janela de diálogo de impressora para o usuário, qual parâmetro de controle deve ser modificado?',
    options: [
      'Passar sy-subrc = 4 antes do CALL FUNCTION.',
      'Configurar a estrutura de parâmetros de controle (ex: control_parameters-no_dialog = \'X\').',
      'Utilizar o comando LEAVE TO TRANSACTION \'SP01\'.',
      'Definir a impressora como DUMMY no arquivo saplogon.ini.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A estrutura padrão SSFCTRLOP (passada no parâmetro CONTROL_PARAMETERS do Smart Form) possui os campos NO_DIALOG = \'X\' e GETOTF = \'X\' para suprimir janelas e gerar dados OTF brutos para PDF.',
    conceptTag: 'Smart Forms',
    xpReward: 35,
  },
  {
    id: 'n6_010',
    level: 'Nível 6',
    type: 'theory',
    title: 'Tradução de Mensagens da SE91',
    question: 'Ao criar mensagens na classe de mensagens SE91, como é garantida a exibição correta da mensagem no idioma do usuário logado (sy-langu)?',
    options: [
      'Criando classes de mensagens separadas para cada idioma (ex.: ZMSG_PT e ZMSG_EN).',
      'Mantendo a mesma classe e identificador na SE91 e cadastrando o texto correspondente para cada idioma via transação SE63 ou menu Tradução da SE91.',
      'O SAP traduz automaticamente via Google Tradutor no momento do MESSAGE.',
      'O desenvolvedor deve fazer um IF sy-langu = \'E\' antes de cada comando MESSAGE.'
    ],
    correctAnswerIndex: 1,
    explanation: 'No SAP, cada mensagem de uma classe (SE91) possui traduções armazenadas nas tabelas T100/T100T. O sistema busca automaticamente o texto com base no sy-langu da sessão.',
    conceptTag: 'Tradução SE63',
    xpReward: 35,
  }
];
