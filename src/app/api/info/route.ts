import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours > 0) {
    return `${hours}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function extractYouTubeId(str: string): string | null {
  if (!str) return null;
  // Remove quotes, non-breaking spaces, newlines, and trailing spaces
  const clean = str
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\ufeff]/g, " ")
    .replace(/[\r\n\t]/g, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (match && match[1]) return match[1];
  if (/^[\w-]{11}$/.test(clean)) return clean;
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== "string" || !input.trim()) {
      return NextResponse.json(
        { error: "Sila masukkan URL YouTube atau tajuk carian." },
        { status: 400 }
      );
    }

    const cleanInput = input.trim();
    const videoId = extractYouTubeId(cleanInput);
    const isUrl =
      videoId !== null ||
      cleanInput.includes("youtube.com") ||
      cleanInput.includes("youtu.be") ||
      cleanInput.startsWith("http://") ||
      cleanInput.startsWith("https://");

    if (isUrl) {
      // Normalize target YouTube URL
      const targetUrl = videoId
        ? `https://www.youtube.com/watch?v=${videoId}`
        : cleanInput.startsWith("http")
        ? cleanInput
        : `https://${cleanInput}`;

      // Fetch single video info with user-agent and no-playlist
      const { stdout } = await execFileAsync(
        "yt-dlp",
        [
          "--dump-json",
          "--no-warnings",
          "--no-playlist",
          "--user-agent",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          targetUrl,
        ],
        { maxBuffer: 15 * 1024 * 1024 }
      );

      const lines = stdout.trim().split("\n").filter(Boolean);
      if (lines.length === 0) {
        throw new Error("Gagal membaca respon maklumat video.");
      }

      const data = JSON.parse(lines[0]);
      const vId = data.id || videoId || data.display_id;

      // Select best available thumbnail URL
      let thumbnail = data.thumbnail;
      if (!thumbnail && Array.isArray(data.thumbnails) && data.thumbnails.length > 0) {
        thumbnail = data.thumbnails[data.thumbnails.length - 1].url;
      }
      if (!thumbnail && vId) {
        thumbnail = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
      }

      return NextResponse.json({
        type: "single",
        video: {
          id: vId,
          title: data.title || "Tajuk Tidak Diketahui",
          channel: data.uploader || data.channel || "Saluran YouTube",
          duration: data.duration || 0,
          durationFormatted: formatDuration(data.duration || 0),
          thumbnail: thumbnail || "",
          viewCount: data.like_count || data.view_count || 0,
          uploadDate: data.upload_date || "",
          url: data.webpage_url || `https://www.youtube.com/watch?v=${vId}`,
        },
      });
    } else {
      // Perform YouTube search
      const { stdout } = await execFileAsync(
        "yt-dlp",
        [
          `ytsearch5:${cleanInput}`,
          "--dump-json",
          "--no-warnings",
          "--flat-playlist",
          "--user-agent",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        ],
        { maxBuffer: 15 * 1024 * 1024 }
      );

      const lines = stdout.trim().split("\n").filter(Boolean);
      const results = lines.map((line) => {
        const item = JSON.parse(line);
        const vId = item.id || item.url;
        return {
          id: vId,
          title: item.title || "Tajuk Tidak Diketahui",
          channel: item.uploader || item.channel || "Saluran YouTube",
          duration: item.duration || 0,
          durationFormatted: formatDuration(item.duration || 0),
          thumbnail: vId
            ? `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`
            : item.thumbnail || "",
          url: `https://www.youtube.com/watch?v=${vId}`,
        };
      });

      return NextResponse.json({
        type: "search",
        query: cleanInput,
        results,
      });
    }
  } catch (err: any) {
    console.error("Info error:", err);
    return NextResponse.json(
      {
        error:
          "Gagal mendapatkan maklumat video YouTube. Sila pastikan link sah dan cuba lagi.",
        details: err?.stderr || err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
