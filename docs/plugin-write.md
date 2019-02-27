---
id: plugin-write
title: Writing Plugins
---

## Description

Lets take a closer look at the minimal plugin instance we created in the [intro](plugin.md) part:

```golang
// Plugin is plugin instance
type Plugin struct{}

// Enable implements plugin.Plugin
// Invoked just after initialization if plugin is already enabled.
// Invoked every time the plugin is switched to enabled.
func (c *Plugin) Enable() error {
	return nil
}

// Disable implements plugin.Plugin
// Invoked every time the plugin is switched to disabled.
func (c *Plugin) Disable() error {
	return nil
}
```

Now only the base [`Plugin`](https://godoc.org/github.com/gotify/plugin-api#Plugin) interface has been implemented.
To give it more functionalities, more interfaces can be implemented.

## APIs

### Intro

The APIs are provided as interfaces will be called during plugin initialization and/or remote API invocation to obtain information or provide callbacks.

### API Interfaces

_These are all API interfaces exposed by gotify. Some interface implementations are omitted in the examples._

#### Displayer

[`Displayer`](https://godoc.org/github.com/gotify/plugin-api#Displayer) is the most simple form of plugin API, it is used to provide instructions on the plugin page in the WebUI.
Plugins can dynamically generate information based on the current state.
It receives a `location` parameter contains the server's hostname, port and scheme recovered from the original request to the `Displayer` API.
Markdown is supported.

The REST API for this exposed at [`/plugin/:id/display`](/api-docs#/plugin/getPluginDisplay).

```golang
// Plugin is the plugin instance
type Plugin struct {
    userCtx plugin.UserContext
}

// GetDisplay implements plugin.Displayer
// Invoked when the user views the plugin settings. Plugins do not need to be enabled to handle GetDisplay calls.
func (c *Plugin) GetDisplay(location *url.URL) string {
    if (c.userCtx.Admin) {
        return "You are an admin! You have super cow powers."
    } else {
        return "You are **NOT** an admin! You can do nothing:("
    }
}

// NewGotifyPluginInstance creates a plugin instance for a user context.
func NewGotifyPluginInstance(ctx plugin.UserContext) plugin.Plugin {
	return &Plugin{ctx}
}
```

#### Messenger

[`Messenger`](https://godoc.org/github.com/gotify/plugin-api#Messenger) is used to send messages.
It is called with a callback that plugin instances can call at any time to send messages to the user.

```golang
// Plugin is the plugin instance
type Plugin struct {
    msgHandler plugin.MessageHandler
}

// SetMessageHandler implements plugin.Messenger
// Invoked during initialization
func (c *Plugin) SetMessageHandler(h plugin.MessageHandler) {
    c.msgHandler = h
}

func (c *Plugin) Enable() error {
    go func() {
        time.Sleep(5 * time.Second)
        c.msgHandler.SendMessage(plugin.Message{
            Message: "The plugin has been enabled for 5 seconds.",
        })
    }()
    return nil
}
```

#### Storager

[`Storager`](https://godoc.org/github.com/gotify/plugin-api#Storager) is used to store permanent information on the gotify database on the user level.
Data serialization is handled by the plugin itself.

```golang
// Plugin is the plugin instance
type Plugin struct {
    storageHandler plugin.StorageHandler
}

// SetStorageHandler implements plugin.Storager
// Invoked during initialization
func (c *Plugin) SetStorageHandler(h plugin.StorageHandler) {
    c.storageHandler = h
}

type Storage struct {
    EnabledTimes uint `json:"enabled_times"`
}

func (c *Plugin) Enable() error {
    storage := new(Storage)
    storageBytes, err := c.storageHandler.Load()
    if err != nil {
        return err
    }
    if len(storageBytes) == 0 {
        storage.EnabledTimes = 1
        storageBytes, _ = json.Marshal(storage)
        c.storageHandler.Save(storageBytes)
    } else {
        json.Unmarshal(storageBytes, storage)
    }
    log.Printf("This plugin has been enabled %d times.", storage.EnabledTimes)
    return nil
}
```

#### Webhooker

[`Webhooker`](https://godoc.org/github.com/gotify/plugin-api#Webhooker) is used to register custom gin handlers.
The base path is the base path of the `RouterGroup`, which is kept consistent between restarts.
Plugins can assemble an absolute webhook URL by combining `basePath` and `location` parameter in `Displayer` call.
Useful to register webhook handlers. In theory you can even register a complete UI here.

```golang
// Plugin is the plugin instance
type Plugin struct {
    basePath string
}

// RegisterWebhook implements plugin.Webhooker
// Invoked during initialization.
// Webhooks are unreachable when plugins are disabled.
func (c *Plugin) RegisterWebhook(basePath string, mux *gin.RouterGroup) {
    c.basePath = basePath
    mux.POST("/hook", func(c *gin.Context) {
        // Processes webhook and take actions(sending messages, etc.)
    })
}

// GetDisplay implements plugin.Displayer
func (c *Plugin) GetDisplay(location *url.URL) string {
    baseLocation := &url.URL{
		Path: c.basePath,
	}
	if location != nil {
        // If the server location can be determined, make the URL absolute
		loc.Scheme = location.Scheme
		loc.Host = location.Host
	}
	loc = loc.ResolveReference(&url.URL{
		Path: "hook",
	})
    return fmt.Sprintf("Set your webhook URL to %s and you are all set", loc)
}
```

#### Configurer

[`Configurer`](https://godoc.org/github.com/gotify/plugin-api#Configurer) is used to provide configuration interfaces to the user.
Marshaling and Unmarshaling is handled by the gotify main program.

The REST API for this is exposed at [`/plugin/:id/config`](/api-docs#/plugin/getPluginConfig).

```golang
// Plugin is the plugin instance
type Plugin struct {
    config *Config
}

type Config struct {
    GitHubUserName string
}

// DefaultConfig implements plugin.Configurer
// The default configuration will be provided to the user for future editing. Also used for Unmarshaling.
// Invoked whenever an unmarshaling is required.
func (c *Plugin) DefaultConfig() interface{} {
    return &Config{
        GitHubUserName: "jmattheis",
    }
}

// ValidateAndSetConfig will be called every time the plugin is initialized or the configuration has been changed by the user.
// Plugins should validate the configuration and optionally return an error.
// Parameter is guaranteed to be the same type as the return type of DefaultConfig(), so it is safe to do a hard type assertion here.
//
// "Validation" in this context means to check for conflicting or impossible values, such as a non-URL on a field which should only contain a URL.
// In order to make sure that the plugin instance is always running in a valid state, this method should always accept the result of DefaultConfig()
//
// Invoked on initialization to provide initial configuration. Return nil to accept or return error to indicate that the config is obsolete.
// When the configuration is marked obsolete due to an unmarshaling error or rejection on the plugin side, the plugin is disabled automatically and the user is notified to resolve the config confliction.
// Invoked every time the config update API is called. Check the configuration and return nil to accept or return error to indicate that the config is invalid.
// Return a short and consise error here and, if you have detailed suggestions on how to solve the problem, utilize Displayer to provide more information to the user,
func (c *Plugin) ValidateAndSetConfig(c interface{}) error {
    config = c.(*Config)
    if !userNameIsValid(config.GitHubUserName) {
        return errors.New("the user name is not valid")
    }
    c.config = config
    return nil
}
```

## Effective Plugin Practices

Although we have covered how to implement plugin functionalities in the last chapter, it is very important to take these practices to make sure your plugin can be loaded successfully and works effectively.

- Use [go modules](https://github.com/golang/go/wiki/Modules) to manage dependencies, and use [gomod-cap](https://github.com/gotify/plugin-api/#githubcomgotifycmdgomod-cap) to prevent incompatible dependencies.
- Handle all errors. A panic in a goroutine spawned in the plugin can crash the whole gotify program.
- Provide detailed plugin info and utilize [`Displayer`](/docs/plugin-api#displayer) to show instructions to users. A detailed plugin info would be shown in the WebUI which makes it easier to be identified and used.

You can clone the official plugin [template](https://github.com/gotify/plugin-template) and [showcase](https://github.com/gotify/plugins) to see plugins in action and/or to bootstrap your project.
