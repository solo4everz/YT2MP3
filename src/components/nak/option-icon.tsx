"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

function kebabToPascal(kebab: string): string {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function OptionIcon({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) {
  if (!icon) return null;
  const name = kebabToPascal(icon);
  const Cmp = (
    Icons as unknown as Record<string, LucideIcon | undefined>
  )[name];
  if (!Cmp) return null;
  return <Cmp className={className} aria-hidden />;
}
