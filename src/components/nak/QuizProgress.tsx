"use client";

import { usePathname } from "next/navigation";
import { QUIZ_STEP_SLUGS } from "@/lib/quiz/schema";
import { isQuizSlug, slugIndex, STEP_LABEL_MS } from "@/lib/quiz/steps";
import { Progress } from "@/components/ui/progress";

export function QuizProgress() {
  const pathname = usePathname();
  const segment = pathname?.split("/").pop() ?? "";
  const slug = isQuizSlug(segment) ? segment : QUIZ_STEP_SLUGS[0];
  const current = slugIndex(slug);
  const total = QUIZ_STEP_SLUGS.length;
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-medium">
          Langkah {current + 1} / {total}
        </span>
        <span>{STEP_LABEL_MS[slug as keyof typeof STEP_LABEL_MS]}</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
