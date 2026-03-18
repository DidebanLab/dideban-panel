import { goto } from '$app/navigation';
import getDate from './getDate';

export default function preDate(dateData, dateParam, today, type, id) {
  let d;

  if (dateParam) {
    d = getDate(dateParam).date;
  } else {
    d = getDate(today).date;
  }

  let perDay = Number(d.day);
  let perMonth = Number(d.month);
  let perYear = Number(d.year);

  if (perDay === 1) {
    if (perMonth === 1) {
      perMonth = 12;
      perYear = perYear - 1;
    } else {
      perMonth = perMonth - 1;
    }

    const prevMonthData = dateData?.find(
      item => Number(item?.year) === perYear && Number(item?.month) === perMonth,
    );

    if (prevMonthData && prevMonthData?.history) {
      const daysInMonth = Math.max(
        ...Object.keys(prevMonthData?.history).map(key => parseInt(key)),
      );
      perDay = daysInMonth;
    } else {
      return;
    }
  } else {
    perDay = perDay - 1;
  }

  goto(`/${type === 'agent' ? 'agents' : 'checkers'}/${id}?date=${perYear}-${perMonth}-${perDay}`);
}
