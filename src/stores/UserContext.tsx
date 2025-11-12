// 用户状态管理 Context
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { User } from "@/types";
import { authApi } from "@/services/api/auth";
import { TokenManager } from "@/services/request";
import Taro from "@tarojs/taro";

// 定义状态类型
interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

// 定义 Action 类型
type UserAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" };

// Reducer 函数
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// 初始状态
const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

// 创建 Context
const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

// Provider 组件
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
};

// 业务逻辑 Hook
export const useUserStore = () => {
  const { state, dispatch } = useUserContext();

  // 微信手机号码登录（需要传入 getPhoneNumber 返回的 code）
  const wxLogin = async (phoneCode: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const userData = await authApi.phoneLogin(phoneCode);

      const user: User = {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
        token: userData.token,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: user });

      Taro.showToast({
        title: "登录成功",
        icon: "success",
        duration: 1500,
      });

      return user;
    } catch (error: any) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message || "登录失败" });
      throw error;
    }
  };

  // 检查登录状态（从本地 token 恢复用户信息）
  const checkLoginStatus = () => {
    const hasToken = TokenManager.hasToken();
    return hasToken;
  };

  // 获取用户完整信息
  const fetchUserInfo = async () => {
    try {
      const userData = await authApi.getMiniAppUser();

      const user: User = {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
        nickName: userData.nickName,
        avatarUrl: userData.avatarUrl,
        appId: userData.appId,
        wxOpenid: userData.wxOpenid,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      return user;
    } catch (error: any) {
      throw new Error(error.message || "获取用户信息失败");
    }
  };

  // 更新用户信息（头像和昵称）
  const updateUserProfile = async (nickName: string, avatarUrl: string) => {
    try {
      const appId = process.env.TARO_APP_ID || "";

      await authApi.updateMiniAppUser({
        appId,
        nickName,
        avatarUrl,
      });

      // 更新本地用户信息
      dispatch({
        type: "UPDATE_USER",
        payload: { nickName, avatarUrl },
      });

      Taro.showToast({
        title: "更新成功",
        icon: "success",
        duration: 1500,
      });
    } catch (error: any) {
      throw new Error(error.message || "更新失败");
    }
  };

  // 退出登录
  const logout = () => {
    authApi.logout();
    dispatch({ type: "LOGOUT" });

    Taro.showToast({
      title: "已退出登录",
      icon: "none",
      duration: 1500,
    });
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  // 清除错误
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return {
    ...state,
    wxLogin,
    checkLoginStatus,
    fetchUserInfo,
    updateUserProfile,
    logout,
    updateUser,
    clearError,
  };
};
