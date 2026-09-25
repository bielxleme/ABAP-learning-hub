<#
.SYNOPSIS
    Script de Instalação do SAP ABAP Learning Hub para Windows 11 / Windows 10
.DESCRIPTION
    Configura o SAP ABAP Learning Hub em modo Desktop App independente,
    cria atalhos na Área de Trabalho e Menu Iniciar com ícone dedicado.
#>

[CmdletBinding()]
param (
    [string]$AppUrl = "https://ais-dev-xeo2szl7px7lbbljrmijwg-702341020848.us-west2.run.app",
    [string]$AppName = "SAP ABAP Learning Hub"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Instalando $AppName no Windows 11" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Diretório da Aplicação
$AppDir = Join-Path $env:LOCALAPPDATA "SAP_ABAP_LearningHub"
if (-not (Test-Path $AppDir)) {
    New-Item -ItemType Directory -Path $AppDir -Force | Out-Null
}

# 2. Encontrar Navegador Chromium nativo no Windows 11 (Edge ou Chrome)
$BrowserPath = ""
$EdgePaths = @(
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
)

foreach ($path in $EdgePaths) {
    if (Test-Path $path) {
        $BrowserPath = $path
        break
    }
}

if (-not $BrowserPath) {
    $BrowserPath = "msedge.exe"
}

Write-Host "[✓] Navegador do Windows 11 localizado: $BrowserPath" -ForegroundColor Green

# 3. Baixar ícone
$IconPath = Join-Path $AppDir "app-icon.png"
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri "$AppUrl/pwa-192x192.png" -OutFile $IconPath -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "[✓] Ícone SAP baixado com sucesso." -ForegroundColor Green
} catch {
    Write-Host "[i] Usando ícone padrão do sistema." -ForegroundColor Gray
}

# 4. Criar Atalhos
$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')
$StartMenu = [Environment]::GetFolderPath('Programs')

# Atalho Área de Trabalho
$ShortcutDesktop = $WshShell.CreateShortcut((Join-Path $Desktop "$AppName.lnk"))
$ShortcutDesktop.TargetPath = $BrowserPath
$ShortcutDesktop.Arguments = "--app=$AppUrl --window-size=1280,820 --app-id=sap-abap-hub"
$ShortcutDesktop.Description = "$AppName - Plataforma Gamificada SAP ABAP"
$ShortcutDesktop.WorkingDirectory = $AppDir
$ShortcutDesktop.Save()
Write-Host "[✓] Atalho criado na Área de Trabalho." -ForegroundColor Green

# Atalho Menu Iniciar
$ShortcutStart = $WshShell.CreateShortcut((Join-Path $StartMenu "$AppName.lnk"))
$ShortcutStart.TargetPath = $BrowserPath
$ShortcutStart.Arguments = "--app=$AppUrl --window-size=1280,820 --app-id=sap-abap-hub"
$ShortcutStart.Description = "$AppName"
$ShortcutStart.WorkingDirectory = $AppDir
$ShortcutStart.Save()
Write-Host "[✓] Atalho criado no Menu Iniciar do Windows 11." -ForegroundColor Green

Write-Host "`nInstalação concluída! O aplicativo está pronto para uso." -ForegroundColor Cyan
