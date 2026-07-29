import { useEffect, useRef, useState } from "react";
import { FixtureChartsResponse } from "../../types";
import { mockAllChartFixtures } from "../../mock-data";

export type ChartsSourceFactory = (url: string) => EventSource;

export const useChartsEvents = (
  apiHost: string,
  useApiMock: number,
  source?: ChartsSourceFactory
) => {
  const sourceRef = useRef(source);
  sourceRef.current = source;

  const [chartsResponse, setChartsResponse] = useState<
    FixtureChartsResponse[]
  >([]);

  useEffect(() => {
    if (Number(useApiMock) > 0) {
      setChartsResponse(mockAllChartFixtures);
      return;
    }

    const eventsSource =
      sourceRef.current ?? ((url: string) => new EventSource(url));
    const events = eventsSource(`${apiHost}/sse/charts`);

    const onMessage = (event: MessageEvent) => {
      try {
        const data: FixtureChartsResponse[] = JSON.parse(event.data);
        setChartsResponse(data);
      } catch (err) {
        setChartsResponse([]);
      }
    };

    const onError = () => {
      console.warn("Error occurred with Events Source.");
    };

    events.addEventListener("message", onMessage);
    events.addEventListener("error", onError);

    return () => {
      events.removeEventListener("message", onMessage);
      events.removeEventListener("error", onError);
      events.close();
    };
  }, [apiHost, useApiMock]);

  return chartsResponse;
};
