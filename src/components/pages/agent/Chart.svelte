<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../../stores/theme.svelte';
  import { http } from '../../../services/http.svelte';
  import { endpoints } from '../../../endpoints.svelte';
  let { data, pointIndexHoverd = $bindable() } = $props();

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
      height: 380, // ✅ فقط این خط تغییر کرده
      type: 'area',
      zoom: { enabled: true },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      background: 'transparent',

      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true, // دکمه زوم
          zoomin: true, // دکمه بزرگ‌نمایی
          zoomout: true, // دکمه کوچک‌نمایی
          pan: true, // دکمه جابه‌جایی چارت
          reset: true, // دکمه بازگردانی به حالت اولیه
        },
        autoSelected: 'zoom', // حالت پیش‌فرض فعال روی زوم
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
        opacityFrom: 0.5,
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
        pointIndexHoverd = dataPointIndex + 1;
        return `<div class="hidden"></div>`;
      },
    },

    colors: ['#a855f7', '#3b82f6', '#10b981'],
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

  // ✅ این قسمت اضافه شد: وقتی data تغییر کنه، سری‌ها آپدیت بشه
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

  :global(.apexcharts-tooltip-title) {
    display: none;
  }
</style>
