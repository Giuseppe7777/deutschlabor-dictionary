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
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dictionary/pages/search-page/search-page').then(
            (m) => m.SearchPage,
          ),
      },
      {
        path: 'training',
        loadComponent: () =>
          import('./features/training/pages/training-page/training-page').then(
            (m) => m.TrainingPage,
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/pages/account-page/account-page').then(
            (m) => m.AccountPage,
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page').then(
            (m) => m.LoginPage,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register-page/register-page').then(
            (m) => m.RegisterPage,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: DEFAULT_INTERFACE_LANGUAGE,
  },
];
