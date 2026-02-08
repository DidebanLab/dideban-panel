export const endpoints = {
  agentsStats: '/agents/stats',
  checksStats: '/checks/stats',
  agents: '/agents',
  checks: '/checks',
  checkHistory: id => `/checks/${id}/history`,
  agentMetric: id => `/agents/${id}/metrics`,
  agentHistory: id => `/agents/${id}/history`,
  //---------------

  login: '',
  performanceOverview: '',
  topRight: '',
  statusOverview: '.../',
  latency: '/',
  alerts: '/',
  uptimeHistory: '/uptime/',
};
