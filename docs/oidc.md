# OpenID Connect (OIDC)

[[toc]]

Gotify supports OpenID Connect for Single Sign-On (SSO), allowing users to authenticate via an external identity provider such as Authelia or Dex.

::: warning
The identity provider **must** support [PKCE](https://oauth.net/2/pkce/) (Proof Key for Code Exchange). IdPs without PKCE support are currently unsupported.
:::

## Configuration

| Variable                       | Description                                                                                                |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `GOTIFY_OIDC_ENABLED`          | Enable OIDC login.                                                                                         |
| `GOTIFY_OIDC_ISSUER`           | The OIDC issuer URL. Used to discover endpoints via `/.well-known/openid-configuration`.                   |
| `GOTIFY_OIDC_CLIENTID`         | The client ID registered with your identity provider.                                                      |
| `GOTIFY_OIDC_CLIENTSECRET`     | The client secret.                                                                                         |
| `GOTIFY_OIDC_REDIRECTURL`      | The callback URL the identity provider redirects to after authentication. Must match your provider config. |
| `GOTIFY_OIDC_AUTOREGISTER`     | Automatically create a new Gotify user on first OIDC login. Enabled by default.                            |
| `GOTIFY_OIDC_USERNAMECLAIM`    | The OIDC claim used as the username. Common values: `preferred_username` (default) or `email`.             |
| `GOTIFY_OIDC_LINK_BY_USERNAME` | Link an OIDC identity to an existing local user with the same username. Disabled by default.               |
| `GOTIFY_OIDC_SCOPES`           | Comma-separated scopes to request. Defaults to `openid,profile,email`.                                     |

```bash
GOTIFY_OIDC_ENABLED=true
GOTIFY_OIDC_ISSUER=https://auth.example.org
GOTIFY_OIDC_CLIENTID=gotify
GOTIFY_OIDC_CLIENTSECRET=YOUR_CLIENT_SECRET
GOTIFY_OIDC_REDIRECTURL=https://gotify.example.org/auth/oidc/callback
GOTIFY_OIDC_AUTOREGISTER=true
GOTIFY_OIDC_USERNAMECLAIM=preferred_username
GOTIFY_OIDC_LINK_BY_USERNAME=false
GOTIFY_OIDC_SCOPES=openid,profile,email
```

See the [Configuration](/docs/config) page for the full config reference.

### Redirect URL

- The redirect URL must always end with `/auth/oidc/callback`.
- If Gotify is served at the root, the redirect URL is `https://gotify.example.org/auth/oidc/callback`.
- If Gotify is served on a sub-path (e.g. behind a reverse proxy at `/gotify/`), the sub-path must be included: `https://example.org/gotify/auth/oidc/callback`.
- For the **Android app** to support OIDC login, you must add `gotify://oidc/callback` as an additional redirect URL in your identity provider's client configuration.

This URL must match **exactly** between the Gotify config and your identity provider's client configuration.

## Linking by username

Gotify identifies users by username. By default, an OIDC login is rejected when its username belongs to an existing local user that is not yet linked to an OIDC identity. Set `GOTIFY_OIDC_LINK_BY_USERNAME=true` to link the OIDC identity to the existing local user instead.

Only enable this if you trust that usernames in your identity provider map to the same people as your Gotify usernames.

## Sample IdP configurations

### Authelia

[Authelia](https://www.authelia.com/) is a self-hosted authentication and authorization server.

::: details Authelia configuration (configuration.yml)

```yml
identity_providers:
  oidc:
    clients:
      - client_id: 'gotify'
        client_name: 'gotify'
        client_secret: '$pbkdf2-sha512$310000$...' # generate with: authelia crypto hash generate pbkdf2
        public: false
        authorization_policy: 'two_factor'
        require_pkce: true
        pkce_challenge_method: 'S256'
        consent_mode: implicit
        redirect_uris:
          - 'https://gotify.example.org/auth/oidc/callback' # See redirect url docs
          - 'gotify://oidc/callback' # Required for Android app OIDC login
        scopes:
          - 'openid'
          - 'profile'
          - 'email'
        response_types:
          - 'code'
        grant_types:
          - 'authorization_code'
        access_token_signed_response_alg: 'none'
        userinfo_signed_response_alg: 'none'
        token_endpoint_auth_method: 'client_secret_basic'
```

:::

### Authentik

See https://integrations.goauthentik.io/monitoring/gotify/

### Dex

[Dex](https://dexidp.io/) is a federated OpenID Connect provider.

::: details Dex configuration

```yml
staticClients:
  - id: gotify
    redirectURIs:
      - 'https://gotify.example.org/auth/oidc/callback' # See redirect url docs
      - 'gotify://oidc/callback' # Required for Android app OIDC login
    name: 'Gotify'
    secret: secret
```

:::
