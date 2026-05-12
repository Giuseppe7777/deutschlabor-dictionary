export interface CurrentUser {
  id: number;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
}