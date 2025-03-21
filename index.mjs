import { rewriteFramesIntegration, Toucan } from 'toucan-js';

export function initSentry(request, env, context, additionalOptions = {}) {
  const sentry = new Toucan({
    dsn: env.SENTRY_DSN,
    context,
    request,
    allowedHeaders: [
      'user-agent',
      'cf-challenge',
      'accept-encoding',
      'accept-language',
      'cf-ray',
      'content-length',
      'content-type',
      'x-real-ip',
      'host',
    ],
    allowedSearchParams: /(.*)/,
    integrations: [
      rewriteFramesIntegration({root: "/"})
    ],
    transportOptions: {
      headers: {
        'CF-Access-Client-ID': env.SENTRY_CLIENT_ID,
        'CF-Access-Client-Secret': env.SENTRY_CLIENT_SECRET,
      },
    },
    ...additionalOptions
  });
  const colo = request.cf && request.cf.colo ? request.cf.colo : 'UNKNOWN';
  sentry.setTag('colo', colo);

  // cf-connecting-ip should always be present, but if not we can fallback to XFF.
  const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
  const userAgent = request.headers.get('user-agent') || '';
  sentry.setUser({ ip: ipAddress, userAgent: userAgent, colo: colo });
  return sentry;
}
