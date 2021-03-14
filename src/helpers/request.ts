import axios from 'axios';
import { storage } from './storage';
import { merge } from './merge';

export const request = axios.create({
  // Timeout 30p
  timeout: 30 * 60 * 1000,
  withCredentials: true,
});

request.interceptors.request.use(async (config) => {
  try {
    const token = await storage.get('accessToken');
    return {
      ...config,
      headers: merge(config.headers, {
        authorization: token ? `Bearer ${token}` : '',
      }),
    };
  } catch {
    return config;
  }
});
