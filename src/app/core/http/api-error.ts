import { HttpErrorResponse } from '@angular/common/http';

export interface BackendEmailVerificationError {
  required?: boolean;
  emailVerified?: boolean;
}

export interface BackendRateLimitError {
  action?: string;
  limit?: number;
  remaining?: number;
  retryAfterSeconds?: number;
}

export interface BackendAccessError {
  requiredRole?: string;
}

export interface BackendErrorBody {
  status?: string;
  error?: string;
  message?: string;
  messageKey?: string;
  emailVerification?: BackendEmailVerificationError;
  rateLimit?: BackendRateLimitError;
  access?: BackendAccessError;
}

export type ProtectedApiFailure =
  | 'anonymous'
  | 'email_verification_required'
  | 'rate_limited'
  | 'not_implemented'
  | 'csrf_error'
  | 'error';

export function getBackendErrorBody(error: unknown): BackendErrorBody | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  if (error.error === null || typeof error.error !== 'object') {
    return null;
  }

  return error.error as BackendErrorBody;
}

export function resolveProtectedApiFailure(error: unknown): ProtectedApiFailure {
  if (!(error instanceof HttpErrorResponse)) {
    return 'error';
  }

  const errorBody = getBackendErrorBody(error);

  if (error.status === 401) {
    return 'anonymous';
  }

  if (error.status === 403 && isEmailVerificationRequired(errorBody)) {
    return 'email_verification_required';
  }

  if (error.status === 403 && isCsrfError(errorBody)) {
    return 'csrf_error';
  }

  if (error.status === 429) {
    return 'rate_limited';
  }

  if (error.status === 501) {
    return 'not_implemented';
  }

  return 'error';
}

export function getRetryAfterSeconds(error: unknown): number | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const errorBody = getBackendErrorBody(error);
  const retryAfterFromBody = errorBody?.rateLimit?.retryAfterSeconds;

  if (typeof retryAfterFromBody === 'number') {
    return retryAfterFromBody;
  }

  const retryAfterHeader = error.headers.get('Retry-After');

  if (retryAfterHeader === null) {
    return null;
  }

  const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);

  return Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null;
}

function isEmailVerificationRequired(errorBody: BackendErrorBody | null): boolean {
  return (
    errorBody?.message === 'email_verification_required' ||
    errorBody?.messageKey === 'auth.emailVerificationRequired' ||
    errorBody?.emailVerification?.required === true
  );
}

function isCsrfError(errorBody: BackendErrorBody | null): boolean {
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