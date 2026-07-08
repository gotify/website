# Session Elevation

[[toc]]

Session elevation requires you to re-authenticate before performing sensitive,
hard-to-undo actions, even while already logged in.

## What requires elevation

These actions need an **elevated** session. With a non-elevated client token
they return `403 Forbidden`:

| Action                         | Endpoint                                      |
| :----------------------------- | :-------------------------------------------- |
| Change current user's password | `POST /current/user/password`                 |
| Delete a client                | `DELETE /client/{id}`                         |
| Delete an application          | `DELETE /application/{id}`                    |
| Elevate a session              | `POST /client/{id}/elevate`                   |
| Manage users (admin)           | `GET /user`, `GET`/`POST`/`DELETE /user/{id}` |

## How to elevate

### In the WebUI

When you trigger a protected action, the UI prompts you to re-authenticate and
then performs the action.

### Via the API

If you use a client token in a script, you have two options.

1. basic-auth requests are always elevated (see below), so you can call the protected endpoint directly with username and password:

   ```bash
   curl -u "user:password" -X DELETE "https://gotify.example.com/client/7"
   ```

2. If you must authenticate with the token itself, elevate its session first. This can be done via the API or the WebUI.
