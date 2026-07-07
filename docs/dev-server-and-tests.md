# Servers and Tests

## Start development servers

### Backend

The backend embeds the built UI, so build it first.

```bash
$ (cd ui && yarn build)
```

Start the server in development mode.

```bash
$ go run .
```

### UI

Start the UI development server.

_Commands must be executed inside the ui directory._

```bash
$ yarn start
```

Open `http://localhost:5173` inside your favorite browser.

The UI development server proxies API requests to a Gotify server running on
`localhost:80`. Create a `gotify-server.env` in the gotify/server repository
containing `GOTIFY_SERVER_PORT=8080` to change the port.

## Update Swagger spec

The [gotify/server REST-API](/api-docs) is documented via Swagger. The Swagger definition is generated from source code comments
([example comment](https://github.com/gotify/server/blob/09c1516a170dfb47d29644db622655b540b94922/api/application.go#L33)).

After changing such a comment, run the following command to update the Swagger definition.

```bash
$ make update-swagger
```

## Tests

### Execute Backend Tests

#### Run tests

```bash
$ go test ./...
```

#### Run Tests with Coverage

```bash
$ make test-coverage
$ go tool cover -html=coverage.txt # get a HTML coverage report
```

### Execute UI (end2end) Tests

Build the UI because the end2end tests run against the production build.
(This needs to be done after every change in the UI)

```bash
$ (cd ui && yarn build)
```

Now execute the tests with yarn.

```bash
$ (cd ui && yarn test)
```

### Execute Static Checks

The following command checks the formatting, runs linters like golangci-lint and eslint, and verifies that the Swagger spec is up to date.

```bash
$ make check
```
