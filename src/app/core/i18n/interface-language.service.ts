import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  DEFAULT_INTERFACE_LANGUAGE,
  InterfaceLanguage,
  isSupportedInterfaceLanguage,
  SUPPORTED_INTERFACE_LANGUAGES,
} from './interface-language';
import { InterfaceLanguageStorageService } from './interface-language-storage.service';

@Injectable({
  providedIn: 'root',
})
export class InterfaceLanguageService {
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(InterfaceLanguageStorageService);

  private readonly currentLanguageSignal = signal<InterfaceLanguage>(
    DEFAULT_INTERFACE_LANGUAGE,
  );

  readonly currentLanguage = this.currentLanguageSignal.asReadonly();
  readonly supportedLanguages = SUPPORTED_INTERFACE_LANGUAGES;

  constructor() {
    this.translate.addLangs([...SUPPORTED_INTERFACE_LANGUAGES]);
    this.translate.setFallbackLang(DEFAULT_INTERFACE_LANGUAGE);

    const storedLanguage = this.storage.read();

    this.activateLanguage(storedLanguage ?? DEFAULT_INTERFACE_LANGUAGE, false);
  }

  setLanguage(language: InterfaceLanguage): void {
    this.activateLanguage(language, true);
  }

  setLanguageFromUnknown(value: string | null | undefined): boolean {
    if (!isSupportedInterfaceLanguage(value)) {
      return false;
    }

    this.setLanguage(value);

    return true;
  }

  private activateLanguage(language: InterfaceLanguage, persist: boolean): void {
    this.currentLanguageSignal.set(language);
    this.translate.use(language);

    if (persist) {
      this.storage.write(language);
    }
  }
}