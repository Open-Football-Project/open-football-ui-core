import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockLiveMatchesResponse } from "../../mock-data";

describe("useLiveMatches", () => {
  let mockClose: any;
  let mockInstance: any;
  let useLiveMatches: any;
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

    const module = await import("./live-matches");
    useLiveMatches = module.useLiveMatches;
  });

  it("creates EventSource and updates state on message", () => {
    const { result } = renderHook(() =>
      useLiveMatches("http://test-api", 0, source)
    );

    expect(result.current).toEqual([]);

    expect(source).toHaveBeenCalledWith(
      "http://test-api/sse"
    );

    act(() => {
      mockInstance.emit("message", {
        data: JSON.stringify(mockLiveMatchesResponse),
      });
    });

    expect(result.current).toEqual(mockLiveMatchesResponse);
  });

  it("sets matches to [] on invalid JSON", () => {
    const { result } = renderHook(() =>
      useLiveMatches("http://test-api", 0, source)
    );

    act(() => {
      mockInstance.emit("message", { data: "not-valid-json" });
    });

    expect(result.current).toEqual([]);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() =>
      useLiveMatches("http://test-api", 0, source)
    );

    unmount();

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("uses mock data when useApiMock > 0", () => {
    const { result } = renderHook(() =>
      useLiveMatches("http://test-api", 1, source)
    );

    expect(result.current).toEqual(mockLiveMatchesResponse);
    expect(source).not.toHaveBeenCalled();
  });
});
