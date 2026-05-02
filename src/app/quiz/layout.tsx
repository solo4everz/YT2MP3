import { QuizProvider } from "@/components/nak/quiz-context";
import { QuizProgress } from "@/components/nak/QuizProgress";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuizProvider>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-8 pb-16">
        <QuizProgress />
        {children}
      </div>
    </QuizProvider>
  );
}
