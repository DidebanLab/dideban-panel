<script>
  import { onMount } from 'svelte';
  import { opener } from '../../../../stores/modal.svelte.js';
  import { LIMITATIONS } from '../../../config.svelte.js';
  import AddAgent from './AddAgent.svelte';
  import { http } from '../../../../services/http.svelte.js';
  import { endpoints } from '../../../../endpoints.svelte.js';

  let isMobile = $state(innerWidth < 640);
  let agents = $state();
  let history = $state();
  let historyDetail = $state();

  onMount(() => {
    http.get(endpoints.agents).then(res => (agents = res.data.data));
  });
</script>

<div
  class="w-full relative rounded-[14px] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div
    class="px-6 sm:py-6 sm:border-b border-[#0D0D0D]/5 dark:border-[#222222] sm:bg-[#FFFFFF] sm:dark:bg-[#0D0D0D] w-full flex justify-between items-start">
    <div class="flex flex-col gap-1">
      <span class="text-lg sm:text-xl dark:text-white">Agents status</span>
      <span class="text-sm text-[#99a1af] capitalize">Infrastructure Nodes & Cluster Health</span>
    </div>
    <button
      type="button"
      onclick={() => {
        opener({
          id: 'create-agents',
          content: AddAgent,
        });
      }}
      class="w-10 sm:w-34.25 h-10 flex justify-center gap-2 px-4 items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
      <span class="text-nowrap text-sm hidden sm:flex justify-center items-center">Add Agent</span>
      +
    </button>
  </div>

  <div class="w-full grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-4 custom-scroll p-6">
    {#each agents as item (item.id)}
      {@const error = item.status === 'offline'}
      <div
        class="relative h-29 sm:h-32.75 border rounded-[14px] flex flex-col py-4 xl:py-6 gap-7 {error
          ? 'bg-[#EF4444]/5 border-[#EF4444]/15'
          : 'border-[#0D0D0D]/5 dark:border-[#00bc7d]/10 bg-[#F9FAFB] dark:bg-[#121212]'}">
        <div class="flex justify-start items-center px-4.25 gap-4">
          <div
            class="hidden sm:flex justify-center items-center size-12 rounded-2xl {error
              ? 'bg-[#EF4444]/10'
              : 'bg-[#00d492]/10'}">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 80 80">
              <path
                d="M0 0 C15.18 0 30.36 0 46 0 C46 20.46 46 40.92 46 62 C30.82 62 15.64 62 0 62 C0 41.54 0 21.08 0 0 Z M2 3 C1.90112208 4.74382535 1.87200968 6.49165543 1.87060547 8.23828125 C1.86745331 9.35614014 1.86430115 10.47399902 1.86105347 11.62573242 C1.8630777 12.84236572 1.86510193 14.05899902 1.8671875 15.3125 C1.86623077 16.55169189 1.86527405 17.79088379 1.86428833 19.06762695 C1.86360626 21.69388281 1.86496462 24.32004633 1.86962891 26.94628906 C1.87532619 30.31928714 1.87204698 33.69220565 1.86605644 37.06520081 C1.8615823 40.27263677 1.86471118 43.480063 1.8671875 46.6875 C1.86516327 47.9041333 1.86313904 49.1207666 1.86105347 50.37426758 C1.86420563 51.49212646 1.86735779 52.60998535 1.87060547 53.76171875 C1.87140106 54.75131592 1.87219666 55.74091309 1.87301636 56.76049805 C1.74899152 58.9709725 1.74899152 58.9709725 3 60 C5.9453557 60.10110353 8.8667756 60.13969279 11.8125 60.1328125 C12.69655518 60.13376923 13.58061035 60.13472595 14.49145508 60.13571167 C16.36442129 60.13639351 18.23738986 60.13453893 20.11035156 60.13037109 C22.98768388 60.12502289 25.86486008 60.13031593 28.7421875 60.13671875 C30.55729201 60.13605797 32.37239643 60.13477681 34.1875 60.1328125 C35.48747925 60.13584885 35.48747925 60.13584885 36.8137207 60.13894653 C40.72003219 60.51260414 40.72003219 60.51260414 44 59 C44.09887792 57.25617465 44.12799032 55.50834457 44.12939453 53.76171875 C44.13412277 52.08493042 44.13412277 52.08493042 44.13894653 50.37426758 C44.1369223 49.15763428 44.13489807 47.94100098 44.1328125 46.6875 C44.13376923 45.44830811 44.13472595 44.20911621 44.13571167 42.93237305 C44.13639374 40.30611719 44.13503538 37.67995367 44.13037109 35.05371094 C44.12467381 31.68071286 44.12795302 28.30779435 44.13394356 24.93479919 C44.1384177 21.72736323 44.13528882 18.519937 44.1328125 15.3125 C44.13483673 14.0958667 44.13686096 12.8792334 44.13894653 11.62573242 C44.13579437 10.50787354 44.13264221 9.39001465 44.12939453 8.23828125 C44.12859894 7.24868408 44.12780334 6.25908691 44.12698364 5.23950195 C44.25100848 3.0290275 44.25100848 3.0290275 43 2 C40.0546443 1.89889647 37.1332244 1.86030721 34.1875 1.8671875 C33.30344482 1.86623077 32.41938965 1.86527405 31.50854492 1.86428833 C29.63557871 1.86360649 27.76261014 1.86546107 25.88964844 1.86962891 C23.01231612 1.87497711 20.13513992 1.86968407 17.2578125 1.86328125 C15.44270799 1.86394203 13.62760357 1.86522319 11.8125 1.8671875 C10.51252075 1.86415115 10.51252075 1.86415115 9.1862793 1.86105347 C5.27996781 1.48739586 5.27996781 1.48739586 2 3 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(17,9)" />
              <path
                d="M0 0 C10.56 0 21.12 0 32 0 C32 8.58 32 17.16 32 26 C21.44 26 10.88 26 0 26 C0 17.42 0 8.84 0 0 Z M2 2 C2 3.98 2 5.96 2 8 C11.24 8 20.48 8 30 8 C30 6.02 30 4.04 30 2 C20.76 2 11.52 2 2 2 Z M2 10 C2 11.98 2 13.96 2 16 C11.24 16 20.48 16 30 16 C30 14.02 30 12.04 30 10 C20.76 10 11.52 10 2 10 Z M2 18 C2 19.98 2 21.96 2 24 C11.24 24 20.48 24 30 24 C30 22.02 30 20.04 30 18 C20.76 18 11.52 18 2 18 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,16)" />
              <path
                d="M0 0 C3 0.125 3 0.125 4 1.125 C4.125 4.125 4.125 4.125 4 7.125 C3 8.125 3 8.125 0 8.25 C-3 8.125 -3 8.125 -4 7.125 C-4.125 4.125 -4.125 4.125 -4 1.125 C-3 0.125 -3 0.125 0 0 Z M-1 3.125 C-1 3.785 -1 4.445 -1 5.125 C-0.34 5.125 0.32 5.125 1 5.125 C1 4.465 1 3.805 1 3.125 C0.34 3.125 -0.32 3.125 -1 3.125 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(40,51.875)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,63)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,59)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,55)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,51)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(24,47)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(49,36)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(49,28)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill={error ? '#ef4444' : '#00d492'}
                transform="translate(49,20)" />
            </svg>
          </div>

          <div class="flex flex-col justify-center items-start gap-1">
            <a href="/agents/{item.id}" class="text-sm sm:text-lg dark:text-white capitalize">{item.name}</a>
            <div class="text-xs flex justify-center items-center gap-1 text-[#707B76]/40 text-nowrap">
              <img width="17" height="17" src="/icons/clock.png" alt="clock" />
              {new Date(item.last_seen).toLocaleString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </div>
          </div>
          <div class="flex justify-center items-center gap-2 ms-auto mb-auto">
            {#if item.status === 'offline'}
              <span class="text-[#F87171] text-xs tracking-wider">Offline </span>
            {:else}
              <span class="text-xs tracking-wider text-green-700">Online </span>
            {/if}
            <div
              class="size-2.5 rounded-full"
              class:bg-[#ef4444]={error}
              class:bg-[#00d492]={!error}
              style="box-shadow: 0 0 10px 1px {error ? '#ef4444' : '#00d492'};">
            </div>
          </div>
        </div>
        <div
          class="absolute z-10 bottom-4 xl:bottom-6 w-full flex ltr:flex-row-reverse gap-0.5 justify-between items-end px-4.25">
          {#await http.get( endpoints.agentHistory(item.id), { params: { short: true, page_size: isMobile ? 31 : 50 } }, ) then res}
            {@const REQUIRED_COUNT = isMobile ? 31 : 50}
            {@const items = res.data.data}
            {@const missingCount = REQUIRED_COUNT - items.length}
            {#each items as detail (detail[0])}
              {@const status = detail[1]}
              {@const id = detail[0]}
              {@const error = status === 'offline'}
              {@const ok = status === 'online'}

              <button
                type="button"
                aria-label="detail of status"
                onmouseover={() => {
                  http
                    .get(endpoints.agentHistoryDetail(item.id, id))
                    .then(res => (historyDetail = res.data.data));
                }}
                onmouseleave={() => {
                  historyDetail = null;
                }}
                onfocus={() => {
                  http
                    .get(endpoints.agentHistoryDetail(item.id, id))
                    .then(res => (historyDetail = res.data.data));
                }}
                onblur={() => {
                  historyDetail = null;
                }}
                class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {error
                  ? 'bg-[#EF4444]'
                  : ok
                    ? 'bg-green-700'
                    : 'bg-[#FFFFFF]/5'}">
                {#if historyDetail}
                  <div
                    class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start {historyDetail.is_offline
                      ? 'gap-1.5'
                      : 'gap-2.5'}">
                    {#if historyDetail.collect_duration_ms}
                      <div
                        class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Latency :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap {historyDetail.collect_duration_ms >
                          LIMITATIONS.collect_duration_ms.error
                            ? 'text-[#F87171]'
                            : historyDetail.collect_duration_ms >
                                LIMITATIONS.collect_duration_ms.warn
                              ? 'text-[#F97316]'
                              : 'text-green-700'}">{historyDetail.collect_duration_ms} ms</span>
                      </div>
                    {/if}

                    {#if historyDetail.cpu_usage_percent}
                      <div class="flex flex-col items-center w-full gap-1">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #ad46ff;"
                            class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Cpu :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {historyDetail.cpu_usage_percent >
                              LIMITATIONS.cpu.error
                                ? 'text-[#F87171]'
                                : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{historyDetail.cpu_usage_percent}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {historyDetail.cpu_usage_percent >
                            LIMITATIONS.cpu.error
                              ? 'bg-[#F87171]'
                              : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              historyDetail.cpu_usage_percent,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {historyDetail.cpu_usage_percent >
                            LIMITATIONS.cpu.error
                              ? '#F87171'
                              : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}

                    {#if historyDetail.memory_usage_percent}
                      <div class="flex flex-col items-center w-full gap-1">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #2b7fff;"
                            class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Memory :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {historyDetail.memory_usage_percent >
                              LIMITATIONS.memory.error
                                ? 'text-[#F87171]'
                                : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{historyDetail.memory_usage_percent}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {historyDetail.memory_usage_percent >
                            LIMITATIONS.memory.error
                              ? 'bg-[#F87171]'
                              : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              historyDetail.memory_usage_percent,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {historyDetail.memory_usage_percent >
                            LIMITATIONS.memory.error
                              ? '#F87171'
                              : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}

                    {#if historyDetail.disk_usage_percent}
                      <div class="flex flex-col items-center w-full gap-1">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #22c55e;"
                            class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Disk :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {historyDetail.disk_usage_percent >
                              LIMITATIONS.disk.error
                                ? 'text-[#F87171]'
                                : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{historyDetail.disk_usage_percent}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {historyDetail.disk_usage_percent >
                            LIMITATIONS.disk.error
                              ? 'bg-[#F87171]'
                              : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              historyDetail.disk_usage_percent,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {historyDetail.disk_usage_percent >
                            LIMITATIONS.disk.error
                              ? '#F87171'
                              : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}
                    {#if historyDetail.is_offline}
                      <div class="w-full flex justify-between items-center gap-2.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Status :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap capitalize text-[#F87171]"
                          >Offline</span>
                      </div>
                    {/if}

                    <div
                      class="w-full flex justify-start items-center text-sm text-nowrap text-[#6a7282] text-center border-t-black/10 dark:border-t-white/15 border-t pt-1.5">
                      {new Date(historyDetail.collected_at).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </div>
                  </div>{/if}
              </button>
            {/each}
            {#each Array(missingCount) as _, i}
              <div
                aria-hidden="true"
                class="w-4 h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
              </div>
            {/each}
          {/await}
        </div>
      </div>
    {/each}
  </div>
</div>
