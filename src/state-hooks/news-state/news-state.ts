import { useMemo, useState } from "react";
import { NewsCardItem } from "../../types";

const breakpoints = [
  { max: 480, cards: 1 },
  { max: 768, cards: 2 },
  { max: 1280, cards: 3 },
  { max: 1536, cards: 4 },
  { max: Infinity, cards: 5 },
];

const getCardsToShow = (width?: number) => {
  if (!width) return 1;

  return breakpoints.find((bp) => width < bp.max)?.cards ?? 1;
};

export const useNewsState = (items: NewsCardItem[], width?: number) => {
  const [startIndex, setStartIndex] = useState(0);

  const cardsToShow = useMemo(() => getCardsToShow(width), [width]);

  const next = () => {
    setStartIndex((prev) => (prev + cardsToShow) % items.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - cardsToShow + items.length) % items.length);
  };

  const visibleItems = useMemo(() => {
    const end = startIndex + cardsToShow;
    return end <= items.length
      ? items.slice(startIndex, end)
      : [...items.slice(startIndex), ...items.slice(0, end % items.length)];
  }, [items, startIndex, cardsToShow]);

  return {
    visibleItems,
    next,
    prev,
    cardsToShow,
  };
};
