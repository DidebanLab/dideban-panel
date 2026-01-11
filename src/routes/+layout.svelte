<script>
  import { page } from '$app/stores';
  import Modal from '../components/global/Modal.svelte';
  import Sidebar from '../components/global/sidebar/Sidebar.svelte';
  import Topbar from '../components/global/Topbar.svelte';
  import MainLayout from '../components/layouts/MainLayout.svelte';
  import './layout.css';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={'/icons/monitoring.png'} />
</svelte:head>

{#if $page.url.pathname !== '/login'}
  <Modal />
  <Sidebar />
{/if}

<MainLayout>
  {#if $page.url.pathname !== '/login'}
    <Topbar />
  {/if}

  {@render children()}
</MainLayout>
