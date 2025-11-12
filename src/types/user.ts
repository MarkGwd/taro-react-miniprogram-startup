// 用户相关类型定义

export interface User {
  id: number;
  name: string;
  phone: string;
  token?: string;
  appId?: string;
  wxOpenid?: string;
  nickName?: string;
  avatarUrl?: string;
  countryCode?: string;
  gender?: string;
  city?: string;
}

export interface Student {
  id: number;
  classId: number;
  name: string;
  number: string; // 学号
  status: number;
  settlementStatus: number;
  studentStage: number;
  school: string;
  totalScore: number;
}

export interface UserProfile {
  user: User;
  students: Student[];
}

// 登录相关
export interface WxLoginRequest {
  appId: string;
  code: string;
  loginType: number; // 1: 获取用户手机号码, 3: 获取 openid
  id?: number; // loginType=3 时需要传递用户 id
}

export interface WxLoginResponse {
  id: number;
  name: string;
  phone: string;
  token: string;
}

// 绑定学生相关
export interface BindStudentRequest {
  scanPageId: string; // 扫码页面 ID（替换原来的 screeningId）
  studentName: string;
  publicOpenId: string; // 公众号 OpenID
}

export interface BindStudentResponse {
  success: boolean;
  message?: string;
}

// 公众号 OpenID 响应
export interface PublicOpenIdResponse {
  id: number;
  name: string;
  phone: string;
  token: string;
  publicOpenId?: string; // 如果已绑定公众号，会返回此字段
}

// 更新用户信息请求
export interface UpdateUserRequest {
  appId: string;
  nickName: string;
  avatarUrl: string;
}
