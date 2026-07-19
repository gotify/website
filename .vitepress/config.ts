import {defineConfig} from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: 'Gotify',
  description: 'a simple server for sending and receiving messages',
  sitemap: {hostname: 'https://gotify.net'},

  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  head: [['link', {rel: 'icon', type: 'image/png', href: '/img/favicon.png'}]],

  themeConfig: {
    logo: '/img/logo.png',
    externalLinkIcon: true,
    search: {provider: 'local'},
    nav: [
      {text: 'Docs', link: '/docs/'},
      {text: 'API-Docs', link: '/api-docs'},
    ],
    sidebar: {
      '/docs/': [
        {
          text: 'Getting Started',
          items: [
            {text: 'Intro', link: '/docs/'},
            {text: 'Installation', link: '/docs/install'},
            {text: 'Configuration', link: '/docs/config'},
            {text: 'First Login', link: '/docs/first-login'},
            {text: 'Push messages', link: '/docs/pushmsg'},
            {text: 'Message Priority', link: '/docs/priority'},
            {text: 'Message Extras', link: '/docs/msgextras'},
          ],
        },
        {
          text: 'REST-API',
          items: [{text: 'Swagger Documentation', link: '/api-docs'}],
        },
        {
          text: 'Plugins',
          items: [
            {text: 'Intro to Gotify Plugins', link: '/docs/plugin'},
            {text: 'Writing Plugins', link: '/docs/plugin-write'},
            {
              text: 'Building and Deploying Plugins',
              link: '/docs/plugin-deploy',
            },
          ],
        },
        {
          text: 'Development',
          items: [
            {text: 'Setup Environment', link: '/docs/dev-setup'},
            {text: 'Servers and Tests', link: '/docs/dev-server-and-tests'},
            {text: 'Build Gotify', link: '/docs/build'},
            {
              text: 'Testing unreleased changes',
              link: '/docs/testing-master',
            },
          ],
        },
        {
          text: 'Guides',
          items: [
            {text: 'Migrate to 3.x', link: '/docs/migrate-to-3'},
            {text: '(more) Push message examples', link: '/docs/more-pushmsg'},
            {text: 'OpenID Connect', link: '/docs/oidc'},
            {text: 'Optimize uploaded images', link: '/docs/optimize-images'},
            {text: 'Session Elevation', link: '/docs/session-elevation'},
            {text: 'Systemd configuration', link: '/docs/systemd'},
            {
              text: 'Reverse Proxies',
              items: [
                {text: 'Apache', link: '/docs/apache'},
                {text: 'Caddy 2', link: '/docs/caddy'},
                {text: 'HAProxy', link: '/docs/haproxy'},
                {text: 'Nginx', link: '/docs/nginx'},
                {text: 'Traefik', link: '/docs/traefik'},
              ],
            },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/gotify/website/tree/master/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [{icon: 'github', link: 'https://github.com/gotify'}],
  },
});
