<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../../stores/theme.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  let { data, pointIndexHoverd = $bindable(), isMouseInside = $bindable() } = $props();

  let chartEl;
  let chart;
  const height = innerWidth < 780 ? 180 : 380;

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const options = {
    chart: {
      height,
      type: 'area',
      zoom: { enabled: false },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      background: 'transparent',

      toolbar: {
        show: false,
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
      events: {
        mouseMove: (event, chartContext, config) => {
          if (!isMouseInside) {
            isMouseInside = true;
          }
        },
        mouseLeave: (event, chartContext, config) => {
          isMouseInside = false;
        },
      },
    },

    dataLabels: { enabled: false },

    stroke: {
      curve: 'smooth',
      width: 2,
    },

    fill: {
      type: 'gradient',
      colors: ['#a855f7', '#3b82f6', '#10b981'],
      gradient: {
        shade: '',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#a855f7', '#3b82f6', '#10b981'],
        opacityFrom: 0.4,
        opacityTo: 0.0,
        stops: [0, 90, 100],
      },
    },

    grid: {
      show: false,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },

    legend: { show: false },

    xaxis: {
      show: false,
      floating: true,
      type: 'numeric',
      tickAmount: 5,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      show: false,
      floating: true,
      min: 0,
      max: 100,
      labels: { formatter: val => Math.round(val) },
    },

    tooltip: {
      custom: function ({ dataPointIndex }) {
        pointIndexHoverd = dataPointIndex;
        return `<div></div>`;
      },
    },

    colors: ['#a855f7', '#3b82f6', '#10b981'],
  };

  $effect(() => {
    chart = new ApexCharts(chartEl, {
      ...options,
      series: data,
    });

    chart.render();
  });

  $effect(() => {
    if (chart && data) {
      chart.updateSeries(data, true);
    }
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div bind:this={chartEl} class="w-full mt-auto {$theme === 'dark' ? 'theme-dark' : 'theme-light'}">
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

  :global(.apexcharts-tooltip-title, .apexcharts-yaxis, .apexcharts-datalabels-group) {
    display: none;
  }

  :global(.apexcharts-tooltip.apexcharts-theme-light.apexcharts-active) {
    display: none;
  }
</style>
