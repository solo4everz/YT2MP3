export type Question = {
  id: string;
  slug: string;
  title_ms: string;
  subtitle_ms: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type QuestionOption = {
  id: string;
  question_id: string;
  label_ms: string;
  value_key: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
};

export type FoodMenu = {
  id: string;
  name_ms: string;
  description_ms: string | null;
  places_query: string;
  places_types: string[] | null;
  sort_order: number | null;
  is_active: boolean;
  created_at: string;
};
