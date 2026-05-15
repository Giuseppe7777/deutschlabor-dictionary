import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthApiService } from '../../services/auth-api.service';
import { AuthStateService } from '../../services/auth-state.service';

type VerifyEmailStatus =
  | 'checking'
  | 'success'
  | 'already_verified'
  | 'missing_token'
  | 'invalid'
  | 'expired'
  | 'error';

type VerifyEmailResponse = {
  message?: string;
};

type VerifyEmailErrorBody = {
  message?: string;
};

@Component({
  selector: 'app-verify-email-page',
  imports: [TranslatePipe],
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.css',
})
export class VerifyEmailPage implements OnInit {
  private readonly authApi = inject(AuthApiService);
  private readonly authState = inject(AuthStateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);

  private readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly status = signal<VerifyEmailStatus>('checking');

  readonly hasToken = computed(
    () => typeof this.token === 'string' && this.token.length > 0,
  );

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.hasToken()) {
      this.status.set('missing_token');
      return;
    }

    this.verifyEmailToken(this.token as string);
  }

  private verifyEmailToken(token: string): void {
    this.status.set('checking');

    this.authApi.verifyEmail({ token }).subscribe({
      next: (response: VerifyEmailResponse) => {
        this.status.set(this.resolveSuccessStatus(response));
        this.authState.loadCurrentUser();
      },
      error: (error: unknown) => {
        this.status.set(this.resolveVerifyError(error));
      },
    });
  }

  private resolveSuccessStatus(response: VerifyEmailResponse): VerifyEmailStatus {
    if (response.message === 'email_already_verified') {
      return 'already_verified';
    }

    return 'success';
  }

  private resolveVerifyError(error: unknown): VerifyEmailStatus {
    if (!(error instanceof HttpErrorResponse)) {
      return 'error';
    }

    const errorBody = error.error as VerifyEmailErrorBody | null | undefined;
    const backendMessage =
      typeof errorBody?.message === 'string' ? errorBody.message : '';

    if (
      backendMessage === 'verification_token_required' ||
      backendMessage === 'verification_token_too_long' ||
      backendMessage === 'verification_token_invalid'
    ) {
      return 'invalid';
    }

    if (backendMessage === 'verification_token_expired') {
      return 'expired';
    }

    if (backendMessage === 'verification_token_invalid_or_expired') {
      return 'invalid';
    }

    return 'error';
  }
}