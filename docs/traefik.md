---
id: traefik
title: Traefik reverse proxy
---

```yaml
services:
  traefik:
    image: 'traefik:v3.2'
    container_name: 'traefik'
    command:
      - '--providers.docker=true'
      - '--providers.docker.exposedbydefault=false'
      - '--entryPoints.websecure.address=:443'
      - '--certificatesresolvers.letsencrypt.acme.tlschallenge=true'
      - '--certificatesresolvers.letsencrypt.acme.email=<INSERT_YOUR_EMAIL>'
      - '--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json'
    ports:
      - '443:443'
    volumes:
      - './letsencrypt:/letsencrypt'
      - '/var/run/docker.sock:/var/run/docker.sock:ro'

  gotify:
    image: gotify/server:<CURRENT_VERSION>
    labels:
      'traefik.enable': 'true'
      'traefik.http.routers.gotify.rule': 'Host(`gotify.yourdomain.tld`)'
      'traefik.http.routers.gotify.entrypoints': 'websecure'
      'traefik.http.routers.gotify.tls.certresolver': 'letsencrypt'
```

This should expose gotify with tls on `gotify.yourdomain.tld` using traefik as
a reverse proxy. See https://doc.traefik.io/traefik/ for more information.
