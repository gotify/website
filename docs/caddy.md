# Caddy 2 reverse proxy

Here are configuration examples for setting up [Caddy](https://caddyserver.com) as a reverse proxy for Gotify.

## As a standalone domain

Here is a sample config file if your Gotify instance runs on port 1245.

```
gotify.example.com {
  # Set the port to the one you are using in Gotify
  # WebSocket support, proxy headers, etc. are enabled by default
  reverse_proxy localhost:1245
}
```

Caddy automatically obtains TLS certificates from Let's Encrypt for your domain. If you want to explicitly disable TLS, prefix your server name with `http://`.

## At a subpath

Here is the equivalent of the sample config above but running at a subpath.

```
example.com {
  route /gotify/* {
    uri strip_prefix /gotify
    # Set the port to the one you are using in Gotify
    reverse_proxy localhost:1245
  }
  redir /gotify /gotify/
}
```
