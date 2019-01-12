---
id: dev-environment
title: Setup Dev Environment
---

## Setup Backend

Download go dependencies with [go modules](https://github.com/golang/go/wiki/Modules).

```
$ export GO111MODULE=on # only needed if the project is inside $GOPATH/src
$ go get
```

Run gotify server.

```
$ go run .
```

## Setup UI

_Commands must be executed inside the ui directory._

Download dependencies with [npm](https://github.com/npm/npm).

```bash
$ npm install
```

Star the UI development server.

```bash
$ npm start
```

Open `http://localhost:3000` inside your favorite browser.

The UI requires a Gotify server running on `localhost:80` this can be adjusted inside the
[ui/src/index.tsx](https://github.com/gotify/server/blob/master/ui/src/index.tsx).

## Execute Backend Tests

The tests can be executed with:

```bash
$ make test
# or
$ go test ./...
```

## Execute UI (end2end) Tests

Build the ui because the end2end test should be run against the production build.
(This needs to be done on every change in the UI)

```bash
$ (cd ui && npm run build)
```

Now execute the tests with npm

```bash
$ (cd ui && npm run test)
```

## Executing Static-Checks

The following command checks the formatting and executes some linters like tslint and govet.

```bash
$ make check
```

## Building Gotify

Build the UI

```bash
$ (cd ui && npm run build)
```

Run [packr](https://github.com/gobuffalo/packr) (embeds static assets in go binaries)

```bash
$ packr
```

Build the Go Binary

```bash
$ go build -o build/gotify-server
```

Hurray! You built Gotify. This is only a development build,
see [.travis.yml](https://github.com/gotify/server/blob/master/.travis.yml) for settings the mode to `prod`.

### Cross-Platform

The project has a CGO reference (because of sqlite3), therefore a GCO cross compiler is needed for compiling for other platforms.
See [.travis.yml](https://github.com/gotify/server/blob/master/.travis.yml) on how we do that.
