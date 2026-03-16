<script>
  import { endpoints } from './../../../../endpoints.svelte.js';
  import Latency from '../../../../components/common/Latency.svelte';
  import { opener } from '../../../../stores/modal.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { http } from '../../../../services/http.svelte';
  import responseTimeColor from '../../../../utils/responseTimeColor.js';
  import { alertStore } from '../../../../stores/alert.svelte.js';
  import { goto } from '$app/navigation';
  import { LIMITATIONS } from '../../../../components/config.svelte.js';
  import Chart from '../../../../components/pages/agent/Chart.svelte';
  import ConfirmEditAgent from '../../../../components/pages/agent/ConfirmEditAgent.svelte';
  import DeleteAgent from '../../../../components/pages/agent/DeleteAgent.svelte';
  import EditAgent from '../../../../components/pages/agent/EditAgent.svelte';

  const REQUIRED_COUNT = $state(innerWidth < 640 ? 31 : 96);
  let hours = $state(24);
  const id = $page.params.agent;
  let data = $state();
  let chart = $state();
  let pointIndexHoverd = $state();
  let metricPointDetail = $state();
  let isMouseInside = $state(false);

  let enabled = $state();
  let date = $state(null);
  let history = $state();
  let missingCount = $derived(Math.max(0, REQUIRED_COUNT - (history?.data?.length ?? 0)));
  let historyDetail = $state();
  let collectDuration = $state();
  let summary = $state();
  let summaryWithDate = $state({
    date: '2026-02-04',
    overall: {
      total_collects: 2880,
      uptime_percent: 94,
      avg_collect_duration_ms: 285,
      rate: 'Good',
      min_collect_duration_ms: 0,
      max_collect_duration_ms: 549,
    },
    collect_duration_series: [
      {
        start_time: '00:00:00',
        end_time: '01:00:00',
        collects: 120,
        uptime_percent: 96,
        avg_collect_duration_ms: 273,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 542,
      },
      {
        start_time: '01:00:00',
        end_time: '02:00:00',
        collects: 120,
        uptime_percent: 91,
        avg_collect_duration_ms: 279,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 541,
      },
      {
        start_time: '02:00:00',
        end_time: '03:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 282,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 543,
      },
      {
        start_time: '03:00:00',
        end_time: '04:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 281,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 545,
      },
      {
        start_time: '04:00:00',
        end_time: '05:00:00',
        collects: 120,
        uptime_percent: 90,
        avg_collect_duration_ms: 283,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 545,
      },
      {
        start_time: '05:00:00',
        end_time: '06:00:00',
        collects: 120,
        uptime_percent: 93,
        avg_collect_duration_ms: 277,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 546,
      },
      {
        start_time: '06:00:00',
        end_time: '07:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 277,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 536,
      },
      {
        start_time: '07:00:00',
        end_time: '08:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 286,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 549,
      },
      {
        start_time: '08:00:00',
        end_time: '09:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 289,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 549,
      },
      {
        start_time: '09:00:00',
        end_time: '10:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 279,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 543,
      },
      {
        start_time: '10:00:00',
        end_time: '11:00:00',
        collects: 120,
        uptime_percent: 96,
        avg_collect_duration_ms: 290,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 545,
      },
      {
        start_time: '11:00:00',
        end_time: '12:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 301,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 546,
      },
      {
        start_time: '12:00:00',
        end_time: '13:00:00',
        collects: 120,
        uptime_percent: 96,
        avg_collect_duration_ms: 277,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 545,
      },
      {
        start_time: '13:00:00',
        end_time: '14:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 275,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 548,
      },
      {
        start_time: '14:00:00',
        end_time: '15:00:00',
        collects: 120,
        uptime_percent: 97,
        avg_collect_duration_ms: 287,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 546,
      },
      {
        start_time: '15:00:00',
        end_time: '16:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 288,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 538,
      },
      {
        start_time: '16:00:00',
        end_time: '17:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 313,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 542,
      },
      {
        start_time: '17:00:00',
        end_time: '18:00:00',
        collects: 120,
        uptime_percent: 90,
        avg_collect_duration_ms: 267,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 546,
      },
      {
        start_time: '18:00:00',
        end_time: '19:00:00',
        collects: 120,
        uptime_percent: 96,
        avg_collect_duration_ms: 290,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 546,
      },
      {
        start_time: '19:00:00',
        end_time: '20:00:00',
        collects: 120,
        uptime_percent: 97,
        avg_collect_duration_ms: 308,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 549,
      },
      {
        start_time: '20:00:00',
        end_time: '21:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 289,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 549,
      },
      {
        start_time: '21:00:00',
        end_time: '22:00:00',
        collects: 120,
        uptime_percent: 94,
        avg_collect_duration_ms: 285,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 538,
      },
      {
        start_time: '22:00:00',
        end_time: '23:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 282,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 542,
      },
      {
        start_time: '23:00:00',
        end_time: '00:00:00',
        collects: 120,
        uptime_percent: 95,
        avg_collect_duration_ms: 290,
        rate: 'Good',
        min_collect_duration_ms: 0,
        max_collect_duration_ms: 547,
      },
    ],
    uptime_series: [
      {
        start_time: '00:00:00',
        end_time: '01:00:00',
        collect_count: 120,
        uptime_percent: 96,
        avg_cpu_usage: 33,
        avg_memory_usage: 48,
        avg_disk_usage: 39,
        avg_collect_duration_ms: 273,
      },
      {
        start_time: '01:00:00',
        end_time: '02:00:00',
        collect_count: 120,
        uptime_percent: 91,
        avg_cpu_usage: 32,
        avg_memory_usage: 44,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 279,
      },
      {
        start_time: '02:00:00',
        end_time: '03:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 34,
        avg_memory_usage: 45,
        avg_disk_usage: 40,
        avg_collect_duration_ms: 282,
      },
      {
        start_time: '03:00:00',
        end_time: '04:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 33,
        avg_memory_usage: 47,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 281,
      },
      {
        start_time: '04:00:00',
        end_time: '05:00:00',
        collect_count: 120,
        uptime_percent: 90,
        avg_cpu_usage: 34,
        avg_memory_usage: 44,
        avg_disk_usage: 37,
        avg_collect_duration_ms: 283,
      },
      {
        start_time: '05:00:00',
        end_time: '06:00:00',
        collect_count: 120,
        uptime_percent: 93,
        avg_cpu_usage: 33,
        avg_memory_usage: 45,
        avg_disk_usage: 38,
        avg_collect_duration_ms: 277,
      },
      {
        start_time: '06:00:00',
        end_time: '07:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 32,
        avg_memory_usage: 49,
        avg_disk_usage: 34,
        avg_collect_duration_ms: 277,
      },
      {
        start_time: '07:00:00',
        end_time: '08:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 31,
        avg_memory_usage: 46,
        avg_disk_usage: 35,
        avg_collect_duration_ms: 286,
      },
      {
        start_time: '08:00:00',
        end_time: '09:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 35,
        avg_memory_usage: 43,
        avg_disk_usage: 41,
        avg_collect_duration_ms: 289,
      },
      {
        start_time: '09:00:00',
        end_time: '10:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 36,
        avg_memory_usage: 45,
        avg_disk_usage: 37,
        avg_collect_duration_ms: 279,
      },
      {
        start_time: '10:00:00',
        end_time: '11:00:00',
        collect_count: 120,
        uptime_percent: 96,
        avg_cpu_usage: 33,
        avg_memory_usage: 48,
        avg_disk_usage: 40,
        avg_collect_duration_ms: 290,
      },
      {
        start_time: '11:00:00',
        end_time: '12:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 34,
        avg_memory_usage: 44,
        avg_disk_usage: 37,
        avg_collect_duration_ms: 301,
      },
      {
        start_time: '12:00:00',
        end_time: '13:00:00',
        collect_count: 120,
        uptime_percent: 96,
        avg_cpu_usage: 33,
        avg_memory_usage: 47,
        avg_disk_usage: 40,
        avg_collect_duration_ms: 277,
      },
      {
        start_time: '13:00:00',
        end_time: '14:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 35,
        avg_memory_usage: 46,
        avg_disk_usage: 40,
        avg_collect_duration_ms: 275,
      },
      {
        start_time: '14:00:00',
        end_time: '15:00:00',
        collect_count: 120,
        uptime_percent: 97,
        avg_cpu_usage: 31,
        avg_memory_usage: 50,
        avg_disk_usage: 37,
        avg_collect_duration_ms: 287,
      },
      {
        start_time: '15:00:00',
        end_time: '16:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 32,
        avg_memory_usage: 44,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 288,
      },
      {
        start_time: '16:00:00',
        end_time: '17:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 35,
        avg_memory_usage: 48,
        avg_disk_usage: 39,
        avg_collect_duration_ms: 313,
      },
      {
        start_time: '17:00:00',
        end_time: '18:00:00',
        collect_count: 120,
        uptime_percent: 90,
        avg_cpu_usage: 32,
        avg_memory_usage: 44,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 267,
      },
      {
        start_time: '18:00:00',
        end_time: '19:00:00',
        collect_count: 120,
        uptime_percent: 96,
        avg_cpu_usage: 33,
        avg_memory_usage: 48,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 290,
      },
      {
        start_time: '19:00:00',
        end_time: '20:00:00',
        collect_count: 120,
        uptime_percent: 97,
        avg_cpu_usage: 38,
        avg_memory_usage: 49,
        avg_disk_usage: 41,
        avg_collect_duration_ms: 308,
      },
      {
        start_time: '20:00:00',
        end_time: '21:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 35,
        avg_memory_usage: 44,
        avg_disk_usage: 37,
        avg_collect_duration_ms: 289,
      },
      {
        start_time: '21:00:00',
        end_time: '22:00:00',
        collect_count: 120,
        uptime_percent: 94,
        avg_cpu_usage: 33,
        avg_memory_usage: 44,
        avg_disk_usage: 36,
        avg_collect_duration_ms: 285,
      },
      {
        start_time: '22:00:00',
        end_time: '23:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 35,
        avg_memory_usage: 45,
        avg_disk_usage: 38,
        avg_collect_duration_ms: 282,
      },
      {
        start_time: '23:00:00',
        end_time: '00:00:00',
        collect_count: 120,
        uptime_percent: 95,
        avg_cpu_usage: 33,
        avg_memory_usage: 48,
        avg_disk_usage: 38,
        avg_collect_duration_ms: 290,
      },
    ],
    chart_series: [
      {
        id: 142366,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 436,
        cpu_load_1: 3.32,
        cpu_load_5: 2.5,
        cpu_load_15: 1.98,
        cpu_usage_percent: 58,
        memory_total_mb: 10240,
        memory_used_mb: 3584,
        memory_available_mb: 6656,
        memory_usage_percent: 35,
        disk_total_gb: 1200,
        disk_used_gb: 588,
        disk_usage_percent: 49,
        collected_at: '2026-02-04T00:00:11.9318181+03:30',
      },
      {
        id: 142426,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 201,
        cpu_load_1: 3.33,
        cpu_load_5: 2.76,
        cpu_load_15: 2,
        cpu_usage_percent: 32,
        memory_total_mb: 14336,
        memory_used_mb: 8314,
        memory_available_mb: 6022,
        memory_usage_percent: 58,
        disk_total_gb: 1000,
        disk_used_gb: 410,
        disk_usage_percent: 41,
        collected_at: '2026-02-04T00:30:11.9318181+03:30',
      },
      {
        id: 142486,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 398,
        cpu_load_1: 3.26,
        cpu_load_5: 2.57,
        cpu_load_15: 1.94,
        cpu_usage_percent: 83,
        memory_total_mb: 11264,
        memory_used_mb: 6871,
        memory_available_mb: 4393,
        memory_usage_percent: 61,
        disk_total_gb: 1800,
        disk_used_gb: 972,
        disk_usage_percent: 54,
        collected_at: '2026-02-04T01:00:11.9318181+03:30',
      },
      {
        id: 142546,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 517,
        cpu_load_1: 3.57,
        cpu_load_5: 2.98,
        cpu_load_15: 2.24,
        cpu_usage_percent: 38,
        memory_total_mb: 8192,
        memory_used_mb: 3604,
        memory_available_mb: 4588,
        memory_usage_percent: 44,
        disk_total_gb: 1600,
        disk_used_gb: 864,
        disk_usage_percent: 54,
        collected_at: '2026-02-04T01:30:11.9318181+03:30',
      },
      {
        id: 142606,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 256,
        cpu_load_1: 2.16,
        cpu_load_5: 1.49,
        cpu_load_15: 1.12,
        cpu_usage_percent: 44,
        memory_total_mb: 9216,
        memory_used_mb: 5160,
        memory_available_mb: 4056,
        memory_usage_percent: 56,
        disk_total_gb: 1300,
        disk_used_gb: 481,
        disk_usage_percent: 37,
        collected_at: '2026-02-04T02:00:11.9318181+03:30',
      },
      {
        id: 142666,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 113,
        cpu_load_1: 2.56,
        cpu_load_5: 2.17,
        cpu_load_15: 1.46,
        cpu_usage_percent: 13,
        memory_total_mb: 14336,
        memory_used_mb: 7311,
        memory_available_mb: 7025,
        memory_usage_percent: 51,
        disk_total_gb: 1800,
        disk_used_gb: 648,
        disk_usage_percent: 36,
        collected_at: '2026-02-04T02:30:11.9318181+03:30',
      },
      {
        id: 142726,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 382,
        cpu_load_1: 0.34,
        cpu_load_5: 0.28,
        cpu_load_15: 0.11,
        cpu_usage_percent: 17,
        memory_total_mb: 10240,
        memory_used_mb: 7884,
        memory_available_mb: 2356,
        memory_usage_percent: 77,
        disk_total_gb: 1100,
        disk_used_gb: 407,
        disk_usage_percent: 37,
        collected_at: '2026-02-04T03:00:11.9318181+03:30',
      },
      {
        id: 142786,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 200,
        cpu_load_1: 3.16,
        cpu_load_5: 2.52,
        cpu_load_15: 1.96,
        cpu_usage_percent: 40,
        memory_total_mb: 13312,
        memory_used_mb: 5724,
        memory_available_mb: 7588,
        memory_usage_percent: 43,
        disk_total_gb: 1300,
        disk_used_gb: 780,
        disk_usage_percent: 60,
        collected_at: '2026-02-04T03:30:11.9318181+03:30',
      },
      {
        id: 142846,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 466,
        cpu_load_1: 4.28,
        cpu_load_5: 3.09,
        cpu_load_15: 2.47,
        cpu_usage_percent: 45,
        memory_total_mb: 11264,
        memory_used_mb: 7997,
        memory_available_mb: 3267,
        memory_usage_percent: 71,
        disk_total_gb: 1000,
        disk_used_gb: 460,
        disk_usage_percent: 46,
        collected_at: '2026-02-04T04:00:11.9318181+03:30',
      },
      {
        id: 142906,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 390,
        cpu_load_1: 2.99,
        cpu_load_5: 2.1,
        cpu_load_15: 1.59,
        cpu_usage_percent: 40,
        memory_total_mb: 9216,
        memory_used_mb: 2672,
        memory_available_mb: 6544,
        memory_usage_percent: 29,
        disk_total_gb: 1000,
        disk_used_gb: 390,
        disk_usage_percent: 39,
        collected_at: '2026-02-04T04:30:11.9318181+03:30',
      },
      {
        id: 142966,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 437,
        cpu_load_1: 1.72,
        cpu_load_5: 1.4,
        cpu_load_15: 1.06,
        cpu_usage_percent: 36,
        memory_total_mb: 9216,
        memory_used_mb: 1290,
        memory_available_mb: 7926,
        memory_usage_percent: 14,
        disk_total_gb: 1200,
        disk_used_gb: 720,
        disk_usage_percent: 60,
        collected_at: '2026-02-04T05:00:11.9318181+03:30',
      },
      {
        id: 143026,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 375,
        cpu_load_1: 1.4,
        cpu_load_5: 1.08,
        cpu_load_15: 0.79,
        cpu_usage_percent: 42,
        memory_total_mb: 13312,
        memory_used_mb: 8519,
        memory_available_mb: 4793,
        memory_usage_percent: 64,
        disk_total_gb: 1100,
        disk_used_gb: 374,
        disk_usage_percent: 34,
        collected_at: '2026-02-04T05:30:11.9318181+03:30',
      },
      {
        id: 143086,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 397,
        cpu_load_1: 3.86,
        cpu_load_5: 3.06,
        cpu_load_15: 2.21,
        cpu_usage_percent: 18,
        memory_total_mb: 13312,
        memory_used_mb: 6123,
        memory_available_mb: 7189,
        memory_usage_percent: 46,
        disk_total_gb: 1100,
        disk_used_gb: 198,
        disk_usage_percent: 18,
        collected_at: '2026-02-04T06:00:11.9318181+03:30',
      },
      {
        id: 143146,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 420,
        cpu_load_1: 1.21,
        cpu_load_5: 1.04,
        cpu_load_15: 0.66,
        cpu_usage_percent: 46,
        memory_total_mb: 12288,
        memory_used_mb: 5283,
        memory_available_mb: 7005,
        memory_usage_percent: 43,
        disk_total_gb: 1600,
        disk_used_gb: 848,
        disk_usage_percent: 53,
        collected_at: '2026-02-04T06:30:11.9318181+03:30',
      },
      {
        id: 143206,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 236,
        cpu_load_1: 4.26,
        cpu_load_5: 3.45,
        cpu_load_15: 2.41,
        cpu_usage_percent: 62,
        memory_total_mb: 14336,
        memory_used_mb: 6451,
        memory_available_mb: 7885,
        memory_usage_percent: 45,
        disk_total_gb: 1100,
        disk_used_gb: 275,
        disk_usage_percent: 25,
        collected_at: '2026-02-04T07:00:11.9318181+03:30',
      },
      {
        id: 143266,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 109,
        cpu_load_1: 1.2,
        cpu_load_5: 1.1,
        cpu_load_15: 0.73,
        cpu_usage_percent: 37,
        memory_total_mb: 11264,
        memory_used_mb: 4618,
        memory_available_mb: 6646,
        memory_usage_percent: 41,
        disk_total_gb: 1900,
        disk_used_gb: 627,
        disk_usage_percent: 33,
        collected_at: '2026-02-04T07:30:11.9318181+03:30',
      },
      {
        id: 143326,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 73,
        cpu_load_1: 3.47,
        cpu_load_5: 2.84,
        cpu_load_15: 1.95,
        cpu_usage_percent: 57,
        memory_total_mb: 13312,
        memory_used_mb: 8386,
        memory_available_mb: 4926,
        memory_usage_percent: 63,
        disk_total_gb: 1800,
        disk_used_gb: 522,
        disk_usage_percent: 29,
        collected_at: '2026-02-04T08:00:11.9318181+03:30',
      },
      {
        id: 143386,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 334,
        cpu_load_1: 3.65,
        cpu_load_5: 2.62,
        cpu_load_15: 1.98,
        cpu_usage_percent: 52,
        memory_total_mb: 12288,
        memory_used_mb: 8110,
        memory_available_mb: 4178,
        memory_usage_percent: 66,
        disk_total_gb: 1600,
        disk_used_gb: 496,
        disk_usage_percent: 31,
        collected_at: '2026-02-04T08:30:11.9318181+03:30',
      },
      {
        id: 143446,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 424,
        cpu_load_1: 3.45,
        cpu_load_5: 2.91,
        cpu_load_15: 2.16,
        cpu_usage_percent: 40,
        memory_total_mb: 10240,
        memory_used_mb: 5120,
        memory_available_mb: 5120,
        memory_usage_percent: 50,
        disk_total_gb: 1400,
        disk_used_gb: 322,
        disk_usage_percent: 23,
        collected_at: '2026-02-04T09:00:11.9318181+03:30',
      },
      {
        id: 143506,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 477,
        cpu_load_1: 3.09,
        cpu_load_5: 2.49,
        cpu_load_15: 1.84,
        cpu_usage_percent: 38,
        memory_total_mb: 13312,
        memory_used_mb: 4526,
        memory_available_mb: 8786,
        memory_usage_percent: 34,
        disk_total_gb: 1900,
        disk_used_gb: 684,
        disk_usage_percent: 36,
        collected_at: '2026-02-04T09:30:11.9318181+03:30',
      },
      {
        id: 143566,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 519,
        cpu_load_1: 3,
        cpu_load_5: 2.3,
        cpu_load_15: 1.76,
        cpu_usage_percent: 11,
        memory_total_mb: 13312,
        memory_used_mb: 7188,
        memory_available_mb: 6124,
        memory_usage_percent: 54,
        disk_total_gb: 1300,
        disk_used_gb: 130,
        disk_usage_percent: 10,
        collected_at: '2026-02-04T10:00:11.9318181+03:30',
      },
      {
        id: 143626,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 156,
        cpu_load_1: 0.84,
        cpu_load_5: 0.73,
        cpu_load_15: 0.54,
        cpu_usage_percent: 18,
        memory_total_mb: 12288,
        memory_used_mb: 4055,
        memory_available_mb: 8233,
        memory_usage_percent: 33,
        disk_total_gb: 1300,
        disk_used_gb: 585,
        disk_usage_percent: 45,
        collected_at: '2026-02-04T10:30:11.9318181+03:30',
      },
      {
        id: 143686,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 232,
        cpu_load_1: 1.87,
        cpu_load_5: 1.3,
        cpu_load_15: 0.84,
        cpu_usage_percent: 26,
        memory_total_mb: 11264,
        memory_used_mb: 6307,
        memory_available_mb: 4957,
        memory_usage_percent: 56,
        disk_total_gb: 1400,
        disk_used_gb: 336,
        disk_usage_percent: 24,
        collected_at: '2026-02-04T11:00:11.9318181+03:30',
      },
      {
        id: 143746,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 479,
        cpu_load_1: 2,
        cpu_load_5: 1.64,
        cpu_load_15: 1.19,
        cpu_usage_percent: 15,
        memory_total_mb: 9216,
        memory_used_mb: 5437,
        memory_available_mb: 3779,
        memory_usage_percent: 59,
        disk_total_gb: 1600,
        disk_used_gb: 1408,
        disk_usage_percent: 88,
        collected_at: '2026-02-04T11:30:11.9318181+03:30',
      },
      {
        id: 143806,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 482,
        cpu_load_1: 4.01,
        cpu_load_5: 3.07,
        cpu_load_15: 2.42,
        cpu_usage_percent: 30,
        memory_total_mb: 14336,
        memory_used_mb: 2723,
        memory_available_mb: 11613,
        memory_usage_percent: 19,
        disk_total_gb: 1200,
        disk_used_gb: 468,
        disk_usage_percent: 39,
        collected_at: '2026-02-04T12:00:11.9318181+03:30',
      },
      {
        id: 143866,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 84,
        cpu_load_1: 3.84,
        cpu_load_5: 2.77,
        cpu_load_15: 2.06,
        cpu_usage_percent: 50,
        memory_total_mb: 10240,
        memory_used_mb: 3993,
        memory_available_mb: 6247,
        memory_usage_percent: 39,
        disk_total_gb: 1200,
        disk_used_gb: 552,
        disk_usage_percent: 46,
        collected_at: '2026-02-04T12:30:11.9318181+03:30',
      },
      {
        id: 143926,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 358,
        cpu_load_1: 2.2,
        cpu_load_5: 1.72,
        cpu_load_15: 1.16,
        cpu_usage_percent: 23,
        memory_total_mb: 14336,
        memory_used_mb: 2723,
        memory_available_mb: 11613,
        memory_usage_percent: 19,
        disk_total_gb: 1000,
        disk_used_gb: 160,
        disk_usage_percent: 16,
        collected_at: '2026-02-04T13:00:11.9318181+03:30',
      },
      {
        id: 143986,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 109,
        cpu_load_1: 0.74,
        cpu_load_5: 0.64,
        cpu_load_15: 0.59,
        cpu_usage_percent: 50,
        memory_total_mb: 8192,
        memory_used_mb: 1392,
        memory_available_mb: 6800,
        memory_usage_percent: 17,
        disk_total_gb: 1900,
        disk_used_gb: 1501,
        disk_usage_percent: 79,
        collected_at: '2026-02-04T13:30:11.9318181+03:30',
      },
      {
        id: 144046,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 528,
        cpu_load_1: 1.42,
        cpu_load_5: 1.15,
        cpu_load_15: 0.87,
        cpu_usage_percent: 28,
        memory_total_mb: 9216,
        memory_used_mb: 3409,
        memory_available_mb: 5807,
        memory_usage_percent: 37,
        disk_total_gb: 1100,
        disk_used_gb: 352,
        disk_usage_percent: 32,
        collected_at: '2026-02-04T14:00:11.9318181+03:30',
      },
      {
        id: 144106,
        agent_id: 1,
        is_offline: true,
        collect_duration_ms: 0,
        cpu_load_1: 0,
        cpu_load_5: 0,
        cpu_load_15: 0,
        cpu_usage_percent: 0,
        memory_total_mb: 0,
        memory_used_mb: 0,
        memory_available_mb: 0,
        memory_usage_percent: 0,
        disk_total_gb: 0,
        disk_used_gb: 0,
        disk_usage_percent: 0,
        collected_at: '2026-02-04T14:30:11.9318181+03:30',
      },
      {
        id: 144166,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 394,
        cpu_load_1: 3.82,
        cpu_load_5: 3.24,
        cpu_load_15: 2.39,
        cpu_usage_percent: 27,
        memory_total_mb: 10240,
        memory_used_mb: 9523,
        memory_available_mb: 717,
        memory_usage_percent: 93,
        disk_total_gb: 1500,
        disk_used_gb: 120,
        disk_usage_percent: 8,
        collected_at: '2026-02-04T15:00:11.9318181+03:30',
      },
      {
        id: 144226,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 223,
        cpu_load_1: 3.96,
        cpu_load_5: 3.03,
        cpu_load_15: 2.16,
        cpu_usage_percent: 48,
        memory_total_mb: 8192,
        memory_used_mb: 5816,
        memory_available_mb: 2376,
        memory_usage_percent: 71,
        disk_total_gb: 1500,
        disk_used_gb: 465,
        disk_usage_percent: 31,
        collected_at: '2026-02-04T15:30:11.9318181+03:30',
      },
      {
        id: 144286,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 69,
        cpu_load_1: 2.52,
        cpu_load_5: 1.96,
        cpu_load_15: 1.4,
        cpu_usage_percent: 25,
        memory_total_mb: 10240,
        memory_used_mb: 4812,
        memory_available_mb: 5428,
        memory_usage_percent: 47,
        disk_total_gb: 1300,
        disk_used_gb: 364,
        disk_usage_percent: 28,
        collected_at: '2026-02-04T16:00:11.9318181+03:30',
      },
      {
        id: 144346,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 112,
        cpu_load_1: 2.38,
        cpu_load_5: 1.74,
        cpu_load_15: 1.3,
        cpu_usage_percent: 43,
        memory_total_mb: 12288,
        memory_used_mb: 7864,
        memory_available_mb: 4424,
        memory_usage_percent: 64,
        disk_total_gb: 1000,
        disk_used_gb: 330,
        disk_usage_percent: 33,
        collected_at: '2026-02-04T16:30:11.9318181+03:30',
      },
      {
        id: 144406,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 231,
        cpu_load_1: 1.1,
        cpu_load_5: 0.97,
        cpu_load_15: 0.67,
        cpu_usage_percent: 87,
        memory_total_mb: 13312,
        memory_used_mb: 5191,
        memory_available_mb: 8121,
        memory_usage_percent: 39,
        disk_total_gb: 1400,
        disk_used_gb: 798,
        disk_usage_percent: 57,
        collected_at: '2026-02-04T17:00:11.9318181+03:30',
      },
      {
        id: 144466,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 482,
        cpu_load_1: 1.21,
        cpu_load_5: 1.1,
        cpu_load_15: 0.71,
        cpu_usage_percent: 22,
        memory_total_mb: 14336,
        memory_used_mb: 5877,
        memory_available_mb: 8459,
        memory_usage_percent: 41,
        disk_total_gb: 1300,
        disk_used_gb: 286,
        disk_usage_percent: 22,
        collected_at: '2026-02-04T17:30:11.9318181+03:30',
      },
      {
        id: 144526,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 359,
        cpu_load_1: 1.46,
        cpu_load_5: 1.05,
        cpu_load_15: 0.68,
        cpu_usage_percent: 48,
        memory_total_mb: 9216,
        memory_used_mb: 2949,
        memory_available_mb: 6267,
        memory_usage_percent: 32,
        disk_total_gb: 1300,
        disk_used_gb: 247,
        disk_usage_percent: 19,
        collected_at: '2026-02-04T18:00:11.9318181+03:30',
      },
      {
        id: 144586,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 305,
        cpu_load_1: 4.24,
        cpu_load_5: 3.16,
        cpu_load_15: 2.5,
        cpu_usage_percent: 49,
        memory_total_mb: 10240,
        memory_used_mb: 5017,
        memory_available_mb: 5223,
        memory_usage_percent: 49,
        disk_total_gb: 1400,
        disk_used_gb: 1246,
        disk_usage_percent: 89,
        collected_at: '2026-02-04T18:30:11.9318181+03:30',
      },
      {
        id: 144646,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 439,
        cpu_load_1: 0.97,
        cpu_load_5: 0.81,
        cpu_load_15: 0.5,
        cpu_usage_percent: 11,
        memory_total_mb: 14336,
        memory_used_mb: 9318,
        memory_available_mb: 5018,
        memory_usage_percent: 65,
        disk_total_gb: 1000,
        disk_used_gb: 180,
        disk_usage_percent: 18,
        collected_at: '2026-02-04T19:00:11.9318181+03:30',
      },
      {
        id: 144706,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 450,
        cpu_load_1: 0.96,
        cpu_load_5: 0.61,
        cpu_load_15: 0.53,
        cpu_usage_percent: 21,
        memory_total_mb: 8192,
        memory_used_mb: 3276,
        memory_available_mb: 4916,
        memory_usage_percent: 40,
        disk_total_gb: 1700,
        disk_used_gb: 952,
        disk_usage_percent: 56,
        collected_at: '2026-02-04T19:30:11.9318181+03:30',
      },
      {
        id: 144766,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 210,
        cpu_load_1: 1.88,
        cpu_load_5: 1.23,
        cpu_load_15: 0.98,
        cpu_usage_percent: 53,
        memory_total_mb: 13312,
        memory_used_mb: 5857,
        memory_available_mb: 7455,
        memory_usage_percent: 44,
        disk_total_gb: 1000,
        disk_used_gb: 530,
        disk_usage_percent: 53,
        collected_at: '2026-02-04T20:00:11.9318181+03:30',
      },
      {
        id: 144826,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 327,
        cpu_load_1: 0.7,
        cpu_load_5: 0.31,
        cpu_load_15: 0.28,
        cpu_usage_percent: 23,
        memory_total_mb: 14336,
        memory_used_mb: 3153,
        memory_available_mb: 11183,
        memory_usage_percent: 22,
        disk_total_gb: 1900,
        disk_used_gb: 627,
        disk_usage_percent: 33,
        collected_at: '2026-02-04T20:30:11.9318181+03:30',
      },
      {
        id: 144886,
        agent_id: 1,
        is_offline: true,
        collect_duration_ms: 0,
        cpu_load_1: 0,
        cpu_load_5: 0,
        cpu_load_15: 0,
        cpu_usage_percent: 0,
        memory_total_mb: 0,
        memory_used_mb: 0,
        memory_available_mb: 0,
        memory_usage_percent: 0,
        disk_total_gb: 0,
        disk_used_gb: 0,
        disk_usage_percent: 0,
        collected_at: '2026-02-04T21:00:11.9318181+03:30',
      },
      {
        id: 144946,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 372,
        cpu_load_1: 3.19,
        cpu_load_5: 2.63,
        cpu_load_15: 2.05,
        cpu_usage_percent: 26,
        memory_total_mb: 11264,
        memory_used_mb: 6758,
        memory_available_mb: 4506,
        memory_usage_percent: 60,
        disk_total_gb: 1200,
        disk_used_gb: 708,
        disk_usage_percent: 59,
        collected_at: '2026-02-04T21:30:11.9318181+03:30',
      },
      {
        id: 145006,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 546,
        cpu_load_1: 0.83,
        cpu_load_5: 0.52,
        cpu_load_15: 0.35,
        cpu_usage_percent: 58,
        memory_total_mb: 10240,
        memory_used_mb: 3891,
        memory_available_mb: 6349,
        memory_usage_percent: 38,
        disk_total_gb: 1800,
        disk_used_gb: 414,
        disk_usage_percent: 23,
        collected_at: '2026-02-04T22:00:11.9318181+03:30',
      },
      {
        id: 145066,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 262,
        cpu_load_1: 1.45,
        cpu_load_5: 1.12,
        cpu_load_15: 0.92,
        cpu_usage_percent: 23,
        memory_total_mb: 13312,
        memory_used_mb: 4526,
        memory_available_mb: 8786,
        memory_usage_percent: 34,
        disk_total_gb: 1500,
        disk_used_gb: 420,
        disk_usage_percent: 28,
        collected_at: '2026-02-04T22:30:11.9318181+03:30',
      },
      {
        id: 145126,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 370,
        cpu_load_1: 1.08,
        cpu_load_5: 1.06,
        cpu_load_15: 0.75,
        cpu_usage_percent: 56,
        memory_total_mb: 12288,
        memory_used_mb: 6021,
        memory_available_mb: 6267,
        memory_usage_percent: 49,
        disk_total_gb: 1100,
        disk_used_gb: 473,
        disk_usage_percent: 43,
        collected_at: '2026-02-04T23:00:11.9318181+03:30',
      },
      {
        id: 145186,
        agent_id: 1,
        is_offline: false,
        collect_duration_ms: 172,
        cpu_load_1: 3.83,
        cpu_load_5: 2.81,
        cpu_load_15: 2.12,
        cpu_usage_percent: 52,
        memory_total_mb: 11264,
        memory_used_mb: 2816,
        memory_available_mb: 8448,
        memory_usage_percent: 25,
        disk_total_gb: 1000,
        disk_used_gb: 590,
        disk_usage_percent: 59,
        collected_at: '2026-02-04T23:30:11.9318181+03:30',
      },
    ],
    time_range: {
      from: '2026-02-04T00:00:00+03:30',
      to: '2026-02-05T00:00:00+03:30',
      hours: 24,
    },
  });

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  function getMonthName(month) {
    return MONTHS[month - 1];
  }

  onMount(() => {
    if (!date) {
      http
        .get(endpoints.agentHistory(id), {
          params: { short: true, detail: true, page_size: REQUIRED_COUNT },
        })
        .then(res => {
          history = { ...res.data, data: res.data?.data.slice(-REQUIRED_COUNT) };
        });
    }
    http.get(endpoints.singleAgent(id)).then(res => {
      data = res.data?.data;
      enabled = res.data?.data.enabled;
    });
    http.get(endpoints.agentSummaryYearly(id)).then(res => (summary = res.data?.data));
  });

  function nextDate(data, year, month, day) {
    const maxDay = Object.keys(
      data.filter(item => Number(item?.month) === Number(month))[0].history,
    ).length;
    let nextDay = Number(day);
    let nextMonth = Number(month);
    let nextYear = Number(year);
    if (Number(day) === maxDay) {
      nextDay = 1;
      if (nextMonth === 12) {
        nextMonth = 1;
        nextYear = nextYear + 1;
      } else {
        nextMonth = nextMonth + 1;
      }
    } else {
      nextDay = nextDay + 1;
    }

    goto(`/agents/${id}?year=${nextYear}&month=${nextMonth}&day=${nextDay}`);
  }

  function preDate(data, year, month, day) {
    let perDay = Number(day);
    let perMonth = Number(month);
    let perYear = Number(year);

    if (perDay === 1) {
      if (perMonth === 1) {
        perMonth = 12;
        perYear = perYear - 1;
      } else {
        perMonth = perMonth - 1;
      }
      const prevMonthData = data.find(
        item => Number(item?.year) === perYear && Number(item?.month) === perMonth,
      );

      if (prevMonthData && prevMonthData.history) {
        const daysInMonth = Math.max(...Object.keys(prevMonthData.history).map(Number));
        perDay = daysInMonth;
      } else {
        return;
      }
    } else {
      perDay = perDay - 1;
    }

    goto(`/agents/${id}?year=${perYear}&month=${perMonth}&day=${perDay}`);
  }
  $effect(() => {
    const year = $page.url.searchParams.get('year');
    let month = $page.url.searchParams.get('month');
    let day = $page.url.searchParams.get('day');

    if (month?.length < 2) month = `0${month}`;
    if (day?.length < 2) day = `0${day}`;

    if (year && month && day) {
      historyDetail = null;
      date = { year, month, day };
      http.get(endpoints.agentSummaryDate(id, `${year}-${month}-${day}`)).then(res => {
        summaryWithDate = res.data?.data;
      });
    } else {
      date = null;
    }
  });

  $effect(() => {
    if (pointIndexHoverd && id) {
      http
        .get(
          endpoints.agentHistoryDetail(
            id,
            [...chart?.points?.map(item => item?.[0]).reverse()][pointIndexHoverd],
          ),
        )
        .then(res => (metricPointDetail = res.data?.data));
    }
  });

  $effect(() => {
    http
      .get(endpoints.agentCollectDuration(id), { params: { hours } })
      .then(res => (collectDuration = res.data?.data));

    http
      .get(endpoints.agentChart(id), {
        params: {
          hours,
          max_points: 60,
        },
      })
      .then(res => (chart = res.data?.data));
  });
</script>

<section class="w-full m-auto h-auto flex flex-col col-span-10">
  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 py-2">
    <div
      class="w-full flex flex-col justify-start items-start gap-6 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
      <div class="w-full flex justify-between items-start relative">
        <div class="flex flex-col justify-center items-start">
          <span class="text-black dark:text-white text-xl capitalize">{data?.name}</span>

          <span
            class="flex justify-center items-center text-nowrap tracking-wider text-sm {data?.status ===
            'online'
              ? 'text-green-700'
              : 'text-[#F87171]'}">{data?.status}</span>
        </div>
        {#if date}
          <div
            class="flex items-center justify-between px-3 gap-4 bg-white/5 text-sm absolute top-0 rounded-md start-1/2 -translate-x-1/2 min-w-40 h-9.5 shadow-sm shadow-[#3b82f6]/50">
            <!-- Prev -->

            <button
              aria-label="prev date"
              onclick={() => {
                preDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7" />
              </svg></button>

            <!-- Date -->
            <div class="px-4 py-1.5 rounded-lg tracking-wide text-nowrap text-[#3b82f6]">
              {getMonthName($page.url.searchParams.get('month'))}
              {$page.url.searchParams.get('day')} , {$page.url.searchParams.get('year')}
            </div>

            <!-- Next -->
            <button
              aria-label="next date"
              onclick={() => {
                nextDate(
                  summary,
                  $page.url.searchParams.get('year'),
                  $page.url.searchParams.get('month'),
                  $page.url.searchParams.get('day'),
                );
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 hover:opacity-65 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg></button>
          </div>
        {/if}

        {#if date}
          <button
            onclick={() => {
              goto(`/agents/${id}`);
            }}
            class="flex items-center gap-2 ps-4 bg-emerald-500/10 animate-pulse hover:animate-none pe-2.5 h-8 text-xs rounded-full outline outline-offset-1 outline-emerald-500/60 text-emerald-400 cursor-pointer">
            Back to Today
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.25 h-3.25 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        {:else if data}
          <div class="flex justify-center items-center gap-3">
            <div class="flex justify-center items-center gap-1.75">
              <button
                class="cursor-pointer"
                aria-label="delete checker"
                type="button"
                onclick={() => {
                  opener({
                    id: 'delete-agent',
                    content: DeleteAgent,
                    props: { name: data?.name, id: data?.id },
                  });
                }}>
                <img src="/icons/trash.png" alt="trash" width="20" height="20" /></button>
              <button
                class="cursor-pointer"
                aria-label="edit config"
                type="button"
                onclick={() => {
                  opener({
                    id: 'edit-agent',
                    content: EditAgent,
                    props: {
                      name: data?.name,
                      interval_seconds: data?.interval_seconds,
                      enabled: data?.enabled,
                      id: data?.id,
                    },
                  });
                }}>
                <img src="/icons/edit.png" alt="edit" width="24" height="24" />
              </button>
            </div>

            <div class="h-9 w-px bg-white/20"></div>
            {#key enabled}
              <div
                class="py-2 w-30 flex justify-center items-center gap-2 bg-[#0D0D0D]/5 dark:bg-white/5 border border-[#e5e7eb] dark:border-white/5 rounded-[14px]">
                <span class="text-xs text-[#99a1af]">
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>

                <button
                  onclick={() => {
                    if (enabled) {
                      opener({
                        id: 'confirm-edit',
                        content: ConfirmEditAgent,
                        props: {
                          name: data?.name,
                        },
                      });
                    } else {
                      http
                        .patch(endpoints.singleAgent(data?.id), {
                          enabled: true,
                        })
                        .then(res => {
                          alertStore.addAlert({
                            message: `Agent ${data?.name} activation updated successfully.`,
                            type: 'successful',
                          });
                          location.href = `/agents/${data?.id}`;
                        });
                    }
                  }}
                  aria-label="activation toggle"
                  class="w-11 h-6 rounded-full relative cursor-pointer {enabled
                    ? 'bg-[#00bc7d]/20 border border-[#00bc7d]/30'
                    : 'bg-[#6a7282]/10 border border-[#6a7282]/20 '}">
                  <div
                    style={enabled ? 'box-shadow: 0 0 5px 0.5px #00bc7d' : ''}
                    class="absolute top-1/2 -translate-y-1/2 left-px size-5 rounded-full transition-transform duration-300 ease-in-out {enabled
                      ? 'translate-x-5 bg-[#00bc7d]'
                      : 'translate-x-0 bg-[#4d4d4d]'}">
                  </div>
                </button>
              </div>
            {/key}
          </div>
        {/if}
      </div>

      <div class="flex flex-col gap-4 w-full">
        <div
          class="relative flex flex-col p-6 gap-4 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5 {date
            ? 'h-43'
            : 'h-35'}">
          <div class="w-full flex justify-between items-start">
            <div class="w-fit flex flex-col justify-start items-start">
              <span class="text-lg text-black dark:text-white">Uptime</span>

              {#if date ? summaryWithDate?.date : history?.last_collected}
                <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                  <span class="flex justify-center items-center text-nowrap"
                    >{date ? 'Date : ' + summaryWithDate?.date : 'Last Collected :'}</span>

                  {#if !date}
                    <span class="flex justify-center items-center text-nowrap tracking-wider">
                      {new Date(history?.last_collected).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>

            {#if !date}
              {#if history?.uptime_percent}
                <span
                  class="text-2xl {history?.uptime_percent >= 90
                    ? 'text-[#008236]'
                    : history?.uptime_percent >= 80
                      ? 'text-[#00D492]'
                      : history?.uptime_percent >= 70
                        ? 'text-[#FDC700]'
                        : history?.uptime_percent >= 50
                          ? 'text-[#F97316]'
                          : 'text-[#EF4444]'}">
                  {history?.uptime_percent}%
                </span>
              {:else}
                <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
              {/if}
            {:else if summaryWithDate?.overall?.uptime_percent}
              <span
                class="text-2xl {summaryWithDate?.overall?.uptime_percent >= 90
                  ? 'text-[#008236]'
                  : summaryWithDate?.overall?.uptime_percent >= 80
                    ? 'text-[#00D492]'
                    : summaryWithDate?.overall?.uptime_percent >= 70
                      ? 'text-[#FDC700]'
                      : summaryWithDate?.overall?.uptime_percent >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}">
                {summaryWithDate?.overall?.uptime_percent}%
              </span>{:else}
              <span class="text-2xl text-white/20 text-nowrap"> No Data </span>{/if}
          </div>

          <div
            class=" w-full z-10 flex flex-row-reverse gap-0.5 justify-between items-end absolute start-1/2 -translate-x-1/2 px-6 {date
              ? 'bottom-14'
              : 'bottom-6'}">
            {#if !date}
              {#each history?.data as detail (detail[0])}
                {@const status = detail[1]}

                <button
                  type="button"
                  aria-label="detail of status"
                  onmouseover={() => {
                    if (!date) {
                      http
                        .get(endpoints.agentHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onmouseleave={() => {
                    if (!date) {
                      historyDetail = null;
                    }
                  }}
                  onfocus={() => {
                    if (!date) {
                      http
                        .get(endpoints.agentHistoryDetail(id, detail[0]))
                        .then(res => (historyDetail = res.data?.data));
                    }
                  }}
                  onblur={() => {
                    if (!date) {
                      historyDetailDetail = null;
                    }
                  }}
                  class="w-4 h-4 rounded-[1px] hover:h-6 transition-all cursor-pointer relative group {status ===
                  'offline'
                    ? 'bg-[#EF4444]'
                    : status === 'online'
                      ? 'bg-green-700'
                      : 'bg-[#FFFFFF]/10'}">
                  {#if historyDetail}
                    <div
                      class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start {historyDetail.is_offline
                        ? 'gap-1.5'
                        : 'gap-2.5'}">
                      {#if historyDetail.collect_duration_ms}
                        <div
                          class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Latency :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap {historyDetail.collect_duration_ms >
                            LIMITATIONS.collect_duration_ms.error
                              ? 'text-[#F87171]'
                              : historyDetail.collect_duration_ms >
                                  LIMITATIONS.collect_duration_ms.warn
                                ? 'text-[#F97316]'
                                : 'text-green-700'}"
                            >{historyDetail.collect_duration_ms}<sub>ms</sub></span>
                        </div>
                      {/if}

                      {#if historyDetail.cpu_usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #ad46ff;"
                              class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                                >Cpu :</span>
                              <span
                                class="flex justify-center items-center text-sm text-nowrap {historyDetail.cpu_usage_percent >
                                LIMITATIONS.cpu.error
                                  ? 'text-[#F87171]'
                                  : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{historyDetail.cpu_usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                            <div
                              class="h-full rounded-full {historyDetail.cpu_usage_percent >
                              LIMITATIONS.cpu.error
                                ? 'bg-[#F87171]'
                                : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                historyDetail.cpu_usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {historyDetail.cpu_usage_percent >
                              LIMITATIONS.cpu.error
                                ? '#F87171'
                                : historyDetail.cpu_usage_percent > LIMITATIONS.cpu.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      {#if historyDetail.memory_usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #2b7fff;"
                              class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                                >Memory :</span>
                              <span
                                class="flex justify-center items-center text-sm text-nowrap {historyDetail.memory_usage_percent >
                                LIMITATIONS.memory.error
                                  ? 'text-[#F87171]'
                                  : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}"
                                >{historyDetail.memory_usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                            <div
                              class="h-full rounded-full {historyDetail.memory_usage_percent >
                              LIMITATIONS.memory.error
                                ? 'bg-[#F87171]'
                                : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                historyDetail.memory_usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {historyDetail.memory_usage_percent >
                              LIMITATIONS.memory.error
                                ? '#F87171'
                                : historyDetail.memory_usage_percent > LIMITATIONS.memory.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}

                      {#if historyDetail.disk_usage_percent}
                        <div class="flex flex-col items-center w-full gap-1">
                          <div class="w-full flex justify-start items-center gap-2.5">
                            <span
                              style="box-shadow: 0 0 10px 1px #22c55e;"
                              class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                            <div class="flex-1 flex justify-between items-center gap-2.5">
                              <span
                                class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                                >Disk :</span>
                              <span
                                class="flex justify-center items-center text-sm text-nowrap {historyDetail.disk_usage_percent >
                                LIMITATIONS.disk.error
                                  ? 'text-[#F87171]'
                                  : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                    ? 'text-[#F97316]'
                                    : 'text-green-700'}">{historyDetail.disk_usage_percent}%</span>
                            </div>
                          </div>
                          <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                            <div
                              class="h-full rounded-full {historyDetail.disk_usage_percent >
                              LIMITATIONS.disk.error
                                ? 'bg-[#F87171]'
                                : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                  ? 'bg-[#F97316]'
                                  : 'bg-green-700'}"
                              style="width: {Math.min(
                                historyDetail.disk_usage_percent,
                                100,
                              )}%;box-shadow: 0 0 10px 1px {historyDetail.disk_usage_percent >
                              LIMITATIONS.disk.error
                                ? '#F87171'
                                : historyDetail.disk_usage_percent > LIMITATIONS.disk.warn
                                  ? '#F97316'
                                  : '#008236'};">
                            </div>
                          </div>
                        </div>
                      {/if}
                      {#if historyDetail?.is_offline}
                        <div class="w-full flex justify-between items-center gap-2.5">
                          <span
                            class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                            >Status :</span>
                          <span
                            class="flex justify-center items-center text-sm text-nowrap capitalize text-[#F87171]"
                            >Offline</span>
                        </div>
                      {/if}

                      <div
                        class="w-full flex justify-start items-center text-sm text-nowrap text-[#6a7282] text-center border-t-black/10 dark:border-t-white/15 border-t pt-1.5">
                        {new Date(historyDetail?.collected_at).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    </div>{/if}
                </button>
              {/each}
              {#each Array(missingCount) as _, i}
                <div
                  aria-hidden="true"
                  class="w-4 h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
                </div>
              {/each}
            {:else}
              {#each summaryWithDate?.uptime_series as uptime, i}
                <button
                  type="button"
                  aria-label="detail of status"
                  class="w-full h-6 rounded-[1px] hover:h-7 transition-all cursor-pointer relative group {uptime.collect_count
                    ? 'bg-green-700'
                    : 'bg-[#FFFFFF]/10'}">
                  <div
                    class="absolute w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start {uptime.collect_count
                      ? 'gap-1.5'
                      : 'gap-2.5'}">
                    {#if uptime.avg_collect_duration_ms}
                      <div
                        class="w-full flex justify-between items-center gap-2.5 border-b border-b-[#0D0D0D]/10 dark:border-b-white/15 pb-1.5">
                        <span
                          class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                          >Latency :</span>
                        <span
                          class="flex justify-center items-center text-sm text-nowrap {uptime.avg_collect_duration_ms >
                          LIMITATIONS.collect_duration_ms.error
                            ? 'text-[#F87171]'
                            : uptime.avg_collect_duration_ms > LIMITATIONS.collect_duration_ms.warn
                              ? 'text-[#F97316]'
                              : 'text-green-700'}"
                          >{uptime.avg_collect_duration_ms}<sub>ms</sub></span>
                      </div>
                    {/if}

                    {#if uptime?.avg_cpu_usag}
                      <div class="flex flex-col items-center w-full gap-1">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #ad46ff;"
                            class="size-1.5 rounded-full bg-[#ad46ff]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Cpu :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {uptime?.avg_cpu_usag >
                              LIMITATIONS.cpu.error
                                ? 'text-[#F87171]'
                                : uptime?.avg_cpu_usag > LIMITATIONS.cpu.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{uptime?.avg_cpu_usag}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {uptime?.avg_cpu_usag > LIMITATIONS.cpu.error
                              ? 'bg-[#F87171]'
                              : uptime?.avg_cpu_usag > LIMITATIONS.cpu.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              uptime?.avg_cpu_usag,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {uptime?.avg_cpu_usag >
                            LIMITATIONS.cpu.error
                              ? '#F87171'
                              : uptime?.avg_cpu_usag > LIMITATIONS.cpu.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}

                    {#if uptime.avg_memory_usage}
                      <div class="flex flex-col items-center w-full gap-1">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #2b7fff;"
                            class="size-1.5 rounded-full bg-[#2b7fff]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Memory :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {uptime.avg_memory_usage >
                              LIMITATIONS.memory.error
                                ? 'text-[#F87171]'
                                : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{uptime.avg_memory_usage}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {uptime.avg_memory_usage >
                            LIMITATIONS.memory.error
                              ? 'bg-[#F87171]'
                              : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              uptime.avg_memory_usage,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {uptime.avg_memory_usage >
                            LIMITATIONS.memory.error
                              ? '#F87171'
                              : uptime.avg_memory_usage > LIMITATIONS.memory.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}

                    {#if avg_disk_usage}
                      <div class="flex flex-col items-center w-full gap-1 pb-1.5">
                        <div class="w-full flex justify-start items-center gap-2.5">
                          <span
                            style="box-shadow: 0 0 10px 1px #22c55e;"
                            class="size-1.5 rounded-full bg-[#00bc7d]"></span>
                          <div class="flex-1 flex justify-between items-center gap-2.5">
                            <span
                              class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                              >Disk :</span>
                            <span
                              class="flex justify-center items-center text-sm text-nowrap {avg_disk_usage >
                              LIMITATIONS.disk.error
                                ? 'text-[#F87171]'
                                : avg_disk_usage > LIMITATIONS.disk.warn
                                  ? 'text-[#F97316]'
                                  : 'text-green-700'}">{avg_disk_usage}%</span>
                          </div>
                        </div>
                        <div class="w-full h-0.5 rounded-full bg-black/10 dark:bg-white/10">
                          <div
                            class="h-full rounded-full {avg_disk_usage > LIMITATIONS.disk.error
                              ? 'bg-[#F87171]'
                              : avg_disk_usage > LIMITATIONS.disk.warn
                                ? 'bg-[#F97316]'
                                : 'bg-green-700'}"
                            style="width: {Math.min(
                              avg_disk_usage,
                              100,
                            )}%;box-shadow: 0 0 10px 1px {avg_disk_usage > LIMITATIONS.disk.error
                              ? '#F87171'
                              : avg_disk_usage > LIMITATIONS.disk.warn
                                ? '#F97316'
                                : '#008236'};">
                          </div>
                        </div>
                      </div>
                    {/if}
                  </div>
                  <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>

                  <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                    {(summaryWithDate?.uptime_series?.length - i).toString().padStart(2, '0')}:00
                  </div>
                </button>
              {/each}
              {#each Array(24 - summaryWithDate?.uptime_series?.length) as _, i}
                <div
                  aria-hidden="true"
                  class="w-full relative h-4 rounded-[1px] bg-black/20 dark:bg-[#FFFFFF]/10 opacity-70">
                  <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
                  <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                    {((summaryWithDate?.uptime_series?.length || 24) - i)
                      .toString()
                      .padStart(2, '0')}:00
                  </div>
                </div>
              {/each}

              <div class="absolute -bottom-1 start-1/2 -translate-x-1/2 w-full px-6">
                <div class="h-px w-full bg-white/10"></div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      {#if !date && data?.interval_seconds * 2 <= 43200}
        <div
          class="flex mx-auto sticky top-6 shadow-sm shadow-[#3b82f6]/50 z-20 text-white/20 gap-6 py-2 justify-between px-6 text-sm items-center rounded-lg dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
          {#if data?.interval_seconds * 2 <= 3600}
            <button
              onclick={() => (hours = 1)}
              class="transition-all duration-300 {hours === 1
                ? 'text-[#3b82f6]'
                : 'cursor-pointer'}">1h</button>

            <div class="h-5 w-px bg-white/15"></div>
          {/if}
          {#if data?.interval_seconds * 2 <= 10800}
            <button
              onclick={() => (hours = 3)}
              class="transition-all duration-300 {hours === 3
                ? 'text-[#3b82f6]'
                : 'cursor-pointer'}">3h</button>
            <div class="h-5 w-px bg-white/15"></div>
          {/if}
          {#if data?.interval_seconds * 2 <= 21600}
            <button
              onclick={() => (hours = 6)}
              class="transition-all duration-300 {hours === 6
                ? 'text-[#3b82f6]'
                : 'cursor-pointer'}">6h</button>
            <div class="h-5 w-px bg-white/15"></div>
          {/if}

          <button
            onclick={() => (hours = 12)}
            class="transition-all duration-300 {hours === 12 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >12h</button>
          <div class="h-5 w-px bg-white/15"></div>
          <button
            onclick={() => (hours = 24)}
            class="transition-all duration-300 {hours === 24 ? 'text-[#3b82f6]' : 'cursor-pointer'}"
            >24h</button>
        </div>
      {/if}

      <div
        class="relative w-full flex flex-col p-6 pb-13 gap-10 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
        <div class="flex justify-between items-start">
          <div class="flex flex-col justify-start items-start w-full">
            <span class="text-lg text-black dark:text-white"> Collect Duration</span>
            <div class="text-xs text-white/70 flex gap-1.5">
              <span class="text-white/40">Total collects :</span>
              {(date ? summaryWithDate?.overall?.total_collects : collectDuration?.total_collect) ||
                '-'}
            </div>
          </div>

          {#if date}
            {#if summaryWithDate?.overall?.avg_collect_duration_ms}
              <div class="flex text-2xl justify-end gap-2 items-center">
                <span
                  class={summaryWithDate?.overall?.rate?.toLowerCase() === 'excellent'
                    ? 'text-green-500'
                    : summaryWithDate?.overall?.rate?.toLowerCase() === 'good'
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.rate?.toLowerCase() === 'fair'
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.rate?.toLowerCase() === 'poor'
                          ? 'text-[#F97316]'
                          : 'text-[#F87171]'}>
                  {summaryWithDate?.overall?.rate}
                </span>

                <span class="h-7 w-px bg-white/15"></span>

                <span
                  class={summaryWithDate?.overall?.avg_collect_duration_ms >= 90
                    ? 'text-[#008236]'
                    : summaryWithDate?.overall?.avg_collect_duration_ms >= 80
                      ? 'text-[#00D492]'
                      : summaryWithDate?.overall?.avg_collect_duration_ms >= 70
                        ? 'text-[#FDC700]'
                        : summaryWithDate?.overall?.avg_collect_duration_ms >= 50
                          ? 'text-[#F97316]'
                          : 'text-[#EF4444]'}>
                  {summaryWithDate?.overall?.avg_collect_duration_ms}ms</span>
              </div>
            {:else}
              <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
            {/if}
          {:else if collectDuration?.avg_ms}
            <div class="flex text-2xl justify-end gap-2 items-center">
              <span
                class={collectDuration?.rate?.toLowerCase() === 'excellent'
                  ? 'text-green-500'
                  : collectDuration?.rate?.toLowerCase() === 'good'
                    ? 'text-[#00D492]'
                    : collectDuration?.rate?.toLowerCase() === 'fair'
                      ? 'text-[#FDC700]'
                      : collectDuration?.rate?.toLowerCase() === 'poor'
                        ? 'text-[#F97316]'
                        : 'text-[#F87171]'}>
                {collectDuration?.rate}
              </span>

              <span class="h-7 w-px bg-white/15"></span>

              <span
                class={collectDuration?.avg_ms >= 90
                  ? 'text-[#008236]'
                  : collectDuration?.avg_ms >= 80
                    ? 'text-[#00D492]'
                    : collectDuration?.avg_ms >= 70
                      ? 'text-[#FDC700]'
                      : collectDuration?.avg_ms >= 50
                        ? 'text-[#F97316]'
                        : 'text-[#EF4444]'}>
                {collectDuration?.avg_ms}ms</span>
            </div>
          {:else}
            <span class="text-2xl text-white/20 text-nowrap"> No Data </span>
          {/if}
        </div>

        <div class="relative w-full z-10 flex gap-0.5 justify-start items-end">
          <div class="w-full absolute -bottom-1 h-px bg-white/10"></div>
          {#if date}
            {#each summaryWithDate?.collect_duration_series as detail, i}
              <div
                style="height: {(detail?.avg_collect_duration_ms * 100) /
                  summaryWithDate?.overall?.max_collect_duration_ms /
                  1.5}px;"
                class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.rate?.toLowerCase() ===
                'excellent'
                  ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                  : detail?.rate?.toLowerCase() === 'good'
                    ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.rate?.toLowerCase() === 'fair'
                      ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.rate?.toLowerCase() === 'poor'
                        ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
                <div class="text-white absolute start-1/2 -translate-1/2 -top-5 text-xs">
                  {detail?.avg_collect_duration_ms}<sub>ms</sub>
                </div>
                {#if i !== 0 && i % 1 === 0}
                  <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {detail?.start_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                {/if}

                {#if summaryWithDate?.collect_duration_series?.length - 1 === i}
                  <div class="absolute -bottom-3 end-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {detail?.end_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>
                {/if}
                <div
                  class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect Rating :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}">{detail?.rate}</span>
                  </div>
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect AV (ms) :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}"
                      >{detail?.avg_collect_duration_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Lowest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.min_collect_duration_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Mostest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.max_collect_duration_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collects :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.collects}</span>
                  </div>

                  <div
                    class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>From</span>
                      <span class="text-white/30">{detail?.start_time.slice(0, 5)} </span>
                    </div>

                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>Until</span>
                      <span class="text-white/30"> {detail?.end_time.slice(0, 5)}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {:else}
            {#each collectDuration?.series as detail, i}
              <div
                style="height: {(detail?.avg_ms * 100) / collectDuration.max_ms / 1.5}px;"
                class="w-full rounded-[1px] cursor-pointer relative group border-t-4 transition-all {detail?.rate?.toLowerCase() ===
                'excellent'
                  ? 'bg-green-500 border-t-green-700 hover:bg-green-700'
                  : detail?.rate?.toLowerCase() === 'good'
                    ? 'bg-[#00D492] border-t-[#009667] hover:bg-[#00ad76]'
                    : detail?.rate?.toLowerCase() === 'fair'
                      ? 'bg-[#FDC700] border-t-[#c79c00] hover:bg-[#ffd745]'
                      : detail?.rate?.toLowerCase() === 'poor'
                        ? 'bg-[#F97316] border-t-[#c25e17] hover:bg-[#cf5600]'
                        : 'bg-[#F87171] border-t-[#ba4646] hover:bg-[#ff5757]'}">
                {#if i !== 0 && i % 4 === 0}
                  <div class="absolute -bottom-3 start-0 h-2 w-px bg-white/10">
                    <div class="relative">
                      <div
                        class="absolute -bottom-7 start-1/2 -translate-x-1/2 text-white/20 text-xs text-nowrap">
                        {new Date(detail?.from).toLocaleString('en-CA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    </div>
                  </div>
                {/if}

                <div
                  class="absolute z-10 w-fit group-hover:flex hidden bottom-10 start-1/2 -translate-x-1/2 rounded-xl text-white bg-white/40 dark:bg-black/80 backdrop-blur-md dark:backdrop-blur-3xl border-[#0D0D0D]/5 border dark:border-white/10 px-3 py-2 flex-col justify-start items-start gap-1">
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect Rating :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap capitalize {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}">{detail?.rate}</span>
                  </div>
                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Collect AV (ms) :</span>
                    <span
                      class="flex justify-center items-center text-sm text-nowrap {detail?.rate?.toLowerCase() ===
                      'excellent'
                        ? 'text-green-500'
                        : detail?.rate?.toLowerCase() === 'good'
                          ? 'text-[#00D492]'
                          : detail?.rate?.toLowerCase() === 'fair'
                            ? 'text-[#FDC700]'
                            : detail?.rate?.toLowerCase() === 'poor'
                              ? 'text-[#F97316]'
                              : 'text-[#F87171]'}">{detail?.avg_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Lowest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.min_ms}<sub>ms</sub></span>
                  </div>

                  <div class="w-full flex justify-between items-center gap-2.5">
                    <span
                      class="flex justify-center items-center text-sm text-nowrap text-[#6a7282]"
                      >Mostest Duration :</span>
                    <span class="flex justify-center items-center text-sm text-nowrap text-white"
                      >{detail?.max_ms}<sub>ms</sub></span>
                  </div>

                  <div
                    class="w-full flex flex-col justify-start items-start text-xs pt-1.5 text-[#6a7282] text-center text-nowrap border-t border-t-[#0D0D0D]/10 dark:border-t-white/15">
                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>From</span>
                      <span class="text-white/30">
                        {new Date(detail?.from).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>

                    <div class="flex justify-between items-center gap-1 w-full">
                      <span>Until</span>
                      <span class="text-white/30">
                        {new Date(detail?.to).toLocaleString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                        })}</span>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
          {#if date ? summaryWithDate?.collect_duration_series?.length < 1 : collectDuration?.series?.length < 1}
            {#each Array(24) as _, i}
              <div aria-hidden="true" class="w-full h-6 rounded-[1px] bg-white/5 relative">
                <div class="h-2 w-px bg-white/10 absolute -end-px -bottom-3"></div>
                <div class="h-2 w-px text-white/20 absolute end-3.25 text-xs -bottom-7">
                  {(i + 1).toString().padStart(2, '0')}:00
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6 w-full">
        <div
          class="w-full col-span-9 border flex flex-col sm:p-4 md:pb-0 sm:gap-4 md:pt-4 2xl:p-6 2xl:pb-1 rounded-[14px] dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF] sm:border border-[#0D0D0D]/5 dark:border-white/5">
          <div class="w-full flex justify-between items-start">
            <div class="w-full flex gap-1 flex-col justify-start items-start">
              <span class="text-lg md:text-xl text-black dark:text-white">Metrics</span>

              <div class="flex justify-end items-center gap-2 text-xs text-white/40">
                {#if date}
                  {#if isMouseInside && summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at}
                    <span class="flex justify-center items-center text-nowrap">Collect at :</span>

                    <span class="flex justify-center items-center text-nowrap tracking-wider">
                      {new Date(
                        summaryWithDate?.chart_series?.[pointIndexHoverd]?.collected_at,
                      ).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  {/if}
                {:else if isMouseInside ? metricPointDetail?.collected_at : chart?.last_history?.collected_at}
                  <span class="flex justify-center items-center text-nowrap">Collect at :</span>

                  <span class="flex justify-center items-center text-nowrap tracking-wider">
                    {#if isMouseInside}
                      {new Date(metricPointDetail?.collected_at).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    {:else}
                      {new Date(chart?.last_history?.collected_at).toLocaleString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                      })}
                    {/if}
                  </span>{/if}
              </div>
            </div>

            <div
              class="text-sm py-2 px-3 rounded-full border text-white border-white/5 text-nowrap">
              <span class="text-white/40 me-1">Collect Duration : </span>

              {#if date}
                {#if isMouseInside}
                  <span
                    class={responseTimeColor(
                      summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms,
                    )}
                    >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.collect_duration_ms +
                        ' ms'
                      : '-'}</span>
                {:else}
                  <span class={responseTimeColor(summaryWithDate?.overall?.avg_collect_duration_ms)}
                    >{summaryWithDate?.overall?.avg_collect_duration_ms
                      ? summaryWithDate?.overall?.avg_collect_duration_ms + ' ms'
                      : '-'}
                  </span>
                {/if}
              {:else if isMouseInside}
                <span class={responseTimeColor(metricPointDetail?.collect_duration_ms)}
                  >{metricPointDetail?.collect_duration_ms
                    ? metricPointDetail?.collect_duration_ms + ' ms'
                    : '-'}</span>
              {:else}
                <span class={responseTimeColor(chart?.last_history?.collect_duration_ms)}
                  >{chart?.last_history?.collect_duration_ms
                    ? chart?.last_history?.collect_duration_ms + ' ms'
                    : '-'}</span>
              {/if}
            </div>
          </div>
          {#if Boolean(date ? summaryWithDate?.chart_series?.length > 0 : chart?.points?.length > 0)}
            {@const memoryData = date
              ? [...summaryWithDate?.chart_series.map(item => item?.memory_usage_percent).reverse()]
              : [...chart?.points?.map(item => item?.[2]).reverse()]}

            {@const cpuData = date
              ? [...summaryWithDate?.chart_series.map(item => item?.cpu_usage_percent).reverse()]
              : [...chart?.points?.map(item => item?.[1]).reverse()]}
            <Chart
              bind:isMouseInside
              bind:pointIndexHoverd
              data={[
                {
                  name: 'CPU',
                  data: cpuData,
                },
                {
                  name: 'Memory',
                  data: memoryData,
                },
              ]} />
          {:else}
            <div class="w-full bg-blue-500/50 h-px mt-auto mb-6"></div>
          {/if}
        </div>
        <div
          class="col-span-3 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl grid grid-cols-1 gap-4 dark:sm:bg-[#0D0D0D] sm:bg-[#FFFFFF]">
          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">CPU</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>
                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.cpu_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected.cpu_usage_percent
                        ? summaryWithDate?.overall?.last_collected.cpu_usage_percent >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected.cpu_usage_percent >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected.cpu_usage_percent
                        ? summaryWithDate?.overall?.last_collected.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (1m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected.cpu_load_1
                        ? summaryWithDate?.overall?.last_collected.cpu_load_1 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected.cpu_load_1 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected.cpu_load_1
                        ? summaryWithDate?.overall?.last_collected.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (5m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected.cpu_load_5
                        ? summaryWithDate?.overall?.last_collected.cpu_load_5 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected.cpu_load_5 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected.cpu_load_5
                        ? summaryWithDate?.overall?.last_collected.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (15m) : </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected.cpu_load_15
                        ? summaryWithDate?.overall?.last_collected.cpu_load_15 >
                          LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected.cpu_load_15 >
                              LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected.cpu_load_15
                        ? summaryWithDate?.overall?.last_collected.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      .cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ].cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                    LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent >
                          LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.cpu_usage_percen
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{summaryWithDate?.overall?.last_collected?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.overall
                      .last_collected?.cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.overall?.last_collected?.cpu_usage_percent >
                    LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.overall?.last_collected?.cpu_usage_percent >
                          LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.overall?.last_collected?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.overall?.last_collected?.cpu_usage_percent
                      ? summaryWithDate?.overall?.last_collected?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#a855f7] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">CPU</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>
                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_usage_percent
                        ? metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}">
                      {metricPointDetail?.cpu_usage_percent
                        ? metricPointDetail?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_usage_percent
                        ? chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_usage_percent
                        ? chart?.last_history?.cpu_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (1m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_1
                        ? metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_1 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_1
                        ? metricPointDetail?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_1
                        ? chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_1 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_1
                        ? chart?.last_history?.cpu_load_1 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (5m): </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_5
                        ? metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_5 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_5
                        ? metricPointDetail?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_5
                        ? chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_5 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_5
                        ? chart?.last_history?.cpu_load_5 + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Av (15m) : </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.cpu_load_15
                        ? metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.cpu_load_15 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.cpu_load_15
                        ? metricPointDetail?.cpu_load_15 + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.cpu_load_15
                        ? chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.cpu_load_15 > LIMITATIONS.cpu.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.cpu_load_15 ? '%' : 'Unknown'}</span>
                  {/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{metricPointDetail?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.cpu_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.cpu_usage_percent
                      ? metricPointDetail?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{chart?.last_history?.cpu_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_collected
                      ?.cpu_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.cpu_usage_percent > LIMITATIONS.cpu.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.cpu_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.cpu_usage_percent
                      ? chart?.last_history?.cpu_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <div class="w-full h-0.5 bg-[#0D0D0D]/5 dark:bg-white/5 rounded-full"></div>

          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Memory</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                          LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]
                                ?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}">
                      {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent +
                          '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected?.memory_usage_percent
                        ? summaryWithDate?.overall?.last_collected?.memory_usage_percent >
                          LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected?.memory_usage_percent >
                              LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected?.memory_usage_percent
                        ? summaryWithDate?.overall?.last_collected?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_total_mb}

                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if summaryWithDate?.overall?.last_collected?.memory_total_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.memory_total_mb}

                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}
                    <span class="text-xs text-[#F87171]">Unknown</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_used_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.overall?.last_collected?.memory_used_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.memory_used_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_available_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.overall?.last_collected?.memory_available_mb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.memory_available_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ]?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent >
                          LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.memory_usage_percent +
                        '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{summaryWithDate?.overall?.last_collected?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_collected
                      ?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.overall?.last_collected?.memory_usage_percent >
                    LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.overall?.last_collected?.memory_usage_percent >
                          LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.overall?.last_collected?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.overall?.last_collected?.memory_usage_percent
                      ? summaryWithDate?.overall?.last_collected?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#3b82f6] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Memory</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.memory_usage_percent
                        ? metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.memory_usage_percent
                        ? metricPointDetail?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.memory_usage_percent
                        ? chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.memory_usage_percent
                        ? chart?.last_history?.memory_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_total_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_total_mb}

                        <sub class="text-white/40">Mb</sub>
                      </span>
                    {:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if chart?.last_history?.memory_total_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_total_mb}

                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}
                    <span class="text-xs text-[#F87171]">Unknown</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_used_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_used_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.memory_used_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_used_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.memory_available_mb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.memory_available_mb}
                        <sub class="text-white/40">Mb</sub>
                      </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.memory_available_mb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.memory_available_mb}
                      <sub class="text-white/40">Mb</sub>
                    </span>{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>

              <div
                class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                {#if isMouseInside}
                  <div
                    style="width:{metricPointDetail?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.memory_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.memory_usage_percent
                      ? metricPointDetail?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {:else}
                  <div
                    style="width:{chart?.last_history?.memory_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_collected
                      ?.memory_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.memory_usage_percent > LIMITATIONS.memory.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.memory_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.memory_usage_percent
                      ? chart?.last_history?.memory_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                {/if}
              </div>
            </div>{/if}

          <div class="h-px w-full bg-white/10"></div>

          {#if date}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Disk</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {summaryWithDate?.chart_series?.[pointIndexHoverd]
                        ?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                          LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                              LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                        ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent +
                          '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {summaryWithDate?.overall?.last_collected?.disk_usage_percent
                        ? summaryWithDate?.overall?.last_collected?.disk_usage_percent >
                          LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : summaryWithDate?.overall?.last_collected?.disk_usage_percent >
                              LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{summaryWithDate?.overall?.last_collected?.disk_usage_percent
                        ? summaryWithDate?.overall?.last_collected?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb}
                        <sub class="text-white/40">Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.overall?.last_collected?.disk_total_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.disk_total_gb}
                      <sub class="text-white/40">Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.overall?.last_collected?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>
                  {#if isMouseInside}
                    {#if summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb && summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_total_gb -
                          summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if summaryWithDate?.overall?.last_collected?.disk_total_gb && summaryWithDate?.overall?.last_collected?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{summaryWithDate?.overall?.last_collected?.disk_total_gb -
                        summaryWithDate?.overall?.last_collected?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>
              {#if isMouseInside}
                <div
                  class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{summaryWithDate?.chart_series?.[pointIndexHoverd]
                      ?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.chart_series[
                      pointIndexHoverd
                    ]?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                    LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent >
                          LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent
                      ? summaryWithDate?.chart_series?.[pointIndexHoverd]?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>
              {:else}
                <div
                  class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{summaryWithDate?.overall?.last_collected?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {summaryWithDate?.overall
                      .last_collected?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {summaryWithDate?.overall?.last_collected?.disk_usage_percent >
                    LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : summaryWithDate?.overall?.last_collected?.disk_usage_percent >
                          LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {summaryWithDate
                      ?.overall?.last_collected?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {summaryWithDate?.overall?.last_collected?.disk_usage_percent
                      ? summaryWithDate?.overall?.last_collected?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>{/if}
            </div>
          {:else}
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="flex justify-start items-start gap-2">
                <span class="h-full w-0.5 bg-[#10b981] rounded-full"></span>
                <span class="text-lg text-black dark:text-white">Disk</span>
              </div>

              <div class="w-full grid grid-cols-2 grid-rows-2 gap-y-2 gap-x-4">
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Usage: </span>

                  {#if isMouseInside}
                    <span
                      class="text-xs {metricPointDetail?.disk_usage_percent
                        ? metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{metricPointDetail?.disk_usage_percent
                        ? metricPointDetail?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {:else}
                    <span
                      class="text-xs {chart?.last_history?.disk_usage_percent
                        ? chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                          ? 'text-[#F87171]'
                          : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                            ? 'text-[#F97316]'
                            : 'text-green-700'
                        : 'text-[#F87171]'}"
                      >{chart?.last_history?.disk_usage_percent
                        ? chart?.last_history?.disk_usage_percent + '%'
                        : 'Unknown'}</span>
                  {/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Total: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_total_gb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.disk_total_gb}
                        <sub class="text-white/40">Gb</sub></span>
                    {:else}
                      <span class="text-xs text-[#F87171]">Unknown</span>
                    {/if}
                  {:else if chart?.last_history?.disk_total_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_total_gb}
                      <sub class="text-white/40">Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Used: </span>

                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_used_gb}<span class="text-xs text-white"
                        >{metricPointDetail?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
                <div class="w-full flex justify-between items-start gap-1">
                  <span class="text-white/40 text-xs">Available: </span>
                  {#if isMouseInside}
                    {#if metricPointDetail?.disk_total_gb && metricPointDetail?.disk_used_gb}
                      <span class="text-xs text-white"
                        >{metricPointDetail?.disk_total_gb - metricPointDetail?.disk_used_gb}
                        <sub class="text-white/40"> Gb</sub></span
                      >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                  {:else if chart?.last_history?.disk_total_gb && chart?.last_history?.disk_used_gb}
                    <span class="text-xs text-white"
                      >{chart?.last_history?.disk_total_gb - chart?.last_history?.disk_used_gb}
                      <sub class="text-white/40"> Gb</sub></span
                    >{:else}<span class="text-xs text-[#F87171]">Unknown</span>{/if}
                </div>
              </div>
              {#if isMouseInside}
                <div
                  class="w-full rounded-md relative h-5 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{metricPointDetail?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {metricPointDetail?.disk_usage_percent ===
                    100
                      ? 'rounded-e-md'
                      : ''} {metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : metricPointDetail?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {metricPointDetail?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {metricPointDetail?.disk_usage_percent
                      ? metricPointDetail?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>
              {:else}
                <div
                  class="w-full rounded-md relative h-6 flex justify-start items-center overflow-hidden bg-white/5">
                  <div
                    style="width:{chart?.last_history?.disk_usage_percent}%;"
                    class="h-full rounded-s-md transition-all {chart?.last_history
                      ?.disk_usage_percent === 100
                      ? 'rounded-e-md'
                      : ''} {chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.error
                      ? 'bg-[#EF4444]'
                      : chart?.last_history?.disk_usage_percent > LIMITATIONS.disk.warn
                        ? 'bg-[#F97316]'
                        : 'bg-green-700'}">
                  </div>

                  <div
                    class="absolute z-10 flex justify-center items-center rounded-full end-2 top-1/2 -translate-y-1/2 text-xs {chart
                      ?.last_history?.disk_usage_percent
                      ? 'text-white'
                      : 'text-[#F87171]'}">
                    {chart?.last_history?.disk_usage_percent
                      ? chart?.last_history?.disk_usage_percent + '%'
                      : 'Unknown'}
                  </div>
                </div>{/if}
            </div>{/if}
        </div>
      </div>

      {#if summary}
        <div
          class="w-full grid grid-cols-6 gap-8 border border-[#0D0D0D]/5 dark:border-white/5 p-6 rounded-xl">
          {#each summary as item, i}
            {@const historyMap = new Map(Object.entries(item?.history ?? {}))}
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-center w-full border-b border-b-white/15 pb-1">
                <span class="text-sm text-white"> {getMonthName(item?.month)}</span>
                <div class="flex flex-col">
                  <div
                    class="text-xs items-center justify-end gap-1 flex {item?.uptime >= 90
                      ? 'text-[#008236]'
                      : item?.uptime >= 80
                        ? 'text-[#00D492]'
                        : item?.uptime >= 70
                          ? 'text-[#FDC700]'
                          : item?.uptime >= 50
                            ? 'text-[#F97316]'
                            : 'text-[#EF4444]'}">
                    {#if item?.uptime === 0}
                      <span class="text-white/20 text-xs">No Data</span>
                    {:else}
                      <span> {item?.uptime}%</span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-7 grid-rows-5 gap-4 w-full">
                <div style="grid-column: span {new Date(item?.year, item?.month - 1, 1).getDay()};">
                </div>
                {#each historyMap as [day, value], i}
                  {@const isSpecialModeWithDate =
                    date &&
                    Number(date?.year) === Number(item?.year) &&
                    Number(date?.month) === Number(item?.month) &&
                    Number(date?.day) === Number(day)}
                  <button
                    onclick={() => {
                      const newUrl = new URL($page.url);
                      newUrl.searchParams.set('year', item?.year);
                      newUrl.searchParams.set('month', item?.month);
                      newUrl.searchParams.set('day', day);

                      goto(newUrl, {
                        keepfocus: true,
                        noScroll: true,
                      });
                    }}
                    style={isSpecialModeWithDate
                      ? `box-shadow: 0 0 7px 4px ${
                          value >= 90
                            ? 'rgba(0, 130, 54, 0.4)'
                            : value >= 80
                              ? '#00863864'
                              : value >= 70
                                ? 'rgba(253, 199, 0, 0.4)'
                                : value >= 50
                                  ? 'rgba(249, 115, 22, 0.4)'
                                  : 'rgba(239, 68, 68, 0.4)'
                        };`
                      : ''}
                    class="text-white aspect-square transition-all w-full flex items-center justify-center relative border border-white/15 group {isSpecialModeWithDate
                      ? 'animate-pulse'
                      : 'cursor-pointer'} {value >= 90
                      ? 'bg-[#008236]'
                      : value >= 80
                        ? 'bg-[#00863864]'
                        : value >= 70
                          ? 'bg-[#FDC700]'
                          : value >= 50
                            ? 'bg-[#F97316]'
                            : value !== null
                              ? 'bg-[#EF4444]'
                              : ' shadow-inner shadow-white/5 cursor-default!'} ">
                    <div
                      class="hidden absolute min-w-40 text-sm -top-20 border border-white/15 px-3 py-2 flex-col gap-1 bg-black/80 backdrop-blur-2xl rounded-xl z-10 {value !==
                        null && !isSpecialModeWithDate
                        ? 'group-hover:flex'
                        : ''}">
                      <div class="flex justify-between items-center">
                        <span class="text-[#6a7282] text-nowrap">Uptime :</span>
                        <span
                          class="text-nowrap {value >= 90
                            ? 'text-[#008236]'
                            : value >= 80
                              ? 'text-[#00D492]'
                              : value >= 70
                                ? 'text-[#FDC700]'
                                : value >= 50
                                  ? 'text-[#F97316]'
                                  : 'text-[#EF4444]'}">{value}%</span>
                      </div>

                      <span
                        class="text-white/30 text-nowrap border-t pt-1 border-t-white/15 text-start"
                        >{item?.year}/{item?.month}/{day}</span>
                    </div>
                    <span class="absolute start-1/2 top-1/2 -translate-1/2">-</span>
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>
