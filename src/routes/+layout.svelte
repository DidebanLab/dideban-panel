<script>
  import { page } from '$app/stores';
  import MainLayout from '../components/layouts/MainLayout.svelte';
  import './layout.css';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={'/icons/monitoring.png'} />
</svelte:head>

<MainLayout>
  {@render children()}
</MainLayout>
