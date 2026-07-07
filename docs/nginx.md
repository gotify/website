# nginx reverse proxy

Here are configuration examples for setting up nginx as a reverse proxy for Gotify.

## At the root of the domain

Here is a sample config file if your Gotify instance runs on port 1245.

```nginx
upstream gotify {
  # Set the port to the one you are using in Gotify
  server 127.0.0.1:1245;
}

server {
  listen 80;

  # Here goes your domain / subdomain
  server_name push.example.com;

  location / {
    # We set up the reverse proxy
    proxy_pass         http://gotify;
    proxy_http_version 1.1;

    # Ensuring it can use WebSockets
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto http;
    proxy_redirect     http:// $scheme://;

    # The proxy must preserve the host because Gotify verifies the host with the origin
    # for WebSocket connections
    proxy_set_header   Host $http_host;

    # These timeouts keep the WebSocket connection alive
    proxy_connect_timeout   1m;
    proxy_send_timeout      1m;
    proxy_read_timeout      1m;
  }
}
```

If you want to use HTTPS through nginx, keep the Gotify setting `GOTIFY_SERVER_SSL_ENABLED=false` and rely on nginx to encrypt your traffic like you would with any other website.

## At a subpath

Here is the equivalent of the sample config above but running at a subpath.

```nginx
upstream gotify {
  # Set the port to the one you are using in Gotify
  server 127.0.0.1:1245;
}

server {
  listen 80;

  server_name push.example.com;

  location /gotify/ {
    proxy_pass         http://gotify;
    rewrite ^/gotify(/.*) $1 break;
    proxy_http_version 1.1;

    # Ensuring it can use WebSockets
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto http;
    proxy_redirect     http:// $scheme://;

    # The proxy must preserve the host because Gotify verifies the host with the origin
    # for WebSocket connections
    proxy_set_header   Host $http_host;

    proxy_connect_timeout   1m;
    proxy_send_timeout      1m;
    proxy_read_timeout      1m;
  }
}
```
