export interface ApiEnvelope<T = unknown> {
    status: string;
    message: string;
    data: T;
}

export interface ApiErrorPayload {
    status?: string;
    message?: string;
    code?: string;
    errors?: Array<{ path?: string; param?: string; msg: string }>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
