import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import { useUserStore } from "../../stores";
import CustomNavBar from "../../components/CustomNavBar";
import { Loading } from "../../components";
import "./index.scss";

export default function Index() {
  const { user, checkLoginStatus, isLoggedIn, loading } = useUserStore();

  useLoad(() => {
    console.log("Home page loaded.");
    // 检查登录状态
    checkLoginStatus();
  });

  return (
    <View className="home">
      {/* 自定义导航栏 */}
      <CustomNavBar title="首页" />

      <View className="content">
        {/* 欢迎区域 */}
        <View className="welcome-section">
          <Text className="welcome-title">
            欢迎使用 Taro + React 小程序 Startup
          </Text>
          <Text className="welcome-subtitle">
            这是一个通用的小程序启动模板
          </Text>
        </View>

        {/* 用户状态展示 */}
        <View className="user-status-section">
          <View className="section-header">
            <Text className="section-title">用户状态</Text>
          </View>

          {loading ? (
            <Loading text="加载中..." />
          ) : (
            <View className="status-card">
              <View className="status-item">
                <Text className="status-label">登录状态:</Text>
                <Text className={`status-value ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
                  {isLoggedIn ? '已登录' : '未登录'}
                </Text>
              </View>

              {isLoggedIn && user && (
                <>
                  <View className="status-item">
                    <Text className="status-label">昵称:</Text>
                    <Text className="status-value">{user.nickName || '未设置'}</Text>
                  </View>
                  <View className="status-item">
                    <Text className="status-label">手机:</Text>
                    <Text className="status-value">
                      {user.phone ? `${user.phone.substring(0, 3)}****${user.phone.substring(7)}` : '未绑定'}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        {/* 功能说明区域 */}
        <View className="features-section">
          <View className="section-header">
            <Text className="section-title">功能说明</Text>
          </View>

          <View className="features-list">
            <View className="feature-item">
              <Text className="feature-icon">✅</Text>
              <View className="feature-content">
                <Text className="feature-title">用户认证</Text>
                <Text className="feature-desc">完整的微信登录和用户信息管理</Text>
              </View>
            </View>

            <View className="feature-item">
              <Text className="feature-icon">✅</Text>
              <View className="feature-content">
                <Text className="feature-title">请求封装</Text>
                <Text className="feature-desc">自动 Token 管理和错误处理</Text>
              </View>
            </View>

            <View className="feature-item">
              <Text className="feature-icon">✅</Text>
              <View className="feature-content">
                <Text className="feature-title">状态管理</Text>
                <Text className="feature-desc">Context + useReducer 模式</Text>
              </View>
            </View>

            <View className="feature-item">
              <Text className="feature-icon">✅</Text>
              <View className="feature-content">
                <Text className="feature-title">基础组件</Text>
                <Text className="feature-desc">Loading, Empty, Icon, CustomNavBar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 提示信息 */}
        <View className="tips-section">
          <Text className="tips-text">
            💡 这是一个示例页面，您可以根据业务需求进行修改
          </Text>
          <Text className="tips-text">
            📖 查看 STARTUP-GUIDE.md 了解更多使用说明
          </Text>
        </View>
      </View>
    </View>
  );
}
