"use client";

import React from "react";
import { Container, SimpleGrid, Card, Text, Badge } from "@mantine/core";
import { Zap, Music2, Scissors, ShieldCheck, Sparkles, Radio } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      color: "#c084fc",
      title: "Audio HD 320 KBPS",
      desc: "Menyokong pemprosesan kualiti audio tertinggi 320 kbps tanpa kehilangan frekuensi asal video.",
    },
    {
      icon: Scissors,
      color: "#facc15",
      title: "Audio Trimmer & Ringtone Maker",
      desc: "Potong bahagian intro/outro atau buat ringtone telefon dalam julat saat yang tepat.",
    },
    {
      icon: Music2,
      color: "#38bdf8",
      title: "Gambar Cover Art & ID3 Tag",
      desc: "Poster thumbnail YouTube dan tajuk disematkan terus ke dalam fail MP3 secara automatik.",
    },
    {
      icon: Radio,
      color: "#f472b6",
      title: "Pelbagai Format Audio",
      desc: "Pilih antara format MP3, M4A, FLAC, atau WAV mengikut keperluan peranti audio anda.",
    },
    {
      icon: Sparkles,
      color: "#38bdf8",
      title: "Carian YouTube terbina",
      desc: "Taip nama artis atau lagu tanpa perlu buka YouTube terlebih dahulu. Kami cari untuk anda!",
    },
    {
      icon: ShieldCheck,
      color: "#facc15",
      title: "100% Percuma & Selamat",
      desc: "Tiada iklan mengganggu, tiada malware, dan tiada pendaftaran akaun diperlukan.",
    },
  ];

  return (
    <section className="py-10">
      <Container size="xl">
        <div className="text-center mb-8">
          <Badge color="grape" size="xl" className="manga-sticker text-white mb-2">
            KEISTIMEWAAN STUDIO
          </Badge>
          <Text fw={900} size="xl" className="text-3xl sm:text-4xl text-white tracking-tight">
            Mengapa Pilih <span className="text-purple-400">YT2MP3 Studio</span>?
          </Text>
          <Text size="sm" c="dimmed" className="mt-2 text-slate-300 font-medium max-w-xl mx-auto">
            Dikuasai oleh enjin pemprosesan fail pantas tanpa had kuota download.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card
                key={i}
                className="pop-card p-6 rounded-3xl bg-[#17122e] border-2 border-purple-900/60"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0d091a] border border-purple-500/30 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <Text fw={900} size="lg" className="text-white mb-2">
                  {f.title}
                </Text>
                <Text size="sm" c="dimmed" className="text-slate-300 font-medium leading-relaxed">
                  {f.desc}
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    </section>
  );
}
