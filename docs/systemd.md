---
id: systemd
title: systemd configuration
---

To manage starting, logging, etc. of Gotify, systemd can be used.

# Installation

For this example, Gotify is installed by root in a directory called
`/opt/gotify/` and the executable in there is called `gotify`. The config file
will be `/etc/gotify/config.yml` using relative paths as in the example and the
service will be run as root. A file called `/opt/gotify/gotify.service` should
be created by root containing:

```desktop
[Unit]
Description=Gotify
Requires=network.target
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/gotify
ExecStart=/opt/gotify/gotify
StandardOutput=file:/var/log/gotify/gotify.log
StandardError=file:/var/log/gotify/gotify-error.log
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Then the following commands enable systemd to start Gotify at boot:

```bash
sudo mkdir /var/log/gotify
sudo chmod -R go-rw /opt/gotify /etc/gotify/config.yml /var/log/gotify
sudo ln -s /opt/gotify/gotify.service /etc/systemd/system/gotify.service
sudo systemctl daemon-reload
sudo systemctl enable gotify
```

# Start

Gotify can then be started manually with:

```bash
sudo systemctl start gotify
sudo systemctl status gotify
sudo tail /var/log/gotify/gotify.log
```
