# First Login

After setting up gotify/server you can log in to the WebUI. On first launch an initial admin account is created. If you have not overridden the defaults in the configuration, use username `admin` and password `admin`.

Once logged in you can create your own user(s) and, if desired, delete the default account (after creating another administrator account). You can also remove any username/password overrides from your configuration, they are only used to create this initial account.

If you keep the default account, be sure to change its password so it is not `admin`!

## Reset a lost admin password

If you lost the password of your admin account, you can recover it with the `gotify user` commands.
They use the same configuration as `gotify serve` (environment variables and config files), so run
them with the same configuration and from the same working directory as the server.

```bash
# change the password, you'll be prompted for the new one
gotify user set-password admin

# or create a new admin user
gotify user create --admin rescue

# grant or revoke admin permissions
gotify user set-admin alice true
```

If you omit the password, it is prompted for. You can also pass it as the last argument, e.g.
`gotify user set-password admin newpassword`, but it may then show up in your shell history.

In Docker, run the commands inside the container. Use `-it` so the password can be prompted for:

```bash
docker exec -it gotify ./gotify-app user set-password admin
```

::: warning
With SQLite, the database may be locked while the server is running. If you get a `database is
locked` error, stop the server, run the command, and start the server again.
:::
