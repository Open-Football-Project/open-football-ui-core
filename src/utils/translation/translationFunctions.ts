import { TFunction } from "i18next";
import { cleanLeagueName, cleanUpLeagueGrp } from "../useful/useful";

export const translateCountry = (
  country: string,
  t: TFunction<"translation", undefined>,
) => {
  return t(`country.${country.toLowerCase()}`, {
    defaultValue: country,
  });
};

export const translateLeague = (
  leagueName: string,
  t: TFunction<"translation", undefined>,
): string => {
  return cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueName)}`, {
      defaultValue: leagueName,
    }),
  );
};

export const leagueTranslationKey = (league: string): string => {
  return league
    .trim()
    .toLowerCase()
    .replace(/[-:/+.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "_");
};

export const matchLongStatusToKey = (status: string) => {
  if (!status) return "";

  return status
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "_")
    .trim();
};

export const leagueGroupTranslation = (grpLabel: string, lang: string) =>
  !lang.toLowerCase().startsWith("es")
    ? cleanUpLeagueGrp(grpLabel)
    : cleanUpLeagueGrp(grpLabel)
        .replace(/group/gi, "Grupo")
        .replace(/overall/gi, "General")
        .replace(/main round/gi, "Ronda Principal")
        .replace(/relegation round/gi, "Ronda de Descenso")
        .replace(/third[-\s]?placed/gi, "Terceros");

export const translatePlayerPosition = (
  playerposition: string,
  t: TFunction<"translation", undefined>,
): string => {
  return t(`playerposition.${playerposition.toLowerCase()}`, {
    defaultValue: playerposition,
  });
};
