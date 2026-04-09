// longPolling.svelte.js
import { http } from './http.svelte';

export default function longPolling(url, options = {}) {
  const config = {
    params: options.params || {},
    timeout: options.timeout || 10000,
    retryDelay: options.retryDelay || 3000,
    interval: options.interval || 18000000, // ⭐ تأخیر بین درخواست‌ها
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
  let pollId = 0;

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
      return response.data?.data ?? response.data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const poll = async () => {
    const currentPollId = pollId;

    while (isPolling && pollId === currentPollId) {
      try {
        const data = await makeRequest();

        if (!isPolling || pollId !== currentPollId) break;

        currentDelay = config.retryDelay;
        retryCount = 0;

        await config.onSuccess(data);

        // ⭐ تأخیر بین درخواست‌های موفق - حیاتی!
        await delay(config.interval);
      } catch (error) {
        if (!isPolling || pollId !== currentPollId) break;

        await config.onError(error, retryCount);

        if (retryCount >= config.maxRetries) {
          break;
        }

        await config.onRetry?.(retryCount, error);
        retryCount++;

        await delay(currentDelay);
        currentDelay = Math.min(currentDelay * 1.5, 30000);
      }
    }

    if (pollId === currentPollId) {
      isPolling = false;
      config.onStop();
    }
  };

  const start = () => {
    if (isPolling) return;
    isPolling = true;
    pollId++;
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
