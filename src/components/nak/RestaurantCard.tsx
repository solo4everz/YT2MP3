import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CadanganRestaurant } from "@/lib/quiz/schema";
import { MapPin } from "lucide-react";
import Link from "next/link";

function mapsUrl(place: CadanganRestaurant): string | undefined {
  if (place.googleMapsUri) return place.googleMapsUri;
  const q = [place.displayName, place.formattedAddress]
    .filter(Boolean)
    .join(", ");
  if (!q.trim()) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function RestaurantCard({
  restaurant,
}: {
  restaurant: CadanganRestaurant;
}) {
  const maps = mapsUrl(restaurant);

  return (
    <Card className="overflow-hidden border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug">{restaurant.displayName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          {typeof restaurant.rating === "number" ? (
            <Badge variant="secondary">{restaurant.rating.toFixed(1)} ★</Badge>
          ) : (
            <Badge variant="outline">Tiada rating</Badge>
          )}
          {typeof restaurant.userRatingCount === "number" ? (
            <span className="text-xs">{restaurant.userRatingCount} ulasan</span>
          ) : null}
        </div>
        {restaurant.formattedAddress ? (
          <p className="text-xs leading-relaxed">{restaurant.formattedAddress}</p>
        ) : null}
      </CardContent>
      <CardFooter>
        {maps ? (
          <Link
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <MapPin className="size-4" />
            Buka di Maps
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "pointer-events-none opacity-50",
            )}
          >
            Tiada pautan
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
