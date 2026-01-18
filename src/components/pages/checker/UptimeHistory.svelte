<script>
  import UptimeChart from '../../common/UptimeChart.svelte';

  const data = [
    10, 50, 20, 24, 14, 23, 10, 50, 20, 24, 14, 23, 10, 50, 20, 24, 14, 23, 10, 50, 20, 24, 14, 23,
  ];
</script>

<div
  class="w-[60vw] flex flex-col gap-4 p-6 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="w-full flex justify-between items-start">
    <div class="w-full flex flex-col justify-start items-start">
      <span class="text-xl text-black dark:text-white">September 13th</span>
      <span class="text-sm text-[#99a1af]">History Of Uptime In Sep 13th</span>
    </div>

    <div
      class="h-full w-fit flex justify-center items-center gap-4 px-4 py-2 rounded-[10px] bg-[#F9FAFB] dark:bg-[#121212] border border-[#0D0D0D]/5 dark:border-white/5">
      <div class="w-full flex justify-start items-center gap-2.5">
        <span style="box-shadow: 0 0 10px 1px #2b7fff;" class="size-2.5 rounded-full bg-[#2b7fff]"
        ></span>
        <span class="flex justify-center items-center text-base text-[#6a7282] text-nowrap"
          >Average Uptime Of Month :</span>
      </div>

      <span class="text-black dark:text-white text-base">50%</span>
    </div>
  </div>

  <UptimeChart name="Latency" height={250} {data} />
</div>
