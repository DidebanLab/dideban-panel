<script>
  import { onMount, onDestroy } from 'svelte';
  import ApexCharts from 'apexcharts';
  import { theme } from '../../stores/theme.svelte';
  const { title, value, chartColor } = $props();

  let chart;
  let chartEl;

  let options = {
    chart: {
      type: 'radialBar',
      height: 100,
      fontFamily: 'IRANSans, sans-serif',
      width: 100,
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
            color: chartColor,
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
        colors: [chartColor],
      },
      series: [value],
      responsive: [
        {
          breakpoint: 375,
          options: {
            plotOptions: {
              radialBar: {
                dataLabels: {
                  value: {
                    color: chartColor,
                    offsetY: -12,
                    fontSize: '13px',
                    formatter: val => `${val}%`,
                  },
                },
              },
            },
          },
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              radialBar: {
                dataLabels: {
                  value: {
                    color: chartColor,
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
              height: 100,
            },
            plotOptions: {
              radialBar: {
                hollow: { size: '60%' },
                dataLabels: {
                  name: {
                    fontSize: '10px',
                    offsetY: 50,
                  },
                  value: {
                    fontSize: '15px',
                    offsetY: -10,
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

<div bind:this={chartEl}></div>
