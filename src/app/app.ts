import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { InterfaceLanguageRouteService } from './core/i18n/interface-language-route.service';
import { AuthStateService } from './features/auth/services/auth-state.service';
import { Header } from './layout/header/header';
import { EmailVerificationNotice } from './features/auth/components/email-verification-notice/email-verification-notice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, EmailVerificationNotice],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly _interfaceLanguageRoute = inject(InterfaceLanguageRouteService);
  private readonly authStateService = inject(AuthStateService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.authStateService.loadCurrentUser();
  }
}