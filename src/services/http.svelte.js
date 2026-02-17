import axios from 'axios';
import { openDB, addData, getData, deleteData } from './db.svelte';
import { PUBLIC_API } from '$env/static/public';
import { alertStore } from '../stores/alert.svelte';

const dbName = 'dideban';
const storeName = 'cacheStore';

export const baseURL = PUBLIC_API;

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------------- utils ---------------- */

const cacheKey = (url, params) => `${url}${params ? ':' + JSON.stringify(params) : ''}`;

const isCacheExpired = item => Date.now() > item.expiry;

/* ---------------- request interceptor ---------------- */

http.interceptors.request.use(
  async config => {
    config.useCache = config.useCache ?? false;
    config.cacheExpiry = config.cacheExpiry ?? 43200000; // 12h

    if (!config.useCache) return config;

    const key = cacheKey(config.url, config.params);
    const db = await openDB(dbName, storeName);
    const cached = await getData(db, storeName, key);

    if (!cached) return config;

    if (isCacheExpired(cached)) {
      await deleteData(db, storeName, key);
    } else {
      config.__fromCache = true;
      config.__cacheData = cached.data;
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ---------------- response interceptor ---------------- */

http.interceptors.response.use(
  async response => {
    const { config } = response;

    // return cached response
    if (config.__fromCache) {
      return {
        data: config.__cacheData,
        status: 200,
        cached: true,
        config,
      };
    }

    // save to cache
    if (config.useCache) {
      const key = cacheKey(config.url, config.params);
      const expiry = Date.now() + config.cacheExpiry;

      try {
        const db = await openDB(dbName, storeName);
        await addData(db, storeName, {
          id: key,
          data: response.data,
          expiry,
        });
      } catch (e) {
        if (e.name !== 'ConstraintError') throw e;
      }
    }

    return response;
  },

  // ❗ error handler → show alert
  error => {
    // network error
    if (error.code === 'ERR_NETWORK') {
      alertStore.addAlert({
        message: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    }

    // fallback
    else {
      alertStore.addAlert({
        message: error.response.data.error.message,
        details: error.response.data.error.details,
        type: 'error',
      });
    }

    return Promise.reject(error);
  },
);
