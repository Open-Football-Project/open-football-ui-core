import { describe, expect, it } from "vitest";
import {
  SVGItemKind,
  SVGPLayerTransferItem,
  SVGPlayerTrophyItem,
  TeamTriviaSvgHint,
  TriviaSvgConfig,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import { buildPlayerTriviaSvg } from "./trivia-player-svg";
import { buildTeamTriviaSvg } from "./trivia-team-svg";
import {
  GAME_SVG_FOOTER_H,
  GAME_SVG_HEADER_H,
  GAME_SVG_WIDTH,
  buildTriviaSvg,
  getGameSvgDimensions,
  triviaSVGImage,
  triviaSVGText,
  wrapGameRow,
} from "./trivia-svg-builder";

describe("triviaSVGText", () => {
  it("renders a text element with default fill, size, weight and anchor", () => {
    const result = triviaSVGText("Hello", 10, 20);
    expect(result).toContain('x="10"');
    expect(result).toContain('y="20"');
    expect(result).toContain(">Hello<");
    expect(result).toContain(`fill="${SvgReportsColors.WHITE}"`);
    expect(result).toContain('font-size="14"');
    expect(result).toContain('font-weight="normal"');
    expect(result).toContain('text-anchor="start"');
  });

  it("applies opts overrides", () => {
    const result = triviaSVGText("Test", 0, 0, {
      fill: "#ff0000",
      size: 18,
      weight: "bold",
      anchor: "middle",
    });
    expect(result).toContain('fill="#ff0000"');
    expect(result).toContain('font-size="18"');
    expect(result).toContain('font-weight="bold"');
    expect(result).toContain('text-anchor="middle"');
  });

  it("escapes XML special characters in content", () => {
    const result = triviaSVGText('A & B <C> "D"', 0, 0);
    expect(result).toContain("A &amp; B &lt;C&gt; &quot;D&quot;");
    expect(result).not.toContain("& ");
    expect(result).not.toContain("<C>");
  });
});

describe("triviaSVGImage", () => {
  it("renders an image element for a valid href", () => {
    const result = triviaSVGImage("https://example.com/logo.png", 10, 20, 24);
    expect(result).toContain("<image");
    expect(result).toContain('href="https://example.com/logo.png"');
    expect(result).toContain('x="10"');
    expect(result).toContain('y="20"');
    expect(result).toContain('width="24"');
    expect(result).toContain('height="24"');
    expect(result).toContain('preserveAspectRatio="xMidYMid meet"');
  });

  it("escapes special characters in href", () => {
    const result = triviaSVGImage('https://example.com/a&b"c', 0, 0, 24);
    expect(result).toContain("&amp;");
    expect(result).toContain("&quot;");
  });

  it("returns empty string for null", () => {
    expect(triviaSVGImage(null, 0, 0, 24)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(triviaSVGImage(undefined, 0, 0, 24)).toBe("");
  });

  it("returns empty string for empty string", () => {
    expect(triviaSVGImage("", 0, 0, 24)).toBe("");
  });
});

describe("getGameSvgDimensions", () => {
  it("always returns GAME_SVG_WIDTH", () => {
    expect(getGameSvgDimensions(0, 52).width).toBe(GAME_SVG_WIDTH);
    expect(getGameSvgDimensions(5, 60).width).toBe(GAME_SVG_WIDTH);
  });

  it("height = header + rows + footer with no options", () => {
    const { height } = getGameSvgDimensions(3, 52);
    expect(height).toBe(GAME_SVG_HEADER_H + 3 * 52 + GAME_SVG_FOOTER_H);
  });

  it("height increases when options are provided", () => {
    const { height: without } = getGameSvgDimensions(3, 52);
    const { height: with3 } = getGameSvgDimensions(3, 52, ["A", "B", "C"]);
    expect(with3).toBeGreaterThan(without);
  });

  it("more options rows increase height further", () => {
    const { height: with3 } = getGameSvgDimensions(3, 52, ["A", "B", "C"]);
    const { height: with6 } = getGameSvgDimensions(3, 52, [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);
    expect(with6).toBeGreaterThan(with3);
  });
});

describe("wrapGameRow", () => {
  it("uses CARD_BG for even row indices", () => {
    const result = wrapGameRow(0, 100, 52, "<content/>");
    expect(result).toContain(SvgReportsColors.CARD_BG);
    expect(result).not.toContain(SvgReportsColors.DARK_BG);
  });

  it("uses DARK_BG for odd row indices", () => {
    const result = wrapGameRow(1, 100, 52, "<content/>");
    expect(result).toContain(SvgReportsColors.DARK_BG);
    expect(result).not.toContain(SvgReportsColors.CARD_BG);
  });

  it("includes the content after the background rect", () => {
    const result = wrapGameRow(0, 100, 52, "<myrow/>");
    expect(result).toContain("<myrow/>");
  });

  it("positions rect at the given y offset", () => {
    const result = wrapGameRow(0, 200, 52, "");
    expect(result).toContain('y="200"');
    expect(result).toContain('height="52"');
  });
});

describe("buildTriviaSvg", () => {
  it("returns a valid SVG document", () => {
    const result = buildTriviaSvg("Title", "Subtitle", 2, 52, () => "<rows/>");
    expect(result).toMatch(/^<svg /);
    expect(result).toContain("</svg>");
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("includes title and subtitle", () => {
    const result = buildTriviaSvg("Quiz Title", "A subtitle", 2, 52, () => "");
    expect(result).toContain("Quiz Title");
    expect(result).toContain("A subtitle");
  });

  it("includes the output of renderRows", () => {
    const result = buildTriviaSvg("T", "S", 2, 52, () => "<custom-rows/>");
    expect(result).toContain("<custom-rows/>");
  });

  it("renders option boxes when options provided", () => {
    const result = buildTriviaSvg("T", "S", 1, 52, () => "", [
      "Option A",
      "Option B",
      "Option C",
    ]);
    expect(result).toContain("Option A");
    expect(result).toContain("Option B");
    expect(result).toContain("Option C");
  });

  it("does not render options section when options array is empty", () => {
    const withOptions = buildTriviaSvg("T", "S", 1, 52, () => "", ["X"]);
    const withoutOptions = buildTriviaSvg("T", "S", 1, 52, () => "");
    expect(withoutOptions.length).toBeLessThan(withOptions.length);
  });

  it("includes the footer brand text", () => {
    const result = buildTriviaSvg("T", "S", 1, 52, () => "");
    expect(result).toContain("futballero.com");
  });
});

const teamHints: TeamTriviaSvgHint[] = [
  { emoji: "🏟️", label: "Stadium", value: "Old Trafford" },
  { emoji: "🎨", label: "Kit Color", value: "Red" },
];

const teamConfig: TriviaSvgConfig<TeamTriviaSvgHint> = {
  title: "Guess the Team",
  subtitle: "Season 2024/25",
  hints: teamHints,
  options: ["Manchester United", "Arsenal", "Liverpool"],
  filename: "team-quiz.png",
};

describe("buildTeamTriviaSvg", () => {
  it("returns the correct filename", () => {
    expect(buildTeamTriviaSvg(teamConfig).filename).toBe("team-quiz.png");
  });

  it("returns GAME_SVG_WIDTH as width", () => {
    expect(buildTeamTriviaSvg(teamConfig).width).toBe(GAME_SVG_WIDTH);
  });

  it("returns a valid SVG string", () => {
    const { svgString } = buildTeamTriviaSvg(teamConfig);
    expect(svgString).toMatch(/^<svg /);
    expect(svgString).toContain("</svg>");
  });

  it("renders title and subtitle", () => {
    const { svgString } = buildTeamTriviaSvg(teamConfig);
    expect(svgString).toContain("Guess the Team");
    expect(svgString).toContain("Season 2024/25");
  });

  it("renders each hint emoji, label and value", () => {
    const { svgString } = buildTeamTriviaSvg(teamConfig);
    expect(svgString).toContain("Stadium");
    expect(svgString).toContain("Old Trafford");
    expect(svgString).toContain("Kit Color");
    expect(svgString).toContain("Red");
  });

  it("renders the options", () => {
    const { svgString } = buildTeamTriviaSvg(teamConfig);
    expect(svgString).toContain("Manchester United");
    expect(svgString).toContain("Arsenal");
    expect(svgString).toContain("Liverpool");
  });

  it("height grows with more hint rows", () => {
    const one = buildTeamTriviaSvg({ ...teamConfig, hints: [teamHints[0]] });
    const two = buildTeamTriviaSvg(teamConfig);
    expect(two.height).toBeGreaterThan(one.height);
  });
});

const transferHint: SVGPLayerTransferItem = {
  kind: SVGItemKind.Transfer,
  label: "Transfer",
  description: "Moved in summer 2021",
  fromTeamName: "Real Madrid",
  fromTeamLogo: "https://example.com/real.png",
  toTeamName: "Barcelona",
  toTeamLogo: "https://example.com/barca.png",
  date: "2021-07-01",
};

const trophyHint: SVGPlayerTrophyItem = {
  kind: SVGItemKind.Trophy,
  label: "Trophy",
  description: "Champions League winner",
  leagueName: "Champions League",
  countryName: "Europe",
  place: "Winner",
  season: "2020/21",
};

const playerConfig: TriviaSvgConfig = {
  title: "Guess the Player",
  subtitle: "Position: Forward",
  hints: [transferHint, trophyHint],
  options: ["Messi", "Ronaldo", "Neymar"],
  filename: "player-quiz.png",
};

describe("buildPlayerTriviaSvg", () => {
  it("returns the correct filename", () => {
    expect(buildPlayerTriviaSvg(playerConfig).filename).toBe("player-quiz.png");
  });

  it("returns GAME_SVG_WIDTH as width", () => {
    expect(buildPlayerTriviaSvg(playerConfig).width).toBe(GAME_SVG_WIDTH);
  });

  it("returns a valid SVG string", () => {
    const { svgString } = buildPlayerTriviaSvg(playerConfig);
    expect(svgString).toMatch(/^<svg /);
    expect(svgString).toContain("</svg>");
  });

  it("renders title and subtitle", () => {
    const { svgString } = buildPlayerTriviaSvg(playerConfig);
    expect(svgString).toContain("Guess the Player");
    expect(svgString).toContain("Position: Forward");
  });

  it("renders transfer hint with label and team logos", () => {
    const { svgString } = buildPlayerTriviaSvg(playerConfig);
    expect(svgString).toContain("Transfer");
    expect(svgString).toContain("real.png");
    expect(svgString).toContain("barca.png");
    expect(svgString).toContain("Moved in summer 2021");
  });

  it("renders trophy hint with label and description", () => {
    const { svgString } = buildPlayerTriviaSvg(playerConfig);
    expect(svgString).toContain("Trophy");
    expect(svgString).toContain("Champions League winner");
  });

  it("renders the options", () => {
    const { svgString } = buildPlayerTriviaSvg(playerConfig);
    expect(svgString).toContain("Messi");
    expect(svgString).toContain("Ronaldo");
  });

  it("does not throw when optional fields are absent", () => {
    const minimal: TriviaSvgConfig = {
      ...playerConfig,
      hints: [
        { kind: SVGItemKind.Transfer },
        { kind: SVGItemKind.Trophy, countryName: "Spain" },
      ],
    };
    expect(() => buildPlayerTriviaSvg(minimal)).not.toThrow();
  });

  it("height grows with more hint rows", () => {
    const one = buildPlayerTriviaSvg({
      ...playerConfig,
      hints: [transferHint],
    });
    const two = buildPlayerTriviaSvg(playerConfig);
    expect(two.height).toBeGreaterThan(one.height);
  });
});
