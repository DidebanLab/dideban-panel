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
  import Chart from '../../../../components/pages/agent/Chart.svelte';

  const REQUIRED_COUNT = $state(innerWidth < 640 ? 31 : 96);
  const id = $page.params.agent;
  let data = $state();
  let chart = $state({
    time_range: {
      from: '2026-02-01T13:31:12.1004363+03:30',
      to: '2026-02-02T13:31:12.1004363+03:30',
      hours: 24,
      max_points: 360,
    },
    points: [
      [259753, 0, 0],
      [518950, 26, 50],
      [518944, 0, 0],
      [518938, 32, 35],
      [518932, 51, 41],
      [518926, 20, 55],
      [518920, 60, 33],
      [518914, 60, 56],
      [518908, 38, 69],
      [518902, 22, 36],
      [518896, 51, 22],
      [518890, 48, 51],
      [518884, 40, 22],
      [518878, 20, 57],
      [518872, 20, 47],
      [518866, 33, 67],
      [518860, 31, 67],
      [518854, 41, 36],
      [518848, 39, 43],
      [518842, 30, 45],
      [518836, 22, 61],
      [518830, 11, 20],
      [518824, 35, 43],
      [518818, 11, 56],
      [518812, 31, 45],
      [518806, 59, 48],
      [518800, 0, 0],
      [518794, 60, 60],
      [518788, 26, 45],
      [518782, 41, 36],
      [518776, 33, 73],
      [518770, 48, 44],
      [518764, 58, 70],
      [518758, 45, 37],
      [518752, 33, 11],
      [518746, 31, 63],
      [518740, 22, 59],
      [518734, 20, 56],
      [518728, 20, 61],
      [518722, 32, 57],
      [518716, 42, 37],
      [518710, 56, 41],
      [518704, 19, 61],
      [518698, 44, 34],
      [518692, 56, 59],
      [518686, 40, 40],
      [518680, 28, 48],
      [518674, 22, 62],
      [518668, 22, 53],
      [518662, 14, 54],
      [518656, 20, 47],
      [518650, 13, 42],
      [518644, 12, 51],
      [518638, 85, 48],
      [518632, 52, 21],
      [518626, 12, 47],
      [518620, 14, 28],
      [518614, 11, 63],
      [518608, 12, 45],
      [518602, 0, 0],
      [518596, 16, 51],
      [518590, 82, 67],
      [518584, 14, 52],
      [518578, 43, 66],
      [518572, 12, 64],
      [518566, 41, 58],
      [518560, 48, 39],
      [518554, 27, 54],
      [518548, 29, 56],
      [518542, 76, 23],
      [518536, 45, 27],
      [518530, 58, 69],
      [518524, 42, 39],
      [518518, 11, 20],
      [518512, 34, 70],
      [518506, 55, 52],
      [518500, 36, 31],
      [518494, 29, 35],
      [518488, 43, 59],
      [518482, 50, 42],
      [518476, 0, 0],
      [518470, 44, 70],
      [518464, 41, 20],
      [518458, 31, 59],
      [518452, 37, 35],
      [518446, 14, 66],
      [518440, 15, 41],
      [518434, 59, 33],
      [518428, 21, 62],
      [518422, 26, 54],
      [518416, 57, 15],
      [518410, 52, 59],
      [518404, 22, 85],
      [518398, 28, 40],
      [518392, 0, 0],
      [518386, 41, 63],
      [518380, 14, 60],
      [518374, 25, 31],
      [518368, 50, 19],
      [518362, 52, 54],
      [518356, 47, 75],
      [518350, 43, 33],
      [518344, 22, 48],
      [518338, 12, 95],
      [518332, 54, 86],
      [518326, 49, 36],
      [518320, 92, 52],
      [518314, 53, 86],
      [518308, 19, 53],
      [518302, 11, 48],
      [518296, 35, 65],
      [518290, 25, 30],
      [518284, 43, 48],
      [518278, 48, 68],
      [518272, 16, 57],
      [518266, 13, 36],
      [518260, 53, 45],
      [518254, 11, 54],
      [518248, 54, 64],
      [518242, 46, 63],
      [518236, 10, 57],
      [518230, 24, 53],
      [518224, 59, 58],
      [518218, 19, 44],
      [518212, 73, 46],
      [518206, 46, 93],
      [518200, 33, 30],
      [518194, 59, 59],
      [518188, 24, 68],
      [518182, 21, 31],
      [518176, 20, 36],
      [518170, 20, 61],
      [518164, 60, 54],
      [518158, 40, 53],
      [518152, 22, 35],
      [518146, 0, 0],
      [518140, 58, 54],
      [518135, 27, 66],
      [518130, 12, 38],
      [518124, 26, 40],
      [518118, 19, 47],
      [518112, 12, 51],
      [518106, 16, 27],
      [518100, 14, 45],
      [518094, 55, 24],
      [518088, 53, 61],
      [518082, 21, 55],
      [518076, 15, 45],
      [518070, 19, 68],
      [518064, 0, 0],
      [518058, 18, 36],
      [518052, 24, 58],
      [518046, 47, 61],
      [518040, 33, 40],
      [518034, 51, 42],
      [518028, 60, 53],
      [518022, 30, 64],
      [518016, 48, 42],
      [518010, 13, 33],
      [518004, 13, 32],
      [517998, 40, 64],
      [517992, 31, 77],
      [517986, 31, 57],
      [517980, 13, 34],
      [517974, 12, 45],
      [259748, 0, 0],
      [259745, 0, 0],
      [259742, 0, 0],
      [259739, 0, 0],
      [259736, 0, 0],
      [259733, 0, 0],
      [259730, 0, 0],
      [259727, 0, 0],
      [259724, 0, 0],
      [259721, 0, 0],
      [259718, 0, 0],
      [259715, 0, 0],
      [259712, 0, 0],
      [259709, 0, 0],
      [259706, 0, 0],
      [259703, 0, 0],
      [259700, 0, 0],
      [259697, 0, 0],
      [259694, 0, 0],
      [259691, 0, 0],
      [259688, 0, 0],
      [259685, 0, 0],
      [259682, 0, 0],
      [259679, 0, 0],
      [259676, 0, 0],
      [259673, 0, 0],
      [259670, 0, 0],
      [259667, 0, 0],
      [259664, 0, 0],
      [259661, 0, 0],
      [259658, 0, 0],
      [259655, 0, 0],
      [259652, 0, 0],
      [259649, 0, 0],
      [259646, 0, 0],
      [259643, 0, 0],
      [259640, 0, 0],
      [517856, 33, 32],
      [517850, 11, 26],
      [517844, 15, 50],
      [517838, 42, 47],
      [517832, 43, 62],
      [517826, 15, 83],
      [517820, 39, 63],
      [517814, 0, 0],
      [517808, 18, 64],
      [517802, 19, 31],
      [517796, 21, 56],
      [517790, 55, 66],
      [517784, 20, 64],
      [517778, 36, 53],
      [517772, 29, 38],
      [517766, 44, 43],
      [517760, 35, 49],
      [517754, 44, 62],
      [517748, 38, 40],
      [517742, 44, 41],
      [517736, 32, 70],
      [517730, 49, 59],
      [517724, 27, 33],
      [517718, 12, 71],
      [517712, 22, 92],
      [517706, 58, 33],
      [517700, 26, 93],
      [517694, 0, 0],
      [517688, 54, 58],
      [517682, 58, 43],
      [517676, 11, 18],
      [517670, 47, 60],
      [517664, 0, 0],
      [517658, 26, 53],
      [517652, 49, 62],
      [517646, 10, 57],
      [517640, 55, 66],
      [517634, 51, 47],
      [517628, 29, 46],
      [517622, 55, 53],
      [517616, 12, 53],
      [517610, 49, 68],
      [517604, 49, 29],
      [517598, 0, 0],
      [517592, 37, 60],
      [517586, 18, 62],
      [517580, 36, 47],
      [517574, 60, 44],
      [517568, 33, 65],
      [517562, 31, 21],
      [517556, 79, 37],
      [517550, 0, 0],
      [517544, 36, 15],
      [517538, 21, 69],
      [517532, 19, 60],
      [517526, 25, 37],
      [517520, 39, 68],
      [517514, 60, 50],
      [517508, 33, 16],
      [517502, 59, 43],
      [517496, 56, 55],
      [517490, 54, 64],
      [517484, 56, 49],
      [517478, 42, 58],
      [517472, 53, 10],
      [517466, 12, 67],
      [517460, 0, 0],
      [517454, 53, 59],
      [517448, 11, 33],
      [517442, 29, 61],
      [517436, 21, 47],
      [517430, 52, 45],
      [517424, 30, 54],
      [517418, 0, 0],
      [517412, 42, 56],
      [517406, 50, 60],
      [517400, 16, 39],
      [517394, 11, 64],
      [517388, 40, 56],
      [517382, 19, 44],
      [517376, 14, 28],
      [517370, 26, 31],
      [517364, 60, 57],
      [517358, 45, 38],
      [517352, 0, 0],
      [517346, 32, 51],
      [517340, 12, 53],
      [517334, 11, 31],
      [517328, 23, 59],
      [517322, 18, 61],
      [517316, 56, 55],
      [517310, 35, 51],
      [517304, 23, 66],
      [517298, 31, 46],
      [517292, 41, 51],
      [517286, 15, 41],
      [517280, 21, 36],
      [517274, 0, 0],
      [517268, 33, 44],
      [517262, 51, 32],
      [517256, 22, 53],
      [517250, 41, 69],
      [517244, 22, 40],
      [517238, 38, 45],
      [517232, 19, 69],
      [517226, 13, 32],
      [517220, 19, 57],
      [517214, 23, 59],
      [517208, 41, 48],
      [517202, 11, 31],
      [517196, 58, 61],
      [517190, 43, 33],
      [517184, 30, 50],
      [517178, 12, 37],
      [517172, 35, 68],
      [517166, 25, 38],
      [517160, 13, 59],
      [517154, 58, 54],
      [517148, 21, 35],
      [517142, 11, 66],
      [517136, 25, 26],
      [517130, 25, 39],
      [517124, 16, 67],
      [517118, 28, 32],
      [517112, 42, 47],
      [517106, 35, 41],
      [517100, 45, 16],
      [517094, 48, 35],
      [517088, 14, 47],
      [517082, 55, 74],
      [517076, 13, 23],
      [517070, 92, 46],
      [517064, 27, 50],
      [517058, 59, 47],
      [517052, 39, 51],
      [517046, 43, 42],
      [517040, 50, 32],
      [517034, 33, 61],
      [517028, 0, 0],
      [517022, 45, 55],
      [517016, 56, 32],
      [517010, 41, 43],
      [517004, 13, 33],
      [516998, 31, 16],
      [516992, 40, 36],
      [516986, 48, 49],
      [516980, 52, 39],
      [516974, 54, 17],
      [516968, 22, 67],
      [516962, 39, 61],
      [516956, 36, 33],
      [516950, 21, 49],
      [516944, 43, 48],
      [516938, 79, 54],
      [516932, 13, 35],
      [516926, 36, 42],
      [516920, 26, 52],
      [516914, 24, 12],
    ],
    last_history: {
      id: 259753,
      agent_id: 1,
      is_offline: true,
      collect_duration_ms: 0,
      cpu_load_1: 10,
      cpu_load_5: 50,
      cpu_load_15: 90,
      cpu_usage_percent: 60,
      memory_total_mb: 40,
      memory_used_mb: 90,
      memory_available_mb: 10,
      memory_usage_percent: 10,
      disk_total_gb: 10,
      disk_used_gb: 10,
      disk_usage_percent: 10,
      collected_at: '2026-02-02T08:21:02.9225951+03:30',
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
        });

      http.get(endpoints.agentCollectDuration(id)).then(res => (collectDuration = res.data?.data));

      http.get(endpoints.agents + `/${id}`).then(res => {
        data = res.data?.data;
        enabled = res.data?.data.enabled;
      });

      // http.get(endpoints.agents + `/${id}/chart`).then(res => (chart = res.data?.data));
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

      <div class="grid grid-cols-12 gap-6 w-full">
        <div
          class="w-full col-span-9 border flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
          <div class="w-full flex justify-between items-start">
            <div class="w-full flex gap-1 flex-col justify-start items-start">
              <span class="text-lg md:text-xl text-black dark:text-white">Metrics</span>
              <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                <span class="flex justify-center items-center text-nowrap">Collect at :</span>

                <span class="flex justify-center items-center text-nowrap tracking-wider">
                  {new Date(chart?.last_history?.collected_at).toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </div>

            <div
              class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
              <span class="text-white/40 me-1">Collect Duration : </span>
              <span class={responseTimeColor(chart?.last_history?.collect_duration_ms)}
                >{chart?.last_history?.collect_duration_ms} ms</span>
            </div>
          </div>
          {#if chart}
            <Chart
              points={[...chart.points.slice(-100).map(item => item[0])]}
              data={[
                {
                  name: 'CPU',
                  data: [...chart.points.slice(-100).map(item => item[1])],
                },
                {
                  name: 'Memory',
                  data: [...chart.points.slice(-100).map(item => item[2])],
                },
              ]} />
          {/if}
        </div>
        <div
          class="col-span-3 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl grid grid-cols-1 gap-4 dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
          <div class="flex flex-col justify-start items-start gap-4">
            <div class="flex justify-start items-start gap-2">
              <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
              <span class="text-lg text-black dark:text-white">CPU</span>
            </div>

            <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Usage: </span>
                <span
                  class="text-xs {chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                    ? 'text-[#F87171]'
                    : chart.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart.last_history?.cpu_usage_percent}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Av (1m): </span>
                <span
                  class="text-xs {chart.last_history?.cpu_load_1 > LIMITATIONS.cpu.error
                    ? 'text-[#F87171]'
                    : chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart?.last_history?.cpu_load_1}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Av (5m): </span>
                <span
                  class="text-xs {chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.error
                    ? 'text-[#F87171]'
                    : chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart?.last_history?.cpu_load_5}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Av (15m) : </span>
                <span
                  class="text-xs {chart.last_history?.cpu_load_15 > LIMITATIONS.cpu.error
                    ? 'text-[#F87171]'
                    : chart.last_history?.cpu_load_15 > LIMITATIONS.cpu.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart.last_history?.cpu_load_15}%</span>
              </div>
            </div>

            <div
              class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
              <div
                style="box-shadow: 0 0 5px 1px {chart?.last_history?.cpu_usage_percent >
                LIMITATIONS.cpu.error
                  ? 'rgba(248, 113, 113, 0.5)'
                  : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                    ? 'rgba(249, 115, 22, 0.5)'
                    : 'rgba(0, 130, 54, 0.5)'}; width:{chart.last_history?.cpu_usage_percent}%;"
                class="h-full rounded-s-md {chart?.last_history?.cpu_usage_percent === 100
                  ? 'rounded-e-md'
                  : ''} {chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                  ? 'bg-[#EF4444]'
                  : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                    ? 'bg-[#F97316]'
                    : 'bg-green-700'}">
              </div>

              <div
                class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-sm text-white">
                {chart.last_history?.cpu_usage_percent}%
              </div>
            </div>
          </div>
          <div class="w-full h-0.5 bg-[#0D0D0D]/5 dark:bg-white/5 rounded-full"></div>

          <div class="flex flex-col justify-start items-start gap-4">
            <div class="flex justify-start items-start gap-2">
              <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
              <span class="text-lg text-black dark:text-white">Memory</span>
            </div>

            <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Usage: </span>
                <span
                  class="text-xs {chart?.last_history?.memory_usage_percent >
                  LIMITATIONS.memory.error
                    ? 'text-[#F87171]'
                    : chart.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart.last_history?.memory_usage_percent}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Total: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.memory_total_mb}

                  <sub class="text-white/40">Mb</sub>
                </span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Used: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.memory_used_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Available: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.memory_available_mb}
                  <sub class="text-white/40">Mb</sub>
                </span>
              </div>
            </div>

            <div
              class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
              <div
                style="box-shadow: 0 0 5px 1px {chart.last_history?.memory_usage_percent >
                LIMITATIONS.memory.error
                  ? 'rgba(248, 113, 113, 0.5)'
                  : chart.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                    ? 'rgba(249, 115, 22, 0.5)'
                    : 'rgba(0, 130, 54, 0.5)'}; width:{chart.last_history?.memory_usage_percent}%;"
                class="h-full rounded-s-md {chart.last_history?.memory_usage_percent === 100
                  ? 'rounded-e-md'
                  : ''} {chart.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                  ? 'bg-[#EF4444]'
                  : chart.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                    ? 'bg-[#F97316]'
                    : 'bg-green-700'}">
              </div>

              <div
                class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-sm text-white">
                {chart.last_history?.memory_usage_percent}%
              </div>
            </div>
          </div>

          <div class="h-px w-full bg-white/10"></div>
          <div class="flex flex-col justify-start items-start gap-4">
            <div class="flex justify-start items-start gap-2">
              <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
              <span class="text-lg text-black dark:text-white">Disk</span>
            </div>

            <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Usage: </span>
                <span
                  class="text-xs {chart.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                    ? 'text-[#F87171]'
                    : chart.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                      ? 'text-[#F97316]'
                      : 'text-green-700'}">{chart.last_history?.disk_usage_percent}%</span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Total: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.disk_total_gb}
                  <sub class="text-white/40">Gb</sub></span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Used: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span>
              </div>
              <div class="w-full flex justify-between items-start gap-1">
                <span class="text-white/40 text-xs">Available: </span>
                <span class="text-xs text-white"
                  >{chart.last_history?.disk_total_gb - chart.last_history?.disk_used_gb}
                  <sub class="text-white/40"> Gb</sub></span>
              </div>
            </div>

            <div
              class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
              <div
                style="width:{chart.last_history?.disk_usage_percent}%;"
                class="h-full rounded-s-md {chart.last_history?.disk_usage_percent === 100
                  ? 'rounded-e-md'
                  : ''} {chart.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                  ? 'bg-[#EF4444]'
                  : chart.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                    ? 'bg-[#F97316]'
                    : 'bg-green-700'}">
              </div>

              <div
                class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-sm text-white">
                {chart.last_history?.disk_usage_percent}%
              </div>
            </div>
          </div>
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
