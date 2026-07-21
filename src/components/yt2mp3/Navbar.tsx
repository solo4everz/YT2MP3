"use client";

import React from "react";
import { Group, Badge, Container, Text } from "@mantine/core";
import { Sparkles, Cpu, Zap, Menu } from "lucide-react";
import { PurpleGuitarLogo } from "./PurpleGuitarLogo";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0d091a]/90 border-b-2 border-purple-900/60 shadow-lg">
      <Container size="xl" className="py-3">
        <Group justify="space-between" align="center">
          {/* Logo with Purple Guitar on Black Background */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:text-white md:hidden"
                aria-label="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <PurpleGuitarLogo size={42} />

            <div>
              <div className="flex items-center gap-2">
                <Text fw={900} size="xl" className="tracking-tight text-white flex items-center gap-1">
                  YT<span className="text-purple-400">2</span>MP3{" "}
                  <span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg border border-purple-400 text-xs font-extrabold uppercase tracking-wider">
                    STUDIO
                  </span>
                </Text>
              </div>
              <Text size="xs" c="dimmed" className="font-medium text-slate-300">
                Penyahkod Audio YouTube Studio HD
              </Text>
            </div>
          </div>

          {/* Right Badges & Engine Status */}
          <Group gap="xs" visibleFrom="sm">
            <Badge
              size="lg"
              variant="filled"
              color="grape"
              leftSection={<Zap className="w-4 h-4 text-white" />}
              className="manga-sticker text-white"
            >
              320 KBPS HD
            </Badge>

            <Badge
              size="lg"
              variant="filled"
              color="yellow"
              leftSection={<Cpu className="w-4 h-4 text-black" />}
              className="manga-sticker text-black"
            >
              ENJIN YT-DLP + FFMPEG
            </Badge>

            <Badge
              size="lg"
              variant="filled"
              color="cyan"
              leftSection={<Sparkles className="w-4 h-4 text-black" />}
              className="manga-sticker text-black"
            >
              PERCUMA 100%
            </Badge>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
