import { createAsyncThunk } from '@reduxjs/toolkit'
import { IValidationErrors } from '../../interfaces/generalInterface'
import { api } from '../../axios/api'
import { AxiosError } from "axios";
import { IAvatar, IChangePasswordRequest, ICheckHasUserSentRequestToChangePassword, ILoginRequest, IRegisterRequest, IVerificateEmailRequest } from '../../interfaces/authenticateInterfaces';

export const sendVerificationCodeAsync = createAsyncThunk<
    string, // Тип який повертається
    string, // Тип який передається 
    { rejectValue: IValidationErrors }> // Тип помилки
    (
        "authentication/send-verification-code",
        async (email: string, { rejectWithValue }) => {
            try {
                const response = await api.post("/api/Authentication/send-verification-code", {
                    email: email
                })
                return response.data;
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;
                return rejectWithValue(error.response.data);
            }
        }
    );

export const verificateEmailAsync = createAsyncThunk<
    string,
    IVerificateEmailRequest,
    { rejectValue: IValidationErrors }>
    (
        "authentication/verificate-email",
        async (request: IVerificateEmailRequest, { rejectWithValue }) => {
            try {
                const response = await api.post("/api/Authentication/verificate-email", {
                    email: request.email,
                    code: request.code
                })
                return response.data;
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;

                return rejectWithValue(error.response.data);
            }
        }
    );
export const getAllAvatarsAsync = createAsyncThunk<
    IAvatar[],
    void,
    { rejectValue: IValidationErrors }>
    (
        "authentication/get-all-avatars",
        async (_, { rejectWithValue }) => {
            try {
                const response = await api.get("/api/Authentication/get-all-avatars");
                return response.data;
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;

                return rejectWithValue(error.response.data);
            }
        }
    );
export const registerAsync = createAsyncThunk<
    void,
    IRegisterRequest,
    { rejectValue: IValidationErrors }
>(
    "authenticate/register",
    async (request: IRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/Authentication/register", {
                email: request.email,
                password: request.password,
                confirmPassword: request.confirmPassword,
                avatarId: request.avatarId
            });
            return response.data;
        } catch (err: any) {
            let error: AxiosError<IValidationErrors> = err;
            if (!error.response)
                throw err;

            return rejectWithValue(error.response.data);
        }
    }
);

export const loginAsync = createAsyncThunk<
    void,
    ILoginRequest,
    { rejectValue: IValidationErrors }
>(
    "authenticate/login",
    async (request: ILoginRequest, { rejectWithValue }) => {
        try {
            var response = await api.post("/api/Authentication/login", {
                email: request.email,
                password: request.password,
                rememberMe: request.rememberMe,
            },
                {
                    withCredentials: true
                });
            console.log('cookies -> ', document.cookie);
            return response.data;

        } catch (err: any) {
            let error: AxiosError<IValidationErrors> = err;
            if (!error.response)
                throw err;

            return rejectWithValue(error.response.data);
        }
    }
);

export const checkTokenAsync = createAsyncThunk<
    void,
    void,
    { rejectValue: IValidationErrors }>(
        "authentication/check-token",
        async (_, { rejectWithValue }) => {
            try {
                await api.get("api/authentication/check-token", {
                    withCredentials: true // Дозволяє надсилати кукі разом з запитом
                });
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;
                return rejectWithValue(error.response.data);
            }
        }
    );

export const sendRequestToChangePasswordAsync = createAsyncThunk<
    string,
    string,
    { rejectValue: IValidationErrors }
>(
    "authentication/send-request-to-change-password",
    async (email: string, { rejectWithValue }) => {
        try {
            var request = await api.post("api/authentication/send-request-to-change-password", {
                email: email
            }, {
                withCredentials: true
            });
            return request.data;
        } catch (err: any) {
            const error: AxiosError<IValidationErrors> = err;
            if (!error.response)
                throw err;
            return rejectWithValue(error.response.data);
        }
    }
)

export const checkHasUserSentRequestToChangePasswordAsync = createAsyncThunk<
    string | null,
    ICheckHasUserSentRequestToChangePassword,
    { rejectValue: IValidationErrors }>(
        "authentication/check-has-user-sent-request-to-change-password",
        async (request: ICheckHasUserSentRequestToChangePassword, { rejectWithValue }) => {
            try {
                const response = await api.get(`api/authentication/check-has-user-sent-request-to-change-password?Key=${request.key}`);
                console.log("response - ", response.data)
                return response.data;
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;

                return rejectWithValue(error.response.data);
            }
        }
    )

export const changePasswordAsync = createAsyncThunk<
    string,
    IChangePasswordRequest,
    { rejectValue: IValidationErrors }>(
        "authentication/change-password",
        async (request: IChangePasswordRequest, { rejectWithValue }) => {
            try {
                var response = await api.put("api/authentication/change-password", {
                    email: request.email,
                    password: request.password,
                    confirmPassword: request.confirmPassword
                });

                return response.data;
            } catch (err: any) {
                let error: AxiosError<IValidationErrors> = err;
                if (!error.response)
                    throw err;
                return rejectWithValue(error.response.data);
            }
        }
    )