import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3000);

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY saknas. /api/ai kommer returnera ett tydligt fel tills nyckeln läggs in.");
}

const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey: process.env.OPENAI_API_KEY}) : null;

app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));

const SYSTEM = `Du är Ansöko, en svensk AI-coach för jobbsökare.
Skriv naturligt, konkret och mänskligt. Var professionell men inte stel.
KRITISK REGEL: hitta aldrig på utbildningar, körkort, certifikat, erfarenheter, arbetsgivare, språk eller andra meriter.
Använd bara fakta som uttryckligen stöds av CV:t. Om något inte finns i CV:t ska du inte påstå det.
Jobbannonsen används för att anpassa texten, inte för att ge användaren påhittade meriter.
Om ett krav inte kan verifieras från CV:t, formulera dig neutralt eller lämna det utanför.
Svara på svenska.`;

function clean(value,max=18000){
  if(typeof value!=="string") return "";
  return value.replace(/\u0000/g,"").slice(0,max).trim();
}

app.post("/api/ai", async (req,res)=>{
  try{
    if(!client) return res.status(503).json({error:"Ansöko AI-backend är inte konfigurerad ännu. Lägg in OPENAI_API_KEY på servern."});

    const mode=req.body?.mode;
    const cv=clean(req.body?.cv);
    const job=clean(req.body?.job);

    if(!cv || !job) return res.status(400).json({error:"CV och jobbannons krävs."});

    let task="";
    if(mode==="cover_letter"){
      task=`Skriv ett personligt brev för jobbet nedan.
- 180–300 ord.
- Börja inte med en generisk klyscha.
- Lyft 2–4 relevanta saker som faktiskt finns i CV:t.
- Knyt dem till arbetsuppgifterna i annonsen.
- Om ett viktigt krav saknas i CV:t: påstå inte att personen har det.
- Använd inga platshållare om namn saknas.
JOBBANNONS:
${job}

CV:
${cv}`;
    } else if(mode==="application_questions"){
      task=`Analysera jobbannonsen och skapa 5–8 vanliga ansökningsfrågor som en arbetsgivare kan ställa.
För varje fråga:
1. Skriv frågan.
2. Ge ett kort, naturligt svarsförslag baserat enbart på CV:t.
3. Om CV:t inte innehåller tillräckligt underlag, skriv "Det här kan inte verifieras från CV:t" och föreslå vad användaren själv bör fylla i.
Undvik påhittade erfarenheter.
JOBBANNONS:
${job}

CV:
${cv}`;
    } else if(mode==="interview"){
      task=`Förbered användaren inför en intervju för jobbet.
Skapa 8 relevanta frågor och ett kort svarstips för varje. Använd CV:t när du ger exempel, men hitta aldrig på erfarenhet.
JOBBANNONS:
${job}

CV:
${cv}`;
    } else {
      return res.status(400).json({error:"Okänt AI-läge."});
    }

    const response=await client.responses.create({
      model: process.env.ANSOKO_MODEL || "gpt-6-luna",
      instructions:SYSTEM,
      input:task
    });

    res.json({text:response.output_text || ""});
  }catch(error){
    console.error(error);
    res.status(500).json({error:"AI-tjänsten kunde inte slutföra begäran."});
  }
});

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"));
});

app.listen(port,'0.0.0.0',()=>console.log(`Ansöko kör på port ${port}`));
