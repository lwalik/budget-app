export interface AuthUserModel {
  readonly email: string | null;
  readonly emailVerified: boolean;
  readonly uid: string;
}
