<script>
  const { requiredHistoryCount } = $props();
</script>

<div
  class="relative h-29 sm:h-32.75 border border-[#0D0D0D]/5 dark:border-gray-400/5 rounded-[14px] flex flex-col py-4 xl:py-6 gap-7">
  <div class="flex justify-start items-center px-4.25 gap-4">
    <div class="size-12 rounded-2xl hidden sm:block bg-white/5 animate-pulse"></div>

    <div class="flex flex-col justify-center items-start gap-1">
      <span class="w-20 h-5 bg-white/5 rounded-md animate-pulse"></span>

      <div class="w-40 h-4 bg-white/5 mt-1 rounded-md animate-pulse"></div>
    </div>
    <div class="flex justify-center items-center gap-2 ms-auto mb-auto">
      <span class="w-10 h-4 bg-white/5 animate-pulse rounded-md"> </span>

      <div class="size-3 rounded-full bg-white/5 animate-pulse"></div>
    </div>
  </div>

  <div
    class="absolute z-10 bottom-4 xl:bottom-6 w-full flex gap-0.5 justify-between items-end px-4.25 animate-pulse">
    {#each Array(requiredHistoryCount) as _, i}
      <div class="w-full h-4 rounded-[1px] bg-white/5"></div>
    {/each}
  </div>
</div>
