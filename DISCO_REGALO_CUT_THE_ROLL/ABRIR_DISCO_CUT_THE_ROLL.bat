@echo off
title The Research Band - Cut the Roll & JazzRock
cls
echo ======================================================
echo   THE RESEARCH BAND - CUT THE ROLL & JAZZROCK
echo   Edicion Especial para Mi Hermano
echo ======================================================
echo.
echo Iniciando el album interactivo...
echo.

set "INDEX_PATH=%~dp0index.html"

:: Abrir en modo App Nativa sin barras de navegador
start msedge --app="%INDEX_PATH%" 2>nul
if %errorlevel% NEQ 0 (
    start "" "%INDEX_PATH%"
)

exit
