import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  BookOpen, 
  Code2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ABAP_GLOSSARY, AbapGlossaryEntry } from '../data/abapGlossary';

interface AbapGlossaryModalProps {
  term: string | null;
  onClose: () => void;
  onSelectRelated?: (relatedTerm: string) => void;
}

export const AbapGlossaryModal: React.FC<AbapGlossaryModalProps> = ({
  term,
  onClose,
  onSelectRelated,
}) => {
  const [copied, setCopied] = useState(false);

  if (!term) return null;

  // Search exact or fallback
  const normalizedKey = term.trim().toUpperCase();
  let entry: AbapGlossaryEntry | undefined = ABAP_GLOSSARY[normalizedKey];

  if (!entry) {
    // Search partial
    const matchedKey = Object.keys(ABAP_GLOSSARY).find(
      (k) => normalizedKey.includes(k) || k.includes(normalizedKey)
    );
    if (matchedKey) {
      entry = ABAP_GLOSSARY[matchedKey];
    }
  }

  // Fallback entry if not in dictionary
  const displayEntry: AbapGlossaryEntry = entry || {
    term: normalizedKey,
    title: `${normalizedKey} (Comando / Palavra-Chave ABAP)`,
    category: 'Comando Open SQL',
    summary: `Instrução ABAP padrão utilizada na programação do SAP NetWeaver e S/4HANA.`,
    syntax: `${normalizedKey} ...`,
    example: `* Exemplo de uso de ${normalizedKey}:\n${normalizedKey} ... .`,
    explanation: `A instrução ${normalizedKey} é um elemento da sintaxe ABAP para manipulação de dados ou controle de fluxo.`,
    bestPractice: 'Consulte a documentação oficial da SAP (F1 no SAP GUI) para detalhes completos de parâmetros e opções.',
    commonPitfall: 'Sempre garanta que a sintaxe termine com ponto final (.) e que os tipos de variáveis sejam compatíveis.',
    relatedTerms: ['SELECT', 'DATA', 'SY-SUBRC', 'LOOP AT'],
  };

  const handleCopyExample = () => {
    navigator.clipboard.writeText(displayEntry.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#f0f4f8] text-slate-900 w-full max-w-2xl rounded-lg shadow-2xl border border-[#2d4a77] overflow-hidden flex flex-col max-h-[92vh]">
        {/* SAP NetWeaver Help Title Bar */}
        <div className="bg-gradient-to-r from-[#1b2a4a] to-[#253966] text-white px-3.5 py-2.5 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-[#0070f2] rounded flex items-center justify-center font-bold text-white text-xs shadow-xs">
              *
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wide text-white">
                SAP ABAP Dicionário & Ajuda (F1)
              </span>
              <span className="text-blue-300 text-xs hidden sm:inline">• Explicação Interativa</span>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Fechar (Esc)"
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-red-600/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-white text-slate-800 text-xs sm:text-sm">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-lg p-3.5 space-y-1.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base sm:text-lg font-bold text-[#0055ff] bg-white px-2.5 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {displayEntry.term}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  {displayEntry.category}
                </span>
              </div>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed pt-1">
              {displayEntry.summary}
            </p>
          </div>

          {/* O que significa? */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#0070f2]" />
              <span>O que é e como funciona no SAP?</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {displayEntry.explanation}
            </div>
          </div>

          {/* Sintaxe Oficial */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <span>Sintaxe Oficial ABAP</span>
            </div>
            <div className="bg-[#0f172a] text-cyan-300 font-mono text-xs p-2.5 rounded-lg border border-slate-700 overflow-x-auto">
              <code>{displayEntry.syntax}</code>
            </div>
          </div>

          {/* Exemplo de Uso com Cores SAP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Exemplo Prático de Código</span>
              </div>

              <button
                onClick={handleCopyExample}
                className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Código</span>
                  </>
                )}
              </button>
            </div>

            {/* Styled like SAP Netweaver white background editor */}
            <div className="bg-white border-2 border-slate-200 rounded-lg p-3 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner text-slate-900 select-text">
              <pre className="whitespace-pre font-mono">
                {displayEntry.example.split('\n').map((line, lIdx) => {
                  const isComment = line.trim().startsWith('*') || line.trim().startsWith('"');
                  return (
                    <div key={lIdx} className={isComment ? 'text-slate-400 italic' : 'text-slate-800'}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>

          {/* Duas colunas: Dica de Arquiteto + Armadilha Comum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Boas Práticas */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dica de Arquiteto (Clean ABAP)</span>
              </div>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                {displayEntry.bestPractice}
              </p>
            </div>

            {/* Armadilha Comum */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>O que evitar (Armadilha Comum)</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                {displayEntry.commonPitfall}
              </p>
            </div>
          </div>

          {/* Termos Relacionados */}
          {displayEntry.relatedTerms && displayEntry.relatedTerms.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Conceitos Relacionados:</span>
              {displayEntry.relatedTerms.map((rel) => (
                <button
                  key={rel}
                  onClick={() => onSelectRelated && onSelectRelated(rel)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 font-mono text-[11px] rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <span>{rel}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SAP GUI Dialog Footer */}
        <div className="bg-[#e4ebf2] border-t border-slate-300 px-4 py-2.5 flex items-center justify-between select-none text-xs">
          <div className="text-slate-500 text-[11px]">
            <span>SAP NetWeaver Help System • ABAP Keyword Documentation</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b2a4a] text-white font-semibold rounded hover:bg-blue-900 transition-colors shadow-xs"
          >
            Fechar (Enter)
          </button>
        </div>
      </div>
    </div>
  );
};
