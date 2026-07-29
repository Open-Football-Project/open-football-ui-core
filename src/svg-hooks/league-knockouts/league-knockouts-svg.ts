import { BracketNode, LegScore, Tie } from "../../utils/league-fixture/general/league-fixture-general-utils";

export const SVG_W    = 1200;
export const PAD_X    = 20;
export const HEADER_H = 90;
export const FOOTER_H = 50;
export const SLOT_H   = 75;

const CARD_W = 190;
const LOGO_S  = 18;
const ROW_H   = 26;
const CARD_H  = ROW_H * 2 + 4;

export type RoundLayout = { key: string; nodes: BracketNode[] };

export type TFn = (key: string, opts?: Record<string, unknown>) => string;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export function collectRounds(root: BracketNode): RoundLayout[] {
  const map = new Map<string, BracketNode[]>();

  function visit(node: BracketNode) {
    if (node.left)  visit(node.left);
    if (node.right) visit(node.right);
    const list = map.get(node.roundKey) ?? [];
    list.push(node);
    map.set(node.roundKey, list);
  }

  visit(root);
  return [...map.entries()].map(([key, nodes]) => ({ key, nodes }));
}

function scoreLabel(legs: LegScore[], aggregate: NonNullable<Tie["aggregate"]>, side: "t1Score" | "t2Score"): string {
  if (legs.length === 1) return `${aggregate[side]}`;
  return `${legs[0][side]}·${legs[1][side]}(${aggregate[side]})`;
}

export function buildBracketSvgString(
  rounds: RoundLayout[],
  maxNodes: number,
  svgH: number,
  leagueName: string,
  t: TFn,
  showScores = false,
): string {
  const numRounds = rounds.length;
  const cw      = (SVG_W - 2 * PAD_X) / numRounds;
  const cardX   = (ri: number) => PAD_X + ri * cw;
  const slotH   = (ri: number) => SLOT_H * (maxNodes / rounds[ri].nodes.length);
  const yCenter = (ri: number, j: number) => HEADER_H + (j + 0.5) * slotH(ri);

  const parts: string[] = [];

  for (let ri = 0; ri < numRounds - 1; ri++) {
    const cx    = cardX(ri);
    const nextX = cardX(ri + 1);
    const midX  = cx + CARD_W + (nextX - cx - CARD_W) / 2;
    const len   = rounds[ri].nodes.length;

    for (let j = 0; j < len; j += 2) {
      const yA   = yCenter(ri, j);
      const yB   = yCenter(ri, j + 1);
      const yMid = (yA + yB) / 2;
      parts.push(`
        <line x1="${cx + CARD_W}" y1="${yA}" x2="${midX}" y2="${yA}" stroke="#FF6B00" stroke-width="1.5"/>
        <line x1="${cx + CARD_W}" y1="${yB}" x2="${midX}" y2="${yB}" stroke="#FF6B00" stroke-width="1.5"/>
        <line x1="${midX}" y1="${yA}" x2="${midX}" y2="${yB}" stroke="#FF6B00" stroke-width="1.5"/>
        <line x1="${midX}" y1="${yMid}" x2="${nextX}" y2="${yMid}" stroke="#FF6B00" stroke-width="1.5"/>`);
    }
  }

  // Cards
  for (let ri = 0; ri < numRounds; ri++) {
    const { key, nodes } = rounds[ri];
    const cx    = cardX(ri);
    const label = esc(t(`fixtures.${key}`, { defaultValue: key.replace(/_/g, " ") }));

    parts.push(`
      <text x="${cx + CARD_W / 2}" y="${HEADER_H - 12}" text-anchor="middle"
        fill="#FF6B00" font-size="11" font-family="Arial, sans-serif" font-weight="bold">${label}</text>`);

    for (let j = 0; j < nodes.length; j++) {
      const { tie, missingData: isMissing } = nodes[j];
      const cy    = yCenter(ri, j);
      const cardY = cy - CARD_H / 2;
      const row2Y = cardY + ROW_H + 4;

      if (!tie) {
        const fill   = isMissing ? "#1c2333" : "#0f172a";
        const stroke = isMissing ? "#4B5563" : "#2a3555";
        const dashes = isMissing ? "" : `stroke-dasharray="4 2"`;
        const lineC  = isMissing ? "#374151" : "#1e293b";
        const textC  = isMissing ? "#4B5563" : "#2a3555";
        const ph     = isMissing ? "–" : "?";
        parts.push(`
          <rect x="${cx}" y="${cardY}" width="${CARD_W}" height="${CARD_H}" rx="4"
            fill="${fill}" stroke="${stroke}" stroke-width="1" ${dashes}/>
          <line x1="${cx + 6}" y1="${cardY + ROW_H + 4}" x2="${cx + CARD_W - 6}" y2="${cardY + ROW_H + 4}"
            stroke="${lineC}" stroke-width="1"/>
          <text x="${cx + 4 + LOGO_S + 3}" y="${cardY + ROW_H / 2}" dominant-baseline="middle"
            fill="${textC}" font-size="10" font-family="Arial, sans-serif">${ph}</text>
          <text x="${cx + 4 + LOGO_S + 3}" y="${row2Y + ROW_H / 2}" dominant-baseline="middle"
            fill="${textC}" font-size="10" font-family="Arial, sans-serif">${ph}</text>`);
        continue;
      }

      const showingScores = showScores && tie.aggregate !== null;
      const t1 = esc(trunc(tie.t1, showingScores ? 14 : 22));
      const t2 = esc(trunc(tie.t2, showingScores ? 14 : 22));
      const t1Score = showingScores ? esc(scoreLabel(tie.legs, tie.aggregate!, "t1Score")) : "";
      const t2Score = showingScores ? esc(scoreLabel(tie.legs, tie.aggregate!, "t2Score")) : "";
      parts.push(`
        <rect x="${cx}" y="${cardY}" width="${CARD_W}" height="${CARD_H}" rx="4"
          fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
        <line x1="${cx + 6}" y1="${row2Y}" x2="${cx + CARD_W - 6}" y2="${row2Y}"
          stroke="#1e293b" stroke-width="1"/>
        ${tie.t1logo ? `<image href="${tie.t1logo}" x="${cx + 4}" y="${cardY + (ROW_H - LOGO_S) / 2}" width="${LOGO_S}" height="${LOGO_S}"/>` : ""}
        <text x="${cx + 4 + LOGO_S + 3}" y="${cardY + ROW_H / 2}" dominant-baseline="middle"
          fill="#ffffff" font-size="10" font-family="Arial, sans-serif">${t1}</text>
        ${showingScores ? `<text x="${cx + CARD_W - 6}" y="${cardY + ROW_H / 2}" text-anchor="end" dominant-baseline="middle"
          fill="#ffffff" font-size="10" font-family="Arial, sans-serif" font-weight="bold">${t1Score}</text>` : ""}
        ${tie.t2logo ? `<image href="${tie.t2logo}" x="${cx + 4}" y="${row2Y + (ROW_H - LOGO_S) / 2}" width="${LOGO_S}" height="${LOGO_S}"/>` : ""}
        <text x="${cx + 4 + LOGO_S + 3}" y="${row2Y + ROW_H / 2}" dominant-baseline="middle"
          fill="#ffffff" font-size="10" font-family="Arial, sans-serif">${t2}</text>
        ${showingScores ? `<text x="${cx + CARD_W - 6}" y="${row2Y + ROW_H / 2}" text-anchor="end" dominant-baseline="middle"
          fill="#ffffff" font-size="10" font-family="Arial, sans-serif" font-weight="bold">${t2Score}</text>` : ""}`);
    }
  }

  const bracketLabel = esc(t("knockout.brackets", { defaultValue: "Knockout Brackets" }));

  return `<svg width="${SVG_W}" height="${svgH}" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <defs>
    <linearGradient id="kbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>
  <rect width="${SVG_W}" height="${svgH}" fill="url(#kbg)"/>
  <text x="${SVG_W / 2}" y="38" text-anchor="middle" fill="#ffffff"
    font-size="22" font-family="Arial, sans-serif" font-weight="bold">${esc(leagueName)}</text>
  <text x="${SVG_W / 2}" y="58" text-anchor="middle" fill="#888888"
    font-size="13" font-family="Arial, sans-serif">${bracketLabel}</text>
  ${parts.join("\n")}
  <rect x="0" y="${svgH - FOOTER_H}" width="${SVG_W}" height="${FOOTER_H}" fill="rgba(0,0,0,0.45)"/>
  <text x="${SVG_W / 2}" y="${svgH - FOOTER_H + 24}" text-anchor="middle" fill="#FF6B00"
    font-size="16" font-family="Arial, sans-serif" font-weight="bold">futballero.com</text>
  <text x="${SVG_W / 2}" y="${svgH - FOOTER_H + 40}" text-anchor="middle" fill="#555555"
    font-size="10" font-family="Arial, sans-serif">Live Football Scores &amp; Stats</text>
</svg>`;
}
