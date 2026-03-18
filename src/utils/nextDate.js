import { goto } from '$app/navigation';
import getDate from './getDate';

export default function nextDate(dateData,dateParam, today, type, id) {
  let d;

  if (dateParam) {
    d = getDate(dateParam).date;
  } else {
    d = getDate(today).date;
  }
  const year = d.year;
  const month = d.month;
  const day = d.day;

  const maxDay = Object.keys(
    dateData?.filter(item => Number(item?.month) === Number(month))?.[0]?.history,
  ).length;
  let nextDay = Number(day);
  let nextMonth = Number(month);
  let nextYear = Number(year);
  if (Number(day) === maxDay) {
    nextDay = 1;
    if (nextMonth === 12) {
      nextMonth = 1;
      nextYear = nextYear + 1;
    } else {
      nextMonth = nextMonth + 1;
    }
  } else {
    nextDay = nextDay + 1;
  }

  goto(
    `/${type === 'agent' ? 'agents' : 'checkers'}/${id}?date=${nextYear}-${nextMonth}-${nextDay}`,
  );
}
