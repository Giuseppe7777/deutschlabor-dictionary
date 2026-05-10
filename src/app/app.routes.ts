import { Routes } from '@angular/router';
import { DEFAULT_INTERFACE_LANGUAGE } from './core/i18n/interface-language';
import { interfaceLanguageUrlMatcher } from './core/i18n/interface-language-url.matcher';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_INTERFACE_LANGUAGE,
  },
  {
    matcher: interfaceLanguageUrlMatcher,
    children: [],
  },
  {
    path: '**',
    redirectTo: DEFAULT_INTERFACE_LANGUAGE,
  },
];
