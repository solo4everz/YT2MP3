"use client";

import React, { useState } from "react";
import { Card, Text, Group, Badge, Button } from "@mantine/core";
import { GraduationCap, Link2, Sliders, Scissors, Download, ArrowRight, ArrowLeft } from "lucide-react";

export function TutorialSpotlight() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Langkah 1: Tampal YouTube Link Atau Cari Tajuk Lagu",
      icon: Link2,
      desc: "Salin pautan video dari YouTube (contoh: https://youtu.be/...) dan tampalkan pada ruangan carian. Anda juga boleh menaip terus nama artis atau tajuk lagu untuk mencari secara terus.",
      tip: "Petua: Gunakan butang 'Tampal' untuk menampal pautan dengan 1-klik pantas!",
    },
    {
      title: "Langkah 2: Pilih Kualiti Bitrate & Format Audio",
      icon: Sliders,
      desc: "Pilih format audio kegemaran anda (MP3, M4A, FLAC, atau WAV). Untuk kualiti bunyi terbaik, pilih 320 kbps (Disyorkan).",
      tip: "Petua: Pilihan 'Sertakan Gambar Cover Art' akan menyuntik poster video terus ke dalam fail MP3 anda!",
    },
    {
      title: "Langkah 3: Trim / Potong Audio (Jika Perlu)",
      icon: Scissors,
      desc: "Aktifkan suis 'Potong / Trim Audio' jika anda hanya mahu memuat turun sebahagian lagu atau mencipta nada dering (ringtone). Laraskan julat masa mula dan masa tamat.",
      tip: "Petua: Sesuai untuk memotong bahagian intro atau audio diam di awal lagu.",
    },
    {
      title: "Langkah 4: Tekan Tukar & Muat Turun MP3",
      icon: Download,
      desc: "Tekan butang utama 'TUKAR & MUAT TURUN MP3 NOW!'. Enjin server akan memproses audio dan fail akan terus dimuat turun ke komputer atau telefon anda.",
      tip: "Petua: Sejarah lagu yang telah siap akan disimpan di ruangan 'Koleksi Sejarah' untuk akses semula.",
    },
  ];

  return (
    <Card className="pop-card p-6 rounded-3xl bg-[#17122e] border-4 border-purple-600/50 max-w-4xl mx-auto my-6">
      <Group justify="space-between" mb="lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border-2 border-purple-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <Text fw={900} size="xl" className="text-white">
              TUTORIAL INTERAKTIF & PANDUAN PENGGUNA
            </Text>
            <Text size="xs" className="text-slate-400 font-medium">
              4 Langkah Mudah Menukar YouTube ke Audio HD MP3
            </Text>
          </div>
        </div>

        <Badge color="yellow" size="lg" className="manga-sticker text-black">
          PANDUAN SPOTLIGHT
        </Badge>
      </Group>

      {/* Interactive Stepper */}
      <div className="bg-[#0d091a] p-5 rounded-2xl border-2 border-purple-900 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-purple-900/60 border-purple-400 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    : "bg-black/40 border-white/10 text-slate-400 hover:border-purple-500/40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    isActive ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-xs font-bold truncate">{s.title.split(":")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Step Spotlight Card */}
        <div className="p-5 rounded-xl bg-[#17122e] border-2 border-purple-500/40">
          <div className="flex items-center gap-3 mb-3">
            {React.createElement(steps[activeStep].icon, {
              className: "w-7 h-7 text-purple-400",
            })}
            <Text fw={900} size="lg" className="text-white">
              {steps[activeStep].title}
            </Text>
          </div>

          <Text size="sm" className="text-slate-200 font-medium leading-relaxed mb-4">
            {steps[activeStep].desc}
          </Text>

          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-lg text-purple-200 text-xs font-semibold">
            💡 {steps[activeStep].tip}
          </div>
        </div>

        {/* Stepper Nav Buttons */}
        <div className="flex justify-between items-center mt-4">
          <Button
            size="xs"
            variant="outline"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            leftSection={<ArrowLeft className="w-4 h-4" />}
            className="border-purple-500 text-purple-300 hover:bg-purple-950"
          >
            Sebelumnya
          </Button>

          <Text size="xs" fw={700} className="text-slate-400">
            Langkah {activeStep + 1} daripada {steps.length}
          </Text>

          <Button
            size="xs"
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            rightSection={<ArrowRight className="w-4 h-4" />}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
          >
            Seterusnya
          </Button>
        </div>
      </div>
    </Card>
  );
}
