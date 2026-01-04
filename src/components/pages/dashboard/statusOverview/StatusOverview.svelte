<script>
  const { title, subtitle, data } = $props();
</script>

<div
  class="w-full relative rounded-[14px] bg-[#FFFFFF] dark:bg-[#0D0D0D] border border-[#0D0D0D]/5 dark:border-white/5">
  <div
    class="sticky top-0 p-6 border-b border-[#0D0D0D]/5 dark:border-[#222222] bg-[#FFFFFF] dark:bg-[#0D0D0D] w-full flex justify-between items-start">
    <div class="flex flex-col gap-1">
      <span class="text-xl dark:text-white capitalize">{title}</span>
      <span class="text-sm text-[#99a1af] capitalize">{subtitle}</span>
    </div>
    <div
      class="w-12 h-10 flex justify-center items-center bg-[#22c55e]/10 rounded-lg text-xl text-[#10b981] cursor-pointer">
      +
    </div>
  </div>

  <div class="w-full grid grid-cols-1 gap-6 overflow-y-auto custom-scroll max-h-156 p-6">
    {#each data as item (item.id)}
      <div class="w-full flex flex-col gap-4 justify-center items-start">
        <h3 class="text-white text-lg capitalize">{item.agent_id}</h3>
        <div class="w-full grid grid-cols-3 gap-6">
          <div
            class="border rounded-[14px] flex flex-col py-6 gap-7
             {item.cpu[item.cpu.length - 1].usage_percent < 60
              ? 'border-[#0D0D0D]/5 dark:border-white/5 bg-[#F9FAFB] dark:bg-[#121212]'
              : item.cpu[item.cpu.length - 1].usage_percent < 80
                ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F97316]/5'
                : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div
                class="flex justify-center items-center size-12 rounded-2xl {item.cpu[
                  item.cpu.length - 1
                ].usage_percent < 60
                  ? 'bg-[#00d492]/10'
                  : item.cpu[item.cpu.length - 1].usage_percent < 80
                    ? 'bg-[#F97316]/10'
                    : 'bg-[#EF4444]/10'}">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.6797 11.6797V3.32031H3.32031V11.6797H11.6797ZM15 6.67969H13.3203V8.32031H15V10H13.3203V11.6797C13.3203 12.1224 13.151 12.513 12.8125 12.8516C12.5 13.1641 12.1224 13.3203 11.6797 13.3203H10V15H8.32031V13.3203H6.67969V15H5V13.3203H3.32031C2.8776 13.3203 2.48698 13.1641 2.14844 12.8516C1.83594 12.513 1.67969 12.1224 1.67969 11.6797V10H0V8.32031H1.67969V6.67969H0V5H1.67969V3.32031C1.67969 2.8776 1.83594 2.5 2.14844 2.1875C2.48698 1.84896 2.8776 1.67969 3.32031 1.67969H5V0H6.67969V1.67969H8.32031V0H10V1.67969H11.6797C12.1224 1.67969 12.5 1.84896 12.8125 2.1875C13.151 2.5 13.3203 2.8776 13.3203 3.32031V5H15V6.67969ZM8.32031 8.32031V6.67969H6.67969V8.32031H8.32031ZM10 5V10H5V5H10Z"
                    fill={item.cpu[item.cpu.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.cpu[item.cpu.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'} />
                </svg>
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">CPU</span>
                <span class="text-xs text-[#99a1af]">Latency: {item.collect_duration_ms} ms</span>
              </div>
              <div
                style="box-shadow: 0 0 10px 1px {item.cpu[item.cpu.length - 1].usage_percent < 60
                  ? '#00d492'
                  : item.cpu[item.cpu.length - 1].usage_percent < 80
                    ? '#f97316'
                    : '#ef4444'};"
                class="size-2.5 rounded-full ms-auto mb-auto mt-2 {item.cpu[item.cpu.length - 1]
                  .usage_percent < 60
                  ? 'bg-[#00d492]'
                  : item.cpu[item.cpu.length - 1].usage_percent < 80
                    ? 'bg-[#f97316]'
                    : 'bg-[#ef4444]'}">
              </div>
            </div>
            <div class="w-full flex gap-1 justify-center items-start">
              {#each item.cpu.slice(-50) as detail}
                <div
                  class="size-1.25 rounded-[1px] {detail.usage_percent
                    ? detail.usage_percent < 65
                      ? 'bg-green-700'
                      : detail.usage_percent < 85
                        ? 'bg-[#F97316]'
                        : 'bg-[#EF4444]'
                    : 'bg-[#FFFFFF]/5'}">
                </div>
              {/each}
            </div>
          </div>
          <div
            class="border rounded-[14px] flex flex-col py-6 gap-7
            {item.memory[item.memory.length - 1].usage_percent < 60
              ? 'border-[#0D0D0D]/5 dark:border-white/5 bg-[#F9FAFB] dark:bg-[#121212]'
              : item.memory[item.memory.length - 1].usage_percent < 80
                ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F97316]/5'
                : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div
                class="flex justify-center items-center size-12 rounded-2xl {item.memory[
                  item.memory.length - 1
                ].usage_percent < 60
                  ? 'bg-[#00d492]/10'
                  : item.memory[item.memory.length - 1].usage_percent < 80
                    ? 'bg-[#F97316]/10'
                    : 'bg-[#EF4444]/10'}">
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 20 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.64844 10.9922C4.98698 11.3307 5.3776 11.5 5.82031 11.5C6.26302 11.5 6.65365 11.3307 6.99219 10.9922C7.33073 10.6536 7.5 10.263 7.5 9.82031C7.5 9.3776 7.33073 9 6.99219 8.6875C6.65365 8.34896 6.26302 8.17969 5.82031 8.17969C5.3776 8.17969 4.98698 8.34896 4.64844 8.6875C4.33594 9 4.17969 9.3776 4.17969 9.82031C4.17969 10.263 4.33594 10.6536 4.64844 10.9922ZM16.6797 6.5C16.9141 6.5 17.1094 6.57812 17.2656 6.73438C17.4219 6.89062 17.5 7.08594 17.5 7.32031V12.3203C17.5 12.5547 17.4219 12.763 17.2656 12.9453C17.1094 13.1016 16.9141 13.1797 16.6797 13.1797H3.32031C3.08594 13.1797 2.89062 13.1016 2.73438 12.9453C2.57812 12.763 2.5 12.5547 2.5 12.3203V7.32031C2.5 7.08594 2.57812 6.89062 2.73438 6.73438C2.89062 6.57812 3.08594 6.5 3.32031 6.5H16.6797ZM4.64844 19.3516C4.98698 19.6641 5.3776 19.8203 5.82031 19.8203C6.26302 19.8203 6.65365 19.6641 6.99219 19.3516C7.33073 19.013 7.5 18.6224 7.5 18.1797C7.5 17.737 7.33073 17.3464 6.99219 17.0078C6.65365 16.6693 6.26302 16.5 5.82031 16.5C5.3776 16.5 4.98698 16.6693 4.64844 17.0078C4.33594 17.3464 4.17969 17.737 4.17969 18.1797C4.17969 18.6224 4.33594 19.013 4.64844 19.3516ZM16.6797 14.8203C16.9141 14.8203 17.1094 14.9115 17.2656 15.0938C17.4219 15.25 17.5 15.4453 17.5 15.6797V20.6797C17.5 20.9141 17.4219 21.1094 17.2656 21.2656C17.1094 21.4219 16.9141 21.5 16.6797 21.5H3.32031C3.08594 21.5 2.89062 21.4219 2.73438 21.2656C2.57812 21.1094 2.5 20.9141 2.5 20.6797V15.6797C2.5 15.4453 2.57812 15.25 2.73438 15.0938C2.89062 14.9115 3.08594 14.8203 3.32031 14.8203H16.6797Z"
                    fill={item.memory[item.memory.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.memory[item.memory.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'} />
                </svg>
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">MEMORY</span>
                <span class="text-xs text-[#99a1af]">Latency: {item.collect_duration_ms} ms</span>
              </div>
              <div
                style="box-shadow: 0 0 8px 0.5px {item.memory[item.memory.length - 1]
                  .usage_percent < 60
                  ? '#00d492'
                  : item.memory[item.memory.length - 1].usage_percent < 80
                    ? '#f97316'
                    : '#ef4444'}"
                class="size-2.5 rounded-full ms-auto mb-auto mt-2 {item.memory[
                  item.memory.length - 1
                ].usage_percent < 60
                  ? 'bg-[#00d492]'
                  : item.memory[item.memory.length - 1].usage_percent < 80
                    ? 'bg-[#f97316]'
                    : 'bg-[#ef4444]'}">
              </div>
            </div>
            <div class="w-full flex gap-1 justify-center items-start">
              {#each item.memory.slice(-50) as detail}
                <div
                  class="size-1.25 rounded-[1px] {detail.usage_percent
                    ? detail.usage_percent < 65
                      ? 'bg-green-700'
                      : detail.usage_percent < 85
                        ? 'bg-[#F97316]'
                        : 'bg-[#EF4444]'
                    : 'bg-[#FFFFFF]/5'}">
                </div>
              {/each}
            </div>
          </div>
          <div
            class="border rounded-[14px] flex flex-col py-6 gap-7
            {item.disk[item.disk.length - 1].usage_percent < 60
              ? 'border-[#0D0D0D]/5 dark:border-white/5 bg-[#F9FAFB] dark:bg-[#121212]'
              : item.disk[item.disk.length - 1].usage_percent < 80
                ? 'border-[#0D0D0D]/5 dark:border-[#F97316]/15 bg-[#F9FAFB] dark:bg-[#F97316]/5'
                : 'bg-[#EF4444]/5 border-[#EF4444]/15'}">
            <div class="flex justify-start items-center px-4.25 gap-4">
              <div
                class="flex justify-center items-center size-12 rounded-2xl {item.disk[
                  item.disk.length - 1
                ].usage_percent < 60
                  ? 'bg-[#00d492]/10'
                  : item.disk[item.disk.length - 1].usage_percent < 80
                    ? 'bg-[#F97316]/10'
                    : 'bg-[#EF4444]/10'}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 80 80">
                  <path
                    d="M0 0 C7.27363642 5.18041951 13.38523045 11.95089541 15 21 C15.80514858 32.95843622 15.20180936 42.20675407 7.3125 51.8125 C0.84781999 58.63968543 -6.17674344 62.0363516 -15.53295898 62.29296875 C-26.87993194 62.39890385 -34.5696962 60.22382749 -43.01953125 52.22265625 C-50.84579928 43.43932981 -51.70102447 34.23967387 -51.17041016 22.93994141 C-50.41145414 14.30002093 -45.30627922 7.61912753 -39 2 C-27.90432514 -5.63397006 -11.777235 -7.28383001 0 0 Z M-27 0 C-27 0.66 -27 1.32 -27 2 C-27.58007812 1.7834375 -28.16015625 1.566875 -28.7578125 1.34375 C-31.01783483 0.77584346 -31.01783483 0.77584346 -32.9296875 1.96875 C-41.60600733 8.51592112 -41.60600733 8.51592112 -46 18 C-45.67 18.66 -45.34 19.32 -45 20 C-45.66 20 -46.32 20 -47 20 C-48.50156874 23.00313748 -48.09281204 25.79067522 -48.0625 29.125 C-48.05347656 30.40632813 -48.04445313 31.68765625 -48.03515625 33.0078125 C-48.02355469 33.99523438 -48.01195312 34.98265625 -48 36 C-47.01 36 -46.02 36 -45 36 C-45 36.66 -45 37.32 -45 38 C-45.99 38.495 -45.99 38.495 -47 39 C-46.01 40.98 -45.02 42.96 -44 45 C-43.34 45 -42.68 45 -42 45 C-42 45.99 -42 46.98 -42 48 C-41.01 48 -40.02 48 -39 48 C-39 48.99 -39 49.98 -39 51 C-38.01 51 -37.02 51 -36 51 C-36 51.99 -36 52.98 -36 54 C-35.01 54 -34.02 54 -33 54 C-33 54.66 -33 55.32 -33 56 C-30.42786866 57.61949011 -29.32330841 58.04408751 -26.25 57.625 C-25.5075 57.41875 -24.765 57.2125 -24 57 C-24 57.66 -24 58.32 -24 59 C-22.68 59 -21.36 59 -20 59 C-20 58.34 -20 57.68 -20 57 C-19.34 57 -18.68 57 -18 57 C-18 57.66 -18 58.32 -18 59 C-16.68 59 -15.36 59 -14 59 C-14 58.34 -14 57.68 -14 57 C-13.34 57 -12.68 57 -12 57 C-11.67 57.66 -11.34 58.32 -11 59 C-9.02 58.34 -7.04 57.68 -5 57 C-5 56.01 -5 55.02 -5 54 C-4.01 54.33 -3.02 54.66 -2 55 C-0.68 53.68 0.64 52.36 2 51 C0.04761147 48.99387601 -1.91137822 46.99507567 -3.875 45 C-4.70837891 44.14148437 -4.70837891 44.14148437 -5.55859375 43.265625 C-7.00134404 41.80549218 -8.4974374 40.39850702 -10 39 C-10.66 39 -11.32 39 -12 39 C-12 39.66 -12 40.32 -12 41 C-15.125 40.47916667 -18.25 39.95833333 -21.375 39.4375 C-22.24125 39.293125 -23.1075 39.14875 -24 39 C-24 39.66 -24 40.32 -24 41 C-24.66 41 -25.32 41 -26 41 C-25.67 40.01 -25.34 39.02 -25 38 C-25.66 37.67 -26.32 37.34 -27 37 C-27.99 37.495 -27.99 37.495 -29 38 C-28.82984375 37.44183594 -28.6596875 36.88367187 -28.484375 36.30859375 C-27.95009931 33.76216686 -28.07439494 31.65267465 -28.25 29.0625 C-28.29641411 25.12310246 -28.21951947 24.29269263 -25.75 21 C-23 19 -23 19 -19 17 C-19 11.06 -19 5.12 -19 -1 C-24.47825081 -1.4472136 -24.47825081 -1.4472136 -27 0 Z M-17 -1 C-17 5.27 -17 11.54 -17 18 C-14.69 18.99 -12.38 19.98 -10 21 C-7.54252026 24.68621962 -8.09701657 25.66704578 -8.625 29.9375 C-8.75828466 34.49993641 -8.27379724 37.09817321 -5.3359375 40.5234375 C-2.39751369 43.55686298 0.74533144 46.31199249 4 49 C10.483913 42.79199819 12.15226967 37.88562483 12.4375 29.0625 C12.17312146 18.74072105 8.37235389 12.08324197 1 5 C-4.96088558 0.3772724 -9.44598681 -1 -17 -1 Z M-24.5 22.5 C-26.62153384 26.03588973 -26.791013 28.97901723 -26 33 C-24.66666667 35.66666667 -24.66666667 35.66666667 -22 37 C-17.97901723 37.791013 -15.03588973 37.62153384 -11.5 35.5 C-9.37846616 31.96411027 -9.208987 29.02098277 -10 25 C-11.33333333 22.33333333 -11.33333333 22.33333333 -14 21 C-18.02098277 20.208987 -20.96411027 20.37846616 -24.5 22.5 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(58,11)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(47,65)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(41,65)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,65)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,65)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(56,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(50,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(44,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(38,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(32,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,62)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(53,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(47,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(41,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,59)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(50,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(44,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(38,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(32,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,56)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(47,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(41,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,53)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,50)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,50)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(14,50)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,47)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,47)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,44)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,44)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(14,44)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,41)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,41)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(11,41)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,38)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,38)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(14,38)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,35)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,35)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(11,35)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,32)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,32)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(14,32)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,29)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,29)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,29)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(32,26)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,26)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,26)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(14,26)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,23)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,23)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,23)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(17,23)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(32,20)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,20)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(20,20)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,17)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(29,17)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(23,17)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(32,14)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(26,14)" />
                  <path
                    d="M0 0 C0.66 0 1.32 0 2 0 C2 0.66 2 1.32 2 2 C1.34 2 0.68 2 0 2 C0 1.34 0 0.68 0 0 Z "
                    fill={item.disk[item.disk.length - 1].usage_percent < 60
                      ? '#00d492'
                      : item.disk[item.disk.length - 1].usage_percent < 80
                        ? '#f97316'
                        : '#ef4444'}
                    transform="translate(35,11)" />
                </svg>
              </div>

              <div class="flex flex-col justify-center items-start gap-1">
                <span class="text-lg dark:text-white">DISK</span>
                <span class="text-xs text-[#99a1af]">Latency: {item.collect_duration_ms} ms</span>
              </div>
              <div
                style="box-shadow: 0 0 8px 0.5px {item.disk[item.disk.length - 1].usage_percent < 60
                  ? '#00d492'
                  : item.disk[item.disk.length - 1].usage_percent < 80
                    ? '#f97316'
                    : '#ef4444'}"
                class="size-2.5 rounded-full ms-auto mb-auto mt-2 {item.disk[item.disk.length - 1]
                  .usage_percent < 60
                  ? 'bg-[#00d492]'
                  : item.disk[item.disk.length - 1].usage_percent < 80
                    ? 'bg-[#f97316]'
                    : 'bg-[#ef4444]'}">
              </div>
            </div>
            <div class="w-full flex gap-1 justify-center items-start">
              {#each item.disk.slice(-50) as detail}
                <div
                  class="size-1.25 rounded-[1px] {detail.usage_percent
                    ? detail.usage_percent < 65
                      ? 'bg-green-700'
                      : detail.usage_percent < 85
                        ? 'bg-[#F97316]'
                        : 'bg-[#EF4444]'
                    : 'bg-[#FFFFFF]/5'}">
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
