---
id: render
title: Render
---

[Render](https://render.com) is a new cloud provider that makes it trivial to deploy your Gotify server in just a few clicks. You get an `onrender.com` SSL subdomain and websocket support out of the box.

Use invite code `gotify` to sign up for a Render account.

1. Create a new [PostgreSQL database](https://render.com/docs/databases) on Render. Set the **Name**, **Database**, and **User** to `gotify`.

2. Fork [render-examples/gotify-server](https://github.com/render-examples/gotify-server) and create a new **Web Service** on Render, giving Render's GitHub app permission to access your forked repo.

3. On the service creation page, add the following environment variable under **Advanced**. Use the internal database hostname and password from the database you created earlier.

   | Key                | Value           |
   | ------------------ | --------------- |
   | `GOTIFY_DATABASE_CONNECTION`  | `host=your-db-hostname port=5432 user=gotify dbname=gotify password=your-db-password` |

That's it! Your Gotify server will be available on your `onrender.com` URL in less than a minute. Don't forget to log in and change the admin password.

You can also add a [custom domain](https://render.com/docs/custom-domains) to your service and Render will automatically issue and manage SSL certificates for your domain. Make sure to add the domain to the list of allowed origins in your [configuration file](/docs/config#config-file).
