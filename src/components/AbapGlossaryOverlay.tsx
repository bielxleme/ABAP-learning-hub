import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Code2, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Tag,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ABAP_GLOSSARY, AbapGlossaryEntry } from '../data/abapGlossary';

interface AbapGlossaryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string | null;
  onSelectTermInEditor?: (codeSnippet: string) => void;
}

export const AbapGlossaryOverlay: React.FC<AbapGlossaryOverlayProps> = ({
  isOpen,
  onClose,
  initialTerm,
  onSelectTermInEditor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeTermKey, setActiveTermKey] = useState<string>(
    initialTerm && ABAP_GLOSSARY[initialTerm] ? initialTerm : Object.keys(ABAP_GLOSSARY)[0]
  );
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  // Sync initialTerm if passed
  React.useEffect(() => {
    if (initialTerm && ABAP_GLOSSARY[initialTerm]) {
      setActiveTermKey(initialTerm);
    }
  }, [initialTerm]);

  const allEntries = useMemo(() => Object.values(ABAP_GLOSSARY), []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((e) => set.add(e.category));
    return ['Todos', ...Array.from(set)];
  }, [allEntries]);

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const matchCategory = selectedCategory === 'Todos' || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        entry.term.toLowerCase().includes(q) ||
        entry.title.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.syntax.toLowerCase().includes(q) ||
        entry.explanation.toLowerCase().includes(q) ||
        entry.bestPractice.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [allEntries, selectedCategory, searchQuery]);

  // Keep activeTermKey valid if list changes
  const activeEntry: AbapGlossaryEntry =
    ABAP_GLOSSARY[activeTermKey] || filteredEntries[0] || allEntries[0];

  const handleCopyCode = (text: string, term: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#f0f4f8] text-slate-900 w-full max-w-5xl rounded-lg shadow-2xl border-2 border-[#1b2a4a] overflow-hidden flex flex-col h-[90vh] max-h-[850px] font-sans">
        {/* Top SAP NetWeaver Style Bar */}
        <div className="bg-[#1b2a4a] text-white px-4 py-2.5 flex items-center justify-between select-none border-b border-[#304875]">
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 bg-[#0070f2] rounded-xs flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs">
              *
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                <span>Glossário Geral de Comandos & Sintaxe ABAP</span>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 px-1.5 py-0.2 rounded text-[10px] font-mono">
                  {allEntries.length} Termos Catalogados (*)
                </span>
              </div>
              <div className="text-[10px] text-blue-200">
                Repositório de Definições, Sintaxes e Exemplos Práticos NetWeaver / Clean ABAP
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Fechar Glossário (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-[#e4ebf2] border-b border-slate-300 p-3 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar termo, palavra-chave (*), sintaxe ou conceito (ex: SELECT, LOOP, SY-SUBRC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:block" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0070f2] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area: Sidebar list + Detail Panel */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* List Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-300 bg-white flex flex-col overflow-hidden max-h-48 md:max-h-full">
            <div className="p-2 border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 flex items-center justify-between">
              <span>Termos Disponíveis ({filteredEntries.length})</span>
              <span className="text-[10px] text-slate-400">Clique para inspecionar</span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {filteredEntries.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs italic">
                  Nenhum termo encontrado com "{searchQuery}".
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const isSelected = activeEntry.term === entry.term;
                  return (
                    <button
                      key={entry.term}
                      onClick={() => setActiveTermKey(entry.term)}
                      className={`w-full text-left p-2.5 transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-[#0070f2] text-blue-900'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-[#003366]">
                            {entry.term}
                          </span>
                          <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-mono font-bold">
                            *
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {entry.title}
                        </div>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 bg-[#f8fafc] overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeEntry ? (
              <div className="space-y-4 max-w-3xl">
                {/* Header info */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg sm:text-xl text-[#003366] bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                        {activeEntry.term}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                        {activeEntry.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(activeEntry.example, activeEntry.term)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#0070f2] hover:bg-blue-600 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      {copiedTerm === activeEntry.term ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Exemplo ABAP</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {activeEntry.title}
                  </h3>
                  <p className="text-slate-700 text-xs sm:text-sm mt-1 leading-relaxed">
                    {activeEntry.summary}
                  </p>
                </div>

                {/* Syntax template */}
                <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-xs space-y-1.5">
                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#0070f2]" />
                    <span>Estrutura Sintática / Gramática ABAP:</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 text-amber-300 font-mono text-xs rounded border border-slate-800 overflow-x-auto">
                    {activeEntry.syntax}
                  </div>
                </div>

                {/* Practical Example */}
                <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Exemplo de Código SAP Autêntico:</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Sintaxe SE38 / NetWeaver</span>
                  </div>
                  <div className="p-3 bg-[#0c1425] text-slate-200 font-mono text-xs rounded-lg border border-slate-800 overflow-x-auto leading-relaxed shadow-inner">
                    <pre className="whitespace-pre">{activeEntry.example}</pre>
                  </div>
                </div>

                {/* Detailed explanation */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Explicação Conceitual & Funcionamento Interno:</span>
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {activeEntry.explanation}
                  </p>
                </div>

                {/* Best Practice & Common Pitfall */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Boas Práticas Recomendadas:</span>
                    </div>
                    <p className="text-emerald-800 leading-relaxed">
                      {activeEntry.bestPractice}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-3 text-xs space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Armadilha / Erro Frequente:</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      {activeEntry.commonPitfall}
                    </p>
                  </div>
                </div>

                {/* Related terms */}
                {activeEntry.relatedTerms && activeEntry.relatedTerms.length > 0 && (
                  <div className="bg-white border border-slate-300 rounded-lg p-3 text-xs flex items-center flex-wrap gap-2">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      Termos Relacionados:
                    </span>
                    {activeEntry.relatedTerms.map((rt) => (
                      <button
                        key={rt}
                        onClick={() => {
                          if (ABAP_GLOSSARY[rt]) {
                            setActiveTermKey(rt);
                          } else {
                            setSearchQuery(rt);
                          }
                        }}
                        className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded font-mono text-[11px] font-semibold transition-colors"
                      >
                        {rt} *
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                Selecione um termo na coluna à esquerda para ver a explicação detalhada.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#e4ebf2] border-t border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-600 select-none">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Dica:</span>
            <span>No Editor SE38, qualquer palavra com asterisco (*) pode ser clicada para abrir esta ajuda imediata.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1b2a4a] hover:bg-slate-800 text-white rounded font-medium text-xs transition-colors"
          >
            Fechar Glossário
          </button>
        </div>
      </div>
    </div>
  );
};
