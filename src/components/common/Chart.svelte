<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../stores/theme.svelte';
  const { data } = $props();

  let chartEl;
  let chart;

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const options = {
    chart: {
      height: 210, // ✅ فقط این خط تغییر کرده
      type: 'area',
      zoom: { enabled: false },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      background: 'transparent',
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          csv: { enabled: true, filename: 'machine-main-csv' },
          svg: { enabled: true, filename: 'machine-main-svg' },
          png: { enabled: true, filename: 'machine-main-png' },
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
      colors: ['#3b82f6', '#a855f7', '#10b981'],
      gradient: {
        shade: '',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#3b82f6', '#a855f7', '#10b981'],
        opacityFrom: 0.6,
        opacityTo: 0.1,
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
      enabled: true,
      shared: true,
      intersect: false,
      x: { format: 'dd/MM/yy HH:mm' },
      y: { formatter: val => (val ? `${val} %` : '-') },
    },

    colors: ['#3b82f6', '#a855f7', '#10b981'],
  };

  onMount(() => {
    chart = new ApexCharts(chartEl, {
      ...options,
      series: data,
      annotations: {
        points: data.flatMap((series, seriesIndex) =>
          series.data
            .map((y, pointIndex) => {
              if (y < 70) return null;

              const baseColor = options.colors[seriesIndex];
              const opacity = y >= 80 ? 1 : 0.5;

              return {
                x: pointIndex + 1,
                y,
                seriesIndex,
                marker: {
                  size: 3,
                  fillColor: hexToRgba(baseColor, opacity),
                  strokeWidth: 7,
                  strokeColor: hexToRgba(baseColor, opacity * 0.5),
                },
              };
            })
            .filter(Boolean),
        ),
      },
    });

    chart.render();
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

  :global(.apexcharts-tooltip-title) {
    display: none;
  }
</style>