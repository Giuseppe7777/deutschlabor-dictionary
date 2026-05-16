import { CurrentUser } from './current-user';

export interface RegisterStartRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export type PublicKeyCredentialDescriptorFromServer = Omit<
  PublicKeyCredentialDescriptor,
  'id'
> & {
  id: string;
};

export type PublicKeyCredentialUserEntityFromServer = Omit<
  PublicKeyCredentialUserEntity,
  'id'
> & {
  id: string;
};

export type PublicKeyCredentialCreationOptionsFromServer = Omit<
  PublicKeyCredentialCreationOptions,
  'challenge' | 'user' | 'excludeCredentials'
> & {
  challenge: string;
  user: PublicKeyCredentialUserEntityFromServer;
  excludeCredentials?: PublicKeyCredentialDescriptorFromServer[];
};

export type PublicKeyCredentialRequestOptionsFromServer = Omit<
  PublicKeyCredentialRequestOptions,
  'challenge' | 'allowCredentials'
> & {
  challenge: string;
  allowCredentials?: PublicKeyCredentialDescriptorFromServer[];
};

export interface RegisterStartResponse {
  publicKey: PublicKeyCredentialCreationOptionsFromServer;
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
  publicKey: PublicKeyCredentialRequestOptionsFromServer;
  expiresAt: string;
}

export interface LoginFinishRequest {
  email: string;
  credential: unknown;
}

export interface LoginFinishResponse {
  status: 'ok';
  message: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}
export interface LogoutResponse {
  status: 'logged out';
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