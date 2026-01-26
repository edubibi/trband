@echo off
chcp 65001 > nul
setlocal

echo =========================================
echo   🚀 PUBLICAR EN GITHUB
echo =========================================
echo.
echo Este script subirá tu reproductor a Internet.
echo.
echo REQUISITOS:
echo 1. Tener una cuenta en GitHub.com
echo 2. Crear un "Nuevo Repositorio" (New Repository).
echo 3. Copiar la URL del repositorio (HTTPS).
echo.

set /p REPO_URL="Pega aquí la URL del repositorio (terminada en .git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No has escrito ninguna URL.
    pause
    exit /b
)

echo.
echo [1/5] Inicializando Git...
git init
git branch -M main

echo [2/5] Preparando archivos...
git add index.html
git add assets/
git add *.mp3
git add *.jpg
git add *.png
git add *.css
git add *.js
:: Agregamos todo excepto lo ignorado
git add .

echo [3/5] Guardando cambios...
git commit -m "Mi Disco - Publicación inicial"

echo [4/5] Conectando con GitHub...
git remote add origin %REPO_URL%
git remote set-url origin %REPO_URL%

echo [5/5] Subiendo archivos...
git push -u origin main

echo.
echo =========================================
echo   ✅ ¡SUBIDA COMPLETADA!
echo =========================================
echo.
echo AHORA:
echo 1. Ve a tu repositorio en GitHub.
echo 2. Entra en "Settings" -> "Pages".
echo 3. En "Branch", selecciona "main" y guarda.
echo 4. En unos minutos, tendrás tu enlace web listo.
echo.
pause
