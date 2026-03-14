export const endpoints = {
  agentsStats: '/agents/stats',
  checksStats: '/checks/stats',
  agents: '/agents',
  checks: '/checks',
  checksSummaryDate: (id, date) => `/checks/${id}/summary/${date}`,
  checkHistory: id => `/checks/${id}/history`,
  checkHistogram: id => `/checks/${id}/histogram`,
  agentMetric: id => `/agents/${id}/metrics`,
  agentHistory: id => `/agents/${id}/history`,
  agentHistoryDetail: (agentId, historyId) => `/agents/${agentId}/history/${historyId}`,
  agentCollectDuration: agentId => `/agents/${agentId}/collect-duration`,
  checkApdexHistory: id => `/checks/${id}/apdex`,
  agentSummaryDate: (id, date) => `/agents/${id}/summary/${date}`,
  //---------------

  login: '',
  performanceOverview: '',
  topRight: '',
  statusOverview: '.../',

  alerts: '/',
  uptimeHistory: '/uptime/',
};
