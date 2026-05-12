import { CurrentUser } from './current-user';

export type AuthStatus =
  | 'loading'
  | 'anonymous'
  | 'authenticated_unverified'
  | 'authenticated_verified'
  | 'error';

export interface AuthState {
  status: AuthStatus;
  user: CurrentUser | null;
  error: string | null;
}

export const initialAuthState: AuthState = {
  status: 'loading',
  user: null,
  error: null,
};

export function toAuthenticatedState(user: CurrentUser): AuthState {
  return {
    status: user.isEmailVerified
      ? 'authenticated_verified'
      : 'authenticated_unverified',
    user,
    error: null,
  };
}

export function toAnonymousState(): AuthState {
  return {
    status: 'anonymous',
    user: null,
    error: null,
  };
}

export function toAuthErrorState(error: string): AuthState {
  return {
    status: 'error',
    user: null,
    error,
  };
}