# Taro + React 小程序通用启动模板

开箱即用的微信小程序 Startup 模板，基于 Taro 4.1.7 + React 18 + TypeScript，提供完整的用户认证系统和基础架构。

## ✨ 特性

- ✅ **完整的用户认证** - 微信手机号授权登录、用户信息管理、头像/昵称修改
- ✅ **请求封装** - 自动 Token 管理、统一错误处理、拦截器支持
- ✅ **状态管理** - Context + useReducer 模式，清晰的状态管理架构
- ✅ **基础组件库** - Loading、Empty、Icon、CustomNavBar 等常用组件
- ✅ **TypeScript 支持** - 完整的类型定义和类型安全
- ✅ **工程化配置** - ESLint、Stylelint、Husky、Commitlint 开箱即用
- ✅ **多环境支持** - 开发/生产环境配置分离
- ✅ **示例页面** - 完整的 Profile 页面展示最佳实践

## 🚀 快速开始

### 1. 从模板创建新项目

```bash
# 克隆或从这个分支创建新项目分支
git checkout -b my-new-project

# 或使用 /init 命令初始化（如果有的话）
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制并修改环境配置文件：

```bash
# 开发环境
# 修改 .env.development
TARO_APP_ID="your-miniprogram-appid"
TARO_APP_API_BASE_URL="http://localhost:3000"

# 生产环境
# 修改 .env.production
TARO_APP_ID="your-miniprogram-appid"
TARO_APP_API_BASE_URL="https://api.yourdomain.com"
```

参考 `.env.template` 查看所有可配置项。

### 4. 启动开发

```bash
# 微信小程序
npm run dev:weapp

# H5
npm run dev:h5

# 其他平台...
npm run dev:alipay   # 支付宝小程序
npm run dev:swan     # 百度小程序
```

### 5. 构建生产版本

```bash
npm run build:weapp
```

## 📁 项目结构

```
src/
├── types/              # TypeScript 类型定义
│   ├── api.ts         # API 响应、请求类型
│   ├── user.ts        # 用户相关类型
│   └── config.ts      # 配置类型
├── stores/            # 状态管理（Context + useReducer）
│   ├── UserContext.tsx    # 用户状态管理（完整实现）
│   └── index.ts          # 统一导出
├── services/          # 服务层
│   ├── request.ts     # 请求封装 + TokenManager
│   ├── config.ts      # API 配置管理
│   └── api/          # API 模块
│       ├── auth.ts   # 认证 API（完整实现）
│       └── index.ts  # API 统一导出
├── components/        # 通用组件库
│   ├── Loading/      # 加载状态组件
│   ├── Empty/        # 空状态组件
│   ├── Icon/         # 图标组件
│   └── CustomNavBar/ # 自定义导航栏
├── pages/            # 页面
│   ├── index/        # 首页（示例页面）
│   └── profile/      # 个人中心（用户认证示例）
├── utils/            # 工具函数
│   └── errorHandler.ts
├── assets/           # 静态资源
│   ├── icons/
│   └── images/
├── app.tsx           # 应用入口
├── app.config.ts     # 应用配置
└── app.scss          # 全局样式
```

## 🔑 核心功能

### 用户认证系统

完整实现了微信小程序的用户认证流程：

```typescript
import { useUserStore } from '@/stores';

function MyPage() {
  const {
    user,              // 用户信息
    isLoggedIn,        // 登录状态
    wxLogin,           // 微信授权登录
    fetchUserInfo,     // 获取用户信息
    updateUserProfile, // 更新用户资料（头像、昵称）
    logout,            // 退出登录
  } = useUserStore();

  return (
    <View>
      {isLoggedIn ? (
        <Text>欢迎，{user.nickName}</Text>
      ) : (
        <Button openType="getPhoneNumber" onGetPhoneNumber={handleLogin}>
          授权登录
        </Button>
      )}
    </View>
  );
}
```

**已实现功能：**
- 微信手机号授权登录
- 用户头像选择和上传
- 用户昵称修改（微信 `type="nickname"`）
- 手机号码脱敏显示
- Token 自动管理
- 登录状态持久化

### 请求封装

自动化的请求管理：

```typescript
import { request } from '@/services/request';

// 自动添加 Token、错误处理
const response = await request.get('/api/users');
const response = await request.post('/api/users', { name: 'John' });
```

**内置功能：**
- ✅ 自动添加 Token 到请求头
- ✅ 401/403 自动清除 Token 并跳转登录
- ✅ 统一错误提示（Toast）
- ✅ 请求/响应拦截
- ✅ 支持自定义超时时间

### 状态管理

使用 Context + useReducer 模式：

```typescript
// 1. 定义状态和 Action
// 2. 创建 Reducer
// 3. 创建 Provider 和 Hook
// 4. 在 app.tsx 中使用 Provider

// 参考 stores/UserContext.tsx 实现
```

## 📝 开发规范

### TypeScript 使用策略

- **必须使用 TS**: API 接口、状态管理、复杂组件 Props、配置常量
- **可以使用 JS**: 简单页面组件、简单工具函数、Mock 数据

### 文件命名

- 组件文件: `PascalCase.tsx` (如: `UserCard.tsx`)
- 工具文件: `kebab-case.js` (如: `user-helper.js`)
- 样式文件: `kebab-case.scss` (如: `user-card.scss`)

### 路径别名

```typescript
import { User } from '@/types';           // ✅ 推荐
import { useUserStore } from '@/stores';  // ✅ 推荐

import { User } from '../../types';       // ❌ 不推荐
```

## 🎯 开发命令

```bash
# 开发
npm run dev:weapp          # 微信小程序
npm run dev:h5             # H5
npm run dev:alipay         # 支付宝小程序

# 构建
npm run build:weapp        # 构建微信小程序

# 代码质量
tsc --noEmit              # TypeScript 类型检查
stylelint src/**/*.scss   # Sass 样式检查

# Git 提交
# 自动运行 Husky + Commitlint
git commit -m "feat: 添加新功能"
```

## 📖 文档

- [STARTUP-GUIDE.md](./STARTUP-GUIDE.md) - 详细的使用指南和最佳实践
- [Taro 官方文档](https://taro-docs.jd.com/)
- [React 官方文档](https://react.dev/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 🔧 技术栈

- **框架**: Taro 4.1.7 + React 18
- **语言**: TypeScript 5.4+
- **样式**: Sass + 自定义设计系统
- **状态管理**: Context + useReducer
- **构建工具**: Vite 4
- **代码规范**: ESLint + Stylelint + Commitlint
- **Git Hooks**: Husky

## 📦 Commit 规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具变动
```

示例：
```bash
git commit -m "feat: 添加产品列表页面"
git commit -m "fix: 修复登录状态丢失问题"
```

## 🤝 贡献

从这个模板创建你的项目后，可以根据业务需求自由修改和扩展。

## 📄 License

MIT

---

**开始使用：** 查看 [STARTUP-GUIDE.md](./STARTUP-GUIDE.md) 了解如何从这个模板创建新项目！
