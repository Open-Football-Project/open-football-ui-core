import { useEffect, useRef, useState } from "react";
import { LiveChartableMatch } from "../../types";
import { mockOddsChartableMatches } from "../../mock-data";


export type ChartsOddsSourceFactory = (url: string) => EventSource;

export const useOddsFixturesEvents = (
  apiHost: string,
  useApiMock: number,
  source?: ChartsOddsSourceFactory
) => {
  const sourceRef = useRef(source);
  sourceRef.current = source;

  const [oddsFixtures, setOddsFixtures] = useState<LiveChartableMatch[]>([]);

  useEffect(() => {
    if (Number(useApiMock) > 0) {
      setOddsFixtures(mockOddsChartableMatches);
      return;
    }

    const eventsSource =
      sourceRef.current ?? ((url: string) => new EventSource(url));
    const events = eventsSource(`${apiHost}/sse/charts/odds`);

    const onMessage = (event: MessageEvent) => {
      try {
        const data: LiveChartableMatch[] = JSON.parse(event.data);
        setOddsFixtures(data);
      } catch (err) {
        setOddsFixtures([]);
      }
    };

    const onError = () => {
      console.warn("Error occurred with odds Events Source.");
    };

    events.addEventListener("message", onMessage);
    events.addEventListener("error", onError);

    return () => {
      events.removeEventListener("message", onMessage);
      events.removeEventListener("error", onError);
      events.close();
    };
  }, [apiHost, useApiMock]);

  return oddsFixtures;
};
