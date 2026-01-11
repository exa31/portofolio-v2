export type BaseResponse<T> = {
    message: string;
    success: boolean;
    data: T | null;
    timestamp: string;
    code: string
}