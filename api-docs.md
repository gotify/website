---
layout: page
title: API Documentation
head:
  - [link, {rel: stylesheet, href: /swagger/swagger-ui.css}]
  - [script, {src: /swagger/swagger-ui-bundle.js}]
  - [script, {src: /swagger/swagger-ui-standalone-preset.js}]
---

<div id="swagger-ui"></div>

<script setup>
import { data as urls } from './api-docs.data.ts'
import { onMounted } from 'vue'
import { fetchUrls } from './api-docs-fetcher.ts'

onMounted(() => {
  fetchUrls()
    .catch((e) => {
      console.log("Failed to load tags", e)
      return urls;
    })
    .then(urls => {
      window.SwaggerUIBundle({
        urls,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
        plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout',
      })
    })
})
</script>
