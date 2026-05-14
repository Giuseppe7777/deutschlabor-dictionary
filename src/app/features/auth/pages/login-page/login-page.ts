import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import type { LoginStartResponse } from '../../models/auth-api.models';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthStateService } from '../../services/auth-state.service';
import {
  normalizeAuthenticationPublicKeyOptions,
  SerializedAuthenticationCredential,
  serializeAuthenticationCredential,
} from '../../utils/webauthn-authentication';

type LoginFormControlName = 'email';

type LoginStatus =
  | 'idle'
  | 'preparing'
  | 'challengeReady'
  | 'gettingPasskey'
  | 'passkeyReady'
  | 'finishing'
  | 'authenticated';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly authState = inject(AuthStateService);

  readonly isSubmitting = signal(false);
  readonly loginStatus = signal<LoginStatus>('idle');
  readonly loginStartResponse = signal<LoginStartResponse | null>(null);
  readonly loginAssertionCredential =
    signal<SerializedAuthenticationCredential | null>(null);
  readonly submitError = signal<string | null>(null);

  readonly isAuthenticated = computed(
    () => this.loginStatus() === 'authenticated',
  );

  readonly isFormLocked = computed(
    () => this.isSubmitting() || this.isAuthenticated(),
  );

  readonly statusMessageKey = computed(() => {
    switch (this.loginStatus()) {
      case 'preparing':
        return 'pages.login.form.messages.preparing';
      case 'challengeReady':
        return 'pages.login.form.messages.challengeReady';
      case 'gettingPasskey':
        return 'pages.login.form.messages.gettingPasskey';
      case 'passkeyReady':
        return 'pages.login.form.messages.passkeyReady';
      case 'finishing':
        return 'pages.login.form.messages.finishing';
      case 'authenticated':
        return 'pages.login.form.messages.authenticated';
      default:
        return null;
    }
  });

  readonly loginForm = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(180)],
    ],
  });

  isInvalid(controlName: LoginFormControlName): boolean {
    const control = this.loginForm.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  async onSubmit(): Promise<void> {
    this.loginForm.markAllAsTouched();
    this.submitError.set(null);
    this.loginStatus.set('idle');
    this.loginStartResponse.set(null);
    this.loginAssertionCredential.set(null);

    if (this.loginForm.invalid || this.isFormLocked()) {
      return;
    }

    if (!this.isWebAuthnAvailable()) {
      this.submitError.set('pages.login.form.errors.passkeyUnsupported');
      return;
    }

    const { email } = this.loginForm.getRawValue();

    const payload = {
      email: email.trim().toLowerCase(),
    };

    if (payload.email === '') {
      this.submitError.set('pages.login.form.errors.invalidInput');
      return;
    }

    this.isSubmitting.set(true);
    this.loginStatus.set('preparing');

    try {
      const loginStartResponse = await firstValueFrom(
        this.authApi.loginStart(payload),
      );

      this.loginStartResponse.set(loginStartResponse);
      this.loginStatus.set('challengeReady');

      const publicKey = normalizeAuthenticationPublicKeyOptions(
        loginStartResponse.publicKey,
      );

      this.loginStatus.set('gettingPasskey');

      const credential = await navigator.credentials.get({ publicKey });
      const serializedCredential = serializeAuthenticationCredential(credential);

      this.loginAssertionCredential.set(serializedCredential);
      this.loginStatus.set('passkeyReady');

      this.loginStatus.set('finishing');

      await firstValueFrom(
        this.authApi.loginFinish({
          email: payload.email,
          credential: serializedCredential,
        }),
      );

      this.authState.loadCurrentUser();
      this.loginStatus.set('authenticated');
    } catch (error) {
      this.loginStatus.set('idle');
      this.submitError.set(this.resolveLoginError(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private isWebAuthnAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.credentials?.get === 'function' &&
      typeof PublicKeyCredential !== 'undefined'
    );
  }

  private resolveLoginError(error: unknown): string {
    if (error instanceof DOMException) {
      return 'pages.login.form.errors.passkeyCancelledOrFailed';
    }

    if (!(error instanceof HttpErrorResponse)) {
      return 'pages.login.form.errors.unknown';
    }

    if (error.status === 429) {
      return 'pages.login.form.errors.tooManyRequests';
    }

    const backendError =
      typeof error.error?.error === 'string' ? error.error.error : '';

    switch (backendError) {
      case 'email is required':
      case 'invalid email':
        return 'pages.login.form.errors.invalidInput';

      case 'user_not_found':
        return 'pages.login.form.errors.userNotFound';

      case 'no_passkey_registered':
        return 'pages.login.form.errors.noPasskeyRegistered';

      case 'forbidden_origin':
        return 'pages.login.form.errors.forbiddenOrigin';

      case 'missing_required_fields':
        return 'pages.login.form.errors.missingRequiredFields';

      case 'login_session_not_found':
        return 'pages.login.form.errors.loginSessionNotFound';

      case 'login_session_expired':
        return 'pages.login.form.errors.loginSessionExpired';

      case 'invalid_public_key_credential':
      case 'invalid_assertion_response_type':
      case 'assertion_validation_failed':
        return 'pages.login.form.errors.assertionValidationFailed';

      default:
        return 'pages.login.form.errors.finishFailed';
    }
  }
}