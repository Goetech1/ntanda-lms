const DEFAULT_API_URL = 'https://api.learningzm.com/api';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
  try {
    const url = new URL(configuredUrl);
    if (url.hostname === 'api.learningzm.com' && (!url.pathname || url.pathname === '/')) {
      url.pathname = '/api';
    }
    return trimTrailingSlash(url.toString());
  } catch {
    return trimTrailingSlash(configuredUrl);
  }
};

export const API_BASE_URL = getApiBaseUrl();
