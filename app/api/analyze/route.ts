import { NextRequest, NextResponse } from "next/server";
import { getExperimentById } from "@/data/experiments";
import { buildFallbackAnalysis, callGeminiAnalysis } from "@/lib/gemini";
import { JournalEntry } from "@/lib/types";

export async function POST(req: NextRequest) {
  let payload: { experimentId?: string; entry?: JournalEntry };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Дұрыс емес сұраным" }, { status: 400 });
  }

  const { experimentId, entry } = payload;
  if (!experimentId || !entry) {
    return NextResponse.json(
      { error: "experimentId немесе entry жетіспейді" },
      { status: 400 }
    );
  }

  const experiment = getExperimentById(experimentId);
  if (!experiment) {
    return NextResponse.json({ error: "Тәжірибе табылмады" }, { status: 404 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      analysis: buildFallbackAnalysis(experiment, entry),
      warning:
        "GEMINI_API_KEY орнатылмаған, сондықтан жергілікті (демо) талдау көрсетілді.",
    });
  }

  try {
    const analysis = await callGeminiAnalysis(experiment, entry, apiKey);
    return NextResponse.json({ source: "gemini", analysis });
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return NextResponse.json({
      source: "fallback",
      analysis: buildFallbackAnalysis(experiment, entry),
      warning: "Gemini API қолжетімсіз болды, жергілікті талдау көрсетілді.",
    });
  }
}
