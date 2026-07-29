import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useNewsState } from "./news-state";
import { mockNewsData } from "../../mock-data";

describe("useNewsState", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sets cardsToShow to xs on small screens", () => {
    const { result } = renderHook(() => useNewsState(mockNewsData, 320));

    expect(result.current.cardsToShow).toBe(1);
    expect(result.current.visibleItems).toHaveLength(1);
  });

  it("sets cardsToShow to sm breakpoint", () => {
    const { result } = renderHook(() => useNewsState(mockNewsData, 600));

    expect(result.current.cardsToShow).toBe(2);
  });

  it("sets cardsToShow to md breakpoint", () => {
    const { result } = renderHook(() => useNewsState(mockNewsData, 900));

    expect(result.current.cardsToShow).toBe(3);
  });

  it("sets cardsToShow to lg breakpoint", () => {
    const { result } = renderHook(() => useNewsState(mockNewsData, 1400));

    expect(result.current.cardsToShow).toBe(4);
  });

  it("sets cardsToShow to xl breakpoint", () => {
    const { result } = renderHook(() => useNewsState(mockNewsData, 1600));

    expect(result.current.cardsToShow).toBe(5);
  });

  it("updates cardsToShow when width changes", () => {
    const { result, rerender } = renderHook(
      ({ width }) => useNewsState(mockNewsData, width),
      { initialProps: { width: 320 } }
    );

    expect(result.current.cardsToShow).toBe(1);

    rerender({ width: 1280 });

    expect(result.current.cardsToShow).toBe(4);
  });
});
