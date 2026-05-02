import { QUIZ_STEP_SLUGS, type QuizStepSlug } from "./schema";

export { QUIZ_STEP_SLUGS, type QuizStepSlug };

export function isQuizSlug(s: string): s is QuizStepSlug {
  return (QUIZ_STEP_SLUGS as readonly string[]).includes(s);
}

export function slugIndex(slug: QuizStepSlug): number {
  return QUIZ_STEP_SLUGS.indexOf(slug);
}

export function nextSlug(slug: QuizStepSlug): QuizStepSlug | null {
  const i = slugIndex(slug);
  if (i < 0 || i >= QUIZ_STEP_SLUGS.length - 1) return null;
  return QUIZ_STEP_SLUGS[i + 1]!;
}

export function prevSlug(slug: QuizStepSlug): QuizStepSlug | null {
  const i = slugIndex(slug);
  if (i <= 0) return null;
  return QUIZ_STEP_SLUGS[i - 1]!;
}

/** Bahasa Melayu — progress rail labels only */
export const STEP_LABEL_MS: Record<QuizStepSlug, string> = {
  weather: "Cuaca",
  companion: "Teman",
  nostalgia: "Nostalgia",
  cravings: "Selera",
};
