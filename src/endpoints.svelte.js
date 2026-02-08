export const endpoints = {
  agentsStats: '/agents/stats',
  checksStats: '/checks/stats',
  agents: '/agents',
  checks: '/checks',
  checkHistory: id => `/checks/${id}/history`,
  agentMetric: id => `/agents/${id}/metrics`,
  //---------------

  login: '',
  performanceOverview: '',
  topRight: '',
  statusOverview: '.../',
  latency: '/',
  alerts: '/',
  uptimeHistory: '/uptime/',
};
