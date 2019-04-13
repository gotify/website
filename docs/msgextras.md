---
id: msgextras
title: Message Extras
---

Extras are used to carry extra information, change how clients behave, etc.
Extras are stored in a key-value scheme and are only accepted in `POST /message` requests with `application/json` content-type.

## Namespaces

Keys under `.extras` should be in the following format: `<top-namespace>::[<sub-namespace>::]<action>`.
Some of the namespaces are used by official clients:

| Namespace                            | Description                             |
| ------------------------------------ | --------------------------------------- |
| [`client::display`](#client-display) | Changes how client displays information |
| `client::*`                          | Reserved                                |
| `android::*`                         | Reserved                                |
| `ios::*`                             | Reserved                                |
| `server::*`                          | Reserved                                |
| All Other                            | Defined by end-users                    |

## `client::display`

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
