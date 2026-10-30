const DARK_TEXT = "#1F1F21";
const MIN_CONTRAST = 4.5;

// ręczne wyjątki
const TEXT_OVERRIDES: Record<string, string> = {
  // "#7F5F01": "#F5E989",
};

function parseHex(hex: string): [number, number, number] | null {
  let c = hex.trim().replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(c)) return null;
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(l1: number, l2: number): number {
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / d) % 6;
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

const toHex = ([r, g, b]: [number, number, number]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

function lightTint(bg: [number, number, number], bgLum: number): string {
  const [h, s] = rgbToHsl(bg);
  for (const l of [0.77, 0.83, 0.9, 0.95]) {
    const rgb = hslToRgb(h, Math.min(s, 0.85), l);
    if (contrast(luminance(rgb), bgLum) >= MIN_CONTRAST) return toHex(rgb);
  }
  return "#FFFFFF";
}

export function getTextColor(hex: string): string {
  const override = TEXT_OVERRIDES[hex.toUpperCase()];
  if (override) return override;

  const rgb = parseHex(hex);
  if (!rgb) return DARK_TEXT;

  const bgLum = luminance(rgb);
  const darkRgb = parseHex(DARK_TEXT)!;

  if (contrast(luminance(darkRgb), bgLum) >= MIN_CONTRAST) return DARK_TEXT;
  
  return lightTint(rgb, bgLum);
}