# Migrate to 3.x

> [!WARNING]
> Gotify 3 isn't released yet.

---

- The `config.yml` file is no longer supported, convert it to the new env format
  with [`migrate-config`](#migrating-your-config).
- If you set list or map environment variables, their syntax changed, see
  [List and map syntax](#list-and-map-syntax).
- If you rely on the format of tokens or the internal implementation details of token storage, your workflow may need adjusting.
  See [token format redesign](#token-format-redesign).
- If you have scripts hitting client-token endpoints, they may now need
  [elevation](#adapting-your-scripts).

## Config Changes

### YAML config file removed

The YAML config file (`config.yml`) is no longer supported. Gotify can now be
only configured by environment variables, which can be loaded from an env file.
The first existing file from this search order is loaded:

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

### Environment List and map syntax

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

### Token Format Redesign

Introduces an EdDSA based token validation scheme to prevent storing plaintext token in database
and create potential for fulfilling more feature requests related to security and authentication.
See [#325](https://github.com/gotify/server/issues/325).

Tokens for existing applications can now be rotated via the _application security update_ endpoint.

Existing tokens (starting with `A` and `C`) will continue to work.
Plugin tokens (starting with `P`) used to access web resources are not affected by this change.

Custom tokens created by manually modifying database entry may cease to work upon upgrading,
in such case please rotate tokens or recreate the corresponding client/application entry.

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

The `Client` and `CurrentUser` models have gotten elevation-related fields. See the
[API documentation](/api-docs) for details.

### Adapting your scripts

Scripts that hit the endpoints above with a client token now need that token to
be elevated. Either:

- Use HTTP Basic auth as they are elevated by default.
- Elevate the client in the WebUI or the api with basic auth.

## CLI Changes

The binary now uses subcommands. You should migrate to using the `serve`
subcommand. For backwards compatibility running gotify without a command will
continue to serve the server.

```bash
$ ./gotify-linux-amd64 serve
```

The Docker image already defaults to `serve`, so `docker run` and Docker Compose
setups keep working unchanged.
