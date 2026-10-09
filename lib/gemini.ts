import { Experiment, JournalEntry } from "./types";

export interface AnalysisResult {
  whatHappened: string;
  explanation: string;
  evaluation: string;
  conclusionTemplate: string;
}

const SYSTEM_INSTRUCTION = `Сен "Жас химик зертханасы" платформасындағы оқушыларға арналған химия көмекшісісің.
Тек қазақ тілінде жауап бер.
Жауабың тек берілген тәжірибеге қатысты болсын, каталогтан тыс тәжірибелер немесе қауіпті заттар туралы нұсқау берме.
Жауапты міндетті түрде төрт бөлімнен тұратын JSON түрінде қайтар, басқа мәтін қоспа:
{
  "whatHappened": "не болды — оқушының жазбаларына сүйеніп, болған құбылысты сипаттау",
  "explanation": "химиялық түсіндірме — реакцияны қарапайым тілмен түсіндіру",
  "evaluation": "нәтижелерді бағалау — оқушының нәтижесі күтілген нәтижеге сәйкес келеді ме, қандай қателер болуы мүмкін",
  "conclusionTemplate": "қорытынды жазу үлгісі — оқушы толтыра алатын қысқа қорытынды сөйлем үлгісі"
}
Әр бөлім 2-4 сөйлемнен тұрсын, қазақ тілінде, әдеби және түсінікті болсын.`;

function buildUserPrompt(experiment: Experiment, entry: JournalEntry): string {
  const measurementsText = entry.measurements
    .map((m) => `- ${m.substance}: ${m.result} (мән: ${m.value})`)
    .join("\n");

  return `Тәжірибе атауы: ${experiment.title}
Мақсаты: ${experiment.goal}
Күтілетін нәтиже: ${experiment.expectedResult}
${experiment.reactionEquation ? `Реакция теңдеуі: ${experiment.reactionEquation}` : ""}

Оқушының бақылау жазбалары:
- Не байқады: ${entry.observation.notes || "жазылмаған"}
- Түс өзгерісі: ${entry.observation.colorChange || "жазылмаған"}
- Газ бөлінуі: ${entry.observation.gasReleased ? "иә" : "жоқ"}
- Температура өзгерісі: ${entry.observation.temperatureChange || "жазылмаған"}
- Уақыты: ${entry.observation.time || "жазылмаған"}

Өлшеулер кестесі:
${measurementsText || "кесте толтырылмаған"}

Осы деректер негізінде талдау жаса.`;
}

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

export async function callGeminiAnalysis(
  experiment: Experiment,
  entry: JournalEntry,
  apiKey: string
): Promise<AnalysisResult> {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: buildUserPrompt(experiment, entry) }],
      },
    ],
    systemInstruction: {
      role: "system",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini API қатесі: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini API бос жауап қайтарды");

  const parsed = JSON.parse(stripCodeFences(text));
  if (
    typeof parsed.whatHappened !== "string" ||
    typeof parsed.explanation !== "string" ||
    typeof parsed.evaluation !== "string" ||
    typeof parsed.conclusionTemplate !== "string"
  ) {
    throw new Error("Gemini API жауабының құрылымы дұрыс емес");
  }

  return parsed as AnalysisResult;
}

export function buildFallbackAnalysis(
  experiment: Experiment,
  entry: JournalEntry
): AnalysisResult {
  const hasObservation = Boolean(entry.observation.notes?.trim());

  const whatHappened = hasObservation
    ? `Сіздің жазбаңыз бойынша: «${entry.observation.notes.trim()}». Бұл «${experiment.title}» тәжірибесінде күтілетін құбылыстың белгілеріне сәйкес келеді.`
    : `«${experiment.title}» тәжірибесінде негізгі бақылау жазылмаған. Келесі жолы не байқағаныңызды толық жазуға тырысыңыз.`;

  const explanation = experiment.reactionEquation
    ? `Химиялық тұрғыдан бұл процесс мына теңдеумен сипатталады: ${experiment.reactionEquation}. ${experiment.expectedResult}`
    : experiment.expectedResult;

  const evaluation = entry.observation.gasReleased || entry.measurements.length > 0
    ? "Жазылған бақылаулар күтілген нәтижеге жақын. Нәтиженің нақтылығын арттыру үшін уақыт пен мәндерді дәлірек өлшеп жазуға тырысыңыз."
    : "Бақылаулар толық емес көрінеді. Тәжірибені қайталап, өзгерістерді әр қадамда жазып отырған дұрыс.";

  const conclusionTemplate = `Мен «${experiment.title}» тәжірибесін жасап, ${
    entry.observation.gasReleased ? "газ бөлінуін" : "заттың өзгеруін"
  } бақыладым. Нәтиже күтілген теориямен ______ сәйкес келді, себебі ______.`;

  return { whatHappened, explanation, evaluation, conclusionTemplate };
}
