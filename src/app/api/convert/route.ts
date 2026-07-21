import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, "_").substring(0, 150);
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

    // Step 1: Download highest quality audio & thumbnail with yt-dlp
    const inputTemplate = path.join(tmpDir, "input.%(ext)s");
    const downloadArgs = [
      "-f",
      "bestaudio/best",
      "--no-warnings",
      "-o",
      inputTemplate,
      "--write-thumbnail",
      "--convert-thumbnails",
      "jpg",
      "--write-info-json",
      url,
    ];

    await execFileAsync("yt-dlp", downloadArgs, {
      maxBuffer: 30 * 1024 * 1024,
    });

    // Read video info JSON if generated
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
      } catch (e) {
        // ignore fallback
      }
    }

    const safeTitle = sanitizeFilename(videoTitle);

    // Find downloaded raw audio file in tmpDir (not .jpg, .webp, .json)
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

    if (!rawAudioFile) {
      throw new Error("Gagal memuat turun fail audio dari YouTube.");
    }

    const rawAudioPath = path.join(tmpDir, rawAudioFile);
    const outputPath = path.join(tmpDir, `output.${format}`);

    // Step 2: Build FFmpeg command for conversion, trimming & metadata
    const ffmpegArgs: string[] = [];

    // Trimming start time
    if (startTime > 0) {
      ffmpegArgs.push("-ss", String(startTime));
    }

    // Input raw audio
    ffmpegArgs.push("-i", rawAudioPath);

    // Trimming end time
    if (endTime > 0 && endTime > startTime) {
      ffmpegArgs.push("-to", String(endTime));
    }

    // Handle thumbnail attachment for MP3
    const hasThumb = embedMetadata && thumbFile && format === "mp3";
    if (hasThumb) {
      ffmpegArgs.push("-i", path.join(tmpDir, thumbFile!));
      ffmpegArgs.push("-map", "0:a", "-map", "1:v");
      ffmpegArgs.push("-c:v", "copy");
      ffmpegArgs.push("-disposition:v", "attached_pic");
    }

    // Audio Codec & Bitrate options
    if (format === "mp3") {
      ffmpegArgs.push("-c:a", "libmp3lame");
      ffmpegArgs.push("-b:a", quality);
      ffmpegArgs.push("-id3v2_version", "3");
    } else if (format === "m4a") {
      ffmpegArgs.push("-c:a", "aac");
      ffmpegArgs.push("-b:a", quality);
    } else if (format === "wav") {
      ffmpegArgs.push("-c:a", "pcm_s16le");
    } else if (format === "flac") {
      ffmpegArgs.push("-c:a", "flac");
    }

    // Metadata tags
    if (embedMetadata) {
      ffmpegArgs.push("-metadata", `title=${videoTitle}`);
      ffmpegArgs.push("-metadata", `artist=${videoArtist}`);
      ffmpegArgs.push("-metadata", `comment=Converted by YT2MP3 Studio`);
    }

    ffmpegArgs.push("-y", outputPath);

    await execFileAsync("ffmpeg", ffmpegArgs);

    if (!fs.existsSync(outputPath)) {
      throw new Error("Pengekodan audio FFmpeg gagal.");
    }

    // Step 3: Read converted audio into buffer
    const audioBuffer = fs.readFileSync(outputPath);

    // MIME type mapping
    const mimeTypes: Record<string, string> = {
      mp3: "audio/mpeg",
      m4a: "audio/mp4",
      wav: "audio/wav",
      flac: "audio/flac",
    };
    const mimeType = mimeTypes[format] || "application/octet-stream";

    // Clean up temp directory asynchronously
    setTimeout(() => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {}
    }, 3000);

    // Return downloadable file stream response
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeTitle)}.${format}"`,
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
          "Gagal memproses audio. Sila pastikan format dan julat masa trim adalah betul.",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
