---
id: plugin-deploy
title: Building and Deploying Plugins
---

## Building

> This tutorial assumes that you want to build your plugin for gotify/server `v2.0.0`. If you want to build for a different
> version then replace v2.0.0 with your desired version.

**The [gotify/plugin-template Makefile](https://github.com/gotify/plugin-template/blob/master/Makefile) already contains
tasks for most of the things that should be done for building a plugin, feel free to copy the Makefile to your own plugin project.**

`cd` into the plugin source directory:

```bash
$ cd /path/to/plugin/source
$ ls
main.go go.mod go.sum
```

(Optional) Make sure there are no conflicting dependencies:

Get the go.mod file from gotify/server.
[github.com/gotify/server/blob/v2.0.0/go.mod](https://github.com/gotify/server/blob/v2.0.0/go.mod) and run the following command:

```bash
$ go get -u github.com/gotify/plugin-api/cmd/gomod-cap
$ go run github.com/gotify/plugin-api/cmd/gomod-cap \
         -from /path/to/gotify/server/source/go.mod -to /path/to/plugin/source/go.mod
$ go mod tidy
```

### With Docker (recommended)

The [gotify/build docker images](https://github.com/gotify/build) are used for building gotify/server. It is recommended
to use the same build environment for plugins to ensure compatibility.

If you do not want to use the [gotify/plugin-template Makefile](https://github.com/gotify/plugin-template/blob/master/Makefile)
then you can build your plugin like this:

Get the Go version that was used for building gotify/server. The version can be found in the gotify/server repository
in a file called `GO_VERSION`. [github.com/gotify/server/blob/v2.0.0/GO_VERSION](https://github.com/gotify/server/blob/v2.0.0/GO_VERSION).
In this case it is `1.12.0`.

Run the docker images. The gotify/build docker image tags have the following format:
`gotify/build:{GO_VERSION}-{GOOS}-{GOARCH}[-{GOARM}]`. (`[]` means optional)

#### linux amd64

```bash
$ docker run --rm -v "$PWD/.:/proj" -w /proj gotify/build:1.12.0-linux-amd64 \
   go build -a -installsuffix cgo -ldflags "-w -s" -buildmode=plugin -o yourplugin-amd64.so /proj
```

#### linux arm-7

```bash
$ docker run --rm -v "$PWD/.:/proj" -w /proj gotify/build:1.12.0-linux-arm-7 \
   go build -a -installsuffix cgo -ldflags "-w -s" -buildmode=plugin -o yourplugin-arm-7.so /proj
```

#### linux arm64

```bash
$ docker run --rm -v "$PWD/.:/proj" -w /proj gotify/build:1.12.0-linux-arm64 \
   go build -a -installsuffix cgo -ldflags "-w -s" -buildmode=plugin -o yourplugin-arm64.so /proj
```

#### linux 386

```bash
$ docker run --rm -v "$PWD/.:/proj" -w /proj gotify/build:1.12.0-linux-386 \
   go build -a -installsuffix cgo -ldflags "-w -s" -buildmode=plugin -o yourplugin-386.so /proj
```

### Without Docker (not recommended)

> Plugins built without the gotify/server build environment, will probably not work with the built binaries from
> [gotify/server Releases](https://github.com/gotify/server/releases).

Install the Go version that was used for building gotify/server. The version can be found in the gotify/server repository
in a file called `GO_VERSION`. [github.com/gotify/server/blob/v2.0.0/GO_VERSION](https://github.com/gotify/server/blob/v2.0.0/GO_VERSION).

If you are in GOPATH, enable go modules explicitly:

```bash
$ export GO111MODULE=on
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
