import { View, Text } from "@tarojs/components";
import "./index.scss";

interface LoadingProps {
  text?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Loading({
  text = "加载中...",
  size = "medium",
  className = "",
}: LoadingProps) {
  return (
    <View className={`loading-container ${size} ${className}`}>
      <View className="loading-spinner">
        <View className="spinner-dot"></View>
        <View className="spinner-dot"></View>
        <View className="spinner-dot"></View>
      </View>
      <Text className="loading-text">{text}</Text>
    </View>
  );
}
