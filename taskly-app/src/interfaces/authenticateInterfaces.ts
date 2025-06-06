import { JwtPayload } from "jwt-decode"

export enum StatusEnums { Loading, None }

export interface IAuthenticateInitialState {
    user: IUser | null;
    userProfile: IUserProfile | null;
    solanaUserProfile: ISolanaUserProfile | null;
    editAvatar: IEditAvatar | null;
    verificationEmail: string | null;
    verificatedEmail: string | null;
    isLogin: boolean;
    avatars: IAvatar[] | null;
    keyToChangePassword: string | null;
    emailOfUserWhoWantToChangePassword: string | null;
    authMethod: "jwt" | "solana" | null;
    token: string | null;
    isAuthenticated: boolean;
    solanaUserReferralCode: string | null;
    referralCode: string | null;
}
export interface IUserProfile {
    id: string
    email: string,
    avatarName: string,
    token: string,
    role: string
}

export interface ISolanaUserProfile {
    id: string
    publicKey: string,
    avatarName: string
    userName: string,
    token: string
}

export interface ISetUserNameForSolanaUser {
    publicKey: string,
    userName: string,
}

export interface IEditAvatar {
    userId?: string,
    avatarId: string
}

export interface IUser {
    id: string
    email: string,
    boardId: string
}
export interface IVerificateEmailRequest {
    email: string,
    code: string
}
export interface IAvatar {
    id: string,
    name: string
}
export interface IRegisterRequest {
    email: string,
    password: string,
    confirmPassword: string,
    avatarId: string
}
export interface IJwtInformation {
    id: string,
    email: string,
    startTime: string,
    endTime: string
}
export interface ICustomJwtPayload extends JwtPayload {
    id: string,
    email: string
}
export interface ILoginRequest {
    email: string,
    password: string,
    rememberMe: boolean
}
export interface ICheckHasUserSentRequestToChangePassword {
    key: string
}
export interface IChangePasswordRequest {
    email: string,
    password: string,
    confirmPassword: string
}
export interface ISolanaAuthRequest {
    publicKey: string,
    referralCode: string | null
}