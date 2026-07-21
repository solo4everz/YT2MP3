import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";
import ytdl from "@distube/ytdl-core";

const execFileAsync = promisify(execFile);

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "_").substring(0, 150);
}

function extractYouTubeId(str: string): string | null {
  if (!str) return null;
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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yt2mp3-"));

  try {
    const body = await req.json();
    const {
      url,
      quality = "320k",
      format = "mp3",
      startTime = 0,
      endTime = 0,
      embedMetadata = true,
      customTitle,
      customArtist,
    } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL YouTube diperlukan." },
        { status: 400 }
      );
    }

    const videoId = extractYouTubeId(url);
    const targetUrl = videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : url.startsWith("http")
      ? url
      : `https://${url}`;

    // Mode 1: Try local yt-dlp + ffmpeg first
    try {
      const inputTemplate = path.join(tmpDir, "input.%(ext)s");
      const downloadArgs = [
        "-f",
        "bestaudio/best",
        "--no-warnings",
        "--no-playlist",
        "--user-agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "-o",
        inputTemplate,
        "--write-thumbnail",
        "--convert-thumbnails",
        "jpg",
        "--write-info-json",
        targetUrl,
      ];

      await execFileAsync("yt-dlp", downloadArgs, {
        maxBuffer: 30 * 1024 * 1024,
      });

      let videoTitle = customTitle || "audio";
      let videoArtist = customArtist || "YouTube";
      const files = fs.readdirSync(tmpDir);

      const infoJsonFile = files.find((f) => f.endsWith(".info.json"));
      if (infoJsonFile) {
        try {
          const infoData = JSON.parse(
            fs.readFileSync(path.join(tmpDir, infoJsonFile), "utf-8")
          );
          if (!customTitle && infoData.title) videoTitle = infoData.title;
          if (!customArtist && (infoData.uploader || infoData.channel)) {
            videoArtist = infoData.uploader || infoData.channel;
          }
        } catch (e) {}
      }

      const safeTitle = sanitizeFilename(videoTitle);

      const rawAudioFile = files.find(
        (f) =>
          f.startsWith("input.") &&
          !f.endsWith(".jpg") &&
          !f.endsWith(".webp") &&
          !f.endsWith(".json")
      );
      const thumbFile = files.find(
        (f) => f.endsWith(".jpg") || f.endsWith(".webp")
      );

      if (rawAudioFile) {
        const rawAudioPath = path.join(tmpDir, rawAudioFile);
        const outputPath = path.join(tmpDir, `output.${format}`);

        const ffmpegArgs: string[] = [];
        if (startTime > 0) ffmpegArgs.push("-ss", String(startTime));
        ffmpegArgs.push("-i", rawAudioPath);
        if (endTime > 0 && endTime > startTime) ffmpegArgs.push("-to", String(endTime));

        const hasThumb = embedMetadata && thumbFile && format === "mp3";
        if (hasThumb) {
          ffmpegArgs.push("-i", path.join(tmpDir, thumbFile!));
          ffmpegArgs.push("-map", "0:a", "-map", "1:v");
          ffmpegArgs.push("-c:v", "copy");
          ffmpegArgs.push("-disposition:v", "attached_pic");
        }

        if (format === "mp3") {
          ffmpegArgs.push("-c:a", "libmp3lame", "-b:a", quality, "-id3v2_version", "3");
        } else if (format === "m4a") {
          ffmpegArgs.push("-c:a", "aac", "-b:a", quality);
        } else if (format === "wav") {
          ffmpegArgs.push("-c:a", "pcm_s16le");
        } else if (format === "flac") {
          ffmpegArgs.push("-c:a", "flac");
        }

        if (embedMetadata) {
          ffmpegArgs.push("-metadata", `title=${videoTitle}`);
          ffmpegArgs.push("-metadata", `artist=${videoArtist}`);
          ffmpegArgs.push("-metadata", `comment=Converted by YT2MP3 Studio`);
        }

        ffmpegArgs.push("-y", outputPath);
        await execFileAsync("ffmpeg", ffmpegArgs);

        if (fs.existsSync(outputPath)) {
          const audioBuffer = fs.readFileSync(outputPath);
          const mimeTypes: Record<string, string> = {
            mp3: "audio/mpeg",
            m4a: "audio/mp4",
            wav: "audio/wav",
            flac: "audio/flac",
          };
          const mimeType = mimeTypes[format] || "application/octet-stream";

          setTimeout(() => {
            try {
              fs.rmSync(tmpDir, { recursive: true, force: true });
            } catch (e) {}
          }, 3000);

          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": mimeType,
              "Content-Disposition": `attachment; filename="${encodeURIComponent(safeTitle)}.${format}"`,
              "Content-Length": audioBuffer.length.toString(),
            },
          });
        }
      }
    } catch (ytDlpFfmpegErr) {
      console.warn("Local yt-dlp/ffmpeg failed or missing, switching to @distube/ytdl-core fallback:", ytDlpFfmpegErr);
    }

    // Mode 2: Serverless / Netlify Fallback with pure JS @distube/ytdl-core
    const info = await ytdl.getInfo(targetUrl);
    const title = info.videoDetails.title || "audio";
    const safeTitle = sanitizeFilename(title);

    const formatObj = ytdl.chooseFormat(info.formats, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    if (!formatObj || !formatObj.url) {
      throw new Error("Gagal mengekstrak stream audio dari YouTube.");
    }

    // Fetch audio stream directly
    const audioRes = await fetch(formatObj.url);
    if (!audioRes.ok) {
      throw new Error("Gagal memuat turun stream audio dari YouTube CDN.");
    }

    const audioArrayBuffer = await audioRes.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    // Clean up temp directory
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeTitle)}.mp3"`,
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Convert error:", err);
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}

    return NextResponse.json(
      {
        error:
          "Gagal memproses audio di persekitaran hosted Netlify. Sila pastikan link sah dan cuba lagi.",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
