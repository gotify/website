---
id: config
title: Configuration
---

gotify/server can be configured per config file and environment variables.
When using docker it is recommended to use environment variables.

## Config File

gotify/server looks in the following paths for config files

- ./config.yml
- /etc/gotify/config.yml

**Note**: When strings contain reserved yml characters then they need to be escaped.
[A list of reserved characters and how to escape them.](https://stackoverflow.com/a/22235064/4244993)

**Note**: The config file `/etc/gotify/config.yml` can contain sensitive data
such as the initial admin password. When using it, you should remove read/write
rights from users not owning the file:

```bash
$ sudo chmod go-rw /etc/gotify/config.yml
```

```yml
server:
  keepaliveperiodseconds: 0 # 0 = use Go default (15s); -1 = disable keepalive; set the interval in which keepalive packets will be sent. Only change this value if you know what you are doing.
  listenaddr: '' # the address to bind on, leave empty to bind on all addresses. Prefix with "unix:" to create a unix socket. Example: "unix:/tmp/gotify.sock".
  port: 80 # the port the HTTP server will listen on

  ssl:
    enabled: false # if https should be enabled
    redirecttohttps: true # redirect to https if site is accessed by http
    listenaddr: '' # the address to bind on, leave empty to bind on all addresses. Prefix with "unix:" to create a unix socket. Example: "unix:/tmp/gotify.sock".
    port: 443 # the https port
    certfile: # the cert file (leave empty when using letsencrypt)
    certkey: # the cert key (leave empty when using letsencrypt)
    letsencrypt:
      enabled: false # if the certificate should be requested from letsencrypt
      accepttos: false # if you accept the tos from letsencrypt
      cache: data/certs # the directory of the cache from letsencrypt
      hosts: # the hosts for which letsencrypt should request certificates
  #     - mydomain.tld
  #     - myotherdomain.tld
  responseheaders: # response headers are added to every response (default: none)
  # X-Custom-Header: "custom value"
  trustedproxies: # IPs or IP ranges of trusted proxies. Used to obtain the remote ip via the X-Forwarded-For header. (configure 127.0.0.1 to trust sockets)
  #   - 127.0.0.1
  #   - 192.168.178.0/24
  #   - ::1

  cors: # Sets cors headers only when needed and provides support for multiple allowed origins. Overrides Access-Control-* Headers in response headers.
    alloworigins:
    # - ".+.example.com"
    # - "otherdomain.com"
    allowmethods:
    # - "GET"
    # - "POST"
    allowheaders:
  #   - "Authorization"
  #   - "content-type"

  stream:
    pingperiodseconds: 45 # the interval in which websocket pings will be sent. Only change this value if you know what you are doing.
    allowedorigins: # allowed origins for websocket connections (same origin is always allowed, default only same origin)
#     - ".+.example.com"
#     - "otherdomain.com"
database: # see below
  dialect: sqlite3
  connection: data/gotify.db
defaultuser: # on database creation, gotify creates an admin user (these values will only be used for the first start, if you want to edit the user after the first start use the WebUI)
  name: admin # the username of the default user
  pass: admin # the password of the default user
passstrength: 10 # the bcrypt password strength (higher = better but also slower)
uploadedimagesdir: data/images # the directory for storing uploaded images
pluginsdir: data/plugins # the directory where plugin resides (leave empty to disable plugins)
registration: false # enable registrations
```

You can download an example config like this:

```bash
$ wget -O config.yml https://raw.githubusercontent.com/gotify/server/master/config.example.yml
```

**Note: the example config doesn't only contain default values.**

## Database

| Dialect  |                                     Connection                                     |
| :------: | :--------------------------------------------------------------------------------: |
| sqlite3  |                               `path/to/database.db`                                |
|  mysql   | `gotify:secret@tcp(localhost:3306)/gotifydb?charset=utf8&parseTime=True&loc=Local` |
| postgres |       `host=localhost port=5432 user=gotify dbname=gotifydb password=secret`       |

When using postgres without SSL then `sslmode=disable` must be added to the connection string.
See [#90](https://github.com/gotify/server/issues/90).

> For `mysql` and `postgres`: Make sure the defined database exists and the user has sufficient permissions.

## Environment Variables

Strings in list or map environment settings (f.ex. `GOTIFY_SERVER_RESPONSEHEADERS` and `GOTIFY_SERVER_SSL_LETSENCRYPT_HOSTS`) need to be escaped.
[A list of reserved characters and how to escape them.](https://stackoverflow.com/a/22235064/4244993)

See yml config documentation.

```bash
GOTIFY_SERVER_PORT=80
GOTIFY_SERVER_KEEPALIVEPERIODSECONDS=0
GOTIFY_SERVER_LISTENADDR=
GOTIFY_SERVER_SSL_ENABLED=false
GOTIFY_SERVER_SSL_REDIRECTTOHTTPS=true
GOTIFY_SERVER_SSL_LISTENADDR=
GOTIFY_SERVER_SSL_PORT=443
GOTIFY_SERVER_SSL_CERTFILE=
GOTIFY_SERVER_SSL_CERTKEY=
GOTIFY_SERVER_SSL_LETSENCRYPT_ENABLED=false
GOTIFY_SERVER_SSL_LETSENCRYPT_ACCEPTTOS=false
GOTIFY_SERVER_SSL_LETSENCRYPT_CACHE=certs
# GOTIFY_SERVER_SSL_LETSENCRYPT_HOSTS=[mydomain.tld, myotherdomain.tld]
# GOTIFY_SERVER_RESPONSEHEADERS={X-Custom-Header: "custom value", x-other: value}
# GOTIFY_SERVER_TRUSTEDPROXIES=[127.0.0.1,192.168.178.2/24]
# GOTIFY_SERVER_CORS_ALLOWORIGINS=[.+\.example\.com, otherdomain\.com]
# GOTIFY_SERVER_CORS_ALLOWMETHODS=[GET, POST]
# GOTIFY_SERVER_CORS_ALLOWHEADERS=[X-Gotify-Key, Authorization]
# GOTIFY_SERVER_STREAM_ALLOWEDORIGINS=[.+.example\.com, otherdomain\.com]
GOTIFY_SERVER_STREAM_PINGPERIODSECONDS=45
GOTIFY_DATABASE_DIALECT=sqlite3
GOTIFY_DATABASE_CONNECTION=data/gotify.db
GOTIFY_DEFAULTUSER_NAME=admin
GOTIFY_DEFAULTUSER_PASS=admin
GOTIFY_PASSSTRENGTH=10
GOTIFY_UPLOADEDIMAGESDIR=data/images
GOTIFY_PLUGINSDIR=data/plugins
GOTIFY_REGISTRATION=false
```
