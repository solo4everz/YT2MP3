import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cadanganBodySchema } from "@/lib/quiz/schema";
import { pickFoodWithOpenAi } from "@/lib/openai";
import { searchNearbyRestaurants } from "@/lib/places";
import type { FoodMenu } from "@/types/database";

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const parsed = cadanganBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Input tidak sah", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { answers, latitude, longitude } = parsed.data;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json(
      { error: "Konfigurasi Supabase tidak lengkap" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, anon);
  const { data: menuRows, error: menuError } = await supabase
    .from("food_menu")
    .select("id, name_ms, description_ms, places_query")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (menuError || !menuRows?.length) {
    return NextResponse.json(
      { error: "Gagal memuat menu makanan", detail: menuError?.message },
      { status: 500 },
    );
  }

  const menu = menuRows as Pick<
    FoodMenu,
    "id" | "name_ms" | "description_ms" | "places_query"
  >[];

  let pick: { food_menu_id: string; reason_ms: string };
  try {
    pick = await pickFoodWithOpenAi(answers, menu);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ralat OpenAI";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const chosen = menu.find((m) => m.id === pick.food_menu_id);
  if (!chosen) {
    return NextResponse.json(
      { error: "Menu terpilih tidak dijumpai" },
      { status: 500 },
    );
  }

  let restaurants;
  try {
    restaurants = await searchNearbyRestaurants(
      chosen.places_query,
      latitude,
      longitude,
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ralat Google Places";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  return NextResponse.json({
    food_menu_id: chosen.id,
    food_name_ms: chosen.name_ms,
    food_description_ms: chosen.description_ms,
    places_query: chosen.places_query,
    reason_ms: pick.reason_ms,
    restaurants,
  });
}
