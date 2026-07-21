"use client";

import React from "react";
import { Modal, Text, Image, Button, Group, Badge, ScrollArea } from "@mantine/core";
import { User, ArrowRight } from "lucide-react";
import { VideoMetadata } from "./VideoPreviewCard";

interface SearchResultsModalProps {
  opened: boolean;
  onClose: () => void;
  query: string;
  results: VideoMetadata[];
  onSelectVideo: (video: VideoMetadata) => void;
}

export function SearchResultsModal({
  opened,
  onClose,
  query,
  results,
  onSelectVideo,
}: SearchResultsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Badge color="grape" size="lg" className="manga-sticker text-white">
            KEPUTUSAN CARIAN YOUTUBE
          </Badge>
          <Text fw={900} size="md" className="text-white">
            &quot;{query}&quot;
          </Text>
        </Group>
      }
      size="xl"
      radius="lg"
      centered
      styles={{
        content: {
          backgroundColor: "#17122e",
          border: "3px solid #9333ea",
          boxShadow: "0 0 25px rgba(147,51,234,0.3)",
          borderRadius: "24px",
        },
        header: {
          backgroundColor: "#0d091a",
          borderBottom: "2px solid #9333ea",
          padding: "16px 24px",
        },
        body: {
          padding: "20px",
        },
      }}
    >
      <Text size="sm" c="dimmed" mb="md" className="text-slate-300 font-medium">
        Pilih salah satu video di bawah untuk memulakan proses convert MP3:
      </Text>

      <ScrollArea h={420} offsetScrollbars>
        <div className="flex flex-col gap-3">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectVideo(item);
                onClose();
              }}
              className="group p-3 rounded-2xl bg-[#0d091a] border border-white/10 hover:border-purple-500 transition-all cursor-pointer shadow-md hover:translate-x-1"
            >
              <div className="flex gap-4 items-center">
                {/* Thumbnail */}
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-purple-500/40 flex-shrink-0">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/90 text-yellow-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-black">
                    {item.durationFormatted}
                  </div>
                </div>

                {/* Title & Channel */}
                <div className="flex-1 min-w-0">
                  <Text fw={800} size="sm" className="text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed" className="text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                    <User className="w-3 h-3 text-purple-400" />
                    {item.channel}
                  </Text>
                </div>

                {/* Select button */}
                <Button
                  size="xs"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl px-3 flex-shrink-0"
                >
                  <span>Pilih</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Modal>
  );
}
