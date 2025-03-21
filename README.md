# @cloudflare/worker-sentry

> Sentry over Access for Worker

## Installation

```bash
npm install -D @cloudflare/worker-sentry
```

## Example

```js
import { initSentry } from "@cloudflare/worker-sentry";

export default {
  async fetch(request, env, context) {
    const sentry = initSentry(request, env, context);

    try {
      console.log("Got request", request);
      const response = await fetch(request);
      console.log("Got response", response);
      return response;
    } catch (e) {
      sentry.captureException(e);
      return new Response("internal error", { status: 500 });
    }
  }
} 
```

## Additional `toucan-js` options

The API: `initSentry(request, env, context, additionalOptions = {})` allows any options to be passed directly to `toucan-js`. For instance to specify the `environment` the worker is running in.

## Usage with wrangler

```toml
name = "sentry-test"
account_id = "your account_id"

[vars]
SENTRY_DSN = "Sentry DSN"
SENTRY_CLIENT_ID = "Access client ID"
SENTRY_CLIENT_SECRET = "Access client secret"
```
