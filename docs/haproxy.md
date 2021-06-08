---
id: haproxy
title: Haproxy reverse proxy
---

Here are configuration examples for setting up Haproxy as reverse proxy for gotify/server.

## Proxy requests

```haproxy
frontend www
    bind 0.0.0.0:80
    default_backend backend_gotify
    timeout client 60s

backend backend_gotify
    server  backend01       127.0.0.1:GOTIFY_PORT  check
    timeout connect 10s
    timeout server 60s
```
