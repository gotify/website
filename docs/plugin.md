---
id: plugin
title: Intro to Gotify Plugins
---

## Description

_This documentation is generally designed for plugin developers. If you just wanted to use an existing plugin, you would need to refer to the documentation from the plugin maintainer._

Gotify plugins are platform executables that use the gRPC architecture and contains two core behaviors:

- Establishing a secure socket connection to the server through a certificate exchange (abbreviated as `kex` in API and protocol documentation).
- Act as a gRPC server that responds to requests from the server and provides updates to the user's state.

## Features

- One plugin instance per user
- Registering custom http handlers
- Sending messages as an application
- YAML-based configuration system on the WebUI
- Persistent storage per plugin user instance
- Displaying dynamically generated instructions to users

## Applications

- Receiving webhooks from GitHub, Travis CI, etc.
- Polling new feeds through RSS, Atom, or other sources.
- Extending the WebUI functionality.
- Delivering alarm notifications.

## Architecture

- gRPC based, plugin is the "server" and gotify/server is the "client".
- each user gets a long-running server-streaming RPC.
- Backwards compatibility is provided by:
  - Using optional fields in the `RunUserInstanceServer` initialization request.
  - Using separate RPCs for functionally disjoint features. So the call interface can be extended without pushing breaking changes to the whole RPC schema.

## Development Workflow

### Using the official Go Plugin Template

Use the template [`gotify/plugin-template`](https://github.com/gotify/plugin-template) to scaffold your plugin.

The core logic happens in `PluginServer#RunUserInstance`, which creates a context that is valid (not cancelled) for the duration of the session.

```

func (s *PluginServer) RunUserInstance(req *protobuf.UserInstanceRequest, stream protobuf.Plugin_RunUserInstanceServer) error {
	for i := range myplugin.Capabilities {
		if err := stream.Send(&protobuf.InstanceUpdate{
			Update: &protobuf.InstanceUpdate_Capable{
				Capable: myplugin.Capabilities[i],
			},
		}); err != nil {
			return err
		}
	}
	ticker := time.NewTicker(10 * time.Second)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		// your logic here
		//
		_ = ctx
	}()

	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if err := stream.Send(&protobuf.InstanceUpdate{
				Update: &protobuf.InstanceUpdate_Ping{
					Ping: new(emptypb.Empty),
				},
			}); err != nil {
				return err
			}
		case <-s.shutdown:
			return nil
		}
	}
}
```


### Manual Implementation in your favorite Language/Scaffold

We support "duck-typed" plugins (i.e. plugins that loosely behave like one built using the Go template), namely it has to provide two functions:
- A TLS key exchange using secure file descriptors at startup.
- A long running gRPC server that instantiates a server-side stream for each user session.

The protobuf files are located in [gotify/plugin-api](https://github.com/gotify/plugin-api) repository.
