"use client";

import React, { useState } from "react";
import { Card, Text, Group, Badge, Button, SegmentedControl } from "@mantine/core";
import { Smartphone, Share, PlusSquare, MoreVertical, Download, CheckCircle2, Apple } from "lucide-react";
import { PurpleHeadphoneLogo } from "./PurpleHeadphoneLogo";

export function InstallTutorial() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  return (
    <Card className="pop-card p-6 rounded-3xl bg-[#17122e] border-4 border-black max-w-4xl mx-auto my-6">
      <Group justify="space-between" mb="lg">
        <div className="flex items-center gap-3">
          <PurpleHeadphoneLogo size={38} />
          <div>
            <Text fw={900} size="xl" className="text-white">
              PANDUAN MOUNT / INSTALL SKRIN UTAMA (PWA)
            </Text>
            <Text size="xs" className="text-slate-300 font-semibold">
              Gunakan YT2MP3 Studio seperti aplikasi iOS & Android tanpa muat turun App Store
            </Text>
          </div>
        </div>

        <Badge color="pink" size="lg" className="manga-sticker text-white">
          CARA INSTALL
        </Badge>
      </Group>

      {/* Platform Switcher */}
      <div className="mb-6 bg-[#0d091a] p-1.5 rounded-2xl border-2 border-black">
        <SegmentedControl
          value={platform}
          onChange={(value) => setPlatform(value as "ios" | "android")}
          data={[
            { label: "📱 Apple iOS (iPhone & iPad)", value: "ios" },
            { label: "🤖 Android (Google Chrome & Edge)", value: "android" },
          ]}
          fullWidth
          size="md"
          radius="xl"
          styles={{
            root: { backgroundColor: "transparent" },
            indicator: { backgroundColor: "#ff2a85", border: "2px solid #000" },
            label: { color: "#ffffff", fontWeight: 800 },
          }}
        />
      </div>

      {/* iOS Instructions */}
      {platform === "ios" && (
        <div className="space-y-4 bg-[#0d091a] p-5 rounded-2xl border-2 border-black">
          <Text fw={900} size="md" className="text-[#00f0ff] flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Langkah-Langkah Install Pada iPhone / iPad (Safari):
          </Text>

          <div className="space-y-3 text-sm text-slate-200">
            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#ff2a85] text-white font-extrabold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <Text fw={800} className="text-white">
                  Buka Pelayar Safari
                </Text>
                <Text size="xs" className="text-slate-300">
                  Pastikan anda membuka laman web <strong>YT2MP3 Studio</strong> menggunakan pelayar <strong>Safari</strong> di iPhone anda.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#00f0ff] text-black font-extrabold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <Text fw={800} className="text-white flex items-center gap-1.5">
                  Tekan Ikon Kongsi / Share <Share className="w-4 h-4 text-[#00f0ff]" />
                </Text>
                <Text size="xs" className="text-slate-300">
                  Tekan ikon <strong>Share</strong> (petak dengan anak panah ke atas) di bar bawah pelayar Safari.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#ffe600] text-black font-extrabold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <Text fw={800} className="text-white flex items-center gap-1.5">
                  Pilih &quot;Tambah ke Skrin Utama&quot; <PlusSquare className="w-4 h-4 text-[#ffe600]" />
                </Text>
                <Text size="xs" className="text-slate-300">
                  Tatal menu ke bawah dan tekan pilihan <strong>&quot;Add to Home Screen&quot; (Tambah ke Skrin Utama)</strong>.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-green-500 text-white font-extrabold flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <Text fw={800} className="text-white">
                  Tekan &quot;Tambah&quot; (Add)
                </Text>
                <Text size="xs" className="text-slate-300">
                  Ikon aplikasi **YT2MP3 Studio (Fon Telinga Unggu)** akan muncul terus di skrin utama iPhone anda!
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Android Instructions */}
      {platform === "android" && (
        <div className="space-y-4 bg-[#0d091a] p-5 rounded-2xl border-2 border-black">
          <Text fw={900} size="md" className="text-[#ffe600] flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Langkah-Langkah Install Pada Android (Google Chrome):
          </Text>

          <div className="space-y-3 text-sm text-slate-200">
            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#ff2a85] text-white font-extrabold flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <Text fw={800} className="text-white">
                  Buka Google Chrome / Edge
                </Text>
                <Text size="xs" className="text-slate-300">
                  Buka laman web <strong>YT2MP3 Studio</strong> pada peranti Android anda.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#00f0ff] text-black font-extrabold flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <Text fw={800} className="text-white flex items-center gap-1.5">
                  Tekan Menu 3 Titik <MoreVertical className="w-4 h-4 text-[#00f0ff]" />
                </Text>
                <Text size="xs" className="text-slate-300">
                  Tekan butang tiga titik di sudut atas sebelah kanan pelayar Chrome.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-[#ffe600] text-black font-extrabold flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <Text fw={800} className="text-white flex items-center gap-1.5">
                  Pilih &quot;Install app&quot; / &quot;Tambah ke Skrin Utama&quot; <Download className="w-4 h-4 text-[#ffe600]" />
                </Text>
                <Text size="xs" className="text-slate-300">
                  Tekan pilihan <strong>&quot;Install application&quot;</strong> atau <strong>&quot;Add to Home screen&quot;</strong>.
                </Text>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 bg-[#17122e] rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-green-500 text-white font-extrabold flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <Text fw={800} className="text-white">
                  Selesai!
                </Text>
                <Text size="xs" className="text-slate-300">
                  Aplikasi YT2MP3 Studio kini boleh dibuka secara paparan penuh skrin telefon tanpa sebarang bar alamat pelayar!
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
