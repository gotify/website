---
layout: home
hero:
  name: Gotify
  text: ''
  tagline: A simple server for sending and receiving messages
  image:
    src: /img/logo.png
    alt: Gotify Logo
  actions:
    - theme: brand
      text: Download
      link: https://github.com/gotify/server/releases/latest
    - theme: alt
      text: Documentation
      link: /docs/
    - theme: alt
      text: Source Code
      link: https://github.com/gotify
---

<div class="project-section">
<div class="project-text">

## [gotify/server](https://github.com/gotify/server)

The heart of this project. gotify/server features a WebUI and functionality for:

- sending messages via a REST-API
- subscribing/receiving messages via a web socket connection
- managing users, clients and applications

</div>
<div class="project-image">

![Gotify UI](/img/ui.png)

</div>
</div>

<div class="project-section reverse">
<div class="project-text">

## [gotify/android](https://github.com/gotify/android)

An Android client for subscribing to the message stream of gotify/server.
The app shows push notifications for newly received messages.

<div class="store-badges">

[![Get it on Google Play](/img/playstore.png)](https://play.google.com/store/apps/details?id=com.github.gotify)
[![Get it on F-Droid](/img/fdroid.png)](https://f-droid.org/packages/com.github.gotify/)
[![Download](/img/download-badge.png)](https://github.com/gotify/android/releases/latest)

</div>

_Google Play and the Google Play logo are trademarks of Google LLC._

</div>
<div class="project-image">

![Gotify Android](/img/androidv2.png)

</div>
</div>

<div class="project-section">
<div class="project-text">

## [gotify/cli](https://github.com/gotify/cli)

A command line client for pushing messages to gotify/server. It is **not** required for pushing messages, any HTTP client works. See [Push messages](/docs/pushmsg).

</div>
</div>
