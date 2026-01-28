<script>
  import UptimeHistoryBox from './UptimeHistoryBox.svelte';

  const data = [
    {
      month: 'January',
      average: 90,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'February',
      average: 95,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94,
      ],
    },
    {
      month: 'March',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'April',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'May',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'June',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'July',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'August',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'September',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'October',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'November',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53,
        78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
    {
      month: 'December',
      average: 98,
      uptime: [
        100, 98, 96, 94, 98, 100, 100, 90, 50, 30, 53, 78, 90, 98, 96, 94, 98, 100, 100, 90, 50, 30,
        53, 78, 90, 98, 96, 94, 98, 100, 100,
      ],
    },
  ];
</script>

<div
  class="w-full flex flex-col justify-start items-start gap-4 sm:border border-[#0D0D0D]/5 dark:border-white/5 sm:p-4 2xl:p-6 rounded-xl">
  <div class="flex flex-col">
    <span class="text-black dark:text-white text-xl">Uptime</span><span
      class="text-sm text-[#99a1af]">History Of Uptime</span>
  </div>

  <div
    class="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 text-white gap-1 pb-21.5 sm:pb-10 xl:pb-0 sm:gap-4 relative">
    <div class="absolute end-0 bottom-0 flex flex-col sm:flex-row xl:flex-col justify-center items-end gap-2 sm:gap-10 xl:gap-2 w-full xl:w-fit">
      <div class="flex justify-center items-center gap-2 text-white/40 text-xs sm:text-sm">
        <span> More than 80%</span>
        <div class="size-3 sm:size-3.5 rounded-xs sm:rounded-sm bg-red-700"></div>
      </div>
      <div class="flex justify-center items-center gap-2 text-white/40 text-xs sm:text-sm">
        <span> {'50% < value < 80%'}</span>
        <div class="size-3 sm:size-3.5 rounded-xs sm:rounded-sm bg-[#F97316]"></div>
      </div>
      <div class="flex justify-center items-center gap-2 text-white/40 text-xs sm:text-sm">
        <span>less Than 51 %</span>
        <div class="size-3 sm:size-3.5 rounded-xs sm:rounded-sm bg-green-700"></div>
      </div>
    </div>

    {#each data as item (item.month)}
      <UptimeHistoryBox month={item.month} average={item.average} data={item.uptime} />
    {/each}
  </div>
</div>
