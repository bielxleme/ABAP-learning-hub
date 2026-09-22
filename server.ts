import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized or standard Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não encontrada no ambiente.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SAP_SYSTEM_INSTRUCTION = `Você é o 'SAP ABAP Mentor Pro', um Arquiteto e Consultor Sênior especialista no ecossistema SAP (SAP S/4HANA, ECC, NetWeaver e linguagem ABAP moderna 7.40/7.50+).
Seu objetivo é guiar a desenvolvedora a dominar ABAP com rigor técnico, didática exemplar e foco em boas práticas da indústria (Clean ABAP, performance em banco com HANA, modularização e design de software).

Suas diretrizes:
1. Respostas técnicas e precisas: Cite transações relevantes quando apropriado (ex: SE11, SE38, SE80, SE24, ST05, SAT, BAPI).
2. Exemplos de código ABAP autênticos: Use sintaxe ABAP correta com palavras-chave em MAIÚSCULAS (DATA, SELECT, LOOP AT, READ TABLE, TYPES, FIELD-SYMBOLS, ASSIGNING, CALL FUNCTION, BAPI_*).
3. Tabelas e Dicionário: Faça referência a tabelas clássicas do SAP (MARA para dados gerais de material, MARC para centro, MARD para depósito, VBAK/VBAP para ordens de venda, KNA1 para clientes, LFA1 para fornecedores, EKKO/EKPO para compras, BKPF/BSEG para contabilidade financeira).
4. Boas práticas e Performance: Destaque o impacto de SELECT dentro de LOOP (evitar! usar FOR ALL ENTRIES ou INNER JOIN), a importância de verificar SY-SUBRC após buscas, uso de chaves primárias e expressões modernas como VALUE #( ... ), COND #( ... ), LINE_EXISTS( ... ).
5. Responda em português claro, profissional, motivador e estruturado com seções e blocos de código com destaque.`;

/**
 * Executes a Gemini request with automatic retries and fallback models
 * to gracefully handle transient 503 (high demand) or 429 rate limit spikes.
 */
async function generateWithFallback(promptText: string): Promise<string> {
  const ai = getGeminiClient();
  const models = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction: SAP_SYSTEM_INSTRUCTION,
          },
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || String(err)).toLowerCase();
        const isTransient =
          errMsg.includes("503") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("resource_exhausted");

        console.warn(`[Gemini] Modelo ${model} tentativa ${attempt + 1}/2 falhou: ${err?.message || err}`);

        if (isTransient) {
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
          continue;
        } else {
          break; // Switch to next fallback model
        }
      }
    }
  }

  throw lastError || new Error("Serviço temporariamente indisponível devido a alta demanda.");
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SAP ABAP Learning Hub" });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, currentCode } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem obrigatória" });
    }

    // Build context
    let promptText = "";
    if (currentCode && typeof currentCode === "string" && currentCode.trim().length > 0) {
      promptText += `[CÓDIGO ATUAL DO EDITOR ABAP DA USUÁRIA]:\n\`\`\`abap\n${currentCode.slice(0, 3000)}\n\`\`\`\n\n`;
    }
    
    if (Array.isArray(history) && history.length > 0) {
      promptText += `[HISTÓRICO RECENTE]:\n`;
      const recent = history.slice(-6);
      for (const h of recent) {
        promptText += `${h.role === "user" ? "Usuária" : "SAP Mentor"}: ${h.text}\n`;
      }
      promptText += `\n`;
    }

    promptText += `[PERGUNTA DA USUÁRIA]: ${message}`;

    const reply = await generateWithFallback(promptText);
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.status(503).json({
      error: "O serviço de IA está temporariamente com alta demanda. Por favor, tente novamente em alguns segundos.",
      details: err?.message || String(err),
    });
  }
});

// Analyze code endpoint
app.post("/api/analyze-code", async (req, res) => {
  try {
    const { code, taskGoal } = req.body;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Código ABAP obrigatório" });
    }

    const prompt = `Analise detalhadamente o seguinte código ABAP escrito pela aluna.
${taskGoal ? `Objetivo esperado do exercício: ${taskGoal}` : ""}

\`\`\`abap
${code.slice(0, 4000)}
\`\`\`

Por favor, forneça uma análise estruturada contendo:
1. Validação de Sintaxe e Verificação de Ponto Final (.)
2. Eficiência e Boas Práticas (ex: SELECT *, LOOP sem ASSIGNING/FIELD-SYMBOLS, verificação de SY-SUBRC)
3. Sugestão de Modernização (ex: Sintaxe 7.40+ com DATA( ) inline, construtores VALUE, CORRESPONDING)
4. Código Otimizado recomendado.`;

    const analysis = await generateWithFallback(prompt);
    res.json({ analysis });
  } catch (err: any) {
    console.error("Gemini Code Analysis Error:", err);
    res.status(503).json({
      error: "Erro temporário ao analisar o código devido a alta demanda do serviço.",
      details: err?.message || String(err),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAP ABAP App running on http://localhost:${PORT}`);
  });
}

startServer();
