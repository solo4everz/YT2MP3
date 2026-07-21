"use client";

import React, { useEffect, useState } from "react";
import { Modal, Text, Button, Group, Badge, Stack } from "@mantine/core";
import { Zap, ShieldCheck, Scissors, CheckCircle2 } from "lucide-react";
import { PurpleHeadphoneLogo } from "./PurpleHeadphoneLogo";

interface UpdateModalProps {
  opened?: boolean;
  onClose?: () => void;
}

export function UpdateModal({ opened: customOpened, onClose: customOnClose }: UpdateModalProps) {
  const [internalOpened, setInternalOpened] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem("yt2mp3_seen_update_v0.1.4");
      if (!seen) {
        setInternalOpened(true);
      }
    } catch (e) {}
  }, []);

  const isOpened = customOpened !== undefined ? customOpened : internalOpened;

  const handleClose = () => {
    try {
      localStorage.setItem("yt2mp3_seen_update_v0.1.4", "true");
    } catch (e) {}
    setInternalOpened(false);
    if (customOnClose) customOnClose();
  };

  return (
    <Modal
      opened={isOpened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <PurpleHeadphoneLogo size={34} />
          <div>
            <Badge color="pink" size="md" className="manga-sticker text-white">
              LATEST UPDATE 0.1.4
            </Badge>
            <Text fw={900} size="md" className="text-white">
              Apa Yang Baharu Dalam Studio?
            </Text>
          </div>
        </Group>
      }
      size="lg"
      radius="xl"
      centered
      styles={{
        content: {
          backgroundColor: "#17122e",
          border: "4px solid #000000",
          boxShadow: "8px 8px 0px 0px #000000",
          borderRadius: "24px",
        },
        header: {
          backgroundColor: "#0d091a",
          borderBottom: "3px solid #000000",
          padding: "16px 24px",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <Stack gap="md">
        <div className="bg-[#0d091a] p-4 rounded-2xl border-2 border-black">
          <Text size="sm" className="text-slate-200 font-medium leading-relaxed">
            Selamat datang ke <strong className="text-[#00f0ff]">YT2MP3 Studio v0.1.4</strong>! Kami telah menaik taraf enjin audio, panduan pemasangan app iOS/Android, dan sistem keselamatan webapp ini.
          </Text>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-start p-3 bg-[#0d091a] rounded-xl border-2 border-black">
            <Zap className="w-5 h-5 text-[#00f0ff] mt-0.5 flex-shrink-0" />
            <div>
              <Text fw={800} size="sm" className="text-white">
                Audio HD 320 kbps & Fast Conversion
              </Text>
              <Text size="xs" c="dimmed" className="text-slate-300 font-medium">
                Pengekodan audio menggunakan enjin FFmpeg terbaharu untuk kualiti bunyi paling jernih.
              </Text>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 bg-[#0d091a] rounded-xl border-2 border-black">
            <Scissors className="w-5 h-5 text-[#ffe600] mt-0.5 flex-shrink-0" />
            <div>
              <Text fw={800} size="sm" className="text-white">
                Ciri Audio Trimmer (Ringtone Maker)
              </Text>
              <Text size="xs" c="dimmed" className="text-slate-300 font-medium">
                Tentukan masa mula dan masa tamat untuk potong klip audio pilihan anda.
              </Text>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 bg-[#0d091a] rounded-xl border-2 border-black">
            <ShieldCheck className="w-5 h-5 text-[#ff2a85] mt-0.5 flex-shrink-0" />
            <div>
              <Text fw={800} size="sm" className="text-white">
                Polisi Privasi & Compliance Terkini
              </Text>
              <Text size="xs" c="dimmed" className="text-slate-300 font-medium">
                Perlindungan data penuh mengikut GDPR EU, CCPA/CPRA, Malaysia PDPA, Antitrust, & Anti-Bribery.
              </Text>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleClose}
          className="pop-button-pink h-14 rounded-2xl text-lg font-black tracking-wide flex items-center justify-center gap-2 mt-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Faham & Teruskan</span>
        </Button>
      </Stack>
    </Modal>
  );
}
