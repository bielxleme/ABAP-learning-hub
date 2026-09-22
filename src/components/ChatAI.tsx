import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Code2, 
  RotateCcw, 
  Copy, 
  Check, 
  Lightbulb, 
  ChevronRight,
  Database,
  ExternalLink
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAIProps {
  currentEditorCode: string;
  onCodeSuggested?: (code: string) => void;
  onAskAi: () => void;
}

const QUICK_QUESTIONS = [
  'Qual é a diferença entre SELECT SINGLE e SELECT ... UP TO 1 ROWS?',
  'Como implementar uma função de conversão (CONVERSION_EXIT) em ABAP?',
  'Como usar o CALL FUNCTION com parâmetros EXPORTING, IMPORTING e TABLES?',
  'Como validar campos de tela no evento AT SELECTION-SCREEN?',
  'Explique como usar FIELD-SYMBOLS e ASSIGNING para máxima performance em tabelas internas.',
  'Pode analisar o código ABAP que escrevi no editor e sugerir melhorias de Clean ABAP?',
];

export const ChatAI: React.FC<ChatAIProps> = ({
  currentEditorCode,
  onCodeSuggested,
  onAskAi,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Olá! Sou o **SAP ABAP Mentor Pro**, seu tutor e arquiteto especialista no ecossistema SAP S/4HANA, NetWeaver e linguagem ABAP.

Posso tirar dúvidas sobre:
• **Open SQL & Banco de Dados** (tabelas MARA, VBAK, KNA1, índices e joins)
• **Sintaxe Moderna 7.40+** (VALUE, CORRESPONDING, inline DATA)
• **BAPIs, RFCs e Módulos de Função**
• **ALV Grid, Telas de Seleção e Eventos**
• **Análise e Otimização do código do seu editor**

Como posso ajudar no seu aprendizado hoje? Escolha uma das sugestões abaixo ou digite sua pergunta!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [includeEditorCode, setIncludeEditorCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      codeReference: includeEditorCode ? currentEditorCode : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    onAskAi();

    try {
      const payload: any = {
        message,
        history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
      };

      if (includeEditorCode && currentEditorCode) {
        payload.currentCode = currentEditorCode;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao processar solicitação no SAP Mentor AI');
      }

      const assistantMsg: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: data.reply || 'Desculpe, ocorreu uma falha na resposta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const isHighDemand =
        err?.message?.includes('alta demanda') ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE');

      const errorText = isHighDemand
        ? '⏳ O serviço de IA está enfrentando alta demanda temporária. O sistema tentou modelos alternativos, mas a rede está congestionada. Por favor, tente reenviar sua pergunta em alguns instantes.'
        : (err?.message || 'Houve uma falha ao conectar com o serviço do SAP Mentor AI. Verifique sua conexão e tente novamente.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          text: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md flex flex-col h-[740px] max-h-[82vh] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#1b2a4a] text-white px-4 py-3 border-b border-[#2a3f6a] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center border border-white/20 shadow-xs">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-sm sm:text-base">SAP Mentor AI</h2>
              <span className="bg-purple-500/30 border border-purple-400/40 text-purple-200 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                Arquiteto Sênior
              </span>
            </div>
            <p className="text-[11px] text-blue-200">Especialista em SAP ERP, S/4HANA e ABAP 7.40+</p>
          </div>
        </div>

        {/* Clear chat */}
        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                text: 'Chat reiniciado. Como posso te auxiliar com ABAP agora?',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 p-1 rounded hover:bg-slate-700/50 transition-colors"
          title="Limpar histórico"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpar</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-2xs ${
                  isUser
                    ? 'bg-[#0070f2] text-white'
                    : 'bg-[#1b2a4a] text-purple-300 border border-purple-400/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-lg p-3.5 text-xs sm:text-sm shadow-2xs leading-relaxed ${
                  isUser
                    ? 'bg-[#0070f2] text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Code Attachment badge if sent by user */}
                {msg.codeReference && (
                  <div className="mb-2 p-2 bg-blue-900/60 rounded text-[11px] font-mono text-blue-100 border border-blue-400/30 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Código do editor anexado à pergunta</span>
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.text}
                </div>

                {/* Footer time & copy */}
                <div
                  className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] border-t ${
                    isUser ? 'border-white/20 text-blue-100' : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="hover:text-slate-700 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-[#1b2a4a] text-purple-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex items-center space-x-2 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>O SAP Mentor está redigindo uma resposta técnica especializada...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-2.5 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex items-center space-x-2 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Sugestões:
        </span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-[11px] bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-900 rounded-full px-3 py-1 whitespace-nowrap transition-colors shrink-0 shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeEditorCode}
              onChange={(e) => setIncludeEditorCode(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              Incluir código atual do editor no contexto ({currentEditorCode.length} chars)
            </span>
          </label>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder="Pergunte sobre ABAP, sintaxe, tabelas MARA/VBAK, BAPIs ou tire dúvidas..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0070f2] focus:bg-white transition-colors"
          />
          <button
            id="btn-chat-send"
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-[#0070f2] hover:bg-[#0863cb] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
