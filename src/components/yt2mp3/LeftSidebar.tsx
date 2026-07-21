"use client";

import React from "react";
import { Stack, Text, Badge } from "@mantine/core";
import { Home, GraduationCap, Scale, Sparkles, Smartphone, X } from "lucide-react";
import { PurpleHeadphoneLogo } from "./PurpleHeadphoneLogo";

interface LeftSidebarProps {
  activeTab: "home" | "tutorial" | "install" | "terms";
  onTabChange: (tab: "home" | "tutorial" | "install" | "terms") => void;
  onOpenUpdateModal: () => void;
  onCloseMobile?: () => void;
}

export function LeftSidebar({
  activeTab,
  onTabChange,
  onOpenUpdateModal,
  onCloseMobile,
}: LeftSidebarProps) {
  const menuItems = [
    {
      id: "home" as const,
      label: "Utama & Studio",
      icon: Home,
      badge: "320K HD",
      badgeColor: "pink",
    },
    {
      id: "tutorial" as const,
      label: "Tutorial Spotlight",
      icon: GraduationCap,
      badge: "PANDUAN",
      badgeColor: "yellow",
    },
    {
      id: "install" as const,
      label: "Cara Install App",
      icon: Smartphone,
      badge: "iOS & ANDROID",
      badgeColor: "cyan",
    },
    {
      id: "terms" as const,
      label: "Terma & Syarat",
      icon: Scale,
      badge: "COMPLIANCE",
      badgeColor: "grape",
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0d091a] border-r-4 border-black p-4 flex flex-col justify-between h-full min-h-[calc(100vh-64px)] shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
      <Stack gap="md">
        {/* Top Header Logo in Sidebar */}
        <div className="flex justify-between items-center pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <PurpleHeadphoneLogo size={38} />
            <div>
              <Text fw={900} size="sm" className="text-white tracking-wide">
                YT2MP3 Studio
              </Text>
              <Text size="xs" className="text-[#00f0ff] font-extrabold">
                v0.1.4 Pro
              </Text>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Options */}
        <Stack gap="xs" mt="xs">
          <Text size="xs" fw={900} className="uppercase tracking-wider text-[#ffe600] px-2">
            Navigasi Utama
          </Text>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border-3 transition-all ${
                  isActive
                    ? "bg-[#ff2a85] border-black text-white font-extrabold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-[#17122e] border-black text-slate-200 hover:border-[#00f0ff] hover:bg-black/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#00f0ff]"}`} />
                  <span className="text-xs font-black uppercase tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge size="xs" color={item.badgeColor} className="manga-sticker text-black">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </Stack>

        {/* Latest Update Trigger Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onOpenUpdateModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full p-3 rounded-2xl bg-[#ffe600] border-3 border-black text-black text-left transition-all hover:bg-[#fff04d] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-black animate-spin" />
                <Text fw={900} size="xs" className="text-black uppercase tracking-wider">
                  LATEST UPDATE
                </Text>
              </div>
              <Badge size="xs" color="dark" className="manga-sticker text-white">
                v0.1.4
              </Badge>
            </div>
            <Text size="xs" className="text-black font-extrabold">
              Lihat apakah yang baharu dalam versi 0.1.4
            </Text>
          </button>
        </div>
      </Stack>

      {/* Developer Credit in Sidebar Bottom */}
      <div className="pt-4 border-t-2 border-black mt-auto">
        <div className="p-3 bg-[#17122e] rounded-2xl border-2 border-black text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Text size="xs" className="text-slate-300 font-semibold">
            Dibina secara profesional oleh
          </Text>
          <Text fw={900} size="sm" className="text-[#00f0ff] tracking-wide mt-0.5">
            Safwan Quest
          </Text>
        </div>
      </div>
    </aside>
  );
}
