---
id: systemd
title: Running as a service
---

Like any Linux executable, gotify can be configured to run as a service managed by systemd (available e.g. on Ubuntu Server and Amazon Linux).
It is also good practice to put executables, logs and program data into their
standard posix locations:

- `/var/lib/gotify`: program data
- `/usr/share/gotify/bin`: executable
- `/var/log/gotify`: logs

## Config

An example config pointing to the right file locations can be seen here:

```yml
# Example configuration file for the server.
# Save it to `systemd-config.yml` when edited

server:
  listenaddr: "" # the address to bind on, leave empty to bind on all addresses
  port: 8080 # the port the HTTP server will listen on. 8080 instead of 80 since we do not run as root

  ssl:
    enabled: false # if https should be enabled
    redirecttohttps: false # redirect to https if site is accessed by http
    listenaddr: "" # the address to bind on, leave empty to bind on all addresses
    port: 443 # the https port
    certfile: # the cert file (leave empty when using letsencrypt)
    certkey: # the cert key (leave empty when using letsencrypt)
    letsencrypt:
      enabled: false # if the certificate should be requested from letsencrypt
      accepttos: false # if you accept the tos from letsencrypt
      cache: /var/lib/gotify/certs # the directory of the cache from letsencrypt
      hosts: # the hosts for which letsencrypt should request certificates
  #      - mydomain.tld
  #      - myotherdomain.tld

  responseheaders: # response headers are added to every response (default: none)
    Access-Control-Allow-Origin: "*"
    Access-Control-Allow-Methods: "GET,POST"

  stream:
    allowedorigins: # allowed origins for websocket connections (same origin is always allowed)
#      - "" # activate this for accessing from an electron app
#      - "otherdomain.com"

database: # for database see (configure database section)
  dialect: sqlite3
  connection: /var/lib/gotify/gotify.db

defaultuser: # on database creation, gotify creates an admin user
  name: admin # the username of the default user
  pass: admin # the password of the default user
passstrength: 10 # the bcrypt password strength (higher = better but also slower)
uploadedimagesdir: /var/lib/gotify/images # the directory for storing uploaded images
pluginsdir: /var/lib/gotify/plugins # the directory where plugins reside
```

## `.service` file

To configure systemd for running gotify, we need a `gotify.service` file like this (more on the structure of this file [here](https://www.freedesktop.org/software/systemd/man/systemd.service.html)):

```
[Unit]
Description=gotify

[Service]
Type=simple
User=gotify
ExecStart=/usr/share/gotify/bin/gotify-linux-amd64
Restart=always
# WorkingDirectory=/usr/share/gotify
# these files are of limited use since they are overwritten each time the service restarts
# append is supported since systemd version 240, 'systemctl --version' currently yields 237 on Ubuntu Server 18.04
# for full logs, see 'journalctl -u gotify'
StandardOutput=file:/var/log/gotify/gotify.log
StandardError=file:/var/log/gotify/gotify-error.log

[Install]
WantedBy=multi-user.target
```

## Installation

After creating such a `systemd-config.yml` and `gotify.service` file in our unzipped folder containing the binary for linux (see [Installation](installation.md) for details), the only thing left to do is

- copying the files to the right locations
- creating a user to run gotify as
- reload systemd configuration.

You can do this with the following commands (or create a `install-service.sh` file from this, make it executable and run it):

```bash
#!/bin/bash

# add non-login user gotify
sudo useradd -r gotify

# copy systemd config to right folder
sudo cp gotify.service /etc/systemd/system

# copy files to standard locations
sudo mkdir -p /usr/share/gotify/bin && sudo cp gotify-linux-amd64 /usr/share/gotify/bin
sudo mkdir /etc/gotify && sudo cp systemd-config.yml /etc/gotify/config.yml
sudo mkdir /var/log/gotify
sudo mkdir -p /var/lib/gotify/images && sudo mkdir /var/lib/gotify/plugins && sudo chown -R gotify /var/lib/gotify

# reload systemd configuration
sudo systemctl daemon-reload
echo "Service gotify installed"
echo "- Binary is in /usr/share/gotify/bin"
echo "- Sqlite database is in /var/lib/gotify"
echo "- config is in /etc/gotify"
echo "- Access logs via journalctl -u gotify or at /var/log/gotify"
echo "- Start with sudo systemctl start gotify"
echo "- Start at boot with sudo systemctl enable gotify"
```

After this, you can

- start gotify with `sudo systemctl start gotify`
- stop gotify with `sudo systemctl stop gotify`
- run gotify at startup with `sudo systemctl enable gotify`
- stop running gotify at startup with `sudo systemctl disable gotify`
- access logs reliably with `sudo journalctl -u gotify`

## Removal

To uninstall gotify, you can do the following (or save as `uninstall-service.sh` and run):

```bash
#!/bin/bash
sudo systemctl stop gotify.service
sudo rm -rf /etc/systemd/system/gotify.service && echo "removed .service file"
sudo rm -rf /etc/gotify && echo "removed config dir"
sudo rm -rf /usr/share/gotify && echo "removed binaries"
sudo rm -rf /var/log/gotify && echo "removed logs"
sudo rm -rf /var/lib/gotify && echo "removed data"
sudo userdel -f gotify && echo "user gotify deleted"
sudo systemctl daemon-reload && echo "uninstall complete"
```
