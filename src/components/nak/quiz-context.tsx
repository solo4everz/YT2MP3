"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { QuizAnswers, QuizStepSlug } from "@/lib/quiz/schema";

type QuizContextValue = {
  answers: Partial<QuizAnswers>;
  setAnswer: (slug: QuizStepSlug, valueKey: string) => void;
  reset: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const setAnswer = useCallback((slug: QuizStepSlug, valueKey: string) => {
    setAnswers((prev) => ({ ...prev, [slug]: valueKey }));
  }, []);

  const reset = useCallback(() => setAnswers({}), []);

  const value = useMemo(
    () => ({ answers, setAnswer, reset }),
    [answers, reset, setAnswer],
  );

  return (
    <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz mesti digunakan di dalam QuizProvider");
  }
  return ctx;
}
