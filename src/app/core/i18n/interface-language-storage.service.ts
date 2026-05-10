import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import {
  INTERFACE_LANGUAGE_STORAGE_KEY,
  InterfaceLanguage,
  isSupportedInterfaceLanguage,
} from './interface-language';

@Injectable({
  providedIn: 'root',
})
export class InterfaceLanguageStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  read(): InterfaceLanguage | null {
    if (!this.isBrowser()) {
      return null;
    }

    const storedLanguage = localStorage.getItem(INTERFACE_LANGUAGE_STORAGE_KEY);

    if (!isSupportedInterfaceLanguage(storedLanguage)) {
      return null;
    }

    return storedLanguage;
  }

  write(language: InterfaceLanguage): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(INTERFACE_LANGUAGE_STORAGE_KEY, language);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}