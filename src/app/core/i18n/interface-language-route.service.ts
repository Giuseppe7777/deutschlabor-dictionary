import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { InterfaceLanguageService } from './interface-language.service';

@Injectable({
  providedIn: 'root',
})
export class InterfaceLanguageRouteService {
  private readonly router = inject(Router);
  private readonly interfaceLanguageService = inject(InterfaceLanguageService);

  constructor() {
    this.syncLanguageFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      )
      .subscribe((event) => {
        this.syncLanguageFromUrl(event.urlAfterRedirects);
      });
  }

  private syncLanguageFromUrl(url: string): void {
    const pathWithoutQuery = url.split(/[?#]/)[0];
    const firstSegment = pathWithoutQuery.split('/').filter(Boolean)[0];

    this.interfaceLanguageService.setLanguageFromUnknown(firstSegment);
  }
}