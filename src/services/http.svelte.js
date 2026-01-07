import axios from 'axios';
import { openDB, addData, getData, deleteData } from './db.svelte';
import { PUBLIC_API } from '$env/static/public';

const dbName = 'dideban';
const storeName = 'cacheStore';
export const baseURL = PUBLIC_API;

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

const cacheKey = (url, params) => `${url}${params ? ':' + JSON.stringify(params) : ''}`;

const isCacheExpired = item => Date.now() > item.expiry;

http.interceptors.request.use(
  async config => {
    config.useCache = config.useCache ?? false;
    config.cacheExpiry = config.cacheExpiry ?? 43200000;

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
http.interceptors.response.use(
  async response => {
    const { config } = response;

    if (config.__fromCache) {
      return {
        data: config.__cacheData,
        status: 200,
        cached: true,
        config,
      };
    }

    if (config.useCache) {
      const key = cacheKey(config.url, config.params);
      const expiry = Date.now() + config.cacheExpiry;

      try {
        const db = await openDB(dbName, storeName);
        await addData(db, storeName, { id: key, data: response.data, expiry });
      } catch (e) {
        if (e.name !== 'ConstraintError') throw e;
      }
    }

    return response;
  },

  error => {
    return Promise.reject(error);
  },
);
