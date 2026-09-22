import React, { useState } from 'react';
import { 
  BookOpen, 
  Database, 
  ExternalLink, 
  Search, 
  FileText, 
  Layers, 
  Terminal, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_SAP_LINKS } from '../data/sapReference';

interface TableDoc {
  name: string;
  desc: string;
  module: string;
  keyFields: string[];
  commonFields: string[];
}

const COMMON_SAP_TABLES: TableDoc[] = [
  {
    name: 'MARA',
    desc: 'Dados Gerais de Material (Nível Mandante)',
    module: 'MM / Logística',
    keyFields: ['MANDT', 'MATNR'],
    commonFields: ['MTART (Tipo)', 'MEINS (Unidade Base)', 'MATKL (Grupo Mercadoria)', 'BRGEW (Peso Bruto)'],
  },
  {
    name: 'MAKT',
    desc: 'Textos Breves / Descrições dos Materiais',
    module: 'MM',
    keyFields: ['MANDT', 'MATNR', 'SPRAS (Idioma)'],
    commonFields: ['MAKTX (Descrição do Material)'],
  },
  {
    name: 'MARC',
    desc: 'Dados de Material por Centro / Planta',
    module: 'MM / PP',
    keyFields: ['MANDT', 'MATNR', 'WERKS (Centro)'],
    commonFields: ['EKGRP (Grupo Compradores)', 'DISPO (Planejador MRP)'],
  },
  {
    name: 'VBAK',
    desc: 'Cabeçalho do Documento de Vendas (Ordem de Venda)',
    module: 'SD (Vendas e Distribuição)',
    keyFields: ['MANDT', 'VBELN'],
    commonFields: ['AUART (Tipo Doc)', 'KUNNR (Cliente Emissor)', 'NETWR (Valor Líquido)', 'WAERK (Moeda)'],
  },
  {
    name: 'VBAP',
    desc: 'Item do Documento de Vendas',
    module: 'SD',
    keyFields: ['MANDT', 'VBELN', 'POSNR'],
    commonFields: ['MATNR', 'KWMENG (Quantidade)', 'VRKME (Unidade Venda)', 'NETPR (Preço)'],
  },
  {
    name: 'KNA1',
    desc: 'Mestre de Clientes (Parte Geral)',
    module: 'SD / FI',
    keyFields: ['MANDT', 'KUNNR'],
    commonFields: ['NAME1 (Nome)', 'ORT01 (Cidade)', 'LAND1 (País)', 'PSTLZ (CEP)'],
  },
  {
    name: 'EKKO',
    desc: 'Cabeçalho do Documento de Compras (Pedido de Compra)',
    module: 'MM (Suprimentos)',
    keyFields: ['MANDT', 'EBELN'],
    commonFields: ['BSART (Tipo Pedido)', 'LIFNR (Fornecedor)', 'EKORG (Org. Compras)'],
  },
  {
    name: 'BKPF',
    desc: 'Cabeçalho do Documento Contábil',
    module: 'FI (Controladoria e Finanças)',
    keyFields: ['MANDT', 'BUKRS', 'BELNR', 'GJAHR'],
    commonFields: ['BLART (Tipo Doc)', 'BUDAT (Data Lançamento)', 'USNAM (Usuário)'],
  },
];

const COMMON_TCODES = [
  { code: 'SE38', name: 'ABAP Editor', desc: 'Criação e manutenção de programas e relatórios ABAP.' },
  { code: 'SE80', name: 'Object Navigator', desc: 'Ambiente integrado de desenvolvimento de pacotes, classes e funções.' },
  { code: 'SE11', name: 'ABAP Dictionary', desc: 'Criação e consulta de tabelas transparentes, estruturas, domínios e elementos de dados.' },
  { code: 'SE16N', name: 'General Table Display', desc: 'Visualização rápida de registros de qualquer tabela SAP sem programar.' },
  { code: 'SE24', name: 'Class Builder', desc: 'Modelagem orientada a objetos (ABAP OO), classes globais e interfaces.' },
  { code: 'SE37', name: 'Function Builder', desc: 'Desenvolvimento e teste de Módulos de Função e BAPIs.' },
  { code: 'ST05', name: 'Performance Trace', desc: 'Rastreamento detalhado de comandos SQL enviados para o banco de dados.' },
  { code: 'SAT', name: 'Runtime Analysis', desc: 'Mapeamento de tempos de execução, gargalos de CPU e chamadas no ABAP.' },
];

export const SapCheatSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = COMMON_SAP_TABLES.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#0070f2]/10 flex items-center justify-center text-[#0070f2]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Dicionário SE11 & Guia Rápido de Referência SAP
              </h2>
              <p className="text-xs text-slate-500">
                Consulta instantânea das principais tabelas do ERP, transações e novidades do Clean ABAP 7.40+.
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar tabela (ex: MARA, VBAK)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Tables Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#0070f2]" />
          Tabelas Padrão do Dicionário SAP (SE11)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTables.map((t) => (
            <div key={t.name} className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-sm bg-blue-50 text-[#0070f2] px-2 py-0.5 rounded border border-blue-200">
                    {t.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">({t.module})</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-800">{t.desc}</div>

              <div className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-100 space-y-1">
                <div>
                  <span className="text-slate-400 font-sans font-bold">Chaves Primárias: </span>
                  <span className="text-purple-700 font-semibold">{t.keyFields.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans font-bold">Campos Frequentes: </span>
                  <span className="text-slate-700">{t.commonFields.join(' | ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clean ABAP 7.40+ Modern Syntax Guide */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Guia Rápido: Sintaxe Moderna ABAP 7.40+</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
            <span className="font-bold text-[#0070f2]">Declaração Inline de Variáveis:</span>
            <pre className="bg-[#0f172a] text-emerald-300 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`" Em vez de declarar antes com DATA:
SELECT matnr, mtart
  FROM mara
  INTO TABLE @DATA(lt_materiais).`}
            </pre>
            <p className="text-[11px] text-slate-600">Dispensa bloco DATA prévio ao SELECT ou loop.</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
            <span className="font-bold text-[#0070f2]">Construtor VALUE #( ):</span>
            <pre className="bg-[#0f172a] text-emerald-300 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`DATA(ls_material) = VALUE ty_material(
  matnr = '100-100'
  mtart = 'KA'
  maktx = 'Sensor Eletrônico' ).`}
            </pre>
            <p className="text-[11px] text-slate-600">Popula estruturas e tabelas em expressão única.</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
            <span className="font-bold text-[#0070f2]">Expressão de Tabela e LINE_EXISTS:</span>
            <pre className="bg-[#0f172a] text-emerald-300 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`IF line_exists( lt_mara[ matnr = '100-100' ] ).
  DATA(ls_linha) = lt_mara[ matnr = '100-100' ].
ENDIF.`}
            </pre>
            <p className="text-[11px] text-slate-600">Substitui READ TABLE ... IF sy-subrc = 0.</p>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50/50">
            <span className="font-bold text-[#0070f2]">CORRESPONDING #( ):</span>
            <pre className="bg-[#0f172a] text-emerald-300 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`" Copia campos homônimos entre estruturas
ls_destino = CORRESPONDING #( ls_origem ).`}
            </pre>
            <p className="text-[11px] text-slate-600">Substitui MOVE-CORRESPONDING com máxima clareza.</p>
          </div>
        </div>
      </div>

      {/* Common T-Codes */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
          <Terminal className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Transações Essenciais de Desenvolvimento</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {COMMON_TCODES.map((t) => (
            <div key={t.code} className="p-2.5 rounded border border-slate-200 bg-slate-50/50 text-xs space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold bg-[#1b2a4a] text-white px-1.5 py-0.2 rounded text-[11px]">
                  {t.code}
                </span>
                <span className="font-semibold text-slate-800">{t.name}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
          <ExternalLink className="w-5 h-5 text-[#0070f2]" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Links e Recursos Oficiais da SAP</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OFFICIAL_SAP_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-start space-x-3 text-xs group"
            >
              <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 group-hover:text-blue-700">{link.title}</div>
                <div className="text-[11px] text-slate-500">{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
