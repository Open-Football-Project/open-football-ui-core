import { OddsService } from "../implementation";
import { Bet, OddsWinnerFeeling, ValueBetsResponse } from "../../types";
import { oddsWinnerFeeling, bets, valueBetsResponse } from "../../mock-data";

export const oddsService: OddsService = {
  fetchOdds: async (fixtureId: number): Promise<Bet[]> => {
    console.log(fixtureId);
    return Promise.resolve(bets);
  },

  fetchOddWinnerFeeling: async (
    fixtureId: number
  ): Promise<OddsWinnerFeeling> => {
    console.log(fixtureId);
    return Promise.resolve(oddsWinnerFeeling);
  },

  fetchValueBets: async (fixtureId: number): Promise<ValueBetsResponse> => {
    console.log(fixtureId);
    return Promise.resolve(valueBetsResponse);
  },
};
