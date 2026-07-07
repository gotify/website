# Message Priority

Every message has a priority. Higher priorities mean more important messages. Clients can use it to decide how intrusive a message is presented.

## Setting the priority

Set the priority when pushing a message:

```bash
$ curl -H "X-Gotify-Key: <apptoken>" "https://push.example.de/message" -F "message=my message" -F "priority=8"
```

When a message is pushed without a priority, the default priority of the application is used. It can be configured in the WebUI by editing the application.

## How clients handle priorities

### Android

The [Android app](https://github.com/gotify/android) maps priorities to notification behavior:

| Notification                                 | Priority |
| -------------------------------------------- | -------- |
| No notification                              | 0        |
| Icon in notification bar                     | 1 - 3    |
| Icon in notification bar + Sound             | 4 - 7    |
| Icon in notification bar + Sound + Vibration | 8 - 10   |

### WebUI

The WebUI shows a browser notification for every message and additionally plays a notification sound for messages with priority 4 or higher.
