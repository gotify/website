---
id: nginx
title: nginx config
---

You may want to use your nginx server as a reverse proxy to run gotify.

# At the root of the domain

Here is a sample config file if you run your gotify instance on port 1245

```nginx
upstream gotify {
  # Set the port to the one you are using in gotify
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

    # Ensuring it can use websockets
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto http;
    proxy_redirect     http:// $scheme://;

    # The proxy must preserve the host because gotify verifies the host with the origin
    # for WebSocket connections
    proxy_set_header   Host $http_host;

    # These sets the timeout so that the websocket can stay alive
    proxy_connect_timeout   7m;
    proxy_send_timeout      7m;
    proxy_read_timeout      7m;
  }
}
```

If you want to use https, keep it to false in gotify and rely on nginx to set it up like you would with any other website.

# At a subpath

Here is the equivalent of the sample config above but running in a subpath

```nginx
upstream gotify {
  # Set the port to the one you are using in gotify
  server 192.168.178.34:8080;
}

server {
  listen 80;

  server_name localhost;

  location /gotify/ {
    proxy_pass         http://gotify;
    rewrite ^/gotify(/.*) $1 break;
    proxy_http_version 1.1;

    # Ensuring it can use websockets
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header   X-Forwarded-Proto http;
    proxy_redirect     http:// $scheme://;

    # The proxy must preserve the host because gotify verifies the host with the origin
    # for WebSocket connections
    proxy_set_header   Host $http_host;

    proxy_connect_timeout   7m;
    proxy_send_timeout      7m;
    proxy_read_timeout      7m;
  }
}
```
