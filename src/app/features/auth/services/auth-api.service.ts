import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { CurrentUser } from '../models/current-user';
import {
  LoginFinishRequest,
  LoginFinishResponse,
  LoginStartRequest,
  LoginStartResponse,
  LogoutResponse,
  RegisterFinishRequest,
  RegisterFinishResponse,
  RegisterStartRequest,
  RegisterStartResponse,
  ResendVerificationEmailResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '../models/auth-api.models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  registerStart(payload: RegisterStartRequest) {
    return this.http.post<RegisterStartResponse>('/auth/register/start', payload);
  }

  registerFinish(payload: RegisterFinishRequest) {
    return this.http.post<RegisterFinishResponse>('/auth/register/finish', payload);
  }

  loginStart(payload: LoginStartRequest) {
    return this.http.post<LoginStartResponse>('/auth/login/start', payload);
  }

  loginFinish(payload: LoginFinishRequest) {
    return this.http.post<LoginFinishResponse>('/auth/login/finish', payload);
  }

  me() {
    return this.http.get<CurrentUser>('/api/me');
  }

  logout() {
    return this.http.post<LogoutResponse>('/auth/logout', {});
  }

  resendVerificationEmail() {
    return this.http.post<ResendVerificationEmailResponse>(
      '/auth/email-verification/send',
      {},
    );
  }

  verifyEmail(payload: VerifyEmailRequest) {
    return this.http.post<VerifyEmailResponse>(
      '/auth/email-verification/verify',
      payload,
    );
  }
}