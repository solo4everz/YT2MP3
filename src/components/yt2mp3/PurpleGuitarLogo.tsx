"use client";

import React from "react";

interface GuitarLogoProps {
  size?: number;
  className?: string;
}

export function PurpleGuitarLogo({ size = 40, className = "" }: GuitarLogoProps) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-xl bg-black border-2 border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full text-purple-400 transform -rotate-12 hover:rotate-0 transition-transform duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="246" y="70" width="20" height="240" fill="#c084fc" rx="4" />
        <path d="M 234 40 L 278 40 L 270 85 L 242 85 Z" fill="#9333ea" stroke="#e9d5ff" strokeWidth="6" />
        <circle cx="226" cy="52" r="7" fill="#e9d5ff" />
        <circle cx="226" cy="70" r="7" fill="#e9d5ff" />
        <circle cx="286" cy="52" r="7" fill="#e9d5ff" />
        <circle cx="286" cy="70" r="7" fill="#e9d5ff" />

        <path
          d="M 256 270 
             C 200 245, 140 295, 155 365 
             C 165 415, 195 455, 256 455 
             C 317 455, 347 415, 357 365 
             C 372 295, 312 245, 256 270 Z"
          fill="#9333ea"
          stroke="#e9d5ff"
          strokeWidth="10"
        />

        <path
          d="M 256 295 
             C 220 280, 180 310, 188 355 
             C 194 385, 215 425, 256 425 
             C 297 425, 318 385, 324 355 
             C 332 310, 292 280, 256 295 Z"
          fill="#581c87"
          opacity="0.8"
        />

        <rect x="232" y="315" width="48" height="14" rx="4" fill="#18181b" stroke="#e9d5ff" strokeWidth="3" />
        <rect x="232" y="348" width="48" height="14" rx="4" fill="#18181b" stroke="#e9d5ff" strokeWidth="3" />

        <rect x="226" y="390" width="60" height="18" rx="4" fill="#c084fc" />

        <line x1="247" y1="58" x2="247" y2="390" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="253" y1="58" x2="253" y2="390" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="259" y1="58" x2="259" y2="390" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
        <line x1="265" y1="58" x2="265" y2="390" stroke="#ffffff" strokeWidth="3" opacity="0.9" />
      </svg>
    </div>
  );
}
