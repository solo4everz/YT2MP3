"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  STORAGE_HASIL_KEY,
  type CadanganResponse,
} from "@/lib/quiz/schema";
import { RestaurantCard } from "@/components/nak/RestaurantCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function parseHasil(raw: string): CadanganResponse | null {
  try {
    const x = JSON.parse(raw) as unknown;
    if (!x || typeof x !== "object") return null;
    const r = x as CadanganResponse;
    if (
      typeof r.reason_ms !== "string" ||
      typeof r.food_name_ms !== "string" ||
      typeof r.places_query !== "string" ||
      !Array.isArray(r.restaurants)
    )
      return null;
    return r;
  } catch {
    return null;
  }
}

export default function HasilPage() {
  const router = useRouter();
  const [hasil, setHasil] = useState<CadanganResponse | null | undefined>();

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = sessionStorage.getItem(STORAGE_HASIL_KEY);
        if (!raw) {
          setHasil(null);
          return;
        }
        setHasil(parseHasil(raw));
      } catch {
        setHasil(null);
      }
    });
  }, []);

  const redo = () => {
    sessionStorage.removeItem(STORAGE_HASIL_KEY);
    router.push("/quiz/weather");
  };

  if (hasil === undefined) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="text-center text-sm text-muted-foreground">Memuat…</p>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Tiada keputusan</CardTitle>
            <CardDescription>
              Laman ini memerlukan data daripada kuiz. Sila jalankan kuiz dahulu atau
              jika anda menutup tab sebelum lokasi dizinkan — cuba lagi.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Link href="/quiz/weather" className={buttonVariants()}>
              Mula kuiz
            </Link>
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Laman utama
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8 pb-16">
      <Card>
        <CardHeader className="space-y-2">
          <CardDescription>Jenis cadangan anda</CardDescription>
          <CardTitle className="text-2xl">{hasil.food_name_ms}</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {hasil.reason_ms}
          </p>
          {hasil.food_description_ms ? (
            <p className="text-sm leading-relaxed">{hasil.food_description_ms}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Carian: <span className="font-medium">{hasil.places_query}</span>
          </p>
        </CardHeader>
      </Card>

      <section className="space-y-4">
        <h2 className="font-semibold text-lg">Restoran berdekatan</h2>
        {hasil.restaurants.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Tiada kedai dikenal pasti bagi tempat anda. Cuba ulang kuiz di lokasi lain
              atau semak kata kunci cadangan anda.
            </CardContent>
          </Card>
        ) : (
          <ul className="flex flex-col gap-4">
            {hasil.restaurants.map((restaurant, i) => (
              <li key={restaurant.placeId || `${restaurant.displayName}-${i}`}>
                <RestaurantCard restaurant={restaurant} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={redo}>
          Ulang kuiz
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Laman utama
        </Link>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Maklumat tempat datang daripada Geoapify (sumber terbuka). Semak sebelum anda
        pergi — ia mungkin sudah lama atau tidak lagi wujud ketika anda lawat.
      </p>
    </div>
  );
}
