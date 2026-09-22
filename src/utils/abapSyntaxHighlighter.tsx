import React from 'react';
import { ABAP_GLOSSARY } from '../data/abapGlossary';

const ABAP_KEYWORDS = new Set([
  'REPORT', 'PROGRAM', 'TABLES', 'PARAMETERS', 'SELECT-OPTIONS', 'TYPES',
  'DATA', 'START-OF-SELECTION', 'END-OF-SELECTION', 'INITIALIZATION',
  'AT', 'SELECTION-SCREEN', 'SELECT', 'SINGLE', 'FROM', 'INTO', 'TABLE',
  'CORRESPONDING', 'FIELDS', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'EQ',
  'NE', 'LT', 'LE', 'GT', 'GE', 'ORDER', 'BY', 'GROUP', 'UP', 'ROWS',
  'LOOP', 'ENDLOOP', 'READ', 'INDEX', 'WITH', 'KEY', 'BINARY', 'SEARCH',
  'IF', 'ELSE', 'ELSEIF', 'ENDIF', 'CASE', 'WHEN', 'ENDCASE', 'DO',
  'ENDDO', 'WHILE', 'ENDWHILE', 'CHECK', 'EXIT', 'CONTINUE', 'RETURN',
  'WRITE', 'ULINE', 'SKIP', 'NEW-LINE', 'FORMAT', 'COLOR', 'INTENSIFIED',
  'COL_HEADING', 'COL_NORMAL', 'COL_KEY', 'COL_TOTAL', 'COL_NEGATIVE', 'COL_POSITIVE',
  'CLEAR', 'REFRESH', 'FREE', 'APPEND', 'INSERT', 'MODIFY', 'DELETE',
  'SORT', 'DESCENDING', 'ASCENDING', 'MOVE', 'MOVE-CORRESPONDING',
  'PERFORM', 'FORM', 'ENDFORM', 'USING', 'CHANGING', 'VALUE',
  'CALL', 'FUNCTION', 'EXPORTING', 'IMPORTING', 'EXCEPTIONS', 'OTHERS',
  'FIELD-SYMBOLS', 'ASSIGN', 'ASSIGNING', 'FIELD-SYMBOL', 'UNASSIGN',
  'MESSAGE', 'TYPE', 'ID', 'NUMBER', 'TRY', 'CATCH', 'ENDTRY', 'CLEANUP',
  'RAISE', 'EXCEPTION', 'CREATE', 'OBJECT', 'CLASS', 'ENDCLASS',
  'METHOD', 'ENDMETHOD', 'PUBLIC', 'PROTECTED', 'PRIVATE', 'SECTION',
  'OBLIGATORY', 'DEFAULT', 'BEGIN', 'OF', 'END', 'AS', 'CHECKBOX',
  'RADIOBUTTON', 'GROUP', 'STANDARD', 'SORTED', 'HASHED', 'ANY',
  'LINES', 'LINE_EXISTS', 'COND', 'SWITCH', 'EXACT', 'SUBMIT', 'LEAVE'
]);

export interface HighlightedToken {
  type: 'keyword' | 'number' | 'string' | 'comment' | 'operator' | 'identifier' | 'whitespace';
  text: string;
}

export function tokenizeAbapLine(line: string): HighlightedToken[] {
  const tokens: HighlightedToken[] = [];
  const trimmed = line.trim();

  // Full line comment starting with *
  if (trimmed.startsWith('*')) {
    tokens.push({ type: 'comment', text: line });
    return tokens;
  }

  let i = 0;
  const len = line.length;

  while (i < len) {
    const char = line[i];

    // Inline comment starting with "
    if (char === '"') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }

    // String literal with single quote '...'
    if (char === "'") {
      let str = "'";
      i++;
      while (i < len && line[i] !== "'") {
        str += line[i];
        i++;
      }
      if (i < len && line[i] === "'") {
        str += "'";
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // String template literal with `...`
    if (char === '`') {
      let str = '`';
      i++;
      while (i < len && line[i] !== '`') {
        str += line[i];
        i++;
      }
      if (i < len && line[i] === '`') {
        str += '`';
        i++;
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // Whitespace
    if (/\s/.test(char)) {
      let space = '';
      while (i < len && /\s/.test(line[i])) {
        space += line[i];
        i++;
      }
      tokens.push({ type: 'whitespace', text: space });
      continue;
    }

    // Number literal (Verde água / Teal no SAP NetWeaver)
    if (/[0-9]/.test(char) && (i === 0 || /[\s,(:=+\-*/]/.test(line[i - 1]))) {
      let num = '';
      while (i < len && /[0-9.]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', text: num });
      continue;
    }

    // Word / Identifier / Keyword (letters, digits, dashes, underscores)
    if (/[a-zA-Z_@]/.test(char)) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_\-<>#@]/.test(line[i])) {
        word += line[i];
        i++;
      }

      const cleanWord = word.replace(/^@/, '').toUpperCase();
      if (ABAP_KEYWORDS.has(cleanWord)) {
        tokens.push({ type: 'keyword', text: word });
      } else {
        tokens.push({ type: 'identifier', text: word });
      }
      continue;
    }

    // Punctuation / Operator
    tokens.push({ type: 'operator', text: char });
    i++;
  }

  return tokens;
}

/**
 * Render tokenized line with authentic SAP NetWeaver Editor styles:
 * - Keywords: Deep Blue (#0000FF) bold with interactive (*) button
 * - Numbers: Teal / Aqua (#008080)
 * - Strings: SAP Green (#008000)
 * - Comments: Olive / Gray (#707070) italic
 * - Identifiers: Slate Dark (#111827)
 */
export const renderHighlightedToken = (
  token: HighlightedToken, 
  key: string | number,
  onAsteriskClick?: (term: string) => void
) => {
  const cleanTerm = token.text.replace(/^@/, '').toUpperCase();
  const isGlossaryTerm = Boolean(ABAP_GLOSSARY[cleanTerm]);

  switch (token.type) {
    case 'keyword':
      return (
        <span key={key} className="inline-flex items-center group/kw align-baseline">
          <span className="text-[#0000ff] font-bold">
            {token.text}
          </span>
          {onAsteriskClick && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAsteriskClick(cleanTerm);
              }}
              title={`Explicar comando ABAP: ${cleanTerm} (*)`}
              className="inline-flex items-center justify-center w-3 h-3 text-[9px] font-mono font-bold bg-blue-100 hover:bg-[#0070f2] text-blue-800 hover:text-white rounded-2xs border border-blue-300 shadow-2xs transition-all ml-0.5 align-middle leading-none cursor-pointer"
            >
              *
            </button>
          )}
        </span>
      );

    case 'number':
      return (
        <span key={key} className="text-[#008080] font-semibold">
          {token.text}
        </span>
      );

    case 'string':
      return (
        <span key={key} className="text-[#008000] font-normal">
          {token.text}
        </span>
      );

    case 'comment':
      return (
        <span key={key} className="text-[#707070] italic">
          {token.text}
        </span>
      );

    case 'operator':
      return (
        <span key={key} className="text-slate-800 font-bold">
          {token.text}
        </span>
      );

    default:
      // Check if identifier is in glossary (like SY-SUBRC, SY-TABIX, MARA, ALV, BAPI)
      if (isGlossaryTerm && onAsteriskClick) {
        return (
          <span key={key} className="inline-flex items-center group/id align-baseline">
            <span className="text-slate-900 font-medium">
              {token.text}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAsteriskClick(cleanTerm);
              }}
              title={`Ver significado de ${cleanTerm} (*)`}
              className="inline-flex items-center justify-center w-3 h-3 text-[9px] font-mono font-bold bg-amber-100 hover:bg-amber-500 text-amber-900 hover:text-slate-950 rounded-2xs border border-amber-300 shadow-2xs transition-all ml-0.5 align-middle leading-none cursor-pointer"
            >
              *
            </button>
          </span>
        );
      }

      return <span key={key} className="text-slate-900">{token.text}</span>;
  }
};

