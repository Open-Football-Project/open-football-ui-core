import { LineupPlayer, TeamLineup } from "../../types";

export const MATCH_LINEUPS_SVG_W = 540;
export const MATCH_LINEUPS_SVG_H = 740;

const PITCH_MARGIN_X = 20;
const PITCH_W = MATCH_LINEUPS_SVG_W - 2 * PITCH_MARGIN_X;
const HEADER_H = 70;
const PITCH_H = 620;
const FOOTER_H = MATCH_LINEUPS_SVG_H - HEADER_H - PITCH_H;

const HOME_COLOR = "#0f2150";
const AWAY_COLOR = "#c20202";

const HOME_LINE_TOP = [7, 20, 33, 44];
const AWAY_LINE_TOP = [93, 80, 67, 56];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

const renderPlayerMarkers = (
  players: LineupPlayer[],
  lineTops: number[],
  color: string,
  getLeftPercent: (index: number, total: number) => number,
  groupByLine: (
    players: LineupPlayer[],
    positionToLine: (pos: string) => number,
  ) => Record<number, LineupPlayer[]>,
  positionToLine: (pos: string) => number,
): string => {
  const lines = groupByLine(players, positionToLine);
  return Object.entries(lines)
    .map(([lineStr, linePlayers]) => {
      const line = Number(lineStr);
      const topPercent = lineTops[line] ?? 50;
      const y = HEADER_H + (topPercent / 100) * PITCH_H;
      return linePlayers
        .map((p, idx) => {
          const leftPercent = getLeftPercent(idx, linePlayers.length);
          const x = PITCH_MARGIN_X + (leftPercent / 100) * PITCH_W;
          const name = esc(trunc(p.name, 9).toUpperCase());
          return `
  <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="${color}" stroke="white" stroke-width="1.5"/>
  <text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="white" font-family="Arial, sans-serif" font-weight="bold">${p.number}</text>
  <text x="${x.toFixed(1)}" y="${(y + 23).toFixed(1)}" text-anchor="middle" font-size="8" fill="white" font-family="Arial, sans-serif">${name}</text>`;
        })
        .join("");
    })
    .join("");
};

export const buildMatchLineupsSvgString = (
  teamA: TeamLineup,
  teamB: TeamLineup,
  getLeftPercent: (index: number, total: number) => number,
  groupByLine: (
    players: LineupPlayer[],
    positionToLine: (pos: string) => number,
  ) => Record<number, LineupPlayer[]>,
  positionToLine: (pos: string) => number,
): string => {
  const cx = MATCH_LINEUPS_SVG_W / 2;
  const pitchX = PITCH_MARGIN_X;
  const pitchRight = PITCH_MARGIN_X + PITCH_W;
  const pitchMidY = HEADER_H + PITCH_H / 2;
  const pitchEndY = HEADER_H + PITCH_H;
  const footerY = pitchEndY;

  const penAreaW = 300;
  const penAreaH = 100;
  const penAreaX = (MATCH_LINEUPS_SVG_W - penAreaW) / 2;

  const goalAreaW = 180;
  const goalAreaH = 50;
  const goalAreaX = (MATCH_LINEUPS_SVG_W - goalAreaW) / 2;

  const homePlayers = renderPlayerMarkers(
    teamA.lineup,
    HOME_LINE_TOP,
    HOME_COLOR,
    getLeftPercent,
    groupByLine,
    positionToLine,
  );

  const awayPlayers = renderPlayerMarkers(
    teamB.lineup,
    AWAY_LINE_TOP,
    AWAY_COLOR,
    getLeftPercent,
    groupByLine,
    positionToLine,
  );

  const teamAName = esc(trunc(teamA.teamName, 20));
  const teamBName = esc(trunc(teamB.teamName, 20));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MATCH_LINEUPS_SVG_W}" height="${MATCH_LINEUPS_SVG_H}">
  <defs>
    <linearGradient id="lbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>
  <rect width="${MATCH_LINEUPS_SVG_W}" height="${MATCH_LINEUPS_SVG_H}" fill="url(#lbg)"/>

  <!-- Header -->
  <text x="${cx}" y="20" text-anchor="middle" font-size="13" fill="white" font-family="Arial, sans-serif" font-weight="bold">${teamAName} vs ${teamBName}</text>
  <rect x="${PITCH_MARGIN_X}" y="28" width="235" height="28" rx="4" fill="${HOME_COLOR}"/>
  <text x="${(PITCH_MARGIN_X + 235 / 2).toFixed(1)}" y="46" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="white" font-family="Arial, sans-serif">${teamAName} · ${esc(teamA.teamFormation)}</text>
  <rect x="${(MATCH_LINEUPS_SVG_W - PITCH_MARGIN_X - 235).toFixed(1)}" y="28" width="235" height="28" rx="4" fill="${AWAY_COLOR}"/>
  <text x="${(MATCH_LINEUPS_SVG_W - PITCH_MARGIN_X - 235 / 2).toFixed(1)}" y="46" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="white" font-family="Arial, sans-serif">${teamBName} · ${esc(teamB.teamFormation)}</text>

  <!-- Pitch -->
  <rect x="${pitchX}" y="${HEADER_H}" width="${PITCH_W}" height="${PITCH_H}" fill="#2d6a2d" rx="4"/>
  <rect x="${pitchX}" y="${HEADER_H}" width="${PITCH_W}" height="${PITCH_H}" fill="none" stroke="white" stroke-width="2" rx="4"/>

  <!-- Halfway line -->
  <line x1="${pitchX}" y1="${pitchMidY}" x2="${pitchRight}" y2="${pitchMidY}" stroke="white" stroke-width="1.5" opacity="0.6"/>

  <!-- Center circle -->
  <circle cx="${cx}" cy="${pitchMidY}" r="40" fill="none" stroke="white" stroke-width="1.5" opacity="0.6"/>
  <circle cx="${cx}" cy="${pitchMidY}" r="4" fill="white" opacity="0.6"/>

  <!-- Home penalty area -->
  <rect x="${penAreaX}" y="${HEADER_H}" width="${penAreaW}" height="${penAreaH}" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/>

  <!-- Away penalty area -->
  <rect x="${penAreaX}" y="${pitchEndY - penAreaH}" width="${penAreaW}" height="${penAreaH}" fill="none" stroke="white" stroke-width="1.5" opacity="0.5"/>

  <!-- Home goal area -->
  <rect x="${goalAreaX}" y="${HEADER_H}" width="${goalAreaW}" height="${goalAreaH}" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>

  <!-- Away goal area -->
  <rect x="${goalAreaX}" y="${pitchEndY - goalAreaH}" width="${goalAreaW}" height="${goalAreaH}" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>

  <!-- Players -->
  ${homePlayers}
  ${awayPlayers}

  <!-- Footer -->
  <rect x="0" y="${footerY}" width="${MATCH_LINEUPS_SVG_W}" height="${FOOTER_H}" fill="rgba(0,0,0,0.45)"/>
  <text x="${cx}" y="${footerY + 24}" text-anchor="middle" font-size="16" fill="#FF6B00" font-family="Arial, sans-serif" font-weight="bold">footballproject.org</text>
  <text x="${cx}" y="${footerY + 40}" text-anchor="middle" font-size="10" fill="#555555" font-family="Arial, sans-serif">Live Football Scores &amp; Stats</text>
</svg>`;
};
