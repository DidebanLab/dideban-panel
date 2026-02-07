<script>
  import { onMount } from 'svelte';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';

  let agentsStats = $state({
    total: 8,
    enabled: 6,
    disabled: 2,
    status: {
      online: 4,
      offline: 4,
    },
  });

  let checksStats = $state({
    total: 12,
    enabled: 10,
    disabled: 2,
    status: {
      up: 7,
      down: 2,
      error: 1,
      timeout: 0,
    },
  });

  onMount(() => {
    http.get(endpoints.agentsStats).then(res => {
      agentsStats = res.data.data;
    });

    http.get(endpoints.checksStats).then(res => {
      checksStats = res.data.data;
    });
  });
</script>

<div class="w-full min-[1920px]:w-[35%] h-auto grid grid-cols-1 gap-7.75">
  <div
    class="flex flex-col lg:flex-row 3xl:flex-col min-[1920px]:flex-col min-[1920px]:justify-between gap-6 sm:gap-4 w-full">
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 bg-white dark:bg-transparent sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-center gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Agents</span>

        <div class="flex flex-col justify-center items-end gap-1">
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#F87171] pe-1">Disabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{agentsStats.disabled}</span>
          </div>
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#00bc7d] pe-2">Enabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{agentsStats.enabled}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1">
        <div
          class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
          <div
            class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
            style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
            <div class="w-full h-full bg-white/5"></div>
          </div>
          <div
            class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl h-full py-px">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5"
              width="18"
              src="/icons/total.svg"
              alt="total" />
            <span class="text-base text-black dark:text-white">Total</span>
          </div>

          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#3b82f6]"
            >{agentsStats.total}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
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
            class="flex items-center justify-center gap-2.5 bg-[#00bc7d]/10 w-full rounded-xl h-full py-px relative">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1"
              width="18"
              src="/icons/online.png"
              alt="tick" />
            <span class="text-base text-black dark:text-white">Online</span>
          </div>

          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#00bc7d]"
            >{agentsStats.status.online}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
            width="70"
            src="/icons/online.png"
            alt="png" />
        </div>
        <div
          class="border-[#FB2C36]/15 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
          <div
            class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
            style="box-shadow: 0 0 100px 30px rgb(255,100,103)">
            <div class="w-full h-full bg-white/5"></div>
          </div>
          <div
            class="relative flex items-center justify-center bg-[#F87171]/10 w-full rounded-xl h-full py-px">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1 size-4.5"
              width="19"
              src="/icons/offline.png"
              alt="offline" />
            <span class="text-base text-black dark:text-white">Offline</span>
          </div>
          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#F87171]"
            >{agentsStats.status.offline}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
            width="70"
            src="/icons/offline.png"
            alt="offline" />
        </div>
      </div>
    </div>
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 bg-white dark:bg-transparent sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-center gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Checkers</span>

        <div class="flex flex-col justify-center items-end gap-1">
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#F87171] pe-2">Disabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{checksStats.disabled}</span>
          </div>
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#00bc7d] pe-2">Enabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{checksStats.enabled}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1">
        <div
          class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
          <div
            class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
            style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
            <div class="w-full h-full bg-white/5"></div>
          </div>
          <div
            class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl h-full py-px">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5"
              width="18"
              src="/icons/total.svg"
              alt="total" />
            <span class="text-base text-black dark:text-white">Total</span>
          </div>

          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#3b82f6]"
            >{checksStats.total}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
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
            class="flex items-center justify-center gap-2.5 bg-[#00bc7d]/10 w-full rounded-xl h-full py-px relative">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1"
              width="18"
              src="/icons/tick.svg"
              alt="tick" />
            <span class="text-base text-black dark:text-white">Up</span>
          </div>

          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#00bc7d]"
            >{checksStats.status.up}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
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
            class="relative flex items-center justify-center bg-[#F87171]/10 w-full rounded-xl h-full py-px">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1 size-4.5"
              width="19"
              src="/icons/error.svg"
              alt="error" />
            <span class="text-base text-black dark:text-white">Down</span>
          </div>
          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#F87171]"
            >{checksStats.status.down}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
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
            class="relative flex items-center justify-center gap-2.5 bg-[#F87171]/10 w-full rounded-xl h-full py-px">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1 size-4"
              width="19"
              src="/icons/warning.svg"
              alt="timeout" />
            <span class="text-base text-black dark:text-white">Timeout</span>
          </div>
          <span class="text-4xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#fdc700]"
            >{checksStats.status.timeout}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
            width="70"
            src="/icons/warning.svg"
            alt="timeout" />
        </div>
      </div>
    </div>
  </div>
</div>
