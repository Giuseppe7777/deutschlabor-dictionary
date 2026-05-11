import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { InterfaceLanguageService } from '../../core/i18n/interface-language.service';
import { InterfaceLanguage } from '../../core/i18n/interface-language';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly router = inject(Router);
  private readonly interfaceLanguageService = inject(InterfaceLanguageService);

  readonly supportedLanguages = this.interfaceLanguageService.supportedLanguages;
  readonly currentLanguage = this.interfaceLanguageService.currentLanguage;

  localizedPath(path: string): string[] {
    const segments = path.split('/').filter(Boolean);

    return ['/', this.currentLanguage(), ...segments];
  }

  changeLanguage(language: InterfaceLanguage): void {
    const targetUrl = this.buildUrlWithLanguage(language);

    void this.router.navigateByUrl(targetUrl);
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