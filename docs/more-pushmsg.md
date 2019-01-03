---
id: more-pushmsg
title: (more) Push message examples
---

Have a look at [Here](pushmsg.md) for "How to obtain an application token".

NOTE: Assuming Gotify is running on `http://localhost:8008`.

### Python

```python
import requests #pip install requests
resp = requests.post('http://localhost:8008/message?token=<apptoken>', json={
    "message": "Well hello there.",
    "priority": 2,
    "title": "This is my title"
})
```

### Golang

```go
package main

import (
        "net/http"
        "net/url"
)

func main() {
    http.PostForm("http://localhost:8008/message?<apptoken>",
        url.Values{"message": {"My Message"}, "title": {"My Title"}})
}
```
