"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { UrlInput } from "./UrlInput";
import { VideoPreviewCard, VideoMetadata, ConvertOptions } from "./VideoPreviewCard";
import { SearchResultsModal } from "./SearchResultsModal";
import { ConversionStatus } from "./ConversionStatus";
import { DownloadHistory, HistoryItem } from "./DownloadHistory";

export function ConverterCore() {
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoMetadata | null>(null);

  // Search results state
  const [searchResults, setSearchResults] = useState<VideoMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Conversion process state
  const [status, setStatus] = useState<"idle" | "fetching" | "encoding" | "tagging" | "completed" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yt2mp3_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  const saveHistoryItem = (item: HistoryItem) => {
    try {
      const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 10);
      setHistory(updated);
      localStorage.setItem("yt2mp3_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history item", e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("yt2mp3_history");
    } catch (e) {}
    notifications.show({
      title: "Sejarah Dipadam 🗑️",
      message: "Semua rekod muat turun lagu telah dipadam.",
      color: "yellow",
    });
  };

  // Fetch Video Info or Search
  const handleFetchInfo = async (input: string) => {
    setIsLoadingInfo(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendapatkan info video.");
      }

      if (data.type === "single" && data.video) {
        setCurrentVideo(data.video);
        notifications.show({
          title: "Maklumat Video Ditemui! 🎵",
          message: `${data.video.title}`,
          color: "cyan",
        });
      } else if (data.type === "search" && data.results) {
        setSearchResults(data.results);
        setSearchQuery(data.query || input);
        setIsSearchModalOpen(true);
      }
    } catch (err: any) {
      console.error("Fetch info error:", err);
      notifications.show({
        title: "Ralat Carian ❌",
        message: err.message || "Gagal mendapatkan info video.",
        color: "red",
      });
    } finally {
      setIsLoadingInfo(false);
    }
  };

  // Start Conversion & Direct Audio File Download
  const handleConvert = async (options: ConvertOptions) => {
    if (!currentVideo) return;

    setStatus("fetching");
    setProgress(25);
    setErrorMessage("");

    try {
      const timer1 = setTimeout(() => {
        setStatus("encoding");
        setProgress(55);
      }, 1500);

      const timer2 = setTimeout(() => {
        setStatus("tagging");
        setProgress(85);
      }, 3000);

      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: currentVideo.url,
          quality: options.quality,
          format: options.format,
          startTime: options.startTime,
          endTime: options.endTime,
          embedMetadata: options.embedMetadata,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const contentType = res.headers.get("Content-Type") || "";

      // Handle JSON response (Netlify serverless mode direct stream payload)
      if (contentType.includes("application/json")) {
        const json = await res.json();
        if (json.type === "direct_stream" && json.url) {
          const a = document.createElement("a");
          a.href = json.url;
          a.download = json.filename || `${currentVideo.title}.mp3`;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          a.remove();

          setStatus("completed");
          setProgress(100);

          saveHistoryItem({
            id: currentVideo.id,
            video: currentVideo,
            format: options.format,
            quality: options.quality,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });

          notifications.show({
            title: "Proses Selesai! 🎉",
            message: `Fail '${json.filename || currentVideo.title}' sedia dimuat turun.`,
            color: "cyan",
          });
          return;
        } else {
          throw new Error(json.error || "Gagal memproses audio.");
        }
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memproses audio.");
      }

      // Handle binary response (Local mode full FFmpeg output)
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const contentDisp = res.headers.get("Content-Disposition");
      let filename = `${currentVideo.title}.${options.format}`;
      if (contentDisp && contentDisp.includes("filename=")) {
        const match = contentDisp.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setStatus("completed");
      setProgress(100);

      saveHistoryItem({
        id: currentVideo.id,
        video: currentVideo,
        format: options.format,
        quality: options.quality,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      notifications.show({
        title: "Proses Selesai! 🎉",
        message: `Fail '${filename}' sedang dimuat turun.`,
        color: "cyan",
      });
    } catch (err: any) {
      console.error("Convert error:", err);
      setStatus("error");
      setProgress(0);
      setErrorMessage(err.message || "Gagal memproses audio.");
      notifications.show({
        title: "Gagal ❌",
        message: err.message || "Sila cuba lagi.",
        color: "red",
      });
    }
  };

  return (
    <Container size="xl" className="py-6">
      {/* Search / URL Input Box */}
      <UrlInput onFetchInfo={handleFetchInfo} isLoading={isLoadingInfo} />

      {/* Search Results Modal */}
      <SearchResultsModal
        opened={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        query={searchQuery}
        results={searchResults}
        onSelectVideo={(video) => setCurrentVideo(video)}
      />

      {/* Conversion Status Indicator */}
      <ConversionStatus
        status={status}
        progress={progress}
        errorMessage={errorMessage}
      />

      {/* Selected Video Preview Card */}
      {currentVideo && (
        <VideoPreviewCard
          video={currentVideo}
          onConvert={handleConvert}
          isConverting={status === "fetching" || status === "encoding" || status === "tagging"}
        />
      )}

      {/* Download History Shelf */}
      <DownloadHistory
        history={history}
        onClearHistory={handleClearHistory}
        onReConvert={(item) => {
          setCurrentVideo(item.video);
          window.scrollTo({ top: 200, behavior: "smooth" });
        }}
      />
    </Container>
  );
}
