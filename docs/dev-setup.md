---
id: dev-setup
title: Setup Environment
---

Gotify requires:

- Go 1.17 or newer
- Node 16.x or newer
- Yarn 1.9 or newer

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

Download dependencies with [yarn](https://github.com/yarnpkg/yarn).

```bash
$ yarn
```
