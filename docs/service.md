---
id: service
title: Register as System Service
---

## Systemd Service File

If you run Gotify from the executable, you can easily register it as a system service.
On Debian based systems make the file

```bash
/etc/systemd/system/gotify.service
```
with the following content:

```bash
[Unit]
Description=Gotify Server
After=network.target

[Service]
Type=simple
User=gotify
ExecStart=/path/to/gotify-executable
Restart=always

[Install]
WantedBy=multi-user.target
```

Now register the service with

```bash
$ systemctl daemon-reload
```

Now you should be able to start and stop the server with

```bash
$ service gotify start
$ service gotify stop
```

and it restarts automatically in case of failure

## Explanation

After=network.target ensures Gotify is started after the network services when rebooting. When using MySQL add another line

```bash
After=mysqld.service
```

User=gotify starts the server as the gotify user. Make sure an appropriate user exists on the system and it has the necessary privileges to run the executable and write access to the directories specified in the config.yml

Restart=always ensures that the service is restarted immediately. Another option is Restart=on-failure which does not restart the service if the exit code is 0 (terminated on purpose).

WantedBy=multi-user.target defines the system runlevel at which the process is started.
