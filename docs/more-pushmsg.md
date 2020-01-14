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
  priority: 5
};

axios({
  method: "post",
  headers: {
    "Content-Type": "application/json"
  },
  url: url,
  data: bodyFormData
})
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    if (!error.response) {
      console.log(error);
    } else {
      console.log(error.response.data);
    }
  });
```

### Java

With maven dependency:
```
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.8</version>
</dependency>
```
And code:
```
package com.gotify.client;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class GotifyClient {

    // example main method
    public static void main(String[] args) throws IOException {
        GotifyClient client = new GotifyClient("http://localhost:8008/message?token=<apptoken>");
        client.sendMessage("Hi there", "Hello from Java", 5);
    }

    String gotifyUrl;

    public GotifyClient(String gotifyUrl) {
        this.gotifyUrl = gotifyUrl;
    }

    public void sendMessage(String msg, String title, int priority) throws IOException {
        Message message = new Message(msg, priority, title);
        ObjectMapper mapper = new ObjectMapper();
        doHTTPPost(gotifyUrl, mapper.writeValueAsString(message));
    }

    static String doHTTPPost(String urlString, String params) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection yc = (HttpURLConnection) url.openConnection();
        yc.setRequestMethod("POST");
        yc.setRequestProperty("Content-Type", "application/json");
        yc.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(yc.getOutputStream());
        wr.writeBytes(params);
        wr.flush();
        wr.close();

        BufferedReader in = new BufferedReader(new InputStreamReader(yc.getInputStream()));
        String inputLine = in.readLine();
        in.close();
        return inputLine;
    }

    public static class Message {
        String message;
        int priority;
        String title;

        public Message(String message, int priority, String title) {
            this.message = message;
            this.priority = priority;
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public int getPriority() {
            return priority;
        }

        public void setPriority(int priority) {
            this.priority = priority;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }
    }
}
```
