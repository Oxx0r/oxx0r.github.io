::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFBVdRwuOAE+1EbsQ5+n//NauoUITR946dY3X37mdHPMK5EaqfJUitg==
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSjk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCyDJGyX8VAjFBVdRwuOAE+1BaAR7ebv/Nazln5dduM8c5rL5paPNPQf71bwdIRt8XtWmcgYBRhZPl/rXQwmoH5Ws2DFf5XM5Vu1HR3RsRl5J0dHoCPgjSk3b5NYm9cA2xyu6V73oLAA1XnrW+cLDWaB
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
setlocal
:: Setzt die Konsole auf UTF-8, damit Umlaute korrekt angezeigt werden
chcp 65001 > nul

:: Definition der Farbcodes
set "cyan=[96m"
set "green=[92m"
set "blue=[94m"
set "red=[91m"
set "reset=[0m"

:: Datum und Uhrzeit über PowerShell holen
for /f "tokens=*" %%i in ('powershell -command "get-date -format 'dd.MM.yyyy HH:mm'"') do set timestamp=%%i

echo %cyan%========================================%reset%
echo %cyan%PABLO-PATCH AUTO-UPLOAD%reset%
echo Zeit: %timestamp%
echo %cyan%========================================%reset%
echo.

:: 1. Änderungen stagen
echo %blue%[1/3] Sammle Änderungen...%reset%
git add .

:: 2. Commit erstellen
echo %blue%[2/3] Erstelle Speicherpunkt...%reset%
git commit -m "Auto-Update: %timestamp%"

:: 3. Push zu GitHub
echo %blue%[3/3] Lade hoch zu GitHub...%reset%
git push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo %green%========================================%reset%
    echo %green%[ERFOLG] Alles auf GitHub geladen!%reset%
    echo %green%========================================%reset%
) else (
    echo.
    echo %red%[FEHLER] Upload fehlgeschlagen.%reset%
)

pause