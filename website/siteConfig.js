const siteConfig = {
    title: 'Gotify',
    tagline: 'a simple server for sending and receiving messages',
    url: 'https://gotify.net',
    baseUrl: '/',

    projectName: 'website',
    organizationName: 'gotify',

    headerLinks: [
        {doc: 'index', label: 'Docs'},
        {href: 'https://gotify.github.io/api-docs', label: 'API'},
        {href: 'https://github.com/gotify', label: 'SourceCode'},
    ],

    footerIcon: 'img/logo.png',
    favicon: 'img/favicon.png',

    colors: {
        primaryColor: '#3498db',
        secondaryColor: '#2980b9',
    },

    highlight: {
        theme: 'default',
    },

    onPageNav: 'separate',
    cleanUrl: true,
    editUrl: 'https://github.com/gotify/website/edit/master/docs/',
};

module.exports = siteConfig;
