import { describe, it, expect, vi } from "vitest";
import {
  translateCountry,
  translateLeague,
  leagueTranslationKey,
  matchLongStatusToKey,
  leagueGroupTranslation,
  translatePlayerPosition,
} from "./translationFunctions";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: vi.fn((key: string, opts: any) => opts?.defaultValue ?? key),
    i18n: { language: "en", changeLanguage: vi.fn() },
  }),
}));

import { cleanUpLeagueGrp } from "../useful/useful";
import { useTranslation } from "react-i18next";

describe("translateCountry", () => {
  const { t } = useTranslation();

  it("returns defaultValue if translation not found", () => {
    expect(translateCountry("Argentina", t)).toBe("Argentina");
    expect(t).toHaveBeenCalledWith("country.argentina", {
      defaultValue: "Argentina",
    });
  });
});

describe("leagueTranslationKey", () => {
  it("normalizes league names to keys", () => {
    expect(leagueTranslationKey("Primera División - Argentina")).toBe(
      "primera_división_argentina"
    );

    expect(leagueTranslationKey("UEFA Champions League")).toBe(
      "uefa_champions_league"
    );

    expect(leagueTranslationKey("  World Cup / Qualifiers ")).toBe(
      "world_cup_qualifiers"
    );
  });
});

describe("translateLeague", () => {
  const { t } = useTranslation();

  it("applies translation and cleans the league name", () => {
    const input = "Primera División - Argentina";

    translateLeague(input, t);

    expect(t).toHaveBeenCalledWith(`league.${leagueTranslationKey(input)}`, {
      defaultValue: input,
    });
  });
});

describe("matchLongStatusToKey", () => {
  it("returns empty string for falsy status", () => {
    expect(matchLongStatusToKey("")).toBe("");
    expect(matchLongStatusToKey(undefined as unknown as string)).toBe("");
  });

  it("converts status to lowercase, replaces spaces, removes invalid chars", () => {
    expect(matchLongStatusToKey("First Half")).toBe("first_half");
    expect(matchLongStatusToKey("Half-Time!")).toBe("halftime");
    expect(matchLongStatusToKey("Extra Time 2")).toBe("extra_time_2");
    expect(matchLongStatusToKey("Penalties / Shootout")).toBe(
      "penalties_shootout"
    );
  });
});

describe("leagueGroupTranslation", () => {
  it("cleans up group labels for non-spanish", () => {
    expect(leagueGroupTranslation("Conmebol Libertadores Group A", "en")).toBe(
      cleanUpLeagueGrp("Conmebol Libertadores Group A")
    );
  });

  it("applies spanish replacements when lang is 'es'", () => {
    const input = "main round overall group";
    const result = leagueGroupTranslation(input, "es");

    expect(result).toContain("Ronda Principal");
    expect(result).toContain("General");
    expect(result).toContain("Grupo");
  });
});

describe("translatePlayerPosition", () => {
  const { t } = useTranslation();

  it("returns defaultValue if translation not found", () => {
    expect(translatePlayerPosition("Forward", t)).toBe("Forward");
    expect(t).toHaveBeenCalledWith("playerposition.forward", {
      defaultValue: "Forward",
    });
  });
});
