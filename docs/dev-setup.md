---
id: dev-setup
title: Setup Environment
---

Gotify requires:

- Go 1.11+
- Node 11.x

## Clone sources

Clone gotify server source from git:

```bash
$ git clone https://github.com/gotify/server.git && cd server
```

## Setup Backend

If you are in GOPATH, enable [go modules](https://github.com/golang/go/wiki/Modules) explicitly:

```bash
$ export GO111MODULE=on
```

Download dependencies

```bash
$ make download-tools
$ go get -d
```

## Setup UI

_Commands must be executed inside the ui directory._

Download dependencies with [npm](https://github.com/npm/npm).

```bash
$ npm install
```
