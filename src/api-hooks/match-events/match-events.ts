import { useEffect, useState } from "react";
import { ApiService } from "../../api-service";
import { MatchEvent } from "../../types";

export const useMatchEvents = (apiService: ApiService, fixtureId: number) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const { matchesService } = apiService;

  const isEventsAvailable = !loadingEvents && events.length > 0;

  useEffect(() => {
    setLoadingEvents(true);

    matchesService
      .fetchMatchEvents(fixtureId)
      .then((res) => {
        setEvents(res);
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => setLoadingEvents(false));
  }, [fixtureId]);

  return {
    loadingEvents,
    events,
    isEventsAvailable,
  };
};
