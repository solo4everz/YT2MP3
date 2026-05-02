import type { CadanganRestaurant } from "@/lib/quiz/schema";

const SEARCH_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
};

type SearchTextResponse = {
  places?: GooglePlace[];
};

export async function searchNearbyRestaurants(
  textQuery: string,
  latitude: number,
  longitude: number,
): Promise<CadanganRestaurant[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY tidak ditetapkan");
  }

  const radiusM = Number(process.env.GOOGLE_PLACES_DEFAULT_RADIUS_M ?? 2500);

  const body = {
    textQuery,
    maxResultCount: 10,
    rankPreference: "RELEVANCE",
    locationBias: {
      circle: {
        center: { latitude, longitude },
        radius: radiusM,
      },
    },
    languageCode: "ms",
    regionCode: "MY",
  };

  const fieldMask =
    "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri";

  const res = await fetch(SEARCH_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Places API gagal (${res.status}): ${errText.slice(0, 280)}`,
    );
  }

  const data = (await res.json()) as SearchTextResponse;
  const raw = data.places ?? [];

  const minRating = 3.9;
  const minReviews = 10;

  const mapped: CadanganRestaurant[] = raw
    .filter(
      (p) =>
        p.id &&
        p.displayName?.text &&
        (p.rating == null ||
          (p.rating >= minRating &&
            (p.userRatingCount ?? 0) >= minReviews)),
    )
    .map((p) => ({
      placeId: String(p.id),
      displayName: String(p.displayName?.text),
      formattedAddress: p.formattedAddress,
      rating: p.rating,
      userRatingCount: p.userRatingCount,
      googleMapsUri: p.googleMapsUri,
    }));

  if (mapped.length > 0) {
    mapped.sort((a, b) => {
      const ra = (a.rating ?? 0) * Math.log1p(a.userRatingCount ?? 1);
      const rb = (b.rating ?? 0) * Math.log1p(b.userRatingCount ?? 1);
      return rb - ra;
    });
    return mapped;
  }

  // Longgar had jika tiada mencukupi
  return raw
    .filter((p) => p.id && p.displayName?.text)
    .slice(0, 8)
    .map((p) => ({
      placeId: String(p.id),
      displayName: String(p.displayName?.text),
      formattedAddress: p.formattedAddress,
      rating: p.rating,
      userRatingCount: p.userRatingCount,
      googleMapsUri: p.googleMapsUri,
    }));
}
