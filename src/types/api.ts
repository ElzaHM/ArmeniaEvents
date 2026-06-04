/**
 * Shared API contract types for list endpoints and error handling.
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiListParams extends PaginationParams {
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
