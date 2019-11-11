---
id: install
title: Installation
---

## Docker

Setting up gotify/server with docker is pretty easy, you basically just have to start the docker container and you are ready to go:

Before starting gotify/server you may read the [Configuration](configuration.md) if you f.ex. use a different database.

```bash
$ docker run -p 80:80 -v /var/gotify/data:/app/data gotify/server
```

there is a specific docker image for arm-7 processors (raspberry pi), named gotify/server-arm7.

```bash
$ docker run -p 80:80 -v /var/gotify/data:/app/data gotify/server-arm7
```

`/app/data` contains the database file (if sqlite is used), images for applications and cert-files (if lets encrypt is enabled).
In this example the directory is mounted to `/var/gotify/data` this directory should be included in a backup.

## Binary

In this tutorial we set up gotify/server v2.0.5 on a 64 bit linux server but it should be similar on other platforms.

Download the zip with the binary for your platform from [gotify/server Releases](https://github.com/gotify/server/releases).

```bash
$ wget https://github.com/gotify/server/releases/download/v2.0.5/gotify-linux-amd64.zip
```

Unzip the archive.

```bash
$ unzip gotify-linux-amd64.zip
```

Make the binary executable.

```bash
$ chmod +x gotify-linux-amd64
```

Execute gotify/server. (By default gotify/server is started on port 80 so it requires sudo)

Before starting gotify/server you may read the [Configuration](configuration.md) if you f.ex. want to change the port or use a different database.

```bash
$ sudo ./gotify-linux-amd64
```

If you are on a Linux system with `systemd` available and want to run gotify as a Service, you may want to read [Running as a Service](running-as-a-service.md).

## Source

See [build](build.md).
