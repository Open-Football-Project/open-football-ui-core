import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockAllChartFixtures } from "../../mock-data";

describe("useChartsEvents", () => {
  let mockClose: any;
  let mockInstance: any;
  let useChartsEvents: any;
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

    const module = await import("./charts-events");
    useChartsEvents = module.useChartsEvents;
  });

  it("creates EventSource and updates state on message", () => {
    const { result } = renderHook(() =>
      useChartsEvents("http://test-api", 0, source)
    );

    expect(result.current).toEqual([]);

    expect(source).toHaveBeenCalledWith("http://test-api/sse/charts");

    act(() => {
      mockInstance.emit("message", {
        data: JSON.stringify(mockAllChartFixtures),
      });
    });

    expect(result.current).toEqual(mockAllChartFixtures);
  });

  it("sets charts response to [] on invalid JSON", () => {
    const { result } = renderHook(() =>
      useChartsEvents("http://test-api", 0, source)
    );

    act(() => {
      mockInstance.emit("message", { data: "not-valid-json" });
    });

    expect(result.current).toEqual([]);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() =>
      useChartsEvents("http://test-api", 0, source)
    );

    unmount();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("uses mock data when useApiMock > 0", () => {
    const { result } = renderHook(() =>
      useChartsEvents("http://test-api", 1, source)
    );

    expect(result.current).toEqual(mockAllChartFixtures);
    expect(source).not.toHaveBeenCalled();
  });
});
