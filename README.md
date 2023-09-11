# Kopia UI

This is an **unofficial, work-in-progress reimplementation** of the [Kopia](https://kopia.io) User Interface aiming to
provide a better overview and user experience than the current official one.


## Getting started

I don't provide builds currently because a lot of features are still missing.


## Development environment


### Stack

- Nuxt 3
- Vuetify


### Prerequisites

- [Bun](https://bun.sh/) <small>(Node.js + npm/yarn *may* work as well, although untested)</small>


### Setup

Install all dependencies with `bun install` and run the development server with `bun run dev`. After a while, the
application should be accessible at http://localhost:3000.

To connect to a Kopia server, it is currently necessary to manually inject CORS headers using a reverse proxy.
Because of that I added a preconfigured reverse proxy that you can start with `bun run kopia-proxy`.
For the proxy to work, start Kopia with the following CLI arguments:

```sh
kopia server start --insecure --disable-csrf-token-checks --server-password=<your-password-here>
```

- `--insecure` to disable HTTPS
- `--disable-csrf-token-checks` to disable CSRF tokens. This is necessary as Kopia cannot inject tokens into our
  application because it is hosted by the development server.

Then you should be able to connect to Kopia by specifying this API URL in the application:

```
http://localhost:8010/proxy/api/v1
```