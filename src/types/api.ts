// API 相关类型定义

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface ApiError {
  message: string;
  code: number;
  details?: any;
}

export interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
