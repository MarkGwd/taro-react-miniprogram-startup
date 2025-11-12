// 封装 Taro.request
import Taro from "@tarojs/taro";
import { RequestConfig, ApiResponse, ApiError } from "@/types";
import { getApiConfig } from "./config";

// Token 存储 key
const TOKEN_KEY = "jwt_token";

// Token 管理工具
export const TokenManager = {
  getToken(): string | null {
    return Taro.getStorageSync(TOKEN_KEY) || null;
  },

  setToken(token: string): void {
    Taro.setStorageSync(TOKEN_KEY, token);
  },

  removeToken(): void {
    Taro.removeStorageSync(TOKEN_KEY);
  },

  hasToken(): boolean {
    return !!this.getToken();
  },
};

class Request {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const { url, method = "GET", data, header = {}, timeout } = config;

      // 自动添加 Token 到请求头
      const token = TokenManager.getToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...header,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await Taro.request({
        url: `${this.baseUrl}${url}`,
        method,
        data,
        header: headers,
        timeout: timeout || this.timeout, // 使用自定义超时或默认超时
      });

      if (response.statusCode >= 200 && response.statusCode < 300) {
        // 适配后端响应格式: { code: 0, msg: string, data: T }
        const backendData = response.data as any;

        // 如果后端返回 code !== 0，视为业务错误
        if (
          backendData.code !== undefined &&
          backendData.code !== 0 &&
          backendData.code !== 200
        ) {
          // 特殊处理：登录过期或未授权（业务层返回 401/403）
          if (backendData.code === 401 || backendData.code === 403) {
            TokenManager.removeToken();
            Taro.showToast({
              title: backendData.msg || "登录已过期，请重新登录",
              icon: "none",
              duration: 2000,
            });

            // 跳转到"我的"页面（含登录入口）
            setTimeout(() => {
              Taro.switchTab({ url: "/pages/profile/index" });
            }, 2000);

            throw new Error(backendData.msg || "登录已过期");
          }

          throw new Error(backendData.msg || "请求失败");
        }

        return {
          success: true,
          data: backendData.data !== undefined ? backendData.data : backendData,
          code: backendData.code || response.statusCode,
          message: backendData.msg,
        };
      } else if (response.statusCode === 401) {
        // Token 过期或未授权，清除本地 token 并跳转登录
        TokenManager.removeToken();
        Taro.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2000,
        });

        // 跳转到"我的"页面（含登录入口）
        setTimeout(() => {
          Taro.switchTab({ url: "/pages/profile/index" });
        }, 2000);

        throw new Error("未授权，请先登录");
      } else {
        throw new Error(
          `HTTP ${response.statusCode}: ${
            response.data?.msg || response.data?.message || "Request failed"
          }`
        );
      }
    } catch (error: any) {
      const apiError: ApiError = {
        message: error.message || "Network error",
        code: error.statusCode || 0,
        details: error,
      };

      // 统一错误处理（401 已在上面处理，不再重复提示）
      if (error.statusCode !== 401) {
        Taro.showToast({
          title: apiError.message,
          icon: "none",
          duration: 2000,
        });
      }

      return {
        success: false,
        data: null as any,
        message: apiError.message,
        code: apiError.code,
      };
    }
  }

  get<T = any>(
    url: string,
    data?: any,
    header?: Record<string, string>,
    timeout?: number
  ) {
    return this.request<T>({ url, method: "GET", data, header, timeout });
  }

  post<T = any>(
    url: string,
    data?: any,
    header?: Record<string, string>,
    timeout?: number
  ) {
    return this.request<T>({ url, method: "POST", data, header, timeout });
  }

  put<T = any>(
    url: string,
    data?: any,
    header?: Record<string, string>,
    timeout?: number
  ) {
    return this.request<T>({ url, method: "PUT", data, header, timeout });
  }

  delete<T = any>(
    url: string,
    data?: any,
    header?: Record<string, string>,
    timeout?: number
  ) {
    return this.request<T>({ url, method: "DELETE", data, header, timeout });
  }
}

// 创建请求实例
export const createRequest = (baseUrl: string, timeout?: number) => {
  return new Request(baseUrl, timeout);
};

// 默认请求实例（使用配置的 baseUrl）
const apiConfig = getApiConfig();
export const request = createRequest(apiConfig.baseUrl, apiConfig.timeout);
