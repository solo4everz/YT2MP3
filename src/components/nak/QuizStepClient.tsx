"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuizStepSlug } from "@/lib/quiz/schema";
import { quizAnswersSchema, STORAGE_HASIL_KEY } from "@/lib/quiz/schema";
import { nextSlug, prevSlug, QUIZ_STEP_SLUGS } from "@/lib/quiz/steps";
import { OptionIcon } from "@/components/nak/option-icon";
import type { Question, QuestionOption } from "@/types/database";
import { useQuiz } from "@/components/nak/quiz-context";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type Props = {
  question: Pick<Question, "id" | "slug" | "title_ms" | "subtitle_ms">;
  options: Pick<
    QuestionOption,
    "id" | "label_ms" | "value_key" | "icon" | "sort_order"
  >[];
};

function readPosition(timeoutMs = 15000): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Pelayar tidak menyokong lokasi"));
      return;
    }
    const t = window.setTimeout(
      () => reject(new Error("Tamat masa lokasi")),
      timeoutMs,
    );
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(t);
        resolve(pos);
      },
      (err) => {
        window.clearTimeout(t);
        reject(err);
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: timeoutMs },
    );
  });
}

export function QuizStepClient({ question, options }: Props) {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();
  const slug = question.slug as QuizStepSlug;
  const chosen = answers[slug] ?? "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLast = nextSlug(slug) === null;

  const goNext = () => {
    if (!chosen) return;
    setError(null);
    if (!isLast) {
      const n = nextSlug(slug);
      if (n) router.push(`/quiz/${n}`);
      return;
    }
    submitFinish();
  };

  const submitFinish = async () => {
    const full = {
      weather: answers.weather ?? "",
      companion: answers.companion ?? "",
      nostalgia: answers.nostalgia ?? "",
      cravings: answers.cravings ?? "",
    };
    const validated = quizAnswersSchema.safeParse(full);
    if (!validated.success) {
      setError("Sila lengkapkan semua langkah.");
      router.push(`/quiz/${QUIZ_STEP_SLUGS[0]}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const position = await readPosition();
      const res = await fetch("/api/cadangan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: validated.data,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Gagal mendapat cadangan.",
        );
      }

      sessionStorage.setItem(STORAGE_HASIL_KEY, JSON.stringify(data));
      router.push("/hasil");
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Ralat tidak diketahui. Cuba lagi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    const p = prevSlug(slug);
    if (p) router.push(`/quiz/${p}`);
    else router.push("/");
  };

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle>{question.title_ms}</CardTitle>
        {question.subtitle_ms ? (
          <CardDescription>{question.subtitle_ms}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={chosen}
          onValueChange={(v) => setAnswer(slug, v)}
          aria-label={question.title_ms}
          className="gap-3"
        >
          {options.map((o) => (
            <div key={o.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/40">
              <RadioGroupItem
                value={o.value_key}
                id={o.id}
                className="mt-1"
              />
              <Label htmlFor={o.id} className="flex cursor-pointer gap-3">
                <OptionIcon icon={o.icon} className="mt-0.5 size-5 shrink-0" />
                <span className="text-sm leading-tight">{o.label_ms}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="ghost" onClick={goBack}>
          <ArrowLeft className="size-4" />
          Kembali
        </Button>
        <div className="flex gap-2">
          {submitting ? (
            <span
              className={cn(
                buttonVariants({ variant: "outline" }),
                "pointer-events-none opacity-50",
              )}
            >
              Batal
            </span>
          ) : (
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Batal
            </Link>
          )}
          <Button
            type="button"
            onClick={goNext}
            disabled={!chosen || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengira…
              </>
            ) : isLast ? (
              <>
                Lihat cadangan
                <ArrowRight className="size-4" />
              </>
            ) : (
              <>
                Seterusnya
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
