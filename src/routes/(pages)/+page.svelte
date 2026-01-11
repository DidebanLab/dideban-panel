<script>
  import { page } from '$app/state';
  import Modal from '../../components/global/Modal.svelte';
  import Sidebar from '../../components/global/sidebar/Sidebar.svelte';
  import Topbar from '../../components/global/Topbar.svelte';
  import PerformanceOverview from '../../components/pages/dashboard/PerformanceOverview.svelte';
  import { AGENTS_DATA } from '../../components/pages/dashboard/statusOverview/constant.svelte';
  import StatusOverview from '../../components/pages/dashboard/statusOverview/StatusOverview.svelte';
  import TopRight from '../../components/pages/dashboard/TopRight.svelte';
  import { MACHINE } from './machine/[machine]/constant.svelte';
</script>

<section class="w-full flex h-auto">
  <Modal />
  <Sidebar />

  <!-- Content of dashboard page -->
  <div class="w-full flex flex-col gap-7.75 p-7.75 pt-3 max-w-422.75">
    <Topbar />
    <div class="w-full flex flex-col-reverse min-[1920px]:flex-row gap-4">
      <PerformanceOverview />
      <TopRight />
    </div>

    <StatusOverview type="agents" subtitle="Infrastructure Nodes & Cluster Health" />
    <StatusOverview type="checkers" subtitle="Microservices Health & Availability" />
  </div>
</section>
