@echo off
node -e "const fs=require('fs'); const j=fs.readFileSync('progetti.json','utf8'); fs.writeFileSync('progetti-data.js','window.PROGETTI_DATA = '+j+';\n'); console.log('progetti-data.js aggiornato');"
pause
