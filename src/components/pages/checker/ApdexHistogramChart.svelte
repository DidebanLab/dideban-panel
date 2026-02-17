<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';

  let chartEl;
  let chart;

  const { data: histogram } = $props();

  const data = histogram?.map(h => h?.count);
  const labels = histogram?.map(h =>
    h.range_end === -1 ? `${h?.range_start}ms+` : `${h?.range_start}ms _ ${h?.range_end}ms`,
  );
  const colors = ['#008236', '#00D492', '#FDC700', '#F97316', '#EF4444', '#C3110C'];
  onMount(() => {
    if (!histogram || !histogram?.length) return;
    const options = {
      series: [
        {
          data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      colors,
      plotOptions: {
        bar: {
          columnWidth: '100%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px', // 🔹 اندازه فونت را بزرگ‌تر کنید
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors,
            fontSize: '14px',
          },
        },
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
      },
    };

    chart = new ApexCharts(chartEl, options);
    chart.render();
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<div class="w-full" bind:this={chartEl}></div>
