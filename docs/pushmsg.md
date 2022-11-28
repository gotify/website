---
id: pushmsg
title: Push messages
---

As already indicated in [Intro](index.md) you need an application to push messages to gotify/server. Only the user who created the application is able to see its messages.
An application can be added via

- WebUI: click the `apps`-tab in the upper right corner when logged in and add an application
- REST-API: `curl -u admin:admin https://yourdomain.com/application -F "name=test" -F "description=tutorial"`
  See [API-Docs](https://gotify.github.io/api-docs/)

To authenticate as an application you need the application token.
The token is returned in the REST request and is viewable in the WebUI.

Now you can simply use [curl](https://curl.haxx.se/), [HTTPie](https://httpie.org/) or any other http-client to push messages.

```bash
$ curl -X POST "https://push.example.de/message?token=<apptoken>" -F "title=my title" -F "message=my message" -F "priority=5"
$ http -f POST "https://push.example.de/message?token=<apptoken>" title="my title" message="my message" priority="5"
```

> The message API takes an `extras` property that carries extra information with the message and describes how clients behave to this message.
> See [message extras](msgextras.md) for more information.

As of gotify/server v1.2.0 only the `message` parameter is required.

[Here are more examples for pushing messages in different languages.](more-pushmsg.md)

Also you can use [gotify/cli](https://github.com/gotify/cli) to push messages.
The CLI stores url and token in a config file.

```bash
$ gotify push -t "my title" -p 10 "my message"
$ echo my message | gotify push
```

[How to install gotify/cli](https://github.com/gotify/cli).
