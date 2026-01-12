<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../stores/theme.svelte';
  const { title, value } = $props();

  let chart;
  let chartEl;
  function getColor(val) {
    if (val < 65) return '#22c55e';
    if (val <= 85) return '#F97316';
    return '#F87171';
  }

  let options = {
    chart: {
      type: 'radialBar',
      height: 100,
      fontFamily: 'IRANSans, sans-serif',
      width:100
    },

    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '60%',
        },
        track: {
          background: $theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(13, 13, 13, 0.2)',
        },
        dataLabels: {
          name: {
            fontSize: '10px',
            offsetY: 55,
            color: 'rgba(153, 161, 175, 0.8)',
          },
          value: {
            color: getColor(value),
            offsetY: -8,
            fontSize: '15px',
            formatter: val => `${val}%`,
          },
        },
      },
    },

    stroke: {
      dashArray: 5,
    },
  };

  onMount(() => {
    chart = new ApexCharts(chartEl, {
      ...options,
      labels: [title],
      fill: {
        type: 'gradient',
        colors: [getColor(value)],
      },
      series: [value],
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              radialBar: {
                dataLabels: {
                  value: {
                    color: getColor(value),
                    offsetY: -12,
                    fontSize: '15px',
                    formatter: val => `${val}%`,
                  },
                },
              },
            },
          },
        },
        {
          breakpoint: 1536,
          options: {
            chart: {
              height: 50,
            },
            plotOptions: {
              radialBar: {
                hollow: { size: '20%' },
                dataLabels: {
                  name: {
                    fontSize: '12px',
                    offsetY: 10,
                  },
                  value: {
                    fontSize: '18px',
                    offsetY: 50,
                  },
                },
              },
            },
          },
        },
      ],
    });
    chart.render();
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div  bind:this={chartEl}></div>
