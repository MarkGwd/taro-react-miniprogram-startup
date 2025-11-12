// API 配置
import { ApiConfig } from "@/types";

// 从环境变量获取配置（Taro 会在编译时替换这些值）
const BASE_URL = process.env.TARO_APP_API_BASE_URL || "http://8.155.61.172:8080";

export const API_CONFIG: ApiConfig = {
  baseUrl: BASE_URL,
  timeout: 30000, // 默认超时时间 30 秒
  useMock: false, // 现在使用真实接口
  modules: {
    auth: { useMock: false },
    student: { useMock: false },
    report: { useMock: false },
  },
};

// 获取 API 配置
export const getApiConfig = () => {
  return API_CONFIG;
};
