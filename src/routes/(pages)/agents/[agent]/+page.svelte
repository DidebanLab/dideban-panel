<script>
  import { endpoints } from './../../../../endpoints.svelte.js';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import { onMount, untrack } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor.js';
  import { alertStore } from '../../../../stores/alert.svelte.js';
  import { goto } from '$app/navigation';
  import { LIMITATIONS } from '../../../../components/config.svelte.js';
  import Chart from '../../../../components/pages/agent/Chart.svelte';
  import ConfirmEditAgent from '../../../../components/pages/agent/ConfirmEditAgent.svelte';
  import DeleteAgent from '../../../../components/pages/agent/DeleteAgent.svelte';
  import EditAgent from '../../../../components/pages/agent/EditAgent.svelte';
  import getDate from '../../../../utils/getDate.js';
  import getMonthName from '../../../../utils/getMonth.js';
  import nextDate from '../../../../utils/nextDate.js';
  import preDate from '../../../../utils/preDate.js';
  import DateChanger from '../../../../components/common/DateChanger.svelte';
  import TimeRangeSelector from '../../../../components/common/TimeRangeSelector.svelte';
  import SummaryCalender from '../../../../components/common/SummaryCalender.svelte';
  import Uptime from '../../../../components/pages/agent/Uptime.svelte';

  const id = $page.params.agent;
  let hours = $state(24);
  let date = $state();
  let data = $state();
  let chart = $state();
  let pointIndexHoverd = $state();
  let metricPointDetail = $state();
  let isMouseInside = $state(false);
  let enabled = $state();
  let history = $state();
  let collectDuration = $state();
  let summary = $state();
  let toDay = $state();
  let summaryWithDate = $state();

  onMount(() => {
    http.get(endpoints.singleAgent(id)).then(res => {
      data = res.data?.data;
      enabled = res.data?.data.enabled;
    });
  });

  $effect(() => {
    http.get(endpoints.agentSummaryYearly(id)).then(res => {
      const current = res.data.data.find(i => Object.values(i.history).includes(-1));
      const day = Object.keys(current.history).find(key => current.history[key] === -1);
      toDay = `${current.year}-${current.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      if (getDate($page.url.searchParams.get('date')).string === toDay) {
        goto(`/agents/${id}`);
      }

      summary = res.data?.data;
    });

    if ($page.url.searchParams.get('date')) {
      date = getDate($page.url.searchParams.get('date')).string;

      http.get(endpoints.agentSummaryDate(id, date)).then(res => {
        summaryWithDate = {
          ...res.data.data,
          uptime_series: res.data?.data?.uptime_series?.reverse(),
        };
      });
    } else {
      date = null;

      if (pointIndexHoverd && id) {
        http
          .get(
            endpoints.agentHistoryDetail(
              id,
              [...chart?.points?.map(item => item?.[0]).reverse()][pointIndexHoverd],
            ),
          )
          .then(res => (metricPointDetail = res.data?.data));
      }
      http
        .get(endpoints.agentCollectDuration(id), { params: { hours } })
        .then(res => (collectDuration = res.data?.data));

      http
        .get(endpoints.agentChart(id), {
          params: {
            hours,
            max_points: 60,
          },
        })
        .then(res => (chart = res.data?.data));
    }
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start relative">
        <div class="flex flex-col justify-center items-start">
          {#if data?.name}
            <span class="text-black dark:text-white text-xl capitalize">{data?.name}</span
            >{:else}<div class="flex justify-center items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.0003 18.3332C14.6027 18.3332 18.3337 14.6022 18.3337 9.99984C18.3337 5.39746 14.6027 1.6665 10.0003 1.6665C5.39795 1.6665 1.66699 5.39746 1.66699 9.99984C1.66699 14.6022 5.39795 18.3332 10.0003 18.3332Z"
                  stroke="#B4242B"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M10 6.6665V9.99984"
                  stroke="#B4242B"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
                <path
                  d="M10 13.3335H10.0083"
                  stroke="#B4242B"
                  stroke-width="1.66667"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <span class="text-xl text-red-500/70 mt-0.5">Agent with Id {id} Not Found</span>
            </div>{/if}

          <span
            class="flex justify-center items-center text-nowrap tracking-wider text-sm {data?.status ===
            'online'
              ? 'text-green-700'
              : 'text-[#F87171]'}">{data?.status}</span>
        </div>

        {#if date ? date : toDay}
          <DateChanger type="agent" bind:value={summaryWithDate} {summary} {id} {toDay} {date} />
        {/if}

        {#if date}
          <button
            onclick={() => {
              goto(`/agents/${id}`);
            }}
            class="flex items-center gap-2 ps-4 bg-emerald-500/10 animate-pulse hover:animate-none pe-2.5 h-8 text-xs rounded-full outline outline-offset-1 outline-emerald-500/60 text-emerald-400 cursor-pointer">
            Back to Today
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.25 h-3.25 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        {:else if data}
          <div class="flex justify-center items-center gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <button
                class="cursor-pointer"
                aria-label="delete agent"
                type="button"
                onclick={() => {
                  opener({
                    id: 'delete-agent',
                    content: DeleteAgent,
                    props: { name: data?.name, id: data?.id },
                  });
                }}>
                <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
              <button
                class="cursor-pointer"
                aria-label="edit config"
                type="button"
                onclick={() => {
                  opener({
                    id: 'edit-agent',
                    content: EditAgent,
                    props: {
                      name: data?.name,
                      interval_seconds: data?.interval_seconds,
                      enabled: data?.enabled,
                      id: data?.id,
                    },
                  });
                }}>
                <img src="/icons/edit.png" alt="edit" width="24" height="24" />
              </button>
            </div>

            <div class="h-9 w-px bg-white/20"></div>
            {#key enabled}
              <div
                class="py-2 w-30 flex justify-center items-center gap-2 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#e5e7eb] dark:border-white/5 rounded-[14px]">
                <span class="text-xs text-[#99a1af]">
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>

                <button
                  onclick={() => {
                    if (enabled) {
                      opener({
                        id: 'confirm-edit',
                        content: ConfirmEditAgent,
                        props: {
                          name: data?.name,
                        },
                      });
                    } else {
                      http
                        .patch(endpoints.singleAgent(data?.id), {
                          enabled: true,
                        })
                        .then(res => {
                          alertStore.addAlert({
                            message: `Agent ${data?.name} activation updated successfully.`,
                            type: 'successful',
                          });
                          location.href = `/agents/${data?.id}`;
                        });
                    }
                  }}
                  aria-label="activation toggle"
                  class="w-11 h-6 rounded-full relative cursor-pointer {enabled
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={enabled ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {enabled
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
            {/key}
          </div>
        {/if}
      </div>

      <Uptime {id} {date} {summaryWithDate} />

      {#if !date}
        <TimeRangeSelector bind:value={hours} interval={data?.interval_seconds} />
      {/if}

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-10 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between items-start">
          <div class="flex flex-col justify-start items-start w-full">
            <span class="text-lg text-black dark:text-white"> Collect Duration</span>
            <div class="text-xs text-white/70 flex gap-1.5">
              <span class="text-white/40">Total collects :</span>
              {(date ? summaryWithDate?.overall?.total_collects : collectDuration?.total_collect) ||
                '-'}
            </div>
          </div>

          {#if date}
            {#if summaryWithDate?.overall?.avg_collect_duration_ms}
              <div class="flex text-2xl justify-end gap-2 items-center">
                <span
                  class={summaryWithDate?.overall?.rate?.toLowerCase() === 'excellent'
                    ? 'text-green-500'
                    : summaryWithDate?.overall?.rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}>
                  {summaryWithDate?.overall?.rate}
                </span>

                <span class="h-7 w-px bg-white/15"></span>

                <span
                  class={summaryWithDate?.overall?.avg_collect_duration_ms >= 90
                    ? 'text-[#008236]'
                    : summaryWithDate?.overall?.avg_collect_duration_ms >= 80
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.avg_collect_duration_ms >= 70
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.avg_collect_duration_ms >= 50
                          ? 'text-[#F97316]'
                          : 'text-[#EF4444]'}>
                  {summaryWithDate?.overall?.avg_collect_duration_ms}ms</span>
              </div>
            {:else}
              <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
            {/if}
          {:else if collectDuration?.avg_ms}
            <div class="flex text-2xl justify-end gap-2 items-center">
              <span
                class={collectDuration?.rate?.toLowerCase() === 'excellent'
                  ? 'text-green-500'
                  : collectDuration?.rate?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : collectDuration?.rate?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : collectDuration?.rate?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}>
                {collectDuration?.rate}
              </span>

              <span class="h-7 w-px bg-white/15"></span>

              <span
                class={collectDuration?.avg_ms >= 90
                  ? 'text-[#008236]'
                  : collectDuration?.avg_ms >= 80
                    ? 'text-[#00D492]'
                    : collectDuration?.avg_ms >= 70
                      ? 'text-[#FDC700]'
                      : collectDuration?.avg_ms >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}>
                {collectDuration?.avg_ms}ms</span>
            </div>
          {:else}
            <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
          {/if}
        </div>

        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end">
          <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>
          {#if date}
            {#each summaryWithDate?.collect_duration_series as detail, i}
              <div
                style="height: {(detail?.avg_collect_duration_ms * 100) /
                  summaryWithDate?.overall?.max_collect_duration_ms /
                  1.5}px;"
                class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.avg_collect_duration_ms >=
                90
                  ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                  : detail?.avg_collect_duration_ms >= 80
                    ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.avg_collect_duration_ms >= 70
                      ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.avg_collect_duration_ms >= 50
                        ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
                {#if detail?.avg_collect_duration_ms}
                  <div class="text-white absolute start-1/2 -translate-1/2 -top-5 text-xs">
                    {detail?.avg_collect_duration_ms}<sub>ms</sub>
                  </div>
                {/if}
                {#if i !== 0 && i % 1 === 0}
                  <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {detail?.start_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                {/if}

                {#if summaryWithDate?.collect_duration_series?.length - 1 === i}
                  <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        24:00
                      </div>
                    </div>
                  </div>
                {/if}

                {#if detail?.avg_collect_duration_ms}
                  <div
                    class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                    <div class="w-full flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Collect Rating :</span>
                      <span
                        class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                        'excellent'
                          ? 'text-green-500'
                          : detail?.rate?.toLowerCase() === 'good'
                            ? 'text-[#00D492]'
                            : detail?.rate?.toLowerCase() === 'fair'
                              ? 'text-[#FDC700]'
                              : detail?.rate?.toLowerCase() === 'poor'
                                ? 'text-[#F97316]'
                                : 'text-[#F87171]'}">{detail?.rate}</span>
                    </div>
                    <div class="w-full flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Collect AV (ms) :</span>
                      <span
                        class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                        'excellent'
                          ? 'text-green-500'
                          : detail?.rate?.toLowerCase() === 'good'
                            ? 'text-[#00D492]'
                            : detail?.rate?.toLowerCase() === 'fair'
                              ? 'text-[#FDC700]'
                              : detail?.rate?.toLowerCase() === 'poor'
                                ? 'text-[#F97316]'
                                : 'text-[#F87171]'}"
                        >{detail?.avg_collect_duration_ms}<sub>ms</sub></span>
                    </div>

                    <div class="w-full flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Lowest Duration :</span>
                      <span class="flex justify-center items-center text-sm text-nowrap text-white"
                        >{detail?.min_collect_duration_ms}<sub>ms</sub></span>
                    </div>

                    <div class="w-full flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Mostest Duration :</span>
                      <span class="flex justify-center items-center text-sm text-nowrap text-white"
                        >{detail?.max_collect_duration_ms}<sub>ms</sub></span>
                    </div>

                    <div class="w-full flex justify-between items-center gap-2.5">
                      <span
                        class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                        >Collects :</span>
                      <span class="flex justify-center items-center text-sm text-nowrap text-white"
                        >{detail?.collects}</span>
                    </div>

                    <div
                      class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>From</span>
                        <span class="text-white/30">{detail?.start_time.slice(0, 5)} </span>
                      </div>

                      <div class="flex justify-between items-center gap-1 w-full">
                        <span>Until</span>
                        <span class="text-white/30"> {detail?.end_time.slice(0, 5)}</span>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          {:else}
            {#each collectDuration?.series as detail, i}
              <div
                style="height: {(detail?.avg_ms * 100) / collectDuration.max_ms / 1.5}px;"
                class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.rate?.toLowerCase() ===
                'excellent'
                  ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                  : detail?.rate?.toLowerCase() === 'good'
                    ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.rate?.toLowerCase() === 'fair'
                      ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.rate?.toLowerCase() === 'poor'
                        ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
                {#if i !== 0 && i % 4 === 0}
                  <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {new Date(detail?.from).toLocaleString('en-CA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    </div>
                  </div>
                {/if}

                <div
                  class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect Rating :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}">{detail?.rate}</span>
                  </div>
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect AV (ms) :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}">{detail?.avg_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Lowest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.min_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Mostest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.max_ms}<sub>ms</sub></span>
                  </div>

                  <div
                    class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>From</span>
                      <span class="text-white/30">
                        {new Date(detail?.from).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>

                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>Until</span>
                      <span class="text-white/30">
                        {new Date(detail?.to).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}

          {#each Array(Math.max(0, 24 - ((date ? summaryWithDate?.collect_duration_series?.length : collectDuration?.series?.length) ?? 0))) as _, i}
            <div
              class="h-1 w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]">
              <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
              <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                {String(i + 1)
                  .toString()
                  .padStart(2, '0')}:00
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6 w-full">
        <div
          class="w-full col-span-9 border flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
          <div class="w-full flex justify-between items-start">
            <div class="w-full flex gap-1 flex-col justify-start items-start">
              <span class="text-lg md:text-xl text-black dark:text-white">Metrics</span>

              <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                {#if date}
                  {#if isMouseInside && summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at}
                    <span class="flex justify-center items-center text-nowrap">Collect at :</span>

                    <span class="flex justify-center items-center text-nowrap tracking-wider">
                      {new Date(
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at,
                      ).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  {/if}
                {:else if isMouseInside ? metricPointDetail?.collected_at : chart?.last_history?.collected_at}
                  <span class="flex justify-center items-center text-nowrap">Collect at :</span>

                  <span class="flex justify-center items-center text-nowrap tracking-wider">
                    {#if isMouseInside}
                      {new Date(metricPointDetail?.collected_at).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    {:else}
                      {new Date(chart?.last_history?.collected_at).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    {/if}
                  </span>{/if}
              </div>
            </div>

            <div
              class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
              <span class="text-white/40 me-1">Collect Duration : </span>

              {#if date}
                {#if isMouseInside}
                  <span
                    class={responseTimeColor(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms,
                    )}
                    >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms +
                        ' ms'
                      : '-'}</span>
                {:else}
                  <span class={responseTimeColor(summaryWithDate?.overall?.avg_collect_duration_ms)}
                    >{summaryWithDate?.overall?.avg_collect_duration_ms
                      ? summaryWithDate?.overall?.avg_collect_duration_ms + ' ms'
                      : '-'}
                  </span>
                {/if}
              {:else if isMouseInside}
                <span class={responseTimeColor(metricPointDetail?.collect_duration_ms)}
                  >{metricPointDetail?.collect_duration_ms
                    ? metricPointDetail?.collect_duration_ms + ' ms'
                    : '-'}</span>
              {:else}
                <span class={responseTimeColor(chart?.last_history?.collect_duration_ms)}
                  >{chart?.last_history?.collect_duration_ms
                    ? chart?.last_history?.collect_duration_ms + ' ms'
                    : '-'}</span>
              {/if}
            </div>
          </div>
          {#if Boolean(date ? summaryWithDate?.chart_series?.length > 0 : chart?.points?.length > 0)}
            {@const memoryData = date
              ? [...summaryWithDate?.chart_series.map(item => item?.memory_usage_percent)]
              : [...chart?.points?.map(item => item?.[2]).reverse()]}

            {@const cpuData = date
              ? [...summaryWithDate?.chart_series.map(item => item?.cpu_usage_percent)]
              : [...chart?.points?.map(item => item?.[1]).reverse()]}
            <Chart
              bind:isMouseInside
              bind:pointIndexHoverd
              data={[
                {
                  name: 'CPU',
                  data: cpuData,
                },
                {
                  name: 'Memory',
                  data: memoryData,
                },
              ]} />
          {:else}
            <div class="w-full bg-blue-500/50 h-px mt-auto mb-6"></div>
          {/if}
        </div>
        <div
          class="col-span-3 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl grid grid-cols-1 gap-4 dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">CPU</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>
                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.cpu_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series[
                        summaryWithDate.chart_series.length - 1
                      ]?.cpu_usage_percent
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_usage_percent > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                                ?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_usage_percent
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (1m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series[
                        summaryWithDate.chart_series.length - 1
                      ]?.cpu_load_1
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_1 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                                ?.cpu_load_1 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_load_1
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (5m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series[
                        summaryWithDate.chart_series.length - 1
                      ]?.cpu_load_5
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_5 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                                ?.cpu_load_5 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_load_5
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (15m) : </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series[
                        summaryWithDate?.chart_series?.length - 1
                      ]?.cpu_load_15
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            .cpu_load_15 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                                .cpu_load_15 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                        ?.cpu_load_15
                        ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ]?.cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                    LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                          LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{summaryWithDate?.chart_series[
                      summaryWithDate.chart_series.length - 1
                    ]?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                      summaryWithDate.chart_series.length - 1
                    ]?.cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                            ?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series[summaryWithDate.chart_series.length - 1]?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                      ?.cpu_usage_percent
                      ? summaryWithDate?.chart_series[summaryWithDate.chart_series.length - 1]
                          ?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">CPU</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>
                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_usage_percent
                        ? metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}">
                      {metricPointDetail?.cpu_usage_percent
                        ? metricPointDetail?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_usage_percent
                        ? chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_usage_percent
                        ? chart?.last_history?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (1m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_1
                        ? metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_1
                        ? metricPointDetail?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_1
                        ? chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_1
                        ? chart?.last_history?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (5m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_5
                        ? metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_5
                        ? metricPointDetail?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_5
                        ? chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_5
                        ? chart?.last_history?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (15m) : </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_15
                        ? metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_15
                        ? metricPointDetail?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_15
                        ? chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_15
                        ? chart?.last_history?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{metricPointDetail?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.cpu_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.cpu_usage_percent
                      ? metricPointDetail?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{chart?.last_history?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_history
                      ?.cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.cpu_usage_percent
                      ? chart?.last_history?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <div class="w-full h-0.5 bg-[#0D0D0D]/5 dark:bg-white/5 rounded-full"></div>

          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Memory</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                          LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]
                                ?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}">
                      {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent +
                          '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[
                        summaryWithDate?.chart_series.length - 1
                      ]?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                            ?.memory_usage_percent > LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[
                                summaryWithDate?.chart_series.length - 1
                              ]?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                        ?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                            ?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}

                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_total_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                        ?.memory_total_mb}

                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}
                    <span class="text-xs text-[#F87171]">Unknown</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_used_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                        ?.memory_used_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]?.memory_available_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                        ?.memory_available_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ]?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                          LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent +
                        '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{summaryWithDate?.chart_series?.[
                      summaryWithDate?.chart_series.length - 1
                    ]?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                      summaryWithDate?.chart_series.length - 1
                    ]?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[
                      summaryWithDate?.chart_series.length - 1
                    ]?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                            ?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                      ?.memory_usage_percent
                      ? summaryWithDate?.chart_series?.[summaryWithDate?.chart_series.length - 1]
                          ?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Memory</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.memory_usage_percent
                        ? metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.memory_usage_percent
                        ? metricPointDetail?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.memory_usage_percent
                        ? chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.memory_usage_percent
                        ? chart?.last_history?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_total_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_total_mb}

                        <sub class="text-white/40">Mb</sub>
                      </span>
                    {:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if chart?.last_history?.memory_total_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_total_mb}

                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}
                    <span class="text-xs text-[#F87171]">Unknown</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_used_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_used_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.memory_used_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_used_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_available_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_available_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.memory_available_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_available_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{metricPointDetail?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.memory_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.memory_usage_percent
                      ? metricPointDetail?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{chart?.last_history?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_history
                      ?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.memory_usage_percent
                      ? chart?.last_history?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>{/if}

          <div class="h-px w-full bg-white/10"></div>

          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Disk</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                          LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                              LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent +
                          '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[
                        summaryWithDate.chart_series.length - 1
                      ]?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                            ?.disk_usage_percent > LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                                ?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                            ?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                        <sub class="text-white/40">Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_total_gb}
                      <sub class="text-white/40">Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>
                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb && summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb -
                          summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_total_gb && summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                        ?.disk_total_gb -
                        summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                          ?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>
              {#if isMouseInside}
                <div
                  class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ]?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                    LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                          LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>
              {:else}
                <div
                  class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{summaryWithDate?.chart_series?.[
                      summaryWithDate.chart_series.length - 1
                    ]?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series?.[
                      summaryWithDate.chart_series.length - 1
                    ]?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[
                      summaryWithDate.chart_series.length - 1
                    ]?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                            ?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[summaryWithDate.chart_series.length - 1]?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                      ?.disk_usage_percent
                      ? summaryWithDate?.chart_series?.[summaryWithDate.chart_series.length - 1]
                          ?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>{/if}
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Disk</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.disk_usage_percent
                        ? metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.disk_usage_percent
                        ? metricPointDetail?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.disk_usage_percent
                        ? chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.disk_usage_percent
                        ? chart?.last_history?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_total_gb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.disk_total_gb}
                        <sub class="text-white/40">Gb</sub></span>
                    {:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if chart?.last_history?.disk_total_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_total_gb}
                      <sub class="text-white/40">Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_used_gb}<span class="text-xs text-white"
                        >{metricPointDetail?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>
                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_total_gb && metricPointDetail?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.disk_total_gb - metricPointDetail?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.disk_total_gb && chart?.last_history?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_total_gb - chart?.last_history?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>
              {#if isMouseInside}
                <div
                  class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{metricPointDetail?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.disk_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.disk_usage_percent
                      ? metricPointDetail?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>
              {:else}
                <div
                  class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{chart?.last_history?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_history
                      ?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.disk_usage_percent
                      ? chart?.last_history?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>{/if}
            </div>{/if}
        </div>
      </div>

      {#if summary}
        <SummaryCalender bind:value={toDay} type="agent" {summary} {id} {date} />
      {/if}
    </div>
  </div>
</section>
