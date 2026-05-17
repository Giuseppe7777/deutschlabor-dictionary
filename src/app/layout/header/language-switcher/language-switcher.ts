import { Component, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { InterfaceLanguage } from '../../../core/i18n/interface-language';
import { InterfaceLanguageService } from '../../../core/i18n/interface-language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  private readonly router = inject(Router);
  private readonly interfaceLanguageService = inject(InterfaceLanguageService);

  readonly languageChangePendingChange = output<boolean>();

  readonly supportedLanguages = this.interfaceLanguageService.supportedLanguages;
  readonly currentLanguage = this.interfaceLanguageService.currentLanguage;

  readonly isLanguageMenuOpen = signal(false);
  readonly isLanguageMenuClosing = signal(false);

  private readonly languageMenuAnimationMs = 430;
  private readonly languageHeaderFadeMs = 180;

  toggleLanguageMenu(): void {
    if (this.isLanguageMenuClosing()) {
      return;
    }

    if (this.isLanguageMenuOpen()) {
      this.closeLanguageMenuAfterAnimation();
      return;
    }

    this.isLanguageMenuOpen.set(true);
  }

  changeLanguage(language: InterfaceLanguage): void {
    if (this.isLanguageMenuClosing()) {
      return;
    }

    if (language === this.currentLanguage()) {
      this.closeLanguageMenuAfterAnimation();
      return;
    }

    const targetUrl = this.buildUrlWithLanguage(language);

    this.languageChangePendingChange.emit(true);

    this.closeLanguageMenuAfterAnimation(() => {
      void this.router.navigateByUrl(targetUrl).finally(() => {
        setTimeout(() => {
          this.languageChangePendingChange.emit(false);
        }, this.languageHeaderFadeMs);
      });
    });
  }

  private closeLanguageMenuAfterAnimation(afterClosed?: () => void): void {
    if (!this.isLanguageMenuOpen()) {
      afterClosed?.();
      return;
    }

    this.isLanguageMenuClosing.set(true);

    setTimeout(() => {
      this.isLanguageMenuOpen.set(false);
      this.isLanguageMenuClosing.set(false);
      afterClosed?.();
    }, this.languageMenuAnimationMs);
  }

  private buildUrlWithLanguage(language: InterfaceLanguage): string {
    const [pathAndQuery, fragment] = this.router.url.split('#');
    const [path, query] = pathAndQuery.split('?');

    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) {
      segments.push(language);
    } else {
      segments[0] = language;
    }

    const targetPath = `/${segments.join('/')}`;
    const targetQuery = query ? `?${query}` : '';
    const targetFragment = fragment ? `#${fragment}` : '';

    return `${targetPath}${targetQuery}${targetFragment}`;
  }
}