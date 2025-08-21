import {Request as RequestType} from "express";

export type SuccessResponse<T = unknown> = {
    status: 'success';
    data?: T;
};

export type ErrorResponse<Q = unknown> = {
    status: 'error';
    message: string;
    type?: Q
};

export type ApiResponse<T = unknown, Q = unknown> = SuccessResponse<T> | ErrorResponse<Q>

export type Request<T = unknown, Q = unknown> = RequestType<{}, {}, T, Q>;