"use client";

import React, { useState } from "react";
import { MantineAppWrapper } from "@/components/yt2mp3/MantineAppWrapper";
import { Navbar } from "@/components/yt2mp3/Navbar";
import { LeftSidebar } from "@/components/yt2mp3/LeftSidebar";
import { ConverterCore } from "@/components/yt2mp3/ConverterCore";
import { FeaturesSection } from "@/components/yt2mp3/FeaturesSection";
import { FaqSection } from "@/components/yt2mp3/FaqSection";
import { TutorialSpotlight } from "@/components/yt2mp3/TutorialSpotlight";
import { InstallTutorial } from "@/components/yt2mp3/InstallTutorial";
import { TermsAccordion } from "@/components/yt2mp3/TermsAccordion";
import { UpdateModal } from "@/components/yt2mp3/UpdateModal";
import { PurpleHeadphoneLogo } from "@/components/yt2mp3/PurpleHeadphoneLogo";
import { Container, Text, Drawer } from "@mantine/core";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "tutorial" | "install" | "terms">("home");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <MantineAppWrapper>
      <div className="min-h-screen bg-manga-dots text-white flex flex-col font-sans selection:bg-[#ff2a85] selection:text-white">
        {/* Header with Purple Headphone Logo & Mobile Toggle */}
        <Navbar onToggleSidebar={() => setIsMobileDrawerOpen(true)} />

        {/* First Time User Update Modal (0.1.4) */}
        <UpdateModal
          opened={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />

        {/* Mobile Navigation Drawer */}
        <Drawer
          opened={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          size="280px"
          padding={0}
          withCloseButton={false}
          styles={{
            content: {
              backgroundColor: "#0d091a",
              borderRight: "4px solid #000000",
            },
          }}
        >
          <LeftSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsMobileDrawerOpen(false);
            }}
            onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />
        </Drawer>

        {/* Main Content Layout with Left Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Desktop Left Sidebar */}
          <div className="hidden md:block flex-shrink-0">
            <LeftSidebar
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
            />
          </div>

          {/* Right Main Body Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Hero Section */}
            <section className="relative pt-8 pb-4 border-b-4 border-black bg-[#17122e]/80">
              <Container size="xl" className="text-center relative z-10">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d091a] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Sparkles className="w-4 h-4 text-[#ffe600] animate-spin" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    STUDIO CONVERTER YOUTUBE HD #1
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-4 text-white">
                  TUKAR YOUTUBE LINK KE{" "}
                  <span className="inline-block px-3 py-1 bg-[#ff2a85] text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg] hover:rotate-0 transition-transform">
                    MP3 320KBPS
                  </span>{" "}
                  <span className="text-[#00f0ff]">SUPER PANTAS!</span>
                </h1>

                <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-semibold leading-relaxed">
                  Dapatkan audio muzik, podcast, atau lagu kegemaran anda secara percuma dengan kualiti HD, gambar ID3 tag, dan ciri audio trimmer!
                </p>
              </Container>
            </section>

            {/* Tab Views */}
            <main className="flex-1">
              {activeTab === "home" && (
                <>
                  <ConverterCore />
                  <FeaturesSection />
                  <FaqSection />
                </>
              )}

              {activeTab === "tutorial" && (
                <div className="py-6">
                  <TutorialSpotlight />
                  <FeaturesSection />
                </div>
              )}

              {activeTab === "install" && (
                <div className="py-6">
                  <InstallTutorial />
                </div>
              )}

              {activeTab === "terms" && (
                <div className="py-6">
                  <TermsAccordion />
                </div>
              )}
            </main>

            {/* Professional Footer */}
            <footer className="bg-[#0d091a] border-t-4 border-black py-8 mt-auto">
              <Container size="xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                  <div className="flex items-center gap-3">
                    <PurpleHeadphoneLogo size={40} />
                    <div>
                      <Text fw={900} size="md" className="text-white">
                        YT2MP3 Studio
                      </Text>
                      <Text size="xs" className="text-slate-400 font-medium">
                        High Quality YouTube Audio Downloader & Converter
                      </Text>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end">
                    <Text size="sm" className="text-slate-200 font-bold flex items-center gap-1.5">
                      Web application ini dibina secara profesional oleh <span className="text-[#00f0ff] font-black">Safwan Quest</span>.
                    </Text>
                    <Text size="xs" className="text-slate-400 font-medium mt-0.5">
                      Hak Cipta Terpelihara © 2026 YT2MP3 Studio. All rights reserved.
                    </Text>
                  </div>
                </div>
              </Container>
            </footer>
          </div>
        </div>
      </div>
    </MantineAppWrapper>
  );
}
