import { PublicKeyCredentialRequestOptionsFromServer } from '../models/auth-api.models';

export interface SerializedAuthenticationCredential {
  id: string;
  rawId: string;
  type: string;
  authenticatorAttachment?: string | null;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string | null;
  };
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
}

export function normalizeAuthenticationPublicKeyOptions(
  input: PublicKeyCredentialRequestOptionsFromServer,
): PublicKeyCredentialRequestOptions {
  const publicKey = structuredClone(input);

  return {
    ...publicKey,
    challenge: base64UrlToArrayBuffer(publicKey.challenge),
    allowCredentials: publicKey.allowCredentials?.map((credential) => ({
      ...credential,
      id: base64UrlToArrayBuffer(credential.id),
    })),
  };
}

export function serializeAuthenticationCredential(
  credential: Credential | null,
): SerializedAuthenticationCredential {
  if (!isPublicKeyCredential(credential)) {
    throw new Error('authentication_credential_missing_or_invalid');
  }

  if (hasToJson(credential)) {
    return credential.toJSON() as unknown as SerializedAuthenticationCredential;
  }

  return serializeAuthenticationCredentialManually(credential);
}

function serializeAuthenticationCredentialManually(
  credential: PublicKeyCredential,
): SerializedAuthenticationCredential {
  const response = credential.response;

  if (!isAuthenticatorAssertionResponse(response)) {
    throw new Error('authentication_assertion_response_missing_or_invalid');
  }

  return {
    id: credential.id,
    rawId: arrayBufferToBase64Url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    response: {
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
      signature: arrayBufferToBase64Url(response.signature),
      userHandle: response.userHandle
        ? arrayBufferToBase64Url(response.userHandle)
        : null,
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}

function isPublicKeyCredential(
  credential: Credential | null,
): credential is PublicKeyCredential {
  return (
    typeof PublicKeyCredential !== 'undefined' &&
    credential instanceof PublicKeyCredential
  );
}

function isAuthenticatorAssertionResponse(
  response: AuthenticatorResponse,
): response is AuthenticatorAssertionResponse {
  return (
    typeof AuthenticatorAssertionResponse !== 'undefined' &&
    response instanceof AuthenticatorAssertionResponse
  );
}

function hasToJson(
  credential: PublicKeyCredential,
): credential is PublicKeyCredential & {
  toJSON(): unknown;
} {
  return 'toJSON' in credential && typeof credential.toJSON === 'function';
}

function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);

  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index);
  }

  return buffer;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}