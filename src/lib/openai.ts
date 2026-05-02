import OpenAI from "openai";
import { z } from "zod";
import type { FoodMenu } from "@/types/database";
import type { QuizAnswers } from "@/lib/quiz/schema";

const aiPickSchema = z.object({
  food_menu_id: z.string().uuid(),
  reason_ms: z.string().min(1),
});

export type AiPickResult = z.infer<typeof aiPickSchema>;

export function pickFoodWithOpenAi(
  answers: QuizAnswers,
  menu: Pick<FoodMenu, "id" | "name_ms" | "places_query">[],
): Promise<AiPickResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("OPENAI_API_KEY tidak ditetapkan"));
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const openai = new OpenAI({ apiKey });

  const allowed = menu.map((m) => ({
    id: m.id,
    name_ms: m.name_ms,
    places_query: m.places_query,
  }));

  const system = [
    "You choose exactly ONE dish from allowed_foods.",
    'Reply with JSON object only with keys food_menu_id (UUID string) and reason_ms (Bahasa Melayu, 1–3 short sentences explaining the pick from mood quiz).',
    "food_menu_id must match one allowed id.",
  ].join(" ");

  const user = JSON.stringify({
    quiz: answers,
    allowed_foods: allowed,
    instruction:
      "Berdasarkan cuaca/teman/nostalgia/selera, pilih satu id makanan yang paling sesuai dan tulis reason_ms dalam Bahasa Melayu.",
  });

  return openai.chat.completions
    .create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    })
    .then((completion) => {
      const raw = completion.choices[0]?.message?.content;
      if (!raw) throw new Error("Jawaban OpenAI kosong");
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error("OpenAI kembalikan JSON tidak sah");
      }
      const out = aiPickSchema.safeParse(parsed);
      if (!out.success) throw new Error("Format cadangan AI tidak sah");
      if (!allowed.some((a) => a.id === out.data.food_menu_id)) {
        throw new Error("ID menu oleh AI tidak dibenarkan");
      }
      return out.data;
    });
}
