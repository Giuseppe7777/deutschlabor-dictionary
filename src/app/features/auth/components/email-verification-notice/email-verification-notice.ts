import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthApiService } from '../../services/auth-api.service';
import { AuthStateService } from '../../services/auth-state.service';

type ResendVerificationEmailStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'rate_limited'
  | 'csrf_error'
  | 'error';

@Component({
  selector: 'app-email-verification-notice',
  imports: [TranslatePipe],
  templateUrl: './email-verification-notice.html',
  styleUrl: './email-verification-notice.css',
})
export class EmailVerificationNotice {
  private readonly authApi = inject(AuthApiService);
  private readonly authState = inject(AuthStateService);

  readonly isVisible = this.authState.isEmailUnverified;

  readonly resendStatus = signal<ResendVerificationEmailStatus>('idle');

  readonly isSending = computed(() => this.resendStatus() === 'loading');

  readonly canSend = computed(() => this.isVisible() && !this.isSending());

  resendVerificationEmail(): void {
    if (!this.canSend()) {
      return;
    }

    this.resendStatus.set('loading');

    this.authApi.resendVerificationEmail().subscribe({
      next: () => {
        this.resendStatus.set('success');
      },
      error: (error: unknown) => {
        this.resendStatus.set(this.mapResendError(error));
      },
    });
  }

  private mapResendError(error: unknown): ResendVerificationEmailStatus {
    if (!(error instanceof HttpErrorResponse)) {
      return 'error';
    }

    if (error.status === 429) {
      return 'rate_limited';
    }

    if (this.isCsrfError(error)) {
      return 'csrf_error';
    }

    return 'error';
  }

  private isCsrfError(error: HttpErrorResponse): boolean {
    if (error.status !== 403) {
      return false;
    }

    const errorBody = error.error as
      | {
          error?: string;
          message?: string;
          messageKey?: string;
        }
      | null
      | undefined;

    const errorText = [
      errorBody?.error,
      errorBody?.message,
      errorBody?.messageKey,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return errorText.includes('csrf');
  }
}