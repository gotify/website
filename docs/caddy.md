---
id: caddy
title: Caddy 2 reverse proxy
---

Setting up [Caddy](https://caddyserver.com) as a reverse proxy is very straightforward. Here are two config examples.

# As a standalone domain

Here is a sample config file if you run your gotify instance on port 1245

```
gotify.example.com {
  # Set the port to the one you are using in gotify
  # Websocket support, proxy headers, etc. are enabled by default
  reverse_proxy localhost:1245
}
```

Caddy automatically deploys SSL certificates from Let's Encrypt for your domain. If you want to explicitly disable TLS encryption, prefix your server name with `http://`.

# At a subpath

Here is the equivalent of the sample config above but running under a sub path.

```
example.com {
  route /gotify/* {
    uri strip_prefix /gotify
    # Set the port to the one you are using in gotify
    reverse_proxy localhost:1245
  }
  redir /gotify /gotify/
}
```
