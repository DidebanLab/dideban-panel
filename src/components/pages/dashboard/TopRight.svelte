<script>
  const MAIN_STATUS_BOARD = [
    { title: 'Agents', total: 15, up: 12, down: 2, warn: 1 },
    { title: 'Services', total: 15, up: 8, down: 2, warn: 5 },
  ];
</script>

<div class="w-[35%] h-auto grid grid-cols-1 gap-7.75">
  <div class="grid gap-4 grid-cols-1">
    {#each MAIN_STATUS_BOARD as item (item.title)}<div
        class="p-6 flex flex-col gap-4 bg-white dark:bg-transparent border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden">
        <div class="flex items-center gap-3 w-full">
          <span class="text-xl dark:text-white">{item.title}</span>
        </div>

        <div class="grid grid-cols-4 grid-rows-1 h-auto gap-3 w-full flex-1">
          <div
            class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
              <div class="w-full h-full bg-white/5"></div>
            </div>
            <div
              class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl py-1">
              <div class="h-5 group flex justify-center items-center"></div>
              <img class="absolute top-1/2 -translate-y-1/2 start-2"  width="18" src="/icons/total.svg" alt="total" />
              <span class="text-base text-black dark:text-white">Total</span>
            </div>

            <span class="text-3xl text-[#3b82f6] px-2">{item.total}</span>
            <img
             class="opacity-5 absolute -bottom-2 -end-1"
              width="70"
              src="/icons/total.svg"
              alt="total" />
          </div>

          <div
            class="border-[#00bc7d]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group bg-linear-to-bl from-[#22c55e]/5">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(0,212,146,0.8);">
              <div class="w-full h-full bg-white/5"></div>
            </div>
            <div
              class="flex items-center justify-center gap-2.5 bg-[#00bc7d]/10 w-full rounded-xl py-1 relative">
              <div class="h-5 group flex justify-center items-center"></div>
              <img class="absolute top-1/2 -translate-y-1/2 start-2" width="18" src="/icons/tick.svg" alt="tick" />
              <span class="text-base text-black dark:text-white">Up</span>
            </div>

            <span class="text-3xl text-[#00bc7d] px-2">{item.up}</span>
            <img
              class="opacity-5 absolute -bottom-2 -end-1"
              width="70"
              src="/icons/tick.svg"
              alt="up" />
          </div>
          <div
            class="border-[#FB2C36]/15 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(255,100,103)">
              <div class="w-full h-full bg-white/5"></div>
            </div>
            <div
              class="flex items-center justify-start gap-2.5 bg-[#F87171]/10 w-full rounded-xl py-1">
              <div class="h-5 group flex justify-center items-center"></div>
              <img width="19" src="/icons/error.svg" alt="error" />
              <span class="text-base text-black dark:text-white">Down</span>
            </div>
            <span class="text-3xl text-[#F87171] px-2">{item.down}</span>
            <img
              class="opacity-5 absolute -bottom-2 -end-1"
              width="70"
              src="/icons/error.svg"
              alt="error" />
          </div>
          <div
            class="border-[#fdc700]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group bg-linear-to-bl from-[#F0B100]/5">
            <div
              class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
              style="box-shadow: 0 0 100px 30px rgb(252,200,0);">
              <div class="w-full h-full bg-white/5"></div>
            </div>
            <div
              class="relative flex items-center justify-center gap-2.5 bg-[#F87171]/10 w-full rounded-xl py-1">
              <div class="h-5 group flex justify-center items-center"></div>
              <img class="absolute top-1/2 -translate-y-1/2 start-2" width="19" src="/icons/warning.svg" alt="warning" />
              <span class="text-base text-black dark:text-white">Warn</span>
            </div>
            <span class="text-3xl text-[#fdc700] px-2">{item.warn}</span>
            <img
              class="opacity-5 absolute -bottom-2 -end-1"
              width="70"
              src="/icons/warning.svg"
              alt="error" />
          </div>
        </div>
      </div>{/each}
  </div>
</div>
