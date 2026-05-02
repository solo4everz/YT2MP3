import { z } from "zod";

export const QUIZ_STEP_SLUGS = [
  "weather",
  "companion",
  "nostalgia",
  "cravings",
] as const;

export type QuizStepSlug = (typeof QUIZ_STEP_SLUGS)[number];

export const quizAnswersSchema = z.object({
  weather: z.string().min(1),
  companion: z.string().min(1),
  nostalgia: z.string().min(1),
  cravings: z.string().min(1),
});

export type QuizAnswers = z.infer<typeof quizAnswersSchema>;

export const cadanganBodySchema = z.object({
  answers: quizAnswersSchema,
  latitude: z.number().finite(),
  longitude: z.number().finite(),
});

export type CadanganBody = z.infer<typeof cadanganBodySchema>;

export const STORAGE_HASIL_KEY = "nakmakanapa:hasil" as const;

export type CadanganRestaurant = {
  placeId: string;
  displayName: string;
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

export type CadanganResponse = {
  food_menu_id: string;
  food_name_ms: string;
  food_description_ms: string | null;
  places_query: string;
  reason_ms: string;
  restaurants: CadanganRestaurant[];
};
