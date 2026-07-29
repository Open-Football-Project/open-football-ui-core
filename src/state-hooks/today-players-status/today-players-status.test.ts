import { act, renderHook } from "@testing-library/react";
import { vi, Mock, describe, it, expect, beforeEach } from "vitest";
import { useTodayPlayersStatus } from "./today-players-status";

vi.mock("../../api-hooks", async () => ({
  useTodayPlayers: vi.fn(),
}));

import { useTodayPlayers } from "../../api-hooks";

const mockUseTodayPlayers = useTodayPlayers as Mock;

const mockFixtures = [
  { fixtureId: 101, leagueId: 1, leagueName: "Premier League" },
  { fixtureId: 102, leagueId: 1, leagueName: "Premier League" },
  { fixtureId: 201, leagueId: 2, leagueName: "La Liga" },
];

describe("useTodayPlayersStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useTodayPlayers with the given apiService", () => {
    const apiService = {} as any;
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: [],
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: false,
    });

    renderHook(() => useTodayPlayersStatus(apiService));

    expect(mockUseTodayPlayers).toHaveBeenCalledWith(apiService);
  });

  it("returns empty state when there are no fixtures", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: [],
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: false,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.leagues).toEqual([]);
    expect(result.current.selectedLeagueId).toBeUndefined();
    expect(result.current.fixturesInSelectedLeague).toEqual([]);
    expect(result.current.selectedFixtureId).toBeUndefined();
    expect(result.current.selectedFixture).toBeUndefined();
  });

  it("derives a deduped list of leagues from the fetched fixtures", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.leagues).toEqual([
      { leagueId: 1, leagueName: "Premier League" },
      { leagueId: 2, leagueName: "La Liga" },
    ]);
  });

  it("auto-selects the first league and its first fixture when no route fixtureId is given", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.selectedLeagueId).toBe(1);
    expect(result.current.fixturesInSelectedLeague).toHaveLength(2);
    expect(result.current.selectedFixtureId).toBe(101);
    expect(result.current.selectedFixture?.fixtureId).toBe(101);
  });

  it("selects the league and fixture matching the given route fixtureId", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any, "201"));

    expect(result.current.selectedLeagueId).toBe(2);
    expect(result.current.selectedFixtureId).toBe(201);
  });

  it("falls back to auto-select when the given route fixtureId isn't in the fetched fixtures", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any, "999"));

    expect(result.current.selectedLeagueId).toBe(1);
    expect(result.current.selectedFixtureId).toBe(101);
  });

  it("updates fixturesInSelectedLeague and selects that league's first fixture when setSelectedLeagueId is called", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    act(() => {
      result.current.setSelectedLeagueId(2);
    });

    expect(result.current.selectedLeagueId).toBe(2);
    expect(result.current.fixturesInSelectedLeague).toHaveLength(1);
    expect(result.current.selectedFixtureId).toBe(201);
  });

  it("keeps selectedFixtureId if still valid when setSelectedLeagueId sets the same league", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    act(() => {
      result.current.setSelectedFixtureId(102);
    });

    act(() => {
      result.current.setSelectedLeagueId(1);
    });

    expect(result.current.selectedFixtureId).toBe(102);
  });

  it("exposes a setSelectedFixtureId setter that updates selectedFixture", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    act(() => {
      result.current.setSelectedFixtureId(102);
    });

    expect(result.current.selectedFixtureId).toBe(102);
    expect(result.current.selectedFixture?.fixtureId).toBe(102);
  });

  it("switches to the first fixture in the league when the previously selected fixture is no longer present", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result, rerender } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.selectedFixtureId).toBe(101);

    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: [mockFixtures[1], mockFixtures[2]],
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    rerender();

    expect(result.current.selectedFixtureId).toBe(102);
  });

  it("clears selections when fixtures go from available to empty", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: mockFixtures,
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: true,
    });

    const { result, rerender } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.selectedLeagueId).toBe(1);

    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: [],
      loadingTodayPlayers: false,
      isTodayPlayersAvailable: false,
    });

    rerender();

    expect(result.current.selectedLeagueId).toBeUndefined();
    expect(result.current.selectedFixtureId).toBeUndefined();
  });

  it("passes through loadingTodayPlayers and isTodayPlayersAvailable", () => {
    mockUseTodayPlayers.mockReturnValue({
      todayPlayersFixtures: [],
      loadingTodayPlayers: true,
      isTodayPlayersAvailable: false,
    });

    const { result } = renderHook(() => useTodayPlayersStatus({} as any));

    expect(result.current.loadingTodayPlayers).toBe(true);
    expect(result.current.isTodayPlayersAvailable).toBe(false);
  });
});
