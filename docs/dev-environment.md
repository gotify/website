---
id: dev-environment
title: Development
---

## Setup

### Setup Backend

Clone gotify server source from git:

```bash
$ git clone https://github.com/gotify/server.git && cd server
```

If you are in GOPATH, enable [go modules](https://github.com/golang/go/wiki/Modules) explicitly:

```bash
$ export GO111MODULE=on
```

Download dependencies

```bash
$ GO111MODULE=off make download-tools
$ go get -d
```

### Setup UI

_Commands must be executed inside the ui directory._

Download dependencies with [npm](https://github.com/npm/npm).

```bash
$ npm install
```

## Development

### Develop Backend

Start the server in development mode.

```bash
$ go run .
```

### Develop UI

Start the UI development server.

_Commands must be executed inside the ui directory._

```bash
$ npm start
```

Open `http://localhost:3000` inside your favorite browser.

The UI requires a Gotify server running on `localhost:80` this can be adjusted inside the
[ui/src/index.tsx](https://github.com/gotify/server/blob/master/ui/src/index.tsx).

## Tests

### Execute Backend Tests

#### Run tests with parallelism

```bash
$ go test ./...
```

#### Run Tests with Coverage

```bash
$ make test-coverage
$ go tool cover -html=coverage.txt # get a HTML coverage report
```

#### Run Tests with Race Detector

```bash
$ make test-race
```

### Execute UI (end2end) Tests

Build the ui because the end2end test should be run against the production build.
(This needs to be done on every change in the UI)

```bash
$ (cd ui && npm run build)
```

Now execute the tests with npm

```bash
$ (cd ui && npm run test)
```

### Execute Static Checks

The following command checks the formatting and executes some linters like tslint and govet.

```bash
$ make check
```

## Building Releases

1. Build the UI

```bash
$ (cd ui && npm run build)
```

2. Generate static assets for go.

Run [packr](https://github.com/gobuffalo/packr) (embeds static assets in go binaries)

```bash
$ packr
```

3. Build the Go Binary

To build on the current platform:

```bash
$ go build -ldflags="-X main.Version=$(git describe --tags) -X main.BuildDate=$(date "+%F-%T") -X main.Commit=$(git rev-parse --verify HEAD) -X main.Mode=prod" -o gotify-server
```

To cross compile:

_The project has a CGO reference (because of sqlite3), therefore a CGO cross compiler is needed for compiling for other platforms._

```bash
$ CGO_ENABLED=1 CC=${CROSS_GCC} CXX=${CROSS_G++} GOOS=${TARGET_GOOS} GOARCH=${TARGET_GOARCH} go build -ldflags="-X main.Version=$(git describe --tags | cut -c 2-) -X main.BuildDate=$(date "+%F-%T") -X main.Commit=$(git rev-parse --verify HEAD) -X main.Mode=prod" -o gotify-server
```
