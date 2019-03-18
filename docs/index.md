---
id: index
title: Intro
---

This is the documentation of gotify/server. Lets start with some definitions:

A user is a device or application that can manage clients, messages and applications. Users create applications which, in return, send notifications to the user who created them.
However a user is not allowed to send messages.

An application is a device or application that only can send messages and belongs to one specific user.

A message has the following attributes: content, title, creation date, application id and priority.

![](../img/intro.png)
