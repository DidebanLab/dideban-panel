<script>
  import { endpoints } from './../../../../endpoints.svelte.js';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';
  import { onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import DeleteChecker from '../../../../components/pages/checker/DeleteChecker.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor.js';
  import ConfirmEditConfig from '../../../../components/pages/checker/ConfirmEditConfig.svelte';
  import { alertStore } from '../../../../stores/alert.svelte.js';
  import { goto } from '$app/navigation';
  import { LIMITATIONS } from '../../../../components/config.svelte.js';

  const REQUIRED_COUNT = $state(innerWidth < 640 ? 31 : 96);
  const id = $page.params.agent;
  let data = $state();
  let metrics = $state({
    avg_cpu_usage: 34,
    avg_memory_usage: 49,
    cpu: [
      13, 18, 52, 19, 21, 47, 58, 44, 16, 17, 59, 28, 11, 20, 26, 43, 20, 32, 26, 50, 51, 50, 15,
      36, 47, 23, 17, 53, 15, 13, 25, 55, 52, 25, 22, 15, 60, 25, 50, 15, 28, 38, 59, 21, 28, 22,
      53, 15, 62, 20, 84, 68, 12, 15, 91, 29, 44, 49, 18, 26, 12, 31, 22, 11, 30, 48, 95, 43, 49,
      31, 19, 36, 45, 44, 38, 12, 18, 13, 15, 10, 12, 12, 44, 54, 11, 13, 11, 34, 22, 40, 12, 35,
      15, 35, 18, 37, 20, 26, 21, 21, 20, 16, 53, 12, 59, 20, 41, 35, 58, 27, 29, 41, 57, 32, 13,
      57, 10, 13, 15, 20, 49, 13, 16, 27, 36, 30, 10, 18, 92, 48, 19, 34, 15, 46, 34, 21, 23, 10,
      59, 52, 46, 53, 27, 42, 23, 49, 94, 13, 52, 31, 64, 18, 12, 15, 13, 19, 56, 20, 20, 23, 14,
      11, 79, 17, 56, 52, 44, 11, 10, 40, 18, 29, 47, 11, 37, 60, 19, 72, 37, 17, 18, 12, 14, 60,
      34, 12, 23, 45, 21, 87, 59, 52, 56, 92, 11, 18, 22, 81, 48, 58, 33, 25, 38, 27, 12, 23, 12,
      15, 55, 45, 42, 19, 32, 56, 52, 49, 54, 13, 15, 50, 14, 46, 16, 34, 54, 56, 14, 20, 41, 46,
      50, 38, 37, 47, 59, 20, 47, 80, 49, 28, 32, 58, 49, 14, 41, 48, 44, 18, 56, 45, 17, 26, 56,
      16, 49, 36, 17, 58, 15, 20, 44, 13, 55, 13, 62, 12, 23, 34, 47, 27, 42, 51, 36, 28, 21, 20,
      33, 45, 32, 50, 20, 43, 44, 19, 24, 28, 42, 43, 39, 14, 41, 11, 16, 35, 47, 35, 28, 84, 39,
      48, 31, 20, 17, 15, 38, 46, 24, 19, 13, 35, 28, 35, 41, 37, 59, 58, 17, 38, 23, 19, 46, 17,
      13, 32, 14, 58, 12, 15, 12, 53, 19, 25, 39, 13, 34, 59, 33, 58, 31, 56, 18, 91, 19, 56, 58,
      55, 11, 31, 47, 17, 21, 21, 45, 20, 12, 28, 45, 51, 58, 20,
    ],
    latest_disk_usage: 31,
    memory: [
      59, 67, 58, 39, 39, 62, 58, 20, 46, 33, 36, 53, 46, 59, 69, 56, 37, 36, 45, 52, 57, 66, 65,
      15, 35, 65, 17, 63, 51, 48, 69, 63, 25, 65, 39, 64, 66, 61, 60, 67, 37, 16, 50, 60, 26, 51,
      25, 52, 36, 69, 27, 53, 32, 18, 23, 35, 56, 34, 58, 51, 13, 23, 33, 73, 57, 45, 66, 50, 35,
      60, 32, 38, 38, 51, 37, 45, 80, 63, 42, 45, 35, 48, 90, 40, 56, 44, 64, 39, 20, 64, 57, 43,
      48, 61, 25, 70, 54, 33, 59, 33, 60, 47, 61, 49, 66, 63, 48, 61, 76, 37, 32, 51, 54, 66, 52,
      48, 79, 40, 24, 67, 41, 69, 32, 67, 18, 35, 49, 37, 44, 50, 30, 68, 64, 32, 19, 57, 60, 26,
      24, 60, 30, 73, 44, 54, 45, 53, 41, 45, 37, 24, 37, 46, 55, 53, 20, 36, 55, 34, 53, 48, 69,
      61, 46, 40, 68, 77, 49, 67, 64, 49, 55, 64, 59, 68, 44, 65, 55, 54, 51, 56, 12, 31, 63, 35,
      66, 67, 51, 82, 60, 58, 52, 68, 50, 30, 33, 39, 60, 69, 24, 18, 61, 54, 86, 53, 34, 52, 60,
      51, 41, 64, 64, 33, 68, 31, 15, 53, 37, 28, 36, 37, 41, 56, 60, 56, 54, 40, 52, 64, 65, 29,
      14, 17, 68, 48, 31, 28, 67, 31, 70, 48, 70, 32, 54, 42, 49, 12, 30, 31, 46, 60, 58, 61, 61,
      24, 50, 37, 45, 87, 31, 66, 54, 42, 61, 84, 34, 30, 56, 33, 83, 91, 61, 31, 55, 14, 66, 29,
      54, 58, 24, 56, 54, 48, 38, 36, 33, 65, 40, 65, 56, 38, 33, 31, 59, 24, 55, 64, 67, 47, 52,
      53, 60, 43, 19, 68, 31, 37, 15, 86, 62, 68, 50, 57, 25, 34, 92, 41, 73, 68, 27, 56, 49, 56,
      51, 54, 25, 11, 22, 56, 85, 24, 35, 38, 57, 46, 44, 31, 36, 16, 62, 43, 31, 39, 48, 64, 35,
      37, 67, 62, 51, 70, 43, 53, 47, 49, 64, 49, 79, 28, 33, 36,
    ],
    record_count: 1999,
    time_range: {
      from: '2026-01-30T18:09:23+03:30',
      hours: 24,
      max_points: 360,
      to: '2026-01-31T18:09:23+03:30',
    },
  });

  let enabled = $state();
  let date = $state(null);
  let history = $state();
  let missingCount = $derived(Math.max(0, REQUIRED_COUNT - (history?.data?.length ?? 0)));
  let historyDetail = $state();
  let collectDuration = $state();
  let summary = $state();
  let summaryWithDate = $state();

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  function getMonthName(month) {
    return MONTHS[month - 1];
  }

  onMount(() => {
    if (!date) {
      http
        .get(endpoints.agentHistory(id), {
          params: { short: true, detail: true, page_size: REQUIRED_COUNT },
        })
        .then(res => {
          history = { ...res.data, data: res.data?.data.slice(-REQUIRED_COUNT) };

          console.log(history);
        });

      http.get(endpoints.agentCollectDuration(id)).then(res => (collectDuration = res.data?.data));

      http.get(endpoints.agents + `/${id}`).then(res => {
        data = res.data?.data;
        enabled = res.data?.data.enabled;
      });
    }

    http.get(endpoints.checks + `/${id}/summary/yearly`).then(res => (summary = res.data?.data));
  });

  function nextDate(data, year, month, day) {
    const maxDay = Object.keys(
      data.filter(item => Number(item.month) === Number(month))[0].history,
    ).length;
    let nextDay = Number(day);
    let nextMonth = Number(month);
    let nextYear = Number(year);
    if (Number(day) === maxDay) {
      nextDay = 1;
      if (nextMonth === 12) {
        nextMonth = 1;
        nextYear = nextYear + 1;
      } else {
        nextMonth = nextMonth + 1;
      }
    } else {
      nextDay = nextDay + 1;
    }

    goto(`/checkers/${id}?year=${nextYear}&month=${nextMonth}&day=${nextDay}`);
  }

  function preDate(data, year, month, day) {
    let perDay = Number(day);
    let perMonth = Number(month);
    let perYear = Number(year);

    if (perDay === 1) {
      if (perMonth === 1) {
        perMonth = 12;
        perYear = perYear - 1;
      } else {
        perMonth = perMonth - 1;
      }
      const prevMonthData = data.find(
        item => Number(item.year) === perYear && Number(item.month) === perMonth,
      );

      if (prevMonthData && prevMonthData.history) {
        const daysInMonth = Math.max(...Object.keys(prevMonthData.history).map(Number));
        perDay = daysInMonth;
      } else {
        return;
      }
    } else {
      perDay = perDay - 1;
    }

    goto(`/checkers/${id}?year=${perYear}&month=${perMonth}&day=${perDay}`);
  }
  $effect(() => {
    const year = $page.url.searchParams.get('year');
    let month = $page.url.searchParams.get('month');
    let day = $page.url.searchParams.get('day');

    if (month?.length < 2) month = `0${month}`;
    if (day?.length < 2) day = `0${day}`;

    if (year && month && day) {
      historyDetail = null;
      date = { year, month, day };
      http.get(endpoints.checksSummaryDate(id, `${year}-${month}-${day}`)).then(res => {
        summaryWithDate = {
          ...res.data?.data,
        };
      });
    } else {
      date = null;
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
          <span class="text-black dark:text-white text-xl capitalize">{data?.name}</span>

          <span
            class="flex justify-center items-center text-nowrap tracking-wider text-sm {data?.status ===
            'online'
              ? 'text-green-700'
              : 'text-[#F87171]'}">{data?.status}</span>
        </div>
        {#if date}
          <div
            class="flex items-center justify-between px-3 gap-4 bg-white/5 text-sm absolute top-0 rounded-md start-1/2 -translate-x-1/2 min-w-40 h-9.5 shadow-sm shadow-[#3b82f6]/50">
            <!-- Prev -->

            <button
              aria-label="prev date"
              onclick={() => {
                preDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7" />
              </svg></button>

            <!-- Date -->
            <div class="px-4 py-1.5 rounded-lg tracking-wide text-nowrap text-[#3b82f6]">
              {getMonthName($page.url.searchParams.get('month'))}
              {$page.url.searchParams.get('day')} , {$page.url.searchParams.get('year')}
            </div>

            <!-- Next -->
            <button
              aria-label="next date"
              onclick={() => {
                nextDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg></button>
          </div>
        {/if}

        {#if date}
          <button
            onclick={() => {
              goto(`/checkers/${id}`);
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
        {:else}
          <div class="flex justify-center items-center gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <button
                class="cursor-pointer"
                aria-label="delete checker"
                type="button"
                onclick={() => {
                  opener({
                    id: 'delete-checker',
                    content: DeleteChecker,
                    props: { data },
                  });
                }}>
                <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
              <button
                class="cursor-pointer"
                aria-label="edit config"
                type="button"
                onclick={() => {
                  opener({
                    id: 'edit-checker',
                    content: EditChecker,
                    props: { data },
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
                        content: ConfirmEditConfig,
                        props: {
                          checkerId: data?.id,
                          name: data?.name,
                        },
                      });
                    } else {
                      http
                        .patch(`${endpoints.agents}/${data?.id}`, {
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
                  class="w-11 h-6 bg-[#00bc7d]/20 border border-[#00bc7d]/30 rounded-full relative cursor-pointer">
                  <div
                    style="box-shadow: 0 5px 30px #00bc7d;"
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full bg-[#00bc7d] transition-transform duration-300 ease-in-out {enabled
                      ? 'translate-x-5'
                      : 'translate-x-0'}">
                  </div>
                </button>
              </div>
            {/key}
          </div>
        {/if}
      </div>

      <div class="flex flex-col gap-4 w-full">
        <div
          class="relative flex flex-col p-6 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {date
            ? 'h-43'
            : 'h-35'}">
          <div class="w-full flex justify-between items-start">
            <div class="w-fit flex flex-col justify-start items-start">
              <span class="text-lg text-black dark:text-white">Uptime</span>
              <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                <span class="flex justify-center items-center text-nowrap"
                  >{date ? 'Date : ' + summaryWithDate?.date : 'Last Collected :'}</span>

                {#if !date}
                  <span class="flex justify-center items-center text-nowrap tracking-wider">
                    {new Date(history?.last_collected).toLocaleString('en-CA', {
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
              </div>
            </div>

            <span
              class="text-2xl {summaryWithDate?.overall.uptime_percent ||
              history?.uptime_percent >= 90
                ? 'text-[#008236]'
                : summaryWithDate?.overall.uptime_percent || history?.uptime_percent >= 80
                  ? 'text-[#00D492]'
                  : summaryWithDate?.overall.uptime_percent || history?.uptime_percent >= 70
                    ? 'text-[#FDC700]'
                    : summaryWithDate?.overall.uptime_percent || history?.uptime_percent >= 50
                      ? 'text-[#F97316]'
                      : 'text-[#EF4444]'}">
              {summaryWithDate?.overall.uptime_percent || history?.uptime_percent}%
            </span>
          </div>

          <div
            class=" w-full z-10 flex flex-row-reverse gap-0.5 justify-between items-end absolute start-1/2 -translate-x-1/2 px-6 {date
              ? 'bottom-14'
              : 'bottom-6'}">
            {#if !date}
              {#each history?.data as detail (detail[0])}
                {@const status = detail[1]}

                <button
                  type="button"
                  aria-label="detail of status"
                  onmouseover={() => {
                    if (!date) {
                      http
                        .get(endpoints.agentHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onmouseleave={() => {
                    if (!date) {
                      historyDetail = null;
                    }
                  }}
                  onfocus={() => {
                    if (!date) {
                      http
                        .get(endpoints.agentHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onblur={() => {
                    if (!date) {
                      historyDetailDetail = null;
                    }
                  }}
                  class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
                  'offline'
                    ? 'bg-[#EF4444]'
                    : status === 'online'
                      ? 'bg-green-700'
                      : 'bg-[#FFFFFF]/10'}">
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
                                    : 'text-green-700'}"
                                >{historyDetail.memory_usage_percent}%</span>
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
                      {#if historyDetail?.is_offline}
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
                        {new Date(historyDetail?.collected_at).toLocaleString('en-CA', {
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
            {:else}
              {#each summaryWithDate?.uptime_series as uptime, i}
                <button
                  type="button"
                  aria-label="detail of status"
                  class="w-full h-6 transition-all cursor-pointer relative group {uptime >= 90
                    ? 'hover:bg-[#008236]/70 bg-[#008236]'
                    : uptime >= 80
                      ? 'hover:bg-[#00D492]/70 bg-[#00D492]'
                      : uptime >= 70
                        ? 'hover:bg-[#FDC700]/70 bg-[#FDC700]'
                        : uptime >= 50
                          ? 'hover:bg-[#F97316]/70 bg-[#F97316]'
                          : 'hover:bg-[#EF4444]/70 bg-[#EF4444]'}">
                  <div
                    class="absolute top-1/2 start-1/2 -translate-1/2 text-xs text-white transition-all">
                    {uptime}%
                  </div>

                  <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>

                  <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                    {(summaryWithDate.uptime_series.length - i).toString().padStart(2, '0')}:00
                  </div>
                </button>
              {/each}

              <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full px-6">
                <div class="h-px w-full bg-white/10"></div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between items-start">
          <span class="text-lg text-black dark:text-white"> Collect Duration</span>

          {#if date}
            <div class="flex text-2xl justify-end gap-2 items-center">
              <span
                class={summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'excellent'
                  ? 'text-green-500'
                  : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : summaryWithDate?.overall?.apdex_rating?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}>
                {summaryWithDate?.overall?.apdex_rating}
              </span>

              <span class="h-7 w-px bg-white/15"></span>

              <span
                class={summaryWithDate?.overall?.apdex_score >= 90
                  ? 'text-[#008236]'
                  : summaryWithDate?.overall?.apdex_score >= 80
                    ? 'text-[#00D492]'
                    : summaryWithDate?.overall?.apdex_score >= 70
                      ? 'text-[#FDC700]'
                      : summaryWithDate?.overall?.apdex_score >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}>
                {summaryWithDate?.overall?.apdex_score}%</span>
            </div>
          {:else}
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
                class={summaryWithDate?.overall?.apdex_score || collectDuration?.avg_ms >= 90
                  ? 'text-[#008236]'
                  : summaryWithDate?.overall?.apdex_score || collectDuration?.avg_ms >= 80
                    ? 'text-[#00D492]'
                    : summaryWithDate?.overall?.apdex_score || collectDuration?.avg_ms >= 70
                      ? 'text-[#FDC700]'
                      : summaryWithDate?.overall?.apdex_score || collectDuration?.avg_ms >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}>
                {summaryWithDate?.overall?.apdex_score || collectDuration?.avg_ms}ms</span>
            </div>
          {/if}
        </div>

        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end">
          <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>

          {#each date ? summaryWithDate?.apdex_series : collectDuration?.series as detail, i}
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
              {#if i !== 0 && i % (date ? 1 : 4) === 0}
                <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                  <div class="relative">
                    <div
                      class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                      {date
                        ? detail?.from?.slice(0, 5)
                        : new Date(detail?.from).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}
                    </div>
                  </div>
                </div>
              {/if}

              {#if date && summaryWithDate?.apdex_series.length - 1 === i}
                <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
                  <div class="relative">
                    <div
                      class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                      {date
                        ? detail?.end_time
                        : new Date(detail?.end_time).toLocaleString('en-CA', {
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
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
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
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
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
                            : 'text-[#F87171]'}">{detail?.avg_ms} ms</span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Lowest Duration :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.min_ms} ms</span>
                </div>

                <div class="w-full flex justify-between items-center gap-2.5">
                  <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                    >Mostest Duration :</span>
                  <span class="flex justify-center items-center text-sm text-nowrap text-white"
                    >{detail?.max_ms}ms</span>
                </div>

                <div
                  class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>From</span>
                    <span class="text-white/30">
                      {date
                        ? detail.start_time
                        : `:${new Date(detail?.from).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}`}</span>
                  </div>

                  <div class="flex justify-between items-center gap-1 w-full">
                    <span>Until</span>
                    <span class="text-white/30">
                      {date
                        ? detail?.to
                        : `:${new Date(detail?.to).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                          })}`}</span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6 w-full h-100">
        <div class="col-span-9 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl"></div>
        <div
          class="col-span-3 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl grid grid-cols-1 grid-rows-3 gap-1">
          <div class="flex flex-col justify-start items-start gap-4">
            <div class="flex justify-start items-start gap-2">
              <span class="h-full w-0.5 bg-blue-600 rounded-full"></span>
              <span class="text-lg text-black dark:text-white">CPU</span>
            </div>

            <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-4 gap-x-10">
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">AV CPU : </span>
                <span class="text-white/40 text-xs">{metrics?.avg_cpu_usage}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">AV CPU : </span>
                <span class="text-white/40 text-xs">{metrics?.avg_cpu_usage}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">AV CPU : </span>
                <span class="text-white/40 text-xs">{metrics?.avg_cpu_usage}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">AV CPU : </span>
                <span class="text-white/40 text-xs">{metrics?.avg_cpu_usage}%</span>
              </div>
            </div>
          </div>

          <div></div>
          <div></div>
        </div>
      </div>

      <div
        class="w-full grid grid-cols-6 gap-8 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
        {#each summary as item, i}
          {@const historyMap = new Map(Object.entries(item?.history ?? {}))}
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center w-full border-b border-b-white/15 pb-1">
              <span class="text-sm text-white"> {getMonthName(item.month)}</span>
              <div class="flex flex-col">
                <div
                  class="text-xs items-center justify-end gap-1 flex {item?.apdex_rate?.toLowerCase() ===
                  'excellent'
                    ? 'text-green-500'
                    : item?.apdex_rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : item?.apdex_rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : item?.apdex_rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}">
                  {#if item?.apdex_score === 0}
                    <span class="text-white/20 text-xs">No Data</span>
                  {:else}
                    <span class="opacity-50"> {item?.apdex_rate}</span>
                    <span class="bg-white/15 w-px h-4"></span>
                    <span> {item?.apdex_score}%</span>
                  {/if}
                </div>
              </div>
            </div>

            <div class="grid grid-cols-7 grid-rows-5 gap-4 w-full">
              <div style="grid-column: span {new Date(item.year, item.month - 1, 1).getDay()};">
              </div>
              {#each historyMap as [day, value], i}
                {@const isSpecialModeWithDate =
                  date &&
                  Number(date?.year) === Number(item?.year) &&
                  Number(date?.month) === Number(item?.month) &&
                  Number(date?.day) === Number(day)}
                <button
                  onclick={() => {
                    const newUrl = new URL($page.url);
                    newUrl.searchParams.set('year', item?.year);
                    newUrl.searchParams.set('month', item?.month);
                    newUrl.searchParams.set('day', day);

                    goto(newUrl, {
                      keepfocus: true,
                      noScroll: true,
                    });
                  }}
                  style={isSpecialModeWithDate
                    ? `box-shadow: 0 0 7px 4px ${
                        value >= 90
                          ? 'rgba(0, 130, 54, 0.4)'
                          : value >= 80
                            ? 'rgba(0, 212, 146, 0.4)'
                            : value >= 70
                              ? 'rgba(253, 199, 0, 0.4)'
                              : value >= 50
                                ? 'rgba(249, 115, 22, 0.4)'
                                : 'rgba(239, 68, 68, 0.4)'
                      };`
                    : ''}
                  class="text-white aspect-square transition-all w-full flex items-center justify-center relative border border-white/15 group {isSpecialModeWithDate
                    ? 'animate-pulse'
                    : 'cursor-pointer'} {value >= 90
                    ? 'bg-[#008236]'
                    : value >= 80
                      ? 'bg-[#00D492]'
                      : value >= 70
                        ? 'bg-[#FDC700]'
                        : value >= 50
                          ? 'bg-[#F97316]'
                          : value !== null
                            ? 'bg-[#EF4444]'
                            : ' shadow-inner shadow-white/5 cursor-default!'} ">
                  <div
                    class="hidden absolute min-w-40 text-sm -top-20 border border-white/15 px-3 py-2 flex-col gap-1 bg-black/80 backdrop-blur-2xl rounded-xl z-10 {value !==
                      null && !isSpecialModeWithDate
                      ? 'group-hover:flex'
                      : ''}">
                    <div class="flex justify-between items-center">
                      <span class="text-[#6a7282] text-nowrap">Uptime :</span>
                      <span
                        class="text-nowrap {value >= 90
                          ? 'text-[#008236]'
                          : value >= 80
                            ? 'text-[#00D492]'
                            : value >= 70
                              ? 'text-[#FDC700]'
                              : value >= 50
                                ? 'text-[#F97316]'
                                : 'text-[#EF4444]'}">{value}%</span>
                    </div>

                    <span
                      class="text-white/30 text-nowrap border-t pt-1 border-t-white/15 text-start"
                      >{item?.year}/{item?.month}/{day}</span>
                  </div>
                  <span class="absolute start-1/2 top-1/2 -translate-1/2">-</span>
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
