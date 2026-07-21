"use client";

import React from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const mangaTheme = createTheme({
  primaryColor: "pink",
  colors: {
    pink: [
      "#ffe0ef",
      "#ffb3d7",
      "#ff80be",
      "#ff4da6",
      "#ff2a85", // main anime pink
      "#e6006c",
      "#b30054",
      "#80003c",
      "#4d0024",
      "#1a000c",
    ],
    cyan: [
      "#e0fcff",
      "#b3f8ff",
      "#80f4ff",
      "#4df0ff",
      "#00f0ff", // cyber cyan
      "#00c4d4",
      "#0097a3",
      "#006a73",
      "#003d42",
      "#001112",
    ],
    yellow: [
      "#fffae0",
      "#fff3b3",
      "#ffe880",
      "#ffde4d",
      "#ffe600", // anime yellow
      "#cccccc",
      "#999900",
      "#666600",
      "#333300",
      "#111100",
    ],
  },
  fontFamily: "'Geist', 'Outfit', sans-serif",
  headings: {
    fontFamily: "'Geist', 'Outfit', sans-serif",
    fontWeight: "900",
  },
  defaultRadius: "md",
});

export function MantineAppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={mangaTheme} defaultColorScheme="dark">
      <Notifications position="top-right" zIndex={1000} />
      {children}
    </MantineProvider>
  );
}
