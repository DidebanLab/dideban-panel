<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../stores/theme.svelte';

  const { data, name, height, unit } = $props();

  let chartEl;
  let chart;
  const seriesData =
    data?.map(([timestamp, value]) => ({
      x: new Date(timestamp),
      y: value,
    })) || [];

  onMount(() => {
    const options = {
      chart: {
        type: 'area',
        height,
        toolbar: {
          show: true,
          tools: {
            download: false,
            selection: true,
            zoom: true, 
            zoomin: true,
            zoomout: true, 
            pan: true, 
            reset: true, 
          },
          autoSelected: 'zoom', 
        },
      },

      grid: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },

      stroke: {
        width: 0.2,
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.1,
          opacityFrom: 1,
          opacityTo: 0.1,
        },
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const value = series[seriesIndex][dataPointIndex];
          const timestamp = w.globals.seriesX[seriesIndex][dataPointIndex];

          const date = new Date(timestamp).toLocaleString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });

          return `
      <div class="px-3 py-2">
        <div class="flex justify-start items-center gap-2">
          <span class="size-2 rounded-full bg-[#3b82f6]"></span>
          ${name} : ${value}${unit}
        </div>

        <div class="w-full h-px bg-white/20 my-1.5"></div>
        <div class="text-xs text-white/30 tracking-wide">${date}</div>
        
      </div>
    `;
        },
      },
      xaxis: {
        tooltip: {
          enabled: false,
        },
        type: 'datetime',
        labels: {
          show: true,
          datetimeUTC: false,
          style: {
            colors:  'rgba(250,250,250,0.2)',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true,
          color: 'rgba(250,250,250,0.2)',
          height: 0.5,
        },
        axisTicks: {
          show: true,
          color: 'rgba(250,250,250,0.1)',
          height: 7,
          offsetY: 2,
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
          data: seriesData,
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
  bind:this={chartEl}
  class="w-full scale-[106.5%] scale-y-128 sm:scale-y-128 md:scale-y-110 sm:scale-x-105 md:scale-x-103 lg:scale-x-102 3xl:scale-101 {$theme ===
  'dark'
    ? 'theme-dark'
    : 'theme-light'}">
</div>

<style>
  :global(.theme-dark .apexcharts-tooltip) {
    background: rgba(0, 0, 0, 0.4) !important;
    color: #ffffff !important;
    border-color: #ffffff33 !important;
  }

  :global(.theme-dark .apexcharts-tooltip-text) {
    color: #ffffff !important;
  }

  :global(.theme-light .apexcharts-tooltip) {
    background: #ffffff !important;
    color: #111827 !important;
    border-color: #e5e7eb !important;
  }

  :global(.theme-light .apexcharts-tooltip-text) {
    color: #111827 !important;
  }

  :global(.apexcharts-tooltip) {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
    border-radius: 12px !important;
    padding: 6px 2px !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    line-height: 1.2 !important;
  }

  :global(.apexcharts-tooltip-title) {
    display: none;
  }
</style>
