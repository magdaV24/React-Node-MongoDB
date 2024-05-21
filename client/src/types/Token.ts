export type Token = {
  exp: number;
  iat: number;
  id: string;
  rememberMe: boolean;
  email: string
} | null;
