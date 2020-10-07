---
id: traefik2
title: traefik 2 config
---

You may want to use Gotify behind the Traefik 2 proxy on your docker setup.

The configuration assumes you're configuring Traefik and Gotify through docker-compose with command line arguments and labels.

# traefik's docker-compose.yml
As Traefik's default timeout of 180 seconds is too short for Gotify's websocket connections, you'll need to adjust your entrypoint's configuration, in this case called `websecure`.

```docker
  traefik:
    image: "traefik:latest"
    command:
      [...]
      - "--entrypoints.websecure.address=:443"
      - "--entryPoints.websecure.transport.respondingTimeouts.readTimeout=420"
      - "--entryPoints.websecure.transport.respondingTimeouts.writeTimeout=420"
      - "--entryPoints.websecure.transport.respondingTimeouts.idleTimeout=420"
      [...]
```

We are using 7 minutes here as timeout values.

# gotify's docker-compose.yml

Below you can find a full example configuration of gotify with it's traefik labels.

```docker
version: '3.3'
networks:
  traefik_default:
    external: true
services:
    server:
        networks:
            - 'traefik_default'
        container_name: gotify
        volumes:
            - '/foo/bar/gotify:/app/data'
        image: gotify/server
        labels:
            - "traefik.enable=true"

            # Traefik Redirect to HTTPS
            - "traefik.http.middlewares.redirect-https.redirectScheme.scheme=https"
            - "traefik.http.middlewares.redirect-https.redirectScheme.permanent=true"

            # Traefik Router + Service Configuration
            - "traefik.http.routers.gotify-server.rule=Host(`gotify.domain.tld`)"
            - "traefik.http.routers.gotify-server.entrypoints=websecure"
            - "traefik.http.routers.gotify-server.tls=true"
            - "traefik.http.routers.gotify-server.tls.certresolver=lewildcardresolver"
            - "traefik.http.routers.gotify-server.middlewares=redirect-https"
            - "traefik.http.routers.gotify-server.service=gotify-server"
            - "traefik.http.services.gotify-server.loadbalancer.passhostheader=true"
            - "traefik.http.services.gotify-server.loadbalancer.server.port=80"
            - "traefik.http.services.gotify-server.loadbalancer.sticky=true"
            - "traefik.http.middlewares.sslheader.headers.customrequestheaders.X-Forwarded-Proto = http"
```
