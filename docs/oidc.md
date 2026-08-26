# OpenID Connect (OIDC)

[[toc]]

Gotify supports OpenID Connect for Single Sign-On (SSO), allowing users to authenticate via an external identity provider such as Authelia or Dex.

::: warning
The identity provider **must** support [PKCE](https://oauth.net/2/pkce/) (Proof Key for Code Exchange). IdPs without PKCE support are currently unsupported.
:::

## Configuration

| Variable                       | Description                                                                                                  |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `GOTIFY_OIDC_ENABLED`          | Enable OIDC login.                                                                                           |
| `GOTIFY_OIDC_ISSUER`           | The OIDC issuer URL. Used to discover endpoints via `/.well-known/openid-configuration`.                     |
| `GOTIFY_OIDC_CLIENTID`         | The client ID registered with your identity provider.                                                        |
| `GOTIFY_OIDC_CLIENTSECRET`     | The client secret.                                                                                           |
| `GOTIFY_OIDC_REDIRECTURL`      | The callback URL the identity provider redirects to after authentication. Must match your provider config.   |
| `GOTIFY_OIDC_AUTOREGISTER`     | Automatically create a new Gotify user on first OIDC login. Enabled by default.                              |
| `GOTIFY_OIDC_USERNAMECLAIM`    | The OIDC claim used as the username. Common values: `preferred_username` (default) or `email`.               |
| `GOTIFY_OIDC_LINK_BY_USERNAME` | Link an OIDC identity to an existing local user with the same username. Disabled by default.                 |
| `GOTIFY_OIDC_SCOPES`           | Comma-separated scopes to request. Defaults to `openid,profile,email`.                                       |
| `GOTIFY_OIDC_PROMPT`           | Comma-separated values for the `prompt` authorization parameter. Defaults to `login`.                        |
| `GOTIFY_OIDC_IDP_NAME`         | Name of the identity provider displayed in the UI. Defaults to `OIDC`.                                       |
| `GOTIFY_OIDC_AUTO_REDIRECT`    | Automatically redirect to the identity provider instead of showing the login page. Disabled by default.      |
| `GOTIFY_OIDC_GROUPS_CLAIM`     | The claim containing the user's group memberships. Empty (default) disables [group mapping](#groups).        |
| `GOTIFY_OIDC_GROUPS_USER`      | Comma-separated groups whose members may log in with user permissions. Empty allows all authenticated users. |
| `GOTIFY_OIDC_GROUPS_ADMIN`     | Comma-separated groups whose members are granted admin permissions.                                          |

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
GOTIFY_OIDC_PROMPT=login
GOTIFY_OIDC_IDP_NAME=OIDC
GOTIFY_OIDC_AUTO_REDIRECT=false
GOTIFY_OIDC_GROUPS_CLAIM=
GOTIFY_OIDC_GROUPS_USER=
GOTIFY_OIDC_GROUPS_ADMIN=
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

## Groups

Set `GOTIFY_OIDC_GROUPS_CLAIM` to manage Gotify permissions via the group memberships from your identity provider. The claim must contain the groups as a list of strings and must be included in the requested scopes. Most identity providers expose it via the `groups` scope.

```bash
GOTIFY_OIDC_SCOPES=openid,profile,email,groups
GOTIFY_OIDC_GROUPS_CLAIM=groups
GOTIFY_OIDC_GROUPS_USER=gotify-users
GOTIFY_OIDC_GROUPS_ADMIN=gotify-admins
```

With this configuration:

- Members of `gotify-admins` log in with admin permissions.
- Members of `gotify-users` log in with user permissions.
- Everyone else is denied access.

When `GOTIFY_OIDC_GROUPS_ADMIN` is set, the admin permission is updated on every login, overwriting manual changes done in Gotify.

## Disabling local authentication

When all users log in via OIDC, local username/password authentication can be disabled:

```bash
GOTIFY_LOCALAUTH_ENABLED=false
```

This hides the password login form in the WebUI and rejects username/password authentication (including basic auth) on the API.

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
          - 'groups' # Required for group mapping
        response_types:
          - 'code'
        grant_types:
          - 'authorization_code'
        access_token_signed_response_alg: 'none'
        userinfo_signed_response_alg: 'none'
        token_endpoint_auth_method: 'client_secret_basic'
```

For [group mapping](#groups): Authelia exposes the user's groups via the `groups` scope and claim, see the [Authelia claims docs](https://www.authelia.com/integration/openid-connect/openid-connect-1.0-claims/#groups).

:::

### Authentik

[authentik](https://goauthentik.io/) is an open-source identity provider.

See https://integrations.goauthentik.io/monitoring/gotify/

For [group mapping](#groups): authentik exposes the user's groups via the `groups` claim inside the default `profile` scope, see the [authentik scope mapping docs](https://docs.goauthentik.io/add-secure-apps/providers/oauth2/#default-scopes).

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

For [group mapping](#groups): Dex exposes the user's groups via the `groups` scope and claim, see the [Dex scopes and claims docs](https://dexidp.io/docs/configuration/custom-scopes-claims-clients/). The available groups depend on the configured connector.

:::

### Pocket ID

[Pocket ID](https://pocket-id.org/) is a simple OIDC provider with passkey authentication.

::: details Pocket ID configuration

1. Create a new OIDC Client in Pocket ID (e.g. Gotify)
1. Set the Callback URLs to the values below (replace example.com with your actual domain).
   ```
   https://gotify.example/auth/oidc/callback
   gotify://oidc/callback
   ```
1. Enable PKCE.
1. Optional: Download a PNG or SVG logo from the Gotify project and upload.
1. Optional for [group mapping](#groups): Pocket ID exposes the user groups via the `groups` scope and claim. See https://github.com/pocket-id/pocket-id/discussions/275.
1. Copy the Client ID and Client Secret for use in the next section.

:::

See https://pocket-id.org/docs/client-examples/gotify
