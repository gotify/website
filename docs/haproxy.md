# HAProxy reverse proxy

Here are configuration examples for setting up HAProxy as a reverse proxy for Gotify.

## Proxy requests

```txt
frontend www
    bind 0.0.0.0:80
    default_backend backend_gotify
    timeout client 60s
    timeout client-fin 30s

backend backend_gotify
    server  backend01       127.0.0.1:GOTIFY_PORT  check
    timeout connect 10s
    timeout server 60s
```
