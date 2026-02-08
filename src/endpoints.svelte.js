export const endpoints = {
  agentsStats: '/agents/stats',
  checksStats: '/checks/stats',
  agents: '/agents/',
  checks: '/checks',
  checkHistory: id => `/checks/${id}/history`,
  //---------------

  login: '',
  performanceOverview: '',
  topRight: '',
  statusOverview: '.../',
  latency: '/',
  alerts: '/',
  uptimeHistory: '/uptime/',
};
