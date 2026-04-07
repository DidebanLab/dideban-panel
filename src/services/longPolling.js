import { http } from './http.svelte';

function longPolling(url, options = {}) {
  const config = {
    params: options.params || {},
    timeout: options.timeout || 10000,
    retryDelay: options.retryDelay || 3000,
    maxRetries: options.maxRetries || Infinity,
    onSuccess: options.onSuccess || (() => {}),
    onError: options.onError || (() => {}),
    onStop: options.onStop || (() => {}),
    onStart: options.onStart || (() => {}),
  };

  let isPolling = false;
  let abortController = null;
  let currentDelay = config.retryDelay;
  let retryCount = 0;

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const makeRequest = async () => {
    abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), config.timeout);

    try {
      const response = await http.get(url, {
        params: config.params,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      return response.data;
    } catch (error) {
      clearTimeout(timeoutId);
    }
  };

  const poll = async () => {
    while (isPolling) {
      try {
        const data = await makeRequest();

        currentDelay = config.retryDelay;
        retryCount = 0;

        await config.onSuccess(data);
      } catch (error) {
        await config.onError(error, retryCount);

        if (retryCount >= config.maxRetries) {
          break;
        }

        await config.onRetry(retryCount, error);
        retryCount++;

        await delay(currentDelay);
      }
    }

    isPolling = false;
    config.onStop();
  };

  const start = () => {
    if (isPolling) return;
    isPolling = true;
    config.onStart();
    poll();
  };

  const stop = () => {
    isPolling = false;
    if (abortController) {
      abortController.abort();
    }
  };

  const restart = () => {
    stop();
    setTimeout(start, 100);
  };

  const updateConfig = newOptions => {
    Object.assign(config, newOptions);
  };

  start();

  return {
    start,
    stop,
    restart,
    updateConfig,
    isPending: () => isPolling,
  };
}
