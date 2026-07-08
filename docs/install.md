# Installation

## Docker

Before starting, read the [Configuration](config.md) page if you, for example, want to use a different database.

```bash
$ docker run -p 80:80 -v /var/gotify/data:/app/data gotify/server
# or via GitHub registry
$ docker run -p 80:80 -v /var/gotify/data:/app/data ghcr.io/gotify/server
```

[gotify/server](https://hub.docker.com/r/gotify/server) and
[ghcr.io/gotify/server](https://github.com/gotify/server/pkgs/container/server)
are multi-arch Docker images supporting amd64, i386, arm64, armv7, and riscv64.

`/app/data` contains the database file (if SQLite is used), application images and certificates (if Let's Encrypt is enabled).
In this example the directory is mounted to `/var/gotify/data`, include this directory in your backups.

The time zone inside the container is configurable via the `TZ` environment variable:

```bash
$ docker run -p 80:80 -e TZ="Europe/Berlin" -v /var/gotify/data:/app/data gotify/server
```

::: details Example docker-compose.yaml

```yml
---
services:
  gotify:
    image: gotify/server
    ports:
      - 8080:80
    environment:
      GOTIFY_DEFAULTUSER_PASS: 'admin'
    volumes:
      - './gotify_data:/app/data'
    # to run gotify as a dedicated user:
    # sudo chown -R 1234:1234 ./gotify_data
    # user: "1234:1234"
```

:::

## Binary

Latest version:
<a href="https://github.com/gotify/server/releases/latest">
<img alt="latest release" src="https://img.shields.io/github/release/gotify/server.svg">
</a>

### Supported Platforms

- linux-amd64 (64bit)
- linux-386 (32bit)
- linux-arm-7 (32bit, used for Raspberry Pi)
- linux-arm64 (ARMv8)
- linux-riscv64 (RISC-V)
- windows-386.exe (32bit)
- windows-amd64.exe (64bit)

Download the zip with the binary for your platform from [gotify/server Releases](https://github.com/gotify/server/releases).

This tutorial uses placeholders for the version and the platform.
You have to replace `{VERSION}` with the most recent version and `{PLATFORM}` with one of the supported platforms.

```bash
$ wget https://github.com/gotify/server/releases/download/v{VERSION}/gotify-{PLATFORM}.zip
```

Unzip the archive.

```bash
$ unzip gotify-{PLATFORM}.zip
```

Make the binary executable.

```bash
$ chmod +x gotify-{PLATFORM}
```

Execute gotify/server. By default it listens on port 80, which requires sudo.

Before starting, read the [Configuration](config.md) page if you, for example, want to change the port or use a different database.

```bash
$ sudo ./gotify-{PLATFORM}
```

## Source

See [build](build.md).
