import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

const UNSAFE_HTTP_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const csrfTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(request);
  }

  if (!isBackendRequest(request.url)) {
    return next(request);
  }

  if (!UNSAFE_HTTP_METHODS.has(request.method.toUpperCase())) {
    return next(request);
  }

  const document = inject(DOCUMENT);
  const csrfToken = readCookie(document.cookie, CSRF_COOKIE_NAME);

  if (csrfToken === null) {
    return next(request);
  }

  const requestWithCsrf = request.clone({
    setHeaders: {
      [CSRF_HEADER_NAME]: csrfToken,
    },
  });

  return next(requestWithCsrf);
};

function isBackendRequest(url: string): boolean {
  const pathname = extractPathname(url);

  return pathname.startsWith('/api/') || pathname.startsWith('/auth/');
}

function extractPathname(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return url;
  }
}

function readCookie(cookieHeader: string, cookieName: string): string | null {
  const cookies = cookieHeader.split(';');

  for (const cookie of cookies) {
    const [rawName, ...rawValueParts] = cookie.trim().split('=');

    if (rawName !== cookieName) {
      continue;
    }

    const rawValue = rawValueParts.join('=');

    return decodeURIComponent(rawValue);
  }

  return null;
}