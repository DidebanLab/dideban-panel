<script>
  import Topbar from '../../components/global/Topbar.svelte';

  let { children } = $props();
</script>



{@render children()}
