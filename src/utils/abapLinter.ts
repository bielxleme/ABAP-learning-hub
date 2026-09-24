import { AbapSyntaxError, SimulationResult, DebugConsoleData, SapVariableWatch, DebugTraceStep, SapTableRecord } from '../types';
import { MOCK_MARA, MOCK_VBAK, MOCK_KNA1 } from '../data/sapReference';

export function lintAbapCode(code: string): AbapSyntaxError[] {
  const errors: AbapSyntaxError[] = [];
  const lines = code.split('\n');

  let loopCount = 0;
  let ifCount = 0;
  let caseCount = 0;
  let formCount = 0;
  let tryCount = 0;

  let inCommentBlock = false;
  let accumulatedStatement = '';
  let statementStartLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineNum = i + 1;
    const trimmed = rawLine.trim();

    // Check comments
    if (trimmed.startsWith('*') || trimmed.length === 0) {
      continue;
    }

    // Strip inline comments starting with "
    const codePart = trimmed.split('"')[0].trim();
    if (!codePart) continue;

    const upper = codePart.toUpperCase();

    // Track blocks
    if (/\bLOOP\s+AT\b/i.test(codePart)) loopCount++;
    if (/\bENDLOOP\b/i.test(codePart)) loopCount--;
    if (/\bIF\b/i.test(codePart)) ifCount++;
    if (/\bENDIF\b/i.test(codePart)) ifCount--;
    if (/\bCASE\b/i.test(codePart)) caseCount++;
    if (/\bENDCASE\b/i.test(codePart)) caseCount--;
    if (/\bFORM\s+[A-Za-z0-9_]+/i.test(codePart)) formCount++;
    if (/\bENDFORM\b/i.test(codePart)) formCount--;
    if (/\bTRY\b/i.test(codePart)) tryCount++;
    if (/\bENDTRY\b/i.test(codePart)) tryCount--;

    // Performance warning for SELECT *
    if (/\bSELECT\s+\*\b/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Anti-pattern de Performance: Uso de SELECT * em vez de campos explícitos.',
        severity: 'warning',
        suggestion: 'Especifique apenas os campos necessários (ex.: SELECT matnr, mtart FROM mara...).',
      });
    }

    // Obsolete command checks
    if (/\bMOVE\s+[\w\-\>\[\]\(\)]+\s+TO\s+[\w\-\>\[\]\(\)]+/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Comando Obsoleto: MOVE ... TO. No ABAP 7.40+, utilize atribuição direta ou construtor VALUE/CORRESPONDING.',
        severity: 'warning',
        suggestion: 'Substitua por: wa_dest = wa_origem. Exemplo: wa_dest = CORRESPONDING #( wa_origem ).',
      });
    }

    if (/\bCOMPUTE\s+[\w\-]+\s*=/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Instrução Obsoleta: Palavra-chave COMPUTE desnecessária.',
        severity: 'warning',
        suggestion: 'Use atribuição direta: lv_total = a + b.',
      });
    }

    if (/\bOCCURS\s+\d+\b/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Cláusula Obsoleta: OCCURS em tabelas internas (banida em ABAP OO).',
        severity: 'warning',
        suggestion: 'Use: TYPE STANDARD TABLE OF ... WITH EMPTY KEY.',
      });
    }

    if (/\bWITH\s+HEADER\s+LINE\b/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Comando Obsoleto: WITH HEADER LINE proibido em ABAP Orientado a Objetos e ABAP Cloud.',
        severity: 'warning',
        suggestion: 'Declare tabela interna explícita e work area separada: DATA: lt_tab TYPE ..., ls_tab TYPE ...',
      });
    }

    if (/\bDESCRIBE\s+TABLE\s+[\w\-]+\s+LINES\b/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Instrução Legada: DESCRIBE TABLE ... LINES substituída por função embutida.',
        severity: 'warning',
        suggestion: 'Use a função embutida moderna: lv_count = lines( itab ).',
      });
    }

    // ABAP > 7.5 (7.55+) checks
    if (/\bFINAL\s*\(\s*[\w\-]+\s*\)\s*=/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Aviso de Versão: Instrução FINAL(...) é um recurso do ABAP 7.55+ (S/4HANA 2020+ / ABAP Cloud).',
        severity: 'info',
        suggestion: 'Para compatibilidade com SAP NetWeaver 7.50 e anteriores, use DATA(...) ou declaração clássica DATA.',
      });
    }

    // Check SELECT without INTO
    if (/\bSELECT\b/i.test(codePart) && !codePart.endsWith('.') && !/\bINTO\b/i.test(codePart)) {
      // It might continue on next line, check later in accumulated
    }

    // Check SELECT-OPTIONS
    if (/\bSELECT-OPTIONS\b/i.test(codePart) && !/\bFOR\b/i.test(codePart)) {
      errors.push({
        line: lineNum,
        message: 'Sintaxe inválida para SELECT-OPTIONS: falta a palavra-chave FOR.',
        severity: 'error',
        suggestion: 'Use: SELECT-OPTIONS s_campo FOR tabela-campo.',
      });
    }

    // Accumulate statements to verify ending period
    if (!accumulatedStatement) {
      statementStartLine = lineNum;
    }
    accumulatedStatement += ' ' + codePart;

    if (codePart.endsWith('.')) {
      // Statement finished, validate complete statement
      const fullStmt = accumulatedStatement.trim().toUpperCase();

      if (fullStmt.startsWith('SELECT') && !fullStmt.includes('INTO')) {
        errors.push({
          line: statementStartLine,
          message: 'Comando SELECT sem cláusula de destino (INTO ou INTO TABLE).',
          severity: 'error',
          suggestion: 'Adicione "INTO TABLE @DATA(lt_dados)" ou "INTO @DATA(ls_linha)".',
        });
      }

      accumulatedStatement = '';
    }
  }

  // If file ended with unfinished statement without period
  if (accumulatedStatement.trim().length > 0 && !accumulatedStatement.trim().endsWith('.')) {
    errors.push({
      line: lines.length,
      message: 'Instrução ABAP não finalizada: falta o ponto final (.) obrigatório.',
      severity: 'error',
      suggestion: 'Adicione um ponto (.) ao final da última instrução.',
    });
  }

  // Block mismatch checks
  if (loopCount > 0) {
    errors.push({
      line: lines.length,
      message: `Bloco LOOP AT não foi fechado (${loopCount} sem ENDLOOP).`,
      severity: 'error',
      suggestion: 'Adicione a instrução ENDLOOP.',
    });
  }
  if (ifCount > 0) {
    errors.push({
      line: lines.length,
      message: `Condicional IF não foi finalizada (${ifCount} sem ENDIF).`,
      severity: 'error',
      suggestion: 'Adicione a instrução ENDIF.',
    });
  }
  if (caseCount > 0) {
    errors.push({
      line: lines.length,
      message: `Bloco CASE não foi finalizado (${caseCount} sem ENDCASE).`,
      severity: 'error',
      suggestion: 'Adicione a instrução ENDCASE.',
    });
  }
  if (formCount > 0) {
    errors.push({
      line: lines.length,
      message: `Sub-rotina FORM não foi fechada (${formCount} sem ENDFORM).`,
      severity: 'error',
      suggestion: 'Adicione a instrução ENDFORM.',
    });
  }

  return errors;
}

function buildDebugConsole(
  code: string,
  sySubrc: number,
  syTabix: number,
  syDbcnt: number,
  rows: SapTableRecord[],
  tableName: string,
  criticalError?: AbapSyntaxError
): DebugConsoleData {
  const upper = code.toUpperCase();
  const isWrite = upper.includes('WRITE:');

  const systemVariables: Record<string, string | number> = {
    'SY-SUBRC': sySubrc,
    'SY-TABIX': syTabix,
    'SY-DBCNT': syDbcnt,
    'SY-UNAME': 'BLEME',
    'SY-MANDT': '100',
    'SY-DATUM': '20260922',
    'SY-UZEIT': '114200',
    'SY-LINNO': isWrite ? 14 : 0,
    'SY-INDEX': 1,
    'SY-LANGU': 'P',
    'SY-REPID': 'Z_APRENDIZADO_ABAP',
  };

  const monitoredVariables: SapVariableWatch[] = [
    {
      name: 'SY-SUBRC',
      category: 'system',
      type: 'SYSUBRC (i)',
      value: String(sySubrc),
      description: 'Código de retorno da última instrução executada (0 = Sucesso, 4 = Não encontrado / Erro).',
      status: sySubrc === 0 ? 'ok' : 'error',
    },
    {
      name: 'SY-TABIX',
      category: 'system',
      type: 'SYTABIX (i)',
      value: String(syTabix),
      description: 'Índice da linha atual da tabela interna durante processamento em LOOP AT ou READ TABLE.',
      status: 'ok',
    },
    {
      name: 'SY-DBCNT',
      category: 'system',
      type: 'SYDBCNT (i)',
      value: String(syDbcnt),
      description: 'Quantidade de registros lidos ou processados na base de dados pelo comando Open SQL.',
      status: 'ok',
    },
    {
      name: 'SY-UNAME',
      category: 'system',
      type: 'SYUNAME (c12)',
      value: 'BLEME',
      description: 'Nome do usuário autenticado na sessão do SAP GUI.',
      status: 'ok',
    },
    {
      name: 'SY-MANDT',
      category: 'system',
      type: 'SYMANDT (c3)',
      value: '100',
      description: 'Mandante SAP ativo (Ambiente de Desenvolvimento / Treinamento).',
      status: 'ok',
    },
  ];

  // Extract program variables
  const detectedVarNames = new Set<string>();

  // Regex patterns for DATA / PARAMETERS
  const inlineDataMatches = code.matchAll(/@?DATA\s*\(\s*([a-zA-Z0-9_]+)\s*\)/gi);
  for (const match of inlineDataMatches) {
    if (match[1]) detectedVarNames.add(match[1].toUpperCase());
  }

  const explicitDataMatches = code.matchAll(/DATA:?\s+([a-zA-Z0-9_]+)/gi);
  for (const match of explicitDataMatches) {
    if (match[1] && match[1].toUpperCase() !== 'TABLE' && match[1].toUpperCase() !== 'BEGIN') {
      detectedVarNames.add(match[1].toUpperCase());
    }
  }

  const paramMatches = code.matchAll(/PARAMETERS:?\s+([a-zA-Z0-9_]+)/gi);
  for (const match of paramMatches) {
    if (match[1]) detectedVarNames.add(match[1].toUpperCase());
  }

  const selectOptionsMatches = code.matchAll(/SELECT-OPTIONS:?\s+([a-zA-Z0-9_]+)/gi);
  for (const match of selectOptionsMatches) {
    if (match[1]) detectedVarNames.add(match[1].toUpperCase());
  }

  // Ensure default expected variables if none detected
  if (detectedVarNames.size === 0 && tableName) {
    detectedVarNames.add('LT_' + tableName.split(' ')[0]);
    detectedVarNames.add('LS_' + tableName.split(' ')[0]);
  }

  const sampleFirstRow = rows[0] || {};

  for (const vName of detectedVarNames) {
    const isTable = vName.startsWith('LT_') || vName.startsWith('GT_') || vName.includes('TABLE') || vName.includes('DADOS');
    const isStructure = vName.startsWith('LS_') || vName.startsWith('WA_') || vName.startsWith('GS_');
    const isParam = vName.startsWith('P_') || vName.startsWith('S_');

    if (isTable) {
      monitoredVariables.push({
        name: vName,
        category: 'table',
        type: `STANDARD TABLE OF ${tableName.split(' ')[0] || 'ANY'}`,
        value: `[${rows.length} registros em memória]`,
        description: `Tabela interna alocada no programa ABAP com dados carregados do banco.`,
        status: 'ok',
        tableRowsPreview: rows.slice(0, 5),
      });
    } else if (isStructure) {
      const fieldCount = Object.keys(sampleFirstRow).length;
      monitoredVariables.push({
        name: vName,
        category: 'structure',
        type: `${tableName.split(' ')[0] || 'TY_LINHA'} (Work Area)`,
        value: fieldCount > 0 ? `{ ${Object.entries(sampleFirstRow).slice(0, 3).map(([k, v]) => `${k}: "${v}"`).join(', ')} ... }` : '{ Initial }',
        description: `Work Area (estrutura em memória) que recebe o registro corrente durante a iteração.`,
        status: 'changed',
        fields: sampleFirstRow,
      });
    } else if (isParam) {
      let paramVal = 'KA';
      if (upper.includes("'ROH'")) paramVal = 'ROH';
      else if (upper.includes("'FERT'")) paramVal = 'FERT';
      monitoredVariables.push({
        name: vName,
        category: 'variable',
        type: 'SELECTION PARAMETER',
        value: `'${paramVal}'`,
        description: `Parâmetro de seleção definido na tela inicial do relatório ABAP.`,
        status: 'ok',
      });
    } else {
      monitoredVariables.push({
        name: vName,
        category: 'variable',
        type: 'LOCAL VARIABLE',
        value: rows.length > 0 ? String(rows.length) : '0',
        description: `Variável local do fluxo de controle.`,
        status: 'ok',
      });
    }
  }

  // Build Execution Trace Steps
  const executionTrace: DebugTraceStep[] = [];
  const callStack: string[] = ['Z_APRENDIZADO_ABAP [Report]'];

  if (criticalError) {
    executionTrace.push({
      step: 1,
      event: 'INITIALIZATION',
      line: 1,
      codeSnippet: 'REPORT z_aprendizado_abap.',
      sySubrc: 0,
      syTabix: 0,
      syDbcnt: 0,
      description: 'Sessão do programa inicializada no compilador ABAP.',
      activeVariables: { 'SY-SUBRC': '0', 'SY-MANDT': '100', 'SY-UNAME': 'BLEME' },
    });
    executionTrace.push({
      step: 2,
      event: 'SYNTAX_CHECK',
      line: criticalError.line,
      codeSnippet: `Linha ${criticalError.line}: Verificação de integridade`,
      sySubrc: 4,
      syTabix: 0,
      syDbcnt: 0,
      description: `Erro de sintaxe interceptado: ${criticalError.message}`,
      activeVariables: { 'SY-SUBRC': '4', 'CX_EXCEPTION': 'CX_SY_DYNAMIC_OSQL_SYNTAX' },
    });
    callStack.push('SYNTAX_CHECK [Compiler Hook]');
  } else {
    // Step 1: Program Init
    executionTrace.push({
      step: 1,
      event: 'INITIALIZATION',
      line: 1,
      codeSnippet: 'REPORT z_aprendizado_abap.',
      sySubrc: 0,
      syTabix: 0,
      syDbcnt: 0,
      description: 'Sessão iniciada no mandante 100. Variáveis do sistema SY-* e área de dados foram alocadas.',
      activeVariables: { 'SY-SUBRC': '0', 'SY-MANDT': '100', 'SY-UNAME': 'BLEME' },
    });

    callStack.push('START-OF-SELECTION [Event]');

    // Step 2: Open SQL
    if (upper.includes('SELECT')) {
      executionTrace.push({
        step: 2,
        event: 'OPEN SQL (DATABASE)',
        line: 5,
        codeSnippet: `SELECT ... FROM ${tableName.split(' ')[0]} INTO TABLE ...`,
        sySubrc: 0,
        syTabix: 0,
        syDbcnt: syDbcnt,
        description: `Comando Open SQL executado na camada de banco de dados. ${syDbcnt} registros lidos com sucesso. SY-DBCNT atualizado.`,
        activeVariables: {
          'SY-SUBRC': '0',
          'SY-DBCNT': String(syDbcnt),
          'ITAB_COUNT': `${rows.length} registros`,
        },
      });
    }

    // Step 3: Loop / Data processing
    if (upper.includes('LOOP AT') || rows.length > 0) {
      executionTrace.push({
        step: executionTrace.length + 1,
        event: 'LOOP AT itab INTO wa',
        line: 10,
        codeSnippet: `LOOP AT lt_${tableName.split(' ')[0].toLowerCase()} INTO DATA(ls_linha).`,
        sySubrc: 0,
        syTabix: Math.min(1, rows.length),
        syDbcnt: syDbcnt,
        description: `Iteração da tabela interna. SY-TABIX aponta para a linha 1 e os campos do registro foram copiados para a Work Area.`,
        activeVariables: {
          'SY-TABIX': '1',
          'SY-SUBRC': '0',
          'WORK_AREA': Object.keys(sampleFirstRow).length > 0 ? String(sampleFirstRow[Object.keys(sampleFirstRow)[0]]) : 'MAT-1001',
        },
      });
    }

    // Step 4: Presentation
    callStack.push(isWrite ? 'WRITE [Classic List Presentation]' : 'CL_SALV_TABLE=>DISPLAY [ALV Engine]');
    executionTrace.push({
      step: executionTrace.length + 1,
      event: isWrite ? 'WRITE (SPOOL / LIST)' : 'ALV GRID PRESENTATION',
      line: 18,
      codeSnippet: isWrite ? 'WRITE: / ls_material-matnr, ls_material-maktx.' : 'cl_salv_table=>factory( )->display( ).',
      sySubrc: 0,
      syTabix: syTabix,
      syDbcnt: syDbcnt,
      description: `Camada de apresentação gerada com sucesso. Os dados foram renderizados para o usuário no SAP GUI.`,
      activeVariables: {
        'SY-SUBRC': '0',
        'SY-LINNO': isWrite ? '14' : '0',
        'STATUS': 'Sucesso',
      },
    });
  }

  return {
    systemVariables,
    monitoredVariables,
    executionTrace,
    callStack,
  };
}

export function simulateAbapExecution(code: string): SimulationResult {
  const lintErrors = lintAbapCode(code);
  const criticalErrors = lintErrors.filter((e) => e.severity === 'error');

  // If syntax error, generate realistic SAP Short Dump
  if (criticalErrors.length > 0) {
    const firstErr = criticalErrors[0];
    const debugConsole = buildDebugConsole(code, 4, 0, 0, [], 'SYNTAX_ERROR', firstErr);
    return {
      success: false,
      type: 'error_dump',
      statusMessage: `E:001 Erro de sintaxe na linha ${firstErr.line}: ${firstErr.message}`,
      sySubrc: 4,
      dumpInfo: {
        runtimeError: 'SYNTAX_ERROR',
        exception: 'CX_SY_DYNAMIC_OSQL_SYNTAX',
        shortText: 'Erro de verificação de sintaxe no programa ABAP',
        whatHappened: `O compilador ABAP detectou uma inconsistência sintática na linha ${firstErr.line}: "${firstErr.message}"`,
        howToCorrect: firstErr.suggestion || 'Corrija o código no editor e execute novamente.',
      },
      debugConsole,
    };
  }

  const upper = code.toUpperCase();

  // Detect query on MARA
  if (upper.includes('FROM MARA')) {
    let filtered = [...MOCK_MARA];

    // Check MTART filter
    if (upper.includes("MTART = 'KA'") || upper.includes('MTART = @P_MTART') || upper.includes("MTART = 'KA'.")) {
      filtered = MOCK_MARA.filter((m) => m.MTART === 'KA');
    } else if (upper.includes("MTART = 'ROH'")) {
      filtered = MOCK_MARA.filter((m) => m.MTART === 'ROH');
    } else if (upper.includes("MTART = 'FERT'")) {
      filtered = MOCK_MARA.filter((m) => m.MTART === 'FERT');
    }

    // Check specific material filter
    const matnrMatch = upper.match(/MATNR\s*=\s*['"]?([0-9A-Z-]+)['"]?/);
    if (matnrMatch && matnrMatch[1]) {
      const targetMat = matnrMatch[1];
      filtered = filtered.filter((m) => String(m.MATNR).toUpperCase() === targetMat);
    }

    const debugConsole = buildDebugConsole(code, 0, filtered.length, filtered.length, filtered, 'MARA');

    // If code has WRITE statements, render formatted SAP Classic List
    if (upper.includes('WRITE:')) {
      const classicLines: string[] = [];
      classicLines.push('========================================================================================');
      classicLines.push('SAP GUI - RELATÓRIO DE MATERIAIS - PROGRAMA Z_APRENDIZADO_ABAP');
      classicLines.push(`Data: 2026-09-22 | Hora: 11:42:00 | Usuário: BLEME | Mandante: 100 | SY-SUBRC: 0`);
      classicLines.push('========================================================================================');
      classicLines.push('| Nº Material  | Tipo | Unid. | Descrição Breve do Material                            |');
      classicLines.push('----------------------------------------------------------------------------------------');

      for (const row of filtered) {
        classicLines.push(
          `| ${String(row.MATNR).padEnd(12)} | ${String(row.MTART).padEnd(4)} | ${String(row.MEINS).padEnd(5)} | ${String(row.MAKTX).padEnd(54)} |`
        );
      }
      classicLines.push('----------------------------------------------------------------------------------------');
      classicLines.push(`Total de registros listados: ${filtered.length} | SY-TABIX: ${filtered.length} | Status: Concluído com Sucesso.`);

      return {
        success: true,
        type: 'classic_write',
        statusMessage: `S:001 ${filtered.length} registros processados com sucesso. SY-SUBRC = 0.`,
        sySubrc: 0,
        syTabix: filtered.length,
        classicLines,
        debugConsole,
      };
    }

    // Default to modern ALV Grid for table queries
    return {
      success: true,
      type: 'alv_grid',
      statusMessage: `S:001 ${filtered.length} registros exibidos no SAP List Viewer (ALV Grid). SY-SUBRC = 0.`,
      sySubrc: 0,
      syTabix: filtered.length,
      alvData: {
        tableName: 'MARA (Dados Gerais de Material)',
        columns: ['MATNR', 'MTART', 'MEINS', 'MAKTX', 'MATKL', 'ERNAM'],
        rows: filtered,
      },
      debugConsole,
    };
  }

  // Detect query on VBAK
  if (upper.includes('FROM VBAK')) {
    const debugConsole = buildDebugConsole(code, 0, MOCK_VBAK.length, MOCK_VBAK.length, MOCK_VBAK, 'VBAK');
    return {
      success: true,
      type: 'alv_grid',
      statusMessage: `S:001 ${MOCK_VBAK.length} ordens de vendas selecionadas via ALV. SY-SUBRC = 0.`,
      sySubrc: 0,
      syTabix: MOCK_VBAK.length,
      alvData: {
        tableName: 'VBAK (Cabeçalho de Ordem de Venda)',
        columns: ['VBELN', 'ERDAT', 'ERNAM', 'AUART', 'KUNNR', 'NETWR', 'WAERK'],
        rows: MOCK_VBAK,
      },
      debugConsole,
    };
  }

  // Detect query on KNA1
  if (upper.includes('FROM KNA1')) {
    const debugConsole = buildDebugConsole(code, 0, MOCK_KNA1.length, MOCK_KNA1.length, MOCK_KNA1, 'KNA1');
    return {
      success: true,
      type: 'alv_grid',
      statusMessage: `S:001 ${MOCK_KNA1.length} clientes selecionados via ALV. SY-SUBRC = 0.`,
      sySubrc: 0,
      syTabix: MOCK_KNA1.length,
      alvData: {
        tableName: 'KNA1 (Mestre de Clientes)',
        columns: ['KUNNR', 'NAME1', 'ORT01', 'LAND1'],
        rows: MOCK_KNA1,
      },
      debugConsole,
    };
  }

  // Detect simple WRITE report
  if (upper.includes('WRITE:')) {
    const classicLines: string[] = [
      '========================================================================================',
      'SAP GUI - SAÍDA CLÁSSICA DA LISTA (WRITE)',
      'Programa: Z_RELATORIO_SIMULADO | SY-SUBRC: 0',
      '========================================================================================',
    ];

    // Extract write contents if any
    const writeMatches = code.match(/WRITE:\s*([^\.]+)\./gi);
    if (writeMatches) {
      for (const m of writeMatches) {
        classicLines.push(m.replace(/WRITE:/i, '').trim());
      }
    } else {
      classicLines.push('Execução finalizada com êxito. Nenhum erro reportado.');
    }

    const debugConsole = buildDebugConsole(code, 0, 1, 0, [], 'RELATORIO');

    return {
      success: true,
      type: 'classic_write',
      statusMessage: 'S:001 Execução do relatório concluída com sucesso. SY-SUBRC = 0.',
      sySubrc: 0,
      classicLines,
      debugConsole,
    };
  }

  // Generic success
  const genericDebug = buildDebugConsole(code, 0, 0, 0, [], 'PROGRAMA');
  return {
    success: true,
    type: 'classic_write',
    statusMessage: 'S:000 Programa ABAP executado com sucesso. SY-SUBRC = 0.',
    sySubrc: 0,
    classicLines: [
      'SAP NetWeaver Application Server ABAP',
      'Código verificado e executado sem inconsistências.',
      'SY-SUBRC = 0 (Operação bem-sucedida).',
    ],
    debugConsole: genericDebug,
  };
}
