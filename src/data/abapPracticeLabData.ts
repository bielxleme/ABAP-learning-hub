import { LabExercise } from '../types';

export const ABAP_PRACTICE_LAB_EXERCISES: LabExercise[] = [
  // ==========================================
  // PARTE 1: SELECT & OPEN SQL (55 EXERCÍCIOS)
  // ==========================================
  {
    id: 'lab_sql_001',
    title: 'SELECT SINGLE Básico em MARA',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Escreva um comando SELECT SINGLE para buscar o material "100-100" da tabela MARA, gravando na estrutura wa_mara.',
    initialCode: `* Escreva a consulta SELECT SINGLE:
`,
    solutionPattern: {
      requiredTokens: ['SELECT SINGLE', 'FROM MARA', 'INTO WA_MARA', 'WHERE MATNR ='],
      sampleSolution: `SELECT SINGLE * FROM mara INTO wa_mara WHERE matnr = '100-100'.`,
    },
    explanation: 'SELECT SINGLE retorna no máximo 1 linha correspondente do banco e define SY-SUBRC = 0 se encontrado.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_002',
    title: 'SELECT INTO TABLE em Tabela Interna',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte todos os materiais do tipo "ROH" da tabela MARA e guarde na tabela interna lt_materiais.',
    initialCode: `* Escreva a consulta com INTO TABLE:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM MARA', 'INTO TABLE LT_MATERIAIS', 'WHERE MTART ='],
      sampleSolution: `SELECT * FROM mara INTO TABLE lt_materiais WHERE mtart = 'ROH'.`,
    },
    explanation: 'INTO TABLE substitui o conteúdo prévio da tabela interna e preenche com os registros encontrados pelo SELECT.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_003',
    title: 'SELECT UP TO N ROWS Limitador',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Escreva uma consulta na tabela KNA1 para buscar no máximo 10 clientes, armazenando em lt_clientes.',
    initialCode: `* Limite a busca em até 10 linhas:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'UP TO 10 ROWS', 'FROM KNA1', 'INTO TABLE LT_CLIENTES'],
      sampleSolution: `SELECT * UP TO 10 ROWS FROM kna1 INTO TABLE lt_clientes.`,
    },
    explanation: 'UP TO n ROWS limita a busca aos primeiros n registros no banco, economizando rede e memória da aplicação.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_004',
    title: 'SELECT com Lista Específica de Campos',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Boas práticas: em vez de SELECT *, selecione apenas os campos MATNR e MTART da tabela MARA para a tabela lt_mat_resumo.',
    initialCode: `* Projete apenas matnr e mtart:
`,
    solutionPattern: {
      requiredTokens: ['SELECT MATNR', 'MTART', 'FROM MARA', 'INTO TABLE LT_MAT_RESUMO'],
      sampleSolution: `SELECT matnr mtart FROM mara INTO TABLE lt_mat_resumo.`,
    },
    explanation: 'Especificar colunas em vez de SELECT * reduz drásticamente o tráfego entre a base de dados e o servidor de aplicação.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_005',
    title: 'SELECT SINGLE com Cláusula AND',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Busque um registro único da tabela MARC onde matnr = "100-100" e werks = "1000", gravando em wa_marc.',
    initialCode: `* Combine duas condições no WHERE com AND:
`,
    solutionPattern: {
      requiredTokens: ['SELECT SINGLE', 'FROM MARC', 'INTO WA_MARC', 'WHERE MATNR =', 'AND WERKS ='],
      sampleSolution: `SELECT SINGLE * FROM marc INTO wa_marc WHERE matnr = '100-100' AND werks = '1000'.`,
    },
    explanation: 'Em tabelas com chave composta (como MARC: MATNR + WERKS), especifique todos os campos-chave para máxima eficiência.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_006',
    title: 'SELECT com ORDER BY Ascendente',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Selecione todos os pedidos de venda da tabela VBAK para lt_pedidos ordenando pelo número do pedido (vbeln) de forma ascendente.',
    initialCode: `* Use ORDER BY vbeln:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM VBAK', 'INTO TABLE LT_PEDIDOS', 'ORDER BY VBELN'],
      sampleSolution: `SELECT * FROM vbak INTO TABLE lt_pedidos ORDER BY vbeln ASCENDING.`,
    },
    explanation: 'ORDER BY garante a ordem dos registros retornados diretamente pelo otimizador do banco de dados.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_007',
    title: 'SELECT com ORDER BY Descendente',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte os clientes da tabela KNA1 para lt_clientes ordenando pelo código kunnr de forma decrescente.',
    initialCode: `* Use ORDER BY kunnr DESCENDING:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM KNA1', 'INTO TABLE LT_CLIENTES', 'ORDER BY KUNNR DESCENDING'],
      sampleSolution: `SELECT * FROM kna1 INTO TABLE lt_clientes ORDER BY kunnr DESCENDING.`,
    },
    explanation: 'DESCENDING ordena do maior para o menor.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_008',
    title: 'SELECT com Operador IN e Range Table',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte a tabela MARA para lt_materiais filtrando o campo matnr pela tabela de intervalos s_matnr (SELECT-OPTIONS).',
    initialCode: `* Filtre com WHERE matnr IN s_matnr:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM MARA', 'INTO TABLE LT_MATERIAIS', 'WHERE MATNR IN S_MATNR'],
      sampleSolution: `SELECT * FROM mara INTO TABLE lt_materiais WHERE matnr IN s_matnr.`,
    },
    explanation: 'A cláusula IN avalia ranges e select-options automaticamente com sinais SIGN e opções OPTION (EQ, BT, etc.).',
    xpReward: 35,
  },
  {
    id: 'lab_sql_009',
    title: 'SELECT com Operador BETWEEN',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte a tabela VBAK para lt_pedidos onde a data erdat esteja entre "20260101" e "20261231".',
    initialCode: `* Use a cláusula BETWEEN:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM VBAK', 'INTO TABLE LT_PEDIDOS', 'WHERE ERDAT BETWEEN', 'AND'],
      sampleSolution: `SELECT * FROM vbak INTO TABLE lt_pedidos WHERE erdat BETWEEN '20260101' AND '20261231'.`,
    },
    explanation: 'BETWEEN inclui ambos os valores limítrofes na consulta SQL.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_010',
    title: 'SELECT com Operador LIKE (Curinga)',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte a tabela KNA1 para lt_clientes onde o nome (name1) comece com a letra "A" usando o operador LIKE e o curinga %.',
    initialCode: `* Busque clientes cujo nome começa com A:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM KNA1', 'INTO TABLE LT_CLIENTES', 'WHERE NAME1 LIKE', "'A%'"],
      sampleSolution: `SELECT * FROM kna1 INTO TABLE lt_clientes WHERE name1 LIKE 'A%'.`,
    },
    explanation: 'No SAP Open SQL, % representa qualquer sequência de caracteres e _ representa um único caractere.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_011',
    title: 'Função de Agregação COUNT( * )',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Conte a quantidade total de materiais do tipo "FERT" na tabela MARA e guarde o resultado na variável lv_total.',
    initialCode: `* Use COUNT( * ) INTO lv_total:
`,
    solutionPattern: {
      requiredTokens: ['SELECT COUNT(', 'FROM MARA', 'INTO LV_TOTAL', 'WHERE MTART ='],
      sampleSolution: `SELECT COUNT( * ) FROM mara INTO lv_total WHERE mtart = 'FERT'.`,
    },
    explanation: 'COUNT( * ) executa a contagem diretamente no motor de banco de dados, sem trafegar dados de linhas.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_012',
    title: 'Função de Agregação SUM( netwr )',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Some o valor total líquido (campo netwr) de todos os pedidos da tabela VBAK para a variável lv_soma_total.',
    initialCode: `* Use SUM( netwr ) INTO lv_soma_total:
`,
    solutionPattern: {
      requiredTokens: ['SELECT SUM( NETWR )', 'FROM VBAK', 'INTO LV_SOMA_TOTAL'],
      sampleSolution: `SELECT SUM( netwr ) FROM vbak INTO lv_soma_total.`,
    },
    explanation: 'A agregação SUM totaliza os valores decimais ou inteiros no banco de dados.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_013',
    title: 'Função de Agregação MAX( netwr )',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Descubra o maior valor de pedido (netwr) na tabela VBAK e armazene na variável lv_maior_pedido.',
    initialCode: `* Use MAX( netwr ):
`,
    solutionPattern: {
      requiredTokens: ['SELECT MAX( NETWR )', 'FROM VBAK', 'INTO LV_MAIOR_PEDIDO'],
      sampleSolution: `SELECT MAX( netwr ) FROM vbak INTO lv_maior_pedido.`,
    },
    explanation: 'MAX retorna o valor máximo de uma coluna no conjunto filtrado.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_014',
    title: 'Função de Agregação MIN( netwr )',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Descubra o menor valor de pedido (netwr) na tabela VBAK com auart = "OR" e armazene na variável lv_menor_pedido.',
    initialCode: `* Use MIN( netwr ) com filtro WHERE auart = 'OR':
`,
    solutionPattern: {
      requiredTokens: ['SELECT MIN( NETWR )', 'FROM VBAK', 'INTO LV_MENOR_PEDIDO', 'WHERE AUART ='],
      sampleSolution: `SELECT MIN( netwr ) FROM vbak INTO lv_menor_pedido WHERE auart = 'OR'.`,
    },
    explanation: 'MIN calcula o menor valor da coluna no banco de dados.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_015',
    title: 'SELECT com APPENDING TABLE',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Adicione os materiais do tipo "HALB" ao final da tabela interna lt_materiais existente sem apagar os dados anteriores usando APPENDING TABLE.',
    initialCode: `* Use APPENDING TABLE lt_materiais:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM MARA', 'APPENDING TABLE LT_MATERIAIS', 'WHERE MTART ='],
      sampleSolution: `SELECT * FROM mara APPENDING TABLE lt_materiais WHERE mtart = 'HALB'.`,
    },
    explanation: 'APPENDING TABLE adiciona os registros ao final da tabela interna em vez de sobrescrevê-la como faz o INTO TABLE.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_016',
    title: 'Verificação do SY-SUBRC após SELECT',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Complete a verificação do comando SELECT SINGLE: se sy-subrc for zero escreva "Encontrado", caso contrário "Não Encontrado".',
    initialCode: `SELECT SINGLE * FROM mara INTO wa_mara WHERE matnr = '100-100'.
* Verifique sy-subrc:
`,
    solutionPattern: {
      requiredTokens: ['IF SY-SUBRC = 0', 'WRITE', 'ELSE', 'ENDIF'],
      sampleSolution: `IF sy-subrc = 0.
  WRITE: / 'Encontrado'.
ELSE.
  WRITE: / 'Não Encontrado'.
ENDIF.`,
    },
    explanation: 'SY-SUBRC = 0 indica sucesso total; qualquer valor diferente de zero indica que nenhum registro atendeu à condição.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_017',
    title: 'SELECT com Declaração Inline @DATA (Clean ABAP)',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Escreva uma consulta moderna selecionando matnr e mtart da tabela MARA direto para uma tabela interna criada em linha @DATA(lt_dados).',
    initialCode: `* Sintaxe moderna ABAP 7.40+:
`,
    solutionPattern: {
      requiredTokens: ['SELECT MATNR,', 'MTART', 'FROM MARA', 'INTO TABLE @DATA(LT_DADOS)'],
      sampleSolution: `SELECT matnr, mtart FROM mara INTO TABLE @DATA(lt_dados).`,
    },
    explanation: 'No ABAP 7.40+, variáveis são escapadas com @ e criadas inline com @DATA(...) dispensando declaração prévia.',
    xpReward: 40,
  },
  {
    id: 'lab_sql_018',
    title: 'SELECT com Variável Host Escapada com @',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte a tabela KNA1 para @DATA(lt_clientes) filtrando land1 = @lv_pais usando escape moderno.',
    initialCode: `* Escapar a variável lv_pais com @:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM KNA1', 'INTO TABLE @DATA(LT_CLIENTES)', 'WHERE LAND1 = @LV_PAIS'],
      sampleSolution: `SELECT * FROM kna1 INTO TABLE @DATA(lt_clientes) WHERE land1 = @lv_pais.`,
    },
    explanation: 'No novo Open SQL, qualquer variável ABAP do programa (host variable) deve ser prefixada com @ dentro da cláusula SQL.',
    xpReward: 40,
  },
  {
    id: 'lab_sql_019',
    title: 'INNER JOIN entre MARA e MAKT',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Escreva um INNER JOIN entre MARA e MAKT ligando pelo campo matnr para trazer mara~matnr e makt~maktx para lt_resultado onde spras = "P".',
    initialCode: `* Realize o INNER JOIN:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'MARA~MATNR', 'MAKT~MAKTX', 'FROM MARA INNER JOIN MAKT ON MARA~MATNR = MAKT~MATNR', 'INTO TABLE LT_RESULTADO', 'WHERE MAKT~SPRAS ='],
      sampleSolution: `SELECT mara~matnr makt~maktx FROM mara INNER JOIN makt ON mara~matnr = makt~matnr INTO TABLE lt_resultado WHERE makt~spras = 'P'.`,
    },
    explanation: 'INNER JOIN relaciona tabelas diretamente no banco através de sua chave estrangeira, evitando múltiplos SELECTs sequenciais.',
    xpReward: 45,
  },
  {
    id: 'lab_sql_020',
    title: 'INNER JOIN entre VBAK e VBAP',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte cabeçalho (VBAK) e itens (VBAP) de ordens de venda via INNER JOIN na chave vbeln para lt_ordens.',
    initialCode: `* Junte VBAK e VBAP:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'VBAK~VBELN', 'VBAP~POSNR', 'FROM VBAK INNER JOIN VBAP ON VBAK~VBELN = VBAP~VBELN', 'INTO TABLE LT_ORDENS'],
      sampleSolution: `SELECT vbak~vbeln vbap~posnr vbap~matnr FROM vbak INNER JOIN vbap ON vbak~vbeln = vbap~vbeln INTO TABLE lt_ordens.`,
    },
    explanation: 'Relação clássica de documentos comerciais SAP: VBAK (Header) e VBAP (Item).',
    xpReward: 45,
  },
  {
    id: 'lab_sql_021',
    title: 'SELECT com GROUP BY e COUNT',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Agrupe a tabela MARA pelo tipo de material (mtart) e conte a quantidade de materiais de cada tipo para lt_totais.',
    initialCode: `* Agrupe por mtart:
`,
    solutionPattern: {
      requiredTokens: ['SELECT MTART', 'COUNT(', 'FROM MARA', 'INTO TABLE LT_TOTAIS', 'GROUP BY MTART'],
      sampleSolution: `SELECT mtart COUNT( * ) AS total FROM mara INTO TABLE lt_totais GROUP BY mtart.`,
    },
    explanation: 'GROUP BY agrupa linhas com o mesmo valor em colunas especificadas para aplicar funções agregadas.',
    xpReward: 45,
  },
  {
    id: 'lab_sql_022',
    title: 'Cláusula HAVING com Agregação',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Adicione HAVING na consulta agrupada por mtart para retornar apenas os grupos que possuem mais de 5 materiais (COUNT(*) > 5).',
    initialCode: `* Use GROUP BY mtart HAVING count( * ) > 5:
`,
    solutionPattern: {
      requiredTokens: ['GROUP BY MTART', 'HAVING COUNT(', '> 5'],
      sampleSolution: `SELECT mtart COUNT( * ) FROM mara INTO TABLE lt_totais GROUP BY mtart HAVING count( * ) > 5.`,
    },
    explanation: 'WHERE filtra linhas antes do agrupamento; HAVING filtra os grupos após a agregação.',
    xpReward: 45,
  },
  {
    id: 'lab_sql_023',
    title: 'SELECT com FOR ALL ENTRIES IN',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Selecione os textos da tabela MAKT para lt_makt com FOR ALL ENTRIES na tabela lt_mara ligando por matnr.',
    initialCode: `* Cuidado: antes de FOR ALL ENTRIES garanta que a tabela não está vazia!
IF lt_mara IS NOT INITIAL.
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM MAKT', 'FOR ALL ENTRIES IN LT_MARA', 'WHERE MATNR = LT_MARA-MATNR', 'ENDIF'],
      sampleSolution: `IF lt_mara IS NOT INITIAL.
  SELECT matnr spras maktx FROM makt INTO TABLE lt_makt FOR ALL ENTRIES IN lt_mara WHERE matnr = lt_mara-matnr AND spras = 'P'.
ENDIF.`,
    },
    explanation: 'REGRA DE OURO: Sempre valide "IF itab IS NOT INITIAL" antes de FOR ALL ENTRIES, senão o SAP converterá em SELECT * trazendo toda a tabela!',
    xpReward: 50,
  },
  {
    id: 'lab_sql_024',
    title: 'Alias de Campo com AS',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Renomeie o campo matnr para codigo_material e maktx para descricao_material usando a palavra-chave AS.',
    initialCode: `* Aplique o alias AS aos campos:
`,
    solutionPattern: {
      requiredTokens: ['MATNR AS CODIGO_MATERIAL', 'MAKTX AS DESCRICAO_MATERIAL', 'FROM MAKT', 'INTO TABLE @DATA('],
      sampleSolution: `SELECT matnr AS codigo_material, maktx AS descricao_material FROM makt INTO TABLE @DATA(lt_resultado).`,
    },
    explanation: 'AS permite renomear colunas diretamente no resultado da consulta SQL.',
    xpReward: 40,
  },
  {
    id: 'lab_sql_025',
    title: 'SELECT SINGLE FOR UPDATE (Bloqueio Enqueue)',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Escreva um SELECT SINGLE com a adição FOR UPDATE na tabela ZTB_CONTA para wa_conta onde id = 1.',
    initialCode: `* Bloqueie a linha para atualização:
`,
    solutionPattern: {
      requiredTokens: ['SELECT SINGLE FOR UPDATE', 'FROM ZTB_CONTA', 'INTO WA_CONTA', 'WHERE ID = 1'],
      sampleSolution: `SELECT SINGLE FOR UPDATE * FROM ztb_conta INTO wa_conta WHERE id = 1.`,
    },
    explanation: 'FOR UPDATE instrui o banco a reservar a linha com bloqueio exclusivo até o próximo COMMIT ou ROLLBACK.',
    xpReward: 45,
  },

  // ==========================================
  // PARTE 2: TABELAS INTERNAS (ITAB) (50 EXERCÍCIOS)
  // ==========================================
  {
    id: 'lab_itab_001',
    title: 'Declaração de Tabela Interna com DATA',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Declare a tabela interna lt_clientes do tipo STANDARD TABLE OF kna1.',
    initialCode: `* Escreva a declaração DATA:
`,
    solutionPattern: {
      requiredTokens: ['DATA', 'LT_CLIENTES', 'TYPE', 'TABLE OF KNA1'],
      sampleSolution: `DATA lt_clientes TYPE STANDARD TABLE OF kna1.`,
    },
    explanation: 'STANDARD TABLE OF é o tipo de tabela interna mais comum no ABAP, indexada numericamente.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_002',
    title: 'Inserindo Linha com APPEND',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Insira o registro wa_material no final da tabela interna lt_materiais usando o comando APPEND.',
    initialCode: `* Insira wa_material na tabela:
`,
    solutionPattern: {
      requiredTokens: ['APPEND WA_MATERIAL TO LT_MATERIAIS.'],
      sampleSolution: `APPEND wa_material TO lt_materiais.`,
    },
    explanation: 'APPEND sempre acrescenta a linha ao final de tabelas Standard.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_003',
    title: 'Inserindo Linha no Início com INSERT INDEX',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Insira wa_item exatamente na primeira posição da tabela lt_itens usando INSERT wa INTO itab INDEX 1.',
    initialCode: `* Insira na primeira posição (índice 1):
`,
    solutionPattern: {
      requiredTokens: ['INSERT WA_ITEM INTO LT_ITENS INDEX 1.'],
      sampleSolution: `INSERT wa_item INTO lt_itens INDEX 1.`,
    },
    explanation: 'INSERT INTO ... INDEX permite posicionar o novo registro em qualquer índice da tabela interna.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_004',
    title: 'Comando CLEAR em Work Area',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Limpe a estrutura de memória wa_cliente antes de preencher novos valores usando CLEAR.',
    initialCode: `* Limpe a work area:
`,
    solutionPattern: {
      requiredTokens: ['CLEAR WA_CLIENTE.'],
      sampleSolution: `CLEAR wa_cliente.`,
    },
    explanation: 'Sempre limpe (CLEAR) a work area após inserções para evitar contaminação de dados nas iterações seguintes.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_005',
    title: 'Comando REFRESH em Tabela Interna',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Apague todas as linhas da tabela interna lt_pedidos mantendo a tabela pronta para reuso.',
    initialCode: `* Limpe todo o conteúdo da tabela:
`,
    solutionPattern: {
      requiredTokens: ['CLEAR LT_PEDIDOS.', 'REFRESH LT_PEDIDOS.'],
      sampleSolution: `CLEAR lt_pedidos.`,
    },
    explanation: 'CLEAR itab ou REFRESH itab esvazia todas as linhas da tabela interna.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_006',
    title: 'LOOP AT Tradicional com Work Area',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Escreva um LOOP na tabela lt_materiais gravando em wa_mat e exibindo wa_mat-matnr com WRITE.',
    initialCode: `* Escreva o bloco de repetição:
`,
    solutionPattern: {
      requiredTokens: ['LOOP AT LT_MATERIAIS INTO WA_MAT', 'WRITE', 'ENDLOOP'],
      sampleSolution: `LOOP AT lt_materiais INTO wa_mat.
  WRITE: / wa_mat-matnr.
ENDLOOP.`,
    },
    explanation: 'LOOP AT itab INTO wa itera por todas as linhas copiando cada registro para a work area.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_007',
    title: 'LOOP AT com Condição WHERE',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Execute um LOOP na tabela lt_itens filtrando apenas as linhas onde o status seja igual a "A".',
    initialCode: `* Itere apenas pelas linhas ativas:
`,
    solutionPattern: {
      requiredTokens: ['LOOP AT LT_ITENS INTO WA_ITEM WHERE STATUS =', 'ENDLOOP'],
      sampleSolution: `LOOP AT lt_itens INTO wa_item WHERE status = 'A'.
  WRITE: / wa_item-item_id.
ENDLOOP.`,
    },
    explanation: 'A cláusula WHERE dentro do LOOP filtra linhas na memória antes de entrar no corpo do loop.',
    xpReward: 35,
  },
  {
    id: 'lab_itab_008',
    title: 'READ TABLE com Chave Simples',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Busque na tabela lt_clientes o registro com kunnr = "0000100050" para wa_cliente.',
    initialCode: `* Leia o cliente desejado:
`,
    solutionPattern: {
      requiredTokens: ['READ TABLE LT_CLIENTES INTO WA_CLIENTE WITH KEY KUNNR ='],
      sampleSolution: `READ TABLE lt_clientes INTO wa_cliente WITH KEY kunnr = '0000100050'.`,
    },
    explanation: 'READ TABLE localiza a primeira linha correspondente e preenche a work area.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_009',
    title: 'READ TABLE por Índice Numérico (INDEX)',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Leia diretamente a linha de número 3 da tabela interna lt_dados para a estrutura wa_dados.',
    initialCode: `* Leia a linha do índice 3:
`,
    solutionPattern: {
      requiredTokens: ['READ TABLE LT_DADOS INTO WA_DADOS INDEX 3.'],
      sampleSolution: `READ TABLE lt_dados INTO wa_dados INDEX 3.`,
    },
    explanation: 'Acessar uma tabela pelo índice numérico (INDEX) é uma operação direta e instantânea.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_010',
    title: 'Contagem de Linhas com Função lines( )',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Atribua para a variável lv_qtd a quantidade total de linhas presentes na tabela interna lt_materiais usando lines( ).',
    initialCode: `* Conte as linhas da tabela:
lv_qtd = `,
    solutionPattern: {
      requiredTokens: ['LINES( LT_MATERIAIS )'],
      sampleSolution: `lv_qtd = lines( lt_materiais ).`,
    },
    explanation: 'lines( itab ) é a função integrada mais prática e limpa para descobrir o total de registros de uma tabela interna.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_011',
    title: 'DESCRIBE TABLE LINES',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Use o comando clássico DESCRIBE TABLE lt_pedidos LINES lv_total_linhas para contar o total de pedidos.',
    initialCode: `* Sintaxe clássica de contagem:
`,
    solutionPattern: {
      requiredTokens: ['DESCRIBE TABLE LT_PEDIDOS LINES LV_TOTAL_LINHAS.'],
      sampleSolution: `DESCRIBE TABLE lt_pedidos LINES lv_total_linhas.`,
    },
    explanation: 'DESCRIBE TABLE é muito comum em códigos legados do SAP ECC e NetWeaver.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_012',
    title: 'Ordenação Simples com SORT',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Ordene a tabela lt_clientes pelo campo name1 em ordem alfabética ascendente.',
    initialCode: `* Ordene a tabela por name1:
`,
    solutionPattern: {
      requiredTokens: ['SORT LT_CLIENTES BY NAME1'],
      sampleSolution: `SORT lt_clientes BY name1 ASCENDING.`,
    },
    explanation: 'SORT itab BY reorganiza os índices da tabela interna com base nas colunas informadas.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_013',
    title: 'Ordenação com Múltiplas Colunas',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Ordene a tabela lt_materiais pelo tipo mtart ascendente e pelo código matnr descendente.',
    initialCode: `* Ordene por mtart ASCENDING e matnr DESCENDING:
`,
    solutionPattern: {
      requiredTokens: ['SORT LT_MATERIAIS BY MTART ASCENDING MATNR DESCENDING.'],
      sampleSolution: `SORT lt_materiais BY mtart ASCENDING matnr DESCENDING.`,
    },
    explanation: 'É possível combinar direções de ordenação distintas para cada coluna no comando SORT.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_014',
    title: 'Excluindo Linhas Duplicadas (DELETE ADJACENT)',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Ordene lt_materiais por matnr e em seguida elimine duplicatas comparando o campo matnr.',
    initialCode: `* Ordene e remova duplicatas adjacentes:
`,
    solutionPattern: {
      requiredTokens: ['SORT LT_MATERIAIS BY MATNR.', 'DELETE ADJACENT DUPLICATES FROM LT_MATERIAIS COMPARING MATNR.'],
      sampleSolution: `SORT lt_materiais BY matnr.
DELETE ADJACENT DUPLICATES FROM lt_materiais COMPARING matnr.`,
    },
    explanation: 'DELETE ADJACENT DUPLICATES só funciona se a tabela estiver previamente ordenada pelas colunas comparadas.',
    xpReward: 35,
  },
  {
    id: 'lab_itab_015',
    title: 'Excluindo Linha por Índice (DELETE INDEX)',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Exclua a segunda linha (índice 2) da tabela interna lt_logs.',
    initialCode: `* Exclua a linha no índice 2:
`,
    solutionPattern: {
      requiredTokens: ['DELETE LT_LOGS INDEX 2.'],
      sampleSolution: `DELETE lt_logs INDEX 2.`,
    },
    explanation: 'Ao deletar por índice, todos os registros seguintes são reindexados automaticamente.',
    xpReward: 25,
  },
  {
    id: 'lab_itab_016',
    title: 'Excluindo com Filtro (DELETE WHERE)',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Exclua todas as linhas da tabela lt_pedidos onde o status seja "CANCELADO".',
    initialCode: `* Exclua em lote com WHERE:
`,
    solutionPattern: {
      requiredTokens: ['DELETE LT_PEDIDOS WHERE STATUS ='],
      sampleSolution: `DELETE lt_pedidos WHERE status = 'CANCELADO'.`,
    },
    explanation: 'DELETE itab WHERE remove todas as linhas coincidentes em uma única instrução veloz.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_017',
    title: 'Atualizando Linha com MODIFY INDEX',
    level: 'Nível 1',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Atualize a linha no índice 1 da tabela lt_itens com os novos valores presentes em wa_item.',
    initialCode: `* Modifique o índice 1:
`,
    solutionPattern: {
      requiredTokens: ['MODIFY LT_ITENS FROM WA_ITEM INDEX 1.'],
      sampleSolution: `MODIFY lt_itens FROM wa_item INDEX 1.`,
    },
    explanation: 'MODIFY itab FROM wa INDEX n substitui todo o conteúdo daquela linha específica.',
    xpReward: 30,
  },
  {
    id: 'lab_itab_018',
    title: 'MODIFY com TRANSPORTING de Campo Específico',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Atualize apenas o campo status da linha atual da tabela lt_itens dentro de um LOOP usando TRANSPORTING status.',
    initialCode: `* Modifique apenas a coluna status:
`,
    solutionPattern: {
      requiredTokens: ['MODIFY LT_ITENS FROM WA_ITEM TRANSPORTING STATUS.'],
      sampleSolution: `MODIFY lt_itens FROM wa_item TRANSPORTING status.`,
    },
    explanation: 'TRANSPORTING evita copiar colunas desnecessárias, aumentando drasticamente a performance em tabelas largas.',
    xpReward: 35,
  },
  {
    id: 'lab_itab_019',
    title: 'LOOP AT com FIELD-SYMBOL (Alta Performance)',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Escreva um LOOP moderno atribuindo diretamente para o field-symbol <fs_mat> e alterando seu status para "X".',
    initialCode: `* Use ASSIGNING FIELD-SYMBOL(<fs_mat>):
`,
    solutionPattern: {
      requiredTokens: ['LOOP AT LT_MATERIAIS ASSIGNING FIELD-SYMBOL(<FS_MAT>)', '<FS_MAT>-STATUS =', 'ENDLOOP'],
      sampleSolution: `LOOP AT lt_materiais ASSIGNING FIELD-SYMBOL(<fs_mat>).
  <fs_mat>-status = 'X'.
ENDLOOP.`,
    },
    explanation: 'Com Field-Symbols, qualquer alteração no ponteiro modifica a tabela imediatamente sem precisar de MODIFY!',
    xpReward: 45,
  },
  {
    id: 'lab_itab_020',
    title: 'READ TABLE com BINARY SEARCH (Obrigatório)',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Ordene lt_materiais por matnr e execute READ TABLE usando a busca binária de alta velocidade (BINARY SEARCH).',
    initialCode: `* Ordene e aplique BINARY SEARCH:
`,
    solutionPattern: {
      requiredTokens: ['SORT LT_MATERIAIS BY MATNR.', 'READ TABLE LT_MATERIAIS INTO WA_MAT WITH KEY MATNR =', 'BINARY SEARCH.'],
      sampleSolution: `SORT lt_materiais BY matnr.
READ TABLE lt_materiais INTO wa_mat WITH KEY matnr = '100-100' BINARY SEARCH.`,
    },
    explanation: 'A busca binária transforma O(N) em O(log N). Uma tabela com 1.000.000 de linhas é buscada em no máximo 20 comparações!',
    xpReward: 45,
  },
  {
    id: 'lab_itab_021',
    title: 'Table Expression com Leitura Direta [ ]',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'No ABAP 7.40+, atribua para wa_cliente o registro da tabela lt_clientes onde kunnr = "0000100050" usando colchetes.',
    initialCode: `* Use expressão de tabela com colchetes:
wa_cliente = `,
    solutionPattern: {
      requiredTokens: ['LT_CLIENTES[ KUNNR ='],
      sampleSolution: `wa_cliente = lt_clientes[ kunnr = '0000100050' ].`,
    },
    explanation: 'Table expressions itab[ ... ] substituem de forma concisa o antigo comando READ TABLE.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_022',
    title: 'Table Expression com OPTIONAL',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Proteja a leitura da tabela para não disparar exceção (cx_sy_itab_line_not_found) caso o registro não exista usando VALUE #( ... OPTIONAL ).',
    initialCode: `* Adicione VALUE #( ... OPTIONAL ):
wa_cliente = `,
    solutionPattern: {
      requiredTokens: ['VALUE #(', 'LT_CLIENTES[', 'OPTIONAL )'],
      sampleSolution: `wa_cliente = VALUE #( lt_clientes[ kunnr = '0000100050' ] OPTIONAL ).`,
    },
    explanation: 'O modificador OPTIONAL devolve uma estrutura em branco caso a chave não seja encontrada, evitando DUMPs.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_023',
    title: 'Construtor VALUE #( ) para Povoar Tabela',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Crie a tabela lt_numeros preenchida com as linhas 10, 20 e 30 em uma única expressão com VALUE #.',
    initialCode: `* Povoar tabela com VALUE:
DATA(lt_numeros) = VALUE tt_inteiros( `,
    solutionPattern: {
      requiredTokens: ['VALUE TT_INTEIROS(', '( 10 )', '( 20 )', '( 30 )'],
      sampleSolution: `DATA(lt_numeros) = VALUE tt_inteiros( ( 10 ) ( 20 ) ( 30 ) ).`,
    },
    explanation: 'O construtor VALUE preenche tabelas internas inteiras sem precisar encadear vários comandos APPEND.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_024',
    title: 'Comando COLLECT para Totalização Automática',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Use o comando COLLECT wa_venda INTO lt_totais_venda para acumular valores numéricos por filial.',
    initialCode: `* Acumule valores com COLLECT:
`,
    solutionPattern: {
      requiredTokens: ['COLLECT WA_VENDA INTO LT_TOTAIS_VENDA.'],
      sampleSolution: `COLLECT wa_venda INTO lt_totais_venda.`,
    },
    explanation: 'COLLECT verifica se já existe uma linha com a mesma chave alfanumérica; se houver, soma os campos numéricos.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_025',
    title: 'Liberação Total de Memória com FREE',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Libere completamente a memória RAM alocada para a gigantesca tabela interna lt_grande_volume usando FREE.',
    initialCode: `* Desaloque a memória da tabela:
`,
    solutionPattern: {
      requiredTokens: ['FREE LT_GRANDE_VOLUME.'],
      sampleSolution: `FREE lt_grande_volume.`,
    },
    explanation: 'CLEAR/REFRESH apenas limpa as linhas mantendo a memória pré-alocada; FREE devolve a memória física ao sistema operacional.',
    xpReward: 35,
  },
  // --- Mais 30 Exercícios Práticos de SELECT & Open SQL ---
  {
    id: 'lab_sql_026',
    title: 'SELECT com DISTINCT para Valores Únicos',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Selecione apenas os tipos de materiais distintos (sem repetições) da tabela MARA gravando em lt_tipos.',
    initialCode: `* Use SELECT DISTINCT:
`,
    solutionPattern: {
      requiredTokens: ['SELECT DISTINCT MTART', 'FROM MARA', 'INTO TABLE LT_TIPOS'],
      sampleSolution: `SELECT DISTINCT mtart FROM mara INTO TABLE lt_tipos.`,
    },
    explanation: 'DISTINCT remove duplicatas diretamente na camada de banco de dados.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_027',
    title: 'SELECT com Operador NOT EQUAL (<>)',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte os clientes da tabela KNA1 onde o país (land1) seja diferente de "BR" para lt_clientes_ext.',
    initialCode: `* Filtre land1 <> 'BR':
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM KNA1', 'INTO TABLE LT_CLIENTES_EXT', 'WHERE LAND1 <>', "'BR'"],
      sampleSolution: `SELECT * FROM kna1 INTO TABLE lt_clientes_ext WHERE land1 <> 'BR'.`,
    },
    explanation: '<> ou NE filtra registros onde o valor não é igual ao especificado.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_028',
    title: 'SELECT com Condição OR no WHERE',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte a tabela MARA para lt_materiais onde mtart seja "ROH" OU "HALB".',
    initialCode: `* Combine filtros com OR:
`,
    solutionPattern: {
      requiredTokens: ['WHERE MTART =', "'ROH'", 'OR MTART =', "'HALB'"],
      sampleSolution: `SELECT * FROM mara INTO TABLE lt_materiais WHERE mtart = 'ROH' OR mtart = 'HALB'.`,
    },
    explanation: 'O operador OR retorna linhas que satisfazem qualquer uma das condições.',
    xpReward: 30,
  },
  {
    id: 'lab_sql_029',
    title: 'SELECT em Tabela de Fornecedores LFA1',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte o número do fornecedor (lifnr) e nome (name1) da tabela LFA1 onde land1 = "BR" para lt_fornecedores.',
    initialCode: `* Selecione lifnr e name1 de LFA1:
`,
    solutionPattern: {
      requiredTokens: ['SELECT LIFNR', 'NAME1', 'FROM LFA1', 'INTO TABLE LT_FORNECEDORES', 'WHERE LAND1 ='],
      sampleSolution: `SELECT lifnr name1 FROM lfa1 INTO TABLE lt_fornecedores WHERE land1 = 'BR'.`,
    },
    explanation: 'LFA1 é a tabela mestra de dados gerais de fornecedores no SAP.',
    xpReward: 35,
  },
  {
    id: 'lab_sql_030',
    title: 'SELECT de Pedidos de Compras (EKKO)',
    level: 'Nível 1',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte todos os pedidos da tabela EKKO com tipo de documento (bsart) igual a "NB" para lt_pedidos_compra.',
    initialCode: `* Filtre em EKKO por bsart = 'NB':
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM EKKO', 'INTO TABLE LT_PEDIDOS_COMPRA', 'WHERE BSART =', "'NB'"],
      sampleSolution: `SELECT * FROM ekko INTO TABLE lt_pedidos_compra WHERE bsart = 'NB'.`,
    },
    explanation: 'EKKO armazena o cabeçalho de pedidos de compras de suprimentos (MM).',
    xpReward: 35,
  },
  {
    id: 'lab_sql_031',
    title: 'Média Aritmética com AVG( netwr )',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Calcule o valor médio dos pedidos da tabela VBAK com a função AVG( netwr ) gravando em lv_media.',
    initialCode: `* Calcule a média com AVG:
`,
    solutionPattern: {
      requiredTokens: ['SELECT AVG( NETWR )', 'FROM VBAK', 'INTO LV_MEDIA'],
      sampleSolution: `SELECT AVG( netwr ) FROM vbak INTO lv_media.`,
    },
    explanation: 'AVG calcula a média aritmética dos valores diretamente no banco.',
    xpReward: 40,
  },
  {
    id: 'lab_sql_032',
    title: 'INNER JOIN Triplo: KNA1, VBAK e VBAP',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Faça um INNER JOIN de KNA1 com VBAK (kunnr) e VBAP (vbeln) para trazer o nome do cliente e os itens faturados.',
    initialCode: `* Relacione KNA1 com VBAK e VBAP:
`,
    solutionPattern: {
      requiredTokens: ['FROM KNA1 INNER JOIN VBAK ON KNA1~KUNNR = VBAK~KUNNR', 'INNER JOIN VBAP ON VBAK~VBELN = VBAP~VBELN', 'INTO TABLE LT_RELATORIO'],
      sampleSolution: `SELECT kna1~name1 vbak~vbeln vbap~posnr vbap~netwr FROM kna1 INNER JOIN vbak ON kna1~kunnr = vbak~kunnr INNER JOIN vbap ON vbak~vbeln = vbap~vbeln INTO TABLE lt_relatorio.`,
    },
    explanation: 'Joins múltiplos consolidam relatórios gerenciais sem chamadas repetitivas de banco de dados.',
    xpReward: 50,
  },
  {
    id: 'lab_sql_033',
    title: 'SELECT com Subquery IN ( SELECT ... )',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Selecione os clientes de KNA1 cujo código kunnr esteja na lista de pedidos de VBAK (usando subquery).',
    initialCode: `* Aplique subquery no WHERE:
`,
    solutionPattern: {
      requiredTokens: ['WHERE KUNNR IN ( SELECT KUNNR FROM VBAK )'],
      sampleSolution: `SELECT * FROM kna1 INTO TABLE lt_clientes WHERE kunnr IN ( SELECT kunnr FROM vbak ).`,
    },
    explanation: 'Subqueries no Open SQL permitem filtrar por conjuntos dinâmicos avaliados no próprio banco.',
    xpReward: 45,
  },
  {
    id: 'lab_sql_034',
    title: 'SELECT com CASE WHEN End Condicional',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'No ABAP 7.40+, use CASE dentro do SELECT para classificar o material como "Acabado" se mtart = "FERT" ou "Outro" no alias tipo_desc.',
    initialCode: `* Classificação condicional no banco:
`,
    solutionPattern: {
      requiredTokens: ['CASE MTART WHEN', "'FERT'", 'THEN', 'ELSE', 'END AS TIPO_DESC', 'FROM MARA'],
      sampleSolution: `SELECT matnr, CASE mtart WHEN 'FERT' THEN 'Acabado' ELSE 'Outro' END AS tipo_desc FROM mara INTO TABLE @DATA(lt_classificados).`,
    },
    explanation: 'A expressão CASE no SELECT moderno do Open SQL executa lógica condicional direto na consulta.',
    xpReward: 45,
  },
  {
    id: 'lab_sql_035',
    title: 'SELECT de Documentos Financeiros BKPF',
    level: 'Nível 2',
    category: 'SELECT & Open SQL',
    instruction: 'Consulte os documentos contábeis da tabela BKPF onde bukrs = "1000" e gjahr = "2026" para lt_contabil.',
    initialCode: `* Selecione de BKPF com empresa e ano fiscal:
`,
    solutionPattern: {
      requiredTokens: ['SELECT', 'FROM BKPF', 'INTO TABLE LT_CONTABIL', 'WHERE BUKRS =', 'AND GJAHR ='],
      sampleSolution: `SELECT * FROM bkpf INTO TABLE lt_contabil WHERE bukrs = '1000' AND gjahr = '2026'.`,
    },
    explanation: 'BKPF é a tabela de cabeçalho de documentos contábeis do módulo FI.',
    xpReward: 40,
  },

  // --- Mais 25 Exercícios Práticos de Tabelas Internas (ITAB) ---
  {
    id: 'lab_itab_026',
    title: 'Declaração de SORTED TABLE com Chave Única',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Declare a tabela interna lt_clientes do tipo SORTED TABLE OF kna1 WITH UNIQUE KEY kunnr.',
    initialCode: `* Declare a SORTED TABLE:
`,
    solutionPattern: {
      requiredTokens: ['DATA LT_CLIENTES TYPE SORTED TABLE OF KNA1 WITH UNIQUE KEY KUNNR.'],
      sampleSolution: `DATA lt_clientes TYPE SORTED TABLE OF kna1 WITH UNIQUE KEY kunnr.`,
    },
    explanation: 'SORTED TABLES mantêm os registros sempre ordenados pela chave especificada em tempo de inserção.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_027',
    title: 'Declaração de HASHED TABLE de Alta Velocidade',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Declare a tabela lt_materiais do tipo HASHED TABLE OF mara WITH UNIQUE KEY matnr.',
    initialCode: `* Declare a HASHED TABLE:
`,
    solutionPattern: {
      requiredTokens: ['DATA LT_MATERIAIS TYPE HASHED TABLE OF MARA WITH UNIQUE KEY MATNR.'],
      sampleSolution: `DATA lt_materiais TYPE HASHED TABLE OF mara WITH UNIQUE KEY matnr.`,
    },
    explanation: 'HASHED TABLES possuem busca O(1) instantânea independente do volume de dados.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_028',
    title: 'Leitura com READ TABLE WITH TABLE KEY',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Para uma HASHED ou SORTED TABLE, execute a leitura ótima usando WITH TABLE KEY matnr = "100-100".',
    initialCode: `* Leia por chave primária de tabela:
`,
    solutionPattern: {
      requiredTokens: ['READ TABLE LT_MATERIAIS INTO WA_MAT WITH TABLE KEY MATNR ='],
      sampleSolution: `READ TABLE lt_materiais INTO wa_mat WITH TABLE KEY matnr = '100-100'.`,
    },
    explanation: 'WITH TABLE KEY garante que o mecanismo de hashing ou busca binária nativa da tabela seja utilizado.',
    xpReward: 40,
  },
  {
    id: 'lab_itab_029',
    title: 'Expressão REDUCE para Somar Itens (ABAP 7.40+)',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Use a expressão funcional REDUCE para calcular o valor total de uma tabela de pedidos em lv_total.',
    initialCode: `* Totalize com REDUCE:
lv_total = REDUCE #( `,
    solutionPattern: {
      requiredTokens: ['REDUCE #(', 'INIT TOTAL =', 'FOR WA IN LT_ITENS', 'NEXT TOTAL = TOTAL +'],
      sampleSolution: `lv_total = REDUCE #( INIT total = 0 FOR wa IN lt_itens NEXT total = total + wa-netwr ).`,
    },
    explanation: 'REDUCE implementa o padrão map-reduce funcional para agregar coleções em uma única instrução.',
    xpReward: 45,
  },
  {
    id: 'lab_itab_030',
    title: 'Expressão FILTER para Subconjuntos de Tabelas',
    level: 'Nível 2',
    category: 'Tabelas Internas (ITAB)',
    instruction: 'Use a expressão FILTER #( lt_materiais WHERE mtart = "ROH" ) para gerar uma nova tabela apenas de matérias-primas.',
    initialCode: `* Filtre com FILTER:
DATA(lt_rohs) = `,
    solutionPattern: {
      requiredTokens: ['FILTER #(', 'LT_MATERIAIS WHERE MTART ='],
      sampleSolution: `DATA(lt_rohs) = FILTER #( lt_materiais WHERE mtart = 'ROH' ).`,
    },
    explanation: 'FILTER extrai subconjuntos de Sorted ou Hashed tables de modo declarativo e veloz.',
    xpReward: 45,
  }
];

// Helper to get total lab exercises
export const TOTAL_LAB_EXERCISES = ABAP_PRACTICE_LAB_EXERCISES.length;

