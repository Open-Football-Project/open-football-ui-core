import { describe, expect, it } from "vitest";
import {
  SVGItemKind,
  SVGPLayerTransferItem,
  SVGPlayerTrophyItem,
} from "../../types/svg-reports";
import { SvgReportsColors } from "../../utils/svgreports/svgreports";
import {
  PLAYER_HISTORY_FOOTER_H,
  PLAYER_HISTORY_HEADER_H,
  buildPlayerHistorySvgString,
  getPlayerHistorySvgDimensions,
  playerHistorySVGImage,
  playerHistorySVGText,
} from "./player-svg-strategy";
import { QuizMixSvgStrategy } from "./quiz-strategy";
import { TransfersSvgStrategy } from "./transfers-strategy";
import { TrophiesSvgStrategy } from "./trophies-strategy";

const transfer: SVGPLayerTransferItem = {
  kind: SVGItemKind.Transfer,
  date: "2021-07",
  fromTeamName: "Real Madrid",
  fromTeamLogo: "https://example.com/real.png",
  toTeamName: "Barcelona",
  toTeamLogo: "https://example.com/barca.png",
};

const trophy: SVGPlayerTrophyItem = {
  kind: SVGItemKind.Trophy,
  leagueName: "La Liga",
  countryName: "Spain",
  place: "Winner",
  season: "2020/21",
};

describe("playerHistorySVGText", () => {
  it("renders a text element with defaults", () => {
    const result = playerHistorySVGText("Hello", 10, 20);
    expect(result).toContain('x="10"');
    expect(result).toContain('y="20"');
    expect(result).toContain(">Hello<");
    expect(result).toContain(`fill="${SvgReportsColors.WHITE}"`);
    expect(result).toContain('font-size="13"');
    expect(result).toContain('font-weight="normal"');
    expect(result).toContain('text-anchor="start"');
  });

  it("applies opts overrides", () => {
    const result = playerHistorySVGText("Test", 0, 0, {
      fill: "#ff0000",
      size: 16,
      weight: "bold",
      anchor: "middle",
    });
    expect(result).toContain('fill="#ff0000"');
    expect(result).toContain('font-size="16"');
    expect(result).toContain('font-weight="bold"');
    expect(result).toContain('text-anchor="middle"');
  });

  it("escapes XML special characters in content", () => {
    const result = playerHistorySVGText('A & B <C> "D"', 0, 0);
    expect(result).toContain("A &amp; B &lt;C&gt; &quot;D&quot;");
    expect(result).not.toContain("& ");
    expect(result).not.toContain("<C>");
  });
});

describe("playerHistorySVGImage", () => {
  it("renders an image for a valid href", () => {
    const result = playerHistorySVGImage(
      "https://example.com/photo.png",
      10,
      20,
      100,
    );
    expect(result).toContain("<image");
    expect(result).toContain('href="https://example.com/photo.png"');
    expect(result).toContain('x="10"');
    expect(result).toContain('y="20"');
    expect(result).toContain('width="100"');
    expect(result).toContain('height="100"');
  });

  it("escapes special characters in href", () => {
    const result = playerHistorySVGImage('https://example.com/a&b"c', 0, 0, 24);
    expect(result).toContain("&amp;");
    expect(result).toContain("&quot;");
  });

  it("returns empty string for null", () => {
    expect(playerHistorySVGImage(null, 0, 0, 100)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(playerHistorySVGImage(undefined, 0, 0, 100)).toBe("");
  });
});

describe("getPlayerHistorySvgDimensions", () => {
  const strategy = new TransfersSvgStrategy({ title: "T", photoUrl: "" });

  it("returns strategy width", () => {
    expect(getPlayerHistorySvgDimensions(strategy, 3).width).toBe(
      strategy.width,
    );
  });

  it("height = headerHeight + rows * rowHeight + PLAYER_HISTORY_FOOTER_H", () => {
    const { height } = getPlayerHistorySvgDimensions(strategy, 4);
    expect(height).toBe(
      PLAYER_HISTORY_HEADER_H + 4 * strategy.rowHeight + PLAYER_HISTORY_FOOTER_H,
    );
  });

  it("height is just header + footer with 0 rows", () => {
    const { height } = getPlayerHistorySvgDimensions(strategy, 0);
    expect(height).toBe(PLAYER_HISTORY_HEADER_H + PLAYER_HISTORY_FOOTER_H);
  });
});

describe("TransfersSvgStrategy", () => {
  const strategy = new TransfersSvgStrategy({
    title: "Transfer History",
    photoUrl: "https://example.com/photo.png",
  });

  describe("filterItems", () => {
    it("keeps only transfer items", () => {
      const result = strategy.filterItems([transfer, trophy]);
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe(SVGItemKind.Transfer);
    });

    it("returns empty array when no transfers", () => {
      expect(strategy.filterItems([trophy])).toHaveLength(0);
    });
  });

  describe("renderRow", () => {
    it("returns empty string for a non-transfer item", () => {
      expect(strategy.renderRow(trophy, 0, 0, 600)).toBe("");
    });

    it("renders from/to team names and the arrow", () => {
      const result = strategy.renderRow(transfer, 0, 0, 600);
      expect(result).toContain("Real Madrid");
      expect(result).toContain("Barcelona");
      expect(result).toContain("→");
    });

    it("renders the date", () => {
      const result = strategy.renderRow(transfer, 0, 0, 600);
      expect(result).toContain("2021-07");
    });

    it("renders team logo images", () => {
      const result = strategy.renderRow(transfer, 0, 0, 600);
      expect(result).toContain("real.png");
      expect(result).toContain("barca.png");
    });

    it("does not throw when optional fields are absent", () => {
      const minimal: SVGPLayerTransferItem = { kind: SVGItemKind.Transfer };
      expect(() => strategy.renderRow(minimal, 0, 0, 600)).not.toThrow();
    });
  });

  describe("getFilename", () => {
    it("lowercases and hyphenates the player name", () => {
      expect(strategy.getFilename("Lionel Messi")).toBe(
        "lionel-messi-transfers.png",
      );
    });

    it("handles multiple spaces", () => {
      expect(strategy.getFilename("Vinicius Jr")).toBe(
        "vinicius-jr-transfers.png",
      );
    });
  });

  describe("buildPlayerHistorySvgString integration", () => {
    it("produces a valid SVG wrapping transfer rows", () => {
      const svg = buildPlayerHistorySvgString(
        strategy,
        [transfer],
        "Lionel Messi",
      );
      expect(svg).toMatch(/^<svg /);
      expect(svg).toContain("</svg>");
      expect(svg).toContain("Transfer History");
      expect(svg).toContain("Lionel Messi");
      expect(svg).toContain("Real Madrid");
      expect(svg).toContain("footballproject.org");
    });

    it("shows player photo", () => {
      const svg = buildPlayerHistorySvgString(strategy, [transfer], "Player");
      expect(svg).toContain("photo.png");
    });

    it("produces taller SVG with more items", () => {
      const one = buildPlayerHistorySvgString(strategy, [transfer], "Player");
      const two = buildPlayerHistorySvgString(
        strategy,
        [transfer, transfer],
        "Player",
      );
      const heightOf = (s: string) => Number(s.match(/height="(\d+)"/)?.[1]);
      expect(heightOf(two)).toBeGreaterThan(heightOf(one));
    });
  });
});

describe("TrophiesSvgStrategy", () => {
  const strategy = new TrophiesSvgStrategy({
    title: "Trophy Cabinet",
    photoUrl: "",
  });

  describe("filterItems", () => {
    it("keeps only trophy items", () => {
      const result = strategy.filterItems([transfer, trophy]);
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe(SVGItemKind.Trophy);
    });

    it("returns empty array when no trophies", () => {
      expect(strategy.filterItems([transfer])).toHaveLength(0);
    });
  });

  describe("renderRow", () => {
    it("returns empty string for a non-trophy item", () => {
      expect(strategy.renderRow(transfer, 0, 0, 600)).toBe("");
    });

    it("renders league name, place, season and country", () => {
      const result = strategy.renderRow(trophy, 0, 0, 600);
      expect(result).toContain("La Liga");
      expect(result).toContain("Winner");
      expect(result).toContain("2020/21");
      expect(result).toContain("Spain");
    });

    it("does not throw when optional fields are absent", () => {
      const minimal: SVGPlayerTrophyItem = {
        kind: SVGItemKind.Trophy,
        countryName: "Spain",
      };
      expect(() => strategy.renderRow(minimal, 0, 0, 600)).not.toThrow();
    });
  });

  describe("getFilename", () => {
    it("lowercases and hyphenates the player name", () => {
      expect(strategy.getFilename("Lionel Messi")).toBe(
        "lionel-messi-trophies.png",
      );
    });
  });

  describe("buildPlayerHistorySvgString integration", () => {
    it("produces a valid SVG with trophy rows", () => {
      const svg = buildPlayerHistorySvgString(
        strategy,
        [trophy],
        "Lionel Messi",
      );
      expect(svg).toMatch(/^<svg /);
      expect(svg).toContain("Trophy Cabinet");
      expect(svg).toContain("Lionel Messi");
      expect(svg).toContain("La Liga");
    });
  });
});

describe("QuizMixSvgStrategy", () => {
  const strategy = new QuizMixSvgStrategy({
    title: "Quiz",
    photoUrl: "",
    transferLabel: "Transfer",
    trophyLabel: "Trophy",
  });

  describe("filterItems", () => {
    it("limits output to 6 items", () => {
      const items = Array(10).fill(transfer);
      expect(strategy.filterItems(items)).toHaveLength(6);
    });

    it("returns all items when fewer than 6", () => {
      expect(strategy.filterItems([transfer, trophy])).toHaveLength(2);
    });

    it("returns empty array for empty input", () => {
      expect(strategy.filterItems([])).toHaveLength(0);
    });
  });

  describe("renderRow", () => {
    it("renders a transfer row with blue badge and team names", () => {
      const result = strategy.renderRow(transfer, 0, 0, 600);
      expect(result).toContain(SvgReportsColors.TRIVIA_BLUE);
      expect(result).toContain("Transfer");
      expect(result).toContain("Real Madrid");
      expect(result).toContain("Barcelona");
    });

    it("renders a trophy row with yellow badge and league name", () => {
      const result = strategy.renderRow(trophy, 0, 0, 600);
      expect(result).toContain(SvgReportsColors.TRIVIA_YELLOW);
      expect(result).toContain("Trophy");
      expect(result).toContain("La Liga");
      expect(result).toContain("Winner");
    });

    it("does not throw for transfer with missing optional fields", () => {
      const minimal: SVGPLayerTransferItem = { kind: SVGItemKind.Transfer };
      expect(() => strategy.renderRow(minimal, 0, 0, 600)).not.toThrow();
    });
  });

  describe("getFilename", () => {
    it("lowercases and hyphenates the player name", () => {
      expect(strategy.getFilename("Lionel Messi")).toBe(
        "lionel-messi-quiz.png",
      );
    });
  });

  it("does not show player name (showPlayerName = false)", () => {
    expect(strategy.showPlayerName).toBe(false);
  });

  describe("buildPlayerHistorySvgString integration", () => {
    it("produces a valid SVG with mixed rows and hides player name", () => {
      const svg = buildPlayerHistorySvgString(
        strategy,
        [transfer, trophy],
        "Lionel Messi",
      );
      expect(svg).toMatch(/^<svg /);
      expect(svg).toContain("Quiz");
      expect(svg).not.toContain("Lionel Messi");
    });
  });
});
