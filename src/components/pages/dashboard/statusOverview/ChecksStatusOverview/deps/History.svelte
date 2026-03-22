<script>
  import { endpoints } from '../../../../../../endpoints.svelte';
  import { http } from '../../../../../../services/http.svelte';
  import responseTimeColor from '../../../../../../utils/responseTimeColor';

  const REQUIRED_HISTORY_COUNT = $state(innerWidth < 640 ? 31 : 50);
  const { checkId } = $props();
  let history = $state(null);
</script>

<div
  class="absolute z-10 bottom-4 xl:bottom-6 w-full flex flex-row-reverse gap-0.5 justify-between items-end px-4.25">
  {#await http.get( endpoints.checkHistory(checkId), { params: { short: true, page_size: REQUIRED_HISTORY_COUNT } }, ) then res}
    {@const items = res.data.data}
    {@const missingCount = REQUIRED_HISTORY_COUNT - items.length}
    {#each items as detail (detail[0])}
      {@const status = detail[1]}
      {@const id = detail[0]}
      <button
        type="button"
        aria-label="detail of status"
        onmouseover={() => {
          http
            .get(endpoints.checkHistoryDetail(checkId, id))
            .then(res => (history = res.data.data));
        }}
        onmouseleave={() => {
          history = null;
        }}
        onfocus={() => {
          http
            .get(endpoints.checkHistoryDetail(checkId, id))
            .then(res => (history = res.data.data));
        }}
        onblur={() => {
          history = null;
        }}
        class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
          'error' || status === 'down'
          ? 'bg-[#EF4444]'
          : status === 'timeout'
            ? 'bg-[#F97316]'
            : status === 'up'
              ? 'bg-green-700'
              : 'bg-[#FFFFFF]/10'}">
        {#if history}
          <div
            class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
            <div class="w-full flex justify-between items-center gap-2.5">
              <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                >Status :</span>
              <span
                class="flex justify-center items-center text-sm text-nowrap capitalize {history.status ===
                  'error' || history.status === 'down'
                  ? 'text-[#F87171]'
                  : history.status === 'timeout'
                    ? 'text-[#F97316]'
                    : history.status === 'up'
                      ? 'text-green-700'
                      : ''}">{history.status}</span>
            </div>
            {#if history.response_time_ms}
              <div class="w-full flex justify-between items-center gap-2.5">
                <span class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                  >Latency :</span>
                <span
                  class="flex justify-center items-center text-sm text-nowrap {responseTimeColor(
                    history.response_time_ms,
                  )}">{history.response_time_ms} ms</span>
              </div>
            {/if}

            <div
              class="w-full flex justify-start items-center text-sm pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
              {new Date(history.checked_at).toLocaleString('en-CA', {
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
        {/if}
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
