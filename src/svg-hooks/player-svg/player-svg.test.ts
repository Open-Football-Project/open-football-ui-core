import { describe, it, expect } from "vitest";
import {
  obscurePlayerName,
  getPlayerCardSvgH,
  buildPlayerCardSvgString,
  PlayerSvgLabel,
  PlayerSvgLabels,
  PlayerCardSvgData,
  PLAYER_CARD_SVG_W,
} from "./player-svg";

describe("player-svg", () => {
  describe("obscurePlayerName", () => {
    it("should replace all non-space characters with underscores", () => {
      expect(obscurePlayerName("John Doe")).toBe("____ ___");
      expect(obscurePlayerName("A")).toBe("_");
      expect(obscurePlayerName(" ")).toBe(" ");
      expect(obscurePlayerName("")).toBe("");
    });
  });

  describe("getPlayerCardSvgH", () => {
    it("should calculate height for minimal data", () => {
      const data: PlayerCardSvgData = { playerName: "Test", playerPhoto: "" };
      const expected = 36 + 130 + 28 + 16 + 24; // HEADER_H + PHOTO_AREA_H + 28 + BOTTOM_PAD + FOOTER_H
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });

    it("should add height for age", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerAge: 25,
      };
      const expected = 36 + 130 + 28 + 20 + 16 + 24;
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });

    it("should add height for position", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        position: "FW",
      };
      const expected = 36 + 130 + 28 + 20 + 16 + 24;
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });

    it("should add height for playerNumber", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerNumber: 10,
      };
      const expected = 36 + 130 + 28 + 20 + 16 + 24;
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });

    it("should add height for team section", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerTeamName: "Team",
      };
      const expected = 36 + 130 + 28 + 34 + 16 + 24; // + teamSectionH + BOTTOM_PAD + FOOTER_H
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });

    it("should add height for stat rows", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        goals: 1,
      };
      const expected = 36 + 130 + 28 + 16 + 22 + 16 + 24; // +16 + row*22 + BOTTOM_PAD + FOOTER_H
      expect(getPlayerCardSvgH(data)).toBe(expected);
    });
  });

  describe("buildPlayerCardSvgString", () => {
    const labels: PlayerSvgLabels = new Map([
      [PlayerSvgLabel.AGE, "Age"],
      [PlayerSvgLabel.POSITION, "Position"],
      [PlayerSvgLabel.PLAYER_NUMBER, "Number"],
      [PlayerSvgLabel.GOALS, "Goals"],
      [PlayerSvgLabel.ASSISTS, "Assists"],
      [PlayerSvgLabel.YELLOW_CARDS, "Yellow Cards"],
      [PlayerSvgLabel.RED_CARDS, "Red Cards"],
      [PlayerSvgLabel.APPEARANCES, "Appearances"],
    ]);

    it("should generate SVG for minimal data", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test Player",
        playerPhoto: "photo.jpg",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("<svg");
      expect(svg).toContain('width="280"');
      expect(svg).toContain("Test Player");
      expect(svg).toContain("photo.jpg");
    });

    it("should include rank if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        rank: 1,
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("#1");
    });

    it("should include label if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        label: "Top Player",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Top Player");
    });

    it("should include age if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerAge: 25,
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Age: 25");
    });

    it("should include position if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        position: "FW",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Position: FW");
    });

    it("should include player number if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerNumber: 10,
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Number: 10");
    });

    it("should include team logo if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerTeamLogo: "logo.jpg",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("logo.jpg");
    });

    it("should include team name if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        playerTeamName: "Team A",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Team A");
    });

    it("should include footer with brand", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("futballero.com");
    });

    it("should include stats if provided", () => {
      const data: PlayerCardSvgData = {
        playerName: "Test",
        playerPhoto: "",
        goals: 5,
        assists: 3,
      };
      const svg = buildPlayerCardSvgString(data, labels);
      expect(svg).toContain("Goals:");
      expect(svg).toContain("5");
      expect(svg).toContain("Assists:");
      expect(svg).toContain("3");
    });
  });
});
