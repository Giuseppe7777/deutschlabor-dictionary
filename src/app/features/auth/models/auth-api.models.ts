import { CurrentUser } from './current-user';

export interface RegisterStartRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterStartResponse {
  publicKey: PublicKeyCredentialCreationOptions;
  expiresAt: string;
}

export interface RegisterFinishRequest {
  email: string;
  credential: unknown;
}

export interface EmailVerificationStatus {
  required: boolean;
  emailSent: boolean;
  emailVerified: boolean;
}

export interface RegisterFinishResponse extends CurrentUser {
  emailVerification: EmailVerificationStatus;
}

export interface LoginStartRequest {
  email: string;
}

export interface LoginStartResponse {
  publicKey: PublicKeyCredentialRequestOptions;
  expiresAt: string;
}

export interface LoginFinishRequest {
  email: string;
  credential: unknown;
}

export type LoginFinishResponse = CurrentUser;

export interface LogoutResponse {
  status: 'ok';
  message: string;
}

export interface ResendVerificationEmailResponse {
  status: 'ok';
  message: string;
  emailVerification: EmailVerificationStatus;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  status: 'ok' | 'error';
  message: string;
  messageKey?: string;
  emailVerification?: EmailVerificationStatus;
}