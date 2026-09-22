import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  CornerDownRight,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Circle,
  X,
  Plus,
  Eye,
  Table,
  Layers,
  Terminal,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  FileCode,
  ExternalLink
} from 'lucide-react';
import { SimulationResult, SapTableRecord, SapVariableWatch } from '../types';
import { MOCK_MARA, MOCK_VBAK, MOCK_KNA1 } from '../data/sapReference';

interface AbapNetweaverDebuggerProps {
  code: string;
  onClose: () => void;
  onComplete?: (result: SimulationResult) => void;
}

interface ExecutableStep {
  lineNum: number; // 1-based
  statement: string;
  type: 'data' | 'select' | 'if' | 'else' | 'endif' | 'loop' | 'endloop' | 'write' | 'uline' | 'assign' | 'other';
  loopIndex?: number;
  totalLoopItems?: number;
}

// Check if a line is a non-executable declaration (TYPES, DATA, TABLES, CONSTANTS, FIELD-SYMBOLS, REPORT)
export const isDeclarationStatement = (rawStmt: string): boolean => {
  const upper = rawStmt.trim().toUpperCase();
  if (!upper) return true;
  if (upper.startsWith('*') || upper.startsWith('"')) return true;
  return (
    upper.startsWith('REPORT ') ||
    upper.startsWith('REPORT.') ||
    upper.startsWith('PROGRAM ') ||
    upper.startsWith('TABLES:') ||
    upper.startsWith('TABLES ') ||
    upper.startsWith('TYPES:') ||
    upper.startsWith('TYPES ') ||
    upper.startsWith('DATA:') ||
    upper.startsWith('DATA ') ||
    upper.startsWith('CONSTANTS:') ||
    upper.startsWith('CONSTANTS ') ||
    upper.startsWith('FIELD-SYMBOLS:') ||
    upper.startsWith('FIELD-SYMBOLS ') ||
    upper.startsWith('BEGIN OF ') ||
    upper.startsWith('END OF ') ||
    upper === 'START-OF-SELECTION.' ||
    upper === 'INITIALIZATION.'
  );
};

export const AbapNetweaverDebugger: React.FC<AbapNetweaverDebuggerProps> = ({
  code,
  onClose,
  onComplete,
}) => {
  const codeLines = useMemo(() => code.split('\n'), [code]);

  // Breakpoints line numbers (1-based)
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());

  // Active Tab in the Right Panel
  const [activeTab, setActiveTab] = useState<'vars' | 'itab' | 'wa' | 'spool' | 'sys' | 'stack'>('vars');

  // Custom watch variable input
  const [watchInput, setWatchInput] = useState('');
  const [customWatches, setCustomWatches] = useState<string[]>([]);
  const [searchVar, setSearchVar] = useState('');

  // Selected table to inspect in ITAB tab
  const [selectedItabName, setSelectedItabName] = useState<string>('LT_MATERIAIS');

  // Build the execution steps sequence (simulating actual runtime iterations without non-executable declarations)
  const executionPlan = useMemo(() => {
    const steps: ExecutableStep[] = [];
    const lines = codeLines;

    // Detect dataset based on query
    let mockDataset: SapTableRecord[] = MOCK_MARA.filter(
      (m) => m.MTART === 'KA' || m.MTART === 'ROH' || m.MTART === 'FERT'
    );
    if (code.toUpperCase().includes('VBAK')) mockDataset = MOCK_VBAK;
    if (code.toUpperCase().includes('KNA1')) mockDataset = MOCK_KNA1;

    // Find loops and conditionals
    let insideLoop = false;
    let loopStartLine = -1;
    let loopBodySteps: { lineNum: number; stmt: string }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const raw = lines[i].trim();
      const upper = raw.toUpperCase();

      // Skip comments, empty lines and declarations (just like in real SAP GUI debugger)
      if (!raw || raw.startsWith('*') || raw.startsWith('"')) continue;
      if (isDeclarationStatement(raw)) continue;

      if (upper.startsWith('LOOP AT')) {
        insideLoop = true;
        loopStartLine = lineNum;
        loopBodySteps = [];
        continue;
      }

      if (upper.startsWith('ENDLOOP')) {
        insideLoop = false;
        // Repeat loop for mock dataset (first 4 items for rich stepping)
        const itemsToIterate = Math.min(mockDataset.length, 4);
        for (let itIdx = 0; itIdx < itemsToIterate; itIdx++) {
          steps.push({
            lineNum: loopStartLine,
            statement: lines[loopStartLine - 1].trim(),
            type: 'loop',
            loopIndex: itIdx + 1,
            totalLoopItems: itemsToIterate,
          });

          for (const bodySt of loopBodySteps) {
            steps.push({
              lineNum: bodySt.lineNum,
              statement: bodySt.stmt,
              type: bodySt.stmt.toUpperCase().startsWith('WRITE') ? 'write' : 'other',
              loopIndex: itIdx + 1,
              totalLoopItems: itemsToIterate,
            });
          }

          steps.push({
            lineNum,
            statement: raw,
            type: 'endloop',
            loopIndex: itIdx + 1,
            totalLoopItems: itemsToIterate,
          });
        }
        continue;
      }

      if (insideLoop) {
        if (!isDeclarationStatement(raw)) {
          loopBodySteps.push({ lineNum, stmt: raw });
        }
        continue;
      }

      // Executable statements (SELECT, PARAMETERS, IF, ELSE, ENDIF, WRITE, ULINE, ASSIGN, etc.)
      let type: ExecutableStep['type'] = 'other';
      if (upper.startsWith('PARAMETERS')) type = 'data';
      else if (upper.startsWith('SELECT')) type = 'select';
      else if (upper.startsWith('IF')) type = 'if';
      else if (upper.startsWith('ELSE')) type = 'else';
      else if (upper.startsWith('ENDIF')) type = 'endif';
      else if (upper.startsWith('WRITE')) type = 'write';
      else if (upper.startsWith('ULINE')) type = 'uline';

      steps.push({ lineNum, statement: raw, type });
    }

    if (steps.length === 0) {
      // Find first non-comment line or fallback to line 1
      const firstLineIdx = lines.findIndex((l) => l.trim() && !l.trim().startsWith('*'));
      steps.push({ 
        lineNum: firstLineIdx >= 0 ? firstLineIdx + 1 : 1, 
        statement: lines[firstLineIdx >= 0 ? firstLineIdx : 0]?.trim() || 'START-OF-SELECTION.', 
        type: 'other' 
      });
    }

    return steps;
  }, [codeLines, code]);

  // Current Step Index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Runtime State
  const [systemVars, setSystemVars] = useState<Record<string, string | number>>({
    'SY-SUBRC': 0,
    'SY-TABIX': 0,
    'SY-DBCNT': 0,
    'SY-UNAME': 'BLEME',
    'SY-MANDT': 100,
    'SY-LANGU': 'PT',
    'SY-DATUM': new Date().toISOString().slice(0, 10).replace(/-/g, ''),
    'SY-UZEIT': '143000',
    'SY-TITLE': 'Z_APRENDIZADO_ABAP',
  });

  const [itabRecords, setItabRecords] = useState<SapTableRecord[]>([]);
  const [currentWa, setCurrentWa] = useState<SapTableRecord>({
    MATNR: '100-100',
    MTART: 'KA',
    MEINS: 'UN',
    MAKTX: 'Sensor de Pressão Eletrônico KA',
  });
  const [spoolLines, setSpoolLines] = useState<string[]>([]);
  const [recentlyChangedVars, setRecentlyChangedVars] = useState<Set<string>>(new Set());

  const currentStep = executionPlan[currentStepIndex] || executionPlan[0];
  const activeSourceLine = currentStep ? currentStep.lineNum : 1;

  // Toggle Breakpoint
  const toggleBreakpoint = (lineNum: number) => {
    setBreakpoints((prev) => {
      const next = new Set(prev);
      if (next.has(lineNum)) next.delete(lineNum);
      else next.add(lineNum);
      return next;
    });
  };

  // Step Execution Logic
  const executeStep = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= executionPlan.length) return;

    const step = executionPlan[targetIndex];
    const changed = new Set<string>();

    // Mock dataset
    let dataset = MOCK_MARA.filter((m) => m.MTART === 'KA' || m.MTART === 'ROH');
    if (code.toUpperCase().includes('VBAK')) dataset = MOCK_VBAK;
    if (code.toUpperCase().includes('KNA1')) dataset = MOCK_KNA1;

    // Simulate state transition based on step
    if (step.type === 'select') {
      setItabRecords(dataset);
      setSystemVars((prev) => ({
        ...prev,
        'SY-SUBRC': 0,
        'SY-DBCNT': dataset.length,
      }));
      changed.add('SY-SUBRC');
      changed.add('SY-DBCNT');
      changed.add('LT_MATERIAIS');
    } else if (step.type === 'loop') {
      const idx = (step.loopIndex || 1) - 1;
      const row = dataset[idx] || dataset[0] || {};
      setCurrentWa(row);
      setSystemVars((prev) => ({
        ...prev,
        'SY-TABIX': step.loopIndex || 1,
      }));
      changed.add('SY-TABIX');
      changed.add('LS_MATERIAL');
    } else if (step.type === 'write') {
      const lineText = `MATNR: ${currentWa.MATNR || '100-100'} | TIPO: ${currentWa.MTART || 'KA'} | DESC: ${currentWa.MAKTX || 'Material'}`;
      setSpoolLines((prev) => [...prev, lineText]);
      changed.add('SPOOL');
    } else if (step.type === 'uline') {
      setSpoolLines((prev) => [...prev, '------------------------------------------------------------------------']);
    }

    setRecentlyChangedVars(changed);
    setCurrentStepIndex(targetIndex);
  };

  // F5: Step Into
  const handleStepInto = () => {
    if (currentStepIndex < executionPlan.length - 1) {
      executeStep(currentStepIndex + 1);
    }
  };

  // F6: Step Over
  const handleStepOver = () => {
    if (currentStepIndex < executionPlan.length - 1) {
      executeStep(currentStepIndex + 1);
    }
  };

  // F8: Continue to Next Breakpoint or End
  const handleContinue = () => {
    let nextIdx = currentStepIndex + 1;
    while (nextIdx < executionPlan.length) {
      if (breakpoints.has(executionPlan[nextIdx].lineNum)) {
        executeStep(nextIdx);
        return;
      }
      nextIdx++;
    }
    // If no breakpoint, execute to the end
    executeStep(executionPlan.length - 1);
  };

  // Shift+F12: Restart
  const handleRestart = () => {
    setSystemVars({
      'SY-SUBRC': 0,
      'SY-TABIX': 0,
      'SY-DBCNT': 0,
      'SY-UNAME': 'BLEME',
      'SY-MANDT': 100,
      'SY-LANGU': 'PT',
      'SY-DATUM': new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      'SY-UZEIT': '143000',
      'SY-TITLE': 'Z_APRENDIZADO_ABAP',
    });
    setItabRecords([]);
    setSpoolLines([]);
    setCurrentStepIndex(0);
    setRecentlyChangedVars(new Set());
  };

  // Add custom watch variable
  const handleAddWatch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = watchInput.trim().toUpperCase();
    if (clean && !customWatches.includes(clean)) {
      setCustomWatches((prev) => [clean, ...prev]);
      setWatchInput('');
    }
  };

  // Variables list
  const variableList: SapVariableWatch[] = [
    {
      name: 'SY-SUBRC',
      category: 'system',
      type: 'SYSUBRC',
      value: String(systemVars['SY-SUBRC']),
      description: 'Código de retorno da última operação SAP (0 = Sucesso).',
      status: recentlyChangedVars.has('SY-SUBRC') ? 'changed' : 'ok',
    },
    {
      name: 'SY-TABIX',
      category: 'system',
      type: 'SYTABIX',
      value: String(systemVars['SY-TABIX']),
      description: 'Índice do registro atual no LOOP AT ou READ TABLE.',
      status: recentlyChangedVars.has('SY-TABIX') ? 'changed' : 'ok',
    },
    {
      name: 'SY-DBCNT',
      category: 'system',
      type: 'SYDBCNT',
      value: String(systemVars['SY-DBCNT']),
      description: 'Quantidade de registros lidos ou alterados no banco de dados.',
      status: recentlyChangedVars.has('SY-DBCNT') ? 'changed' : 'ok',
    },
    {
      name: 'P_MTART',
      category: 'variable',
      type: 'MARA-MTART',
      value: "'KA'",
      description: 'Parâmetro de entrada definido na tela inicial.',
      status: 'ok',
    },
    {
      name: 'LT_MATERIAIS',
      category: 'table',
      type: 'STANDARD TABLE OF TY_MATERIAL',
      value: `${itabRecords.length} linhas`,
      description: 'Tabela interna alocada na memória para armazenar o resultado do SELECT.',
      status: recentlyChangedVars.has('LT_MATERIAIS') ? 'changed' : 'ok',
      tableRowsPreview: itabRecords,
    },
    {
      name: 'LS_MATERIAL',
      category: 'structure',
      type: 'TY_MATERIAL',
      value: `{MATNR: '${currentWa.MATNR || '100-100'}', MTART: '${currentWa.MTART || 'KA'}'}`,
      description: 'Work area que armazena os dados da linha iterada no LOOP atual.',
      status: recentlyChangedVars.has('LS_MATERIAL') ? 'changed' : 'ok',
      fields: currentWa,
    },
    ...customWatches.map((w) => ({
      name: w,
      category: 'variable' as const,
      type: 'ANY (Watchpoint)',
      value: systemVars[w] !== undefined ? String(systemVars[w]) : '0 (Ativo)',
      description: 'Watchpoint customizado monitorado pelo usuário.',
      status: 'ok' as const,
    })),
  ];

  const filteredVars = variableList.filter(
    (v) =>
      v.name.toLowerCase().includes(searchVar.toLowerCase()) ||
      v.type.toLowerCase().includes(searchVar.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-3 animate-in fade-in duration-150 font-sans">
      <div className="bg-[#e9ecf0] text-slate-900 w-full max-w-7xl h-[94vh] rounded-lg shadow-2xl border-2 border-[#1b2a4a] overflow-hidden flex flex-col">
        {/* Top SAP Window Title Bar */}
        <div className="bg-[#1b2a4a] text-white px-3.5 py-2 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 bg-[#0070f2] rounded-xs flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-xs">
              SAP
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                <span>Depurador ABAP (Sessão 1) - Z_APRENDIZADO_ABAP</span>
                <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                  /h ATIVO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={onClose}
              title="Encerrar Sessão de Depuração (Shift+F3)"
              className="p-1 text-slate-300 hover:text-white hover:bg-red-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Traditional NetWeaver Debugger Toolbar */}
        <div className="bg-[#d2dbe5] border-b border-slate-300 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
          {/* Stepping Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleStepInto}
              disabled={currentStepIndex >= executionPlan.length - 1}
              title="Passo a Passo (F5) - Entrar na instrução / linha"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-400 hover:border-blue-600 rounded text-slate-800 font-bold shadow-2xs transition-all disabled:opacity-40"
            >
              <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Passo a Passo (F5)</span>
            </button>

            <button
              onClick={handleStepOver}
              disabled={currentStepIndex >= executionPlan.length - 1}
              title="Passar Por (F6) - Próxima linha no bloco"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-400 hover:border-blue-600 rounded text-slate-800 font-bold shadow-2xs transition-all disabled:opacity-40"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Passar Por (F6)</span>
            </button>

            <button
              onClick={handleContinue}
              title="Continuar / Executar até o Fim (F8)"
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continuar (F8)</span>
            </button>

            <button
              onClick={handleRestart}
              title="Reiniciar Depuração (Shift+F12)"
              className="p-1 bg-white hover:bg-slate-100 border border-slate-400 rounded text-slate-700 transition-colors ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>

          {/* Real-time System Registers Status Bar */}
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <div
              className={`px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
                systemVars['SY-SUBRC'] === 0
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${systemVars['SY-SUBRC'] === 0 ? 'bg-emerald-600' : 'bg-red-600'}`} />
              <span>SY-SUBRC: {systemVars['SY-SUBRC']}</span>
            </div>

            <div className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 font-semibold">
              <span>SY-TABIX: {systemVars['SY-TABIX']}</span>
            </div>

            <div className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300 hidden md:block">
              <span>SY-DBCNT: {systemVars['SY-DBCNT']}</span>
            </div>

            <span className="text-slate-500 font-sans text-xs hidden lg:inline">
              Passo {currentStepIndex + 1} de {executionPlan.length}
            </span>
          </div>
        </div>

        {/* Main Debugger Split Area: Source Code (Left) & Inspector Tabs (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-white">
          {/* LEFT: SOURCE CODE PANEL WITH YELLOW RUNTIME ARROW (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-r border-slate-300 h-full overflow-hidden bg-white">
            {/* Source Header */}
            <div className="bg-[#e4ebf2] border-b border-slate-300 px-3 py-1 flex items-center justify-between text-xs text-slate-700 select-none">
              <div className="flex items-center space-x-2">
                <FileCode className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold">Código Fonte: Z_APRENDIZADO_ABAP</span>
                <span className="text-slate-500 font-mono text-[11px]">(Linha Ativa: {activeSourceLine})</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Clique na barra cinza para fixar Breakpoints (F9)
              </div>
            </div>

            {/* Source Code Scrolling Container */}
            <div className="flex-1 overflow-y-auto font-mono text-xs select-text bg-white">
              <table className="w-full border-collapse">
                <tbody>
                  {codeLines.map((lineText, idx) => {
                    const lineNum = idx + 1;
                    const isExecutingLine = lineNum === activeSourceLine;
                    const hasBreakpoint = breakpoints.has(lineNum);
                    const isComment = lineText.trim().startsWith('*') || lineText.trim().startsWith('"');

                    return (
                      <tr
                        key={lineNum}
                        className={`transition-colors ${
                          isExecutingLine
                            ? 'bg-[#fff59d] font-bold shadow-inner'
                            : 'hover:bg-blue-50/40'
                        }`}
                      >
                        {/* Breakpoint gutter */}
                        <td
                          onClick={() => toggleBreakpoint(lineNum)}
                          title="Clique para alternar Breakpoint"
                          className="w-7 py-0.5 text-center cursor-pointer bg-[#ece9d8] border-r border-slate-300 select-none"
                        >
                          {hasBreakpoint ? (
                            <Circle className="w-3 h-3 text-red-600 fill-red-600 mx-auto" />
                          ) : (
                            <span className="w-3 h-3 inline-block" />
                          )}
                        </td>

                        {/* Yellow NetWeaver Runtime Arrow */}
                        <td className="w-6 py-0.5 text-center bg-[#ece9d8] border-r border-slate-300 select-none">
                          {isExecutingLine ? (
                            <span className="text-amber-600 font-extrabold text-sm animate-pulse">
                              ▶
                            </span>
                          ) : null}
                        </td>

                        {/* Line number */}
                        <td className="w-10 py-0.5 px-2 text-right text-slate-400 bg-[#ece9d8] border-r border-slate-300 select-none text-[11px]">
                          {lineNum}
                        </td>

                        {/* Code line content */}
                        <td className="py-0.5 px-3 whitespace-pre text-slate-900 leading-relaxed font-mono">
                          {isComment ? (
                            <span className="text-[#707070] italic">{lineText}</span>
                          ) : (
                            <span>
                              {lineText}
                              {isDeclarationStatement(lineText) && lineText.trim() && (
                                <span className="text-[10px] text-slate-400 font-sans italic ml-3 select-none hidden md:inline">
                                  [declaração estática]
                                </span>
                              )}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom step info note */}
            <div className="bg-[#f0f4f8] border-t border-slate-300 px-3 py-1.5 text-xs text-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <span className="font-bold text-[#0070f2]">Executando:</span>
                <code className="text-slate-900 font-mono font-bold truncate">{currentStep.statement}</code>
              </div>
              {currentStep.loopIndex && (
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  Volta do LOOP: {currentStep.loopIndex} de {currentStep.totalLoopItems}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: NETWEAVER INSPECTOR PANELS (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col h-full overflow-hidden bg-[#f7f9fb]">
            {/* Inspector Navigation Tabs */}
            <div className="bg-[#e4ebf2] border-b border-slate-300 px-2 pt-1 flex items-center space-x-1 overflow-x-auto text-xs select-none">
              <button
                onClick={() => setActiveTab('vars')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-all border-t border-x ${
                  activeTab === 'vars'
                    ? 'bg-white text-[#0070f2] border-slate-300 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
                }`}
              >
                Variáveis
              </button>

              <button
                onClick={() => setActiveTab('itab')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-all border-t border-x ${
                  activeTab === 'itab'
                    ? 'bg-white text-[#0070f2] border-slate-300 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
                }`}
              >
                Tabela Interna ({itabRecords.length})
              </button>

              <button
                onClick={() => setActiveTab('wa')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-all border-t border-x ${
                  activeTab === 'wa'
                    ? 'bg-white text-[#0070f2] border-slate-300 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
                }`}
              >
                Estrutura (WA)
              </button>

              <button
                onClick={() => setActiveTab('spool')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-all border-t border-x ${
                  activeTab === 'spool'
                    ? 'bg-white text-[#0070f2] border-slate-300 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
                }`}
              >
                Saída Spool
              </button>

              <button
                onClick={() => setActiveTab('sys')}
                className={`px-3 py-1.5 rounded-t font-semibold transition-all border-t border-x ${
                  activeTab === 'sys'
                    ? 'bg-white text-[#0070f2] border-slate-300 -mb-px'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200'
                }`}
              >
                Sistema (SY-*)
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {/* TAB 1: WATCHED VARIABLES */}
              {activeTab === 'vars' && (
                <div className="space-y-3 text-xs">
                  {/* Search and Add Watchpoint Form */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                      <input
                        type="text"
                        placeholder="Filtrar variáveis..."
                        value={searchVar}
                        onChange={(e) => setSearchVar(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <form onSubmit={handleAddWatch} className="flex items-center space-x-1">
                      <input
                        type="text"
                        placeholder="+ Watchpoint"
                        value={watchInput}
                        onChange={(e) => setWatchInput(e.target.value)}
                        className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-xs uppercase font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 bg-[#0070f2] text-white rounded hover:bg-blue-600"
                        title="Adicionar variável ao monitoramento"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  {/* Variables Table */}
                  <div className="border border-slate-300 rounded overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead className="bg-[#e4ebf2] text-slate-700 border-b border-slate-300">
                        <tr>
                          <th className="py-1.5 px-2.5 font-bold">Variável</th>
                          <th className="py-1.5 px-2.5 font-bold">Valor Atual</th>
                          <th className="py-1.5 px-2.5 font-bold hidden sm:table-cell">Tipo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredVars.map((v) => (
                          <tr
                            key={v.name}
                            className={`hover:bg-blue-50/50 transition-colors ${
                              v.status === 'changed' ? 'bg-amber-100/70 font-bold' : ''
                            }`}
                          >
                            <td className="py-1.5 px-2.5 font-bold text-slate-900 flex items-center gap-1">
                              {v.status === 'changed' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                              )}
                              <span>{v.name}</span>
                            </td>
                            <td className="py-1.5 px-2.5 text-emerald-700 font-bold truncate max-w-[150px]">
                              {v.value}
                            </td>
                            <td className="py-1.5 px-2.5 text-slate-500 text-[11px] hidden sm:table-cell truncate max-w-[120px]">
                              {v.type}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERNAL TABLE (ITAB) */}
              {activeTab === 'itab' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-700 border-b border-slate-200 pb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tabela Interna: LT_MATERIAIS</span>
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Linhas alocadas: {itabRecords.length}
                    </span>
                  </div>

                  {itabRecords.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-white border border-slate-200 rounded-lg italic">
                      A tabela interna ainda está vazia (0 registros). Avance com F5/F6 até a instrução SELECT para preenchê-la.
                    </div>
                  ) : (
                    <div className="border border-slate-300 rounded overflow-x-auto bg-white shadow-2xs max-h-[50vh]">
                      <table className="w-full text-left font-mono text-xs border-collapse">
                        <thead className="bg-[#e4ebf2] text-slate-700 border-b border-slate-300 sticky top-0">
                          <tr>
                            <th className="py-1.5 px-2 w-8 text-center text-slate-500 font-bold">#</th>
                            {Object.keys(itabRecords[0] || {}).map((col) => (
                              <th key={col} className="py-1.5 px-2.5 font-bold border-r border-slate-200">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {itabRecords.map((row, idx) => {
                            const isCurrentRow = idx + 1 === systemVars['SY-TABIX'];
                            return (
                              <tr
                                key={idx}
                                className={`hover:bg-blue-50 transition-colors ${
                                  isCurrentRow ? 'bg-[#fff59d] font-bold' : ''
                                }`}
                              >
                                <td className="py-1 px-2 text-center text-slate-400 text-[10px] border-r border-slate-200">
                                  {isCurrentRow ? '▶' : idx + 1}
                                </td>
                                {Object.values(row).map((val, cIdx) => (
                                  <td key={cIdx} className="py-1 px-2.5 border-r border-slate-200 whitespace-nowrap">
                                    {String(val)}
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WORK AREA (LS_MATERIAL) */}
              {activeTab === 'wa' && (
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-700 border-b border-slate-200 pb-1 flex items-center justify-between">
                    <span>Campos da Estrutura: LS_MATERIAL</span>
                    <span className="font-mono text-blue-600 text-[11px]">TY_MATERIAL</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(currentWa).map(([fKey, fVal]) => (
                      <div key={fKey} className="bg-white border border-slate-300 rounded p-2.5 font-mono shadow-2xs">
                        <div className="text-slate-400 text-[10px]">LS_MATERIAL-{fKey}</div>
                        <div className="text-emerald-700 font-bold text-sm truncate">{String(fVal)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-2.5 text-slate-600 text-[11px] leading-relaxed">
                    A cada volta do comando <code>LOOP AT ... INTO ls_material</code>, os valores desta estrutura são substituídos pelos dados da linha apontada por <code>SY-TABIX</code>.
                  </div>
                </div>
              )}

              {/* TAB 4: SPOOL OUTPUT */}
              {activeTab === 'spool' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700 border-b border-slate-200 pb-1">
                    Spool de Saída (Lista Clássica Gerada em Tempo Real)
                  </div>

                  <div className="bg-[#0b1320] text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-700 overflow-x-auto min-h-[160px] leading-relaxed shadow-inner">
                    {spoolLines.length === 0 ? (
                      <div className="text-slate-500 italic">
                        Nenhum comando WRITE executado ainda...
                      </div>
                    ) : (
                      spoolLines.map((sp, idx) => <div key={idx}>{sp}</div>)
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM VARIABLES */}
              {activeTab === 'sys' && (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-700 border-b border-slate-200 pb-1">
                    Variáveis de Sistema SAP (Estrutura SYST / SY-*)
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                    {Object.entries(systemVars).map(([sKey, sVal]) => (
                      <div key={sKey} className="bg-white border border-slate-300 rounded p-2 shadow-2xs">
                        <div className="text-slate-400 text-[10px]">{sKey}</div>
                        <div className="font-bold text-slate-800 text-xs truncate">{String(sVal)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Status */}
        <div className="bg-[#d2dbe5] border-t border-slate-300 px-4 py-2 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 select-none">
          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="font-bold text-blue-900">SAP NetWeaver 7.50</span>
            <span>•</span>
            <span>Sessão de Depuração Ativa</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-[#1b2a4a] text-white rounded text-xs font-semibold hover:bg-blue-900 transition-colors shadow-xs"
            >
              Fechar Depurador (Shift+F3)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
