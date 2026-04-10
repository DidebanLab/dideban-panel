<script>
  import { onDestroy, onMount } from 'svelte';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  import { off, on } from '../../../services/ws.svelte';

  const { isAgentExist } = $props();
  let agentsStats = $state();
  let checksStats = $state();
  let loading = $state(true);

  onMount(async () => {
    loading = true;
    const [agentaStatsData, checksStatsData] = await Promise.all([
      http.get(endpoints.agentsStats).then(res => res.data.data),
      http.get(endpoints.checksStats).then(res => res.data.data),
    ]).finally(() => {
      loading = false;
    });

    agentsStats = agentaStatsData;
    checksStats = checksStatsData;

    on('check.stats.updated', data => {
      checksStats = data;
    });
    on('agent.stats.updated', data => {
      agentsStats = data;
    });
  });

  onDestroy(() => {
    off('check.stats.updated');
    off('agent.stats.updated');
  });
</script>

{#if loading}
  <div
    class="flex flex-col lg:flex-row gap-6 sm:gap-4 w-full ms-auto 3xl:w-[35%] 3xl:flex-col 3xl:justify-between">
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-start gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Agents</span>

        <div class="flex flex-col justify-center items-end gap-2">
          <div class="bg-white/5 h-4 w-20.75 rounded-md animate-pulse"></div>
          <div class="bg-white/5 h-4 w-20.75 rounded-md animate-pulse"></div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1">
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
      </div>
    </div>
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-start gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Checkers</span>

        <div class="flex flex-col justify-center items-end gap-2">
          <div class="bg-white/5 h-4 w-20.75 rounded-md animate-pulse"></div>
          <div class="bg-white/5 h-4 w-20.75 rounded-md animate-pulse"></div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1">
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
        <div
          class="bg-white/5 3xl:h-23.5 h-27 sm:h-26.5 lg:h-27 xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
        <div
          class="bg-white/5 3xl:h-23.5 lg:h-[106px] xl:h-23.5 xl:w-[128.25px] 3xl:w-[113.5px] rounded-lg animate-pulse">
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="flex flex-col lg:flex-row gap-6 sm:gap-4 w-full ms-auto {isAgentExist
      ? '3xl:w-[35%] 3xl:flex-col 3xl:justify-between'
      : '3xl:h-55'}">
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-start gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Agents</span>

        <div class="flex flex-col justify-center items-end gap-1">
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#F87171] pe-2">Disabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{agentsStats?.disabled || 0}</span>
          </div>
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#00bc7d] pe-2">Enabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{agentsStats?.enabled || 0}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1 {isAgentExist
          ? ''
          : '3xl:gap-4'}">
        <div
          class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
          <div
            class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
            style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
            <div class="w-full h-full bg-white/5"></div>
          </div>
          <div
            class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl py-1">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5 w-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/total.svg"
              alt="total" />
            <span class="text-base text-black dark:text-white">Total</span>
          </div>

          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#3b82f6] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{agentsStats?.total || 0}</span>
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
            class="flex items-center justify-center gap-2.5 bg-[#00bc7d]/10 w-full rounded-xl py-1 relative">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5 w-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/online.png"
              alt="tick" />
            <span class="text-base text-black dark:text-white">Online</span>
          </div>

          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#00bc7d] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{agentsStats?.status?.online || 0}</span>
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
            class="relative flex items-center justify-center bg-[#F87171]/10 w-full rounded-xl py-1">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5 size-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/offline.png"
              alt="offline" />
            <span class="text-base text-black dark:text-white">Offline</span>
          </div>
          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#F87171] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{agentsStats?.status?.offline || 0}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
            width="70"
            src="/icons/offline.png"
            alt="offline" />
        </div>
      </div>
    </div>
    <div
      class="px-6 sm:pb-6 pt-1 sm:pt-5 w-full flex flex-col gap-4 sm:dark:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 rounded-[14px] relative overflow-hidden h-full">
      <div class="flex justify-between items-start gap-3 w-full">
        <span class="text-lg sm:text-xl dark:text-white">Checkers</span>

        <div class="flex flex-col justify-center items-end gap-1">
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#F87171] pe-2">Disabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{checksStats?.disabled || 0}</span>
          </div>
          <div class="flex justify-center gap-1 items-center text-xs">
            <span class="text-[#00bc7d] pe-2">Enabled</span>
            <span class="bg-white/20 h-4 w-px"></span>
            <span class="text-black dark:text-white w-4.5 flex justify-end items-center"
              >{checksStats?.enabled || 0}</span>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-1 h-auto gap-3 w-full flex-1 {isAgentExist
          ? ''
          : '3xl:gap-4'}">
        <div
          class="border-[#2B7FFF]/20 flex flex-col justify-between items-center p-1 rounded-[14px] border w-full h-full relative overflow-hidden group">
          <div
            class="absolute -top-5 end-0 size-0 rounded-full group-hover:top-5 group-hover:end-5 transition-all duration-700"
            style="box-shadow: 0 0 100px 30px rgba(0,102,255,1);">
            <div class="w-full h-full bg-white/5"></div>
          </div>
          <div
            class="relative flex items-center justify-center gap-2.5 bg-[#2B7FFF]/10 w-full rounded-xl py-1">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5 w-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/total.svg"
              alt="total" />
            <span class="text-base text-black dark:text-white w-4.5">Total</span>
          </div>

          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#3b82f6] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{checksStats?.total || 0}</span>
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
            class="flex items-center justify-center gap-2.5 bg-[#00bc7d]/10 w-full rounded-xl py-1 relative">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1.5 w-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/tick.svg"
              alt="tick" />
            <span class="text-base text-black dark:text-white">Up</span>
          </div>

          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#00bc7d] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{checksStats?.status?.up || 0}</span>
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
            class="relative flex items-center justify-center bg-[#F87171]/10 w-full rounded-xl py-1">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1 w-4.5 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-5!'}"
              width="20"
              src="/icons/error.svg"
              alt="error" />
            <span class="text-base text-black dark:text-white">Down</span>
          </div>
          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#F87171] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}"
            >{(checksStats?.status?.down || 0) + (checksStats?.status?.error || 0) || 0}</span>
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
            class="relative flex items-center justify-center gap-2.5 bg-[#fdc700]/10 w-full rounded-xl py-1">
            <img
              class="absolute top-1/2 -translate-y-1/2 start-1 size-4 {isAgentExist
                ? ''
                : '3xl:start-2! 3xl:w-4.5!'}"
              width="20"
              src="/icons/warning.svg"
              alt="timeout" />
            <span class="text-base text-black dark:text-white">Timeout</span>
          </div>
          <span
            class="text-3xl xl:text-2xl 2xl:text-3xl p-4 xl:p-3 2xl:p-2.5 text-[#fdc700] my-auto {isAgentExist
              ? ''
              : '3xl:text-4xl'}">{checksStats?.status?.timeout || 0}</span>
          <img
            class="opacity-5 absolute bottom-0 end-0"
            width="70"
            src="/icons/warning.svg"
            alt="timeout" />
        </div>
      </div>
    </div>
  </div>
{/if}
