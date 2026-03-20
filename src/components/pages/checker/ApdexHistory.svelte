<script>
  import { endpoints } from '../../../endpoints.svelte';
  import { http } from '../../../services/http.svelte';
  let { id, hours, summaryWithDate, date } = $props();
  let apdex = $state();

  $effect(() => {
    if (!date) {
      http
        .get(endpoints.checkApdexHistory(id), { params: { hours } })
        .then(res => (apdex = res.data?.data));
    }
  });
</script>

<div
  class="relative w-full flex flex-col sm:p-6 xl:pb-13 gap-4 sm:gap-8 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="flex justify-between items-start">
    <div class="w-fit flex flex-col justify-start items-start">
      <span class="text-lg text-black dark:text-white"> Apdex history</span>

      {#if date ? summaryWithDate?.overall?.total_satisfied || summaryWithDate?.overall?.total_tolerating || summaryWithDate?.overall?.total_frustrated : apdex?.total_satisfied || apdex?.total_tolerating || apdex?.total_frustrated}
        <div class="flex justify-start items-center gap-1">
          <span class="text-sm text-[#99a1af]">Detail Information</span>

          <button class="group relative">
            <img
              class="cursor-pointer"
              width="20"
              height="20"
              src="/icons/question.png"
              alt="question" />
            <div
              class="absolute *:text-nowrap bg-black/50 backdrop-blur-2xl hidden group-hover:flex text-white/30 text-sm ms-2 start-full bottom-0 border border-white/10 rounded-xl py-3 px-4 flex-col gap-1">
              {#if date ? summaryWithDate?.overall?.total_satisfied : apdex?.total_satisfied}
                <div class="flex justify-between items-center gap-1 w-full">
                  <span>Total Satisfied :</span>
                  <span class="text-white"
                    >{date
                      ? summaryWithDate?.overall?.total_satisfied
                      : apdex?.total_satisfied}</span>
                </div>
              {/if}
              {#if date ? summaryWithDate?.overall?.total_tolerating : apdex?.total_tolerating}
                <div class="flex justify-between items-center gap-1 w-full">
                  <span>Total Tolerating :</span>
                  <span class="text-white">
                    {date
                      ? summaryWithDate?.overall?.total_tolerating
                      : apdex?.total_tolerating}</span>
                </div>
              {/if}
              {#if date ? summaryWithDate?.overall?.total_frustrated : apdex?.total_frustrated}
                <div class="flex justify-between items-center gap-1 w-full">
                  <span>Total Frustrated :</span>
                  <span class="text-white">
                    {date
                      ? summaryWithDate?.overall?.total_frustrated
                      : apdex?.total_frustrated}</span>
                </div>
              {/if}
            </div>
          </button>
        </div>{/if}
    </div>

    {#if date}
      {#if summaryWithDate?.overall?.apdex_score}
        <div class="flex text-lg sm:text-2xl justify-end gap-2 items-center">
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
        <span class="text-white/20 text-2xl"> No Data </span>
      {/if}
    {:else if apdex?.apdex_score}
      <div class="flex text-lg sm:text-2xl justify-end gap-2 items-center">
        <span
          class={apdex?.apdex_rating?.toLowerCase() === 'excellent'
            ? 'text-green-500'
            : apdex?.apdex_rating?.toLowerCase() === 'good'
              ? 'text-[#00D492]'
              : apdex?.apdex_rating?.toLowerCase() === 'fair'
                ? 'text-[#FDC700]'
                : apdex?.apdex_rating?.toLowerCase() === 'poor'
                  ? 'text-[#F97316]'
                  : 'text-[#F87171]'}>
          {apdex?.apdex_rating}
        </span>

        <span class="h-7 w-px bg-white/15"></span>

        <span
          class={summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 90
            ? 'text-[#008236]'
            : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 80
              ? 'text-[#00D492]'
              : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 70
                ? 'text-[#FDC700]'
                : summaryWithDate?.overall?.apdex_score || apdex?.apdex_score >= 50
                  ? 'text-[#F97316]'
                  : 'text-[#EF4444]'}>
          {summaryWithDate?.overall?.apdex_score || apdex?.apdex_score}%</span>
      </div>
    {:else}
      <span class="text-white/20 text-2xl"> No Data </span>
    {/if}
  </div>

  <div
    class="relative w-full z-10 flex gap-0.5 justify-start items-end overflow-x-auto overflow-y-hidden pb-8 pt-4 3xl:overflow-x-visible 3xl:overflow-y-visible 3xl:py-0">
    <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>

    {#each date ? summaryWithDate?.apdex_series : apdex?.apdex_series as detail, i}
      {@const length = date ? summaryWithDate?.apdex_series.length : apdex?.apdex_series.length}
      <div
        style="height: {detail?.apdex_score / 2}px;"
        class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.apdex_score >=
        90
          ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
          : detail?.apdex_score >= 80
            ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
            : detail?.apdex_score >= 70
              ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
              : detail?.apdex_score >= 50
                ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'} {date
          ? 'min-w-[40.5px]'
          : 'min-w-[13.5px]'}">
        {#if date && detail?.apdex_score}
          <div class="text-white absolute start-1/2 -translate-x-1/2 -top-6 text-xs">
            {detail?.apdex_score}%
          </div>
        {/if}
        {#if i !== 0 && i % (date ? 1 : length < 30 ? 1 : 3) === 0}
          <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
            <div class="relative">
              <div
                class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                {detail?.start_time.slice(0, 5)}
              </div>
            </div>
          </div>
        {/if}

        {#if date && summaryWithDate?.apdex_series.length - 1 === i}
          <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
            <div class="relative">
              <div
                class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                24:00
              </div>
            </div>
          </div>
        {/if}

        {#if detail?.apdex_score}
          <div
            class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Apdex Rating :</span>
              <span
                class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.apdex_rating?.toLowerCase() ===
                'excellent'
                  ? 'text-green-500'
                  : detail?.apdex_rating?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : detail?.apdex_rating?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : detail?.apdex_rating?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}">{detail?.apdex_rating}</span>
            </div>
            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Apdex Score :</span>
              <span
                class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.apdex_rating?.toLowerCase() ===
                'excellent'
                  ? 'text-green-500'
                  : detail?.apdex_rating?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : detail?.apdex_rating?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : detail?.apdex_rating?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}"
                >{detail?.apdex_score}%
              </span>
            </div>

            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Total Satisfied :</span>
              <span class="flex justify-center items-center text-sm text-nowrap text-white"
                >{detail?.total_satisfied}</span>
            </div>

            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Total Tolerating :</span>
              <span class="flex justify-center items-center text-sm text-nowrap text-white"
                >{detail?.total_tolerating}</span>
            </div>

            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Total Frustrated :</span>
              <span class="flex justify-center items-center text-sm text-nowrap text-white"
                >{detail?.total_frustrated}</span>
            </div>

            <div
              class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
              <div class="flex justify-between items-center gap-1 w-full">
                <span>From</span>
                <span class="text-white/30">
                  {detail.start_time}
                </span>
              </div>

              <div class="flex justify-between items-center gap-1 w-full">
                <span>Until</span>
                <span class="text-white/30"> {detail?.end_time}</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/each}

    {#if date ? !summaryWithDate?.overall.apdex_score : !apdex?.apdex_score}
      {#each Array(24) as _, i}
        <div
          aria-hidden="true"
          class="h-1 w-full rounded-[1px] cursor-pointer relative border-t-4 transition-all bg-[#F87171] border-t-[#ba4646]">
          <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
          <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
            {(i + 1).toString().padStart(2, '0')}:00
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
