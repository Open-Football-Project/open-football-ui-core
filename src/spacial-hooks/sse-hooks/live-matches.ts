import { useEffect, useRef, useState } from "react";
import { LiveMatchesResponse } from "../../types";
import { mockLiveMatchesResponse } from "../../mock-data";

export type EventSourceFactory = (url: string) => EventSource;

export const useLiveMatches = (
  apiHost: string,
  useApiMock: number,
  source?: EventSourceFactory
) => {
  const sourceRef = useRef(source);
  sourceRef.current = source;

  const [matchesResponse, setMatchesResponse] = useState<LiveMatchesResponse[]>(
    []
  );

  useEffect(() => {
    if (Number(useApiMock) > 0) {
      setMatchesResponse(mockLiveMatchesResponse);
      return;
    }

    const eventsSource = sourceRef.current ?? ((url: string) => new EventSource(url));
    const events = eventsSource(`${apiHost}/sse`);

    const onMessage = (event: MessageEvent) => {
      try {
        const data: LiveMatchesResponse[] = JSON.parse(event.data);
        setMatchesResponse(data);
      } catch (err) {
        setMatchesResponse([]);
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

  return matchesResponse;
};
