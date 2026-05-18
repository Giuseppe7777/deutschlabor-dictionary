import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthStateService } from '../../../auth/services/auth-state.service';

interface AccountSection {
  readonly key: string;
  readonly statusKey: string;
  readonly itemKeys: readonly string[];
}

@Component({
  selector: 'app-account-page',
  imports: [TranslatePipe],
  templateUrl: './account-page.html',
  styleUrl: './account-page.css',
})
export class AccountPage {
  private readonly authState = inject(AuthStateService);

  protected readonly userEmail = computed(
    () => this.authState.user()?.email ?? '—',
  );

  protected readonly emailStatusKey = computed(() => {
    if (this.authState.isLoading()) {
      return 'pages.account.overview.emailStatus.loading';
    }

    if (this.authState.isEmailVerified()) {
      return 'pages.account.overview.emailStatus.verified';
    }

    if (this.authState.isEmailUnverified()) {
      return 'pages.account.overview.emailStatus.unverified';
    }

    return 'pages.account.overview.emailStatus.notAvailable';
  });

  protected readonly accountStatusKey = computed(() => {
    if (this.authState.isLoading()) {
      return 'pages.account.overview.accountStatus.loading';
    }

    if (this.authState.isEmailVerified()) {
      return 'pages.account.overview.accountStatus.active';
    }

    if (this.authState.isEmailUnverified()) {
      return 'pages.account.overview.accountStatus.emailVerificationRequired';
    }

    if (this.authState.isAnonymous()) {
      return 'pages.account.overview.accountStatus.anonymous';
    }

    return 'pages.account.overview.accountStatus.error';
  });

  protected readonly accountSections: readonly AccountSection[] = [
    {
      key: 'overview',
      statusKey: 'pages.account.sections.overview.status',
      itemKeys: [
        'pages.account.sections.overview.items.profile',
        'pages.account.sections.overview.items.email',
        'pages.account.sections.overview.items.access',
      ],
    },
    {
      key: 'preferences',
      statusKey: 'pages.account.sections.preferences.status',
      itemKeys: [
        'pages.account.sections.preferences.items.interfaceLanguage',
        'pages.account.sections.preferences.items.defaultDictionaryPair',
        'pages.account.sections.preferences.items.trainingExplanationLanguage',
      ],
    },
    {
      key: 'billing',
      statusKey: 'pages.account.sections.billing.status',
      itemKeys: [
        'pages.account.sections.billing.items.currentPlan',
        'pages.account.sections.billing.items.premiumFeatures',
        'pages.account.sections.billing.items.billingManagement',
      ],
    },
    {
      key: 'security',
      statusKey: 'pages.account.sections.security.status',
      itemKeys: [
        'pages.account.sections.security.items.passkeys',
        'pages.account.sections.security.items.recovery',
        'pages.account.sections.security.items.emailVerification',
      ],
    },
    {
      key: 'sessions',
      statusKey: 'pages.account.sections.sessions.status',
      itemKeys: [
        'pages.account.sections.sessions.items.currentSession',
        'pages.account.sections.sessions.items.otherDevices',
        'pages.account.sections.sessions.items.logoutDevices',
      ],
    },
  ];
}