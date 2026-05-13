import { PublicKeyCredentialCreationOptionsFromServer } from '../models/auth-api.models';

export interface SerializedRegistrationCredential {
  id: string;
  rawId: string;
  type: string;
  authenticatorAttachment?: string | null;
  response: {
    clientDataJSON: string;
    attestationObject: string;
    transports?: string[];
  };
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
}

export function normalizeRegistrationPublicKeyOptions(
  input: PublicKeyCredentialCreationOptionsFromServer,
): PublicKeyCredentialCreationOptions {
  const publicKey = structuredClone(input);

  return {
    ...publicKey,
    challenge: base64UrlToArrayBuffer(publicKey.challenge),
    user: {
      ...publicKey.user,
      id: base64UrlToArrayBuffer(publicKey.user.id),
    },
    excludeCredentials: publicKey.excludeCredentials?.map((credential) => ({
      ...credential,
      id: base64UrlToArrayBuffer(credential.id),
    })),
  };
}

export function serializeRegistrationCredential(
  credential: Credential | null,
): SerializedRegistrationCredential {
  if (!isPublicKeyCredential(credential)) {
    throw new Error('registration_credential_missing_or_invalid');
  }

  if (hasToJson(credential)) {
    return credential.toJSON() as unknown as SerializedRegistrationCredential;
  }

  return serializeRegistrationCredentialManually(credential);
}

function serializeRegistrationCredentialManually(
  credential: PublicKeyCredential,
): SerializedRegistrationCredential {
  const response = credential.response;

  if (!isAuthenticatorAttestationResponse(response)) {
    throw new Error('registration_attestation_response_missing_or_invalid');
  }

  return {
    id: credential.id,
    rawId: arrayBufferToBase64Url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    response: {
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      attestationObject: arrayBufferToBase64Url(response.attestationObject),
      transports: response.getTransports(),
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

function isAuthenticatorAttestationResponse(
  response: AuthenticatorResponse,
): response is AuthenticatorAttestationResponse {
  return (
    typeof AuthenticatorAttestationResponse !== 'undefined' &&
    response instanceof AuthenticatorAttestationResponse
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