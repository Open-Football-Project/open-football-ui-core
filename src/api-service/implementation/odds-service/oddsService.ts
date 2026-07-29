import { getApiFetch } from "../../api-service";
import { Bet, OddsWinnerFeeling, ValueBetsResponse } from "../../../types";

export interface OddsService {
  fetchOdds: (fixtureId: number) => Promise<Bet[]>;
  fetchOddWinnerFeeling: (fixtureId: number) => Promise<OddsWinnerFeeling>;
  fetchValueBets: (fixtureId: number) => Promise<ValueBetsResponse>;
}

export const oddsService: OddsService = {
  fetchOdds: async (fixtureId: number): Promise<Bet[]> => {
    const response = await getApiFetch().get<Bet[]>(`/api/odds/${fixtureId}`);
    return response.data;
  },

  fetchOddWinnerFeeling: async (
    fixtureId: number
  ): Promise<OddsWinnerFeeling> => {
    const response = await getApiFetch().get<OddsWinnerFeeling>(
      `/api/odds/feeling/winner/${fixtureId}`
    );
    return response.data;
  },

  fetchValueBets: async (fixtureId: number): Promise<ValueBetsResponse> => {
    const response = await getApiFetch().get<ValueBetsResponse>(
      `/api/odds/value-bets/${fixtureId}`
    );
    return response.data;
  },
};
