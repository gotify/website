---
id: nginx
title: nginx config
---

You may want to use your nginx server as a reverse proxy to run gotify.

Here is a sample config file if you run your gotify instance on port 1245

```yaml
upstream gotify {
  # Set the port to the one you are using in gotify
  server 127.0.0.1:1245;
}

server {
  listen 80;
  
  # Here goes your domain / subdomain
  server_name push.example.com;
  
  # Error logs, change this to wherever you installed gotify
  error_log /opt/gotify/error.log warn;
  access_log /opt/gotify/access.log combined;
  
  location / {
    include proxy_params;
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
    
    # This is a little hack to keep the socket open, without this it would timeout after 60 seconds
    proxy_read_timeout 60d;
  }
}
```

If you want to use https, keep it to false in gotify and rely on nginx to set it up like you would with any other website.
