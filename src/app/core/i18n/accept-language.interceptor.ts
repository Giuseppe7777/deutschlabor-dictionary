import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { InterfaceLanguageService } from './interface-language.service';

export const acceptLanguageInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isBackendRequest(request.url)) {
    return next(request);
  }

  const interfaceLanguageService = inject(InterfaceLanguageService);
  const language = interfaceLanguageService.currentLanguage();

  const requestWithLanguage = request.clone({
    setHeaders: {
      'Accept-Language': language,
    },
  });

  return next(requestWithLanguage);
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