import { describe, it, expect } from "vitest";
import {
  svgRect,
  svgText,
  svgImage,
  svgHLine,
  escapeXml,
  SvgReportsFonts,
} from "./svgreports";

describe("svgRect", () => {
  it("renders a rect element with the given attributes", () => {
    expect(svgRect(10, 20, 100, 50, "#ff0000")).toBe(
      `<rect x="10" y="20" width="100" height="50" fill="#ff0000"/>`,
    );
  });

  it("renders with x=0 y=0", () => {
    expect(svgRect(0, 0, 800, 70, "#0f2150")).toBe(
      `<rect x="0" y="0" width="800" height="70" fill="#0f2150"/>`,
    );
  });
});

describe("svgText", () => {
  it("renders a text element with all attributes", () => {
    const result = svgText(400, 35, "middle", "#ffffff", 22, "bold", "Hello");
    expect(result).toContain(`x="400" y="35"`);
    expect(result).toContain(`text-anchor="middle"`);
    expect(result).toContain(`fill="#ffffff"`);
    expect(result).toContain(`font-size="22"`);
    expect(result).toContain(`font-weight="bold"`);
    expect(result).toContain(`font-family="${SvgReportsFonts.DEFAULT}"`);
    expect(result).toContain(`>Hello</text>`);
  });

  it("supports start and end anchors", () => {
    expect(svgText(0, 0, "start", "#fff", 12, "normal", "x")).toContain(
      `text-anchor="start"`,
    );
    expect(svgText(0, 0, "end", "#fff", 12, "normal", "x")).toContain(
      `text-anchor="end"`,
    );
  });

  it("renders content verbatim (caller is responsible for escaping)", () => {
    const result = svgText(0, 0, "middle", "#fff", 12, "normal", "A &amp; B");
    expect(result).toContain(">A &amp; B</text>");
  });
});

describe("svgImage", () => {
  it("renders an image element with the given attributes", () => {
    const result = svgImage("https://example.com/logo.png", 5, 10, 44);
    expect(result).toBe(
      `<image href="https://example.com/logo.png" x="5" y="10" width="44" height="44" preserveAspectRatio="xMidYMid meet"/>`,
    );
  });
});

describe("svgHLine", () => {
  it("renders a horizontal line at the given y with specified width and stroke", () => {
    expect(svgHLine(100, 800, "rgba(255,255,255,0.1)")).toBe(
      `<line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`,
    );
  });

  it("always starts at x1=0", () => {
    expect(svgHLine(50, 620, "#333")).toContain(`x1="0"`);
  });
});

describe("escapeXml", () => {
  it("escapes ampersand", () => {
    expect(escapeXml("A & B")).toBe("A &amp; B");
  });

  it("escapes less-than and greater-than", () => {
    expect(escapeXml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeXml(`say "hello"`)).toBe("say &quot;hello&quot;");
  });

  it("escapes multiple special characters in one string", () => {
    expect(escapeXml(`<a href="x&y">`)).toBe(
      `&lt;a href=&quot;x&amp;y&quot;&gt;`,
    );
  });

  it("returns the string unchanged when there is nothing to escape", () => {
    expect(escapeXml("plain text")).toBe("plain text");
  });
});
