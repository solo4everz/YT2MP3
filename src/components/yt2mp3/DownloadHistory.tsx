"use client";

import React from "react";
import { Card, Text, Group, Badge, Button, Image } from "@mantine/core";
import { History, Trash2, Download } from "lucide-react";
import { VideoMetadata } from "./VideoPreviewCard";

export interface HistoryItem {
  id: string;
  video: VideoMetadata;
  format: string;
  quality: string;
  timestamp: string;
}

interface DownloadHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onReConvert: (item: HistoryItem) => void;
}

export function DownloadHistory({
  history,
  onClearHistory,
  onReConvert,
}: DownloadHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <Card className="pop-card p-6 rounded-3xl bg-[#17122e] border-4 border-purple-900/60 max-w-4xl mx-auto my-8">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500 flex items-center justify-center">
            <History className="w-5 h-5 text-purple-300 stroke-[2.5]" />
          </div>
          <Text fw={900} size="xl" className="text-white">
            KOLEKSI SEJARAH MUAT TURUN
          </Text>
          <Badge color="cyan" size="lg" className="manga-sticker text-black">
            {history.length} LAGU
          </Badge>
        </Group>

        <Button
          size="xs"
          variant="outline"
          onClick={onClearHistory}
          leftSection={<Trash2 className="w-3.5 h-3.5" />}
          className="bg-red-950/40 text-red-300 border-2 border-red-500 hover:bg-red-900/60 rounded-xl"
        >
          Padam Semua
        </Button>
      </Group>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {history.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="p-3 rounded-2xl bg-[#0d091a] border border-white/10 flex items-center gap-3 shadow-md hover:border-purple-500 transition-all"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-purple-500/40 flex-shrink-0">
              <Image
                src={item.video.thumbnail}
                alt={item.video.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <Text fw={800} size="sm" className="text-white truncate">
                {item.video.title}
              </Text>
              <Group gap="xs" mt={2}>
                <Badge size="xs" color="grape" className="manga-sticker text-white">
                  {item.format.toUpperCase()} {item.quality}
                </Badge>
                <Text size="xs" c="dimmed" className="text-slate-400 font-medium">
                  {item.timestamp}
                </Text>
              </Group>
            </div>

            <Button
              size="xs"
              onClick={() => onReConvert(item)}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-2.5 flex-shrink-0"
              title="Dapatkan Semula"
            >
              <Download className="w-4 h-4 text-white" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
