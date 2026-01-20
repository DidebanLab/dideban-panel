<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../stores/theme.svelte';

  const { data, name, height, unit } = $props();

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
        formatter: val => `${val} ${unit}`,
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
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
        y: {
          formatter: val => `${val} ${unit}`,
          title: {
            formatter: () => `${name} :`,
          },
        },
      },

      xaxis: {
        show: false,
        axisBorder: { show: false },
        axisTicks: { show: false },
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

<div bind:this={chartEl} class="w-full {$theme === 'dark' ? 'theme-dark' : 'theme-light'}"></div>

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
