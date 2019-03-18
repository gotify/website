---
id: index
title: Intro
---

This is the documentation of gotify/server. Lets start with some definitions:

A client is a device or application that can manage clients, messages and applications.
However a client is not allowed to send messages.

An application is a device or application that only can send messages.

A user owns its own collection of clients and applications, and clients only gets messages from the applications owned by the same user.

A message has the following attributes: content, title, creation date, application id and priority.

![](../img/intro.png)
