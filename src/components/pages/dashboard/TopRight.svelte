<script>
  const MAIN_STATUS_BOARD = [
    { title: 'Agents', total: 15, up: 12, down: 2, warn: 1 },
    { title: 'Services', total: 15, up: 8, down: 2, warn: 5 },
  ];
</script>

<div class="w-[35%] h-full grid grid-cols-1 gap-7.75">
  <div class="grid gap-7.75 grid-cols-1">
    {#each MAIN_STATUS_BOARD as item (item.title)}<div
        class="p-6 flex flex-col gap-4 bg-white dark:bg-transparent border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden">
        <div class="flex items-center gap-4 w-full">
          <span class="text-xl dark:text-white">{item.title}</span>
        </div>

        <div class="grid grid-cols-4 grid-rows-1 h-auto gap-6 w-full flex-1">
          <div
            class="border-[#2B7FFF]/20 flex justify-start items-start p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
              <div class="w-full h-full bg-white/5"></div>
            </div>

            <img width="18" src="/icons/total.svg" alt="total" />

            <div
              class="text-white absolute start-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <span class="text-base text-white">Total</span>
              <span class="text-2xl text-[#3b82f6]">{item.total}</span>
            </div>
          </div>

          <div
            class="border-[#00bc7d]/20 flex justify-start items-start p-1 rounded-[14px] border w-full h-full relative overflow-hidden group bg-linear-to-bl from-[#22c55e]/5">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(0,212,146,0.8);">
              <div class="w-full h-full bg-white/5"></div>
            </div>

            <img src="/icons/tick.svg" alt="tick" />

            <div
              class="text-white absolute start-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <span class="text-base text-white">{item.up}</span>
              <span class="text-2xl text-[#00bc7d]">12</span>
            </div>
          </div>
          <div
            class="border-[#FB2C36]/15 flex justify-start items-start p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(255,100,103)">
              <div class="w-full h-full bg-white/5"></div>
            </div>

            <img width="19" src="/icons/error.svg" alt="warning" />

            <div
              class="text-white absolute start-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <span class="text-base text-white">Down</span>
              <span class="text-2xl text-[#F87171]">{item.down}</span>
            </div>
          </div>
          <div
            class="border-[#fdc700]/20 flex justify-start items-start p-1 rounded-[14px] border w-full h-full relative overflow-hidden group bg-linear-to-bl from-[#F0B100]/5">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(252,200,0);">
              <div class="w-full h-full bg-white/5"></div>
            </div>

            <img width="17" src="/icons/warning.svg" alt="warning" />

            <div
              class="text-white absolute start-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
              <span class="text-base text-white">Warn</span>
              <span class="text-2xl text-[#fdc700]">{item.warn}</span>
            </div>
          </div>
        </div>
      </div>{/each}
  </div>
</div>
