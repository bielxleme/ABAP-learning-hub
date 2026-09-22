import { QuizQuestion } from '../types';

export const ABAP_QUESTIONS_LEVEL_4: QuizQuestion[] = [
  {
    id: 'n4_001',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Visibilidade em ABAP OO: PUBLIC, PROTECTED e PRIVATE',
    question: 'Qual seção de uma classe ABAP permite acesso aos atributos e métodos apenas pela própria classe e pelas subclasses que herdam dela?',
    options: [
      'PROTECTED SECTION.',
      'PRIVATE SECTION.',
      'PUBLIC SECTION.',
      'GLOBAL SECTION.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A PROTECTED SECTION restringe a visibilidade para a própria classe e qualquer subclasse na árvore hierárquica de herança.',
    conceptTag: 'ABAP Orientado a Objetos',
    xpReward: 40,
  },
  {
    id: 'n4_002',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Instanciação com NEW (ABAP 7.40+)',
    question: 'Qual é a forma moderna de instanciar a classe lcl_faturamento atribuindo para uma variável tipada em linha?',
    options: [
      'DATA(lo_fat) = NEW lcl_faturamento( ).',
      'DATA(lo_fat) = CREATE OBJECT lcl_faturamento.',
      'lo_fat = lcl_faturamento=>new( ).',
      'DATA(lo_fat) = ALLOCATE lcl_faturamento.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O operador NEW #( ) ou NEW classe( ) substitui o antigo comando verboso CREATE OBJECT, permitindo inferência automática de tipo com DATA(lo_obj).',
    conceptTag: 'Clean ABAP 7.40+',
    xpReward: 40,
  },
  {
    id: 'n4_003',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Tratamento de Exceções com TRY / CATCH',
    question: 'Qual é a classe raiz universal da qual todas as exceções orientadas a objetos no SAP herdam?',
    options: [
      'CX_ROOT',
      'CX_ERROR_BASE',
      'CL_EXCEPTION',
      'ZCX_MASTER'
    ],
    correctAnswerIndex: 0,
    explanation: 'Todas as classes de exceção baseadas em classes no SAP ABAP herdam direta ou indiretamente de CX_ROOT (dividindo-se em CX_STATIC_CHECK, CX_DYNAMIC_CHECK e CX_NO_CHECK).',
    conceptTag: 'Exceções e Robustez',
    xpReward: 45,
  },
  {
    id: 'n4_004',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Interfaces em ABAP: INTERFACE ... ENDINTERFACE',
    question: 'Em uma classe que implementa a interface zif_imposto, como os métodos da interface são referenciados dentro da classe?',
    options: [
      'Com o prefixo do nome da interface e til: zif_imposto~calcular_icms.',
      'Apenas pelo nome do método sem prefixo: calcular_icms.',
      'Com arroba: @zif_imposto->calcular_icms.',
      'Com duplo dois-pontos: zif_imposto::calcular_icms.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Componentes de interfaces implementadas em classes ABAP são qualificados com a notação interface~componente.',
    conceptTag: 'ABAP Orientado a Objetos',
    xpReward: 40,
  },
  {
    id: 'n4_005',
    level: 'Nível 4',
    type: 'code_exercise',
    title: 'Desafio: Instanciação Moderna com Construtor',
    question: 'Instancie a classe lcl_pedido passando o parâmetro iv_pedido = "4500000001" usando o operador NEW moderno.',
    codeSnippet: `* Escreva a instanciação moderna:
DATA(lo_pedido) = `,
    expectedCodePatterns: {
      requiredTokens: ['NEW LCL_PEDIDO(', 'IV_PEDIDO ='],
      sampleSolution: `DATA(lo_pedido) = NEW lcl_pedido( iv_pedido = '4500000001' ).`,
    },
    explanation: 'O operador NEW suporta passagem direta de parâmetros nomeados para o método CONSTRUCTOR da classe.',
    conceptTag: 'Desafio de Código',
    xpReward: 50,
  },
  {
    id: 'n4_006',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Métodos Abstratos e Classes Abstratas',
    question: 'O que define uma classe declarada como ABSTRACT em ABAP OO?',
    options: [
      'Ela não pode ser instanciada diretamente com NEW / CREATE OBJECT; apenas suas subclasses concretas podem ser instanciadas.',
      'Ela não pode ter nenhum método com código.',
      'Ela é automaticamente apagada após 24 horas.',
      'Ela roda exclusivamente em lote (background).'
    ],
    correctAnswerIndex: 0,
    explanation: 'Classes abstratas servem como modelo base (contrato e implementação compartilhada) e nunca podem ser instanciadas diretamente.',
    conceptTag: 'ABAP Orientado a Objetos',
    xpReward: 45,
  },
  {
    id: 'n4_007',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Classes Finais: FINAL METHODS e FINAL CLASS',
    question: 'Qual é o efeito de declarar uma classe como CLASS lcl_seguranca DEFINITION FINAL?',
    options: [
      'A classe não pode ter subclasses herdando dela.',
      'A classe não pode ter métodos públicos.',
      'A classe é executada em modo somente leitura no banco de dados.',
      'A classe é privada para o usuário SAP*.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A diretiva FINAL impede que outras classes façam herança (INHERITING FROM) a partir dela, garantindo integridade ou otimização do compilador.',
    conceptTag: 'ABAP Orientado a Objetos',
    xpReward: 40,
  },
  {
    id: 'n4_008',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Eventos em ABAP OO: EVENTS e SET HANDLER',
    question: 'Como um objeto B se registra para escutar e reagir a um evento disparado pelo objeto A?',
    options: [
      'SET HANDLER lo_b->on_evento FOR lo_a.',
      'REGISTER EVENT lo_a TO lo_b.',
      'CONNECT lo_a WITH lo_b.',
      'LISTEN lo_a->evento.'
    ],
    correctAnswerIndex: 0,
    explanation: 'SET HANDLER registra métodos manipuladores (METHODS handler FOR EVENT ... OF ...) para instâncias específicas ou para todas as instâncias (ALL INSTANCES).',
    conceptTag: 'Eventos e Handlers',
    xpReward: 45,
  },
  {
    id: 'n4_009',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Design Pattern Singleton em ABAP',
    question: 'Qual é a combinação técnica essencial para implementar o padrão Singleton em uma classe ABAP?',
    options: [
      'CREATE PRIVATE na definição, atributo estático privado segurando a instância única e método estático público GET_INSTANCE.',
      'Todos os métodos devem ser protegidos e a classe abstrata.',
      'Uso mandatório da transação SE24 com tabela transparente.',
      'Definição da classe dentro de uma função RFC.'
    ],
    correctAnswerIndex: 0,
    explanation: 'CREATE PRIVATE impede chamadas de NEW externas; o método estático get_instance instancia o objeto caso ele ainda não exista e retorna a mesma referência sempre.',
    conceptTag: 'Design Patterns',
    xpReward: 50,
  },
  {
    id: 'n4_010',
    level: 'Nível 4',
    type: 'multiple_choice',
    title: 'Downcasting: Operador CAST #( ) e ?=',
    question: 'Quando é necessário utilizar o operador de downcasting "CAST #( ref_generica )" ou "?="?',
    options: [
      'Quando convertemos uma referência de uma superclasse ou interface para a referência de uma subclasse específica mais especializada.',
      'Quando convertemos um número negativo para positivo.',
      'Para ordenar uma tabela em ordem decrescente.',
      'Para exportar um relatório em PDF.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Downcasting (especialização) requer verificação em tempo de execução. Se o objeto referenciado não for compatível com o tipo de destino, é disparada a exceção cx_sy_move_cast_error.',
    conceptTag: 'ABAP Orientado a Objetos',
    xpReward: 45,
  }
];
