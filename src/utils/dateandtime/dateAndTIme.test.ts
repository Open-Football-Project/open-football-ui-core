import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isUTCDateTodayLocal,
  isUTCDateInFutureLocal,
  getFormattedDate,
  getFormattedTime,
  getLocalISODate,
  localToUTC,
  isUTCBetweenLocalHours,
  isFullUTCDate,
} from "./dateAndTime";

const MOCK_NOW = new Date("2026-01-18T12:34:56Z");

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(MOCK_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("getFormattedDate", () => {
  it("formats a valid date", () => {
    expect(getFormattedDate("2026-01-18T00:00:00Z")).toBe("2026-01-18");
    expect(getFormattedDate("2026-01-18T00:00:00Z", "dd/MM/yyyy")).toBe(
      "18/01/2026"
    );
  });

  it("returns 'Unknown Date' for invalid input", () => {
    expect(getFormattedDate("invalid-date")).toBe("Unknown Date");
  });
});

describe("getFormattedTime", () => {
  it("formats time correctly", () => {
    expect(getFormattedTime("2026-01-18T15:45:00Z")).toBe("15:45");
  });

  it("returns 'Unknown Time' for invalid input", () => {
    expect(getFormattedTime("invalid-date")).toBe("Unknown Time");
  });
});

describe("getLocalISODate", () => {
  it("returns current local ISO date", () => {
    expect(getLocalISODate()).toBe("2026-01-18");
  });
});

describe("isUTCDateTodayLocal", () => {
  it("returns true if date is today", () => {
    expect(isUTCDateTodayLocal("2026-01-18T05:00:00Z")).toBe(true);
  });

  it("returns false if date is not today", () => {
    expect(isUTCDateTodayLocal("2026-01-17T23:59:59Z")).toBe(false);
  });

  it("returns false for invalid date", () => {
    expect(isUTCDateTodayLocal("not-a-date")).toBe(false);
  });
});

describe("isUTCDateInFutureLocal", () => {
  it("returns true if date is in the future", () => {
    expect(isUTCDateInFutureLocal("2026-01-19T00:00:00Z")).toBe(true);
  });

  it("returns false if date is in the past", () => {
    expect(isUTCDateInFutureLocal("2026-01-17T23:59:59Z")).toBe(false);
  });

  it("returns false for invalid date", () => {
    expect(isUTCDateInFutureLocal("invalid")).toBe(false);
  });
});

describe("localToUTC", () => {
  it("converts local date + hour to UTC yyyy-MM-dd string", () => {
    const result = localToUTC("2026-01-18", 10);
    expect(result).toBe("2026-01-18");
  });

  it("returns 'Invalid Date' for invalid input", () => {
    expect(localToUTC("invalid", 10)).toBe("Invalid Date");
  });
});

describe("isUTCBetweenLocalHours", () => {
  it("returns true if hour is within start and end", () => {
    expect(isUTCBetweenLocalHours("2026-01-18T12:00:00Z", 10, 15)).toBe(true);
  });

  it("returns false if hour is before start", () => {
    expect(isUTCBetweenLocalHours("2026-01-18T09:00:00Z", 10, 15)).toBe(false);
  });

  it("returns false if hour is after end", () => {
    expect(isUTCBetweenLocalHours("2026-01-18T16:00:00Z", 10, 15)).toBe(false);
  });

  it("returns false for invalid date", () => {
    expect(isUTCBetweenLocalHours("invalid", 10, 15)).toBe(false);
  });

  it("returns true when hour equals the start boundary (inclusive)", () => {
    expect(isUTCBetweenLocalHours("2026-01-18T10:00:00Z", 10, 15)).toBe(true);
  });

  it("returns false when hour equals the end boundary (exclusive)", () => {
    expect(isUTCBetweenLocalHours("2026-01-18T15:00:00Z", 10, 15)).toBe(false);
  });

  describe("wrap-around range (endHour < startHour), e.g. 23:00→08:00", () => {
    it("returns true at the start boundary hour (23)", () => {
      expect(isUTCBetweenLocalHours("2026-01-18T23:00:00Z", 23, 8)).toBe(true);
    });

    it("returns true at midnight (0)", () => {
      expect(isUTCBetweenLocalHours("2026-01-19T00:00:00Z", 23, 8)).toBe(true);
    });

    it("returns true at the last hour before the end boundary (7)", () => {
      expect(isUTCBetweenLocalHours("2026-01-19T07:00:00Z", 23, 8)).toBe(true);
    });

    it("returns false at the end boundary hour (8, exclusive)", () => {
      expect(isUTCBetweenLocalHours("2026-01-19T08:00:00Z", 23, 8)).toBe(false);
    });

    it("returns false the hour before the start boundary (22)", () => {
      expect(isUTCBetweenLocalHours("2026-01-18T22:00:00Z", 23, 8)).toBe(false);
    });

    it("returns true for an hour in the middle of the wrapped range (2am)", () => {
      expect(isUTCBetweenLocalHours("2026-01-19T02:00:00Z", 23, 8)).toBe(true);
    });

    it("returns false for an hour outside the wrapped range in the middle of the day (14)", () => {
      expect(isUTCBetweenLocalHours("2026-01-18T14:00:00Z", 23, 8)).toBe(false);
    });
  });
});

describe("isFullUTCDate", () => {
  it("returns true for a full ISO UTC string with Z", () => {
    expect(isFullUTCDate("2026-04-05T00:00:00Z")).toBe(true);
  });

  it("returns true for a full ISO string with offset", () => {
    expect(isFullUTCDate("2026-04-05T18:00:00+00:00")).toBe(true);
  });

  it("returns false for a bare date string", () => {
    expect(isFullUTCDate("2026-04-05")).toBe(false);
  });

  it("returns false for a dd/MM key", () => {
    expect(isFullUTCDate("05/04")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isFullUTCDate("")).toBe(false);
  });
});
