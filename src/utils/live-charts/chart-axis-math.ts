export interface MinuteTimedPoint {
  minute: number;
  capturedAt: string;
}

export interface PositionedPoint<T extends MinuteTimedPoint> {
  point: T;
  x: number;
}

export const spreadMinutesToX = <T extends MinuteTimedPoint>(
  points: T[],
  pixelsPerMinute: number,
  paddingX: number,
): PositionedPoint<T>[] => {
  const sorted = [...points].sort(
    (a, b) =>
      a.minute - b.minute || new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime(),
  );

  const groupSizes = new Map<number, number>();
  sorted.forEach((point) => groupSizes.set(point.minute, (groupSizes.get(point.minute) ?? 0) + 1));

  const seenInGroup = new Map<number, number>();
  return sorted.map((point) => {
    const slot = seenInGroup.get(point.minute) ?? 0;
    seenInGroup.set(point.minute, slot + 1);
    const fraction = slot / (groupSizes.get(point.minute) ?? 1);
    return {
      point,
      x: paddingX + point.minute * pixelsPerMinute + fraction * pixelsPerMinute,
    };
  });
};

export interface OverlapLabel {
  y: number;
}

export const resolveLabelOverlap = <T extends OverlapLabel>(labels: T[], minGap: number): T[] => {
  const sorted = [...labels].sort((a, b) => a.y - b.y);

  for (let i = 1; i < sorted.length; i++) {
    const minY = sorted[i - 1].y + minGap;
    if (sorted[i].y < minY) {
      sorted[i] = { ...sorted[i], y: minY };
    }
  }

  return sorted;
};
