export default function responseTimeColor(time) {
  if (time === -1) return 'text-[#740A03]';
  if (time <= 400) return 'text-[#008236]';
  if (time <= 1600) return 'text-[#00D492]';
  if (time <= 4800) return 'text-[#FDC700]';
  if (time <= 8000) return 'text-[#F97316';
  return 'text-[#EF4444]';
}