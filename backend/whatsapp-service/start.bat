@echo off
echo Installation des dependances...
call npm install

echo.
echo Demarrage du service WhatsApp...
echo.
echo IMPORTANT: Scannez le QR code qui va apparaitre avec votre telephone!
echo.
pause

npm start
