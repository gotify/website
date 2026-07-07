# Push messages

As described in the [Intro](index.md), you need an application to push messages to the Gotify server. Only the user who created the application can see its messages.
An application can be added via

- WebUI: click the `apps` tab in the upper right corner when logged in and add an application
- REST API: `curl -u admin:admin https://push.example.de/application -F "name=test" -F "description=tutorial"`
  See [API docs](/api-docs)

To authenticate as an application you need the application token.
The token is returned when creating the application. Starting with Gotify 3, tokens are only shown once, on creation or rotation.

Now you can use [curl](https://curl.se/), [HTTPie](https://httpie.io/) or any other HTTP client to push messages.

```bash
$ curl "https://push.example.de/message?token=<apptoken>" -F "title=my title" -F "message=my message" -F "priority=5"
$ http -f POST "https://push.example.de/message?token=<apptoken>" title="my title" message="my message" priority="5"
```

On Microsoft PowerShell, you can use the built-in `Invoke-RestMethod` or `Invoke-WebRequest` cmdlets.

```powershell
PS> Invoke-RestMethod -Uri "https://push.example.de/message?token=<apptoken>" -Method POST -Body @{title="my title"; message="my message"; priority=5} # return is automatically parsed into a PowerShell object
PS> Invoke-WebRequest -Uri "https://push.example.de/message?token=<apptoken>" -Method POST -Body @{title="my title"; message="my message"; priority=5} # return is as raw response
```

> The message API takes an `extras` property that carries extra information with the message and describes how clients should handle it.
> See [message extras](msgextras.md) for more information.

The `priority` parameter controls how clients present the message, for example whether the Android app plays a notification sound. See [message priority](priority.md) for more information.

Only the `message` parameter is required.

[Here are more examples for pushing messages in different languages.](more-pushmsg.md)

You can also use [gotify/cli](https://github.com/gotify/cli) to push messages.
The CLI stores URL and token in a config file.

```bash
$ gotify push -t "my title" -p 10 "my message"
$ echo my message | gotify push
```

[How to install gotify/cli](https://github.com/gotify/cli).
