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

<div class="w-full" bind:this={chartEl}></div>
