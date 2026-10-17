@echo off
echo Запускаем DramaTracker...

wt -d "%~dp0" new-tab --title "Dev Server" powershell -NoExit -Command "npm run dev" ; new-tab --title "Prisma Studio" powershell -NoExit -Command "npx prisma studio"