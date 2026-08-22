import { Link } from "@tanstack/react-router";
import { Heart, Smartphone, Monitor, Maximize2, Minimize2, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="glass mt-16 border-t border-border/40 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
          © 2026 Canastra Royale · Experiência Premium de Buraco e Canastra
        </p>
      </div>
    </footer>
  );
}
