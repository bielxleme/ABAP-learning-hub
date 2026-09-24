import { ObsoleteCommandInfo, VersionNoticeInfo, CodeEvaluationResult } from '../types';

/**
 * Normalizes ABAP code for flexible syntax matching:
 * - Strips full-line comments (* or ")
 * - Collapses multiple whitespaces
 * - Upper-cases keywords/code
 * - Normalizes quotes and punctuation spacing
 */
export function normalizeAbapCode(code: string): string {
  if (!code) return '';
  return code
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return !trimmed.startsWith('*') && trimmed.length > 0;
    })
    .map((line) => {
      // Remove trailing inline comments
      const commentIdx = line.indexOf('"');
      return commentIdx >= 0 ? line.substring(0, commentIdx) : line;
    })
    .join(' ')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks for obsolete / legacy ABAP statements and returns recommendations with immediate examples.
 */
export function detectObsoleteCommands(code: string): ObsoleteCommandInfo[] {
  const normalized = normalizeAbapCode(code);
  const obsoleteFound: ObsoleteCommandInfo[] = [];

  // 1. MOVE ... TO ...
  if (/\bMOVE\s+[\w\-\>\[\]\(\)]+\s+TO\s+[\w\-\>\[\]\(\)]+/i.test(normalized)) {
    obsoleteFound.push({
      command: 'MOVE ... TO ...',
      title: 'Comando MOVE ... TO (Obsoleto no ABAP Moderno)',
      description: 'A instrução MOVE ... TO é considerada obsoleta desde o ABAP 7.40, devendo ser substituída por atribuição direta ou construtor VALUE.',
      modernAlternative: 'Atribuição direta (=) ou CORRESPONDING #( ... )',
      exampleCode: `* Código Obsoleto:\nMOVE wa_origem TO wa_destino.\n\n* Código Recomendado (ABAP 7.40+):\nwa_destino = wa_origem.\n" Ou para estruturas com mapeamento:\nwa_destino = CORRESPONDING #( wa_origem ).`,
    });
  }

  // 2. COMPUTE ... = ...
  if (/\bCOMPUTE\s+[\w\-]+\s*=/i.test(normalized)) {
    obsoleteFound.push({
      command: 'COMPUTE',
      title: 'Palavra-chave COMPUTE (Obsoleta)',
      description: 'A palavra-chave COMPUTE não é mais necessária no ABAP. A atribuição de cálculos matemáticos é feita diretamente.',
      modernAlternative: 'Atribuição direta (ex: lv_total = lv_a + lv_b.)',
      exampleCode: `* Código Obsoleto:\nCOMPUTE lv_total = lv_preco * lv_qtd.\n\n* Código Recomendado:\nlv_total = lv_preco * lv_qtd.`,
    });
  }

  // 3. OCCURS in internal tables
  if (/\bOCCURS\s+\d+\b/i.test(normalized)) {
    obsoleteFound.push({
      command: 'OCCURS <n>',
      title: 'Cláusula OCCURS em Tabelas Internas (Obsoleta)',
      description: 'A cláusula OCCURS é herança do ABAP procedural antigo e é proibida em classes e contextos modernos.',
      modernAlternative: 'TYPE STANDARD TABLE OF ... WITH EMPTY KEY',
      exampleCode: `* Código Obsoleto:\nDATA lt_tabela TYPE ty_tabela OCCURS 0.\n\n* Código Recomendado (ABAP 7.40+):\nDATA lt_tabela TYPE STANDARD TABLE OF ty_tabela WITH EMPTY KEY.`,
    });
  }

  // 4. WITH HEADER LINE
  if (/\bWITH\s+HEADER\s+LINE\b/i.test(normalized)) {
    obsoleteFound.push({
      command: 'WITH HEADER LINE',
      title: 'Tabelas Internas com Header Line (Proibido em OO)',
      description: 'Tabelas com linha de cabeçalho unificada (Header Line) causam ambiguidade e foram banidas em ABAP Orientado a Objetos e ABAP Cloud.',
      modernAlternative: 'Tabela explícita + Work Area separada',
      exampleCode: `* Código Obsoleto:\nDATA lt_mara TYPE mara OCCURS 0 WITH HEADER LINE.\n\n* Código Recomendado:\nDATA: lt_mara TYPE STANDARD TABLE OF mara WITH EMPTY KEY,\n      ls_mara TYPE mara.`,
    });
  }

  // 5. TABLES: mara, marc...
  if (/\bTABLES\s*:\s*[\w\s,]+/i.test(normalized)) {
    obsoleteFound.push({
      command: 'TABLES: <tabela>',
      title: 'Declaração TABLES: de Dicionário (Obsoleta)',
      description: 'Declarações da estrutura TABLES: alocam variáveis globais de interface do dynpro antigo. Devem ser substituídas por tipos locais ou estruturas.',
      modernAlternative: 'DATA ls_tabela TYPE <tabela>.',
      exampleCode: `* Código Obsoleto:\nTABLES: mara, vbak.\n\n* Código Recomendado:\nDATA: ls_mara TYPE mara,\n      ls_vbak TYPE vbak.`,
    });
  }

  // 6. DESCRIBE TABLE ... LINES ...
  if (/\bDESCRIBE\s+TABLE\s+[\w\-]+\s+LINES\b/i.test(normalized)) {
    obsoleteFound.push({
      command: 'DESCRIBE TABLE itab LINES lv_count',
      title: 'Instrução DESCRIBE TABLE ... LINES (Legada)',
      description: 'O comando DESCRIBE TABLE é verboso e antigo. O ABAP moderno possui funções embutidas de tabela muito mais legíveis e concisas.',
      modernAlternative: 'Função embutida lines( itab )',
      exampleCode: `* Código Legado:\nDESCRIBE TABLE lt_dados LINES lv_linhas.\n\n* Código Recomendado (ABAP 7.02+ / 7.40+):\nlv_linhas = lines( lt_dados ).`,
    });
  }

  // 7. ADD / SUBTRACT / MULTIPLY / DIVIDE
  if (/\b(ADD\s+[\w\-]+\s+TO|SUBTRACT\s+[\w\-]+\s+FROM|MULTIPLY\s+[\w\-]+\s+BY|DIVIDE\s+[\w\-]+\s+BY)\b/i.test(normalized)) {
    obsoleteFound.push({
      command: 'ADD / SUBTRACT / MULTIPLY / DIVIDE',
      title: 'Operadores Matemáticos em Palavras (Obsoletos)',
      description: 'Instruções como ADD 1 TO x foram substituídas por operadores matemáticos padrão (+, -, *, / ou +=, -=).',
      modernAlternative: 'Operadores convencionais (x = x + 1 ou x += 1)',
      exampleCode: `* Código Obsoleto:\nADD 1 TO lv_contador.\n\n* Código Recomendado:\nlv_contador = lv_contador + 1.\n" Ou no ABAP 7.54+:\nlv_contador += 1.`,
    });
  }

  // 8. SELECT ... ENDSELECT loops
  if (/\bSELECT\b[\s\S]*\bENDSELECT\b/i.test(normalized)) {
    obsoleteFound.push({
      command: 'SELECT ... ENDSELECT',
      title: 'Anti-pattern de Performance: SELECT ... ENDSELECT',
      description: 'Loops SELECT ... ENDSELECT abrem um cursor e trafegam registro a registro na rede entre o banco e o servidor SAP, degradando a performance.',
      modernAlternative: 'SELECT ... INTO TABLE @DATA(lt_...) (Bulk Fetch)',
      exampleCode: `* Anti-pattern de Performance:\nSELECT * FROM mara INTO wa_mara.\n  WRITE:/ wa_mara-matnr.\nENDSELECT.\n\n* Padrão Recomendado:\nSELECT matnr, mtart FROM mara\n  INTO TABLE @DATA(lt_mara)\n  WHERE ...\n\nLOOP AT lt_mara INTO @DATA(ls_mara).\n  " Processar lote de registros\nENDLOOP.`,
    });
  }

  return obsoleteFound;
}

/**
 * Checks for syntax higher than ABAP 7.50 (such as ABAP 7.55+, 7.56+, 7.57+ / SAP S/4HANA 2020+ / BTP ABAP Cloud).
 */
export function detectHigherVersionSyntax(code: string): VersionNoticeInfo[] {
  const normalized = normalizeAbapCode(code);
  const notices: VersionNoticeInfo[] = [];

  // 1. FINAL(...) variable declaration (ABAP 7.55+)
  if (/\bFINAL\s*\(\s*[\w\-]+\s*\)\s*=/i.test(normalized)) {
    notices.push({
      version: 'ABAP 7.55+ (SAP S/4HANA 2020+ / ABAP Cloud)',
      feature: 'Declaração Imutável FINAL(...)',
      message: 'A instrução FINAL(...) declara variáveis imutáveis (constantes locais pós-inicialização) e foi introduzida no ABAP 7.55. O ambiente básico cobre até ABAP 7.50, mas sua resposta é avançada e foi validada com sucesso!',
    });
  }

  // 2. CDS View Entity (DEFINE VIEW ENTITY)
  if (/\bDEFINE\s+VIEW\s+ENTITY\b/i.test(normalized)) {
    notices.push({
      version: 'ABAP 7.55+',
      feature: 'CDS View Entity (define view entity)',
      message: 'A sintaxe "define view entity" substituiu o clássico "define view" a partir do ABAP 7.55, eliminando a visão SQL de dicionário.',
    });
  }

  // 3. DISCARDING DUPLICATES in CORRESPONDING
  if (/\bDISCARDING\s+DUPLICATES\b/i.test(normalized)) {
    notices.push({
      version: 'ABAP 7.55+',
      feature: 'CORRESPONDING #( ... DISCARDING DUPLICATES )',
      message: 'A cláusula DISCARDING DUPLICATES para manipulação de tabelas foi introduzida no SAP S/4HANA versão 2020 (ABAP 7.55).',
    });
  }

  return notices;
}

/**
 * Validates a single expected token against the user's ABAP code with full support for:
 * - Traditional ABAP (INTO wa_mara, INTO TABLE lt_mara)
 * - Modern Open SQL with host escape (INTO @wa_mara, INTO TABLE @lt_mara)
 * - Modern Open SQL with inline declaration (INTO @DATA(wa_mara), INTO TABLE @DATA(lt_mara))
 * - Inline declarations without host @ (INTO DATA(wa_mara), INTO TABLE DATA(lt_mara))
 * - CORRESPONDING FIELDS variants
 * - Comma-separated field projections (SELECT matnr, mtart vs SELECT matnr mtart)
 * - Optional period variations
 */
export function checkTokenMatches(normalizedCode: string, token: string): boolean {
  const tokenUpper = token.toUpperCase().trim().replace(/\s+/g, ' ');

  // Direct exact match
  if (normalizedCode.includes(tokenUpper)) {
    return true;
  }

  // Case 1: INTO <VAR> (e.g. INTO WA_MARA)
  // Matches: INTO WA_MARA, INTO @WA_MARA, INTO @DATA(WA_MARA), INTO DATA(WA_MARA), INTO CORRESPONDING FIELDS OF WA_MARA...
  const intoSingleRegex = /^INTO\s+([A-Z0-9_\-]+)$/i;
  const intoSingleMatch = tokenUpper.match(intoSingleRegex);
  if (intoSingleMatch) {
    const varName = intoSingleMatch[1];
    // Regex matching: INTO (CORRESPONDING FIELDS OF\s+)?(@?DATA\(\s*<varName>\s*\)|@?<varName>)
    const pattern = new RegExp(`\\bINTO\\s+(CORRESPONDING\\s+FIELDS\\s+OF\\s+)?(@?DATA\\s*\\(\\s*${varName}\\s*\\)|@?${varName})\\b`, 'i');
    if (pattern.test(normalizedCode)) return true;
  }

  // Case 2: INTO TABLE <ITAB> (e.g. INTO TABLE LT_MATERIAIS)
  // Matches: INTO TABLE LT_MATERIAIS, INTO TABLE @LT_MATERIAIS, INTO TABLE @DATA(LT_MATERIAIS), INTO CORRESPONDING FIELDS OF TABLE...
  const intoTableRegex = /^INTO\s+TABLE\s+([A-Z0-9_\-]+)$/i;
  const intoTableMatch = tokenUpper.match(intoTableRegex);
  if (intoTableMatch) {
    const itabName = intoTableMatch[1];
    const pattern = new RegExp(`\\b(INTO|APPENDING)\\s+(CORRESPONDING\\s+FIELDS\\s+OF\\s+)?TABLE\\s+(@?DATA\\s*\\(\\s*${itabName}\\s*\\)|@?${itabName})\\b`, 'i');
    if (pattern.test(normalizedCode)) return true;
  }

  // Case 3: Projection lists with or without commas (e.g. "SELECT MATNR MTART" vs "SELECT MATNR, MTART")
  if (tokenUpper.startsWith('SELECT ') && !tokenUpper.includes('SINGLE')) {
    // Check if token contains field names
    const fieldsPart = tokenUpper.replace(/^SELECT\s+/, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
    const fields = fieldsPart.split(' ').filter(Boolean);
    if (fields.length > 0) {
      // Check if all fields are present in normalized code after SELECT
      const allFieldsPresent = fields.every((f) => new RegExp(`\\b${f}\\b`, 'i').test(normalizedCode));
      if (allFieldsPresent && normalizedCode.includes('SELECT')) return true;
    }
  }

  // Case 4: Field list item tokens like 'MTART' or 'MATNR'
  // Ignore possible trailing/leading commas or spaces in user code
  const cleanWord = tokenUpper.replace(/[,\.]/g, '').trim();
  if (cleanWord.length > 0) {
    const wordPattern = new RegExp(`\\b${cleanWord}\\b`, 'i');
    if (wordPattern.test(normalizedCode)) return true;
  }

  // Case 5: WHERE clause with host variable (WHERE MATNR = vs WHERE MATNR = @LV_MATNR or WHERE MATNR =)
  if (tokenUpper.startsWith('WHERE ')) {
    const wherePart = tokenUpper.replace(/[@]/g, '');
    const codeNoHost = normalizedCode.replace(/[@]/g, '');
    if (codeNoHost.includes(wherePart)) return true;
  }

  // Case 6: Append work area vs Append VALUE (APPEND WA_MARA TO LT_MARA vs APPEND VALUE #( ... ) TO LT_MARA)
  const appendRegex = /^APPEND\s+([A-Z0-9_\-]+)\s+TO\s+([A-Z0-9_\-]+)$/i;
  const appendMatch = tokenUpper.match(appendRegex);
  if (appendMatch) {
    const itabName = appendMatch[2];
    const pattern = new RegExp(`\\b(APPEND|INSERT)\\s+(VALUE\\s*#\\s*\\([\\s\\S]*?\\)|[A-Z0-9_\\-]+)\\s+(TO|INTO\\s+TABLE)\\s+${itabName}\\b`, 'i');
    if (pattern.test(normalizedCode)) return true;
  }

  // Case 7: READ TABLE itab INTO wa WITH KEY field = ... vs modern itab[ field = ... ]
  if (tokenUpper.startsWith('READ TABLE') && tokenUpper.includes('WITH KEY')) {
    // If user wrote table expression: itab[ ... ]
    if (/[\w\-]+\s*\[[\s\S]+\]/i.test(normalizedCode)) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates exercise code flexibly, verifying required tokens, detecting obsolete ABAP constructs,
 * and identifying ABAP 7.55+ features with actionable feedback.
 */
export function evaluateAbapCodeSubmission(
  userCode: string,
  solutionPattern: {
    requiredTokens: string[];
    forbiddenTokens?: string[];
    sampleSolution?: string;
  }
): CodeEvaluationResult {
  const normalizedCode = normalizeAbapCode(userCode);
  const obsoleteCommands = detectObsoleteCommands(userCode);
  const versionNotices = detectHigherVersionSyntax(userCode);
  const detectedFeatures: string[] = [];

  // Check detected modern features
  if (/@DATA\s*\(/i.test(userCode)) {
    detectedFeatures.push('Declaração Inline @DATA(...) (ABAP 7.40+)');
  }
  if (/INTO\s+@[\w\-]+/i.test(userCode)) {
    detectedFeatures.push('Escape de Host Variable @ (Open SQL Moderno)');
  }
  if (/VALUE\s*#\s*\(/i.test(userCode)) {
    detectedFeatures.push('Construtor de Expressão VALUE #( )');
  }
  if (/CORRESPONDING\s*#\s*\(/i.test(userCode)) {
    detectedFeatures.push('Mapeamento CORRESPONDING #( )');
  }
  if (/lines\s*\(/i.test(userCode)) {
    detectedFeatures.push('Função Embutida lines( )');
  }
  if (/[\w\-]+\s*\[[^\]]+\]/i.test(userCode)) {
    detectedFeatures.push('Table Expression itab[ ... ]');
  }

  // Check forbidden tokens
  if (solutionPattern.forbiddenTokens && solutionPattern.forbiddenTokens.length > 0) {
    for (const forbidden of solutionPattern.forbiddenTokens) {
      const forbUpper = forbidden.toUpperCase().trim();
      if (normalizedCode.includes(forbUpper)) {
        return {
          passed: false,
          errorMessage: `O código utilizou a instrução não recomendada "${forbidden}" para este desafio.`,
          obsoleteCommands,
          versionNotices,
          detectedFeatures,
        };
      }
    }
  }

  // Check required tokens with flexible matcher
  for (const token of solutionPattern.requiredTokens) {
    const isMatched = checkTokenMatches(normalizedCode, token);
    if (!isMatched) {
      // Format instructional message
      let friendlyHint = `A instrução ABAP esperada "${token}" não foi identificada no seu código.`;
      if (token.toUpperCase().startsWith('INTO WA_')) {
        friendlyHint = `Cláusula de destino não encontrada: utilize "INTO wa_..." ou a sintaxe moderna Open SQL "INTO @DATA(wa_...)".`;
      } else if (token.toUpperCase().startsWith('INTO TABLE LT_')) {
        friendlyHint = `Cláusula de destino em tabela não encontrada: use "INTO TABLE lt_..." ou "INTO TABLE @DATA(lt_...)".`;
      }

      return {
        passed: false,
        missingToken: token,
        errorMessage: friendlyHint,
        obsoleteCommands,
        versionNotices,
        detectedFeatures,
      };
    }
  }

  // Passed validation!
  return {
    passed: true,
    obsoleteCommands,
    versionNotices,
    detectedFeatures,
  };
}
