import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Table, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  ArrowUpDown, 
  Search, 
  RefreshCw,
  Copy,
  Check,
  Bug,
  Columns,
  Monitor,
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { SimulationResult } from '../types';
import { AbapDebugConsole } from './AbapDebugConsole';
import { DebuggerWalkthroughGuide, DEBUGGER_STEPS } from './DebuggerWalkthroughGuide';

interface AbapSimulatorProps {
  result: SimulationResult | null;
  initialViewMode?: 'output' | 'debug' | 'split';
  onClose: () => void;
  onReRun: () => void;
}

export const AbapSimulator: React.FC<AbapSimulatorProps> = ({
  result,
  initialViewMode = 'output',
  onClose,
  onReRun,
}) => {
  const [viewMode, setViewMode] = useState<'output' | 'debug' | 'split'>(initialViewMode);
  const [debugTab, setDebugTab] = useState<'variables' | 'trace' | 'callstack'>('variables');
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  if (!result) return null;

  const handleStartWalkthrough = () => {
    setWalkthroughStep(0);
    setShowWalkthrough(true);
    setViewMode('debug');
    setDebugTab('variables');
  };

  const handleNextWalkthroughStep = () => {
    const nextIdx = Math.min(DEBUGGER_STEPS.length - 1, walkthroughStep + 1);
    setWalkthroughStep(nextIdx);
    const nextStep = DEBUGGER_STEPS[nextIdx];
    if (nextStep) {
      setViewMode(nextStep.targetViewMode);
      if (nextStep.targetTab) setDebugTab(nextStep.targetTab);
    }
  };

  const handlePrevWalkthroughStep = () => {
    const prevIdx = Math.max(0, walkthroughStep - 1);
    setWalkthroughStep(prevIdx);
    const prevStep = DEBUGGER_STEPS[prevIdx];
    if (prevStep) {
      setViewMode(prevStep.targetViewMode);
      if (prevStep.targetTab) setDebugTab(prevStep.targetTab);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setWalkthroughStep(idx);
    const targetStep = DEBUGGER_STEPS[idx];
    if (targetStep) {
      setViewMode(targetStep.targetViewMode);
      if (targetStep.targetTab) setDebugTab(targetStep.targetTab);
    }
  };

  const handleCopyReport = () => {
    if (result.classicLines) {
      navigator.clipboard.writeText(result.classicLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportCsv = () => {
    if (!result.alvData) return;
    const { columns, rows } = result.alvData;
    const csvContent = [
      columns.join(';'),
      ...rows.map((r) => columns.map((col) => `"${r[col] ?? ''}"`).join(';')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${result.alvData.tableName.replace(/[^a-z0-9]/gi, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & sort for ALV Grid
  let displayedRows = result.alvData?.rows || [];
  if (filterText && result.alvData) {
    displayedRows = displayedRows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }

  if (sortField && displayedRows.length > 0) {
    displayedRows = [...displayedRows].sort((a, b) => {
      const valA = String(a[sortField] ?? '');
      const valB = String(b[sortField] ?? '');
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  // Render the Output area (ALV Grid, Classic Spool or Dump)
  const renderOutputContent = () => (
    <div className="space-y-3">
      {/* CASE 1: SAP Short Dump */}
      {result.type === 'error_dump' && result.dumpInfo && (
        <div className="border border-red-300 bg-red-50/50 rounded p-4 font-mono text-xs sm:text-sm space-y-4">
          <div className="flex items-start space-x-3 text-red-700">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base text-red-900">
                Runtime Error: {result.dumpInfo.runtimeError}
              </h3>
              <p className="text-red-700 font-semibold">{result.dumpInfo.exception}</p>
              <p className="text-slate-700 mt-1">{result.dumpInfo.shortText}</p>
            </div>
          </div>

          <div className="bg-white border border-red-200 rounded p-3 text-xs space-y-2">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">
              O que aconteceu? (What happened?)
            </div>
            <p className="text-slate-700">{result.dumpInfo.whatHappened}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-xs space-y-2">
            <div className="font-bold text-emerald-900 border-b border-emerald-200 pb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Como corrigir o erro? (How to correct the error)
            </div>
            <p className="text-emerald-800">{result.dumpInfo.howToCorrect}</p>
          </div>
        </div>
      )}

      {/* CASE 2: ALV Grid View */}
      {result.type === 'alv_grid' && result.alvData && (
        <div className="space-y-3">
          {/* ALV Toolbar */}
          <div className="bg-[#edf2f7] border border-slate-300 rounded px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Table className="w-3.5 h-3.5 text-[#0070f2]" />
                {result.alvData.tableName}
              </span>
              <span className="text-slate-500 font-mono">
                ({displayedRows.length} linhas de {result.alvData.rows.length})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="Filtrar dados..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-32 sm:w-44"
                />
              </div>

              <button
                onClick={handleExportCsv}
                title="Exportar planilha Excel / CSV"
                className="flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-medium transition-colors"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          {/* Grid Table */}
          <div className="border border-slate-300 rounded overflow-x-auto max-h-[54vh]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-[#dbe4ef] text-slate-800 sticky top-0 border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3 border-r border-slate-300 w-10 text-center font-bold text-slate-600">
                    #
                  </th>
                  {result.alvData.columns.map((col) => (
                    <th
                      key={col}
                      onClick={() => {
                        if (sortField === col) {
                          setSortAsc(!sortAsc);
                        } else {
                          setSortField(col);
                          setSortAsc(true);
                        }
                      }}
                      className="py-2 px-3 border-r border-slate-300 font-bold hover:bg-[#ccd9e7] cursor-pointer select-none transition-colors"
                    >
                      <div className="flex items-center justify-between space-x-1">
                        <span>{col}</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-60" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={result.alvData.columns.length + 1}
                      className="text-center py-6 text-slate-500 font-sans italic"
                    >
                      Nenhum registro encontrado com os critérios especificados.
                    </td>
                  </tr>
                ) : (
                  displayedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-slate-200 hover:bg-blue-50/70 transition-colors ${
                        idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center text-slate-400 select-none text-[11px]">
                        {idx + 1}
                      </td>
                      {result.alvData?.columns.map((col) => (
                        <td key={col} className="py-1.5 px-3 border-r border-slate-200 whitespace-nowrap text-slate-800">
                          {row[col] ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CASE 3: Classic WRITE Output (Authentic SAP GUI White Paper Spool / Lista Clássica) */}
      {result.type === 'classic_write' && result.classicLines && (
        <div className="space-y-2">
          {/* SAP Spool / List Viewer Toolbar */}
          <div className="flex items-center justify-between bg-[#e4ebf2] border border-slate-300 rounded px-3 py-1.5 text-xs select-none">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#0070f2]" />
                Lista ABAP / Spool (Visualização Padrão NetWeaver)
              </span>
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
                | Mandante: 100 • Sistema: PRD • Página: 1
              </span>
            </div>
            <button
              onClick={handleCopyReport}
              className="flex items-center space-x-1 px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-300 rounded text-slate-700 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copiado!' : 'Copiar Lista'}</span>
            </button>
          </div>

          {/* Authentic SAP GUI Classic List Output with Pure White Paper Background */}
          <div className="bg-white text-slate-950 font-mono text-xs sm:text-sm p-5 rounded-md border-2 border-slate-300 overflow-x-auto max-h-[58vh] leading-relaxed shadow-sm font-medium">
            {/* Classic SAP Top Header Banner */}
            <div className="border-b-2 border-slate-800 pb-2 mb-3 select-none">
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                <div>
                  <span className="font-bold text-slate-900">SAP R/3 - NetWeaver Executável</span>
                  <span className="ml-2 text-slate-500">| Transação SE38</span>
                </div>
                <div className="space-x-3">
                  <span>Data: {new Date().toLocaleDateString('pt-BR')}</span>
                  <span>Hora: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-bold text-slate-800">Pág. 1</span>
                </div>
              </div>
            </div>

            {/* Rendered report lines */}
            <div className="space-y-0.5">
              {result.classicLines.map((line, idx) => {
                const isHeading = line.includes('===') || line.toUpperCase().includes('RELATÓRIO') || line.toUpperCase().includes('MARA') || line.toUpperCase().includes('ALV');
                const isDivider = line.startsWith('---') || line.startsWith('===') || line.startsWith('___');
                const isError = line.toLowerCase().includes('erro') || line.toLowerCase().includes('não cadastrado') || line.toLowerCase().includes('nenhum');
                const isKey = line.includes('MATNR:') || line.includes('Material Encontrado:');

                if (isDivider) {
                  return (
                    <div key={idx} className="text-slate-400 font-bold border-b border-slate-300 my-1 py-0 select-none">
                      {line}
                    </div>
                  );
                }

                if (isHeading) {
                  return (
                    <div key={idx} className="bg-[#cfe0f2] text-[#1b2a4a] font-bold px-2 py-1 rounded-xs border border-[#a8c2e0] my-1">
                      {line}
                    </div>
                  );
                }

                if (isError) {
                  return (
                    <div key={idx} className="bg-red-50 text-red-700 font-bold px-2 py-0.5 border-l-4 border-red-500 my-0.5">
                      {line}
                    </div>
                  );
                }

                if (isKey) {
                  return (
                    <div key={idx} className="bg-amber-50/80 text-amber-950 font-semibold px-2 py-0.5 border-l-4 border-amber-400 my-0.5">
                      {line}
                    </div>
                  );
                }

                return (
                  <div key={idx} className="text-slate-900 hover:bg-slate-50 px-1 py-0.5 rounded-xs transition-colors">
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Classic SAP Report Footer Line */}
            <div className="mt-4 pt-2 border-t border-slate-300 text-[11px] text-slate-500 flex items-center justify-between select-none">
              <span>*** FIM DA LISTA SAP ***</span>
              <span className="font-mono text-slate-400">SY-SUBRC = {result.sySubrc}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] text-slate-900 w-full max-w-6xl rounded-lg shadow-2xl border border-[#2d4a77] overflow-hidden flex flex-col max-h-[94vh]">
        {/* SAP Window Title Bar */}
        <div className="bg-[#1b2a4a] text-white px-3 py-2 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 bg-blue-500 rounded-xs flex items-center justify-center font-mono text-[9px] font-bold">
              SAP
            </div>
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {result.type === 'error_dump' ? 'SAP Runtime Error: SYNTAX_ERROR' : 'SAP GUI - Visualização de Execução & Depuração'}
            </span>
          </div>

          {/* View Mode Segmented Switcher */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="flex items-center bg-[#131f37] p-0.5 rounded border border-[#2a3e66] text-xs">
              <button
                onClick={() => setViewMode('output')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  viewMode === 'output'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Saída do Programa</span>
              </button>

              <button
                onClick={() => setViewMode('debug')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  viewMode === 'debug'
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <Bug className="w-3 h-3" />
                <span>Debug Console</span>
                {result.debugConsole && (
                  <span className="bg-amber-950 text-amber-200 px-1 py-0.2 rounded-full text-[10px] font-mono">
                    {result.debugConsole.monitoredVariables.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span>Visão Dividida</span>
              </button>
            </div>

            {/* Interactive Walkthrough Tour Trigger */}
            <button
              onClick={handleStartWalkthrough}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                showWalkthrough
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/50'
              }`}
              title="Iniciar tour interativo explicando o depurador e console de variáveis"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Guia do Debugger</span>
            </button>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onReRun}
              title="Executar novamente (F8)"
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Fechar janela (Shift+F3)"
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Mode Switcher */}
        <div className="sm:hidden bg-[#1b2a4a] border-b border-[#304875] px-2 py-1.5 flex items-center justify-between text-xs gap-1">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('output')}
              className={`px-2 py-1 rounded ${viewMode === 'output' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'}`}
            >
              Saída
            </button>
            <button
              onClick={() => setViewMode('debug')}
              className={`px-2 py-1 rounded flex items-center gap-1 ${viewMode === 'debug' ? 'bg-amber-600 text-slate-950 font-bold' : 'text-amber-300'}`}
            >
              <Bug className="w-3 h-3" />
              Debug ({result.debugConsole?.monitoredVariables.length || 0})
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded ${viewMode === 'split' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'}`}
            >
              Dividida
            </button>
          </div>

          <button
            onClick={handleStartWalkthrough}
            className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded flex items-center gap-1 text-[11px] font-bold"
          >
            <GraduationCap className="w-3 h-3" />
            <span>Guia</span>
          </button>
        </div>

        {/* Interactive Walkthrough Card (when active) */}
        {showWalkthrough && (
          <div className="px-3 pt-3 bg-slate-950/40 border-b border-amber-500/30">
            <DebuggerWalkthroughGuide
              currentStepIndex={walkthroughStep}
              onNext={handleNextWalkthroughStep}
              onPrev={handlePrevWalkthroughStep}
              onJumpToStep={handleJumpToStep}
              onClose={() => setShowWalkthrough(false)}
            />
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 bg-white">
          {viewMode === 'output' && renderOutputContent()}

          {viewMode === 'debug' && result.debugConsole && (
            <AbapDebugConsole
              data={result.debugConsole}
              sySubrc={result.sySubrc}
              externalTab={debugTab}
              onTabChange={setDebugTab}
              walkthroughStepIndex={showWalkthrough ? walkthroughStep : null}
            />
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
              <div className="border border-slate-300 rounded-lg p-3 bg-white overflow-auto max-h-[68vh]">
                <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                  <Monitor className="w-3.5 h-3.5 text-blue-600" />
                  <span>Painel de Saída Apresentada</span>
                </div>
                {renderOutputContent()}
              </div>

              <div className="overflow-auto max-h-[68vh]">
                {result.debugConsole ? (
                  <AbapDebugConsole
                    data={result.debugConsole}
                    sySubrc={result.sySubrc}
                    externalTab={debugTab}
                    onTabChange={setDebugTab}
                    walkthroughStepIndex={showWalkthrough ? walkthroughStep : null}
                  />
                ) : (
                  <div className="p-4 bg-slate-100 rounded text-xs text-slate-600">
                    Dados de depuração indisponíveis para esta execução.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SAP GUI Status Bar (Footer) */}
        <div className="bg-[#e4ebf2] border-t border-slate-300 px-3 py-2 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 select-none font-mono">
          <div className="flex items-center space-x-2">
            {result.sySubrc === 0 ? (
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>SY-SUBRC = 0</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-red-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-red-600 inline-block"></span>
                <span>SY-SUBRC = {result.sySubrc}</span>
              </span>
            )}
            <span className="text-slate-400">|</span>
            <span className="text-slate-800 font-sans text-xs">{result.statusMessage}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Toggle Debug Console */}
            <button
              onClick={() => setViewMode(viewMode === 'debug' ? 'output' : 'debug')}
              className={`px-2.5 py-1 rounded text-xs font-sans font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'debug'
                  ? 'bg-blue-700 text-white'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-amber-700" />
              <span>{viewMode === 'debug' ? 'Ver Saída Normal' : 'Abrir Debug Console (/h)'}</span>
            </button>

            <button
              onClick={onClose}
              className="bg-[#1b2a4a] text-white px-2.5 py-1 rounded text-xs font-sans hover:bg-blue-900 transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

