import {
  DonutsBrandColor,
  IndicatorResult,
  LiveMatchIndicatorsDonut,
  LiveMatchIndicatorsDonutTrKeys,
  LiveMatchIndicatorsDonutVerdictThresholds,
} from "../../types";

export const LIVE_MATCH_DONUTS_SVG_W = 540;
export const LIVE_MATCH_DONUTS_SVG_H = 200;

const YELLOW = "#ffc61a";
const COL_W = LIVE_MATCH_DONUTS_SVG_W / 3;

type TFunction = (key: string, opts?: Record<string, string>) => string;

const toVerdictHex = (
  homePercent: number,
  hasData: boolean,
  brand: DonutsBrandColor,
  veredictThresholds: LiveMatchIndicatorsDonutVerdictThresholds,
): string => {
  if (!hasData) return YELLOW;
  if (homePercent >= veredictThresholds.leading) return brand.orange;
  if (homePercent <= veredictThresholds.trailing) return brand.aqualight;
  return YELLOW;
};

const toVerdictLabel = (
  homePercent: number,
  homeTeamName: string,
  awayTeamName: string,
  hasData: boolean,
  t: TFunction,
  trkeys: LiveMatchIndicatorsDonutTrKeys,
  thresholds: LiveMatchIndicatorsDonutVerdictThresholds,
): string => {
  if (!hasData) return t(trkeys.veredictNoData);
  if (homePercent >= thresholds.dominating)
    return t(trkeys.veredictDominating, { team: homeTeamName });
  if (homePercent >= thresholds.leading)
    return t(trkeys.veredictAhead, { team: homeTeamName });
  if (homePercent > thresholds.trailing) return t(trkeys.veredictEven);
  if (homePercent > thresholds.dominated)
    return t(trkeys.veredictAhead, { team: awayTeamName });
  return t(trkeys.veredictDominating, { team: awayTeamName });
};

const chartColumn = (
  indicator: IndicatorResult,
  colIndex: number,
  homeTeamName: string,
  awayTeamName: string,
  hasData: boolean,
  t: TFunction,
  donut: LiveMatchIndicatorsDonut,
  brand: DonutsBrandColor,
  veredictThresholds: LiveMatchIndicatorsDonutVerdictThresholds,
  trkeys: LiveMatchIndicatorsDonutTrKeys,
): string => {
  const cx = colIndex * COL_W + COL_W / 2;
  const cy = 80;
  const homeDash = hasData
    ? (indicator.homePercent / 100) * donut.circumference
    : 0;
  const verdict = toVerdictLabel(
    indicator.homePercent,
    homeTeamName,
    awayTeamName,
    hasData,
    t,
    trkeys,
    veredictThresholds,
  );
  const verdictColor = toVerdictHex(
    indicator.homePercent,
    hasData,
    brand,
    veredictThresholds,
  );
  const colX = colIndex * COL_W;

  return `
  <text x="${cx}" y="17" text-anchor="middle" font-size="10" fill="#aaaaaa" font-family="sans-serif">${indicator.emoji} ${t(indicator.label)}</text>
  <circle cx="${cx}" cy="${cy}" r="${donut.radius}" fill="none" stroke="${brand.darkBg}" stroke-width="${donut.strokeWidth}"/>
  <circle cx="${cx}" cy="${cy}" r="${donut.radius}" fill="none" stroke="${brand.aqualight}" stroke-width="${donut.strokeWidth}"/>
  <circle cx="${cx}" cy="${cy}" r="${donut.radius}" fill="none" stroke="${brand.orange}" stroke-width="${donut.strokeWidth}" stroke-dasharray="${homeDash.toFixed(2)} ${donut.circumference.toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>
  <line x1="${cx - 12}" y1="${cy + 1}" x2="${cx + 12}" y2="${cy + 1}" stroke="${brand.divider}" stroke-width="1"/>
  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="10" fill="${brand.orange}" font-weight="bold" font-family="sans-serif">${indicator.homePercent}%</text>
  <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="10" fill="${brand.aqualight}" font-weight="bold" font-family="sans-serif">${indicator.awayPercent}%</text>
  <text x="${cx}" y="132" text-anchor="middle" font-size="9" fill="${verdictColor}" font-weight="bold" font-family="sans-serif">${verdict}</text>
  <circle cx="${colX + 14}" cy="149" r="4" fill="${brand.orange}"/>
  <text x="${colX + 22}" y="153" font-size="9" fill="white" font-family="sans-serif">${homeTeamName}</text>
  <circle cx="${colX + 14}" cy="165" r="4" fill="${brand.aqualight}"/>
  <text x="${colX + 22}" y="169" font-size="9" fill="white" font-family="sans-serif">${awayTeamName}</text>`;
};

export const buildLiveIndicatorsDonutsSvgString = (
  homeTeamName: string,
  awayTeamName: string,
  momentum: IndicatorResult,
  control: IndicatorResult,
  goalThreat: IndicatorResult,
  hasData: boolean,
  t: TFunction,
  donut: LiveMatchIndicatorsDonut,
  brand: DonutsBrandColor,
  veredictThresholds: LiveMatchIndicatorsDonutVerdictThresholds,
  trkeys: LiveMatchIndicatorsDonutTrKeys,
): string => {
  const columns = [momentum, control, goalThreat]
    .map((ind, i) =>
      chartColumn(
        ind,
        i,
        homeTeamName,
        awayTeamName,
        hasData,
        t,
        donut,
        brand,
        veredictThresholds,
        trkeys,
      ),
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${LIVE_MATCH_DONUTS_SVG_W}" height="${LIVE_MATCH_DONUTS_SVG_H}" viewBox="0 0 ${LIVE_MATCH_DONUTS_SVG_W} ${LIVE_MATCH_DONUTS_SVG_H}">
  <rect width="${LIVE_MATCH_DONUTS_SVG_W}" height="${LIVE_MATCH_DONUTS_SVG_H}" fill="#1E1E1E"/>
  <line x1="${COL_W}" y1="0" x2="${COL_W}" y2="${LIVE_MATCH_DONUTS_SVG_H}" stroke="${brand.divider}" stroke-width="1"/>
  <line x1="${COL_W * 2}" y1="0" x2="${COL_W * 2}" y2="${LIVE_MATCH_DONUTS_SVG_H}" stroke="${brand.divider}" stroke-width="1"/>
  ${columns}
  <line x1="0" y1="180" x2="${LIVE_MATCH_DONUTS_SVG_W}" y2="180" stroke="${brand.divider}" stroke-width="1"/>
  <text x="${LIVE_MATCH_DONUTS_SVG_W / 2}" y="194" text-anchor="middle" font-size="10" fill="${YELLOW}" font-weight="bold" font-family="sans-serif">futballero.com</text>
</svg>`;
};
