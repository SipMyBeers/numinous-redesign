"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";

// ─── Pixel drawing ───────────────────────────────────────────────
type Sprite = number[][];
type Palette = Record<number, string>;

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  palette: Palette,
  x: number,
  y: number,
  scale: number
) {
  const h = sprite.length;
  const w = sprite[0].length;
  const ox = x - (w * scale) / 2;
  const oy = y - (h * scale) / 2;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const v = sprite[r][c];
      if (v === 0) continue;
      const color = palette[v];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(ox + c * scale), Math.floor(oy + r * scale), scale, scale);
    }
  }
}

// Helper: render a sprite to an offscreen canvas and return a data URL
function spriteToDataURL(sprite: Sprite, palette: Palette, scale: number): string {
  const h = sprite.length;
  const w = sprite[0].length;
  const canvas = document.createElement("canvas");
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const v = sprite[r][c];
      if (v === 0) continue;
      const color = palette[v];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(c * scale, r * scale, scale, scale);
    }
  }
  return canvas.toDataURL();
}

// ═══════════════════════════════════════════════════════════════════
// SPRITES — All sculpture-inspired, elemental forge monsters
// ═══════════════════════════════════════════════════════════════════

// Player — The Forgekeeper (angular ship, inspired by Female Twin)
const PLAYER: Sprite = [
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 2, 3, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 3, 3, 3, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1],
  [1, 2, 1, 0, 1, 2, 1, 0, 1, 2, 1],
  [1, 1, 0, 0, 0, 2, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 4, 5, 4, 0, 0, 0, 0],
  [0, 0, 0, 4, 5, 6, 5, 4, 0, 0, 0],
];
const PLAYER_PAL: Palette = {
  1: "#52525b", 2: "#a1a1aa", 3: "#60b5ff", 4: "#ff6b35", 5: "#ffaa00", 6: "#ffffff",
};

// ── ECHEVERIA — Earth elemental, crystal rosette ──
const ECHEVERIA_A: Sprite = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 3, 2, 3, 2, 1, 0],
  [1, 2, 3, 4, 4, 4, 3, 2, 1],
  [1, 2, 2, 4, 5, 4, 2, 2, 1],
  [1, 2, 3, 4, 4, 4, 3, 2, 1],
  [0, 1, 2, 3, 2, 3, 2, 1, 0],
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
];
const ECHEVERIA_B: Sprite = [
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 2, 1, 2, 1, 2, 1, 0],
  [1, 2, 3, 2, 2, 2, 3, 2, 1],
  [0, 1, 2, 4, 4, 4, 2, 1, 0],
  [1, 2, 2, 4, 5, 4, 2, 2, 1],
  [0, 1, 2, 4, 4, 4, 2, 1, 0],
  [1, 2, 3, 2, 2, 2, 3, 2, 1],
  [0, 1, 2, 1, 2, 1, 2, 1, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
];
const ECHEVERIA_PAL: Palette = {
  1: "#065f46", 2: "#059669", 3: "#10b981", 4: "#34d399", 5: "#a7f3d0",
};

// ── FATA — Fire elemental, spinning flame ──
const FATA_A: Sprite = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 1, 0, 3, 0, 1, 0, 0],
  [0, 1, 0, 2, 3, 2, 0, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [0, 1, 0, 2, 3, 2, 0, 1, 0],
  [0, 0, 1, 0, 3, 0, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
];
const FATA_B: Sprite = [
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 2, 0, 2, 1, 0, 0],
  [0, 1, 0, 0, 3, 0, 0, 1, 0],
  [1, 2, 0, 3, 4, 3, 0, 2, 1],
  [0, 0, 3, 4, 5, 4, 3, 0, 0],
  [1, 2, 0, 3, 4, 3, 0, 2, 1],
  [0, 1, 0, 0, 3, 0, 0, 1, 0],
  [0, 0, 1, 2, 0, 2, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
];
const FATA_PAL: Palette = {
  1: "#7c2d12", 2: "#c2410c", 3: "#f97316", 4: "#fbbf24", 5: "#ffffff",
};

// ── GILLY — Shadow elemental, winged beast ──
const GILLY_A: Sprite = [
  [1, 2, 0, 0, 0, 0, 0, 2, 1],
  [0, 1, 2, 0, 0, 0, 2, 1, 0],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 1, 3, 4, 3, 1, 0, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
];
const GILLY_B: Sprite = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 2, 0, 0, 0, 0, 0, 2, 1],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 1, 3, 4, 3, 1, 0, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
];
const GILLY_PAL: Palette = {
  1: "#4c1d95", 2: "#7c3aed", 3: "#a78bfa", 4: "#e9d5ff",
};

// ── DIVI — Arcane elemental, rotating diamond ──
const DIVI_A: Sprite = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [1, 2, 3, 4, 5, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
];
const DIVI_B: Sprite = [
  [0, 0, 0, 0, 1, 0, 0, 0, 6],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [1, 2, 3, 4, 5, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [6, 0, 0, 0, 1, 0, 0, 0, 0],
];
const DIVI_PAL: Palette = {
  1: "#881337", 2: "#e11d48", 3: "#fb7185", 4: "#fda4af", 5: "#ffffff", 6: "#fecdd3",
};

// ── SPRINGWATER — Water elemental, flowing form ──
const SPRING_A: Sprite = [
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 3, 2, 2, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [1, 2, 3, 4, 4, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 1, 0, 1, 2, 1, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
];
const SPRING_B: Sprite = [
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 3, 2, 3, 2, 1, 0],
  [1, 2, 3, 4, 3, 4, 3, 2, 1],
  [1, 2, 3, 4, 4, 4, 3, 2, 1],
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 0, 1, 0, 2, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
];
const SPRING_PAL: Palette = {
  1: "#164e63", 2: "#0891b2", 3: "#22d3ee", 4: "#a5f3fc",
};

// ── LE ATTRATA — Lightning elemental, jagged energy ──
const ATTRATA_A: Sprite = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 1, 2, 2, 1, 2, 2, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [0, 1, 2, 4, 5, 4, 2, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [0, 1, 2, 2, 1, 2, 2, 1, 0],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
];
const ATTRATA_B: Sprite = [
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 2, 3, 3, 4, 3, 3, 2, 0],
  [1, 1, 2, 4, 5, 4, 2, 1, 1],
  [0, 2, 3, 3, 4, 3, 3, 2, 0],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
];
const ATTRATA_PAL: Palette = {
  1: "#713f12", 2: "#ca8a04", 3: "#eab308", 4: "#fde047", 5: "#fefce8",
};

// ── FEMALE TWIN — Steel elemental, mirrored form ──
const TWIN_A: Sprite = [
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 2, 1, 2, 1, 0, 0],
  [0, 1, 2, 3, 2, 3, 2, 1, 0],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [1, 2, 3, 4, 5, 4, 3, 2, 1],
  [1, 2, 3, 3, 4, 3, 3, 2, 1],
  [0, 1, 2, 3, 2, 3, 2, 1, 0],
  [0, 0, 1, 2, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
];
const TWIN_B: Sprite = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [1, 2, 3, 2, 1, 2, 3, 2, 1],
  [0, 2, 3, 4, 3, 4, 3, 2, 0],
  [1, 2, 3, 4, 5, 4, 3, 2, 1],
  [0, 2, 3, 4, 3, 4, 3, 2, 0],
  [1, 2, 3, 2, 1, 2, 3, 2, 1],
  [0, 1, 2, 1, 0, 1, 2, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
];
const TWIN_PAL: Palette = {
  1: "#3f3f46", 2: "#71717a", 3: "#a1a1aa", 4: "#d4d4d8", 5: "#ffffff",
};

// ── PORTAL BOSS — Void elemental, massive ring ──
const PORTAL_A: Sprite = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 2, 2, 0, 2, 2, 1, 1, 0, 0],
  [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 2, 0, 0, 0, 3, 3, 3, 0, 0, 0, 2, 1],
  [1, 2, 0, 0, 3, 4, 4, 4, 3, 0, 0, 2, 1],
  [1, 0, 0, 0, 3, 4, 5, 4, 3, 0, 0, 0, 1],
  [1, 2, 0, 0, 3, 4, 4, 4, 3, 0, 0, 2, 1],
  [1, 2, 0, 0, 0, 3, 3, 3, 0, 0, 0, 2, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0],
  [0, 0, 1, 1, 2, 2, 0, 2, 2, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
];
const PORTAL_B: Sprite = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 2, 2, 2, 0, 1, 1, 0, 0],
  [0, 1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1],
  [1, 2, 0, 0, 3, 4, 5, 4, 3, 0, 0, 2, 1],
  [1, 2, 0, 0, 3, 5, 5, 5, 3, 0, 0, 2, 1],
  [1, 2, 0, 0, 3, 4, 5, 4, 3, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1, 0],
  [0, 0, 1, 1, 0, 2, 2, 2, 0, 1, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
];
const PORTAL_PAL: Palette = {
  1: "#1e3a5f", 2: "#3b82f6", 3: "#60a5fa", 4: "#93c5fd", 5: "#ffffff",
};

// Bullet sprites
const P_BULLET: Sprite = [[1], [2], [2], [1]];
const P_BULLET_PAL: Palette = { 1: "#ffaa00", 2: "#ff6b35" };
const E_BULLET: Sprite = [[0, 1, 0], [1, 2, 1], [0, 1, 0]];

// Forge (at bottom of screen)
const FORGE_SPRITE: Sprite = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 3, 3, 4, 3, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 5, 5, 5, 4, 3, 2, 1, 0],
  [1, 2, 2, 3, 4, 5, 5, 5, 4, 3, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const FORGE_PAL: Palette = {
  1: "#52525b", 2: "#71717a", 3: "#f97316", 4: "#fbbf24", 5: "#ffffff",
};

// ─── Enemy definitions ───────────────────────────────────────────
interface EnemyDef {
  name: string;
  element: string;
  color: string;
  points: number;
  hp: number;
  sprites: [Sprite, Sprite];
  palette: Palette;
  bulletPalette: Palette;
  pixelScale: number;
  hitRadius: number;
  shootRate: number;
  desc: string;
}

const ENEMY_DEFS: EnemyDef[] = [
  {
    name: "Echeveria", element: "Earth", color: "#22c55e", points: 100, hp: 1,
    sprites: [ECHEVERIA_A, ECHEVERIA_B], palette: ECHEVERIA_PAL,
    bulletPalette: { 1: "#065f46", 2: "#34d399" },
    pixelScale: 3, hitRadius: 13, shootRate: 0.002, desc: "Crystal rosette that fragments on death",
  },
  {
    name: "Fata", element: "Fire", color: "#f97316", points: 150, hp: 1,
    sprites: [FATA_A, FATA_B], palette: FATA_PAL,
    bulletPalette: { 1: "#7c2d12", 2: "#fbbf24" },
    pixelScale: 3, hitRadius: 13, shootRate: 0.003, desc: "Spinning flame that shoots fireballs",
  },
  {
    name: "Gilly", element: "Shadow", color: "#a78bfa", points: 200, hp: 2,
    sprites: [GILLY_A, GILLY_B], palette: GILLY_PAL,
    bulletPalette: { 1: "#4c1d95", 2: "#e9d5ff" },
    pixelScale: 3, hitRadius: 12, shootRate: 0.004, desc: "Shadow wings — dives fast and erratic",
  },
  {
    name: "Divi", element: "Arcane", color: "#fb7185", points: 250, hp: 2,
    sprites: [DIVI_A, DIVI_B], palette: DIVI_PAL,
    bulletPalette: { 1: "#881337", 2: "#fda4af" },
    pixelScale: 3, hitRadius: 14, shootRate: 0.005, desc: "Arcane diamond with orbiting shards",
  },
  {
    name: "Springwater", element: "Water", color: "#22d3ee", points: 180, hp: 2,
    sprites: [SPRING_A, SPRING_B], palette: SPRING_PAL,
    bulletPalette: { 1: "#164e63", 2: "#a5f3fc" },
    pixelScale: 3, hitRadius: 13, shootRate: 0.003, desc: "Flowing water spirit — splits when hit",
  },
  {
    name: "Le Attrata", element: "Lightning", color: "#eab308", points: 300, hp: 3,
    sprites: [ATTRATA_A, ATTRATA_B], palette: ATTRATA_PAL,
    bulletPalette: { 1: "#713f12", 2: "#fde047" },
    pixelScale: 3, hitRadius: 14, shootRate: 0.006, desc: "Lightning conduit — rapid-fire bolts",
  },
  {
    name: "Female Twin", element: "Steel", color: "#a1a1aa", points: 350, hp: 3,
    sprites: [TWIN_A, TWIN_B], palette: TWIN_PAL,
    bulletPalette: { 1: "#3f3f46", 2: "#d4d4d8" },
    pixelScale: 3, hitRadius: 14, shootRate: 0.004, desc: "Mirrored steel form — high armor",
  },
  {
    name: "The Portal", element: "Void", color: "#60a5fa", points: 1000, hp: 12,
    sprites: [PORTAL_A, PORTAL_B], palette: PORTAL_PAL,
    bulletPalette: { 1: "#1e3a5f", 2: "#93c5fd" },
    pixelScale: 3, hitRadius: 20, shootRate: 0.012, desc: "BOSS — Gateway to the void",
  },
];

// ─── Sound Effects (Web Audio API) ────────────────────────────────
let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
  if (!_audioCtx) _audioCtx = new AudioContext();
  if (_audioCtx.state === "suspended") _audioCtx.resume();
  return _audioCtx;
}

let _muted = false;
function setMuted(m: boolean) { _muted = m; }
function isMuted() { return _muted; }

function playSound(type: "shoot" | "hit" | "explode" | "playerHit" | "waveComplete" | "gameOver" | "powerUp") {
  if (_muted) return;
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    switch (type) {
      case "shoot": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case "hit": {
        const bufSize = ctx.sampleRate * 0.1;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.1, now);
        oscGain.gain.linearRampToValueAtTime(0, now + 0.1);
        noise.connect(gain).connect(ctx.destination);
        osc.connect(oscGain).connect(ctx.destination);
        noise.start(now);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case "explode": {
        const bufSize = ctx.sampleRate * 0.2;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize) * 0.8;
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.15, now);
        oscGain.gain.linearRampToValueAtTime(0, now + 0.2);
        noise.connect(gain).connect(ctx.destination);
        osc.connect(oscGain).connect(ctx.destination);
        noise.start(now);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case "playerHit": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case "waveComplete": {
        [0, 1, 2].forEach((i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(500 + i * 200, now + i * 0.08);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.1);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.1);
        });
        break;
      }
      case "gameOver": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case "powerUp": {
        [0, 1, 2, 3].forEach((i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600 + i * 250, now + i * 0.06);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.1, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0, now + i * 0.06 + 0.08);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.08);
        });
        break;
      }
    }
  } catch { /* ignore audio errors */ }
}

// ─── Leaderboard ─────────────────────────────────────────────────
interface LeaderboardEntry {
  initials: string;
  score: number;
  wave: number;
}

const LB_KEY = "numinous-forge-scores";

function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch { return []; }
}

function isHighScore(score: number): boolean {
  const lb = getLeaderboard();
  return lb.length < 10 || score > (lb[lb.length - 1]?.score ?? 0);
}

function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  const top10 = lb.slice(0, 10);
  try { localStorage.setItem(LB_KEY, JSON.stringify(top10)); } catch { /* */ }
  return top10;
}

// ─── Types ───────────────────────────────────────────────────────
interface Bullet { x: number; y: number; dx: number; dy: number; isEnemy: boolean; color: string }
interface Particle { x: number; y: number; dx: number; dy: number; life: number; maxLife: number; color: string }
interface Star { x: number; y: number; speed: number; brightness: number }
interface Enemy {
  x: number; y: number; formX: number; formY: number;
  type: number; hp: number; alive: boolean;
  state: "entering" | "formation" | "diving" | "returning";
  enterPath: { x: number; y: number }[];
  enterIdx: number; diveTimer: number; diveAngle: number;
  shootCooldown: number; animFrame: number; animTimer: number;
}

// ─── Path generation ─────────────────────────────────────────────
function makeEnterPath(
  sx: number, sy: number, tx: number, ty: number,
  side: "left" | "right" | "top", W: number, H: number
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const steps = 80;
  if (side === "left" || side === "right") {
    const mx = W / 2 + (side === "left" ? 100 : -100);
    const my = H * 0.3;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      let x: number, y: number;
      if (t < 0.35) {
        const s = t / 0.35;
        x = sx + (mx - sx) * s;
        y = sy + (my - sy) * s + Math.sin(s * Math.PI) * -70;
      } else if (t < 0.65) {
        const s = (t - 0.35) / 0.3;
        const a = s * Math.PI * 2;
        const r = 45;
        x = mx + Math.cos(a) * r * (side === "left" ? 1 : -1);
        y = my + Math.sin(a) * r;
      } else {
        const s = (t - 0.65) / 0.35;
        x = mx + (tx - mx) * s;
        y = my + (ty - my) * s;
      }
      pts.push({ x, y });
    }
  } else {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push({
        x: sx + (tx - sx) * t + Math.sin(t * Math.PI * 2) * 60,
        y: -30 + (ty + 30) * t,
      });
    }
  }
  return pts;
}

// ─── Wave generation ─────────────────────────────────────────────
function generateWave(wave: number, W: number, H: number): Enemy[] {
  const enemies: Enemy[] = [];
  const isBoss = wave % 5 === 0;

  if (isBoss) {
    // Boss
    enemies.push(mkEnemy(7, W / 2, 70, W / 2, -40, "top", W, H, wave));
    // Escorts — mix of types
    const n = 6 + Math.floor(wave / 5) * 2;
    for (let i = 0; i < n; i++) {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const fx = W / 2 - 125 + col * 50;
      const fy = 130 + row * 38;
      const ti = Math.min(i % 7, 6); // cycle through non-boss types
      const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
      enemies.push(mkEnemy(ti, fx, fy, side === "left" ? -30 : W + 30, -20 - i * 8, side, W, H, wave));
    }
  } else {
    // Regular waves — introduce enemy types gradually
    const maxType = Math.min(1 + Math.floor(wave / 2), 7); // unlock new enemies every 2 waves
    const rows = Math.min(2 + Math.floor(wave / 2), 5);
    const cols = Math.min(5 + Math.floor(wave / 3), 9);
    for (let r = 0; r < rows; r++) {
      const ti = Math.min(r, maxType - 1);
      for (let c = 0; c < cols; c++) {
        const fx = W / 2 - ((cols - 1) * 40) / 2 + c * 40;
        const fy = 50 + r * 38;
        const side: "left" | "right" | "top" = r % 3 === 0 ? "top" : c < cols / 2 ? "left" : "right";
        const sx = side === "top" ? fx : side === "left" ? -30 : W + 30;
        const sy = -30 - (r * cols + c) * 6;
        enemies.push(mkEnemy(ti, fx, fy, sx, sy, side, W, H, wave));
      }
    }
  }
  return enemies;
}

function mkEnemy(
  ti: number, fx: number, fy: number,
  sx: number, sy: number,
  side: "left" | "right" | "top",
  W: number, H: number, wave: number
): Enemy {
  const def = ENEMY_DEFS[ti];
  return {
    x: sx, y: sy, formX: fx, formY: fy,
    type: ti, hp: def.hp + Math.floor(wave / 6),
    alive: true, state: "entering",
    enterPath: makeEnterPath(sx, sy, fx, fy, side, W, H),
    enterIdx: 0,
    diveTimer: 200 + Math.random() * 500,
    diveAngle: 0,
    shootCooldown: 60 + Math.random() * 120,
    animFrame: 0, animTimer: 0,
  };
}

// ─── Game state ──────────────────────────────────────────────────
interface GameState {
  player: { x: number; y: number; lives: number; respawnTimer: number };
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  stars: Star[];
  score: number;
  wave: number;
  time: number;
  keys: Set<string>;
  invincible: number;
  shakeTimer: number;
  combo: number;
  comboTimer: number;
  waveText: number;
  formShiftX: number;
  formDir: number;
  forgeHp: number;
  maxForgeHp: number;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lavaRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef(1);
  const [screen, setScreen] = useState<"menu" | "playing" | "gameover">("menu");
  const [finalScore, setFinalScore] = useState(0);
  const [finalWave, setFinalWave] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const gameRef = useRef<GameState | null>(null);
  const [muted, setMutedState] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showInitials, setShowInitials] = useState(false);
  const [initials, setInitials] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const touchControlsRef = useRef<{ left: boolean; right: boolean; fire: boolean }>({ left: false, right: false, fire: false });
  const swipeRef = useRef<{ startX: number; startY: number; active: boolean }>({ startX: 0, startY: 0, active: false });

  // Hide nav/footer
  useEffect(() => {
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    const main = document.querySelector("main");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    if (main) main.style.padding = "0";
    document.body.style.overflow = "hidden";
    return () => {
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
      if (main) main.style.padding = "";
      document.body.style.overflow = "";
    };
  }, []);

  // Generate pixel art card images for menu
  useEffect(() => {
    const imgs = ENEMY_DEFS.map((def) => spriteToDataURL(def.sprites[0], def.palette, 6));
    setCardImages(imgs);
  }, []);

  // ── WebGL Lava Background ──
  useEffect(() => {
    const canvas = lavaRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    let W: number, H: number;
    let dead = false;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      gl!.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    const vsSource = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;
    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_wave;

      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
      float snoise(vec2 v){
        const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
        vec2 i=floor(v+dot(v,C.yy));
        vec2 x0=v-i+dot(i,C.xx);
        vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
        vec4 x12=x0.xyxy+C.xxzz;
        x12.xy-=i1;
        i=mod289(i);
        vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
        vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
        m=m*m;m=m*m;
        vec3 x=2.0*fract(p*C.www)-1.0;
        vec3 h=abs(x)-0.5;
        vec3 ox=floor(x+0.5);
        vec3 a0=x-ox;
        m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
        vec3 g;
        g.x=a0.x*x0.x+h.x*x0.y;
        g.yz=a0.yz*x12.xz+h.yz*x12.yw;
        return 130.0*dot(m,g);
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/u_resolution;
        float t=u_time*0.15;
        float w=u_wave;

        vec2 p=uv*3.0;
        float warp=snoise(p*0.5+t*0.3)*0.5;
        p+=warp;

        float n1=snoise(p+vec2(t*0.2,t*0.15));
        float n2=snoise(p*1.5+vec2(-t*0.15,t*0.25));
        float n3=snoise(p*0.7+vec2(t*0.1,-t*0.2));

        // Color palettes that shift with wave
        // Phase 0: molten orange/red (waves 1-4)
        // Phase 1: purple/magenta (waves 5-9)
        // Phase 2: electric blue (waves 10-14)
        // Phase 3: toxic green (waves 15-19)
        // Phase 4: white-hot (waves 20+)
        float phase=w/5.0;

        vec3 cDeep=vec3(0.06,0.03,0.02);
        vec3 cHot,cMid,cAccent;

        // Molten orange/red base
        vec3 hotA=vec3(0.95,0.30,0.05);
        vec3 midA=vec3(0.80,0.55,0.08);
        vec3 accA=vec3(1.0,0.85,0.20);

        // Purple/magenta
        vec3 hotB=vec3(0.70,0.10,0.50);
        vec3 midB=vec3(0.45,0.05,0.65);
        vec3 accB=vec3(1.0,0.30,0.80);

        // Electric blue
        vec3 hotC=vec3(0.10,0.35,0.90);
        vec3 midC=vec3(0.05,0.60,0.80);
        vec3 accC=vec3(0.30,0.85,1.0);

        // Toxic green
        vec3 hotD=vec3(0.10,0.80,0.20);
        vec3 midD=vec3(0.20,0.60,0.10);
        vec3 accD=vec3(0.50,1.0,0.30);

        // White-hot
        vec3 hotE=vec3(1.0,0.95,0.85);
        vec3 midE=vec3(0.95,0.60,0.30);
        vec3 accE=vec3(1.0,1.0,0.90);

        // Smooth blend between phases
        float f=fract(phase);
        float p0=floor(phase);

        if(p0<1.0){
          cHot=mix(hotA,hotB,f); cMid=mix(midA,midB,f); cAccent=mix(accA,accB,f);
        } else if(p0<2.0){
          cHot=mix(hotB,hotC,f); cMid=mix(midB,midC,f); cAccent=mix(accB,accC,f);
        } else if(p0<3.0){
          cHot=mix(hotC,hotD,f); cMid=mix(midC,midD,f); cAccent=mix(accC,accD,f);
        } else {
          cHot=mix(hotD,hotE,f); cMid=mix(midD,midE,f); cAccent=mix(accD,accE,f);
        }

        // Mix organic flow
        vec3 col=mix(cDeep,cHot,smoothstep(-0.3,0.5,n1)*0.5);
        col=mix(col,cMid,smoothstep(-0.2,0.6,n2)*0.35);

        // Lava streaks
        float streak1=smoothstep(0.38,0.42,abs(n1+n2*0.5));
        float streak2=smoothstep(0.35,0.40,abs(n2+n3*0.5));
        float streak3=smoothstep(0.30,0.36,abs(n1*0.7+n3*0.8));

        col=mix(col,cAccent,streak1*0.6);
        col=mix(col,cHot*1.3,streak2*0.5);
        col=mix(col,cAccent*0.7,streak3*0.25);

        // Intensity increases with waves
        float intensity=0.30+min(w*0.008,0.15);
        col*=intensity;

        // Vignette
        float vig=1.0-dot(uv-0.5,uv-0.5)*0.6;
        col*=vig;

        // Dark base blend
        vec3 base=vec3(0.04,0.02,0.02);
        col=col+base*(1.0-length(col));

        gl_FragColor=vec4(col,1.0);
      }
    `;

    function compileShader(src: string, type: number) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uWave = gl.getUniformLocation(prog, "u_wave");

    const startTime = Date.now();

    function render() {
      if (dead) return;
      const t = (Date.now() - startTime) / 1000;
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uRes, W, H);
      gl!.uniform1f(uWave, waveRef.current);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();

    return () => {
      dead = true;
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Load high score + leaderboard + detect touch
  useEffect(() => {
    const hs = parseInt(localStorage.getItem("forgeDefendersHigh") || "0");
    if (hs) setHighScore(hs);
    setLeaderboard(getLeaderboard());
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width;
    const H = canvas.height;

    const stars: Star[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        speed: 0.2 + Math.random() * 0.8, brightness: 0.2 + Math.random() * 0.8,
      });
    }

    gameRef.current = {
      player: { x: W / 2, y: H - 80, lives: 3, respawnTimer: 0 },
      bullets: [], enemies: generateWave(1, W, H),
      particles: [], stars,
      score: 0, wave: 1, time: 0,
      keys: new Set(), invincible: 120,
      shakeTimer: 0, combo: 0, comboTimer: 0,
      waveText: 120,
      formShiftX: 0, formDir: 1,
      forgeHp: 100, maxForgeHp: 100,
    };
    waveRef.current = 1;
    setScreen("playing");
  }, []);

  // Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      gameRef.current?.keys.add(e.key);
      if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => gameRef.current?.keys.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [screen]);

  // Touch
  const touchRef = useRef<{ x: number; active: boolean }>({ x: 0, active: false });
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const onT = (e: TouchEvent) => { e.preventDefault(); const t = e.touches[0]; if (t) { touchRef.current.x = t.clientX; touchRef.current.active = true; } };
    const onE = () => { touchRef.current.active = false; };
    c.addEventListener("touchstart", onT, { passive: false });
    c.addEventListener("touchmove", onT, { passive: false });
    c.addEventListener("touchend", onE);
    return () => { c.removeEventListener("touchstart", onT); c.removeEventListener("touchmove", onT); c.removeEventListener("touchend", onE); };
  }, []);

  // ── Game loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let shootCD = 0;

    function spawnP(x: number, y: number, color: string, n: number) {
      const g = gameRef.current!;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 3;
        g.particles.push({ x, y, dx: Math.cos(a) * sp, dy: Math.sin(a) * sp, life: 25 + Math.random() * 15, maxLife: 40, color });
      }
    }

    function endGame(g: GameState) {
      if (g.score > highScore) {
        setHighScore(g.score);
        localStorage.setItem("forgeDefendersHigh", String(g.score));
      }
      setFinalScore(g.score);
      setFinalWave(g.wave);
      playSound("gameOver");
      if (isHighScore(g.score) && g.score > 0) {
        setShowInitials(true);
        setInitials("");
      }
      setScreen("gameover");
    }

    function loop() {
      const g = gameRef.current;
      if (!g) return;
      const W = canvas!.width;
      const H = canvas!.height;
      g.time++;
      const { player, keys } = g;

      // Input
      if (player.respawnTimer > 0) { player.respawnTimer--; }
      else {
        const spd = 4;
        const tc = touchControlsRef.current;
        if (keys.has("ArrowLeft") || keys.has("a") || tc.left) player.x -= spd;
        if (keys.has("ArrowRight") || keys.has("d") || tc.right) player.x += spd;
        if (keys.has("ArrowUp") || keys.has("w")) player.y -= spd * 0.7;
        if (keys.has("ArrowDown") || keys.has("s")) player.y += spd * 0.7;
        if (touchRef.current.active) {
          const diff = touchRef.current.x - player.x;
          if (Math.abs(diff) > 2) player.x += diff * 0.1;
        }
        player.x = Math.max(20, Math.min(W - 20, player.x));
        player.y = Math.max(H * 0.35, Math.min(H - 50, player.y));

        shootCD--;
        if ((keys.has(" ") || keys.has("z") || touchRef.current.active || tc.fire) && shootCD <= 0) {
          g.bullets.push({ x: player.x - 4, y: player.y - 18, dx: 0, dy: -8, isEnemy: false, color: "#ff6b35" });
          g.bullets.push({ x: player.x + 4, y: player.y - 18, dx: 0, dy: -8, isEnemy: false, color: "#ff6b35" });
          shootCD = 8;
          playSound("shoot");
        }
      }

      // Formation sway
      g.formShiftX += g.formDir * 0.3;
      if (Math.abs(g.formShiftX) > 40) g.formDir *= -1;

      // Update enemies
      let aliveCount = 0;
      for (const e of g.enemies) {
        if (!e.alive) continue;
        aliveCount++;
        const def = ENEMY_DEFS[e.type];
        e.animTimer++;
        if (e.animTimer > (e.type === 1 ? 8 : 15)) { e.animFrame = 1 - e.animFrame; e.animTimer = 0; }

        switch (e.state) {
          case "entering":
            if (e.enterIdx < e.enterPath.length) {
              const pt = e.enterPath[e.enterIdx];
              e.x = pt.x; e.y = pt.y; e.enterIdx++;
            } else { e.state = "formation"; }
            break;
          case "formation":
            e.x += (e.formX + g.formShiftX - e.x) * 0.05;
            e.y += (e.formY - e.y) * 0.05;
            e.diveTimer--;
            if (e.diveTimer <= 0 && Math.random() < 0.008 + g.wave * 0.002) {
              e.state = "diving";
              e.diveAngle = Math.atan2(player.y - e.y, player.x - e.x);
            }
            break;
          case "diving":
            e.x += Math.cos(e.diveAngle) * (3 + g.wave * 0.15);
            e.y += Math.sin(e.diveAngle) * (3 + g.wave * 0.15);
            e.diveAngle += 0.012;
            // Damage forge if enemy reaches bottom
            if (e.y > H - 30) {
              g.forgeHp -= 5;
              spawnP(e.x, H - 20, "#ff6b35", 8);
              e.state = "returning"; e.y = -30; e.x = e.formX;
              g.shakeTimer = 8;
              if (g.forgeHp <= 0) { endGame(g); return; }
            }
            break;
          case "returning":
            e.y += 2;
            e.x += (e.formX + g.formShiftX - e.x) * 0.03;
            if (Math.abs(e.y - e.formY) < 3) { e.state = "formation"; e.diveTimer = 200 + Math.random() * 400; }
            break;
        }

        // Shoot
        e.shootCooldown--;
        if (e.shootCooldown <= 0 && Math.random() < def.shootRate + g.wave * 0.0004) {
          const a = Math.atan2(player.y - e.y, player.x - e.x);
          const sp = 2.5 + g.wave * 0.12;
          g.bullets.push({ x: e.x, y: e.y + 8, dx: Math.cos(a) * sp, dy: Math.sin(a) * sp, isEnemy: true, color: def.color });
          e.shootCooldown = 40 + Math.random() * 80;
        }
      }

      // Update bullets
      g.bullets = g.bullets.filter((b) => { b.x += b.dx; b.y += b.dy; return b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20; });

      // Player bullets → enemies
      for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
        const b = g.bullets[bi];
        if (b.isEnemy) continue;
        for (const e of g.enemies) {
          if (!e.alive) continue;
          const dx = b.x - e.x, dy = b.y - e.y;
          const def = ENEMY_DEFS[e.type];
          if (dx * dx + dy * dy < def.hitRadius * def.hitRadius) {
            g.bullets.splice(bi, 1);
            e.hp--; spawnP(b.x, b.y, def.color, 4);
            if (e.hp <= 0) {
              e.alive = false; g.combo++; g.comboTimer = 90;
              g.score += def.points * Math.min(g.combo, 10);
              spawnP(e.x, e.y, def.color, 14);
              spawnP(e.x, e.y, "#ffffff", 5);
              g.shakeTimer = 5;
              playSound("explode");
            } else {
              playSound("hit");
            }
            break;
          }
        }
      }

      // Enemy bullets → player
      if (g.invincible > 0) { g.invincible--; }
      else if (player.respawnTimer <= 0) {
        let hit = false;
        for (let bi = g.bullets.length - 1; bi >= 0; bi--) {
          const b = g.bullets[bi];
          if (!b.isEnemy) continue;
          if ((b.x - player.x) ** 2 + (b.y - player.y) ** 2 < 196) {
            g.bullets.splice(bi, 1); hit = true; break;
          }
        }
        if (!hit) {
          for (const e of g.enemies) {
            if (!e.alive || e.state === "formation") continue;
            if ((e.x - player.x) ** 2 + (e.y - player.y) ** 2 < 400) {
              hit = true; e.alive = false; spawnP(e.x, e.y, ENEMY_DEFS[e.type].color, 10); break;
            }
          }
        }
        if (hit) {
          player.lives--; g.invincible = 120; g.shakeTimer = 10; g.combo = 0;
          spawnP(player.x, player.y, "#ff6b35", 20);
          playSound("playerHit");
          if (player.lives <= 0) { endGame(g); return; }
          player.respawnTimer = 60; player.y = H - 80; player.x = W / 2;
        }
      }

      // Combo
      if (g.comboTimer > 0) { g.comboTimer--; if (g.comboTimer === 0) g.combo = 0; }

      // Wave cleared
      if (aliveCount === 0 && g.waveText <= 0) {
        g.wave++; waveRef.current = g.wave; g.enemies = generateWave(g.wave, W, H); g.waveText = 120;
        // Heal forge a bit
        g.forgeHp = Math.min(g.maxForgeHp, g.forgeHp + 10);
        playSound("waveComplete");
        if (g.forgeHp < g.maxForgeHp) playSound("powerUp");
      }
      if (g.waveText > 0) g.waveText--;

      // Particles
      g.particles = g.particles.filter((p) => { p.x += p.dx; p.y += p.dy; p.dy += 0.03; p.life--; return p.life > 0; });

      // Stars
      for (const s of g.stars) { s.y += s.speed; if (s.y > H) { s.y = 0; s.x = Math.random() * W; } }

      // ═══ RENDER ═══
      const shake = g.shakeTimer > 0 ? (Math.random() - 0.5) * g.shakeTimer * 1.5 : 0;
      if (g.shakeTimer > 0) g.shakeTimer--;
      ctx!.save();
      ctx!.translate(shake, shake);
      ctx!.imageSmoothingEnabled = false;

      // BG — transparent so lava shows through
      ctx!.clearRect(-5, -5, W + 10, H + 10);

      // Stars — faint over lava
      for (const s of g.stars) {
        ctx!.fillStyle = `rgba(255,255,255,${s.brightness * 0.4})`;
        ctx!.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
      }

      // Scanlines
      ctx!.fillStyle = "rgba(0,0,0,0.05)";
      for (let sy = 0; sy < H; sy += 3) ctx!.fillRect(0, sy, W, 1);

      // Forge at bottom
      const forgeCount = Math.ceil(W / (FORGE_SPRITE[0].length * 2));
      for (let i = 0; i < forgeCount; i++) {
        drawSprite(ctx!, FORGE_SPRITE, FORGE_PAL, 26 + i * (FORGE_SPRITE[0].length * 2), H - 12, 2);
      }
      // Forge HP bar
      const barW = Math.min(W - 40, 300);
      const barX = W / 2 - barW / 2;
      const barY = H - 28;
      ctx!.fillStyle = "rgba(255,255,255,0.08)";
      ctx!.fillRect(barX, barY, barW, 4);
      const hpPct = g.forgeHp / g.maxForgeHp;
      ctx!.fillStyle = hpPct > 0.5 ? "#22c55e" : hpPct > 0.25 ? "#eab308" : "#ef4444";
      ctx!.fillRect(barX, barY, barW * hpPct, 4);
      ctx!.fillStyle = "#ffffff60";
      ctx!.font = "9px monospace";
      ctx!.textAlign = "center";
      ctx!.fillText("FORGE", W / 2, barY - 3);

      // Particles
      for (const p of g.particles) {
        ctx!.globalAlpha = p.life / p.maxLife;
        ctx!.fillStyle = p.color;
        const sz = Math.max(2, 4 * (p.life / p.maxLife));
        ctx!.fillRect(Math.floor(p.x - sz / 2), Math.floor(p.y - sz / 2), sz, sz);
      }
      ctx!.globalAlpha = 1;

      // Enemies
      for (const e of g.enemies) {
        if (!e.alive) continue;
        const def = ENEMY_DEFS[e.type];
        drawSprite(ctx!, def.sprites[e.animFrame], def.palette, Math.floor(e.x), Math.floor(e.y), def.pixelScale);
        if (e.hp > 1) {
          const maxHp = def.hp + Math.floor(g.wave / 6);
          const pct = e.hp / maxHp;
          const bw = def.hitRadius * 2;
          ctx!.fillStyle = "rgba(255,255,255,0.1)";
          ctx!.fillRect(Math.floor(e.x - bw / 2), Math.floor(e.y) - def.hitRadius - 6, bw, 2);
          ctx!.fillStyle = def.color;
          ctx!.fillRect(Math.floor(e.x - bw / 2), Math.floor(e.y) - def.hitRadius - 6, Math.floor(bw * pct), 2);
        }
      }

      // Bullets
      for (const b of g.bullets) {
        if (b.isEnemy) {
          const md = ENEMY_DEFS.find(d => d.color === b.color);
          drawSprite(ctx!, E_BULLET, md ? md.bulletPalette : { 1: "#333", 2: "#fff" }, Math.floor(b.x), Math.floor(b.y), 2);
        } else {
          drawSprite(ctx!, P_BULLET, P_BULLET_PAL, Math.floor(b.x), Math.floor(b.y), 2);
        }
      }

      // Player
      if (player.respawnTimer <= 0 && (g.invincible <= 0 || g.time % 6 < 3)) {
        drawSprite(ctx!, PLAYER, PLAYER_PAL, Math.floor(player.x), Math.floor(player.y), 3);
      }

      // HUD
      ctx!.fillStyle = "#ffffff";
      ctx!.font = "bold 16px monospace";
      ctx!.textAlign = "left";
      ctx!.fillText(`SCORE ${g.score.toString().padStart(8, "0")}`, 16, 32);
      ctx!.textAlign = "right";
      ctx!.fillText(`WAVE ${g.wave}`, W - 16, 32);
      ctx!.textAlign = "center";
      ctx!.fillStyle = "#ffffff40";
      ctx!.font = "12px monospace";
      ctx!.fillText(`HI ${Math.max(g.score, highScore).toString().padStart(8, "0")}`, W / 2, 32);

      // Lives
      for (let i = 0; i < player.lives; i++) drawSprite(ctx!, PLAYER, PLAYER_PAL, 24 + i * 24, 52, 1.5);

      // Combo
      if (g.combo > 1) {
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#ffaa00";
        ctx!.font = "bold 14px monospace";
        ctx!.fillText(`${g.combo}x COMBO`, W / 2, 56);
      }

      // Wave text
      if (g.waveText > 60) {
        ctx!.globalAlpha = Math.min(1, (g.waveText - 60) / 30);
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#ffffff";
        ctx!.font = "bold 28px monospace";
        ctx!.fillText(g.wave % 5 === 0 ? `⚠ BOSS WAVE ${g.wave} ⚠` : `WAVE ${g.wave}`, W / 2, H / 2 - 10);
        if (g.wave % 5 === 0) {
          ctx!.fillStyle = "#60a5fa";
          ctx!.font = "bold 16px monospace";
          ctx!.fillText("THE PORTAL OPENS", W / 2, H / 2 + 20);
        }
        ctx!.globalAlpha = 1;
      }

      ctx!.restore();
      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [screen, highScore]);

  // ═══ RENDER ═══
  return (
    <div className="fixed inset-0 z-50 bg-[#050510]">
      {/* WebGL lava background */}
      <canvas ref={lavaRef} className="absolute inset-0 w-full h-full block" />
      {/* Game canvas (transparent bg, layered on top) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" style={{ imageRendering: "pixelated" }} />

      {/* Home button */}
      <Link
        href="/"
        className="absolute top-4 right-4 z-[60] px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase border border-white/20 text-white/40 hover:border-numinous-ember hover:text-numinous-ember transition-all duration-300 bg-[#050510]/60 backdrop-blur-sm"
      >
        HOME
      </Link>

      {/* Mute toggle */}
      <button
        onClick={() => { const m = !muted; setMutedState(m); setMuted(m); }}
        className="absolute top-4 right-28 z-[60] px-3 py-2 font-mono text-xs tracking-[0.1em] uppercase border border-white/20 text-white/40 hover:border-white/40 hover:text-white/60 transition-all duration-300 bg-[#050510]/60 backdrop-blur-sm"
      >
        {muted ? "UNMUTE" : "MUTE"}
      </button>

      {/* ═══ MENU ═══ */}
      {screen === "menu" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510]/80 backdrop-blur-sm overflow-y-auto py-8">
          <div className="text-center max-w-4xl px-6">
            <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-3 font-mono">
              Numinous Arcade
            </p>
            <h1 className="text-5xl md:text-7xl font-bold mb-1 font-mono" style={{ color: "#ff6b35", textShadow: "0 0 20px #ff6b3580, 0 0 40px #ff4500a0" }}>
              FORGE
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-mono" style={{ color: "#60b5ff", textShadow: "0 0 20px #60b5ff80" }}>
              DEFENDERS
            </h2>
            <p className="text-white/30 text-sm font-mono mb-8 max-w-md mx-auto">
              Elemental creatures attack the forge. Destroy them before they reach it.
              Protect the forge at all costs.
            </p>

            {/* Enemy bestiary cards with pixel art */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-2xl mx-auto">
              {ENEMY_DEFS.filter(d => d.name !== "The Portal").map((def, i) => (
                <div
                  key={def.name}
                  className="border rounded-lg p-3 flex flex-col items-center gap-2"
                  style={{ borderColor: `${def.color}30`, background: `${def.color}08` }}
                >
                  {cardImages[i] && (
                    <img
                      src={cardImages[i]}
                      alt={def.name}
                      className="w-14 h-14 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                  <span className="text-[11px] font-mono font-bold" style={{ color: def.color }}>{def.name}</span>
                  <span className="text-[9px] font-mono text-white/30 uppercase">{def.element}</span>
                  <span className="text-[9px] font-mono text-white/20">{def.points} PTS · HP {def.hp}</span>
                </div>
              ))}
            </div>

            {/* Boss card */}
            <div
              className="border rounded-lg p-4 flex items-center gap-4 mb-8 max-w-sm mx-auto"
              style={{ borderColor: "#60a5fa30", background: "#60a5fa08" }}
            >
              {cardImages[7] && (
                <img
                  src={cardImages[7]}
                  alt="The Portal"
                  className="w-20 h-20 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              )}
              <div className="text-left">
                <p className="text-sm font-mono font-bold" style={{ color: "#60a5fa" }}>THE PORTAL</p>
                <p className="text-[9px] font-mono text-white/30 uppercase">Void · BOSS</p>
                <p className="text-[10px] font-mono text-white/20 mt-1">{ENEMY_DEFS[7].points} PTS · HP {ENEMY_DEFS[7].hp}</p>
                <p className="text-[10px] font-mono text-white/20">{ENEMY_DEFS[7].desc}</p>
              </div>
            </div>

            <div className="text-white/25 text-xs font-mono mb-6 space-y-1">
              <p>ARROWS / WASD — MOVE</p>
              <p>SPACE / Z — FIRE</p>
              <p>TOUCH — MOBILE</p>
            </div>

            {highScore > 0 && (
              <p className="text-white/20 text-xs font-mono mb-4">
                HIGH SCORE: {highScore.toString().padStart(8, "0")}
              </p>
            )}

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="mb-8 max-w-xs mx-auto">
                <p className="text-xs tracking-[0.3em] uppercase text-yellow-400/60 font-mono mb-3">TOP SCORES</p>
                <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40">
                  <div className="grid grid-cols-[2rem_3.5rem_1fr_3.5rem] gap-1 px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/10">
                    <span>#</span><span>NAME</span><span className="text-right">SCORE</span><span className="text-right">WAVE</span>
                  </div>
                  {leaderboard.map((entry, i) => (
                    <div key={i} className="grid grid-cols-[2rem_3.5rem_1fr_3.5rem] gap-1 px-3 py-1 text-[11px] font-mono border-b border-white/5" style={{ color: i === 0 ? "#fbbf24" : i < 3 ? "#60b5ff" : "rgba(255,255,255,0.4)" }}>
                      <span>{i + 1}</span>
                      <span className="tracking-[0.15em]">{entry.initials}</span>
                      <span className="text-right">{entry.score.toString().padStart(8, "0")}</span>
                      <span className="text-right">{entry.wave}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              className="px-10 py-3 font-mono text-sm tracking-[0.3em] uppercase transition-all duration-300 border-2"
              style={{ color: "#ff6b35", borderColor: "#ff6b35", textShadow: "0 0 10px #ff6b3580", boxShadow: "0 0 15px #ff6b3540, inset 0 0 15px #ff6b3520" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b35"; e.currentTarget.style.color = "#000"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff6b35"; }}
            >
              INSERT COIN
            </button>
          </div>
        </div>
      )}

      {/* ═══ GAME OVER ═══ */}
      {screen === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510]/80 backdrop-blur-sm overflow-y-auto py-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 font-mono" style={{ color: "#f43f5e", textShadow: "0 0 20px #f43f5e80" }}>
              GAME OVER
            </h2>
            <p className="text-white/40 text-sm font-mono mb-2">
              {finalScore >= highScore && finalScore > 0 ? "THE FORGE HAS FALLEN" : "The forge couldn't hold"}
            </p>
            <p className="text-white/60 text-xl font-mono mb-1">{finalScore.toString().padStart(8, "0")}</p>
            <p className="text-white/30 text-sm font-mono mb-2">WAVE {finalWave}</p>
            {finalScore >= highScore && finalScore > 0 && (
              <p className="text-yellow-400 text-sm font-mono mb-4 animate-pulse">* NEW HIGH SCORE *</p>
            )}

            {/* Initials entry */}
            {showInitials && (
              <div className="mb-6">
                <p className="text-yellow-400 text-xs font-mono mb-2 tracking-[0.2em]">ENTER YOUR INITIALS</p>
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="text"
                    maxLength={3}
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                    autoFocus
                    className="w-20 text-center text-2xl font-mono tracking-[0.4em] bg-transparent border-b-2 border-yellow-400/60 text-yellow-400 outline-none uppercase"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && initials.length > 0) {
                        const updated = addToLeaderboard({ initials: initials.padEnd(3, " "), score: finalScore, wave: finalWave });
                        setLeaderboard(updated);
                        setShowInitials(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (initials.length > 0) {
                        const updated = addToLeaderboard({ initials: initials.padEnd(3, " "), score: finalScore, wave: finalWave });
                        setLeaderboard(updated);
                        setShowInitials(false);
                      }
                    }}
                    className="px-4 py-1 font-mono text-xs tracking-[0.2em] uppercase border border-yellow-400/40 text-yellow-400/80 hover:bg-yellow-400/10 transition-all"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {/* Leaderboard on game over */}
            {leaderboard.length > 0 && !showInitials && (
              <div className="mb-6 max-w-xs mx-auto">
                <p className="text-xs tracking-[0.3em] uppercase text-yellow-400/60 font-mono mb-3">TOP SCORES</p>
                <div className="border border-white/10 rounded-lg overflow-hidden bg-black/40">
                  <div className="grid grid-cols-[2rem_3.5rem_1fr_3.5rem] gap-1 px-3 py-1.5 text-[10px] font-mono text-white/30 border-b border-white/10">
                    <span>#</span><span>NAME</span><span className="text-right">SCORE</span><span className="text-right">WAVE</span>
                  </div>
                  {leaderboard.map((entry, i) => (
                    <div key={i} className="grid grid-cols-[2rem_3.5rem_1fr_3.5rem] gap-1 px-3 py-1 text-[11px] font-mono border-b border-white/5" style={{ color: i === 0 ? "#fbbf24" : i < 3 ? "#60b5ff" : "rgba(255,255,255,0.4)" }}>
                      <span>{i + 1}</span>
                      <span className="tracking-[0.15em]">{entry.initials}</span>
                      <span className="text-right">{entry.score.toString().padStart(8, "0")}</span>
                      <span className="text-right">{entry.wave}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={startGame}
                className="px-8 py-3 font-mono text-sm tracking-[0.2em] uppercase border-2 transition-all"
                style={{ color: "#ff6b35", borderColor: "#ff6b35" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b35"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff6b35"; }}
              >
                CONTINUE?
              </button>
              <button
                onClick={() => setScreen("menu")}
                className="px-8 py-3 font-mono text-sm tracking-[0.2em] uppercase border-2 border-white/20 text-white/40 hover:border-white/40 hover:text-white/60 transition-all"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ═══ MOBILE TOUCH CONTROLS ═══ */}
      {isTouchDevice && screen === "playing" && (
        <div className="absolute inset-0 z-[55] pointer-events-none">
          {/* Left arrow */}
          <button
            className="pointer-events-auto absolute bottom-8 left-4 w-16 h-16 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center text-white/40 text-2xl font-mono select-none active:bg-white/15 active:border-white/40 touch-none"
            onTouchStart={(e) => { e.preventDefault(); touchControlsRef.current.left = true; }}
            onTouchEnd={(e) => { e.preventDefault(); touchControlsRef.current.left = false; }}
            onTouchCancel={() => { touchControlsRef.current.left = false; }}
          >
            &lt;
          </button>
          {/* Right arrow */}
          <button
            className="pointer-events-auto absolute bottom-8 left-24 w-16 h-16 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center text-white/40 text-2xl font-mono select-none active:bg-white/15 active:border-white/40 touch-none"
            onTouchStart={(e) => { e.preventDefault(); touchControlsRef.current.right = true; }}
            onTouchEnd={(e) => { e.preventDefault(); touchControlsRef.current.right = false; }}
            onTouchCancel={() => { touchControlsRef.current.right = false; }}
          >
            &gt;
          </button>
          {/* Fire button */}
          <button
            className="pointer-events-auto absolute bottom-8 right-4 w-20 h-20 rounded-full border-2 border-[#ff6b35]/40 bg-[#ff6b35]/10 flex items-center justify-center text-[#ff6b35]/60 text-xs font-mono font-bold tracking-[0.15em] select-none active:bg-[#ff6b35]/25 active:border-[#ff6b35]/60 touch-none"
            onTouchStart={(e) => { e.preventDefault(); touchControlsRef.current.fire = true; }}
            onTouchEnd={(e) => { e.preventDefault(); touchControlsRef.current.fire = false; }}
            onTouchCancel={() => { touchControlsRef.current.fire = false; }}
          >
            FIRE
          </button>
          {/* Swipe area — full screen, low priority */}
          <div
            className="pointer-events-auto absolute inset-0"
            style={{ zIndex: -1 }}
            onTouchStart={(e) => {
              const t = e.touches[0];
              if (t) {
                swipeRef.current = { startX: t.clientX, startY: t.clientY, active: true };
              }
            }}
            onTouchMove={(e) => {
              if (!swipeRef.current.active) return;
              const t = e.touches[0];
              if (!t) return;
              const dx = t.clientX - swipeRef.current.startX;
              const threshold = 20;
              const tc = touchControlsRef.current;
              tc.left = dx < -threshold;
              tc.right = dx > threshold;
            }}
            onTouchEnd={() => {
              swipeRef.current.active = false;
              touchControlsRef.current.left = false;
              touchControlsRef.current.right = false;
            }}
          />
        </div>
      )}
    </div>
  );
}
