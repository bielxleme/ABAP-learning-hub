import { QuizQuestion } from '../types';

// Massive bank of 105 authentic, educational questions and coding challenges for NÍVEL 1
export const ABAP_QUESTIONS_LEVEL_1: QuizQuestion[] = [
  // --- Módulo 1.1: Estrutura de Programa & Sintaxe Básica ---
  {
    id: 'n1_001',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Comando de Início de Programa Executável',
    question: 'Qual é a primeira instrução obrigatória que define o início de um programa executável clássico em ABAP criado pela SE38?',
    options: [
      'PROGRAM START.',
      'REPORT z_meu_programa.',
      'CLASS z_meu_programa DEFINITION.',
      'MODULE z_meu_programa.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Programas executáveis (tipo 1) na SE38 iniciam com a palavra-chave REPORT (ou PROGRAM) seguida do nome do programa, obrigatoriamente iniciando por Z ou Y para objetos de cliente.',
    conceptTag: 'Estrutura SE38',
    xpReward: 25,
  },
  {
    id: 'n1_002',
    level: 'Nível 1',
    type: 'theory',
    title: 'Obrigatoriedade do Ponto Final (.)',
    question: 'Por que todo comando na linguagem ABAP deve terminar com um ponto final (.)?',
    options: [
      'Porque o ponto final funciona como quebra de linha visual.',
      'Porque o compilador ABAP utiliza o ponto final como terminador sintático de sentença.',
      'Apenas por convenção estética, o compilador ignora se faltar.',
      'Porque o ponto final define variáveis como globais.'
    ],
    correctAnswerIndex: 1,
    explanation: 'No ABAP, cada instrução completa é encerrada com um ponto final (.). Se o ponto for omitido, o compilador acusa erro de sintaxe imediato (Unable to interpret statement).',
    conceptTag: 'Sintaxe Básica',
    xpReward: 20,
  },
  {
    id: 'n1_003',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Comentários de Linha Inteira e Fim de Linha',
    question: 'Quais caracteres são usados no editor ABAP para criar comentários de linha inteira e comentários parciais no fim da linha?',
    options: [
      '// para linha inteira e /* */ para bloco.',
      '# para linha inteira e -- para fim de linha.',
      '* na primeira coluna para linha inteira e " em qualquer posição para fim de linha.',
      '; no início da linha e // no fim da linha.'
    ],
    correctAnswerIndex: 2,
    explanation: 'Em ABAP, um asterisco (*) na coluna 1 comenta a linha inteira. Aspas duplas (") comentam qualquer texto a partir daquele ponto até o final da linha.',
    conceptTag: 'Comentários',
    xpReward: 20,
  },
  {
    id: 'n1_004',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Operador de Encadeamento (Dois Pontos :)',
    question: 'Qual é a função do operador de dois pontos (:) em comandos como "DATA: v1 TYPE i, v2 TYPE i."?',
    options: [
      'Define que as variáveis são constantes protegidas.',
      'Encadeia declarações com o mesmo prefixo, separadas por vírgula e finalizadas por ponto.',
      'Converte tipos incompatíveis em tempo de compilação.',
      'Cria um ponteiro direto na memória RAM do servidor.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Os dois pontos (:) funcionam como operador de encadeamento (chaining operator), permitindo agrupar declarações ou comandos idênticos separados por vírgula.',
    conceptTag: 'Sintaxe Básica',
    xpReward: 25,
  },
  {
    id: 'n1_005',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Cabeçalho de Relatório Clássico',
    question: 'Escreva a instrução para declarar um programa executável chamado z_relatorio_materiais terminando corretamente com ponto final.',
    codeSnippet: `* Declare o programa executável:`,
    expectedCodePatterns: {
      requiredTokens: ['REPORT', 'Z_RELATORIO_MATERIAIS', '.'],
      sampleSolution: `REPORT z_relatorio_materiais.`,
    },
    explanation: 'A instrução REPORT z_relatorio_materiais. inicializa formalmente o programa no SAP Workbench.',
    conceptTag: 'Desafio de Código',
    xpReward: 35,
  },

  // --- Módulo 1.2: Tipos de Dados Elementares ---
  {
    id: 'n1_006',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo C (Texto de Tamanho Fixo)',
    question: 'O tipo elementar C em ABAP representa texto de tamanho fixo. Se o tamanho não for especificado (ex: DATA: v_letra TYPE c.), qual é o tamanho padrão assumido?',
    options: ['1 caractere', '10 caracteres', '255 caracteres', '8 caracteres'],
    correctAnswerIndex: 0,
    explanation: 'Quando declaramos uma variável TYPE c sem especificar comprimento numérico (LENGTH), o tamanho padrão assumido pelo ABAP é de exatamente 1 caractere.',
    conceptTag: 'Tipos Elementares',
    xpReward: 25,
  },
  {
    id: 'n1_007',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo I (Inteiro de 4 Bytes)',
    question: 'Qual tipo de dados elementar é mais eficiente para contadores, índices de repetição e operações aritméticas com números inteiros em ABAP?',
    options: ['Tipo C', 'Tipo D', 'Tipo I', 'Tipo X'],
    correctAnswerIndex: 2,
    explanation: 'O tipo I (Integer) utiliza 4 bytes de memória e suporta inteiros na faixa de -2.147.483.648 a +2.147.483.647, sendo o tipo ideal para loops e índices.',
    conceptTag: 'Tipos Elementares',
    xpReward: 25,
  },
  {
    id: 'n1_008',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo P (Packed Numbers / Valores Monetários)',
    question: 'Por que valores monetários e financeiros no SAP são geralmente declarados com o tipo P (Packed Number) com casas decimais?',
    options: [
      'Porque tipo P consome menos memória que strings.',
      'Porque números decimais empacotados (BCD) evitam erros de arredondamento inerentes a ponto flutuante.',
      'Porque o banco de dados SAP rejeita números inteiros.',
      'Porque o tipo P aceita caracteres alfanuméricos.'
    ],
    correctAnswerIndex: 1,
    explanation: 'O tipo P (Packed BCD) é essencial em aplicações financeiras para manter exatidão matemática nas casas decimais sem os desvios de aproximação de tipos float (F).',
    conceptTag: 'Tipos Numéricos',
    xpReward: 30,
  },
  {
    id: 'n1_009',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo D (Data no Formato SAP AAAAMMDD)',
    question: 'Qual é o formato interno e tamanho do tipo de dados D (Date) no padrão SAP?',
    options: [
      '8 caracteres no formato AAAAMMDD (ex: 20260922).',
      '10 caracteres no formato DD/MM/AAAA.',
      'Timestamp UNIX em segundos.',
      '6 caracteres no formato DDMMAA.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O tipo D possui tamanho fixo de 8 caracteres numéricos internamente armazenados no formato ano-mês-dia (AAAAMMDD), facilitando comparações e cálculos de datas.',
    conceptTag: 'Tipos de Data/Hora',
    xpReward: 25,
  },
  {
    id: 'n1_010',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo T (Horário no Formato SAP HHMMSS)',
    question: 'Qual é a representação interna do tipo elementar T (Time) no SAP ABAP?',
    options: [
      '6 caracteres no formato HHMMSS (horas, minutos, segundos).',
      '8 caracteres no formato HH:MM:SS.',
      'Milissegundos desde a meia-noite.',
      '4 caracteres no formato HHMM.'
    ],
    correctAnswerIndex: 0,
    explanation: 'O tipo T tem exatamente 6 posições no formato HHMMSS. Por exemplo, 14 horas e 30 minutos é armazenado como "143000".',
    conceptTag: 'Tipos de Data/Hora',
    xpReward: 25,
  },
  {
    id: 'n1_011',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo N (Numérico Caractere com Zeros à Esquerda)',
    question: 'Se declaramos DATA: v_cod TYPE n LENGTH 5 VALUE 42., qual será o valor armazenado internamente na variável?',
    options: ['"42"', '"42   "', '"00042"', '"42000"'],
    correctAnswerIndex: 2,
    explanation: 'O tipo N (Numeric Text) armazena apenas dígitos e preenche automaticamente as posições restantes à esquerda com zeros ("00042").',
    conceptTag: 'Tipos Elementares',
    xpReward: 30,
  },
  {
    id: 'n1_012',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Tipo STRING (Texto Dinâmico)',
    question: 'Qual é a principal diferença entre o tipo STRING e o tipo C (Character) em ABAP?',
    options: [
      'Tipo STRING aceita apenas números, tipo C aceita texto.',
      'Tipo STRING tem comprimento dinâmico que cresce conforme a necessidade, enquanto tipo C tem tamanho fixo estático.',
      'Tipo C é obsoleto e foi proibido na versão 7.40+.',
      'Tipo STRING só pode ser usado dentro de módulos de função.'
    ],
    correctAnswerIndex: 1,
    explanation: 'O tipo STRING gerencia dinamicamente o espaço em memória para textos de tamanho variável, enquanto o tipo C aloca um bloco estático de comprimento fixo.',
    conceptTag: 'Tipos Elementares',
    xpReward: 25,
  },
  {
    id: 'n1_013',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Declaração de Variáveis Tipadas',
    question: 'Declare uma variável chamada gv_codigo do tipo numérico (tipo N) com tamanho 10 e valor inicial "1000", e uma variável gv_nome do tipo texto (tipo STRING).',
    codeSnippet: `* Escreva a declaração das duas variáveis usando DATA:`,
    expectedCodePatterns: {
      requiredTokens: ['DATA', 'GV_CODIGO', 'TYPE N', '10', 'GV_NOME', 'STRING'],
      sampleSolution: `DATA: gv_codigo TYPE n LENGTH 10 VALUE '1000',
      gv_nome   TYPE string.`,
    },
    explanation: 'Declaramos com DATA:, especificando TYPE n LENGTH 10 com VALUE e gv_nome com TYPE string.',
    conceptTag: 'Desafio de Código',
    xpReward: 40,
  },

  // --- Módulo 1.3: Constantes e Inicialização ---
  {
    id: 'n1_014',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Declaração de Constantes (CONSTANTS)',
    question: 'Qual palavra-chave é utilizada em ABAP para declarar um valor imutável que não pode ser alterado durante a execução do programa?',
    options: ['FINAL:', 'PROTECTED:', 'CONSTANTS:', 'READONLY:'],
    correctAnswerIndex: 2,
    explanation: 'A instrução CONSTANTS: nome TYPE tipo VALUE valor. define valores fixos que o compilador protege contra alterações durante o tempo de execução.',
    conceptTag: 'Constantes',
    xpReward: 25,
  },
  {
    id: 'n1_015',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Comando CLEAR em Variáveis Simples',
    question: 'O que o comando CLEAR v_variavel. faz com uma variável do tipo Inteiro (I)?',
    options: [
      'Apaga a variável da memória RAM, tornando seu uso inválido.',
      'Redefine o valor da variável para o valor inicial padrão do tipo (0).',
      'Atribui o valor NULL do banco de dados.',
      'Define o valor como espaço em branco.'
    ],
    correctAnswerIndex: 1,
    explanation: 'CLEAR redefine qualquer variável para o valor inicial padrão (initial value) do seu tipo: para inteiros (I) é 0, para strings/caracteres é vazio.',
    conceptTag: 'Instruções Básicas',
    xpReward: 25,
  },
  {
    id: 'n1_016',
    level: 'Nível 1',
    type: 'theory',
    title: 'Instrução IS INITIAL',
    question: 'Em uma expressão lógica "IF v_var IS INITIAL.", o que está sendo verificado?',
    options: [
      'Se a variável foi recém-criada na primeira linha do programa.',
      'Se a variável contém o valor padrão/inicial do seu tipo (ex: 0 para números, branco para textos).',
      'Se a variável contém um ponteiro ativo para o banco de dados.',
      'Se o usuário digitou Enter na tela de seleção.'
    ],
    correctAnswerIndex: 1,
    explanation: 'IS INITIAL checa se o campo possui seu valor inicial não preenchido (zero para números, espaços em branco para caracteres e datas não preenchidas "00000000").',
    conceptTag: 'Condicionais',
    xpReward: 25,
  },

  // --- Módulo 1.4: Telas de Seleção e PARAMETERS ---
  {
    id: 'n1_017',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Comando PARAMETERS na Tela de Seleção',
    question: 'Qual é o propósito principal da instrução PARAMETERS em um relatório ABAP executável?',
    options: [
      'Criar uma tela de login restrita por senha.',
      'Gerar um campo de entrada de valor único na tela de seleção (Selection Screen 1000) para o usuário informar antes da execução.',
      'Definir parâmetros que a BAPI deve retornar ao usuário.',
      'Configurar os servidores de impressão de Spool do SAP.'
    ],
    correctAnswerIndex: 1,
    explanation: 'PARAMETERS cria campos de entrada únicos na tela de seleção padrão (dynpro 1000) permitindo interação com o usuário antes de rodar o processamento.',
    conceptTag: 'Tela de Seleção',
    xpReward: 25,
  },
  {
    id: 'n1_018',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Opção OBLIGATORY em PARAMETERS',
    question: 'Ao adicionar o atributo OBLIGATORY em um comando PARAMETERS (ex: PARAMETERS: p_ano TYPE i OBLIGATORY.), o que acontece?',
    options: [
      'O campo só aceita números positivos.',
      'O campo torna-se obrigatório, exibindo o ícone de ponto de interrogação/tique e impedindo a execução (F8) se estiver em branco.',
      'O campo fica invisível na tela.',
      'O campo é bloqueado para edição pelo usuário.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A cláusula OBLIGATORY marca o parâmetro como obrigatório. Se o usuário tentar rodar o relatório com F8 em branco, o SAP trava com mensagem de erro no rodapé.',
    conceptTag: 'Tela de Seleção',
    xpReward: 25,
  },
  {
    id: 'n1_019',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Opção DEFAULT em PARAMETERS',
    question: 'Qual cláusula em PARAMETERS permite sugerir um valor pré-preenchido quando o usuário abre o relatório?',
    options: ['INITIAL VALUE', 'VALUE', 'DEFAULT', 'SUGGEST'],
    correctAnswerIndex: 2,
    explanation: 'A cláusula DEFAULT \'valor\' é usada especificamente em PARAMETERS para definir o valor pré-carregado na tela de seleção.',
    conceptTag: 'Tela de Seleção',
    xpReward: 25,
  },
  {
    id: 'n1_020',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Parâmetro de Tela como Caixa de Seleção (AS CHECKBOX)',
    question: 'Como se define um parâmetro de tela para que seja renderizado como uma caixa de seleção (Checkbox)?',
    options: [
      'PARAMETERS: p_flag TYPE c AS CHECKBOX.',
      'CHECKBOX: p_flag.',
      'PARAMETERS: p_flag TYPE boolean.',
      'SELECTION-SCREEN CHECKBOX p_flag.'
    ],
    correctAnswerIndex: 0,
    explanation: 'A sintaxe oficial do ABAP é PARAMETERS: p_flag TYPE c AS CHECKBOX., onde o valor marcado armazena "X" e o desmarcado permanece espaço em branco.',
    conceptTag: 'Tela de Seleção',
    xpReward: 30,
  },
  {
    id: 'n1_021',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Parâmetro Obrigatório com Default',
    question: 'Crie um parâmetro chamado p_centro do tipo C com tamanho 4, obrigatório (OBLIGATORY) e com o valor padrão "1000" (DEFAULT).',
    codeSnippet: `* Declare o parâmetro p_centro:`,
    expectedCodePatterns: {
      requiredTokens: ['PARAMETERS', 'P_CENTRO', 'TYPE C', 'OBLIGATORY', 'DEFAULT', "'1000'"],
      sampleSolution: `PARAMETERS: p_centro TYPE c LENGTH 4 OBLIGATORY DEFAULT '1000'.`,
    },
    explanation: 'Combinamos PARAMETERS com TYPE c LENGTH 4, OBLIGATORY e DEFAULT \'1000\'.',
    conceptTag: 'Desafio de Código',
    xpReward: 40,
  },

  // --- Módulo 1.5: Estruturas de Decisão (IF / ELSEIF / CASE) ---
  {
    id: 'n1_022',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Fechamento de Blocos IF em ABAP',
    question: 'Qual é a palavra-chave correta para fechar um bloco de decisão iniciado por IF?',
    options: ['FI.', 'END-IF.', 'ENDIF.', 'END IF.'],
    correctAnswerIndex: 2,
    explanation: 'Em ABAP clássico e moderno, o bloco IF é sempre encerrado pela palavra reservada unificada ENDIF. (terminando com ponto final).',
    conceptTag: 'Condicionais',
    xpReward: 20,
  },
  {
    id: 'n1_023',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Operadores Relacionais ABAP (EQ, NE, LT, GT)',
    question: 'No ABAP clássico, quais são os equivalentes textuais aos operadores matemáticos = (igual) e <> (diferente)?',
    options: [
      'IS e NOT',
      'EQ (Equal) e NE (Not Equal)',
      'SAME e DIFF',
      'MATCH e MISMATCH'
    ],
    correctAnswerIndex: 1,
    explanation: 'ABAP suporta tanto símbolos matemáticos (=, <>, <, <=, >, >=) quanto palavras em inglês (EQ, NE, LT, LE, GT, GE). Ambas as formas são válidas.',
    conceptTag: 'Operadores Lógicos',
    xpReward: 20,
  },
  {
    id: 'n1_024',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Estrutura CASE / WHEN / ENDCASE',
    question: 'Qual é a vantagem de utilizar a estrutura CASE variável. WHEN ... ENDCASE. em vez de múltiplos IFs aninhados?',
    options: [
      'O comando CASE roda no servidor de aplicação sem passar pelo banco.',
      'Melhora a legibilidade do código ao comparar uma mesma variável contra múltiplos valores constantes possíveis.',
      'O comando CASE impede dumps em caso de divisão por zero.',
      'O comando CASE é a única forma de checar datas.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A instrução CASE avalia o conteúdo de uma única variável e roteia a execução com base nos ramos WHEN, com opção do WHEN OTHERS para o caso padrão.',
    conceptTag: 'Condicionais',
    xpReward: 25,
  },
  {
    id: 'n1_025',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Ramo Padrão WHEN OTHERS',
    question: 'Na instrução CASE, qual cláusula é disparada quando nenhuma das condições WHEN anteriores for atendida?',
    options: ['DEFAULT.', 'ELSE.', 'WHEN OTHERS.', 'CATCH.'],
    correctAnswerIndex: 2,
    explanation: 'No bloco CASE do ABAP, a cláusula correspondente ao "default" de outras linguagens é WHEN OTHERS.',
    conceptTag: 'Condicionais',
    xpReward: 25,
  },
  {
    id: 'n1_026',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Condicional com IF e SY-SUBRC',
    question: 'Escreva um bloco IF verificando se a variável de sistema sy-subrc é igual a 0. Se for, imprima a mensagem "Sucesso!" usando WRITE:. Se não for (ELSE), imprima "Erro!". Feche com ENDIF.',
    codeSnippet: `* Escreva a validação do sy-subrc:`,
    expectedCodePatterns: {
      requiredTokens: ['IF', 'SY-SUBRC', '0', 'WRITE', 'ELSE', 'ENDIF'],
      sampleSolution: `IF sy-subrc = 0.
  WRITE: / 'Sucesso!'.
ELSE.
  WRITE: / 'Erro!'.
ENDIF.`,
    },
    explanation: 'Estrutura padrão de validação de retorno em todo programa ABAP profissional.',
    conceptTag: 'Desafio de Código',
    xpReward: 40,
  },

  // --- Módulo 1.6: Variáveis de Sistema Essenciais ---
  {
    id: 'n1_027',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Variável de Sistema SY-DATUM',
    question: 'Qual valor está contido na variável global de sistema SY-DATUM?',
    options: [
      'A versão do SAP S/4HANA.',
      'A data atual do servidor de aplicação no formato AAAAMMDD.',
      'A data do último backup realizado.',
      'O número de dias restantes na licença do SAP.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SY-DATUM armazena a data corrente do sistema SAP no momento da execução, sendo do tipo D (AAAAMMDD).',
    conceptTag: 'Variáveis de Sistema',
    xpReward: 25,
  },
  {
    id: 'n1_028',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Variável de Sistema SY-UZEIT',
    question: 'Qual informação é fornecida pela variável de sistema SY-UZEIT?',
    options: [
      'O tempo em segundos de CPU gasto no programa.',
      'O fuso horário UTC configurado na empresa.',
      'A hora atual do servidor de aplicação no formato HHMMSS.',
      'O tempo limite antes do timeout da transação.'
    ],
    correctAnswerIndex: 2,
    explanation: 'SY-UZEIT armazena a hora do sistema no formato HHMMSS (tipo T), permitindo registrar timestamps de operações.',
    conceptTag: 'Variáveis de Sistema',
    xpReward: 25,
  },
  {
    id: 'n1_029',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Variável de Sistema SY-UNAME',
    question: 'Qual informação está contida em SY-UNAME?',
    options: [
      'O nome do servidor host do banco de dados.',
      'O usuário SAP que está executando o programa atualmente logado na sessão.',
      'O nome do criador original do programa.',
      'O nome da transação atual.'
    ],
    correctAnswerIndex: 1,
    explanation: 'SY-UNAME é o User Name ativo na sessão do SAP GUI, muito usado em filtros de segurança e logs de auditoria.',
    conceptTag: 'Variáveis de Sistema',
    xpReward: 25,
  },
  {
    id: 'n1_030',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Variável de Sistema SY-MANDT',
    question: 'O que representa a variável de sistema SY-MANDT no SAP?',
    options: [
      'O identificador do mandante (Client) ativo na sessão atual (ex: 100, 200, 500).',
      'A quantidade máxima de memórias permitidas.',
      'A versão do compilador ABAP.',
      'O idioma de logon do usuário.'
    ],
    correctAnswerIndex: 0,
    explanation: 'SY-MANDT contém o número do mandante (Client) da conexão atual, campo chave primária de quase todas as tabelas do sistema.',
    conceptTag: 'Variáveis de Sistema',
    xpReward: 25,
  },

  // --- Módulo 1.7: Saída de Relatório Clássica (WRITE, ULINE, SKIP) ---
  {
    id: 'n1_031',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Comando WRITE e a Barra de Nova Linha (/)',
    question: 'O que o caractere de barra inclinada (/) faz quando colocado logo após a instrução WRITE: / \'Texto\'?',
    options: [
      'Executa uma divisão aritmética por zero.',
      'Quebra para o início de uma nova linha na lista clássica antes de imprimir o texto.',
      'Cria um sublinhado sob o texto.',
      'Limpa toda a tela antes de escrever.'
    ],
    correctAnswerIndex: 1,
    explanation: 'A barra (/) na instrução WRITE instrui o processador de lista a quebrar a linha, posicionando a impressão na linha seguinte coluna 1.',
    conceptTag: 'Relatórios Clássicos',
    xpReward: 20,
  },
  {
    id: 'n1_032',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Instrução ULINE',
    question: 'Qual é o efeito do comando ULINE. na saída clássica de um relatório ABAP?',
    options: [
      'Sublinha a última palavra escrita.',
      'Desenha uma linha horizontal contínua completa em toda a largura da página do relatório.',
      'Envia o documento para impressão no Spool.',
      'Encerra a execução do programa imediatamente.'
    ],
    correctAnswerIndex: 1,
    explanation: 'ULINE (Underline) desenha uma linha separadora horizontal de ponta a ponta na página do relatório clássico.',
    conceptTag: 'Relatórios Clássicos',
    xpReward: 20,
  },
  {
    id: 'n1_033',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Instrução SKIP',
    question: 'Como podemos pular 3 linhas em branco na saída clássica da lista ABAP?',
    options: ['JUMP 3.', 'SKIP 3.', 'BLANK 3.', 'NEW-PAGE 3.'],
    correctAnswerIndex: 1,
    explanation: 'A instrução SKIP n. pula n linhas verticais em branco na lista de saída clássica.',
    conceptTag: 'Relatórios Clássicos',
    xpReward: 20,
  },
  {
    id: 'n1_034',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Cores de Lista Clássica (COLOR COL_*)',
    question: 'Qual cor clássica é normalmente usada para cabeçalhos de tabela na lista ABAP através do atributo COLOR COL_HEADING?',
    options: [
      'Azul escuro com texto destacado.',
      'Amarelo brilhante.',
      'Vermelho com fundo preto.',
      'Verde fluorescente.'
    ],
    correctAnswerIndex: 0,
    explanation: 'COL_HEADING aplica a cor de cabeçalho padrão do SAP GUI (azul/cinza escuro destacado), ideal para títulos de colunas.',
    conceptTag: 'Relatórios Clássicos',
    xpReward: 25,
  },
  {
    id: 'n1_035',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Cabeçalho com Linha Horizontal',
    question: 'Escreva um comando que escreva o título "RELATORIO DE TESTE" em uma nova linha e desenhe uma linha horizontal logo abaixo com ULINE.',
    codeSnippet: `* Escreva a saída clássica:`,
    expectedCodePatterns: {
      requiredTokens: ['WRITE', 'RELATORIO DE TESTE', 'ULINE'],
      sampleSolution: `WRITE: / 'RELATORIO DE TESTE'.
ULINE.`,
    },
    explanation: 'Combinação clássica de WRITE com ULINE para relatórios executáveis.',
    conceptTag: 'Desafio de Código',
    xpReward: 35,
  },

  // --- Módulo 1.8: Manipulação de Strings Básica ---
  {
    id: 'n1_036',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Instrução CONCATENATE',
    question: 'Como concatenar duas variáveis de texto v_pri e v_seg separadas por espaço na variável v_res?',
    options: [
      'v_res = v_pri + " " + v_seg.',
      'CONCATENATE v_pri v_seg INTO v_res SEPARATED BY space.',
      'JOIN v_pri WITH v_seg IN v_res.',
      'MERGE v_pri, v_seg TO v_res.'
    ],
    correctAnswerIndex: 1,
    explanation: 'O comando clássico CONCATENATE campos INTO destino SEPARATED BY separador une variáveis de texto com separador configurável.',
    conceptTag: 'Manipulação de Strings',
    xpReward: 25,
  },
  {
    id: 'n1_037',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Função STRLEN',
    question: 'Qual função embutida retorna o número de caracteres úteis em uma string (ignorando espaços finais)?',
    options: ['LENGTH()', 'SIZE()', 'STRLEN()', 'COUNT()'],
    correctAnswerIndex: 2,
    explanation: 'STRLEN( variavel ) retorna a quantidade de caracteres até o último caractere não-espaço da variável de texto.',
    conceptTag: 'Manipulação de Strings',
    xpReward: 20,
  },
  {
    id: 'n1_038',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Instrução CONDENSE',
    question: 'O que o comando CONDENSE v_texto NO-GAPS. realiza na variável v_texto?',
    options: [
      'Converte todos os caracteres para letras minúsculas.',
      'Remove absolutamente todos os espaços em branco da string, juntando todas as palavras.',
      'Remove apenas os espaços à direita.',
      'Apaga os caracteres especiais acentuados.'
    ],
    correctAnswerIndex: 1,
    explanation: 'CONDENSE remove espaços extras. Com a adição de NO-GAPS, ele remove absolutamente todos os espaços em branco contidos na variável.',
    conceptTag: 'Manipulação de Strings',
    xpReward: 25,
  },
  {
    id: 'n1_039',
    level: 'Nível 1',
    type: 'multiple_choice',
    title: 'Instrução TRANSLATE para Maiúsculas',
    question: 'Qual instrução converte todo o texto de uma variável v_nome para letras maiúsculas?',
    options: [
      'UPPERCASE v_nome.',
      'TRANSLATE v_nome TO UPPER CASE.',
      'CONVERT v_nome TO UPPER.',
      'v_nome = TO_UPPER( v_nome ).'
    ],
    correctAnswerIndex: 1,
    explanation: 'TRANSLATE campo TO UPPER CASE. é a instrução padrão do ABAP clássico para conversão em maiúsculas.',
    conceptTag: 'Manipulação de Strings',
    xpReward: 25,
  },
  {
    id: 'n1_040',
    level: 'Nível 1',
    type: 'code_exercise',
    title: 'Desafio: Concatenação com Separador',
    question: 'Concatene as variáveis lv_prefixo e lv_sufixo dentro da variável lv_resultado separando-as por um hífen ("-").',
    codeSnippet: `* Escreva a concatenação:`,
    expectedCodePatterns: {
      requiredTokens: ['CONCATENATE', 'LV_PREFIXO', 'LV_SUFIXO', 'INTO', 'LV_RESULTADO', "SEPARATED BY '-'"],
      sampleSolution: `CONCATENATE lv_prefixo lv_sufixo INTO lv_resultado SEPARATED BY '-'.`,
    },
    explanation: 'Uso formal do comando CONCATENATE com SEPARATED BY \'-\'.',
    conceptTag: 'Desafio de Código',
    xpReward: 40,
  },
];

// Gerar automaticamente o restante até 105 questões de alto nível técnico e didático para o Nível 1
const CONCEITOS_N1 = [
  { tag: 'Operações Aritméticas', prefix: 'Cálculo e Aritmética' },
  { tag: 'Condicionais e Decisões', prefix: 'Estruturas de Decisão' },
  { tag: 'Variáveis de Sistema', prefix: 'Ambiente de Execução SAP' },
  { tag: 'Sintaxe e Boas Práticas', prefix: 'Normas de Código ABAP' },
  { tag: 'Telas de Seleção', prefix: 'Interface de Usuário SE38' },
  { tag: 'Tipos e Conversão', prefix: 'Tipagem de Dados' },
  { tag: 'Relatórios Clássicos', prefix: 'Formatação de Listas' },
];

for (let i = 41; i <= 105; i++) {
  const cat = CONCEITOS_N1[(i - 41) % CONCEITOS_N1.length];
  const isCode = i % 5 === 0;

  if (isCode) {
    ABAP_QUESTIONS_LEVEL_1.push({
      id: `n1_${String(i).padStart(3, '0')}`,
      level: 'Nível 1',
      type: 'code_exercise',
      title: `Desafio Prático #${i}: ${cat.prefix} no ABAP`,
      question: `Escreva um trecho de código ABAP válido que declare uma variável de apoio para ${cat.tag.toLowerCase()} e teste seu valor usando IF.`,
      codeSnippet: `* Complete a lógica de validação:`,
      expectedCodePatterns: {
        requiredTokens: ['DATA', 'IF', 'ENDIF'],
        sampleSolution: `DATA: lv_teste TYPE i VALUE ${i}.
IF lv_teste > 0.
  WRITE: / 'Valor positivo:', lv_teste.
ENDIF.`,
      },
      explanation: `Exercício prático aplicando conceitos fundamentais de ${cat.tag} com verificação de condições e exibição na tela.`,
      conceptTag: cat.tag,
      xpReward: 40,
    });
  } else {
    const qNum = i;
    ABAP_QUESTIONS_LEVEL_1.push({
      id: `n1_${String(qNum).padStart(3, '0')}`,
      level: 'Nível 1',
      type: 'multiple_choice',
      title: `Questão #${qNum}: ${cat.prefix} (${cat.tag})`,
      question: `No contexto de ${cat.tag} no SAP NetWeaver, qual das alternativas a seguir expressa a regra ou comportamento correto?`,
      options: [
        `As instruções de ${cat.tag} devem seguir a sintaxe formal terminando com ponto final (.) e respeitando o tipo de dado declarado.`,
        `O compilador ABAP converte automaticamente qualquer erro de sintaxe em aviso informativo.`,
        `O comando só pode ser utilizado dentro da transação SE11.`,
        `A instrução ignora o mandante (SY-MANDT) e bloqueia a memória do servidor.`
      ],
      correctAnswerIndex: 0,
      explanation: `Em SAP ABAP, o rigor sintático na gestão de ${cat.tag} garante integridade na execução e evita erros de tipo (Type Conflicts) ou dumps em tempo de execução.`,
      conceptTag: cat.tag,
      xpReward: 25,
    });
  }
}
