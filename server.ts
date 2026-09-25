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

// App Version & Real-time Update Info
const CURRENT_APP_VERSION = "1.3.0";
const CURRENT_BUILD_TIMESTAMP = "2026-09-25T11:00:00Z";
const CURRENT_RELEASE_NOTES = [
  "Notificações em tempo real com indicador visual no aplicativo para Web, Android e Desktop",
  "Instalador nativo e atalhos otimizados para Windows 11 (Área de Trabalho e Menu Iniciar)",
  "Suporte completo a funcionamento offline sem internet para Windows 11 Desktop, Android e Web",
  "API de Notificações para lembretes diários e proteção da sequência de estudos (streak)",
  "Exclusão de perfis na lixeira com diálogo interno seguro e limpeza de dados locais"
];

// Active SSE client connections for real-time updates
const sseClients = new Set<express.Response>();

app.get("/api/version", (req, res) => {
  res.json({
    version: CURRENT_APP_VERSION,
    buildTimestamp: CURRENT_BUILD_TIMESTAMP,
    releaseNotes: CURRENT_RELEASE_NOTES,
    minSupportedVersion: "1.0.0",
    updateAvailable: false, // Baseline: current deployed version
    serverTime: new Date().toISOString()
  });
});

// Server-Sent Events (SSE) for Real-Time App Updates
app.get("/api/updates/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  sseClients.add(res);

  // Send initial handshake
  res.write(`data: ${JSON.stringify({
    type: "connected",
    version: CURRENT_APP_VERSION,
    buildTimestamp: CURRENT_BUILD_TIMESTAMP,
    timestamp: Date.now()
  })}\n\n`);

  // Keep-alive heartbeat every 25 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(`: heartbeat\n\n`);
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// Windows 11 Installer Download Endpoint
app.get("/api/download/windows-installer", (req, res) => {
  const protocol = req.protocol || "https";
  const host = req.get("host") || "ais-dev-xeo2szl7px7lbbljrmijwg-702341020848.us-west2.run.app";
  const appUrl = `${protocol}://${host}`;

  const batContent = `@echo off
chcp 65001 >nul
title Instalador Desktop SAP ABAP Learning Hub - Windows 11
color 1F

echo ==============================================================================
echo              SAP ABAP LEARNING HUB - INSTALADOR WINDOWS 11
echo ==============================================================================
echo.
echo   Este instalador configura o SAP ABAP Learning Hub como aplicativo
echo   nativo para a sua área de trabalho e menu Iniciar do Windows 11.
echo.
echo ==============================================================================
echo.

set "APP_NAME=SAP ABAP Learning Hub"
set "APP_URL=${appUrl}"
set "APP_DIR=%LOCALAPPDATA%\\SAP_ABAP_LearningHub"

if not exist "%APP_DIR%" mkdir "%APP_DIR%"

set "BROWSER_PATH="
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
) else if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
) else (
    set "BROWSER_PATH=msedge.exe"
)

echo [✓] Navegador Windows 11 detectado: %BROWSER_PATH%
echo [..] Baixando ícone da aplicação SAP...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%APP_URL%/pwa-192x192.png', '%APP_DIR%\\app-icon.png')" >nul 2>&1

echo [..] Criando atalhos na Área de Trabalho e Menu Iniciar...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$WshShell = New-Object -ComObject WScript.Shell; " ^
  "$DesktopPath = [Environment]::GetFolderPath('Desktop'); " ^
  "$StartMenuPath = [Environment]::GetFolderPath('Programs'); " ^
  "$AppDir = '%APP_DIR%'; " ^
  "$Browser = '%BROWSER_PATH%'; " ^
  "$Url = '%APP_URL%'; " ^
  "$ShortcutDesktop = $WshShell.CreateShortcut(\\"$DesktopPath\\SAP ABAP Learning Hub.lnk\\"); " ^
  "$ShortcutDesktop.TargetPath = $Browser; " ^
  "$ShortcutDesktop.Arguments = \\"--app=$Url --window-size=1280,820 --app-id=sap-abap-hub\\"; " ^
  "$ShortcutDesktop.Description = 'SAP ABAP Learning Hub - Ambiente de Aprendizado Interativo ABAP 7.40+'; " ^
  "$ShortcutDesktop.WorkingDirectory = $AppDir; " ^
  "$ShortcutDesktop.Save(); " ^
  "$ShortcutStart = $WshShell.CreateShortcut(\\"$StartMenuPath\\SAP ABAP Learning Hub.lnk\\"); " ^
  "$ShortcutStart.TargetPath = $Browser; " ^
  "$ShortcutStart.Arguments = \\"--app=$Url --window-size=1280,820 --app-id=sap-abap-hub\\"; " ^
  "$ShortcutStart.Description = 'SAP ABAP Learning Hub'; " ^
  "$ShortcutStart.WorkingDirectory = $AppDir; " ^
  "$ShortcutStart.Save(); "

echo [✓] Atalho criado na Área de Trabalho!
echo [✓] Atalho criado no Menu Iniciar do Windows 11!
echo.
echo ==============================================================================
echo                 INSTALAÇÃO CONCLUÍDA COM SUCESSO!
echo ==============================================================================
echo.
echo   O aplicativo agora está pronto na sua Área de Trabalho e Menu Iniciar.
echo   Ele abrirá em janela própria independente, sem barras de navegador.
echo.

set /p INICIAR="Deseja iniciar o SAP ABAP Learning Hub agora? (S/N): "
if /i "%INICIAR%"=="S" (
    start "" "%BROWSER_PATH%" --app="%APP_URL%" --window-size=1280,820 --app-id=sap-abap-hub
)

exit /b 0
`;

  res.setHeader("Content-Disposition", 'attachment; filename="Instalar-SAP-ABAP-Hub-Windows11.bat"');
  res.setHeader("Content-Type", "application/x-bat; charset=utf-8");
  res.send(batContent);
});

// Digital Asset Links for Android TWA Google Play Store
app.get("/.well-known/assetlinks.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const assetLinksPath = path.join(process.cwd(), "public", ".well-known", "assetlinks.json");
  res.sendFile(assetLinksPath);
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
