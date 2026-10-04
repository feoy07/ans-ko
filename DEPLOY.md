# Publicera Ansöko

Jag rekommenderar Render för första publika testet. Render kan köra Express som Web Service och har en gratisnivå för test/hobbyprojekt.

## 1. Lägg projektet på GitHub
Skapa ett repository, t.ex. `ansoko`, och ladda upp:
- server.js
- package.json
- render.yaml
- public/index.html
- README.md
- .env.example

Lägg ALDRIG `.env` eller själva API-nyckeln i GitHub.

## 2. Skapa Web Service på Render
Välj repositoryt och använd:
- Build Command: `npm install`
- Start Command: `npm start`
- Plan: Free

`render.yaml` innehåller redan dessa inställningar.

## 3. Lägg in hemlig API-nyckel
I Render → Environment:
- `OPENAI_API_KEY` = din riktiga OpenAI API-nyckel
- `ANSOKO_MODEL` = den modell du vill använda

API-nyckeln ska endast ligga på servern.

## 4. Deploy
Efter deploy får du en publik `onrender.com`-adress.

Gratis Render Web Services kan gå ner efter inaktivitet och starta igen när någon besöker tjänsten. Det är okej för första testversionen.

## Viktigt
OpenAI API-användning är inte gratis bara för att hosting är gratis. Sätt en låg budget/usage limit på API-kontot medan Ansöko testas.
