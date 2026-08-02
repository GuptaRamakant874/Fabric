const normalizeBaseUrl = (value) => value?.replace(/\/$/, '') || '';

export const getApiBaseUrl = () => {
  const envValue = import.meta.env.VITE_API_URL?.trim();

  if (envValue) {
    return normalizeBaseUrl(envValue.replace(/\/api\/?$/, ''));
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    if (isLocalHost) {
      return 'http://localhost:5000';
    }

    return '';
  }

  return 'http://localhost:5000';
};

export const resolveAssetUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) {
    return value;
  }

  if (value.startsWith('/')) {
    const baseUrl = getApiBaseUrl();
    return baseUrl ? `${baseUrl}${value}` : value;
  }

  return value;
};
