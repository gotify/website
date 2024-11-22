---
id: msgextras
title: Message Extras
---

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
> Similarly, to why remote contents are blocked by default in e-mail clients,
> automatically downloading remote images could be used to collect information from the user.
>
> Also, if part of the message is interpolated from a malicious external source,
> the attacker could inject malformed markdown which leads to information disclosure.
>
> It is recommended to use `text/plain` to reduce possible security issues
> when using text from external sources like f.ex. output from scripts.

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

`click`.`url` (string): Opens an URL on notification click.

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

### `actions`.`open`

`actions`.`open` (string): Opens an URL on "open" button notification click.

#### Example

```json
{
  "extras": {
    "client::notification": {
      "actions": { "open": "https://gotify.net" }
    }
  }
}
```

### `actions`.`share`

`actions`.`share` (string): Share an URL on "share" button notification click.

#### Example

```json
{
  "extras": {
    "client::notification": {
      "actions": { "share": "https://gotify.net" }
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
