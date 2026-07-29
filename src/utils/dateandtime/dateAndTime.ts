import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";

export const isUTCDateTodayLocal = (utcDate: string): boolean => {
  try {
    return (
      getFormattedDate(utcDate) === getFormattedDate(new Date().toString())
    );
  } catch {
    return false;
  }
};

export const isUTCDateInFutureLocal = (utcDate: string): boolean => {
  try {
    const utc = new Date(utcDate);
    if (isNaN(utc.getTime())) return false;

    const nowLocal = new Date();

    return utc.getTime() > nowLocal.getTime();
  } catch {
    return false;
  }
};

export const isFullUTCDate = (date: string): boolean =>
  /^\d{4}-\d{2}-\d{2}T/.test(date);

export const getFormattedDate = (utcDate: string, pattern?: string): string => {
  try {
    // Date-only strings (YYYY-MM-DD) are parsed as UTC midnight by the JS spec.
    // Appending T00:00:00 forces local-midnight interpretation instead.
    const normalized = utcDate.length === 10 ? `${utcDate}T00:00:00` : utcDate;
    const date = new Date(normalized);
    return format(date, pattern ?? "yyyy-MM-dd");
  } catch {
    return "Unknown Date";
  }
};

export const getFormattedTime = (utcDate: string): string => {
  try {
    return format(new Date(utcDate), "HH:mm");
  } catch {
    return "Unknown Time";
  }
};

export const getLocalISODate = (): string => {
  const now = new Date();
  return format(now, "yyyy-MM-dd");
};

export const localToUTC = (localDate: string, fromhour: number): string => {
  try {
    const [year, month, day] = localDate.split("-").map(Number);

    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const localDateTime = new Date(
      year,
      month - 1,
      day,
      fromhour,
      minutes,
      seconds,
    );
    return formatInTimeZone(localDateTime, "UTC", "yyyy-MM-dd");
  } catch {
    return "Invalid Date";
  }
};

export const isUTCBetweenLocalHours = (
  utcDate: string,
  startHour: number,
  endHour: number,
): boolean => {
  try {
    const localDate = new Date(utcDate);
    const localHour = localDate.getHours();

    if (endHour < startHour) {
      return localHour >= startHour || localHour < endHour;
    }

    return localHour >= startHour && localHour < endHour;
  } catch {
    return false;
  }
};
