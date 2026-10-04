# Ansöko AI-backend

## Starta lokalt
1. Installera Node.js.
2. Kör `npm install`.
3. Kopiera `.env.example` till `.env`.
4. Lägg din OpenAI API-nyckel i `.env`.
5. Kör `npm start`.
6. Öppna http://localhost:3000

API-nyckeln ligger endast på servern och skickas aldrig till webbläsaren.

## Funktioner
- AI-personligt brev
- AI-förslag på ansökningsfrågor
- AI-intervjuförberedelse

Frontend fungerar fortfarande utan backend och visar då ett lokalt fallback-utkast.

API-kostnad: Responses API debiteras efter modellens tokenpriser när API:t används. Testa därför backend först med låg användning.
