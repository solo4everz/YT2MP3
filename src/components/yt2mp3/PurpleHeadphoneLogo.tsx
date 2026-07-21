"use client";

import React from "react";

interface HeadphoneLogoProps {
  size?: number;
  className?: string;
}

export function PurpleHeadphoneLogo({ size = 40, className = "" }: HeadphoneLogoProps) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-xl bg-black border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full text-purple-400 hover:scale-105 transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Headband Arc */}
        <path d="M 128 260 A 128 128 0 0 1 384 260" stroke="#a855f7" strokeWidth="36" strokeLinecap="round" />
        <path d="M 128 260 A 128 128 0 0 1 384 260" stroke="#e9d5ff" strokeWidth="12" strokeLinecap="round" opacity="0.8" />

        {/* Outer Cushion */}
        <path d="M 160 210 A 100 100 0 0 1 352 210" stroke="#581c87" strokeWidth="20" strokeLinecap="round" />

        {/* Left Ear Cup */}
        <rect x="96" y="240" width="56" height="110" rx="28" fill="#18181b" stroke="#a855f7" strokeWidth="8" />
        <rect x="110" y="250" width="36" height="90" rx="18" fill="#a855f7" />
        <rect x="84" y="260" width="20" height="70" rx="10" fill="#00f0ff" />

        {/* Right Ear Cup */}
        <rect x="360" y="240" width="56" height="110" rx="28" fill="#18181b" stroke="#a855f7" strokeWidth="8" />
        <rect x="366" y="250" width="36" height="90" rx="18" fill="#a855f7" />
        <rect x="408" y="260" width="20" height="70" rx="10" fill="#00f0ff" />

        {/* Sound Equalizer Waves */}
        <rect x="206" y="290" width="10" height="30" rx="5" fill="#ff2a85" />
        <rect x="226" y="270" width="10" height="70" rx="5" fill="#00f0ff" />
        <rect x="246" y="250" width="10" height="110" rx="5" fill="#ffe600" />
        <rect x="266" y="275" width="10" height="60" rx="5" fill="#00f0ff" />
        <rect x="286" y="295" width="10" height="20" rx="5" fill="#ff2a85" />
      </svg>
    </div>
  );
}
