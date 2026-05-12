import { computed, inject, Injectable, signal } from '@angular/core';

import {
  AuthState,
  initialAuthState,
  toAnonymousState,
  toAuthenticatedState,
  toAuthErrorState,
} from '../models/auth-state.models';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly authApi = inject(AuthApiService);

  private readonly stateSignal = signal<AuthState>(initialAuthState);

  readonly state = this.stateSignal.asReadonly();

  readonly user = computed(() => this.state().user);

  readonly isLoading = computed(() => this.state().status === 'loading');

  readonly isAnonymous = computed(() => this.state().status === 'anonymous');

  readonly isAuthenticated = computed(
    () =>
      this.state().status === 'authenticated_unverified' ||
      this.state().status === 'authenticated_verified',
  );

  readonly isEmailVerified = computed(
    () => this.state().status === 'authenticated_verified',
  );

  readonly error = computed(() => this.state().error);

  loadCurrentUser(): void {
    this.stateSignal.set(initialAuthState);

    this.authApi.me().subscribe({
      next: (user) => {
        this.stateSignal.set(toAuthenticatedState(user));
      },
      error: (error) => {
        if (error?.status === 401) {
          this.stateSignal.set(toAnonymousState());
          return;
        }

        this.stateSignal.set(toAuthErrorState('auth_state_load_failed'));
      },
    });
  }

  clearAuthenticatedUser(): void {
    this.stateSignal.set(toAnonymousState());
  }
}