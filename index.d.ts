import { Toucan, Options } from "toucan-js";

interface Env {
    SENTRY_DSN: string,
    SENTRY_CLIENT_ID: string,
    SENTRY_CLIENT_SECRET: string,
}

export function initSentry(request: Request, env: Env, context: ExecutionContext, additionalOptions: Options = {}): Toucan;