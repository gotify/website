# Testing Unreleased Changes

> [!WARNING]
> The `master` image is built from the current development state. There are no
> guarantees for stability or security. Use it at your own risk.

The `gotify/server:master` Docker image is built on every push to the
[master branch](https://github.com/gotify/server) and contains the latest
unreleased changes.

```bash
# Docker Hub
$ docker run -p 8080:80 -v "$PWD/testdata:/app/data" docker.io/gotify/server:master
# GitHub Registry
$ docker run -p 8080:80 -v "$PWD/testdata:/app/data" ghcr.io/gotify/server:master
```

Found a bug? Report it on [github.com/gotify/server/issues](https://github.com/gotify/server/issues).
