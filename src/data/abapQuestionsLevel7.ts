import { QuizQuestion } from '../types';

// Banco de questões de alta qualidade para NÍVEL 7: ABAP Orientado a Objetos Avançado & Arquitetura Corporativa
// Foco em conceitos teóricos, padrões de projeto e estruturas OO sem depender de ferramentas gráficas do SAP GUI
export const ABAP_QUESTIONS_LEVEL_7: QuizQuestion[] = [
  {
    id: 'n7_001',
    level: 'Nível 7',
    type: 'theory',
    title: 'ABAP OO: Seções de Visibilidade de Métodos e Atributos',
    question: 'Em uma classe ABAP (SE24 ou local), qual é a diferença crucial entre a seção PROTECTED e a seção PRIVATE?',
    options: [
      'Componentes PROTECTED só podem ser acessados por usuários com autorização SAP_ALL.',
      'Componentes PROTECTED são visíveis para a própria classe e todas as suas subclasses (herdeiras), enquanto PRIVATE só é visível para a classe onde foi declarado.',
      'Componentes PRIVATE são públicos dentro do pacote Z, enquanto PROTECTED são acessíveis apenas via RFC.',
      'Não há diferença técnica, são apenas convenções visuais.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A seção PROTECTED SECTION permite que subclasses herdem e acessem atributos e métodos diretamente, ao passo que a PRIVATE SECTION restringe o acesso estritamente ao escopo interno da classe definidora.',
    conceptTag: 'ABAP OO',
    xpReward: 40,
  },
  {
    id: 'n7_002',
    level: 'Nível 7',
    type: 'theory',
    title: 'Interfaces em ABAP: Polimorfismo e Desacoplamento',
    question: 'Qual é o principal objetivo arquitetural de definir uma INTERFACE em ABAP ao invés de acoplar o código diretamente a classes concretas?',
    options: [
      'Reduzir o consumo de memória RAM do banco de dados HANA.',
      'Definir um contrato público que permite múltiplas implementações polimórficas e facilita a substituição de dependências e testes unitários.',
      'Acelerar a velocidade de execução de loops FOR ALL ENTRIES.',
      'Interfaces são obrigatórias para poder utilizar o comando SELECT.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Interfaces em ABAP fornecem um protocolo ou contrato abstrato sem código. Qualquer classe que declare INTERFACES zif_... deve implementar seus métodos, permitindo polimorfismo genuíno e injeção de dependências para ABAP Unit.',
    conceptTag: 'Interfaces & Polimorfismo',
    xpReward: 40,
  },
  {
    id: 'n7_003',
    level: 'Nível 7',
    type: 'multiple_choice',
    title: 'Herança: Sobrescrita de Métodos em Subclasses',
    question: 'Qual palavra-chave deve ser utilizada na seção de definição de uma subclasse para sobrescrever o comportamento de um método herdado da superclasse?',
    options: [
      'OVERWRITE METHODS method_name.',
      'METHODS method_name REDEFINITION.',
      'REPLACE METHOD method_name.',
      'MODIFY METHOD method_name.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Para reimplementar um método de uma superclasse, a subclasse deve declarar METHODS method_name REDEFINITION na mesma seção de visibilidade (PROTECTED ou PUBLIC).',
    conceptTag: 'Herança ABAP',
    xpReward: 35,
  },
  {
    id: 'n7_004',
    level: 'Nível 7',
    type: 'theory',
    title: 'Exceções Baseadas em Classes: TRY / CATCH vs SY-SUBRC',
    question: 'Por que o tratamento de exceções com blocos TRY ... CATCH cx_... é considerado superior ao retorno clássico de códigos de erro SY-SUBRC?',
    options: [
      'Porque objetos de exceção carregam pilha de chamadas (call stack), mensagens de texto dinâmicas e forçam o tratamento ou propagação explícita sem mascarar erros silenciosos.',
      'Porque o bloco TRY faz o programa rodar em paralelo em múltiplas threads.',
      'Porque SY-SUBRC não funciona mais no SAP S/4HANA.',
      'Porque o compilador impede a criação de programas se houver variáveis numéricas.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Exceções baseadas em classe (herdeiras de CX_ROOT como CX_STATIC_CHECK e CX_NO_CHECK) fornecem rastreabilidade completa, parâmetros de contexto e impedem que fluxos com erro passem desapercebidos por checagens esquecidas de sy-subrc.',
    conceptTag: 'Exceções CX_ROOT',
    xpReward: 40,
  },
  {
    id: 'n7_005',
    level: 'Nível 7',
    type: 'multiple_choice',
    title: 'Design Pattern Singleton em ABAP',
    question: 'Para implementar o padrão Singleton clássico em ABAP (garantindo que exista apenas uma instância em memória), qual combinação de modificadores é obrigatória?',
    options: [
      'Instanciação PUBLIC e método estático create_instance sem atributos.',
      'Declaração CREATE PRIVATE na definição da classe e um método estático público (ex.: get_instance) que retorna a instância única armazenada em atributo estático.',
      'Usar a instrução CALL TRANSFORMATION na SE38.',
      'Criar uma tabela interna global na memória do usuário.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ao definir CLASS zcl_singleton DEFINITION CREATE PRIVATE, impedimos o uso de NEW ou CREATE OBJECT externamente. O acesso é feito através do método estático que gerencia a instância única.',
    conceptTag: 'Design Patterns',
    xpReward: 45,
  },
  {
    id: 'n7_006',
    level: 'Nível 7',
    type: 'theory',
    title: 'Eventos em ABAP OO: Registro de Handlers',
    question: 'Qual instrução ABAP é utilizada para registrar um método receptor (handler) para escutar eventos disparados por outra instância?',
    options: [
      'LISTEN EVENT event_name FROM source_instance.',
      'SET HANDLER lo_receiver->on_event FOR lo_sender.',
      'ATTACH EVENT event_name TO lo_receiver.',
      'REGISTER HANDLER FOR ALL EVENTS.'
    ],
    correctAnswerIndex: 1,
    explanation: 'O comando SET HANDLER ref_receiver->handler_method FOR ref_sender vincula o método tratador ao publicador do evento, implementando o padrão Observer em tempo de execução.',
    conceptTag: 'Eventos em Classes',
    xpReward: 40,
  },
  {
    id: 'n7_007',
    level: 'Nível 7',
    type: 'theory',
    title: 'ABAP Unit: Classes de Teste Automatizado',
    question: 'Como uma classe local de testes automatizados é declarada para que o framework ABAP Unit reconheça seus métodos de teste na transação SE38/SE24/ADT?',
    options: [
      'CLASS lcl_test DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.',
      'PROGRAM z_test UNIT TEST TRUE.',
      'INTERFACE zif_unit_test IMPLEMENTATION.',
      'METHOD test_case CHECK AUTO.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Classes de teste em ABAP Unit são declaradas com a cláusula especial FOR TESTING, especificando a duração estimada (SHORT/MEDIUM/LONG) e o nível de risco no banco (HARMLESS/DANGEROUS/CRITICAL).',
    conceptTag: 'ABAP Unit',
    xpReward: 45,
  },
  {
    id: 'n7_008',
    level: 'Nível 7',
    type: 'multiple_choice',
    title: 'Clean Code: Inversão de Controle e Factory Pattern',
    question: 'Qual é a principal vantagem de utilizar uma classe Factory (ex.: zcl_invoice_factory=>get_processor( ... )) na arquitetura corporativa ABAP?',
    options: [
      'Permite criar objetos sem expor a lógica de instanciação ao cliente e desacopla a aplicação através de interfaces.',
      'Reduz o número de linhas no arquivo /SAP/ERP/INIT.',
      'Evita que o usuário precise informar o mandante 100.',
      'Cria automaticamente índices secundários no Oracle ou SAP HANA.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O padrão Factory desacopla a criação dos objetos da sua utilização prática. O consumidor solicita um serviço pela interface comum e a Factory decide qual classe concreta instanciar com base em parâmetros.',
    conceptTag: 'Design Patterns',
    xpReward: 40,
  },
  {
    id: 'n7_009',
    level: 'Nível 7',
    type: 'theory',
    title: 'Métodos e Classes ABSTRACT vs FINAL',
    question: 'Em ABAP OO, o que acontece quando uma classe é definida com a palavra-chave ABSTRACT?',
    options: [
      'Ela não pode ser herdada por nenhuma outra classe.',
      'Ela não pode ser instanciada diretamente com NEW / CREATE OBJECT, servindo apenas como modelo base para subclasses.',
      'Ela roda exclusivamente em segundo plano no background spool.',
      'Ela apaga todos os dados da memória ao término da transação.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Classes abstratas (ABSTRACT) não podem ter instâncias diretas. Elas servem de fundação conceitual e podem conter métodos abstratos que obrigam as subclasses a implementá-los.',
    conceptTag: 'Herança ABAP',
    xpReward: 35,
  },
  {
    id: 'n7_010',
    level: 'Nível 7',
    type: 'multiple_choice',
    title: 'Construtor de Instância em ABAP: Construtor Especial',
    question: 'Qual é o nome obrigatório reservado para o método construtor de uma instância em classes ABAP?',
    options: [
      'INIT',
      'CONSTRUCTOR',
      'CLASS_CONSTRUCTOR',
      'NEW'
    ],
    correctAnswerIndex: 1,
    explanation: 'O método METHODS constructor [IMPORTING ...] é o construtor de instância oficial em ABAP, executado automaticamente na criação do objeto. Já CLASS_CONSTRUCTOR é o construtor estático executado uma única vez ao carregar a classe.',
    conceptTag: 'ABAP OO',
    xpReward: 35,
  }
];
