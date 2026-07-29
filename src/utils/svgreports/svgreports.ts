export const SITE_DOMAIN = "footballproject.org";

export const enum SvgReportsFonts {
  DEFAULT = "Roboto, Arial, sans-serif",
}

export const enum SvgReportsColors {
  BG = "#121212",
  HEADER_BG = "#0f2150",
  COL_HDR_BG = "#0d2769",
  DAY_BG = "#162040",
  ROW_ODD = "#181818",
  ROW_EVEN = "#1E1E1E",
  TEXT = "#FFFFFF",
  TEXT_MUTED = "#B0B0B0",
  ORANGE = "#FF6B00",
  YELLOW = "#ffc61a",
  WIN = "#22c55e",
  DRAW = "#eab308",
  LOSS = "#ef4444",
  BORDER = "rgba(255,255,255,0.1)",
  FORM_LABEL = "#000000",
  SUCCESS = "#00C853",
  DANGER = "#D50000",
  AQUALIGHT = "#85f1e8",
  DARK_BG = "#111827",
  CARD_BG = "#1f2937",
  TRIVIA_YELLOW = "#f59e0b",
  TRIVIA_ORANGE = "#f97316",
  WHITE = "#ffffff",
  TRIVIA_BORDER = "#374151",
  TRIVIA_GRAY = "#9ca3af",
  TRIVIA_BLUE = "#3b82f6",
}

export function svgRect(
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
}

export function svgText(
  x: number,
  y: number,
  anchor: "middle" | "start" | "end",
  fill: string,
  fontSize: number,
  fontWeight: "normal" | "bold",
  content: string,
): string {
  return (
    `<text x="${x}" y="${y}" text-anchor="${anchor}"` +
    ` fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}"` +
    ` font-family="${SvgReportsFonts.DEFAULT}">${content}</text>`
  );
}

export function svgImage(
  href: string,
  x: number,
  y: number,
  size: number,
): string {
  return `<image href="${href}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
}

export function svgHLine(y: number, width: number, stroke: string): string {
  return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${stroke}" stroke-width="1"/>`;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
