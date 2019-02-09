---
id: plugin-deploy
title: Building and Deploying Plugins
---

## Prerequisites

1. Currently, plugins are only supported on Linux and MacOS.
1. [Build](installation.md#source) gotify from source or make sure you have the same go toolchain version with the [build environment](https://travis-ci.org/gotify/server).

## Building

`cd` into the plugin source directory:

```bash
$ cd /path/to/plugin/source
$ ls
main.go go.mod go.sum
```

If you are in GOPATH, enable go modules explicitly:

```bash
$ export GO111MODULE=on
```

(Optional) Make sure there are no conflicting dependencies:

```bash
$ go get -u github.com/gotify/plugin-api/cmd/gomod-cap
$ go run github.com/gotify/plugin-api/cmd/gomod-cap -from /path/to/gotify/server/source/go.mod -to /path/to/plugin/source/go.mod
$ go mod tidy
```

Build the plugin:

```bash
$ go build -o /path/to/gotify/plugin/dir/myplugin.so -buildmode=plugin
```

## Deploying

Gotify loads plugin from the `pluginsdir` directory in the [configuration](configuration.md). All files in that directory are loaded as plugins.

Copy built shared object to the gotify plugin directory:

```bash
$ cp myplugin.so "${GOTIFY_PLUGINSDIR}/myplugin.so"
```

Start gotify:

```bash
$ gotify
```

## Troubleshooting

### `cannot load plugin (<plugin_filename>): package (<plugin_package>) was built with another version of package(<conflicting_package>)`

- If the conflicting package is in the standard library (does not start with a hostname):
  - Check if your plugin is built with go modules enabled ( try `GO111MODULE=on` )
  - If you are using the official release, your plugin should be built with the same version of go toolchain as the [build environment](https://travis-ci.org/gotify/server) ( `go version` )
- If the conflicting package is a 3rd party dependency (starts with a hostname, eg: `github.com/...`):
  - Check if your project `go.mod` is out of date ( `go mod tidy` )
  - Your plugin might have a common dependency with gotify but with a different version, modify that dependency version manually in `go.mod` or use [gomod-cap](https://github.com/gotify/plugin-api/#githubcomgotifycmdgomod-cap).
- If you still cannot resolve the dependency issue, try [building](installation.md#source) gotify from source.
