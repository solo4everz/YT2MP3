import { redirect } from "next/navigation";
import { QUIZ_STEP_SLUGS } from "@/lib/quiz/schema";

export default function QuizPage() {
  redirect(`/quiz/${QUIZ_STEP_SLUGS[0]}`);
}
