import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useGamePageStatus,
  GAME_TEAM,
  GAME_PLAYER,
  gamingLeagues,
} from "./GamePageStatus";

const mocks = vi.hoisted(() => ({
  useGuessTheTeam: vi.fn(),
  useGuessThePlayer: vi.fn(),
  useLeagueTeams: vi.fn(),
}));

vi.mock("../../api-hooks", async () => {
  return {
    useGuessTheTeam: mocks.useGuessTheTeam,
    useGuessThePlayer: mocks.useGuessThePlayer,
    useLeagueTeams: mocks.useLeagueTeams,
  };
});

describe("useGamePageStatus", () => {
  const mockApiService = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useGuessTheTeam.mockReturnValue({
      guessTheTeam: { teamId: 10 },
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: true,
      getNewGame: vi.fn(),
    });

    mocks.useLeagueTeams.mockReturnValue({
      leaguesTeams: [
        { teamId: 100, teamName: "Mock Team A" },
        { teamId: 200, teamName: "Mock Team B" },
      ],
      loadingLeaguesTeams: false,
      isLeaguesTeamsAvailable: true,
    });

    mocks.useGuessThePlayer.mockReturnValue({
      guessThePlayer: { playerId: 5 },
      loadingGuessThePlayer: false,
      isGuessThePlayerAvailable: true,
      getNewGame: vi.fn(),
    });
  });

  it("should initialize with TEAM_GAME as default", () => {
    const { result } = renderHook(() => useGamePageStatus(mockApiService));

    expect(result.current.gameType).toBe(GAME_TEAM);
  });

  it("should load leagues teams immediately", () => {
    const { result } = renderHook(() => useGamePageStatus(mockApiService));

    expect(result.current.leaguesTeams.length).toBe(2);
  });

  it("should set teamId when gameType changes to PLAYER_GAME", () => {
    const { result } = renderHook(() => useGamePageStatus(mockApiService));

    act(() => {
      result.current.setGameType(GAME_PLAYER);
    });

    expect(result.current.teamId).toBe("100");
  });

  it("should call guess-the-team  with correct leagueId", () => {
    renderHook(() => useGamePageStatus(mockApiService));

    expect(mocks.useGuessTheTeam).toHaveBeenCalledWith(
      mockApiService,
      Number(gamingLeagues[0].id)
    );
  });

  it("should call guess-the-player hook with teamId when PLAYER_GAME", () => {
    const { result } = renderHook(() => useGamePageStatus(mockApiService));

    act(() => {
      result.current.setGameType(GAME_PLAYER);
    });

    expect(mocks.useGuessThePlayer).toHaveBeenLastCalledWith(
      mockApiService,
      100
    );
  });

  it("should update leagueId and reset player game accordingly", async () => {
    mocks.useGuessTheTeam.mockReturnValue({
      leaguesTeams: [{ teamId: 999, teamName: "New League Team" }],
      loadingLeaguesTeams: false,
      isLeaguesTeamsAvailable: true,
    });

    const { result, rerender } = renderHook(() =>
      useGamePageStatus(mockApiService)
    );

    act(() => {
      result.current.setGameType(GAME_PLAYER);
    });

    act(() => {
      result.current.setLeagueId("99999");
    });

    rerender();

    expect(result.current.teamId).toBe("100");
  });
});
