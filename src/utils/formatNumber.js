export default function formatNumber(value) {
  if (!value) return;
  if (value % 1 === 0) {
    return value;
  }

  return value.toFixed(2);
}
