import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { QuizAnswers } from "@/lib/quiz/schema";
import type { FoodMenu } from "@/types/database";

const aiPickSchema = z.object({
  food_menu_id: z.string().uuid(),
  reason_ms: z.string().min(1),
});

export type AiPickResult = z.infer<typeof aiPickSchema>;

export async function pickFoodWithGemini(
  answers: QuizAnswers,
  menu: Pick<FoodMenu, "id" | "name_ms" | "places_query">[],
): Promise<AiPickResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak ditetapkan");
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const ai = new GoogleGenAI({ apiKey });

  const allowed = menu.map((m) => ({
    id: m.id,
    name_ms: m.name_ms,
    places_query: m.places_query,
  }));

  const prompt = [
    "You are a food recommendation assistant.",
    "Choose exactly ONE item from allowed_foods.",
    "Return valid JSON only with fields: food_menu_id (UUID string), reason_ms (Bahasa Melayu, 1-3 short sentences).",
    "food_menu_id must match one id from allowed_foods.",
    "",
    JSON.stringify({
      quiz: answers,
      allowed_foods: allowed,
      instruction:
        "Berdasarkan cuaca/teman/nostalgia/selera, pilih satu id makanan paling sesuai dan reason_ms dalam Bahasa Melayu.",
    }),
  ].join("\n");

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const raw = typeof response.text === "string" ? response.text : "";
  if (!raw) {
    throw new Error("Jawapan Gemini kosong");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Gemini kembalikan JSON tidak sah");
  }

  const out = aiPickSchema.safeParse(parsed);
  if (!out.success) {
    throw new Error("Format cadangan Gemini tidak sah");
  }

  if (!allowed.some((a) => a.id === out.data.food_menu_id)) {
    throw new Error("ID menu oleh Gemini tidak dibenarkan");
  }

  return out.data;
}
