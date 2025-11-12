// 错误处理工具函数
import Taro from "@tarojs/taro";

export interface ErrorInfo {
  message: string;
  code?: number;
  type?: "network" | "api" | "validation" | "unknown";
}

export class ErrorHandler {
  /**
   * 处理 API 错误
   */
  static handleApiError(error: any): ErrorInfo {
    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      const message =
        error.response.data?.message || this.getStatusMessage(status);

      return {
        message,
        code: status,
        type: "api",
      };
    } else if (error.request) {
      // 网络错误
      return {
        message: "网络连接失败，请检查网络设置",
        type: "network",
      };
    } else {
      // 其他错误
      return {
        message: error.message || "未知错误",
        type: "unknown",
      };
    }
  }

  /**
   * 处理表单验证错误
   */
  static handleValidationError(field: string, message: string): ErrorInfo {
    return {
      message: `${field}: ${message}`,
      type: "validation",
    };
  }

  /**
   * 显示错误提示
   */
  static showError(
    error: ErrorInfo,
    options?: {
      showToast?: boolean;
      showModal?: boolean;
      title?: string;
    }
  ) {
    const {
      showToast = true,
      showModal = false,
      title = "错误",
    } = options || {};

    if (showToast) {
      Taro.showToast({
        title: error.message,
        icon: "none",
        duration: 2000,
      });
    }

    if (showModal) {
      Taro.showModal({
        title,
        content: error.message,
        showCancel: false,
        confirmText: "确定",
      });
    }
  }

  /**
   * 获取 HTTP 状态码对应的错误信息
   */
  private static getStatusMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: "请求参数错误",
      401: "未授权，请重新登录",
      403: "拒绝访问",
      404: "请求的资源不存在",
      405: "请求方法不允许",
      408: "请求超时",
      409: "请求冲突",
      422: "请求参数验证失败",
      429: "请求过于频繁",
      500: "服务器内部错误",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
    };

    return statusMessages[status] || `HTTP ${status} 错误`;
  }

  /**
   * 处理网络超时
   */
  static handleTimeout(): ErrorInfo {
    return {
      message: "请求超时，请稍后重试",
      type: "network",
    };
  }

  /**
   * 处理权限错误
   */
  static handleAuthError(): ErrorInfo {
    return {
      message: "登录已过期，请重新登录",
      code: 401,
      type: "api",
    };
  }
}
