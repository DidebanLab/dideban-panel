export const endpoints = {
  agentsStats: '/agents/stats',
  checksStats: '/checks/stats',
  agents: '/agents',
  checks: '/checks',
  checkHistory: id => `/checks/${id}/history`,
  agentMetric: id => `/agents/${id}/metrics`,
  agentHistory: id => `/agents/${id}/history`,
  agentHistoryDetail: (agentId, historyId) => `/agents/${agentId}/history/${historyId}`,
  checkApdexHistory: id => `/checks/${id}/apdex`,
  //---------------

  login: '',
  performanceOverview: '',
  topRight: '',
  statusOverview: '.../',

  alerts: '/',
  uptimeHistory: '/uptime/',
};
