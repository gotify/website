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
    http.PostForm("http://localhost:8008/message?token=<apptoken>",
        url.Values{"message": {"My Message"}, "title": {"My Title"}})
}
```

### PHP (using cURL)

```php
$data = [
    "title"=> "Hello World",
    "message"=> "Test push From PHP cURL.",
    "priority"=> 5,
];

$data_string = json_encode($data);

$url = "http://localhost:8008/message?token=<apptoken>";

$headers = [
    "Content-Type: application/json; charset=utf-8"
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true );
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);

$result = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close ($ch);

switch ($code) {
    case "200":
        echo "<strong>Your Message was Submitted</strong>";
        break;
    case "400":
        echo "<strong>Bad Request</strong>";
        break;
    case "401":
        echo "<strong>Unauthorized Error - Invalid Token</strong>";
        break;
    case "403":
        echo "<strong>Forbidden</strong>";
        break;
    case "404":
        echo "<strong>API URL Not Found</strong>";
        break;
    default:
        echo "<strong>Hmm Something Went Wrong or HTTP Status Code is Missing</strong>";
}
```

### JavaScript

```javascript
const axios = require("axios");

var url = "http://localhost:8008/message?token=<apptoken>";
var bodyFormData = {
  title: "Hello from Javascript",
  message: "Test Push Service from Node.js",
  priority: 5,
};

axios({
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  url: url,
  data: bodyFormData,
})
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    if (!error.response) {
      console.log(error);
    } else {
      console.log(error.response.data);
    }
  });
```

### Java

With maven dependency:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.10.1</version>
</dependency>
```

And code:

```java
package com.gotify.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class GotifyClient {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    // example main method
    public static void main(String[] args) throws IOException {
        GotifyClient client = new GotifyClient("http://localhost:8008/message?token=<apptoken>");
        Message message = new Message("My Title", "Hello from Java!", 10);
        if (client.sendMessage(message)) {
            System.out.println("Message sent!");
        } else {
            System.out.println("Something went wrong :(.");
        }
    }

    private final String gotifyUrl;

    public GotifyClient(String gotifyUrl) {
        this.gotifyUrl = gotifyUrl;
    }

    private boolean sendMessage(Message message) throws IOException {
        URL url = new URL(gotifyUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        try (OutputStream outputStream = connection.getOutputStream()) {
            MAPPER.writeValue(outputStream, message);
        }

        return connection.getResponseCode() >= 200 && connection.getResponseCode() < 400;
    }

    public static class Message {
        String message;
        int priority;
        String title;

        public Message(String title, String message, int priority) {
            this.message = message;
            this.priority = priority;
            this.title = title;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public int getPriority() { return priority; }
        public void setPriority(int priority) { this.priority = priority; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
    }
}
```
