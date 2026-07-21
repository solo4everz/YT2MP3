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
    const isUrl =
      cleanInput.includes("youtube.com") ||
      cleanInput.includes("youtu.be") ||
      cleanInput.startsWith("http://") ||
      cleanInput.startsWith("https://");

    if (isUrl) {
      // Fetch single video info
      const { stdout } = await execFileAsync(
        "yt-dlp",
        ["--dump-json", "--no-warnings", cleanInput],
        { maxBuffer: 10 * 1024 * 1024 }
      );

      const data = JSON.parse(stdout);
      const videoId = data.id || data.display_id;
      const thumbnail =
        data.thumbnail ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : "");

      return NextResponse.json({
        type: "single",
        video: {
          id: videoId,
          title: data.title || "Tajuk Tidak Diketahui",
          channel: data.uploader || data.channel || "Saluran YouTube",
          duration: data.duration || 0,
          durationFormatted: formatDuration(data.duration || 0),
          thumbnail: thumbnail,
          viewCount: data.like_count || data.view_count || 0,
          uploadDate: data.upload_date || "",
          url: data.webpage_url || `https://www.youtube.com/watch?v=${videoId}`,
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
        ],
        { maxBuffer: 10 * 1024 * 1024 }
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
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
