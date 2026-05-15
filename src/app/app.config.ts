import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { acceptLanguageInterceptor } from './core/i18n/accept-language.interceptor';
import { csrfTokenInterceptor } from './core/http/csrf-token.interceptor';
import { DEFAULT_INTERFACE_LANGUAGE } from './core/i18n/interface-language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([acceptLanguageInterceptor, csrfTokenInterceptor]),),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: DEFAULT_INTERFACE_LANGUAGE,
      lang: DEFAULT_INTERFACE_LANGUAGE,
    }),
  ],
};
