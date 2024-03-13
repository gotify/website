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
    ProxyPass "/stream" ws://127.0.0.1:GOTIFY_PORT/stream retry=0 timeout=60

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
    ProxyPass "/gotify/stream" ws://127.0.0.1:GOTIFY_PORT/stream retry=0 timeout=60

    # Proxy all other requests to /
    ProxyPass "/gotify/" http://127.0.0.1:GOTIFY_PORT/ retry=0 timeout=5
    #                 ^- !!trailing slash is required!!

    ProxyPassReverse /gotify/ http://127.0.0.1:GOTIFY_PORT/
</VirtualHost>
```

## Troubleshooting

With some additional Apache configuration, the `ProxyPass` for the `/stream` endpoint may not work correctly.
The request fails with `400 Bad Request` and the following error is logged inside gotify/server.

```
Error #01: websocket: the client is not using the websocket protocol: 'upgrade' token not found in 'Connection' header
```

To fix this issue, add the following rewrite rule to your virtual host config:

```
RewriteEngine  on
RewriteCond %{HTTP:Connection} upgrade [NC]
RewriteCond %{HTTP:Upgrade} websocket [NC]
RewriteRule /gotify/stream(.*) ws://127.0.0.1:GOTIFY_PORT/stream$1 [P,L]
```
