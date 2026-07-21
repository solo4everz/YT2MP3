"use client";

import React from "react";
import { Container, Accordion, Text, Badge } from "@mantine/core";
import { HelpCircle } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      value: "q1",
      question: "Bagaimanakah cara convert YouTube link kepada fail MP3?",
      answer:
        "Tampal YouTube link anda ke dalam ruangan carian di atas (atau taip tajuk lagu), kemudian tekan 'GET AUDIO'. Pilih kualiti bitrate (320kbps disyorkan) dan tekan 'CONVERT & DOWNLOAD MP3 NOW!'. Fail akan terus dimuat turun ke peranti anda.",
    },
    {
      value: "q2",
      question: "Apakah format audio yang disokong oleh studio ini?",
      answer:
        "Kami menyokong format MP3 (128kbps sehingga 320kbps HD), M4A / AAC, WAV (uncompressed), dan FLAC (lossless high definition audio).",
    },
    {
      value: "q3",
      question: "Adakah gambar poster video dimasukkan ke dalam fail MP3?",
      answer:
        "Ya! Enjin kami menyusun gambar thumbnail YouTube dan tag ID3 (tajuk & artis) ke dalam fail MP3 secara automatik supaya ia kelihatan profesional dalam Spotify, Apple Music, atau peranti anda.",
    },
    {
      value: "q4",
      question: "Bolehkah saya potong / trim lagu untuk dijadikan ringtone?",
      answer:
        "Sudah tentu! Aktifkan suis 'Potong / Trim Audio', kemudian gerakkan slider untuk menentukan masa mula dan masa tamat sebelum proses muat turun.",
    },
    {
      value: "q5",
      question: "Adakah servis ini percuma dan selamat?",
      answer:
        "Ya 100% percuma tanpa sebarang iklan mengganggu atau keperluan mendaftar akaun. Pemprosesan audio dilakukan secara selamat menerusi enjin tempatan `yt-dlp` dan `ffmpeg`.",
    },
  ];

  return (
    <section className="py-10 bg-[#0d091a]/60 border-t-2 border-purple-900/60">
      <Container size="md">
        <div className="text-center mb-8">
          <Badge color="yellow" size="xl" className="manga-sticker text-black mb-2">
            SOALAN LAZIM (FAQ)
          </Badge>
          <Text fw={900} size="xl" className="text-3xl text-white">
            Soalan Yang Sering Ditanya
          </Text>
        </div>

        <Accordion
          variant="separated"
          radius="lg"
          styles={{
            item: {
              backgroundColor: "#17122e",
              border: "2px solid #3b0764",
              marginBottom: "12px",
            },
            control: {
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "16px",
              padding: "16px",
            },
            content: {
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.6,
              padding: "0 16px 16px 16px",
            },
          }}
        >
          {faqs.map((faq) => (
            <Accordion.Item key={faq.value} value={faq.value}>
              <Accordion.Control icon={<HelpCircle className="w-5 h-5 text-purple-400" />}>
                {faq.question}
              </Accordion.Control>
              <Accordion.Panel>{faq.answer}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
