"use client";

import React from "react";
import { Accordion, Text, Badge, Card, Group } from "@mantine/core";
import { ShieldCheck, Scale, Lock, Globe, FileText, CheckCircle2 } from "lucide-react";

export function TermsAccordion() {
  const policies = [
    {
      id: "antitrust",
      icon: Scale,
      title: "1. Polisi Antitrust & Persaingan Adil (Antitrust Policy)",
      color: "#c084fc",
      content:
        "YT2MP3 Studio komited sepenuhnya terhadap amalan persaingan bebas dan adil. Kami tidak terlibat dalam sebarang pakatan harga, penetapan pasaran, atau tingkah laku antipersaingan yang menyekat pilihan pengguna. Semua perkhidmatan disediakan secara telus tanpa diskriminasi pembekal atau perkhidmatan.",
    },
    {
      id: "antibribery",
      icon: ShieldCheck,
      title: "2. Polisi Anti-Bribery & Anti-Corruption (Anti-Rasuah)",
      color: "#38bdf8",
      content:
        "Kami mengamalkan prinsip toleransi sifar (zero tolerance) terhadap sebarang bentuk rasuah, sogokan, atau habuan tidak beretika. YT2MP3 Studio mematuhi Akta Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) 2009 serta undang-undang anti-rasuah antarabangsa seperti UK Bribery Act dan US Foreign Corrupt Practices Act (FCPA).",
    },
    {
      id: "gdpr",
      icon: Lock,
      title: "3. Peraturan Perlindungan Data EU GDPR (General Data Protection Regulation)",
      color: "#f472b6",
      content:
        "Bagi pengguna di Kesatuan Eropah (EU), YT2MP3 Studio mematuhi Peraturan (EU) 2016/679 (GDPR). Kami tidak mengumpul, menyimpan, atau menjual maklumat peribadi pengguna. Pemprosesan audio dilakukan secara langsung dalam memori sementara server dan dipadamkan serta-merta selepas muat turun selesai. Anda berhak terhadap kerahsiaan data sepenuhnya.",
    },
    {
      id: "ccpa",
      icon: Globe,
      title: "4. Polisi Privasi CCPA / CPRA (California Privacy Rights Act)",
      color: "#facc15",
      content:
        "Di bawah Akta Hak Privasi Pengguna California (CCPA/CPRA), pengguna berhak mengetahui bahawa YT2MP3 Studio 'Tidak Menjual Atau Berkongsi Maklumat Peribadi' (Do Not Sell My Personal Information). Kami tidak menjejaki aktiviti melayari anda di luar aplikasi ini.",
    },
    {
      id: "pdpa",
      icon: FileText,
      title: "5. Akta Perlindungan Data Peribadi Malaysia (PDPA 2010)",
      color: "#4ade80",
      content:
        "YT2MP3 Studio mematuhi Akta 709 (Akta Perlindungan Data Peribadi 2010 Malaysia). Sebarang data konfigurasi tempatan (seperti senarai sejarah muat turun) hanya disimpan di dalam storan tempatan browser anda (localStorage) dan tidak pernah dihantar ke server pihak ketiga.",
    },
    {
      id: "usage",
      icon: CheckCircle2,
      title: "6. Syarat Penggunaan Kegunaan Peribadi & Hak Cipta",
      color: "#a855f7",
      content:
        "Perkhidmatan ini disediakan khas untuk kegunaan peribadi dan salinan simpanan sendiri (fair use / personal archiving). Pengguna bertanggungjawab sepenuhnya untuk mematuhi hak cipta pencipta kandungan asal dan tidak menggunakan fail audio ini bagi tujuan komersial tanpa kebenaran pemilik hak cipta.",
    },
  ];

  return (
    <Card className="pop-card p-6 rounded-3xl bg-[#17122e] border-4 border-purple-600/50 max-w-4xl mx-auto my-6">
      <Group justify="space-between" mb="lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border-2 border-purple-500 flex items-center justify-center">
            <Scale className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <Text fw={900} size="xl" className="text-white">
              TERMA & SYARAT POLISI UNDANG-UNDANG
            </Text>
            <Text size="xs" className="text-slate-400 font-medium">
              Kepatuhan GDPR, CCPA, PDPA, Antitrust & Anti-Rasuah
            </Text>
          </div>
        </div>

        <Badge color="grape" size="lg" className="manga-sticker text-white">
          VERSI COMPLIANCE 2026
        </Badge>
      </Group>

      <Accordion
        variant="separated"
        radius="lg"
        styles={{
          item: {
            backgroundColor: "#0d091a",
            border: "2px solid #3b0764",
            marginBottom: "10px",
          },
          control: {
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "15px",
            padding: "16px",
          },
          content: {
            color: "#cbd5e1",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: 1.7,
            padding: "0 16px 16px 16px",
          },
        }}
      >
        {policies.map((p) => {
          const Icon = p.icon;
          return (
            <Accordion.Item key={p.id} value={p.id}>
              <Accordion.Control icon={<Icon className="w-5 h-5" style={{ color: p.color }} />}>
                {p.title}
              </Accordion.Control>
              <Accordion.Panel>
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-slate-300">
                  {p.content}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Card>
  );
}
