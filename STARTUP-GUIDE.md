# Taro + React 小程序 Startup 使用指南

欢迎使用 Taro + React 小程序通用启动模板！本指南将帮助你快速从这个 startup 模板创建新的小程序项目。

## 🚀 快速开始

### 1. 创建新项目

```bash
# 从 startup 分支创建新项目分支
git checkout -b my-new-project

# 初始化项目配置
# 可以手动修改配置文件，或运行 /init 命令（如果有）
```

### 2. 配置环境变量

复制 `.env.template` 为 `.env.development` 和 `.env.production`，并填写配置：

```bash
# .env.development
TARO_APP_ID="your-miniprogram-appid"
TARO_APP_API_BASE_URL="http://localhost:3000"

# .env.production  
TARO_APP_ID="your-miniprogram-appid"
TARO_APP_API_BASE_URL="https://api.yourdomain.com"
```

### 3. 修改项目信息

更新 `package.json` 中的项目名称和描述：

```json
{
  "name": "your-project-name",
  "description": "你的项目描述"
}
```

### 4. 安装依赖并启动

```bash
npm install
npm run dev:weapp
```

## 📁 目录结构说明

```
src/
├── types/              # TypeScript 类型定义
│   ├── api.ts         # API 响应类型
│   ├── user.ts        # 用户相关类型
│   └── config.ts      # 配置类型
├── stores/            # 状态管理（Context + useReducer）
│   ├── UserContext.tsx    # 用户状态管理（已实现）
│   └── index.ts          # 统一导出
├── services/          # 服务层
│   ├── request.ts     # 请求封装 + Token 管理
│   ├── config.ts      # API 配置
│   └── api/          # API 模块
│       ├── auth.ts   # 认证 API（已实现）
│       └── index.ts  # API 统一导出
├── components/        # 组件库
│   ├── Loading/      # 加载组件
│   ├── Empty/        # 空状态组件
│   ├── Icon/         # 图标组件
│   └── CustomNavBar/ # 自定义导航栏
├── pages/            # 页面
│   ├── index/        # 首页示例
│   └── profile/      # 个人中心（用户认证示例）
├── utils/            # 工具函数
│   └── errorHandler.ts
├── assets/           # 静态资源
│   ├── icons/        # 图标
│   └── images/       # 图片
├── app.tsx           # 应用入口
├── app.config.ts     # 应用配置
└── app.scss          # 全局样式
```

## 🔧 核心功能使用指南

### 1. 用户认证系统

Startup 已经实现了完整的微信小程序用户认证功能：

#### UserContext 提供的功能

```typescript
import { useUserStore } from '@/stores';

function MyComponent() {
  const {
    user,              // 用户信息
    isLoggedIn,        // 登录状态
    loading,           // 加载状态
    wxLogin,           // 微信手机号授权登录
    checkLoginStatus,  // 检查登录状态
    fetchUserInfo,     // 获取用户信息
    updateUserProfile, // 更新用户资料（头像、昵称）
    logout,            // 退出登录
  } = useUserStore();

  // 使用示例
  const handleLogin = async (code) => {
    await wxLogin(code);
    await fetchUserInfo();
  };

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

#### 用户资料管理

Profile 页面展示了完整的用户资料管理示例：
- 微信授权手机号登录
- 头像选择和上传（使用微信 `chooseAvatar`）
- 昵称修改（使用 `type="nickname"` 输入框）
- 手机号码脱敏显示

### 2. 请求封装

#### 基本使用

```typescript
import { request } from '@/services/request';

// GET 请求
const response = await request.get('/api/users');

// POST 请求
const response = await request.post('/api/users', { name: 'John' });

// PUT 请求
const response = await request.put('/api/users/1', { name: 'Jane' });

// DELETE 请求
const response = await request.delete('/api/users/1');
```

#### Token 自动管理

Request 类会自动：
- 添加 Token 到请求头
- 处理 401/403 错误（清除 Token 并跳转登录）
- 显示错误提示

```typescript
import { TokenManager } from '@/services/request';

// 手动操作 Token
TokenManager.getToken();      // 获取
TokenManager.setToken(token); // 设置
TokenManager.removeToken();   // 移除
TokenManager.hasToken();      // 检查是否存在
```

### 3. 创建新的 API 模块

参考 `services/api/auth.ts` 创建新的 API 模块：

```typescript
// services/api/product.ts
import { request } from '../request';

export const productApi = {
  // 获取产品列表
  getProducts: async () => {
    const response = await request.get('/api/products');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  },

  // 获取产品详情
  getProductDetail: async (id: number) => {
    const response = await request.get(`/api/products/${id}`);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  },
};

// services/api/index.ts
export * from './auth';
export * from './product';  // 添加导出
```

### 4. 创建新的 Context

参考 `stores/UserContext.tsx` 创建新的状态管理：

```typescript
// stores/ProductContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/types';

// 1. 定义状态类型
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// 2. 定义 Action 类型
type ProductAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_FAILURE'; payload: string };

// 3. Reducer 函数
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAILURE':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// 4. 初始状态
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 5. 创建 Context
const ProductContext = createContext<{
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
} | null>(null);

// 6. Provider 组件
export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);
  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

// 7. 业务逻辑 Hook
export const useProductStore = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductStore must be used within ProductProvider');
  }
  const { state, dispatch } = context;

  const fetchProducts = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await productApi.getProducts();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: error.message });
    }
  };

  return {
    ...state,
    fetchProducts,
  };
};

// 8. 在 app.tsx 中添加 Provider
import { UserProvider, ProductProvider } from './stores';

function App({ children }) {
  return (
    <UserProvider>
      <ProductProvider>
        <View>{children}</View>
      </ProductProvider>
    </UserProvider>
  );
}
```

### 5. 组件使用

#### Loading 组件

```typescript
import { Loading } from '@/components';

<Loading text="加载中..." size="medium" />
```

#### Empty 组件

```typescript
import { Empty } from '@/components';

<Empty
  text="暂无数据"
  description="请稍后再试"
  icon="📦"
  onAction={handleRefresh}
  actionText="刷新"
/>
```

#### Icon 组件

```typescript
import { Icon } from '@/components';

<Icon name="pencil" size={20} color="#13ec13" />
```

#### CustomNavBar 组件

```typescript
import CustomNavBar from '@/components/CustomNavBar';

<CustomNavBar title="页面标题" />
```

## 🎨 开发规范

### TypeScript 使用策略

**必须使用 TypeScript：**
- API 接口和类型定义（`src/types/`）
- 状态管理（`src/stores/`）
- 复杂组件 Props
- 配置常量

**可以使用 JavaScript：**
- 简单页面组件
- 简单工具函数
- Mock 数据文件

### 文件命名

- **组件文件**: `PascalCase.tsx` (如: `UserCard.tsx`)
- **工具文件**: `kebab-case.js` (如: `user-helper.js`)
- **样式文件**: `kebab-case.scss` (如: `user-card.scss`)

### 路径别名

使用 `@/*` 映射到 `./src/*`：

```typescript
// ✅ 推荐
import { User } from '@/types';
import { useUserStore } from '@/stores';

// ❌ 不推荐
import { User } from '../../types';
```

## 📝 常见场景示例

### 场景 1：添加新页面

```bash
# 1. 创建页面目录和文件
mkdir src/pages/my-page
touch src/pages/my-page/index.tsx
touch src/pages/my-page/index.scss
touch src/pages/my-page/index.config.ts
```

```typescript
// src/pages/my-page/index.tsx
import { View, Text } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import CustomNavBar from '@/components/CustomNavBar';
import './index.scss';

export default function MyPage() {
  useLoad(() => {
    console.log('MyPage loaded');
  });

  return (
    <View className="my-page">
      <CustomNavBar title="我的页面" />
      <View className="content">
        <Text>页面内容</Text>
      </View>
    </View>
  );
}
```

```typescript
// src/pages/my-page/index.config.ts
export default definePageConfig({
  navigationBarTitleText: '我的页面',
});
```

```typescript
// src/app.config.ts - 添加页面路由
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/index',
    'pages/my-page/index',  // 添加新页面
  ],
});
```

### 场景 2：实现列表页

```typescript
import { View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { Loading, Empty } from '@/components';

export default function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useLoad(async () => {
    await fetchList();
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await request.get('/api/list');
      setList(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="list-page">
      {loading && <Loading />}
      {!loading && list.length === 0 && (
        <Empty text="暂无数据" onAction={fetchList} actionText="刷新" />
      )}
      {!loading && list.length > 0 && (
        <View className="list">
          {list.map((item) => (
            <View key={item.id} className="list-item">
              {/* 列表项内容 */}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
```

### 场景 3：文件上传

```typescript
import Taro, { uploadFile, getStorageSync } from '@tarojs/taro';
import { getApiConfig } from '@/services/config';

const handleUpload = async (filePath: string) => {
  try {
    const apiConfig = getApiConfig();
    const token = getStorageSync('jwt_token');

    const uploadRes = await uploadFile({
      url: `${apiConfig.baseUrl}/file/upload`,
      filePath: filePath,
      name: 'file',
      header: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = JSON.parse(uploadRes.data);
    if (data.code === 200 && data.data?.url) {
      return data.data.url;
    }
    throw new Error(data.msg || '上传失败');
  } catch (error) {
    console.error('上传失败:', error);
    throw error;
  }
};
```

## 🔍 调试技巧

### 1. 查看请求日志

Request 类会自动打印请求信息，在开发者工具 Console 中查看。

### 2. 查看状态变化

在 Context 的 reducer 中添加日志：

```typescript
const userReducer = (state: UserState, action: UserAction): UserState => {
  console.log('Action:', action.type, action);
  // ... reducer 逻辑
};
```

### 3. 调试 API 请求

```typescript
const response = await request.get('/api/test');
console.log('API Response:', response);
```

## 🚧 常见问题

### Q: 如何处理未登录状态？

A: Request 类会自动处理 401/403 错误，清除 Token 并跳转到 Profile 页面（登录页）。

### Q: 如何添加新的环境变量？

A: 在 `.env.development` 和 `.env.production` 中添加 `TARO_APP_` 前缀的变量，然后在代码中通过 `process.env.TARO_APP_YOUR_VAR` 访问。

### Q: 如何修改主题颜色？

A: 修改页面 SCSS 文件中的 `$primary-color` 变量：

```scss
$primary-color: #13ec13;  // 修改为你的主题色
```

### Q: 如何处理图片资源？

A: 将图片放在 `src/assets/images/` 目录，然后在代码中引用：

```typescript
import avatarImg from '@/assets/images/avatar.png';

<Image src={avatarImg} />
```

## 📚 参考资源

- [Taro 官方文档](https://taro-docs.jd.com/)
- [React 官方文档](https://react.dev/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

## 🎉 开始开发

现在你已经了解了如何使用这个 Startup 模板！开始创建你的小程序项目吧：

1. 配置环境变量
2. 修改项目信息
3. 添加你的业务页面
4. 创建新的 Context 和 API
5. 开始编码！

祝开发顺利！ 🚀
