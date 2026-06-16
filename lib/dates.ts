import {
  format,
  formatDistanceToNow,
  isSameDay,
  differenceInMinutes,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";

export function fmtDate(date: Date | string, pattern = "d MMM yyyy") {
  return format(new Date(date), pattern, { locale: fr });
}

export function fmtDateTime(date: Date | string) {
  return format(new Date(date), "d MMM yyyy 'à' HH:mm", { locale: fr });
}

export function fmtTime(date: Date | string) {
  return format(new Date(date), "HH:mm", { locale: fr });
}

export function fmtDayLong(date: Date | string) {
  return format(new Date(date), "EEEE d MMMM yyyy", { locale: fr });
}

export function fmtRange(start: Date | string, end: Date | string) {
  const s = new Date(start);
  const e = new Date(end);
  if (isSameDay(s, e)) {
    return `${format(s, "d MMM yyyy", { locale: fr })} · ${format(s, "HH:mm")} – ${format(e, "HH:mm")}`;
  }
  return `${fmtDateTime(s)} → ${fmtDateTime(e)}`;
}

export function fromNow(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
}

export function durationLabel(start: Date | string, end: Date | string) {
  const mins = differenceInMinutes(new Date(end), new Date(start));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h${String(m).padStart(2, "0")}`;
  if (h) return `${h}h`;
  return `${m} min`;
}

export {
  isSameDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  differenceInMinutes,
};

export const WEEKDAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
