@echo off
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
set "APP_URL=https://ais-dev-xeo2szl7px7lbbljrmijwg-702341020848.us-west2.run.app"
set "APP_DIR=%LOCALAPPDATA%\SAP_ABAP_LearningHub"

:: 1. Criar pasta da aplicação
if not exist "%APP_DIR%" mkdir "%APP_DIR%"

:: 2. Detectar Navegador compatível com modo App Nativo (Edge ou Chrome)
set "BROWSER_PATH="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
) else (
    set "BROWSER_PATH=msedge.exe"
)

echo [✓] Navegador Windows 11 detectado: %BROWSER_PATH%

:: 3. Baixar Ícone oficial de alta definição
echo [..] Baixando ícone da aplicação SAP...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%APP_URL%/pwa-192x192.png', '%APP_DIR%\app-icon.png')" >nul 2>&1

:: 4. Criar Atalho na Área de Trabalho e Menu Iniciar via PowerShell
echo [..] Criando atalhos na Área de Trabalho e Menu Iniciar...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$WshShell = New-Object -ComObject WScript.Shell; " ^
  "$DesktopPath = [Environment]::GetFolderPath('Desktop'); " ^
  "$StartMenuPath = [Environment]::GetFolderPath('Programs'); " ^
  "$AppDir = '%APP_DIR%'; " ^
  "$Browser = '%BROWSER_PATH%'; " ^
  "$Url = '%APP_URL%'; " ^
  "$ShortcutDesktop = $WshShell.CreateShortcut(\"$DesktopPath\SAP ABAP Learning Hub.lnk\"); " ^
  "$ShortcutDesktop.TargetPath = $Browser; " ^
  "$ShortcutDesktop.Arguments = \"--app=$Url --window-size=1280,820 --app-id=sap-abap-hub\"; " ^
  "$ShortcutDesktop.Description = 'SAP ABAP Learning Hub - Ambiente de Aprendizado Interativo ABAP 7.40+'; " ^
  "$ShortcutDesktop.WorkingDirectory = $AppDir; " ^
  "$ShortcutDesktop.Save(); " ^
  "$ShortcutStart = $WshShell.CreateShortcut(\"$StartMenuPath\SAP ABAP Learning Hub.lnk\"); " ^
  "$ShortcutStart.TargetPath = $Browser; " ^
  "$ShortcutStart.Arguments = \"--app=$Url --window-size=1280,820 --app-id=sap-abap-hub\"; " ^
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
