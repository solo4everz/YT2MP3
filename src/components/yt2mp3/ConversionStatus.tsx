"use client";

import React from "react";
import { Card, Text, Progress, Group, Badge } from "@mantine/core";
import { Loader2, CheckCircle2 } from "lucide-react";

interface ConversionStatusProps {
  status: "idle" | "fetching" | "encoding" | "tagging" | "completed" | "error";
  progress: number;
  errorMessage?: string;
  onDownloadAgain?: () => void;
}

export function ConversionStatus({
  status,
  progress,
  errorMessage,
}: ConversionStatusProps) {
  if (status === "idle") return null;

  const getStatusText = () => {
    switch (status) {
      case "fetching":
        return "1. Memuat Turun Stream Audio dari YouTube...";
      case "encoding":
        return "2. Pengekodan Bitrate & Format Audio (FFmpeg)...";
      case "tagging":
        return "3. Menyusun Metadata & Cover Art (ID3 Tags)...";
      case "completed":
        return "4. Proses Selesai! Fail audio sedia dimuat turun 🎉";
      case "error":
        return "Terjadi Ralat semasa Proses Audio ❌";
      default:
        return "Memproses...";
    }
  };

  return (
    <Card className="pop-card p-5 rounded-3xl bg-[#17122e] border-4 border-purple-900/60 max-w-4xl mx-auto my-6">
      <Group justify="space-between" mb="xs">
        <Badge
          color={status === "error" ? "red" : status === "completed" ? "cyan" : "grape"}
          size="lg"
          className="manga-sticker text-white"
        >
          {status === "completed" ? "SELESAI!" : status === "error" ? "RALAT" : "PROSES CONVERT"}
        </Badge>
        <Text fw={900} size="sm" className="text-yellow-400">
          {progress}%
        </Text>
      </Group>

      <Text fw={800} size="lg" className="text-white mb-3 flex items-center gap-2">
        {status !== "completed" && status !== "error" && (
          <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
        )}
        {status === "completed" && <CheckCircle2 className="w-6 h-6 text-cyan-400" />}
        {getStatusText()}
      </Text>

      {/* Progress Bar */}
      <Progress
        value={progress}
        animated={status !== "completed" && status !== "error"}
        color={status === "error" ? "red" : status === "completed" ? "cyan" : "grape"}
        size="xl"
        radius="xl"
        styles={{
          root: {
            backgroundColor: "#0d091a",
            border: "2px solid #3b0764",
          },
          section: {
            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.3)",
          },
        }}
      />

      {status === "error" && (
        <div className="mt-4 p-3 bg-red-950/80 border-2 border-red-500 rounded-xl text-red-200 text-sm font-semibold">
          {errorMessage || "Gagal memproses audio. Sila pastikan link sah dan cuba lagi."}
        </div>
      )}
    </Card>
  );
}
