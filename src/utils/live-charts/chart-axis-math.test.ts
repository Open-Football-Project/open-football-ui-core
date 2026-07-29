import { describe, it, expect } from "vitest";
import { spreadMinutesToX, resolveLabelOverlap } from "./chart-axis-math";

describe("spreadMinutesToX", () => {
  const PADDING_X = 20;
  const PIXELS_PER_MINUTE = 15;

  it("matches the plain minute-to-x formula for a single point in its minute", () => {
    const point = { minute: 5, capturedAt: "2026-06-24T15:05:00Z" };

    const result = spreadMinutesToX([point], PIXELS_PER_MINUTE, PADDING_X);

    expect(result).toEqual([{ point, x: 95 }]);
  });

  it("spreads points sharing a minute across increasing x values, ordered by capturedAt", () => {
    const latest = { minute: 45, capturedAt: "2026-06-24T15:50:06Z" };
    const earliest = { minute: 45, capturedAt: "2026-06-24T15:44:06Z" };
    const middle = { minute: 45, capturedAt: "2026-06-24T15:47:06Z" };

    const result = spreadMinutesToX([latest, earliest, middle], PIXELS_PER_MINUTE, PADDING_X);

    expect(result).toEqual([
      { point: earliest, x: 695 },
      { point: middle, x: 700 },
      { point: latest, x: 705 },
    ]);
  });

  it("keeps minute as the primary sort key even when capturedAt disagrees across minutes", () => {
    const minute11 = { minute: 11, capturedAt: "2026-06-24T15:00:00Z" };
    const minute10 = { minute: 10, capturedAt: "2026-06-24T15:05:00Z" };

    const result = spreadMinutesToX([minute11, minute10], PIXELS_PER_MINUTE, PADDING_X);

    expect(result).toEqual([
      { point: minute10, x: 170 },
      { point: minute11, x: 185 },
    ]);
  });

  it("gives same-minute points with identical capturedAt distinct, stable x values", () => {
    const first = { minute: 20, capturedAt: "2026-06-24T15:20:00Z" };
    const second = { minute: 20, capturedAt: "2026-06-24T15:20:00Z" };

    const result = spreadMinutesToX([first, second], PIXELS_PER_MINUTE, PADDING_X);

    expect(result).toEqual([
      { point: first, x: 320 },
      { point: second, x: 327.5 },
    ]);
  });
});

describe("resolveLabelOverlap", () => {
  it("leaves labels unchanged, sorted by y, when they're already far enough apart", () => {
    const labels = [
      { key: "Away", y: 100 },
      { key: "Home", y: 40 },
    ];

    expect(resolveLabelOverlap(labels, 10)).toEqual([
      { key: "Home", y: 40 },
      { key: "Away", y: 100 },
    ]);
  });

  it("pushes a label down to maintain the minimum gap when it's too close to the one above it", () => {
    const labels = [
      { key: "Home", y: 50 },
      { key: "Draw", y: 52 },
    ];

    expect(resolveLabelOverlap(labels, 10)).toEqual([
      { key: "Home", y: 50 },
      { key: "Draw", y: 60 },
    ]);
  });

  it("cascades the push through a chain of bunched-up labels", () => {
    const labels = [
      { key: "Home", y: 50 },
      { key: "Draw", y: 51 },
      { key: "Away", y: 52 },
    ];

    expect(resolveLabelOverlap(labels, 10)).toEqual([
      { key: "Home", y: 50 },
      { key: "Draw", y: 60 },
      { key: "Away", y: 70 },
    ]);
  });
});
