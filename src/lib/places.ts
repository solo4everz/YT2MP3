import type { CadanganRestaurant } from "@/lib/quiz/schema";

const PLACES_URL = "https://api.geoapify.com/v2/places";

type GeoapifyProps = {
  name?: string;
  formatted?: string;
  place_id?: string;
  lat?: number;
  lon?: number;
  distance?: number;
};

type GeoapifyFeature = {
  type?: string;
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: GeoapifyProps;
  id?: string | number;
};

type GeoapifyResponse = {
  features?: GeoapifyFeature[];
};

function mapsUriFromPlace(
  lon: number | undefined,
  lat: number | undefined,
  name: string,
  formatted: string | undefined,
): string | undefined {
  if (typeof lat === "number" && typeof lon === "number") {
    return `https://www.google.com/maps?q=${lat},${lon}`;
  }
  const q = [name, formatted].filter(Boolean).join(", ");
  if (!q.trim()) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

async function fetchGeoapifyFeatures(
  params: URLSearchParams,
): Promise<GeoapifyFeature[]> {
  const res = await fetch(`${PLACES_URL}?${params.toString()}`);
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Geoapify Places gagal (${res.status}): ${errText.slice(0, 280)}`,
    );
  }
  const data = (await res.json()) as GeoapifyResponse;
  return data.features ?? [];
}

export async function searchNearbyRestaurants(
  textQuery: string,
  latitude: number,
  longitude: number,
): Promise<CadanganRestaurant[]> {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error("GEOAPIFY_API_KEY tidak ditetapkan");
  }

  const radiusM = Number(process.env.GEOAPIFY_SEARCH_RADIUS_M ?? 2500);
  const limit = Math.min(
    20,
    Math.max(1, Number(process.env.GEOAPIFY_PLACES_LIMIT ?? 20)),
  );

  const categories =
    process.env.GEOAPIFY_PLACE_CATEGORIES ??
    "catering.restaurant,catering.fast_food,catering.cafe";

  const nameHint = textQuery
    .replace(/\s+restaurant\s*$/i, "")
    .trim()
    .slice(0, 100);

  const baseParams = new URLSearchParams({
    apiKey,
    categories,
    filter: `circle:${longitude},${latitude},${radiusM}`,
    bias: `proximity:${longitude},${latitude}`,
    limit: String(limit),
    lang: "ms",
  });

  let features: GeoapifyFeature[] = [];
  if (nameHint.length >= 2) {
    const withName = new URLSearchParams(baseParams);
    withName.set("name", nameHint);
    features = await fetchGeoapifyFeatures(withName);
  }
  if (features.length === 0) {
    features = await fetchGeoapifyFeatures(new URLSearchParams(baseParams));
  }

  return features
    .map((f, index) => {
      const prop = f.properties ?? {};
      const coords = f.geometry?.coordinates;
      const lon = prop.lon ?? coords?.[0];
      const lat = prop.lat ?? coords?.[1];
      const displayName = String(
        prop.name?.trim() || prop.formatted?.trim() || "Tempat",
      );
      const placeId = String(
        prop.place_id ??
          (f.id != null ? String(f.id) : `geoapify-${index}-${displayName}`),
      );

      return {
        placeId,
        displayName,
        formattedAddress: prop.formatted,
        googleMapsUri: mapsUriFromPlace(lon, lat, displayName, prop.formatted),
      } satisfies CadanganRestaurant;
    })
    .filter((r) => r.displayName.length > 0)
    .slice(0, 10);
}
