import { describe, it, expect } from "vitest";
import type { LeagueFixtureRound, DayMatches } from "../../types";
import {
  FIXTURE_SVG_W,
  getFixtureSvgH,
  buildFixtureSvgString,
  dayMatchesToFixtureRound,
  teamFixtureMatchesToFixtureRound,
} from "./fixtures-svg";

const HEADER_H = 70;
const ROUND_H = 28;
const MATCH_H = 44;
const FOOTER_H = 38;

const DATE = "2026-03-26T15:00:00Z";

function makeMatch(
  overrides: Partial<
    Parameters<typeof buildFixtureSvgString>[0]["days"][0]["matches"][0]
  > = {},
) {
  return {
    fixtureId: 1,
    homeTeamId: 10,
    awayTeamId: 20,
    homeTeamName: "Home FC",
    awayTeamName: "Away FC",
    date: DATE,
    isFinished: false,
    homeTeamScore: null,
    awayTeamScore: null,
    fixtureRound: "Round 1",
    statusShort: "NS",
    statusLong: "Not Started",
    isLiveNow: false,
    ...overrides,
  };
}

function makeRound(
  overrides: Partial<LeagueFixtureRound> = {},
): LeagueFixtureRound {
  return {
    name: "Round 1",
    days: [{ date: DATE, matches: [makeMatch()] }],
    ...overrides,
  };
}

describe("FIXTURE_SVG_W", () => {
  it("is 620", () => {
    expect(FIXTURE_SVG_W).toBe(620);
  });
});

describe("getFixtureSvgH", () => {
  it("returns base height when there are no days or matches", () => {
    const round: LeagueFixtureRound = { name: "R1", days: [] };
    expect(getFixtureSvgH(round)).toBe(HEADER_H + ROUND_H + FOOTER_H);
  });

  it("adds MATCH_H per match across all days", () => {
    const round: LeagueFixtureRound = {
      name: "R1",
      days: [
        { date: DATE, matches: [makeMatch(), makeMatch()] },
        { date: DATE, matches: [makeMatch()] },
      ],
    };
    expect(getFixtureSvgH(round)).toBe(
      HEADER_H + ROUND_H + 3 * MATCH_H + FOOTER_H,
    );
  });

  it("matches the height embedded in the SVG viewBox", () => {
    const round = makeRound();
    const svg = buildFixtureSvgString(round, "League");
    const expected = getFixtureSvgH(round);
    expect(svg).toContain(`viewBox="0 0 ${FIXTURE_SVG_W} ${expected}"`);
  });
});

describe("buildFixtureSvgString", () => {
  it("returns a valid SVG element", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(
      svg.trimStart().startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),
    ).toBe(true);
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
  });

  it("includes the league name and round name (uppercased)", () => {
    const svg = buildFixtureSvgString(
      makeRound({ name: "Matchday 5" }),
      "Premier League",
    );
    expect(svg).toContain("Premier League");
    expect(svg).toContain("MATCHDAY 5");
  });

  it("includes the league logo when provided", () => {
    const svg = buildFixtureSvgString(
      makeRound(),
      "League",
      "https://logo.png",
    );
    expect(svg).toContain('href="https://logo.png"');
  });

  it("omits the league logo when not provided", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(svg).not.toContain("https://logo.png");
  });

  it("XML-escapes the league name", () => {
    const svg = buildFixtureSvgString(makeRound(), "A&B <League>");
    expect(svg).toContain("A&amp;B &lt;League&gt;");
    expect(svg).not.toContain("A&B <League>");
  });

  it("XML-escapes team names", () => {
    const round = makeRound({
      days: [
        {
          date: DATE,
          matches: [makeMatch({ homeTeamName: "A&B FC", awayTeamName: "C>D" })],
        },
      ],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain("A&amp;B FC");
    expect(svg).toContain("C&gt;D");
  });

  it("shows the match date as dd/MM for each match", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(svg).toContain(">26/03<");
  });

  it("shows the kick-off time for unfinished matches", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(svg).toContain(">15:00<");
  });

  it("shows a checkmark instead of time for finished matches", () => {
    const round = makeRound({
      days: [
        {
          date: DATE,
          matches: [
            makeMatch({ isFinished: true, homeTeamScore: 2, awayTeamScore: 1 }),
          ],
        },
      ],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain(">\u2713<");
    expect(svg).not.toContain(">15:00<");
  });

  it("shows the score for finished matches", () => {
    const round = makeRound({
      days: [
        {
          date: DATE,
          matches: [
            makeMatch({ isFinished: true, homeTeamScore: 3, awayTeamScore: 0 }),
          ],
        },
      ],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain(">3 - 0<");
  });

  it("shows 0-0 when finished scores are null", () => {
    const round = makeRound({
      days: [
        {
          date: DATE,
          matches: [
            makeMatch({
              isFinished: true,
              homeTeamScore: null,
              awayTeamScore: null,
            }),
          ],
        },
      ],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain(">0 - 0<");
  });

  it("includes team logos when provided", () => {
    const round = makeRound({
      days: [
        {
          date: DATE,
          matches: [
            makeMatch({
              homeTeamLogo: "https://home.logo/h.png",
              awayTeamLogo: "https://away.logo/a.png",
            }),
          ],
        },
      ],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain('href="https://home.logo/h.png"');
    expect(svg).toContain('href="https://away.logo/a.png"');
  });

  it("omits team logo elements when logos are absent", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(svg).not.toContain("<image");
  });

  it("truncates team names longer than 18 characters", () => {
    const longName = "Extraordinarily Long Team Name FC";
    const round = makeRound({
      days: [{ date: DATE, matches: [makeMatch({ homeTeamName: longName })] }],
    });
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain("Extraordinarily Lo\u2026");
    expect(svg).not.toContain(longName);
  });

  it("includes the footer branding", () => {
    const svg = buildFixtureSvgString(makeRound(), "League");
    expect(svg).toContain("footballproject.org");
  });

  it("uses alternating row backgrounds across days", () => {
    const round: LeagueFixtureRound = {
      name: "R1",
      days: [{ date: DATE, matches: [makeMatch(), makeMatch()] }],
    };
    const svg = buildFixtureSvgString(round, "League");
    expect(svg).toContain('fill="#181818"'); // ROW_ODD
    expect(svg).toContain('fill="#1E1E1E"'); // ROW_EVEN
  });
});

describe("dayMatchesToFixtureRound", () => {
  const dayMatches: DayMatches = {
    leagueId: 99,
    leagueName: "Test League",
    matches: [
      {
        fixtureId: 1,
        homeTeamId: 10,
        awayTeamId: 20,
        homeTeamName: "Home",
        awayTeamName: "Away",
        homeTeamLogo: "https://h.png",
        awayTeamLogo: null,
        date: DATE,
        isFinished: false,
        homeTeamScore: null,
        awayTeamScore: null,
        statusShort: "NS",
        statusLong: "Not Started",
        isLiveNow: false,
      },
    ],
  };

  it("produces a round with one day containing all matches", () => {
    const round = dayMatchesToFixtureRound(dayMatches);
    expect(round.days).toHaveLength(1);
    expect(round.days[0].matches).toHaveLength(1);
  });

  it("sets the round name to the UTC date of the first match", () => {
    const round = dayMatchesToFixtureRound(dayMatches);
    expect(round.name).toBe(DATE);
  });

  it("sets day date to the UTC date of the first match", () => {
    const round = dayMatchesToFixtureRound(dayMatches);
    expect(round.days[0].date).toBe(DATE);
  });

  it("converts null logos to undefined", () => {
    const round = dayMatchesToFixtureRound(dayMatches);
    const match = round.days[0].matches[0];
    expect(match.homeTeamLogo).toBe("https://h.png");
    expect(match.awayTeamLogo).toBeUndefined();
  });

  it("sets fixtureRound to an empty string", () => {
    const round = dayMatchesToFixtureRound(dayMatches);
    expect(round.days[0].matches[0].fixtureRound).toBe("");
  });

  it("falls back to current date when matches array is empty", () => {
    const emptyDay: DayMatches = { ...dayMatches, matches: [] };
    const round = dayMatchesToFixtureRound(emptyDay);
    expect(round.days[0].matches).toHaveLength(0);
  });
});

describe("teamFixtureMatchesToFixtureRound", () => {
  function makeTeamMatch(
    date: string,
    overrides: Partial<
      Parameters<typeof teamFixtureMatchesToFixtureRound>[0][0]
    > = {},
  ) {
    return {
      fixtureId: 1,
      date,
      homeTeamId: 10,
      awayTeamId: 20,
      homeTeamName: "Home FC",
      awayTeamName: "Away FC",
      isFinished: false,
      statusShort: "NS",
      statusLong: "Not Started",
      isLiveNow: false,
      ...overrides,
    };
  }

  it("sets the round name to the provided label", () => {
    const round = teamFixtureMatchesToFixtureRound(
      [makeTeamMatch("2026-03-26T15:00:00Z")],
      "My Label",
    );
    expect(round.name).toBe("My Label");
  });

  it("puts all matches into a single day", () => {
    const matches = [
      makeTeamMatch("2026-03-26T15:00:00Z", { fixtureId: 1 }),
      makeTeamMatch("2026-03-27T15:00:00Z", { fixtureId: 2 }),
    ];
    const round = teamFixtureMatchesToFixtureRound(matches, "Label");
    expect(round.days).toHaveLength(1);
    expect(round.days[0].matches).toHaveLength(2);
  });

  it("sets day date to the UTC date of the first match", () => {
    const matches = [
      makeTeamMatch("2026-03-26T15:00:00Z", { fixtureId: 1 }),
      makeTeamMatch("2026-03-27T15:00:00Z", { fixtureId: 2 }),
    ];
    const round = teamFixtureMatchesToFixtureRound(matches, "Label");
    expect(round.days[0].date).toBe("2026-03-26T15:00:00Z");
  });

  it("sets fixtureRound to an empty string on every match", () => {
    const round = teamFixtureMatchesToFixtureRound(
      [makeTeamMatch("2026-03-26T15:00:00Z")],
      "Label",
    );
    expect(round.days[0].matches[0].fixtureRound).toBe("");
  });

  it("preserves all other match fields", () => {
    const input = makeTeamMatch("2026-03-26T15:00:00Z", {
      fixtureId: 42,
      homeTeamName: "Lions",
      awayTeamName: "Tigers",
      homeTeamLogo: "https://h.png",
      awayTeamLogo: "https://a.png",
      isFinished: true,
      homeTeamScore: 3,
      awayTeamScore: 1,
    });
    const round = teamFixtureMatchesToFixtureRound([input], "Label");
    const match = round.days[0].matches[0];
    expect(match.fixtureId).toBe(42);
    expect(match.homeTeamName).toBe("Lions");
    expect(match.awayTeamName).toBe("Tigers");
    expect(match.homeTeamLogo).toBe("https://h.png");
    expect(match.awayTeamLogo).toBe("https://a.png");
    expect(match.isFinished).toBe(true);
    expect(match.homeTeamScore).toBe(3);
    expect(match.awayTeamScore).toBe(1);
  });

  it("returns an empty days array when matches is empty", () => {
    const round = teamFixtureMatchesToFixtureRound([], "Label");
    expect(round.days).toHaveLength(0);
  });
});
