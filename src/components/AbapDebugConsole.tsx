import React, { useState } from 'react';
import {
  Bug,
  Search,
  Layers,
  Table,
  Plus,
  ChevronRight,
  ChevronDown,
  Info,
  Play,
  SkipForward,
  SkipBack,
  Database,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  RotateCcw
} from 'lucide-react';
import { DebugConsoleData, SapVariableWatch } from '../types';

interface AbapDebugConsoleProps {
  data: DebugConsoleData;
  sySubrc: number;
  className?: string;
  externalTab?: 'variables' | 'trace' | 'callstack';
  onTabChange?: (tab: 'variables' | 'trace' | 'callstack') => void;
  walkthroughStepIndex?: number | null;
}

export const AbapDebugConsole: React.FC<AbapDebugConsoleProps> = ({
  data,
  sySubrc,
  className = '',
  externalTab,
  onTabChange,
  walkthroughStepIndex = null,
}) => {
  const [internalTab, setInternalTab] = useState<'variables' | 'trace' | 'callstack'>('variables');
  const activeTab = externalTab || internalTab;
  const setActiveTab = (tab: 'variables' | 'trace' | 'callstack') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'system' | 'table' | 'structure' | 'variable'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedVar, setExpandedVar] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(data.executionTrace.length - 1);
  const [customWatchList, setCustomWatchList] = useState<SapVariableWatch[]>([]);
  const [newWatchInput, setNewWatchInput] = useState('');

  // Handle adding custom watch variable
  const handleAddWatch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newWatchInput.trim().toUpperCase();
    if (!trimmed) return;

    // Check if already in list
    const exists = data.monitoredVariables.some((v) => v.name === trimmed) ||
      customWatchList.some((v) => v.name === trimmed);

    if (exists) {
      setSearchTerm(trimmed);
      setNewWatchInput('');
      return;
    }

    // Determine type
    const isSys = trimmed.startsWith('SY-');
    const isTab = trimmed.startsWith('LT_') || trimmed.startsWith('GT_');
    const isWa = trimmed.startsWith('LS_') || trimmed.startsWith('WA_');

    const newVar: SapVariableWatch = {
      name: trimmed,
      category: isSys ? 'system' : isTab ? 'table' : isWa ? 'structure' : 'variable',
      type: isSys ? 'SYS-FIELD' : isTab ? 'STANDARD TABLE' : isWa ? 'STRUCTURE' : 'ANY',
      value: isSys && data.systemVariables[trimmed] !== undefined 
        ? String(data.systemVariables[trimmed]) 
        : '0 (Initial)',
      description: 'Watchpoint customizado monitorado pelo usuário na sessão.',
      status: 'ok',
    };

    setCustomWatchList((prev) => [newVar, ...prev]);
    setNewWatchInput('');
  };

  const allVariables = [...customWatchList, ...data.monitoredVariables];

  const filteredVariables = allVariables.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentStep = data.executionTrace[activeStepIndex] || data.executionTrace[0];

  return (
    <div className={`bg-[#0f172a] text-slate-100 rounded-lg border border-slate-700 flex flex-col overflow-hidden font-sans ${className}`}>
      {/* Top Header / SAP Debugger Bar */}
      <div className="bg-[#1e293b] border-b border-slate-700 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 text-[11px]">
            <Bug className="w-3.5 h-3.5 text-amber-400" />
            <span>DEBUG CONSOLE</span>
            <span className="bg-amber-500 text-slate-900 px-1 py-0.2 rounded font-mono text-[9px] font-bold">/h</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            Monitor de Variáveis & Fluxo de Dados
          </span>
        </div>

        {/* System registers quick status */}
        <div className="flex items-center space-x-2 font-mono text-[11px]">
          <div className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
            sySubrc === 0 
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50' 
              : 'bg-red-950/80 text-red-400 border border-red-700/50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sySubrc === 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            <span>SY-SUBRC: {sySubrc}</span>
          </div>

          <div className="bg-blue-950/80 border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded flex items-center gap-1">
            <span>SY-TABIX: {data.systemVariables['SY-TABIX'] ?? 0}</span>
          </div>

          <div className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded hidden md:flex items-center gap-1">
            <span>SY-DBCNT: {data.systemVariables['SY-DBCNT'] ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs inside Debug Console */}
      <div className="bg-[#141e33] border-b border-slate-700 px-3 py-1 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'variables'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Variáveis Monitoradas</span>
            <span className="bg-slate-900/60 text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {allVariables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'trace'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fluxo de Execução (Trace)</span>
            <span className="bg-slate-900/60 text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
              {data.executionTrace.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('callstack')}
            className={`px-3 py-1.5 rounded font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'callstack'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Call Stack & Sistema</span>
          </button>
        </div>

        {/* Step Scrubber / Stepping Controls */}
        <div className="flex items-center space-x-1 font-mono text-xs">
          <button
            onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeStepIndex <= 0}
            title="Passo Anterior (F5)"
            className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-300">
            Passo {activeStepIndex + 1}/{data.executionTrace.length}
          </span>

          <button
            onClick={() => setActiveStepIndex((prev) => Math.min(data.executionTrace.length - 1, prev + 1))}
            disabled={activeStepIndex >= data.executionTrace.length - 1}
            title="Próximo Passo (F6)"
            className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveStepIndex(data.executionTrace.length - 1)}
            title="Executar até o final (F8)"
            className="p-1 rounded bg-blue-900/60 text-blue-300 hover:bg-blue-800 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto max-h-[60vh]">
        {/* TAB 1: WATCHED VARIABLES */}
        {activeTab === 'variables' && (
          <div className="space-y-3">
            {/* Filter toolbar & Add watchpoint */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                {(['all', 'system', 'table', 'structure', 'variable'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    {cat === 'all' && 'Todas'}
                    {cat === 'system' && 'Sistema (SY-*)'}
                    {cat === 'table' && 'Tabelas (ITAB)'}
                    {cat === 'structure' && 'Estruturas (WA)'}
                    {cat === 'variable' && 'Escalares / Params'}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
                  <input
                    type="text"
                    placeholder="Filtrar variáveis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 bg-slate-900/90 border border-slate-700 rounded text-xs text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <form onSubmit={handleAddWatch} className="flex items-center space-x-1">
                  <input
                    type="text"
                    placeholder="+ Watchpoint"
                    value={newWatchInput}
                    onChange={(e) => setNewWatchInput(e.target.value)}
                    className="w-24 sm:w-28 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 font-mono uppercase focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    title="Adicionar à lista de monitoramento"
                    className="p-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Variable Table */}
            <div className="border border-slate-700 rounded overflow-hidden">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-[#1e293b] text-slate-300 border-b border-slate-700">
                  <tr>
                    <th className="py-2 px-3 w-8 text-center text-slate-500"></th>
                    <th className="py-2 px-3 font-semibold">Variável / Campo</th>
                    <th className="py-2 px-3 font-semibold">Tipo Técnico</th>
                    <th className="py-2 px-3 font-semibold">Valor em Memória</th>
                    <th className="py-2 px-3 font-semibold hidden md:table-cell">Função no Fluxo ABAP</th>
                    <th className="py-2 px-3 font-semibold text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {filteredVariables.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500 font-sans italic">
                        Nenhuma variável encontrada com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredVariables.map((v) => {
                      const isExpanded = expandedVar === v.name;
                      const hasDetails = (v.fields && Object.keys(v.fields).length > 0) || (v.tableRowsPreview && v.tableRowsPreview.length > 0);

                      return (
                        <React.Fragment key={v.name}>
                          <tr
                            onClick={() => hasDetails && setExpandedVar(isExpanded ? null : v.name)}
                            className={`hover:bg-slate-800/70 transition-colors ${
                              hasDetails ? 'cursor-pointer' : ''
                            } ${isExpanded ? 'bg-slate-800/90' : 'bg-slate-900/40'}`}
                          >
                            <td className="py-2 px-2 text-center text-slate-500">
                              {hasDetails ? (
                                isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                )
                              ) : null}
                            </td>
                            <td className="py-2 px-3 font-bold text-amber-300 flex items-center gap-1.5">
                              {v.category === 'system' && <span className="text-purple-400 text-[9px] font-sans px-1 py-0.2 rounded bg-purple-950 border border-purple-800/40">SYS</span>}
                              {v.category === 'table' && <span className="text-blue-400 text-[9px] font-sans px-1 py-0.2 rounded bg-blue-950 border border-blue-800/40">ITAB</span>}
                              {v.category === 'structure' && <span className="text-emerald-400 text-[9px] font-sans px-1 py-0.2 rounded bg-emerald-950 border border-emerald-800/40">WA</span>}
                              {v.category === 'variable' && <span className="text-slate-400 text-[9px] font-sans px-1 py-0.2 rounded bg-slate-800 border border-slate-700">VAR</span>}
                              <span>{v.name}</span>
                            </td>
                            <td className="py-2 px-3 text-slate-400">{v.type}</td>
                            <td className="py-2 px-3 font-semibold text-emerald-300 max-w-xs truncate">
                              {v.value}
                            </td>
                            <td className="py-2 px-3 text-slate-300 font-sans text-xs hidden md:table-cell">
                              {v.description}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {v.name === 'SY-SUBRC' ? (
                                v.value === '0' ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                                    0 OK
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800">
                                    {v.value} ERR
                                  </span>
                                )
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                                  {v.status === 'changed' ? 'Atualizada' : 'Ativa'}
                                </span>
                              )}
                            </td>
                          </tr>

                          {/* Expanded Details Panel (Structure or Table Inspector) */}
                          {isExpanded && (
                            <tr className="bg-[#0b1220] border-b border-slate-700">
                              <td colSpan={6} className="p-3">
                                <div className="space-y-2 font-mono text-xs">
                                  <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                                    <Info className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Inspeção detalhada de memória para: <strong className="text-white">{v.name}</strong></span>
                                  </div>

                                  {/* Structure fields */}
                                  {v.fields && Object.keys(v.fields).length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-2.5 rounded border border-slate-700/80">
                                      {Object.entries(v.fields).map(([fieldName, fieldValue]) => (
                                        <div key={fieldName} className="bg-slate-800/80 p-1.5 rounded border border-slate-700">
                                          <div className="text-slate-400 text-[10px] font-sans">{v.name}-{fieldName}</div>
                                          <div className="text-emerald-300 font-bold truncate">{String(fieldValue)}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Table preview rows */}
                                  {v.tableRowsPreview && v.tableRowsPreview.length > 0 && (
                                    <div className="overflow-x-auto border border-slate-700/80 rounded bg-slate-900/80">
                                      <table className="w-full text-left text-[10px]">
                                        <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                                          <tr>
                                            <th className="p-1.5 text-slate-500 w-8">#</th>
                                            {Object.keys(v.tableRowsPreview[0]).map((col) => (
                                              <th key={col} className="p-1.5">{col}</th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                          {v.tableRowsPreview.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-800/50">
                                              <td className="p-1.5 text-slate-500">{idx + 1}</td>
                                              {Object.values(row).map((val, cIdx) => (
                                                <td key={cIdx} className="p-1.5 text-slate-300">{String(val)}</td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EXECUTION TRACE / STEP-BY-STEP */}
        {activeTab === 'trace' && (
          <div className="space-y-4">
            {/* Interactive Step Card */}
            <div className="bg-[#1a263e] border border-blue-600/40 rounded-lg p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                    PASSO {currentStep.step} de {data.executionTrace.length}
                  </div>
                  <span className="font-semibold text-slate-200 text-sm">{currentStep.event}</span>
                  <span className="text-slate-400 text-xs font-mono">(Linha {currentStep.line})</span>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    currentStep.sySubrc === 0 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    SY-SUBRC = {currentStep.sySubrc}
                  </span>
                  {currentStep.syTabix !== undefined && (
                    <span className="bg-slate-800 text-blue-300 border border-slate-700 px-2 py-0.5 rounded">
                      SY-TABIX = {currentStep.syTabix}
                    </span>
                  )}
                </div>
              </div>

              {/* Code snippet at this step */}
              <div className="bg-[#0b1220] p-2.5 rounded border border-slate-800 font-mono text-xs text-blue-300 flex items-center justify-between">
                <span>{currentStep.codeSnippet}</span>
                <span className="text-[10px] text-slate-500 font-sans">Instrução ABAP</span>
              </div>

              {/* Pedagogical Explanation */}
              <div className="bg-blue-950/40 border border-blue-800/40 rounded p-2.5 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300 block mb-0.5">O que aconteceu com os dados neste passo:</strong>
                  {currentStep.description}
                </div>
              </div>

              {/* Variable values snapshot at this step */}
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>Snapshot de Variáveis no Instante:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(currentStep.activeVariables).map(([k, val]) => (
                    <div key={k} className="bg-slate-900/90 border border-slate-700/80 p-1.5 rounded font-mono text-xs">
                      <div className="text-slate-400 text-[10px]">{k}</div>
                      <div className="text-emerald-300 font-bold truncate">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Steps Overview */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Linha do Tempo Completa da Execução</span>
              </div>

              <div className="space-y-1.5">
                {data.executionTrace.map((st, idx) => (
                  <div
                    key={st.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`p-2.5 rounded border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      activeStepIndex === idx
                        ? 'bg-blue-950/60 border-blue-500 text-white'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                        activeStepIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {st.step}
                      </div>
                      <span className="font-semibold text-slate-200">{st.event}</span>
                      <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">({st.codeSnippet})</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-[11px]">
                      <span className={st.sySubrc === 0 ? 'text-emerald-400' : 'text-red-400'}>
                        SUBRC: {st.sySubrc}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CALL STACK & SYSTEM INFORMATION */}
        {activeTab === 'callstack' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Call Stack Hierarchy */}
            <div className="bg-[#141e33] border border-slate-700 rounded-lg p-3.5 space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Pilha de Chamadas ABAP (Call Stack)</span>
              </div>

              <div className="space-y-2">
                {data.callStack.map((frame, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-slate-900/90 border border-slate-700/80 rounded font-mono text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-slate-800 text-slate-400 rounded-xs flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="text-amber-300 font-bold">{frame}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Stack Level {idx}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-2 border-t border-slate-800">
                A pilha de chamadas representa o encadeamento dos blocos de processamento em tempo de execução no AS ABAP, desde o evento inicial até a camada de apresentação.
              </div>
            </div>

            {/* System Information Table */}
            <div className="bg-[#141e33] border border-slate-700 rounded-lg p-3.5 space-y-3">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 border-b border-slate-700 pb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Variáveis de Ambiente do Sistema (SY-*)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(data.systemVariables).map(([sysKey, sysVal]) => (
                  <div key={sysKey} className="bg-slate-900/90 p-2 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">{sysKey}</div>
                    <div className="text-emerald-300 font-bold truncate">{String(sysVal)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Debug Console Footer */}
      <div className="bg-[#141e33] border-t border-slate-700/80 px-3 py-1.5 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-300">SAP AS ABAP 7.50 / S/4HANA</span>
          <span>•</span>
          <span>Sessão: /h Debug Mode Ativo</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span>Total de Variáveis: {allVariables.length}</span>
          <span>•</span>
          <span>F5: Step Into | F6: Step Over | F8: Continue</span>
        </div>
      </div>
    </div>
  );
};
