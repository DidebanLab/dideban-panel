<script>
  import UptimeHistoryAll from './../../../../components/common/UptimeHistoryAll.svelte';
  import { AGENTS_DATA } from './../../../../components/pages/dashboard/statusOverview/constant.svelte.js';
  import StrokedGaugeChart from '../../../../components/common/StrokedGaugeChart.svelte';
  import UptimeChart from '../../../../components/common/UptimeChart.svelte';
  import { LIMITATIONS } from '../../../../components/config.svelte';
  import PerformanceOverview from '../../../../components/pages/dashboard/PerformanceOverview.svelte';
  import StatusOverview from '../../../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../../../components/pages/dashboard/TopRight.svelte';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import EditChecker from '../../../../components/pages/dashboard/statusOverview/EditChecker.svelte';

  // let data = $state([]);
  // $effect(() => {
  //   http.post(endpoints.performanceOverview, { agent_id: isActive }).then(res => (data = res.data));
  // });
</script>

<section class="w-full max-w-422.75 m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start">
        <div class="flex justify-start items-center gap-4">
          <div
            class="flex justify-center items-center size-12 rounded-2xl bg-[#0D0D0D]/5 dark:bg-white/5">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 80 80">
              <path
                d="M0 0 C15.18 0 30.36 0 46 0 C46 20.46 46 40.92 46 62 C30.82 62 15.64 62 0 62 C0 41.54 0 21.08 0 0 Z M2 3 C1.90112208 4.74382535 1.87200968 6.49165543 1.87060547 8.23828125 C1.86745331 9.35614014 1.86430115 10.47399902 1.86105347 11.62573242 C1.8630777 12.84236572 1.86510193 14.05899902 1.8671875 15.3125 C1.86623077 16.55169189 1.86527405 17.79088379 1.86428833 19.06762695 C1.86360626 21.69388281 1.86496462 24.32004633 1.86962891 26.94628906 C1.87532619 30.31928714 1.87204698 33.69220565 1.86605644 37.06520081 C1.8615823 40.27263677 1.86471118 43.480063 1.8671875 46.6875 C1.86516327 47.9041333 1.86313904 49.1207666 1.86105347 50.37426758 C1.86420563 51.49212646 1.86735779 52.60998535 1.87060547 53.76171875 C1.87140106 54.75131592 1.87219666 55.74091309 1.87301636 56.76049805 C1.74899152 58.9709725 1.74899152 58.9709725 3 60 C5.9453557 60.10110353 8.8667756 60.13969279 11.8125 60.1328125 C12.69655518 60.13376923 13.58061035 60.13472595 14.49145508 60.13571167 C16.36442129 60.13639351 18.23738986 60.13453893 20.11035156 60.13037109 C22.98768388 60.12502289 25.86486008 60.13031593 28.7421875 60.13671875 C30.55729201 60.13605797 32.37239643 60.13477681 34.1875 60.1328125 C35.48747925 60.13584885 35.48747925 60.13584885 36.8137207 60.13894653 C40.72003219 60.51260414 40.72003219 60.51260414 44 59 C44.09887792 57.25617465 44.12799032 55.50834457 44.12939453 53.76171875 C44.13412277 52.08493042 44.13412277 52.08493042 44.13894653 50.37426758 C44.1369223 49.15763428 44.13489807 47.94100098 44.1328125 46.6875 C44.13376923 45.44830811 44.13472595 44.20911621 44.13571167 42.93237305 C44.13639374 40.30611719 44.13503538 37.67995367 44.13037109 35.05371094 C44.12467381 31.68071286 44.12795302 28.30779435 44.13394356 24.93479919 C44.1384177 21.72736323 44.13528882 18.519937 44.1328125 15.3125 C44.13483673 14.0958667 44.13686096 12.8792334 44.13894653 11.62573242 C44.13579437 10.50787354 44.13264221 9.39001465 44.12939453 8.23828125 C44.12859894 7.24868408 44.12780334 6.25908691 44.12698364 5.23950195 C44.25100848 3.0290275 44.25100848 3.0290275 43 2 C40.0546443 1.89889647 37.1332244 1.86030721 34.1875 1.8671875 C33.30344482 1.86623077 32.41938965 1.86527405 31.50854492 1.86428833 C29.63557871 1.86360649 27.76261014 1.86546107 25.88964844 1.86962891 C23.01231612 1.87497711 20.13513992 1.86968407 17.2578125 1.86328125 C15.44270799 1.86394203 13.62760357 1.86522319 11.8125 1.8671875 C10.51252075 1.86415115 10.51252075 1.86415115 9.1862793 1.86105347 C5.27996781 1.48739586 5.27996781 1.48739586 2 3 Z "
                fill="#99a1af"
                transform="translate(17,9)" />
              <path
                d="M0 0 C10.56 0 21.12 0 32 0 C32 8.58 32 17.16 32 26 C21.44 26 10.88 26 0 26 C0 17.42 0 8.84 0 0 Z M2 2 C2 3.98 2 5.96 2 8 C11.24 8 20.48 8 30 8 C30 6.02 30 4.04 30 2 C20.76 2 11.52 2 2 2 Z M2 10 C2 11.98 2 13.96 2 16 C11.24 16 20.48 16 30 16 C30 14.02 30 12.04 30 10 C20.76 10 11.52 10 2 10 Z M2 18 C2 19.98 2 21.96 2 24 C11.24 24 20.48 24 30 24 C30 22.02 30 20.04 30 18 C20.76 18 11.52 18 2 18 Z "
                fill="#99a1af"
                transform="translate(24,16)" />
              <path
                d="M0 0 C3 0.125 3 0.125 4 1.125 C4.125 4.125 4.125 4.125 4 7.125 C3 8.125 3 8.125 0 8.25 C-3 8.125 -3 8.125 -4 7.125 C-4.125 4.125 -4.125 4.125 -4 1.125 C-3 0.125 -3 0.125 0 0 Z M-1 3.125 C-1 3.785 -1 4.445 -1 5.125 C-0.34 5.125 0.32 5.125 1 5.125 C1 4.465 1 3.805 1 3.125 C0.34 3.125 -0.32 3.125 -1 3.125 Z "
                fill="#99a1af"
                transform="translate(40,51.875)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(24,63)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(24,59)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(24,55)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(24,51)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(24,47)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(49,36)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(49,28)" />
              <path
                d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                fill="#99a1af"
                transform="translate(49,20)" />
            </svg>
          </div>

          <span class="text-black dark:text-white text-xl">CheckerName</span>
        </div>

        <div class="flex justify-end items-center gap-2 text-sm text-[#99a1af]">
          <span class="flex justify-center items-center text-nowrap">Last Check :</span>
          <span class="flex justify-center items-center text-nowrap tracking-wider"
            >Jan 13th, 08:54:22</span>
        </div>
      </div>
      <div
        class=" w-full flex 2xl:flex-row flex-col-reverse gap-4 justify-between items-center text-white text-base">
        <Latency />
        <div
          class="relative w-full 2xl:w-[18%] gap-3 flex 2xl:flex-col justify-start items-start mb-auto">
          <div
            class="flex w-full flex-col justify-between items-center overflow-hidden text-base text-white border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl dark:bg-[#0D0D0D] bg-[#FFFFFF]">
            <span class="py-3 text-center w-full 2xl:text-sm text-[#99a1af] dark:text-white">
              https://darichetejarat.ir</span>
          </div>
          <div class="h-px w-full bg-[#0D0D0D]/5  dark:bg-white/5 hidden 2xl:block"></div>

          <div
            class="relative w-full flex justify-between items-center p-2 border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl dark:bg-[#0D0D0D] bg-[#FFFFFF]">
            <span class="flex justify-center items-center w-full text-base dark:text-white/20 text-[#99a1af] "
              >Ping</span>
            <span class="w-px h-7.5 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#0D0D0D]/5 dark:border-white/5"></span>
            <span
              class="w-full relative flex justify-center items-center text-base tracking-wider text-[#3b82f6]"
              >Http
            </span>
          </div>

          <div
            class="relative w-full flex justify-between items-center p-2 border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl dark:bg-[#0D0D0D] bg-[#FFFFFF]">
            <span class="flex justify-center items-center w-full text-base dark:text-white/20 text-[#99a1af] "
              >Uptime</span>
            <span class="w-px h-7.5 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#0D0D0D]/5 dark:border-white/5"></span>
            <span
              class="w-full relative flex justify-center items-center text-base tracking-wider text-[#F97316]"
              >50%
            </span>
          </div>

          <div
            class="relative w-full flex justify-between items-center p-2 border border-[#0D0D0D]/5 dark:border-white/5 rounded-xl dark:bg-[#0D0D0D] bg-[#FFFFFF]">
            <span class="flex justify-center items-center w-full text-base dark:text-white/20 text-[#99a1af] "
              >Status</span>
            <span class="w-px h-7.5 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#0D0D0D]/5 dark:border-white/5"></span>
            <span
              class="w-full relative flex justify-center items-center text-base tracking-wider text-[#F97316]"
              >Up
            </span>
          </div>

          <button
            onclick={() => {
              opener({
                id: `create-editCheckers`,
                content: EditChecker,
              });
            }}
            class="absolute right-0 -top-6 2xl:static ms-auto me-1 text-white/20 text-sm cursor-pointer hover:text-white/30">
            Edit
          </button>
        </div>
      </div>
    </div>

    <UptimeHistoryAll />
  </div>
</section>
