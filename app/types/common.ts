export type BaseResponse<T> = {
    message: string;
    success: boolean;
    data: T;
    timestamp: string;
    code: string
}