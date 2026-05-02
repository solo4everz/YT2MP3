import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuizStepClient } from "@/components/nak/QuizStepClient";
import { createClient } from "@/lib/supabase/server";
import { isQuizSlug } from "@/lib/quiz/steps";
import type { Question, QuestionOption } from "@/types/database";

function SupabaseMisconfigured() {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle>Supabase belum dikonfigurasi</CardTitle>
        <CardDescription>
          Tambahkan <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dalam{" "}
          <code className="text-xs">.env.local</code>, kemudian mulakan semula pelayar
          pembangunan.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Kembali ke laman utama
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function QuizStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;

  if (!isQuizSlug(step)) {
    notFound();
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return <SupabaseMisconfigured />;
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return <SupabaseMisconfigured />;
  }

  const { data: row, error: qErr } = await supabase
    .from("questions")
    .select("id, slug, title_ms, subtitle_ms")
    .eq("slug", step)
    .eq("is_active", true)
    .maybeSingle();

  if (qErr || !row) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gagal memuat soalan</CardTitle>
          <CardDescription>
            {qErr?.message ??
              `Tiada rekod bagi slug '${step}'. Pastikan anda telah menjalankan migrasi dan seed di Supabase.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Kembali ke laman utama
          </Link>
        </CardContent>
      </Card>
    );
  }

  const question = row as Pick<Question, "id" | "slug" | "title_ms" | "subtitle_ms">;

  const { data: opts, error: optErr } = await supabase
    .from("question_options")
    .select("id, label_ms, value_key, icon, sort_order")
    .eq("question_id", question.id)
    .order("sort_order");

  if (optErr || !opts?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tiada pilihan untuk soalan ini</CardTitle>
          <CardDescription>
            {optErr?.message ?? "Isi jadual `question_options` di Supabase semula seed."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Kembali ke laman utama
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <QuizStepClient
      question={question}
      options={opts as Pick<
        QuestionOption,
        "id" | "label_ms" | "value_key" | "icon" | "sort_order"
      >[]}
    />
  );
}
