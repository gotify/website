import {fetchUrls} from './api-docs-fetcher';

// This is evaluated at build-time: https://vitepress.dev/guide/data-loading
export default {
  async load() {
    return fetchUrls();
  },
};
