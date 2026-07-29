import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockOddsChartableMatches } from "../../mock-data";

describe("useOddsFixturesEvents", () => {
  let mockClose: any;
  let mockInstance: any;
  let useOddsFixturesEvents: any;
  let source: any;

  beforeEach(async () => {
    vi.resetModules();
    mockClose = vi.fn();

    const listeners: Record<string, Function> = {};
    mockInstance = {
      close: mockClose,
      addEventListener: vi.fn((event: string, handler: Function) => {
        listeners[event] = handler;
      }),
      removeEventListener: vi.fn(),
      emit: (event: string, data?: any) => listeners[event]?.(data),
    };

    source = vi.fn(() => mockInstance);

    const module = await import("./odds-fixtures-events");
    useOddsFixturesEvents = module.useOddsFixturesEvents;
  });

  it("creates EventSource and updates state on message", () => {
    const { result } = renderHook(() =>
      useOddsFixturesEvents("http://test-api", 0, source)
    );

    expect(result.current).toEqual([]);

    expect(source).toHaveBeenCalledWith("http://test-api/sse/charts/odds");

    act(() => {
      mockInstance.emit("message", {
        data: JSON.stringify(mockOddsChartableMatches),
      });
    });

    expect(result.current).toEqual(mockOddsChartableMatches);
  });

  it("sets odds fixtures to [] on invalid JSON", () => {
    const { result } = renderHook(() =>
      useOddsFixturesEvents("http://test-api", 0, source)
    );

    act(() => {
      mockInstance.emit("message", { data: "not-valid-json" });
    });

    expect(result.current).toEqual([]);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() =>
      useOddsFixturesEvents("http://test-api", 0, source)
    );

    unmount();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("uses mock data when useApiMock > 0", () => {
    const { result } = renderHook(() =>
      useOddsFixturesEvents("http://test-api", 1, source)
    );

    expect(result.current).toEqual(mockOddsChartableMatches);
    expect(source).not.toHaveBeenCalled();
  });
});
