# AI Agents (MCP)

[[toc]]

Gotify provides a [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) endpoint at `/mcp`,
which lets AI agents such as Claude Code or VS Code Copilot send you push notifications,
e.g. when a long-running task is done or needs your input.

The endpoint uses the Streamable HTTP transport in stateless mode, so it works behind a reverse proxy
without any extra configuration.

## Authentication

The endpoint only accepts [application tokens](pushmsg.md). Messages are sent as that application,
and the agent can't read, delete or manage anything else. Pass the token via:

- the `Authorization: Bearer <apptoken>` header
- the `X-Gotify-Key: <apptoken>` header

## Client setup

Replace `https://gotify.example.com` with the URL of your Gotify server and `<apptoken>` with an application token.

### Claude Code

```bash
claude mcp add gotify --transport http https://gotify.example.com/mcp --header "Authorization: Bearer <apptoken>"
```

### VS Code

Add the server to `.vscode/mcp.json` or your user MCP configuration:

```json
{
  "servers": {
    "gotify": {
      "type": "http",
      "url": "https://gotify.example.com/mcp",
      "headers": {"Authorization": "Bearer <apptoken>"}
    }
  }
}
```

### Other clients

Add an MCP server with the Streamable HTTP transport, the URL `https://gotify.example.com/mcp`,
and the `Authorization: Bearer <apptoken>` header.

## The `send_message` tool

The endpoint exposes a single tool `send_message` with the following arguments:

| Argument        | Description                                                                                                      |
| :-------------- | :--------------------------------------------------------------------------------------------------------------- |
| `message`       | The message content. Required.                                                                                   |
| `title`         | The message title. Defaults to the application name.                                                             |
| `priority`      | The [message priority](priority.md). Defaults to the default priority of the application.                        |
| `markdown`      | Render the message as Markdown. Sets [`client::display`](msgextras.md#client-display).                           |
| `click_url`     | A URL to open when the notification is clicked. Sets [`client::notification`](msgextras.md#client-notification). |
| `big_image_url` | An image to show in the notification. Sets [`client::notification`](msgextras.md#client-notification).           |

## Disabling the endpoint

See [GOTIFY_MCP_ENABLED](config.md#gotify-mcp-enabled).
