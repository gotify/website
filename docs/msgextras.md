# Message Extras

Extras are used to carry extra information, change how clients behave, etc.
Extras are stored in a key-value scheme and are only accepted in `POST /message` requests with `application/json` content-type.

## Namespaces

Keys under `.extras` should be in the following format: `<top-namespace>::[<sub-namespace>::]<action>`.
Some of the namespaces are used by official clients:

| Namespace                                     | Description                             |
| --------------------------------------------- | --------------------------------------- |
| `client::*`                                   | Reserved                                |
| [`client::display`](#clientdisplay)           | Changes how client displays information |
| [`client::notification`](#clientnotification) | Customizes the notification             |
| [`client::action`](#clientaction)             | Adds action buttons to the message      |
| `android::*`                                  | Reserved                                |
| [`android::action`](#androidaction)           | React to events                         |
| `ios::*`                                      | Reserved                                |
| `server::*`                                   | Reserved                                |
| All Other                                     | Defined by end-users                    |

## `client::display`

### `contentType`

#### Definition

| contentType     | description                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------- |
| `text/plain`    | **Default**; The message will be rendered as plain text. Links may be highlighted and be clickable. |
| `text/markdown` | The message should be rendered as markdown. **HTML should be ignored**.                             |

> **Note**: Markdown supports rendering images via `![](img url)`,
> these images will be automatically downloaded when the message is viewed.
> Similar to why remote content is blocked by default in e-mail clients,
> automatically downloading remote images could be used to collect information from the user.
>
> Also, if part of the message is interpolated from a malicious external source,
> the attacker could inject malformed markdown which leads to information disclosure.
>
> It is recommended to use `text/plain` to reduce possible security issues
> when using text from external sources, for example output from scripts.

#### Example

```json
{
  "extras": {
    "client::display": {
      "contentType": "text/plain"
    }
  }
}
```

#### Support

| Client           | since  | description                                                     |
| ---------------- | ------ | --------------------------------------------------------------- |
| gotify/server ui | v2.0.5 | Uses [GitHub Flavored Markdown](https://github.github.com/gfm/) |
| gotify/android   | v2.0.7 | Uses [commonmark-spec](https://spec.commonmark.org/0.28/)       |

## `client::notification`

### `click`.`url`

`click`.`url` (string): Opens a URL on notification click.

#### Example

```json
{
  "extras": {
    "client::notification": {
      "click": {"url": "https://gotify.net"}
    }
  }
}
```

#### Support

| Client         | since   | description                                    |
| -------------- | ------- | ---------------------------------------------- |
| gotify/android | v2.0.10 | Prevents the default of opening the Gotify app |

### `bigImageUrl`

`bigImageUrl` (string): Shows a big image in the notification.

#### Example

```json
{
  "extras": {
    "client::notification": {
      "bigImageUrl": "https://placekitten.com/400/300"
    }
  }
}
```

#### Support

| Client         | since  | description                                                                                                           |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| gotify/android | v2.3.0 | You may have to expand the notification. Added with [gotify/android#200](https://github.com/gotify/android/pull/200). |

## `client::action`

### `buttons`

`buttons` (array): Buttons shown with the message. A button either sends an HTTP request (`http`) or opens a URL (`open`) when it is clicked.

| Field            | Type   | Description                                                                                      |
| ---------------- | ------ | ------------------------------------------------------------------------------------------------ |
| `label`          | string | **Required**; The text of the button.                                                            |
| `http`           | object | Sends an HTTP request when clicked. A button must have either `http` or `open`, not both.        |
| `http`.`method`  | string | **Required**; The HTTP method, e.g. `GET`, `POST` or `PUT`, case-insensitive.                    |
| `http`.`url`     | string | **Required**; The URL of the request. Only `http` and `https` URLs are valid.                    |
| `http`.`headers` | object | Headers of the request, a map of header name to string value.                                    |
| `http`.`body`    | string | The body of the request. Set a matching `Content-Type` header. Not allowed for `GET` and `HEAD`. |
| `open`           | object | Opens a URL when clicked, e.g. a status page.                                                    |
| `open`.`url`     | string | **Required**; The URL to open. Only `http` and `https` URLs are valid.                           |

Clients should not send cookies or other credentials with the request.
The methods `CONNECT`, `TRACE` and `TRACK` are not supported.
The web UI doesn't show invalid buttons and shows the parsing error below the message instead.

> **Note**: Anyone who can send messages to an application can make the user's client send requests
> to any URL by adding buttons. Clients therefore only send the request after the user clicked the button,
> and should show the target of the request (e.g. as a tooltip).
>
> The web UI sends the request from the browser, so the target must allow
> [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests from the Gotify origin,
> including the `Access-Control-Allow-Headers` for custom headers.

#### Example

```json
{
  "title": "home assistant",
  "message": "You've left the house but the heater is still powered on.",
  "extras": {
    "client::action": {
      "buttons": [
        {
          "label": "Power off",
          "http": {
            "method": "post",
            "url": "https://example.com/power_off?id=5",
            "headers": {"Authorization": "bearer token"}
          }
        },
        {
          "label": "Dismiss",
          "http": {
            "method": "post",
            "url": "https://example.com/dismiss",
            "headers": {"Content-Type": "application/json"},
            "body": "{\"id\": 5}"
          }
        },
        {
          "label": "Open dashboard",
          "open": {"url": "https://example.com/dashboard"}
        }
      ]
    }
  }
}
```

#### Support

| Client           | since | description                                                                                        |
| ---------------- | ----- | -------------------------------------------------------------------------------------------------- |
| gotify/server ui | TBD   | Added with [gotify/server#1088](https://github.com/gotify/server/pull/1088). Requests via `fetch`. |

## `android::action`

### `onReceive`.`intentUrl`

`onReceive`.`intentUrl` (string): Opens an intent after the notification was delivered.

#### Example

```json
{
  "extras": {
    "android::action": {
      "onReceive": {"intentUrl": "https://gotify.net"}
    }
  }
}
```

#### Support

| Client         | since   | description                                                                                                                    |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| gotify/android | v2.0.11 | You need to enable "Intent Action Permission" in the app settings, otherwise this feature only works when the app is in focus. |
