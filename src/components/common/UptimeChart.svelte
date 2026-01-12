<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';

  const { data, name, height } = $props();

  let chartEl;
  let chart;

  onMount(() => {
    const options = {
      chart: {
        type: 'area',
        height,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },

      grid: {
        show: false,
      },

      dataLabels: {
        enabled: true,
        formatter: val => `${val} ms`,
        offsetY: -10,
        style: {
          fontSize: '10px',
          fontWeight: '600',
          colors: ['#0088ee'],
        },
        background: {
          enabled: false,
        },
      },

      stroke: {
        width: 1,
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
        },
      },

      xaxis: {
        show: false,
        axisBorder: { show: false },
        axisTicks: { show: false },
        floating: true, // این خط اضافه شد
        labels: {
          show: false,
        },
      },

      yaxis: {
        show: false,
      },

      legend: {
        show: false,
      },
    };

    chart = new ApexCharts(chartEl, {
      ...options,
      series: [
        {
          name,
          data,
        },
      ],
    });
    chart.render();
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div
  class="w-full h-auto p-3 pb-1.5 rounded-[14px] dark:bg-[#0D0D0D] bg-[#FFFFFF] border border-[#0D0D0D]/5 dark:border-white/5">
  <div class="flex justify-between items-start px-3 pt-2">
    <div class="w-full flex flex-col justify-start items-start">
      <span class="text-xl dark:text-white">Latency</span>
      <span class="text-sm text-[#99a1af]">Real-time Latency Metrics</span>
    </div>
    <span
      class={`flex justify-center items-start text-xl text-nowrap ${
        data[data.length - 1] < 1500
          ? 'text-[#22c55e]'
          : data[data.length - 1] < 3000
            ? 'text-[#F97316]'
            : 'text-[#ef4444]'
      }`}>{data[data.length - 1]} ms</span>
  </div>

  <div class="w-full" bind:this={chartEl}></div>
</div>
