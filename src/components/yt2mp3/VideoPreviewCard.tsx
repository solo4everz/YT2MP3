"use client";

import React, { useState } from "react";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Select,
  RangeSlider,
  Switch,
  Button,
  Stack,
} from "@mantine/core";
import {
  Scissors,
  Download,
  Eye,
  Clock,
  User,
  Sparkles,
  Tag,
} from "lucide-react";

export interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  duration: number;
  durationFormatted: string;
  thumbnail: string;
  viewCount?: number;
  uploadDate?: string;
  url: string;
}

export interface ConvertOptions {
  quality: string;
  format: string;
  startTime: number;
  endTime: number;
  embedMetadata: boolean;
}

interface VideoPreviewCardProps {
  video: VideoMetadata;
  onConvert: (options: ConvertOptions) => void;
  isConverting: boolean;
}

export function VideoPreviewCard({ video, onConvert, isConverting }: VideoPreviewCardProps) {
  const [quality, setQuality] = useState("320k");
  const [format, setFormat] = useState("mp3");
  const [trimRange, setTrimRange] = useState<[number, number]>([0, video.duration || 300]);
  const [enableTrim, setEnableTrim] = useState(false);
  const [embedMetadata, setEmbedMetadata] = useState(true);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartConvert = () => {
    onConvert({
      quality,
      format,
      startTime: enableTrim ? trimRange[0] : 0,
      endTime: enableTrim ? trimRange[1] : 0,
      embedMetadata,
    });
  };

  return (
    <Card className="pop-card p-4 sm:p-6 rounded-3xl bg-[#17122e] border-4 border-purple-900/60 max-w-4xl mx-auto my-6">
      {/* Header Tag */}
      <div className="flex justify-between items-center mb-4">
        <Badge
          size="lg"
          variant="filled"
          color="grape"
          leftSection={<Sparkles className="w-4 h-4 text-white" />}
          className="manga-sticker text-white"
        >
          MAKLUMAT VIDEO DITERIMA!
        </Badge>

        <Group gap="xs">
          <Badge color="violet" variant="filled" className="manga-sticker text-white">
            ID: {video.id}
          </Badge>
        </Group>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Thumbnail & Details */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-md group">
            <Image
              src={video.thumbnail}
              alt={video.title}
              fallbackSrc="https://placehold.co/600x400/17122e/a855f7?text=Video+Thumbnail"
              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Duration Tag overlay */}
            <div className="absolute bottom-2 right-2 bg-black/90 text-yellow-400 text-xs font-black px-2 py-1 rounded-md border border-black flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-400" />
              {video.durationFormatted}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-[#0d091a] p-3 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-bold text-white truncate">{video.channel}</span>
            </div>
            {video.viewCount ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5 text-pink-400" />
                <span>{video.viewCount.toLocaleString()} tontonan</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column: Title, Selectors, Audio Trimmer & Action */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div>
            <Text fw={900} size="xl" className="text-white line-clamp-2 leading-snug">
              {video.title}
            </Text>
            <Text size="sm" c="dimmed" className="mt-1 font-medium text-slate-300">
              Saluran: <span className="text-purple-400 font-bold">{video.channel}</span>
            </Text>
          </div>

          {/* Format & Quality Selectors */}
          <div className="grid grid-cols-2 gap-3 bg-[#0d091a] p-3.5 rounded-2xl border border-white/10">
            <div>
              <Text size="xs" fw={800} c="dimmed" className="uppercase tracking-wider mb-1 text-slate-400">
                Format Audio
              </Text>
              <Select
                value={format}
                onChange={(val) => setFormat(val || "mp3")}
                data={[
                  { value: "mp3", label: "🎵 MP3 (Disyorkan)" },
                  { value: "m4a", label: "🎧 M4A / AAC" },
                  { value: "wav", label: "🎼 WAV (Uncompressed)" },
                  { value: "flac", label: "💎 FLAC (Lossless HD)" },
                ]}
                styles={{
                  input: {
                    backgroundColor: "#17122e",
                    borderColor: "#3b0764",
                    borderWidth: "2px",
                    color: "#ffffff",
                    fontWeight: "700",
                    borderRadius: "12px",
                  },
                }}
              />
            </div>

            <div>
              <Text size="xs" fw={800} c="dimmed" className="uppercase tracking-wider mb-1 text-slate-400">
                Kualiti Bitrate
              </Text>
              <Select
                value={quality}
                onChange={(val) => setQuality(val || "320k")}
                disabled={format === "wav" || format === "flac"}
                data={[
                  { value: "320k", label: "🔥 320 kbps (HD Quality)" },
                  { value: "256k", label: "⚡ 256 kbps (High)" },
                  { value: "192k", label: "👍 192 kbps (Medium)" },
                  { value: "128k", label: "📦 128 kbps (Standard)" },
                ]}
                styles={{
                  input: {
                    backgroundColor: "#17122e",
                    borderColor: "#3b0764",
                    borderWidth: "2px",
                    color: "#ffffff",
                    fontWeight: "700",
                    borderRadius: "12px",
                  },
                }}
              />
            </div>
          </div>

          {/* Toggle Audio Trimmer Controls */}
          <div className="bg-[#0d091a] p-3.5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-yellow-400" />
                <Text size="sm" fw={800} className="text-white">
                  Potong / Trim Audio (Ringtone / Klip)
                </Text>
              </div>
              <Switch
                checked={enableTrim}
                onChange={(e) => setEnableTrim(e.currentTarget.checked)}
                color="grape"
                size="md"
              />
            </div>

            {enableTrim && (
              <Stack gap="xs" pt="xs">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Masa Mula: <strong className="text-purple-400">{formatSeconds(trimRange[0])}</strong></span>
                  <span>Masa Tamat: <strong className="text-pink-400">{formatSeconds(trimRange[1])}</strong></span>
                </div>
                <RangeSlider
                  min={0}
                  max={video.duration || 300}
                  step={1}
                  value={trimRange}
                  onChange={setTrimRange}
                  label={formatSeconds}
                  color="grape"
                  size="lg"
                  styles={{
                    thumb: {
                      border: "2px solid #000",
                      backgroundColor: "#facc15",
                    },
                    bar: {
                      backgroundColor: "#a855f7",
                    },
                  }}
                />
              </Stack>
            )}
          </div>

          {/* Tag & Thumbnail options */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-400" />
              <Text size="xs" fw={700} className="text-slate-300">
                Sertakan Gambar Cover Art & ID3 Tag
              </Text>
            </div>
            <Switch
              checked={embedMetadata}
              onChange={(e) => setEmbedMetadata(e.currentTarget.checked)}
              color="violet"
              size="sm"
            />
          </div>

          {/* Main Convert & Download Button */}
          <Button
            size="xl"
            loading={isConverting}
            onClick={handleStartConvert}
            className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-16 rounded-2xl text-xl tracking-wide flex items-center justify-center gap-3 w-full"
          >
            <Download className="w-6 h-6 stroke-[3]" />
            <span>{isConverting ? "SEDANG MEMPROSES AUDIO..." : "CONVERT & DOWNLOAD MP3 NOW!"}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
