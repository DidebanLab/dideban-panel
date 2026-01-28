export const LIMITATIONS = {
  cpu: { error: 80, warn: 60 },
  memory: { error: 80, warn: 60 },
  disk: { error:55, warn: 40 },
  collect_duration_ms: { error: 4000, warn: 2000 },
};

export const AGENT_LIMIT = {
  intervalSeconds: {
    min: 1,
    max: 5,
  },
  timeoutSeconds: {
    min: 1,
    max: 10,
  },
};

export const CHECK_LIMIT = {
  intervalSeconds: {
    min: 1,
    max: 5,
  },
  timeoutSeconds: {
    min: 1,
    max: 10,
  },
};
