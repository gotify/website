---
id: apache
title: Apache reverse proxy
---

Here are configuration examples for setting up apache as reverse proxy for gotify/server.

The following modules are required:

- mod_proxy
- mod_proxy_wstunnel
- mod_proxy_http

## Proxy requests

```apache
<VirtualHost *:80>
    ServerName domain.tld

    Keepalive On

    # Proxy web socket requests to /stream
    ProxyPass "/stream" ws://127.0.0.1:GOTIFY_PORT/ retry=0 timeout=5
    # Proxy all other requests to /
    ProxyPass "/" http://127.0.0.1:GOTIFY_PORT/ retry=0 timeout=5
    ProxyPassReverse / http://127.0.0.1:GOTIFY_PORT/
</VirtualHost>
```

## Proxy requests with sub path

```apache
<VirtualHost *:80>
    ServerName domain.tld
    Keepalive On

    Redirect 301 "/gotify" "/gotify/"

    # Proxy web socket requests to /stream
    ProxyPass "/gotify/stream" ws://127.0.0.1:GOTIFY_PORT/stream retry=0 timeout=5
    # Proxy all other requests to /
    ProxyPass "/gotify/" http://127.0.0.1:GOTIFY_PORT/ retry=0 timeout=5
    #                 ^- !!trailing slash is required!!
    ProxyPassReverse /gotify/ http://127.0.0.1:GOTIFY_PORT/
</VirtualHost>
```
