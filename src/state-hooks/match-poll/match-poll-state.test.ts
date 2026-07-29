import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useMatchPollsState } from "./match-poll-state";
import { FootballProjectUIStorage } from "../../storage";

describe("useMatchPollsState", () => {
  const mockVote = vi.fn();
  const mockApiService = {
    pollsService: {
      vote: mockVote,
    },
  } as any;

  const fixtureId = 123;
  const pollKey = "match-winner";
  const optionName = "home";
  const pollStorageKey = `${fixtureId}-${pollKey}`;

  let mockStorage: FootballProjectUIStorage & { stMap: Map<string, string> };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = (() => {
      const map = new Map<string, string>();
      return {
        get: vi.fn((key: string) => Promise.resolve(map.get(key) ?? null)),
        set: vi.fn((key: string, value: string) => {
          map.set(key, value);
          return Promise.resolve();
        }),
        remove: vi.fn((key: string) => {
          map.delete(key);
          return Promise.resolve();
        }),
        stMap: map,
      };
    })();
  });

  it("should start with hasVotedState=false when not in storage", async () => {
    const { result } = renderHook(() =>
      useMatchPollsState(mockStorage, mockApiService, fixtureId, pollKey)
    );

    await waitFor(() => {
      expect(result.current.hasVotedState).toBe(false);
    });
  });

  it("should start with hasVotedState=true when already voted", async () => {
    await mockStorage.set(pollStorageKey, "true");

    const { result } = renderHook(() =>
      useMatchPollsState(mockStorage, mockApiService, fixtureId, pollKey)
    );

    await waitFor(() => {
      expect(result.current.hasVotedState).toBe(true);
    });
  });

  it("should call pollsService.vote and update hasVotedState after voting", async () => {
    mockVote.mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() =>
      useMatchPollsState(mockStorage, mockApiService, fixtureId, pollKey)
    );

    await act(async () => {
      await result.current.votePoll(optionName);
    });

    await waitFor(() => {
      expect(mockVote).toHaveBeenCalledWith({
        fixtureId,
        pollKey,
        optionName,
      });
      expect(mockStorage.stMap.get(pollStorageKey)).toBe("true");
      expect(result.current.hasVotedState).toBe(true);
    });
  });

  it("should update hasVotedState when fixtureId changes", async () => {
    await mockStorage.set("123-match-winner", "true");

    const { result, rerender } = renderHook(
      ({ id }) => useMatchPollsState(mockStorage, mockApiService, id, pollKey),
      { initialProps: { id: 123 } }
    );

    await waitFor(() => {
      expect(result.current.hasVotedState).toBe(true);
    });

    rerender({ id: 456 });

    await waitFor(() => {
      expect(result.current.hasVotedState).toBe(false);
    });
  });
});
