import Toucan from 'toucan-js';

export function initSentry(event, additionalOptions = {}) {
  const sentry = new Toucan({
    dsn: SENTRY_DSN,
    event: event,
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
    rewriteFrames: {
      root: '/',
    },
    transportOptions: {
      headers: {
        'CF-Access-Client-ID': SENTRY_CLIENT_ID,
        'CF-Access-Client-Secret': SENTRY_CLIENT_SECRET,
      },
    },
    ...additionalOptions
  });
  
  if (typeof event.request === 'undefined') {
    return sentry;
  }

  const request = event.request;
  const colo = request.cf && request.cf.colo ? request.cf.colo : 'UNKNOWN';

  sentry.setTag('colo', colo);

  // cf-connecting-ip should always be present, but if not we can fallback to XFF.
  const ipAddress = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
  const userAgent = request.headers.get('user-agent') || null;

  sentry.setUser({
    ip: ipAddress,
    userAgent: userAgent,
    colo: colo,
  });

  return sentry;
}
