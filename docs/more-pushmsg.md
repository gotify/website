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

### PHP (using cURL)

```php
$data = array(
    "title"=> "Hello World",
    "message"=> "Test push From PHP cURL.",
    "priority"=> 5,
);

$data_string = json_encode($data);

$url = "http://localhost:8008/message?token=<apptoken>";

$headers = array
(
    'Content-Type: application/json; charset=utf-8'
);

$ch = curl_init();  
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);  
curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
curl_setopt( $ch,CURLOPT_POSTFIELDS, $data_string);

$result = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($code == 400)
{
 $message = '<strong>Bad Request</strong>';
}
else
{
 if ($code == 401)
 {
  $message = '<strong>Unauthorized Error - Invalid Token</strong>';
 }
 else
 {
  if ($code == 403)
  {
   $message = '<strong>Forbidden</strong>';
  }
  else
  {
   if ($code == 404)
   {
    $message = '<strong>API URL Not Found</strong>';
   }
   else
   {
    $message = '<strong>Your Message was Submitted</strong>';
   }
  }
 }
}

curl_close ($ch);

echo "<pre>Output: $message</pre>";
```