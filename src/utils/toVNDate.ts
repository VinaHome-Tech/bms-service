import { addMinutes, format } from "date-fns";

export function toVNDate(date: Date | string, dateFormat = 'yyyy-MM-dd', timeFormat?: string) {
    if (!date) return null;

    const d = typeof date === 'string' ? new Date(date) : date;
    const vnDate = addMinutes(d, 7 * 60); // UTC → GMT+7

    return timeFormat ? format(vnDate, timeFormat) : format(vnDate, dateFormat);
}