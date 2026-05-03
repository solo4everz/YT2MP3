import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";

export function HeroLanding() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-14">
      <div className="text-center space-y-4">
        <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <UtensilsCrossed className="size-7" aria-hidden />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          NakMakanApa?
        </h1>
        <p className="text-muted-foreground text-balance leading-relaxed">
          Ambil kuiz mood ringkas — selepas itu kami mencadangkan jenis makanan dan
          restoran berdekatan melalui Geoapify (data tempat).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mula daripada sini</CardTitle>
          <CardDescription>Cuaca, teman, nostalgia dan selera — dalam masa seminit.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link
            href="/quiz/weather"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Mula kuiz
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cadangan dijana oleh AI berdasarkan jawapan anda. Semak masa operasi dan
            harga di aplikasi lain sebelum pergi — kami tidak menjamin kedai masih ada
            stok atau buka masa ditunjuk.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
