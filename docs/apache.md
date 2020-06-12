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

    # The proxy must preserve the host because gotify verifies the host with the origin
    # for WebSocket connections
    ProxyPreserveHost On

    # Proxy web socket requests to /stream
    ProxyPass "/stream" ws://127.0.0.1:GOTIFY_PORT/stream retry=0 timeout=5

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

    # The proxy must preserve the host because gotify verifies the host with the origin
    # for WebSocket connections
    ProxyPreserveHost On

    # Proxy web socket requests to /stream
    ProxyPass "/gotify/stream" ws://127.0.0.1:GOTIFY_PORT/stream retry=0 timeout=5

    # Proxy all other requests to /
    ProxyPass "/gotify/" http://127.0.0.1:GOTIFY_PORT/ retry=0 timeout=5
    #                 ^- !!trailing slash is required!!

    ProxyPassReverse /gotify/ http://127.0.0.1:GOTIFY_PORT/
</VirtualHost>
```

NOTE: In some configurations you can meet a WebSocket 400 error, to solve it please enable `mod_rewrite` and added 3 Rewrite Rules in a "Proxy web socket requests" section before first `ProxyPass`:

```
    RewriteEngine  on
    RewriteCond %{HTTP:Upgrade} =websocket
    RewriteRule /gotify/stream(.*) ws://127.0.0.1:GOTIFY_PORT/stream$1 [P,L]
```
