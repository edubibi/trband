@echo off
title The Research Band - Cut the Roll & JazzRock
cls
echo ======================================================
echo   THE RESEARCH BAND - CUT THE ROLL & JAZZROCK
echo   Edicion Interactiva Especial
echo ======================================================
echo.

set "INDEX_PATH=%~dp0index.html"

if not exist "%INDEX_PATH%" (
    echo ======================================================
    echo  [!] ATENCION: Has abierto el archivo dentro del ZIP
    echo ======================================================
    echo.
    echo Para disfrutar del album con todas las canciones y fotos:
    echo.
    echo   1. Cierra esta ventana.
    echo   2. Haz clic derecho sobre el archivo .ZIP descargado.
    echo   3. Selecciona "Extraer todo..." o "Extraer aqui".
    echo   4. Entra en la carpeta extraida y abre este archivo.
    echo.
    echo ======================================================
    echo Presiona cualquier tecla para cerrar...
    pause >nul
    exit /b
)

echo Iniciando el album interactivo...
echo.

:: 1. Intentar Edge en modo App nativa (sin barras de navegador)
start "" msedge --app="%INDEX_PATH%" 2>nul
if %errorlevel% NEQ 0 (
    :: 2. Intentar Chrome en modo App
    start "" chrome --app="%INDEX_PATH%" 2>nul
    if %errorlevel% NEQ 0 (
        :: 3. Abrir en el navegador predeterminado
        start "" "%INDEX_PATH%"
    )
)

exit
