import { IUser } from './user.interface';

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}

export interface ITokenPayload {
    userId: string;
    email: string;
    roles: string[];
} 