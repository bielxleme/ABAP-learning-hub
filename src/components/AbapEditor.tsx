import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  Code, 
  FileCode, 
  Info,
  ChevronDown,
  Layers,
  Wand2,
  Bug,
  Save,
  Check,
  Search,
  Printer,
  ArrowLeft,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { AbapSyntaxError, SimulationResult } from '../types';
import { lintAbapCode, simulateAbapExecution } from '../utils/abapLinter';
import { INITIAL_ABAP_CODE, SAP_KEYWORD_DOCS } from '../data/sapReference';
import { tokenizeAbapLine, renderHighlightedToken } from '../utils/abapSyntaxHighlighter';
import { AbapGlossaryModal } from './AbapGlossaryModal';
import { AbapGlossaryOverlay } from './AbapGlossaryOverlay';
import { AbapNetweaverDebugger } from './AbapNetweaverDebugger';
import { ABAP_GLOSSARY } from '../data/abapGlossary';

interface AbapEditorProps {
  code: string;
  setCode: (newCode: string) => void;
  onSendToChat: (code: string) => void;
  onSuccessfulSimulation: () => void;
  onRunSimulation?: (mode: 'output' | 'debug') => void;
  onRecordError?: (category: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX', title: string, detail: string, codeSnippet?: string) => void;
  onNavigateToLab?: () => void;
  soundEnabled: boolean;
}

const TEMPLATES: { name: string; desc: string; code: string }[] = [
  {
    name: '1. Consulta MARA (Materiais KA)',
    desc: 'SELECT com filtro WHERE mtart = \'KA\' e saída WRITE',
    code: INITIAL_ABAP_CODE,
  },
  {
    name: '2. Parâmetro de Tela e SELECT Único',
    desc: 'Uso de PARAMETERS e SELECT SINGLE em MARA',
    code: `*&---------------------------------------------------------------------*
*& Report Z_SELECAO_MATERIAL
*&---------------------------------------------------------------------*
REPORT z_selecao_material.

TABLES: mara.

* Entrada obrigatória de um único material
PARAMETERS: p_matnr TYPE mara-matnr OBLIGATORY DEFAULT '100-100'.

START-OF-SELECTION.
  SELECT SINGLE matnr, mtart, meins, maktx
    FROM mara
    INTO @DATA(ls_material)
    WHERE matnr = @p_matnr.

  IF sy-subrc = 0.
    WRITE: / 'Material Encontrado:', ls_material-matnr COLOR COL_KEY,
           / 'Tipo:', ls_material-mtart,
           / 'Descrição:', ls_material-maktx.
  ELSE.
    WRITE: / 'Material não cadastrado na base de dados!' COLOR COL_NEGATIVE.
  ENDIF.
`,
  },
  {
    name: '3. Tabela Interna com FIELD-SYMBOLS',
    desc: 'Moderno LOOP AT ASSIGNING FIELD-SYMBOL(<fs>)',
    code: `*&---------------------------------------------------------------------*
*& Report Z_LOOP_PERFORMANCE
*&---------------------------------------------------------------------*
REPORT z_loop_performance.

TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         maktx TYPE maktx,
       END OF ty_material.

DATA: lt_itens TYPE TABLE OF ty_material.

START-OF-SELECTION.
  " Carrega dados da MARA
  SELECT matnr, mtart, maktx
    FROM mara
    INTO TABLE @lt_itens.

  IF sy-subrc = 0.
    WRITE: /(50) 'PROCESSAMENTO COM FIELD-SYMBOLS (Clean ABAP)' COLOR COL_HEADING.
    ULINE.

    LOOP AT lt_itens ASSIGNING FIELD-SYMBOL(<fs_item>).
      WRITE: / <fs_item>-matnr, <fs_item>-mtart, <fs_item>-maktx.
    ENDLOOP.
  ENDIF.
`,
  },
  {
    name: '4. Chamada de BAPI Transacional',
    desc: 'Estrutura típica de CALL FUNCTION com COMMIT',
    code: `*&---------------------------------------------------------------------*
*& Report Z_CHAMADA_BAPI
*&---------------------------------------------------------------------*
REPORT z_chamada_bapi.

DATA: lt_return TYPE TABLE OF bapiret2.

START-OF-SELECTION.
  WRITE: / 'Iniciando chamada da BAPI...' COLOR COL_NORMAL.

  " Chamada da BAPI
  CALL FUNCTION 'BAPI_MATERIAL_GET_DETAIL'
    EXPORTING
      material = '100-100'
    TABLES
      return   = lt_return.

  IF NOT line_exists( lt_return[ type = 'E' ] ).
    WRITE: / 'BAPI executada com sucesso! Consolidando LUW:' COLOR COL_POSITIVE.
    CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'.
  ELSE.
    WRITE: / 'Falha reportada na tabela de retorno da BAPI!' COLOR COL_NEGATIVE.
  ENDIF.
`,
  },
];

export const AbapEditor: React.FC<AbapEditorProps> = ({
  code,
  setCode,
  onSendToChat,
  onSuccessfulSimulation,
  onRunSimulation,
  onRecordError,
  onNavigateToLab,
  soundEnabled,
}) => {
  const [errors, setErrors] = useState<AbapSyntaxError[]>([]);
  const [activeGuideKeyword, setActiveGuideKeyword] = useState<string | null>('SELECT');
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  const [showGlossaryOverlay, setShowGlossaryOverlay] = useState(false);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string | null>(null);
  const [showDebuggerModal, setShowDebuggerModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAsteriskClick = (term: string) => {
    setSelectedGlossaryTerm(term);
    setShowGlossaryOverlay(true);
  };

  // Validate on code change
  useEffect(() => {
    const lintResults = lintAbapCode(code);
    setErrors(lintResults);
  }, [code]);

  // Split lines for syntax display
  const lines = code.split('\n');

  const handleInsertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setCode(code + '\n' + snippet);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const nextCode = code.substring(0, start) + snippet + code.substring(end);
    setCode(nextCode);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + snippet.length;
      }
    }, 50);
  };

  const handleCursorMove = () => {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const textBefore = code.slice(0, cursor);
    const lastWordMatch = textBefore.match(/[A-Z0-9_\-]+$/i);
    if (lastWordMatch && lastWordMatch[0]) {
      const word = lastWordMatch[0].toUpperCase();
      if (SAP_KEYWORD_DOCS[word] || ABAP_GLOSSARY[word]) {
        setActiveGuideKeyword(word);
      }
    }
  };

  const handleAnalyzeWithAi = async () => {
    setIsAnalyzing(true);
    setShowAiModal(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        const errorMsg = data.error || 'Não foi possível obter a análise no momento.';
        setAiAnalysis(`⚠️ ${errorMsg}\n\nPor favor, aguarde alguns instantes e tente clicar novamente.`);
      }
    } catch (err: any) {
      setAiAnalysis('Erro de conexão ao contatar o SAP Mentor AI. Por favor, tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const criticalErrorsCount = errors.filter((e) => e.severity === 'error').length;
  const warningsCount = errors.filter((e) => e.severity === 'warning').length;

  // Extract detected keywords in current code for the asterisk glossary bar
  const detectedKeywords = Array.from(
    new Set(
      code
        .toUpperCase()
        .match(/\b(REPORT|TABLES|PARAMETERS|SELECT-OPTIONS|TYPES|DATA|SELECT|FROM|INTO|WHERE|LOOP AT|LOOP|READ TABLE|IF|ELSE|ENDIF|WRITE|ULINE|CLEAR|APPEND|FIELD-SYMBOLS|CALL FUNCTION|SY-SUBRC|SY-TABIX|SY-DBCNT|ALV)\b/g) || []
    )
  );

  return (
    <div className="space-y-3 font-sans">
      {/* Top Banner: Notice of Educational Focus */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-blue-900">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-[#0070f2] shrink-0" />
          <span>
            <strong>Ambiente ABAP Workbench SE38:</strong> Este editor serve de suporte prático para testar comandos e depurar linha a linha. Para consolidar seu aprendizado, pratique nos <strong>Quizzes & Desafios</strong>!
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDebuggerModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow-xs transition-all border border-amber-300 active:scale-95"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Depurador Linha a Linha (/h)</span>
          </button>

          {onRunSimulation && (
            <button
              onClick={() => onRunSimulation('output')}
              className="flex items-center space-x-1.5 px-3.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-xs transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Simular (F8)</span>
            </button>
          )}
        </div>
      </div>

      {/* SAP NETWEAVER SE38 WINDOW FRAME */}
      <div className="border-2 border-[#1b2a4a] rounded-lg shadow-xl overflow-hidden bg-white">
        {/* 1. SAP GUI Menu Bar (NetWeaver Style) */}
        <div className="bg-[#1b2a4a] text-white px-3 py-1.5 flex items-center justify-between text-xs select-none border-b border-[#2a4373]">
          <div className="flex items-center space-x-4 text-[11px]">
            <div className="flex items-center space-x-1 font-bold text-blue-200">
              <span className="w-4 h-4 bg-[#0070f2] text-white rounded-xs flex items-center justify-center text-[9px]">
                SAP
              </span>
              <span>NetWeaver ABAP Editor</span>
            </div>
            <span className="hover:text-blue-300 cursor-pointer hidden sm:inline">Programa</span>
            <span className="hover:text-blue-300 cursor-pointer hidden sm:inline">Processar</span>
            <span className="hover:text-blue-300 cursor-pointer hidden md:inline">Ir para</span>
            <span className="hover:text-blue-300 cursor-pointer hidden md:inline">Utilitários</span>
            <span className="hover:text-blue-300 cursor-pointer hidden lg:inline">Ambiente</span>
            <span className="hover:text-blue-300 cursor-pointer hidden lg:inline">Sistema</span>
            <span className="hover:text-blue-300 cursor-pointer hidden sm:inline">Ajuda</span>
          </div>

          <div className="text-[11px] text-blue-200 font-mono">
            Mandante: 100 • Sistema: PRD
          </div>
        </div>

        {/* 2. Classic SAP GUI Standard Toolbar with Command Field */}
        <div className="bg-[#e4ebf2] border-b border-slate-300 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
          <div className="flex items-center space-x-2">
            {/* Transaction Code Box [SE38] */}
            <div className="flex items-center bg-white border border-slate-400 rounded px-1.5 py-0.5 shadow-2xs">
              <span className="text-[#0070f2] font-bold mr-1">✓</span>
              <input
                type="text"
                readOnly
                value="SE38"
                className="w-12 bg-transparent text-slate-800 font-mono font-bold text-xs focus:outline-none cursor-default"
                title="Transação SE38 - ABAP Editor"
              />
            </div>

            {/* Standard action icons */}
            <div className="flex items-center space-x-1 pl-1 border-l border-slate-300 text-slate-700">
              <button
                title="Salvar (Ctrl+S)"
                className="p-1 hover:bg-slate-200 rounded text-slate-700"
              >
                <Save className="w-3.5 h-3.5 text-blue-700" />
              </button>

              <button
                title="Voltar (F3)"
                className="p-1 hover:bg-slate-200 rounded text-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-700" />
              </button>

              <button
                title="Verificar Sintaxe (Ctrl+F2)"
                onClick={() => {
                  const errs = lintAbapCode(code);
                  setErrors(errs);
                  if (errs.length > 0 && onRecordError) {
                    const primary = errs[0];
                    const msg = (primary.message + ' ' + (primary.suggestion || '')).toLowerCase();
                    let cat: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX' = 'GENERAL_SYNTAX';
                    if (msg.includes('ponto') || msg.includes('.')) cat = 'PUNCTUATION_PERIOD';
                    else if (msg.includes('select') || msg.includes('sql') || msg.includes('into')) cat = 'SELECT_SQL';
                    else if (msg.includes('loop') || msg.includes('tabela') || msg.includes('itab') || msg.includes('symbol')) cat = 'INTERNAL_TABLES';
                    else if (msg.includes('data') || msg.includes('types') || msg.includes('parameters')) cat = 'DATA_DECLARATION';

                    onRecordError(cat, `Erro na Linha ${primary.line}: ${primary.message}`, primary.suggestion || primary.message, code);
                  }
                }}
                className="flex items-center space-x-1 px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-800 text-[11px] font-semibold"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Verificar (Ctrl+F2)</span>
              </button>

              {/* Depuração Linha a Linha button */}
              <button
                title="Depurar Código Linha a Linha (/h)"
                onClick={() => setShowDebuggerModal(true)}
                className="flex items-center space-x-1 px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded font-bold text-[11px] shadow-2xs border border-amber-500 cursor-pointer"
              >
                <Bug className="w-3 h-3" />
                <span>Depurar (/h)</span>
              </button>

              {/* Centralized Searchable Glossary Overlay Button */}
              <button
                title="Abrir Glossário Geral de Comandos & Sintaxe ABAP com Asterisco (*)"
                onClick={() => {
                  setSelectedGlossaryTerm(activeGuideKeyword || 'SELECT');
                  setShowGlossaryOverlay(true);
                }}
                className="flex items-center space-x-1 px-2.5 py-0.5 bg-[#0070f2] hover:bg-blue-600 text-white rounded font-bold text-[11px] shadow-2xs transition-colors cursor-pointer border border-blue-600"
              >
                <BookOpen className="w-3 h-3" />
                <span>Glossário (*)</span>
              </button>

              {/* Direct Execution */}
              {onRunSimulation && (
                <button
                  title="Executar no Simulador SAP (F8)"
                  onClick={() => {
                    const errs = lintAbapCode(code);
                    if (errs.length > 0 && onRecordError) {
                      const primary = errs[0];
                      const msg = (primary.message + ' ' + (primary.suggestion || '')).toLowerCase();
                      let cat: 'SELECT_SQL' | 'INTERNAL_TABLES' | 'PUNCTUATION_PERIOD' | 'DATA_DECLARATION' | 'GENERAL_SYNTAX' = 'GENERAL_SYNTAX';
                      if (msg.includes('ponto') || msg.includes('.')) cat = 'PUNCTUATION_PERIOD';
                      else if (msg.includes('select') || msg.includes('sql')) cat = 'SELECT_SQL';
                      else if (msg.includes('loop') || msg.includes('tabela') || msg.includes('itab')) cat = 'INTERNAL_TABLES';
                      else if (msg.includes('data') || msg.includes('types')) cat = 'DATA_DECLARATION';

                      onRecordError(cat, `Erro de Execução (Linha ${primary.line})`, primary.message, code);
                    }
                    onRunSimulation('output');
                  }}
                  className="flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] shadow-2xs ml-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Executar (F8)</span>
                </button>
              )}
            </div>
          </div>

          {/* Modelos Prontos Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-600 font-semibold text-[11px]">Template:</span>
            <select
              onChange={(e) => {
                const selected = TEMPLATES.find((t) => t.name === e.target.value);
                if (selected) setCode(selected.code);
              }}
              className="text-[11px] bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {TEMPLATES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Title Header Bar */}
        <div className="bg-[#f0f4f8] border-b border-slate-300 px-3 py-1 flex items-center justify-between text-xs text-slate-800 select-none">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#1b2a4a]">ABAP Editor: Modificar Report Z_APRENDIZADO_ABAP</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Status: Ativo
            </span>
          </div>

          {/* Syntax Status */}
          <div className="flex items-center space-x-2 text-[11px]">
            {criticalErrorsCount > 0 ? (
              <span className="text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {criticalErrorsCount} erro(s) de sintaxe
              </span>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sintaxe Válida
              </span>
            )}
          </div>
        </div>

        {/* 4. INTERACTIVE ASTERISK (*) GLOSSARY BAR */}
        {/* "Deixar um botão pequeno com um asterisco em palavras chave, comandos e tudo que possa levar o usuário a se perguntar o que significa tal coisa" */}
        <div className="bg-[var(--bg-card-hover)] border-b border-[var(--border-subtle)] px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-xs">
          <div className="flex items-center space-x-1 text-[#0070f2] font-bold text-[11px] mr-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#0070f2]" />
            <span>Comandos no Código (Clique no asterisco * para explicação):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {detectedKeywords.slice(0, 10).map((kw) => (
              <button
                key={kw}
                onClick={() => setGlossaryTerm(kw)}
                title={`Clique para ver explicação detalhada e exemplos de ${kw}`}
                className="group flex items-center space-x-1 px-2 py-0.5 bg-[var(--bg-card)] hover:bg-blue-500/20 text-[var(--text-main)] font-mono text-[11px] rounded border border-[var(--border-subtle)] hover:border-blue-400 transition-all shadow-2xs cursor-pointer"
              >
                <span className="text-[#0070f2] dark:text-blue-400 font-bold">{kw}</span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#0070f2] text-white font-bold text-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
                  *
                </span>
              </button>
            ))}

            <button
              onClick={() => setGlossaryTerm('SELECT')}
              className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-700 ml-1 cursor-pointer"
            >
              + Mais Comandos
            </button>
          </div>
        </div>

        {/* 5. SAP NETWEAVER EDITOR CANVAS (Theme-Aware with CSS Variables) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[460px] bg-[var(--editor-bg)] text-[var(--editor-text)]">
          {/* Code Area with Synchronized SAP NetWeaver Syntax Rendering (9 cols) */}
          <div className="lg:col-span-9 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--editor-bg)]">
            {/* View Switcher: Live Highlighted vs Direct Textarea */}
            <div className="bg-[var(--bg-card-hover)] border-b border-[var(--border-subtle)] px-3 py-1 flex items-center justify-between text-xs select-none">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditorMode('visual')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    editorMode === 'visual'
                      ? 'bg-[var(--bg-card)] text-[#0070f2] border border-[var(--border-strong)] shadow-2xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Visual NetWeaver (Cores SAP Reais)
                </button>

                <button
                  onClick={() => setEditorMode('code')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    editorMode === 'code'
                      ? 'bg-[var(--bg-card)] text-[#0070f2] border border-[var(--border-strong)] shadow-2xs font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Modo Edição Rápida
                </button>
              </div>

              <div className="text-[11px] text-[var(--text-muted)] font-mono">
                Fonte: Consolas / Courier New • {lines.length} linhas
              </div>
            </div>

            {/* Visual NetWeaver Mode (Theme-Aware Background with NetWeaver Colors) */}
            {editorMode === 'visual' ? (
              <div className="flex-1 flex flex-col bg-[var(--editor-bg)] overflow-hidden">
                <div className="flex-1 overflow-y-auto max-h-[500px] select-text">
                  <table className="w-full border-collapse font-mono text-xs sm:text-sm">
                    <tbody>
                      {lines.map((lineText, idx) => {
                        const lineNum = idx + 1;
                        const tokens = tokenizeAbapLine(lineText);
                        const hasError = errors.some((e) => e.line === lineNum);

                        return (
                          <tr
                            key={lineNum}
                            className={`hover:bg-blue-500/10 transition-colors ${
                              hasError ? 'bg-red-500/20' : ''
                            }`}
                          >
                            {/* Line Number Gutter */}
                            <td 
                              className="w-12 py-0.5 px-2 text-right border-r border-[var(--border-subtle)] select-none text-[11px] font-mono"
                              style={{ backgroundColor: 'var(--editor-gutter)', color: 'var(--editor-gutter-text)' }}
                            >
                              {lineNum}
                            </td>

                            {/* Line Content with Token Highlighting */}
                            <td 
                              className="py-0.5 px-3 whitespace-pre leading-relaxed font-mono"
                              style={{ color: 'var(--editor-text)' }}
                            >
                              {tokens.map((token, tIdx) => renderHighlightedToken(token, tIdx, handleAsteriskClick))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Quick edit inline trigger bar */}
                <div className="bg-[var(--bg-card-hover)] border-t border-[var(--border-subtle)] p-2 flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] text-[11px]">
                    Deseja alterar o código fonte?
                  </span>
                  <button
                    onClick={() => {
                      setEditorMode('code');
                      setTimeout(() => textareaRef.current?.focus(), 100);
                    }}
                    className="px-3 py-1 bg-[#0070f2] text-white rounded text-xs font-semibold hover:bg-blue-600 transition-colors shadow-2xs cursor-pointer"
                  >
                    Abrir Caixa de Edição
                  </button>
                </div>
              </div>
            ) : (
              /* Code Editor Input Textarea */
              <div className="flex-1 flex flex-col bg-[var(--editor-bg)]">
                <div className="flex-1 min-h-[420px] flex">
                  {/* Line numbers for textarea */}
                  <div 
                    className="w-12 py-3 border-r border-[var(--border-subtle)] select-none text-right pr-2 font-mono text-xs space-y-1"
                    style={{ backgroundColor: 'var(--editor-gutter)', color: 'var(--editor-gutter-text)' }}
                  >
                    {lines.map((_, i) => (
                      <div key={i} className="leading-relaxed">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <textarea
                    id="abap-main-editor"
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onClick={handleCursorMove}
                    onKeyUp={handleCursorMove}
                    spellCheck={false}
                    style={{ backgroundColor: 'var(--editor-bg)', color: 'var(--editor-text)' }}
                    className="flex-1 min-h-[420px] font-mono text-xs sm:text-sm p-3 leading-relaxed resize-none focus:outline-none selection:bg-blue-500/30 border-none"
                    placeholder="* Digite seu código ABAP aqui..."
                  />
                </div>

                <div className="bg-[var(--bg-card-hover)] border-t border-[var(--border-subtle)] p-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Edição concluída? Alterne para ver as cores originais do SAP NetWeaver.
                  </span>
                  <button
                    onClick={() => setEditorMode('visual')}
                    className="px-3 py-1 bg-[#1b2a4a] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors shadow-2xs"
                  >
                    Visualizar com Cores SAP
                  </button>
                </div>
              </div>
            )}

            {/* Validation Errors Bar */}
            {errors.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-300 p-2.5 max-h-32 overflow-y-auto space-y-1.5 text-xs font-mono">
                {errors.map((err, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start space-x-2 p-1.5 rounded ${
                      err.severity === 'error'
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-600" />
                    <div className="flex-1">
                      <span className="font-bold">Linha {err.line}:</span> {err.message}
                      {err.suggestion && (
                        <div className="text-slate-600 text-[11px] mt-0.5">
                          <span className="text-emerald-700 font-semibold">Sugestão:</span> {err.suggestion}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.length > 0 && onNavigateToLab && (
              <div className="bg-amber-50/90 border-t border-amber-200 p-2 px-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">
                    Tutor SAP: Dificuldade detectada na sintaxe. Deseja praticar desafios focados no Laboratório?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateToLab}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Praticar no Laboratório</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Right Guide & Learning Panel (3 cols) */}
          <div className="lg:col-span-3 bg-[#f7f9fb] p-3 space-y-3 flex flex-col justify-between overflow-y-auto max-h-[550px]">
            <div className="space-y-3">
              {/* Quick Asterisk Help Box */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-[#0070f2] text-white rounded-xs font-bold text-[10px] flex items-center justify-center">
                      *
                    </span>
                    <span>Guia & Dicas (F1)</span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGlossaryTerm(activeGuideKeyword || 'SELECT');
                      setShowGlossaryOverlay(true);
                    }}
                    className="text-[10px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Abrir Glossário (*)
                  </button>
                </div>

                {activeGuideKeyword && (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0000ff] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-sm">
                        {activeGuideKeyword}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedGlossaryTerm(activeGuideKeyword);
                          setShowGlossaryOverlay(true);
                        }}
                        className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <span>Explicar</span>
                        <span className="font-bold text-xs">*</span>
                      </button>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {SAP_KEYWORD_DOCS[activeGuideKeyword]?.summary ||
                        ABAP_GLOSSARY[activeGuideKeyword]?.summary ||
                        'Comando chave para desenvolvimento de relatórios e rotinas no SAP.'}
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900 leading-relaxed">
                      <span className="font-bold">Boas Práticas:</span>{' '}
                      {SAP_KEYWORD_DOCS[activeGuideKeyword]?.tip ||
                        ABAP_GLOSSARY[activeGuideKeyword]?.bestPractice ||
                        'Consulte as convenções Clean ABAP.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Keyword Catalog */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-2 text-xs">
                <div className="font-bold text-slate-700 text-xs flex items-center justify-between">
                  <span>Dicionário Rápido ABAP:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Clique no *</span>
                </div>
                <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                  {Object.keys(ABAP_GLOSSARY).slice(0, 8).map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSelectedGlossaryTerm(term);
                        setShowGlossaryOverlay(true);
                      }}
                      className="text-left px-2 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <span className="truncate">{term}</span>
                      <span className="text-blue-500 font-bold group-hover:scale-125 transition-transform">*</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant Button */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={handleAnalyzeWithAi}
                className="w-full flex items-center justify-center space-x-1.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Analisar Código com IA SAP</span>
              </button>

              <button
                onClick={() => onSendToChat(code)}
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Tirar Dúvida no Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. SAP GUI Status Bar (Bottom) */}
        <div className="bg-[#e4ebf2] border-t border-slate-300 px-3 py-1 flex items-center justify-between text-[11px] text-slate-600 select-none font-mono">
          <div className="flex items-center space-x-3">
            <span className="text-emerald-700 font-bold">● Conectado (PRD/100)</span>
            <span>Programa: Z_APRENDIZADO_ABAP</span>
            <span className="hidden sm:inline">Idioma: PT</span>
          </div>

          <div className="flex items-center space-x-3">
            <span>INS</span>
            <span>Linhas: {lines.length}</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>

      {/* CENTRALIZED SEARCHABLE GLOSSARY OVERLAY */}
      <AbapGlossaryOverlay
        isOpen={showGlossaryOverlay}
        onClose={() => {
          setShowGlossaryOverlay(false);
          setSelectedGlossaryTerm(null);
        }}
        initialTerm={selectedGlossaryTerm}
        onSelectTermInEditor={handleInsertSnippet}
      />

      {/* ASTERISK INTERACTIVE GLOSSARY MODAL (Quick View) */}
      {glossaryTerm && (
        <AbapGlossaryModal
          term={glossaryTerm}
          onClose={() => setGlossaryTerm(null)}
          onSelectRelated={(rel) => {
            setSelectedGlossaryTerm(rel);
            setShowGlossaryOverlay(true);
            setGlossaryTerm(null);
          }}
        />
      )}

      {/* LINE-BY-LINE SAP NETWEAVER DEBUGGER MODAL (/h) */}
      {showDebuggerModal && (
        <AbapNetweaverDebugger
          code={code}
          onClose={() => setShowDebuggerModal(false)}
        />
      )}

      {/* AI Analysis Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-lg shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-[#1b2a4a] text-white px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-sm">Parecer do Mentor IA SAP</span>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
              {isAnalyzing ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-600 font-medium">
                    Avaliando sintaxe, Clean ABAP e performance com a IA...
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {aiAnalysis}
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 bg-[#1b2a4a] text-white font-semibold rounded text-xs hover:bg-blue-900"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
