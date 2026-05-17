import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { InterfaceLanguageService } from '../../core/i18n/interface-language.service';
import { AuthStateService } from '../../features/auth/services/auth-state.service';
import { LanguageSwitcher } from './language-switcher/language-switcher';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  private readonly interfaceLanguageService = inject(InterfaceLanguageService);
  private readonly authState = inject(AuthStateService);

  readonly currentLanguage = this.interfaceLanguageService.currentLanguage;
  readonly isLanguageChangePending = signal(false);

  readonly isAnonymous = this.authState.isAnonymous;
  readonly isAuthenticated = this.authState.isAuthenticated;
  readonly currentUser = this.authState.user;

  readonly isLogoutPending = signal(false);
  readonly logoutErrorKey = signal<string | null>(null);

  readonly userEmail = computed(() => this.currentUser()?.email ?? '');

  readonly userInitial = computed(() => {
    const email = this.userEmail();

    return email.length > 0 ? email.charAt(0).toUpperCase() : '?';
  });

  localizedPath(path: string): string[] {
    const segments = path.split('/').filter(Boolean);

    return ['/', this.currentLanguage(), ...segments];
  }

  setLanguageChangePending(isPending: boolean): void {
    this.isLanguageChangePending.set(isPending);
  }

  logout(): void {
    if (this.isLogoutPending()) {
      return;
    }

    this.logoutErrorKey.set(null);
    this.isLogoutPending.set(true);

    this.authState
      .logout()
      .pipe(
        finalize(() => {
          this.isLogoutPending.set(false);
        }),
      )
      .subscribe({
        next: () => {
          void this.router.navigate(this.localizedPath(''));
        },
        error: (error) => {
          if (error?.status === 401) {
            this.authState.clearAuthenticatedUser();
            void this.router.navigate(this.localizedPath(''));
            return;
          }

          this.logoutErrorKey.set('auth.logoutError');
        },
      });
  }
}