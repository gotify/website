fetch('https://api.github.com/repos/gotify/server/tags', {
    headers: {Accept: 'application/vnd.github.v3+json'},
})
    .then((r) => r.json())
    .then((tags) => {
        window.SwaggerUIBundle({
            urls: tags.map((tag) => ({
                url: `https://raw.githubusercontent.com/gotify/server/${tag.name}/docs/spec.json`,
                name: tag.name,
            })),
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIStandalonePreset],
            plugins: [window.SwaggerUIBundle.plugins.DownloadUrl],
            layout: 'StandaloneLayout',
        });
    });
