---
id: plugin
title: Intro to Gotify Plugins
---

> Plugins are currently only supported on Linux and MacOS due to a current limitation of golang.

## Description

_This documentation is generally designed for plugin developers. If you just wanted to use an existing plugin, you would need to refer to the documentation from the plugin maintainer._

Gotify provides built-in plugin functionality built on top of the [go plugin system](https://godoc.org/plugin). It is built for extending Gotify functionality.

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

## Get Started

First let's see a minimal example of gotify plugin, you can copy this boilerplate code to bootstrap your own plugin:

```golang
package main

import (
	"github.com/gotify/plugin-api"
)

// GetGotifyPluginInfo returns gotify plugin info
func GetGotifyPluginInfo() plugin.Info {
	return plugin.Info{
		Name:       "minimal plugin",
		ModulePath: "github.com/gotify/server/example/minimal",
	}
}

// Plugin is plugin instance
type Plugin struct{}

// Enable implements plugin.Plugin
func (c *Plugin) Enable() error {
	return nil
}

// Disable implements plugin.Plugin
func (c *Plugin) Disable() error {
	return nil
}

// NewGotifyPluginInstance creates a plugin instance for a user context.
func NewGotifyPluginInstance(ctx plugin.UserContext) plugin.Plugin {
	return &Plugin{}
}

func main() {
	panic("this should be built as go plugin")
}
```

This program exports two functions: `GetGotifyPluginInfo` and `NewGotifyPluginInstance`, gotify will use these to obtain the plugin metadata and create plugin instances for each user.

The `GetGotifyPluginInfo` must return a [`plugin.Info`](https://godoc.org/github.com/gotify/plugin-api#Info) containing descriptive info of the current plugin, all fields are optional except `ModulePath`(the module path of this plugin), which is used to distinguish different plugins.

The `NewGotifyPluginInstance` is called with a [`plugin.UserContext`](https://godoc.org/github.com/gotify/plugin-api#UserContext) for each user at startup and every time a new user is added, the plugin must return a plugin instance that satisfies [`plugin.Plugin`](https://godoc.org/github.com/gotify/plugin-api#Plugin) interface.
More functionalities can be implemented by implementing more interfaces in the [`plugin-api`](https://godoc.org/github.com/gotify/plugin-api#Info) package.
