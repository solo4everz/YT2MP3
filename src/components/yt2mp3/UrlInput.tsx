"use client";

import React, { useState } from "react";
import { Button, TextInput, Group, Text, Tooltip } from "@mantine/core";
import { Link2, Search, ClipboardPaste, X, ArrowRight } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface UrlInputProps {
  onFetchInfo: (input: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onFetchInfo, isLoading }: UrlInputProps) {
  const [inputVal, setInputVal] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputVal(text);
        notifications.show({
          title: "Berjaya ditampal! 📋",
          message: "YouTube Link telah ditampal dari papan klip.",
          color: "cyan",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Perhatian",
        message: "Tidak dapat mengakses papan klip. Sila tampal secara manual (Ctrl+V).",
        color: "yellow",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      notifications.show({
        title: "Input Kosong! ⚠️",
        message: "Sila masukkan URL YouTube atau tajuk lagu carian terlebih dahulu.",
        color: "red",
      });
      return;
    }
    onFetchInfo(inputVal.trim());
  };

  const setSampleUrl = (url: string) => {
    setInputVal(url);
    onFetchInfo(url);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4">
      {/* Top Banner Tag */}
      <div className="absolute -top-9 left-6 z-10 hidden sm:block">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-xl border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          ✨ Tampal YouTube Link Atau Cari Tajuk Lagu Di Sini!
        </div>
      </div>

      {/* Main Input Card */}
      <form onSubmit={handleSubmit} className="pop-card p-4 sm:p-6 rounded-3xl bg-[#17122e] border-4 border-purple-900/60">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <TextInput
              size="lg"
              placeholder="Tampal YouTube Link (cth: https://youtu.be/...) atau cari tajuk lagu..."
              value={inputVal}
              onChange={(e) => setInputVal(e.currentTarget.value)}
              leftSection={
                inputVal.includes("http") ? (
                  <Link2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <Search className="w-5 h-5 text-pink-400" />
                )
              }
              rightSection={
                inputVal ? (
                  <button
                    type="button"
                    onClick={() => setInputVal("")}
                    className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null
              }
              styles={{
                input: {
                  backgroundColor: "#0d091a",
                  borderColor: "#3b0764",
                  borderWidth: "2px",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "16px",
                  height: "56px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
                  "&:focus": {
                    borderColor: "#a855f7",
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-2">
            {!inputVal && (
              <Tooltip label="Tampal YouTube Link dari Clipboard" withArrow>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePaste}
                  className="pop-button-yellow h-[56px] px-4 rounded-2xl flex items-center gap-2"
                >
                  <ClipboardPaste className="w-5 h-5" />
                  <span className="hidden md:inline">Tampal</span>
                </Button>
              </Tooltip>
            )}

            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[56px] px-6 rounded-2xl flex items-center gap-2 text-lg tracking-wide flex-1 sm:flex-initial"
            >
              <span>{isLoading ? "Memuatkan..." : "GET AUDIO"}</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Button>
          </div>
        </div>

        {/* Quick Sample Links */}
        <Group mt="md" gap="xs" align="center">
          <Text size="xs" c="dimmed" fw={700} className="uppercase tracking-wider text-slate-400">
            Contoh Carian:
          </Text>
          <button
            type="button"
            onClick={() => setSampleUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
            className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-purple-400 text-slate-300 hover:text-purple-300 transition-colors"
          >
            🎵 Rick Astley - Never Gonna Give You Up
          </button>
          <button
            type="button"
            onClick={() => setSampleUrl("Lofi Hip Hop Chill Beats")}
            className="text-xs px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-pink-400 text-slate-300 hover:text-pink-300 transition-colors"
          >
            🎧 Lofi Hip Hop Beats
          </button>
        </Group>
      </form>
    </div>
  );
}
