// 认证相关 API
import Taro from "@tarojs/taro";
import { WxLoginRequest, WxLoginResponse, User, UpdateUserRequest } from "@/types";
import { request, TokenManager } from "../request";

export const authApi = {
  // 微信小程序登录
  wxLogin: async (data: WxLoginRequest): Promise<WxLoginResponse> => {
    const response = await request.post<WxLoginResponse>("/auth/wxMiniLogin", data);

    if (response.success && response.data) {
      // 登录成功后自动存储 token
      TokenManager.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || "登录失败");
  },

  // 手机号码授权登录（需要传入 getPhoneNumber 返回的 code）
  phoneLogin: async (phoneCode: string): Promise<WxLoginResponse> => {
    try {
      // 1. 获取 appId（从环境变量读取）
      const appId = process.env.TARO_APP_ID || "";

      if (!appId) {
        throw new Error("缺少 appId 配置");
      }

      // 2. 使用手机号码 code 调用后端接口登录（loginType=1）
      const loginData: WxLoginRequest = {
        appId,
        code: phoneCode, // 使用 getPhoneNumber 返回的 code
        loginType: 1, // 1: 获取用户手机号码
      };

      const userData = await authApi.wxLogin(loginData);

      // 3. 登录成功后，静默调用 wx.login 获取 openid（loginType=3）
      try {
        const openidLoginRes = await Taro.login();
        if (openidLoginRes.code) {
          await authApi.wxLogin({
            appId,
            code: openidLoginRes.code,
            loginType: 3, // 3: 获取 openid
            id: userData.id, // ✅ 传递用户 id
          });
        }
      } catch (openidError) {
        console.error("获取 openid 失败:", openidError);
        // 不影响主流程，静默失败
      }

      return userData;
    } catch (error: any) {
      throw new Error(error.message || "登录失败");
    }
  },

  // 退出登录
  logout: (): void => {
    TokenManager.removeToken();
  },

  // 检查登录状态
  isLoggedIn: (): boolean => {
    return TokenManager.hasToken();
  },

  // 获取小程序用户信息
  getMiniAppUser: async (): Promise<User> => {
    const appId = process.env.TARO_APP_ID || "";

    if (!appId) {
      throw new Error("缺少 appId 配置");
    }

    const response = await request.get<User>(
      "/client/wxStudentBind/getMiniAppUser",
      { appId }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || "获取用户信息失败");
  },

  // 更新小程序用户信息
  updateMiniAppUser: async (data: UpdateUserRequest): Promise<string> => {
    const response = await request.post<string>(
      "/client/wxStudentBind/updateMiniAppUser",
      data
    );

    if (response.success) {
      return response.data;
    }

    throw new Error(response.message || "更新用户信息失败");
  },
};
