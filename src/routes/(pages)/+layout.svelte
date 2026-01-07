<script>
  import Modal from '../../components/global/Modal.svelte';
  import Sidebar from '../../components/global/sidebar/Sidebar.svelte';
  import MainLayout from '../../components/layouts/MainLayout.svelte';

  let { children } = $props();
</script>

<Modal />
<Sidebar />
<MainLayout>
  {@render children()}
</MainLayout>
