export default function getDate(initialDate) {
  const d = new Date(initialDate);
  const year = String(d.getFullYear());
  const month = String(d.getMonth() + 1);
  const day = String(d.getDate());

  return {
    string: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    date: { year, month, day },
  };
}
