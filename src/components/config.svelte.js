export const LIMITATIONS = {
  cpu: { error: 80, warn: 60 },
  memory: { error: 80, warn: 60 },
  disk: { error: 90, warn: 70 },
  collect_duration_ms: { error: 4000, warn: 2000 },
};

export const AGENT_LIMIT = {
  interval: {
    min: 1,
    max: 5,
  },
  timeout: {
    min: 1,
    max: 10,
  },
};
