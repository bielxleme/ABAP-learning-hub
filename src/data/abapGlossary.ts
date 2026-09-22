export interface AbapGlossaryEntry {
  term: string;
  title: string;
  category: 'Comando Open SQL' | 'Declaração de Dados' | 'Controle de Fluxo' | 'Variável de Sistema' | 'Entrada/Saída' | 'Modularização' | 'Modern ABAP 7.40+';
  summary: string;
  syntax: string;
  example: string;
  explanation: string;
  bestPractice: string;
  commonPitfall: string;
  relatedTerms: string[];
}

export const ABAP_GLOSSARY: Record<string, AbapGlossaryEntry> = {
  'REPORT': {
    term: 'REPORT',
    title: 'REPORT (Instrução Inicial de Programa Executável)',
    category: 'Declaração de Dados',
    summary: 'Define o início de um programa executável do tipo 1 no SAP ABAP.',
    syntax: 'REPORT z_nome_do_programa [MESSAGE-ID id] [NO STANDARD PAGE HEADING].',
    example: `REPORT z_relatorio_materiais NO STANDARD PAGE HEADING.

START-OF-SELECTION.
  WRITE: / 'Relatório iniciado com sucesso.'.`,
    explanation: 'A instrução REPORT é sempre a primeira linha de código executável em relatórios clássicos (SE38). Ela define o nome do objeto no repositório SAP e opções globais de tela.',
    bestPractice: 'Sempre utilize prefixos Z ou Y para programas customizados do cliente, respeitando a área de nomes da SAP.',
    commonPitfall: 'Não pode haver instruções executáveis antes do comando REPORT. Apenas linhas de comentário são permitidas antes dele.',
    relatedTerms: ['START-OF-SELECTION', 'PARAMETERS', 'TABLES']
  },

  'TABLES': {
    term: 'TABLES',
    title: 'TABLES (Declaração de Estrutura de Dicionário)',
    category: 'Declaração de Dados',
    summary: 'Declara uma work area global com o mesmo nome e estrutura de uma tabela do Data Dictionary (SE11).',
    syntax: 'TABLES: dbtab1, dbtab2.',
    example: `TABLES: mara, vbak.

PARAMETERS: p_matnr TYPE mara-matnr.`,
    explanation: 'Tradicionalmente usado para vincular campos de seleção na tela (PARAMETERS e SELECT-OPTIONS) aos elementos de dados do Dicionário SAP (SE11), herdando textos e ajudas de pesquisa (F4).',
    bestPractice: 'No ABAP moderno, utilize TABLES apenas quando for estritamente obrigatório para telas clássicas (Dynpros/Selection Screens). Evite para manipular dados em memória.',
    commonPitfall: 'Cria uma variável de estrutura global na memória, o que pode causar efeitos colaterais caso seja modificada em diferentes partes do programa.',
    relatedTerms: ['PARAMETERS', 'SELECT-OPTIONS', 'DATA']
  },

  'PARAMETERS': {
    term: 'PARAMETERS',
    title: 'PARAMETERS (Parâmetro de Entrada de Tela)',
    category: 'Entrada/Saída',
    summary: 'Cria um campo de entrada individual na tela de seleção inicial do usuário.',
    syntax: 'PARAMETERS: p_campo TYPE tipo [OBLIGATORY] [DEFAULT valor] [AS CHECKBOX].',
    example: `PARAMETERS: p_mtart TYPE mara-mtart DEFAULT 'KA' OBLIGATORY,
            p_ativo TYPE c LENGTH 1 AS CHECKBOX DEFAULT 'X'.`,
    explanation: 'O comando PARAMETERS gera automaticamente um campo na tela de seleção inicial (1000). O usuário pode digitar um valor único antes de executar o relatório.',
    bestPractice: 'Use o modificador OBLIGATORY para campos mandatórios e DEFAULT para sugerir valores padrão frequentes.',
    commonPitfall: 'PARAMETERS aceita apenas um único valor. Se o usuário precisar filtrar por múltiplos materiais ou intervalos, use SELECT-OPTIONS.',
    relatedTerms: ['SELECT-OPTIONS', 'AT SELECTION-SCREEN', 'TABLES']
  },

  'SELECT-OPTIONS': {
    term: 'SELECT-OPTIONS',
    title: 'SELECT-OPTIONS (Tabela de Seleção Complexa)',
    category: 'Entrada/Saída',
    summary: 'Gera um campo na tela que aceita intervalos (DE/ATÉ), múltiplos valores e exclusões.',
    syntax: 'SELECT-OPTIONS: s_campo FOR dbtab-campo [NO-EXTENSION] [NO INTERVALS].',
    example: `TABLES: mara.
SELECT-OPTIONS: s_matnr FOR mara-matnr.

START-OF-SELECTION.
  SELECT matnr, mtart FROM mara INTO TABLE @DATA(lt_mara)
    WHERE matnr IN @s_matnr.`,
    explanation: 'Gera uma tabela interna especial do tipo RANGE com 4 colunas: SIGN (I/E), OPTION (EQ/BT/CP/LE/GE), LOW e HIGH. Ao usar o operador IN no WHERE do SELECT, o SAP interpreta todas as regras automaticamente.',
    bestPractice: 'Sempre prefira SELECT-OPTIONS para relatórios analíticos, pois concede total flexibilidade de filtro ao usuário de negócios.',
    commonPitfall: 'Se a tabela interna de SELECT-OPTIONS estiver vazia, o filtro "WHERE matnr IN @s_matnr" seleciona TODOS os registros do banco.',
    relatedTerms: ['PARAMETERS', 'WHERE', 'SELECT']
  },

  'DATA': {
    term: 'DATA',
    title: 'DATA (Alocação de Variáveis em Memória)',
    category: 'Declaração de Dados',
    summary: 'Declara variáveis escalares, estruturas (work areas) ou tabelas internas na memória do programa.',
    syntax: 'DATA: gv_var TYPE tipo [VALUE valor], gt_tab TYPE TABLE OF tipo.',
    example: `DATA: gv_contador TYPE i VALUE 0,
      gv_data     TYPE d,
      ls_material TYPE mara,
      lt_materiais TYPE STANDARD TABLE OF mara WITH EMPTY KEY.`,
    explanation: 'Aloca espaço na memória da sessão de usuário. No ABAP 7.40+, também é possível declarar variáveis inline no próprio comando: DATA(lv_total) = 100.',
    bestPractice: 'Siga a convenção de nomenclatura húngara (gv_ para global, lv_ para local, ls_ para estrutura, lt_ para tabela interna).',
    commonPitfall: 'Declarar variáveis com nomes genéricos sem tipagem correta pode gerar truncamento de dados silencioso.',
    relatedTerms: ['TYPES', 'VALUE #()', 'CLEAR']
  },

  'TYPES': {
    term: 'TYPES',
    title: 'TYPES (Definição de Tipos Personalizados)',
    category: 'Declaração de Dados',
    summary: 'Cria novos tipos de dados definidos pelo programador sem alocar memória imediatamente.',
    syntax: 'TYPES: BEGIN OF ty_nome, campo1 TYPE tipo, campo2 TYPE tipo, END OF ty_nome.',
    example: `TYPES: BEGIN OF ty_resumo,
         matnr TYPE mara-matnr,
         maktx TYPE makt-maktx,
         estoque TYPE p LENGTH 8 DECIMALS 2,
       END OF ty_resumo.

DATA: lt_resumo TYPE TABLE OF ty_resumo.`,
    explanation: 'Permite modelar a forma exata dos dados que você precisa processar. Ao usar TYPES, você declara a "planta baixa", e depois usa DATA para criar instâncias.',
    bestPractice: 'Crie estruturas de tipos apenas com as colunas estritamente necessárias para a sua consulta SQL, economizando muita memória.',
    commonPitfall: 'Não confundir TYPES (apenas define um molde) com DATA (que realmente aloca memória).',
    relatedTerms: ['DATA', 'TABLES']
  },

  'SELECT': {
    term: 'SELECT',
    title: 'SELECT (Instrução Open SQL de Leitura do Banco)',
    category: 'Comando Open SQL',
    summary: 'Lê dados das tabelas do banco de dados relacional SAP para tabelas internas ou estruturas.',
    syntax: 'SELECT [SINGLE] campos FROM tabela INTO [TABLE] destino WHERE condicoes.',
    example: `SELECT matnr, mtart, meins
  FROM mara
  INTO TABLE @DATA(lt_materiais)
  WHERE mtart = 'KA'.

IF sy-subrc = 0.
  " Sucesso! lt_materiais contém os registros.
ENDIF.`,
    explanation: 'A instrução SELECT do Open SQL é traduzida pelo Database Interface (DBI) do SAP para o dialeto nativo do banco subjacente (ex: SAP HANA, Oracle, SQL Server).',
    bestPractice: 'Nunca use SELECT * em tabelas grandes. Especifique os campos necessários. No ABAP 7.40+, use o caractere @ antes das variáveis host.',
    commonPitfall: 'Fazer SELECT dentro de um LOOP (SELECT em loop) causa lentidão catastrófica no sistema SAP. Sempre traga os dados de uma só vez para uma tabela interna (FOR ALL ENTRIES ou JOIN).',
    relatedTerms: ['WHERE', 'SY-SUBRC', 'LOOP AT', 'INTO TABLE']
  },

  'LOOP AT': {
    term: 'LOOP AT',
    title: 'LOOP AT (Iteração sobre Tabelas Internas)',
    category: 'Controle de Fluxo',
    summary: 'Percorre registro por registro de uma tabela interna, copiando cada linha para uma work area.',
    syntax: 'LOOP AT itab INTO wa [WHERE condicao]. ... ENDLOOP.',
    example: `LOOP AT lt_materiais INTO ls_material WHERE mtart = 'KA'.
  WRITE: / ls_material-matnr, ls_material-maktx.
ENDLOOP.`,
    explanation: 'A cada iteração do LOOP, a variável de sistema SY-TABIX é incrementada com o índice da linha atual (1, 2, 3...). A instrução ENDLOOP fecha o bloco de repetição.',
    bestPractice: 'Para tabelas grandes, use "LOOP AT itab ASSIGNING <fs_wa>" com FIELD-SYMBOLS para evitar cópias redundantes de memória e acelerar o processamento.',
    commonPitfall: 'Modificar a própria tabela interna dentro do LOOP sem usar o comando MODIFY ou FIELD-SYMBOLS não surtirá efeito na tabela original.',
    relatedTerms: ['ENDLOOP', 'SY-TABIX', 'READ TABLE', 'FIELD-SYMBOLS']
  },

  'READ TABLE': {
    term: 'READ TABLE',
    title: 'READ TABLE (Busca Rápida de Linha em Tabela Interna)',
    category: 'Controle de Fluxo',
    summary: 'Lê uma linha específica de uma tabela interna com base em uma chave ou índice numérico.',
    syntax: 'READ TABLE itab INTO wa WITH KEY campo = valor [BINARY SEARCH].',
    example: `SORT lt_materiais BY matnr.

READ TABLE lt_materiais INTO ls_material
  WITH KEY matnr = '100-100'
  BINARY SEARCH.

IF sy-subrc = 0.
  WRITE: / 'Material encontrado:', ls_material-maktx.
ENDIF.`,
    explanation: 'Busca um único registro na tabela interna. Se encontrar, copia para a work area e define SY-SUBRC = 0 e SY-TABIX com a posição encontrada. Se não encontrar, define SY-SUBRC = 4.',
    bestPractice: 'Sempre ordene a tabela com SORT antes de usar BINARY SEARCH. A busca binária reduz a complexidade de O(N) para O(log N).',
    commonPitfall: 'Usar BINARY SEARCH em uma tabela interna sem ordená-la previamente causa leituras falsas e inconsistência.',
    relatedTerms: ['SORT', 'SY-SUBRC', 'SY-TABIX', 'LOOP AT']
  },

  'SY-SUBRC': {
    term: 'SY-SUBRC',
    title: 'SY-SUBRC (Código de Retorno do Sistema)',
    category: 'Variável de Sistema',
    summary: 'Registrador do sistema que indica se a última operação do SAP foi executada com sucesso ou falha.',
    syntax: 'IF sy-subrc = 0. "Sucesso. ELSE. "Falha/Não encontrado. ENDIF.',
    example: `SELECT SINGLE maktx FROM makt INTO @DATA(lv_texto) WHERE matnr = '100-100'.

IF sy-subrc = 0.
  WRITE: / 'Descrição:', lv_texto.
ELSE.
  WRITE: / 'Material não cadastrado na tabela MAKT.'.
ENDIF.`,
    explanation: 'A variável de sistema mais importante do ABAP! O valor 0 sempre significa "OK / Êxito". Qualquer valor diferente de 0 (geralmente 4 ou 8) significa que a busca falhou ou o registro não existe.',
    bestPractice: 'Sempre avalie o SY-SUBRC imediatamente após comandos como SELECT, READ TABLE, CALL FUNCTION e AUTHORITY-CHECK.',
    commonPitfall: 'Se você executar outro comando entre a operação e o IF, o valor de SY-SUBRC será sobrescrito pelo comando intermediário.',
    relatedTerms: ['SY-TABIX', 'SY-DBCNT', 'IF', 'SELECT']
  },

  'SY-TABIX': {
    term: 'SY-TABIX',
    title: 'SY-TABIX (Índice da Linha da Tabela Interna)',
    category: 'Variável de Sistema',
    summary: 'Armazena o índice da linha atual durante um LOOP AT ou após um READ TABLE.',
    syntax: 'gv_linha = sy-tabix.',
    example: `LOOP AT lt_materiais INTO ls_material.
  WRITE: / 'Processando item número:', sy-tabix, ls_material-matnr.
ENDLOOP.`,
    explanation: 'Em tabelas internas padrão (STANDARD TABLES), as linhas são numeradas de 1 até N. O registrador SY-TABIX informa exatamente em qual linha você está.',
    bestPractice: 'Muito útil para saber quando um READ TABLE encontrou a posição para inserir um registro com INSERT itab INDEX sy-tabix.',
    commonPitfall: 'Fora de um LOOP ou após operações que não manipulam tabelas indexadas, o valor de SY-TABIX é indefinido.',
    relatedTerms: ['LOOP AT', 'READ TABLE', 'SY-SUBRC']
  },

  'SY-DBCNT': {
    term: 'SY-DBCNT',
    title: 'SY-DBCNT (Contador de Registros do Banco)',
    category: 'Variável de Sistema',
    summary: 'Informa a quantidade exata de linhas afetadas pela última instrução de banco de dados (SELECT, UPDATE, DELETE, INSERT).',
    syntax: 'WRITE: / \'Linhas retornadas:\', sy-dbcnt.',
    example: `SELECT * FROM mara INTO TABLE @DATA(lt_todos) WHERE mtart = 'KA'.

WRITE: / 'Total de registros carregados do banco:', sy-dbcnt.`,
    explanation: 'Após qualquer comando SQL, o DBI (Database Interface) preenche SY-DBCNT com o número de linhas lidas ou modificadas.',
    bestPractice: 'Excelente para logs de execução e validação de quantidade de dados trafegados na rede.',
    commonPitfall: 'Não reflete o número de linhas de uma tabela interna em memória (para isso, use a função lines( itab )).',
    relatedTerms: ['SELECT', 'SY-SUBRC']
  },

  'WRITE': {
    term: 'WRITE',
    title: 'WRITE (Impressão em Lista / Spool Clássico)',
    category: 'Entrada/Saída',
    summary: 'Exibe dados no spool de saída clássico do relatório ABAP.',
    syntax: 'WRITE: [/][posicao(tamanho)] dado [COLOR col] [INTENSIFIED].',
    example: `WRITE: /(50) 'RELATÓRIO DE ESTOQUE' COLOR COL_HEADING,
       /  'Material:', ls_material-matnr COLOR COL_KEY,
       /  'Descrição:', ls_material-maktx.`,
    explanation: 'O comando WRITE direciona dados para a lista de apresentação clássica da Dynpro. A barra invertida "/" indica quebra para a próxima linha.',
    bestPractice: 'Em relatórios modernos para o usuário final, prefira exibir dados com ALV Grid (CL_SALV_TABLE), reservando o WRITE para logs e testes rápidos.',
    commonPitfall: 'Esquecer da barra "/" faz com que múltiplos campos sejam impressos lado a lado na mesma linha sem quebra.',
    relatedTerms: ['ULINE', 'SKIP', 'FORMAT']
  },

  'ULINE': {
    term: 'ULINE',
    title: 'ULINE (Linha Horizontal Divisória)',
    category: 'Entrada/Saída',
    summary: 'Desenha uma linha horizontal contínua na saída clássica do relatório.',
    syntax: 'ULINE [/(tamanho)].',
    example: `WRITE: / 'CABEÇALHO DO RELATÓRIO'.
ULINE.
WRITE: / 'Dados do relatório aqui...'.`,
    explanation: 'Gera uma linha de separação gráfica para organizar e estruturar visualmente tabelas e cabeçalhos em relatórios de texto.',
    bestPractice: 'Use para separar blocos de dados e seções de totais.',
    commonPitfall: 'Se não colocar quebra de linha antes ou depois, pode sobrepor caracteres adjacentes.',
    relatedTerms: ['WRITE', 'SKIP']
  },

  'CLEAR': {
    term: 'CLEAR',
    title: 'CLEAR (Limpeza de Conteúdo de Variável)',
    category: 'Declaração de Dados',
    summary: 'Restaura uma variável simples, estrutura ou linha ao seu valor inicial (vazio/zero).',
    syntax: 'CLEAR: variavel, estrutura.',
    example: `LOOP AT lt_pedidos INTO ls_pedido.
  " Processa pedido...
  CLEAR: ls_pedido. " Limpa para a próxima volta
ENDLOOP.`,
    explanation: 'Para números, CLEAR define 0; para textos/strings, define espaços em branco ou string vazia; para estruturas, limpa todos os seus campos.',
    bestPractice: 'Sempre limpe work areas antes de usá-las em novas operações para evitar vazamento de dados de iterações anteriores.',
    commonPitfall: 'CLEAR em uma tabela interna com Header Line limpa apenas o cabeçalho, não as linhas (para limpar a tabela inteira, use CLEAR itab[] ou REFRESH).',
    relatedTerms: ['REFRESH', 'FREE']
  },

  'APPEND': {
    term: 'APPEND',
    title: 'APPEND (Adicionar Linha ao Fim da Tabela Interna)',
    category: 'Controle de Fluxo',
    summary: 'Insere uma nova linha ao final de uma tabela interna.',
    syntax: 'APPEND wa TO itab.',
    example: `CLEAR ls_material.
ls_material-matnr = '100-999'.
ls_material-mtart = 'KA'.
APPEND ls_material TO lt_materiais.`,
    explanation: 'Copia os dados da work area e anexa como uma nova linha na última posição da tabela interna.',
    bestPractice: 'No ABAP 7.40+, é possível adicionar linhas diretamente sem declarar work area intermediária usando: lt_materiais = VALUE #( BASE lt_materiais ( matnr = \'100-999\' mtart = \'KA\' ) ).',
    commonPitfall: 'Se a tabela interna for do tipo SORTED ou HASHED, usar APPEND fora de ordem gerará erro em tempo de execução (DUMP). Nesses casos, use INSERT.',
    relatedTerms: ['INSERT', 'MODIFY', 'DELETE', 'VALUE #()']
  },

  'FIELD-SYMBOLS': {
    term: 'FIELD-SYMBOLS',
    title: 'FIELD-SYMBOLS (Ponteiros de Memória ABAP)',
    category: 'Declaração de Dados',
    summary: 'Define um ponteiro que referencia diretamente uma área de memória sem fazer cópia.',
    syntax: 'FIELD-SYMBOLS: <fs_nome> TYPE any [ou tipo_especifico].',
    example: `FIELD-SYMBOLS: <fs_mat> TYPE ty_material.

LOOP AT lt_materiais ASSIGNING <fs_mat>.
  <fs_mat>-maktx = 'Nome Atualizado'. " Modifica a tabela diretamente!
ENDLOOP.`,
    explanation: 'Ponteiros em ABAP funcionam como aliases. Quando você modifica o Field-Symbol, a memória original da tabela interna é alterada instantaneamente, sem necessidade de comando MODIFY!',
    bestPractice: 'Use sempre que for percorrer e alterar muitos registros de tabelas internas para obter ganho brutal de performance.',
    commonPitfall: 'Tentar acessar um Field-Symbol antes dele ser atribuído (não associado com ASSIGN) causa DUMP GETWA_NOT_ASSIGNED.',
    relatedTerms: ['ASSIGN', 'LOOP AT', 'DATA']
  },

  'CALL FUNCTION': {
    term: 'CALL FUNCTION',
    title: 'CALL FUNCTION (Invocação de Módulo de Função / BAPI)',
    category: 'Modularização',
    summary: 'Chama um bloco de código modularizado reutilizável registrado no Function Builder (SE37).',
    syntax: 'CALL FUNCTION \'NOME_DA_FUNCAO\' EXPORTING ... IMPORTING ... TABLES ... EXCEPTIONS ...',
    example: `CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'
  EXPORTING
    material = '100-100'
  IMPORTING
    material_general_data = ls_dados
  EXCEPTIONS
    material_not_found = 1
    OTHERS = 2.

IF sy-subrc = 0.
  " Dados obtidos com sucesso!
ENDIF.`,
    explanation: 'Módulos de função são a espinha dorsal da integração e lógica de negócio no SAP, incluindo BAPIs (Business Application Programming Interfaces).',
    bestPractice: 'Sempre trate as exceções (EXCEPTIONS) listadas e verifique o SY-SUBRC resultante.',
    commonPitfall: 'Se a BAPI efetua gravação de dados, ela não grava no banco até que você chame a função BAPI_TRANSACTION_COMMIT.',
    relatedTerms: ['SY-SUBRC', 'PERFORM']
  },

  'VALUE #()': {
    term: 'VALUE #()',
    title: 'VALUE #() (Operador Construtor de Expressões ABAP 7.40+)',
    category: 'Modern ABAP 7.40+',
    summary: 'Permite instanciar e preencher estruturas e tabelas internas em uma única linha elegante.',
    syntax: 'DATA(wa) = VALUE tipo( campo1 = val1 campo2 = val2 ).',
    example: `DATA(ls_material) = VALUE ty_material(
  matnr = '100-100'
  mtart = 'KA'
  maktx = 'Sensor Eletrônico KA'
).

DATA(lt_tabela) = VALUE ty_t_material(
  ( matnr = '100-100' mtart = 'KA' )
  ( matnr = '200-200' mtart = 'ROH' )
).`,
    explanation: 'Introduzido no ABAP 7.40, o construtor VALUE reduz dezenas de linhas de código antigo (vários APPENDs e CLEARs) para uma sintaxe expressiva e legível.',
    bestPractice: 'Adote amplamente o padrão Clean ABAP utilizando construtores inline para clareza e manutenção do código.',
    commonPitfall: 'O símbolo # infere o tipo automaticamente quando o contexto permite; se o tipo for ambíguo, especifique o nome do tipo explicitamente: VALUE ty_tabela( ... ).',
    relatedTerms: ['DATA', 'CORRESPONDING']
  },

  'ALV': {
    term: 'ALV',
    title: 'ALV (SAP List Viewer / Grid Display)',
    category: 'Entrada/Saída',
    summary: 'Componente padrão do SAP para exibição de relatórios em grade interativa com ordenação, filtros e exportação para Excel.',
    syntax: 'cl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo_alv) CHANGING t_table = lt_dados ). lo_alv->display( ).',
    example: `TRY.
    cl_salv_table=>factory(
      IMPORTING
        r_salv_table = DATA(lo_alv)
      CHANGING
        t_table      = lt_materiais ).

    lo_alv->get_functions( )->set_all( abap_true ).
    lo_alv->display( ).
  CATCH cx_salv_msg.
    WRITE: / 'Erro ao gerar visualizador ALV.'.
ENDTRY.`,
    explanation: 'O ALV (SAP List Viewer) é o padrão de ouro para visualização de relatórios empresariais no SAP NetWeaver e S/4HANA.',
    bestPractice: 'Prefira a classe moderna Orientada a Objetos CL_SALV_TABLE em vez das funções antigas REUSE_ALV_GRID_DISPLAY.',
    commonPitfall: 'A tabela passada para o ALV precisa ser do tipo STANDARD TABLE; tabelas SORTED ou com chave primária não padrão podem requerer conversão.',
    relatedTerms: ['WRITE', 'SELECT']
  },

  'IF': {
    term: 'IF',
    title: 'IF ... ELSEIF ... ELSE ... ENDIF (Estrutura Condicional)',
    category: 'Controle de Fluxo',
    summary: 'Executa blocos de instruções com base em condições lógicas booleanas.',
    syntax: 'IF condicao1. ... ELSEIF condicao2. ... ELSE. ... ENDIF.',
    example: `IF sy-subrc = 0.
  WRITE: / 'Operação realizada com sucesso!'.
ELSEIF sy-subrc = 4.
  WRITE: / 'Nenhum registro localizado.'.
ELSE.
  WRITE: / 'Erro de execução:', sy-subrc.
ENDIF.`,
    explanation: 'A instrução condicional básica do ABAP. Suporta operadores de comparação clássicos (=, <>, <, >, <=, >=) e palavras-chave (EQ, NE, LT, GT, LE, GE, IS INITIAL, IS NOT INITIAL).',
    bestPractice: 'Evite aninhamento excessivo de blocos IF dentro de outros IFs. Em vez disso, use CHECK ou separe em sub-rotinas/métodos.',
    commonPitfall: 'Sempre fechar o bloco com ENDIF. Esquecer o ponto final após cada instrução causará erro de sintaxe.',
    relatedTerms: ['CASE', 'CHECK', 'SY-SUBRC']
  },

  'CASE': {
    term: 'CASE',
    title: 'CASE ... WHEN ... ENDCASE (Seleção Múltipla)',
    category: 'Controle de Fluxo',
    summary: 'Avalia o valor de uma variável contra múltiplas opções pré-definidas.',
    syntax: 'CASE variavel. WHEN val1. ... WHEN val2. ... WHEN OTHERS. ... ENDCASE.',
    example: `CASE mara-mtart.
  WHEN 'FERT'.
    WRITE: / 'Produto Acabado'.
  WHEN 'ROH'.
    WRITE: / 'Matéria-Prima'.
  WHEN 'HALB'.
    WRITE: / 'Produto Semi-Acabado'.
  WHEN OTHERS.
    WRITE: / 'Outro tipo de material:', mara-mtart.
ENDCASE.`,
    explanation: 'Mais legível e performático do que uma longa cadeia de instruções ELSEIF quando estamos comparando uma única variável com múltiplos valores fixos.',
    bestPractice: 'Sempre inclua a cláusula WHEN OTHERS para tratar comportamentos não previstos de forma defensiva.',
    commonPitfall: 'Não use expressões lógicas complexas dentro de WHEN; ele compara apenas igualdade direta de valores.',
    relatedTerms: ['IF', 'SWITCH #()']
  },

  'CHECK': {
    term: 'CHECK',
    title: 'CHECK (Validação com Saída Condicional)',
    category: 'Controle de Fluxo',
    summary: 'Verifica uma condição: se verdadeira, continua; se falsa, interrompe o loop atual ou encerra a sub-rotina imediatamente.',
    syntax: 'CHECK condicao_logica.',
    example: `LOOP AT lt_itens INTO ls_item.
  CHECK ls_item-valor > 0. " Pula para a próxima volta se valor for 0 ou negativo
  gv_total = gv_total + ls_item-valor.
ENDLOOP.`,
    explanation: 'Dentro de um LOOP, o CHECK age como um CONTINUE condicional. Fora de loops (dentro de métodos ou FORMs), encerra imediatamente o bloco e retorna ao chamador.',
    bestPractice: 'Excelente para validação inicial de parâmetros (cláusula de guarda), mantendo o código plano e sem indentação profunda.',
    commonPitfall: 'Tenha cuidado ao usar CHECK fora de loops, pois ele encerra a execução de todo o método ou FORM!',
    relatedTerms: ['EXIT', 'CONTINUE', 'IF']
  },

  'EXIT': {
    term: 'EXIT',
    title: 'EXIT (Interrupção Imediata de Laço ou Bloco)',
    category: 'Controle de Fluxo',
    summary: 'Encerra imediatamente a iteração de um loop (LOOP, DO, WHILE) ou aborta a execução da sub-rotina atual.',
    syntax: 'EXIT.',
    example: `LOOP AT lt_materiais INTO ls_material.
  IF ls_material-estoque = 0.
    WRITE: / 'Primeiro material esgotado encontrado:', ls_material-matnr.
    EXIT. " Sai do LOOP imediatamente
  ENDIF.
ENDLOOP.`,
    explanation: 'Interrompe o laço de repetição no ato, transferindo o controle do programa para a instrução imediatamente posterior a ENDLOOP/ENDDO/ENDWHILE.',
    bestPractice: 'Use EXIT para sair de buscas sequenciais assim que encontrar o elemento desejado, economizando processamento da CPU.',
    commonPitfall: 'Não confundir com CONTINUE (que apenas pula a iteração corrente) ou RETURN (que encerra o método inteiro).',
    relatedTerms: ['CONTINUE', 'CHECK', 'RETURN']
  },

  'CONTINUE': {
    term: 'CONTINUE',
    title: 'CONTINUE (Salto para Próxima Volta do Laço)',
    category: 'Controle de Fluxo',
    summary: 'Ignora o restante do corpo do loop atual e salta imediatamente para a próxima iteração.',
    syntax: 'CONTINUE.',
    example: `LOOP AT lt_clientes INTO ls_cliente.
  IF ls_cliente-bloqueado = 'X'.
    CONTINUE. " Não processa clientes bloqueados
  ENDIF.
  PERFORM f_emitir_cobranca USING ls_cliente.
ENDLOOP.`,
    explanation: 'Diferente de EXIT, CONTINUE não cancela o loop inteiro; apenas encerra a volta atual e passa para a próxima linha da tabela interna.',
    bestPractice: 'Utilize para pular registros irrelevantes ou desativados sem precisar aninhar todo o resto do código dentro de um IF.',
    commonPitfall: 'CONTINUE só é válido dentro de blocos de repetição (LOOP, DO, WHILE). Fora de loops causará erro de compilação.',
    relatedTerms: ['EXIT', 'CHECK', 'LOOP AT']
  },

  'SORT': {
    term: 'SORT',
    title: 'SORT (Ordenação de Tabelas Internas)',
    category: 'Controle de Fluxo',
    summary: 'Ordena as linhas de uma tabela interna de acordo com a chave primária ou colunas específicas.',
    syntax: 'SORT itab [BY campo1 [ASCENDING|DESCENDING] campo2 ...].',
    example: `SORT lt_vendas BY kunnr ASCENDING netwr DESCENDING.`,
    explanation: 'A ordenação é fundamental para garantir previsibilidade e para permitir buscas ultra-rápidas com READ TABLE ... BINARY SEARCH e instruções DELETE ADJACENT DUPLICATES.',
    bestPractice: 'Sempre faça SORT antes de READ TABLE com BINARY SEARCH ou DELETE ADJACENT DUPLICATES.',
    commonPitfall: 'Tabelas do tipo SORTED e HASHED já possuem ordenação garantida pela arquitetura e geram erro caso você tente usar o comando SORT nelas.',
    relatedTerms: ['READ TABLE', 'DELETE']
  },

  'MODIFY': {
    term: 'MODIFY',
    title: 'MODIFY (Atualização de Linha em Tabela ou Banco)',
    category: 'Controle de Fluxo',
    summary: 'Atualiza o conteúdo de uma linha de tabela interna ou insere/atualiza registros no banco de dados.',
    syntax: 'MODIFY itab FROM wa [INDEX idx]. | MODIFY dbtab FROM wa.',
    example: `ls_material-maktx = 'Nome Atualizado'.
MODIFY lt_materiais FROM ls_material INDEX sy-tabix.`,
    explanation: 'No contexto de tabelas internas, copia os dados da work area para a linha especificada pelo índice. No banco de dados, atua como "Upsert" (se existe atualiza, se não existe insere).',
    bestPractice: 'Em loops grandes, prefira FIELD-SYMBOLS com ASSIGNING em vez de MODIFY itab FROM wa, pois evita cópias desnecessárias de memória.',
    commonPitfall: 'Se esquecer de passar INDEX sy-tabix dentro de um loop clássico, o SAP pode tentar atualizar o cabeçalho de tabelas legadas com Header Line.',
    relatedTerms: ['APPEND', 'INSERT', 'FIELD-SYMBOLS']
  },

  'CORRESPONDING': {
    term: 'CORRESPONDING',
    title: 'CORRESPONDING #( ) (Mapeamento Automático por Nomes Iguais)',
    category: 'Modern ABAP 7.40+',
    summary: 'Copia automaticamente os valores entre duas estruturas ou tabelas internas onde os nomes dos campos coincidem.',
    syntax: 'destino = CORRESPONDING #( origem [MAPPING campo_dest = campo_orig] ).',
    example: `TYPES: BEGIN OF ty_alvo,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
       END OF ty_alvo.

DATA(ls_alvo) = CORRESPONDING ty_alvo( ls_mara ).`,
    explanation: 'Substituto moderno e seguro da instrução legada MOVE-CORRESPONDING. Permite mapeamentos inline e conversão direta de tabelas inteiras.',
    bestPractice: 'Use a cláusula MAPPING para correlacionar campos com nomes distintos e EXCEPT para excluir campos sensíveis da cópia.',
    commonPitfall: 'Campos com tipos de dados incompatíveis podem causar truncamento ou conversão inesperada.',
    relatedTerms: ['VALUE #()', 'DATA']
  },

  'COND': {
    term: 'COND',
    title: 'COND #( ) (Operador Condicional Ternário Moderno)',
    category: 'Modern ABAP 7.40+',
    summary: 'Avalia expressões inline e retorna um valor diretamente para atribuição em uma única linha.',
    syntax: 'resultado = COND #( WHEN cond1 THEN val1 [WHEN cond2 THEN val2] ELSE val_padrao ).',
    example: `DATA(lv_status_desc) = COND string(
  WHEN sy-subrc = 0 THEN 'Processado com Sucesso'
  WHEN sy-subrc = 4 THEN 'Aviso: Registro não encontrado'
  ELSE 'Erro Crítico no Sistema'
).`,
    explanation: 'Elimina blocos verbosos de IF ... ELSEIF ... ENDIF apenas para preencher uma variável, tornando o código conciso e fluído.',
    bestPractice: 'Especifique o tipo de retorno explicitamente (como COND string(...) ou COND ty_tipo(...)) para evitar ambiguidades de inferência.',
    commonPitfall: 'Todas as ramificações THEN e ELSE devem retornar tipos compatíveis com a variável de destino.',
    relatedTerms: ['SWITCH #()', 'IF']
  },

  'SWITCH': {
    term: 'SWITCH',
    title: 'SWITCH #( ) (Operador de Seleção Inline 7.40+)',
    category: 'Modern ABAP 7.40+',
    summary: 'Equivalente inline da instrução CASE para atribuição direta de valores baseados em chave única.',
    syntax: 'resultado = SWITCH #( variavel WHEN val1 THEN res1 ... ELSE res_padrao ).',
    example: `DATA(lv_tipo_nome) = SWITCH #( mara-mtart
  WHEN 'FERT' THEN 'Produto Final'
  WHEN 'ROH'  THEN 'Matéria-Prima Bruta'
  WHEN 'HALB' THEN 'Semi-Acabado'
  ELSE 'Genérico / Outros'
).`,
    explanation: 'Permite selecionar valores inline de forma elegante, muito útil em preenchimento de colunas ALV e logs de processamento.',
    bestPractice: 'Sempre forneça uma cláusula ELSE para cobrir valores novos do dicionário de dados.',
    commonPitfall: 'Diferente de COND, SWITCH aceita apenas valores diretos de igualdade com a variável chave.',
    relatedTerms: ['CASE', 'COND #()']
  },

  'MESSAGE': {
    term: 'MESSAGE',
    title: 'MESSAGE (Disparo de Mensagens de Sistema e Exceção)',
    category: 'Entrada/Saída',
    summary: 'Exibe avisos, erros bloqueantes ou mensagens informativas na barra de status da Dynpro.',
    syntax: 'MESSAGE [tipo][numero](classe) WITH v1 v2 v3 v4.',
    example: `MESSAGE e001(zmsg) WITH 'Material não cadastrado' mara-matnr.
" Ou mensagem livre (ABAP 7.40+):
MESSAGE 'Operação finalizada' TYPE 'S'.`,
    explanation: 'Os tipos de mensagem determinam a severidade: S (Sucesso - verde na barra de status), I (Informação - popup modal), W (Aviso - permite ignorar com Enter), E (Erro - bloqueia execução), A (Abort - encerra a transação), X (Exit - gera DUMP de sistema).',
    bestPractice: 'Crie classes de mensagens na SE91 em vez de usar strings fixas, facilitando a tradução internacional.',
    commonPitfall: 'Disparar mensagens do tipo E em processos de background (Job SM37) encerra imediatamente o job com status CANCELADO.',
    relatedTerms: ['SE91', 'SY-MSGID', 'SY-MSGNO']
  },

  'COMMIT WORK': {
    term: 'COMMIT WORK',
    title: 'COMMIT WORK (Confirmação de Transação no Banco)',
    category: 'Modularização',
    summary: 'Grava em definitivo todas as alterações pendentes no banco de dados e executa módulos de atualização registrados.',
    syntax: 'COMMIT WORK [AND WAIT].',
    example: `CALL FUNCTION 'BAPI_MATERIAL_SAVEDATA'
  EXPORTING ...
  IMPORTING RETURN = ls_return.

IF ls_return-type <> 'E'.
  COMMIT WORK AND WAIT.
  WRITE: / 'Material gravado com sucesso no banco de dados.'.
ELSE.
  ROLLBACK WORK.
  WRITE: / 'Erro detectado. Nenhuma alteração gravada.'.
ENDIF.`,
    explanation: 'O SAP utiliza a arquitetura LUW (Logical Unit of Work). Nenhuma alteração feita por BAPIs ou instruções de update é persistida de verdade até o disparo de COMMIT WORK.',
    bestPractice: 'Em integrações e chamadas de BAPI, sempre use a cláusula AND WAIT para garantir que a transação terminou antes do próximo passo.',
    commonPitfall: 'Nunca execute COMMIT WORK dentro de USER-EXITS, BADIs ou BAPIs que não sejam os pontos finais de orquestração.',
    relatedTerms: ['ROLLBACK WORK', 'CALL FUNCTION']
  },

  'AUTHORITY-CHECK': {
    term: 'AUTHORITY-CHECK',
    title: 'AUTHORITY-CHECK (Verificação de Permissões de Usuário)',
    category: 'Modularização',
    summary: 'Valida se o usuário que está executando o relatório tem perfil e autorização de segurança para o objeto/ação.',
    syntax: 'AUTHORITY-CHECK OBJECT \'objeto\' ID \'campo\' FIELD valor ID \'ACTVT\' FIELD \'03\'.',
    example: `AUTHORITY-CHECK OBJECT 'M_MATE_STA'
  ID 'ACTVT' FIELD '03' " 03 = Exibir
  ID 'STATM' FIELD 'K'.

IF sy-subrc <> 0.
  MESSAGE 'Você não tem permissão para visualizar estes materiais.' TYPE 'E'.
ENDIF.`,
    explanation: 'A segurança corporativa do SAP depende deste comando. Se o usuário tiver autorização correspondente na transação SU53/PFCG, SY-SUBRC retorna 0; caso contrário, retorna 4 ou 12.',
    bestPractice: 'Sempre insira checagens de autorização em transações customizadas antes de exibir dados financeiros ou confidenciais.',
    commonPitfall: 'Esquecer de validar o SY-SUBRC logo após o AUTHORITY-CHECK torna a verificação inútil.',
    relatedTerms: ['SY-SUBRC', 'PFCG', 'SU53']
  },

  'FOR ALL ENTRIES': {
    term: 'FOR ALL ENTRIES',
    title: 'FOR ALL ENTRIES IN (Junção Otimizada de Banco)',
    category: 'Comando Open SQL',
    summary: 'Lê dados de uma tabela de banco com base nas chaves contidas em uma tabela interna pré-carregada na memória.',
    syntax: 'SELECT campos FROM dbtab INTO TABLE itab2 FOR ALL ENTRIES IN itab1 WHERE campo = itab1-campo.',
    example: `IF lt_mara IS NOT INITIAL.
  SELECT matnr, maktx, spras
    FROM makt
    INTO TABLE @DATA(lt_makt)
    FOR ALL ENTRIES IN @lt_mara
    WHERE matnr = @lt_mara-matnr
      AND spras = 'P'.
ENDIF.`,
    explanation: 'O comando clássico de alta performance no SAP para trazer dados dependentes de tabelas sem fazer SELECT dentro de loops.',
    bestPractice: 'REGRA DE OURO DO ABAP: SEMPRE valide "IF itab IS NOT INITIAL" antes de executar um FOR ALL ENTRIES. Se a tabela interna estiver vazia, o SAP ignorará a cláusula WHERE inteira e fará FULL SCAN na tabela do banco!',
    commonPitfall: 'Executar FOR ALL ENTRIES com a tabela interna vazia puxa milhões de registros e derruba a memória do servidor.',
    relatedTerms: ['SELECT', 'WHERE', 'INNER JOIN']
  },

  'SE38': {
    term: 'SE38',
    title: 'SE38 (ABAP Editor Clássico)',
    category: 'Modularização',
    summary: 'Transação central para criar, editar, compilar e depurar programas executáveis e includes ABAP.',
    syntax: 'Transação /nSE38 no campo de comando OK-Code.',
    example: `/nSE38 -> Programa: Z_RELATORIO_ESTOQUE -> Botão Criar/Modificar -> Executar (F8)`,
    explanation: 'A ferramenta mais emblemática da história do SAP. Permite a codificação de relatórios executáveis tipo 1, módulos de tela Dynpro e rotinas de sistema.',
    bestPractice: 'Sempre verifique a sintaxe (Ctrl+F2) e ative os objetos (Ctrl+F3) antes de rodar os testes.',
    commonPitfall: 'Modificar código diretamente no ambiente de produção sem passar pelos mandantes de desenvolvimento (DEV) e qualidade (QAS) via Transport Request.',
    relatedTerms: ['REPORT', 'SE80', 'SE11']
  },

  'SE11': {
    term: 'SE11',
    title: 'SE11 (ABAP Dictionary / Dicionário de Dados)',
    category: 'Declaração de Dados',
    summary: 'Criação e manutenção de tabelas transparentes, estruturas, domínios, elementos de dados e views.',
    syntax: 'Transação /nSE11 no campo de comando OK-Code.',
    example: `/nSE11 -> Tabela: MARA -> Exibir campos, tipos de dados, chaves primárias e índices.`,
    explanation: 'O coração do modelo de dados relacional do SAP. No SE11 são definidos os Data Elements com seus textos e ajudas de pesquisa (F4 Help).',
    bestPractice: 'Reutilize elementos de dados padrão da SAP sempre que possível para manter consistência semântica nos relatórios.',
    commonPitfall: 'Alterar a estrutura de tabelas padrão do standard SAP (como MARA, VBAK) sem o devido uso de Append Structures.',
    relatedTerms: ['TABLES', 'TYPES', 'DATA']
  }
};
