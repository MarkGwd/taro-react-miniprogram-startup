import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";

interface CustomNavBarProps {
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function CustomNavBar({
  title = "春笋英语",
  backgroundColor = "#f6f8f6",
  textColor = "#1f2937",
}: CustomNavBarProps) {
  // 使用新的 API 获取系统信息
  const windowInfo = Taro.getWindowInfo();

  return (
    <View
      className="custom-navbar"
      style={{
        paddingTop: `${windowInfo.statusBarHeight}px`,
        backgroundColor,
      }}
    >
      <View className="navbar-content">
        <Text
          className="navbar-title"
          style={{
            color: textColor,
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
}
