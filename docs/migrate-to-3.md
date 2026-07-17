# Migrate to 3.x

> [!WARNING]
> Gotify 3 isn't released yet.

---

- The `config.yml` file is no longer supported, convert it to the new env format
  with [`migrate-config`](#migrating-your-config).
- If you set list or map environment variables, their syntax changed, see
  [List and map syntax](#environment-list-and-map-syntax).
- API tokens are no longer returned in the GET endpoints and are only exposed
  on creation or rotation. See [Tokens are only shown once](#tokens-are-only-shown-once).
- If you have scripts hitting client-token endpoints, they may now need
  [elevation](#step-up-authentication).
- The `paging.next` URL in message list responses is now a relative path.
  See [Paging next URL is relative](#paging-next-url-is-relative).

## Config Changes

### YAML config file removed

The YAML config file (`config.yml`) is no longer supported. Gotify 3 is
configured only through environment variables, which can be loaded from an env
file. The first existing file from this search order is loaded:

1. `gotify-server.env` (in the working directory)
2. `$XDG_CONFIG_HOME/gotify/gotify-server.env` (`$XDG_CONFIG_HOME` falls back to `$HOME/.config` when unset)
3. `/etc/gotify/server.env`

See the [Configuration](/docs/config) page for the full list of variables.

### Migrating your config

The `migrate-config` command converts an existing `config.yml` to the new env
format. It prints the result to stdout.

```bash
$ gotify-server migrate-config config.yml > gotify-server.env
```

With Docker:

```bash
$ docker run --rm -v "$(pwd)/config.yml:/app/config.yml" gotify/server:master \
    migrate-config config.yml > gotify-server.env
```

### Environment list and map syntax

Defining settings via environment variables was already possible, but the syntax
for list and map values has changed. If you set any of the variables below, update
their format.

**Lists** are now comma-separated instead of a YAML array:

- `GOTIFY_SERVER_TRUSTEDPROXIES`
- `GOTIFY_SERVER_CORS_ALLOWORIGINS`
- `GOTIFY_SERVER_CORS_ALLOWMETHODS`
- `GOTIFY_SERVER_CORS_ALLOWHEADERS`
- `GOTIFY_SERVER_STREAM_ALLOWEDORIGINS`
- `GOTIFY_SERVER_SSL_LETSENCRYPT_HOSTS`
- `GOTIFY_OIDC_SCOPES`

```bash
# before
GOTIFY_SERVER_TRUSTEDPROXIES=[127.0.0.1/32, ::1]
# after
GOTIFY_SERVER_TRUSTEDPROXIES=127.0.0.1/32,::1
```

**Maps** are now a JSON object instead of a YAML map:

- `GOTIFY_SERVER_RESPONSEHEADERS`

```bash
# before
GOTIFY_SERVER_RESPONSEHEADERS={X-Custom-Header: "custom value"}
# after
GOTIFY_SERVER_RESPONSEHEADERS={"X-Custom-Header":"custom value"}
```

## API Changes

### Tokens are only shown once

To align with secure API design principles, tokens are no longer returned by
the API or WebUI, except once when they are created or rotated. Workflows that
read tokens of existing clients or applications will stop working.

::: tip
The create message endpoint now accepts an `appid` parameter. This lets clients
post messages as one of their own applications without knowing the
application token.
:::

Tokens of existing applications can be rotated via the application security
update endpoint (`PUT /application/{id}/security`).

Existing tokens (starting with `A` and `C`) will continue to work.
Plugin tokens (starting with `P`) used to access web resources are not affected by this change.

### Paging next URL is relative

The `paging.next` URL returned by `GET /message` and
`GET /application/{id}/message` is now a relative path instead of an absolute
URL.

```json
// before
{"paging": {"next": "https://example.com/message?limit=100&since=23"}}
// after
{"paging": {"next": "/message?limit=100&since=23"}}
```

Clients that follow `next` directly must now prepend the Gotify base URL,
e.g. `https://example.com/gotify` + `/message?limit=100&since=23`.

### Step-up Authentication

Introduces step-up authentication via time-limited [session
elevation](./session-elevation.md). A session/client token must re-authenticate
before sensitive, hard-to-undo actions.

HTTP Basic auth and application tokens are unaffected.

With a non-elevated client token these return `403`:

| Endpoint                                      | Action                         |
| :-------------------------------------------- | :----------------------------- |
| `POST /current/user/password`                 | Change current user's password |
| `DELETE /client/{id}`                         | Delete a client                |
| `DELETE /application/{id}`                    | Delete an application          |
| `PUT /application/{id}/security`              | Application security update    |
| `POST /client/{id}/elevate`                   | Elevate a client token         |
| `GET /user`, `GET`/`POST`/`DELETE /user/{id}` | Manage users (admin)           |

The `Client` and `CurrentUser` models now include elevation-related fields. See
the [API documentation](/api-docs) for details.

::: tip

If a script calls these endpoints with a client token, either:

- Switch to HTTP Basic auth, basic auth requests are always elevated.
- Elevate the client token first, in the WebUI. See [Session Elevation](./session-elevation.md).

:::

## CLI Changes

The binary now uses subcommands. You should migrate to the `serve` subcommand.
For backwards compatibility, running Gotify without a subcommand still starts
the server.

```bash
$ ./gotify-linux-amd64 serve
```

The Docker image already defaults to `serve`, so `docker run` and Docker Compose
setups keep working unchanged.
