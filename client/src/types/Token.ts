import {JwtPayload} from 'jwt-decode'

export type Token = {
  token: JwtPayload;
  expiration: number;
} | null;
