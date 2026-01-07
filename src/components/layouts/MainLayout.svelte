<script>
  import Topbar from '../global/Topbar.svelte';
  let { children } = $props();
</script>

<main class="w-full h-screen overflow-y-auto custom-scroll">
  <Topbar />
  {@render children()}
</main>

<style>
  :global(.custom-scroll::-webkit-scrollbar) {
    width: 4px;
  }

  :global(.custom-scroll::-webkit-scrollbar-track) {
    background: rgba(69, 74, 82, 0.5);
    border-radius: 9999px;
  }

  :global(.custom-scroll::-webkit-scrollbar-thumb) {
    background: #454a52;
    border-radius: 9999px;
  }
</style>
