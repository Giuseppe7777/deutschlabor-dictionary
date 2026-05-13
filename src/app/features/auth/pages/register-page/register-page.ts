import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { RegisterFinishResponse } from '../../models/auth-api.models';
import { AuthApiService } from '../../services/auth-api.service';
import {
  normalizeRegistrationPublicKeyOptions,
  serializeRegistrationCredential,
} from '../../utils/webauthn-registration';

type RegisterFormControlName = 'firstName' | 'lastName' | 'email';

type RegistrationStatus =
  | 'idle'
  | 'preparing'
  | 'creatingPasskey'
  | 'finishing'
  | 'registered';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly authApi = inject(AuthApiService);

  readonly isSubmitting = signal(false);
  readonly isPasskeyExplanationOpen = signal(false);
  readonly registrationStatus = signal<RegistrationStatus>('idle');
  readonly registerFinishResponse = signal<RegisterFinishResponse | null>(null);
  readonly submitError = signal<string | null>(null);

  readonly pendingRegistrationEmail = computed(() =>
    this.registerForm.controls.email.value.trim(),
  );

  readonly registerForm = this.formBuilder.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    ],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(180)],
    ],
  });

  isInvalid(controlName: RegisterFormControlName): boolean {
    const control = this.registerForm.controls[controlName];

    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    this.submitError.set(null);
    this.registerFinishResponse.set(null);
    this.registrationStatus.set('idle');

    if (this.registerForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isPasskeyExplanationOpen.set(true);
  }

  closePasskeyExplanation(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isPasskeyExplanationOpen.set(false);
  }

  async continueRegistrationWithPasskey(): Promise<void> {
    this.submitError.set(null);
    this.registerFinishResponse.set(null);
    this.registrationStatus.set('idle');

    if (this.registerForm.invalid || this.isSubmitting()) {
      return;
    }

    if (!this.isWebAuthnAvailable()) {
      this.submitError.set('pages.register.form.errors.passkeyUnsupported');
      this.isPasskeyExplanationOpen.set(false);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const payload = this.registerForm.getRawValue();

      this.registrationStatus.set('preparing');

      const registerStartResponse = await firstValueFrom(
        this.authApi.registerStart(payload),
      );

      this.registrationStatus.set('creatingPasskey');

      const publicKey = normalizeRegistrationPublicKeyOptions(
        registerStartResponse.publicKey,
      );

      const credential = await navigator.credentials.create({ publicKey });
      const serializedCredential = serializeRegistrationCredential(credential);

      this.registrationStatus.set('finishing');

      const registerFinishResponse = await firstValueFrom(
        this.authApi.registerFinish({
          email: payload.email,
          credential: serializedCredential,
        }),
      );

      this.registerFinishResponse.set(registerFinishResponse);
      this.registrationStatus.set('registered');
      this.isPasskeyExplanationOpen.set(false);
    } catch (error) {
      this.registrationStatus.set('idle');
      this.submitError.set(this.toRegisterErrorKey(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private isWebAuthnAvailable(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      typeof navigator.credentials !== 'undefined' &&
      typeof PublicKeyCredential !== 'undefined'
    );
  }

  private toRegisterErrorKey(error: unknown): string {
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        return 'pages.register.form.errors.passkeyCancelled';
      }

      if (error.name === 'InvalidStateError') {
        return 'pages.register.form.errors.passkeyInvalidState';
      }

      return 'pages.register.form.errors.passkeyCreationFailed';
    }

    if (!(error instanceof HttpErrorResponse)) {
      return 'pages.register.form.errors.unknown';
    }

    if (error.status === 400) {
      return 'pages.register.form.errors.invalidInput';
    }

    if (error.status === 403) {
      return 'pages.register.form.errors.forbiddenOrigin';
    }

    if (error.status === 404) {
      return 'pages.register.form.errors.registrationSessionNotFound';
    }

    if (error.status === 409) {
      return 'pages.register.form.errors.emailAlreadyRegistered';
    }

    if (error.status === 410) {
      return 'pages.register.form.errors.registrationSessionExpired';
    }

    return 'pages.register.form.errors.finishFailed';
  }
}