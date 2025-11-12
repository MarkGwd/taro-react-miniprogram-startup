import { View, Text } from "@tarojs/components";
import "./index.scss";

interface EmptyProps {
  text?: string;
  description?: string;
  icon?: string;
  className?: string;
  onAction?: () => void;
  actionText?: string;
}

export default function Empty({
  text = "暂无数据",
  description,
  icon = "📭",
  className = "",
  onAction,
  actionText = "刷新",
}: EmptyProps) {
  return (
    <View className={`empty-container ${className}`}>
      <View className="empty-icon">
        <Text className="icon-text">{icon}</Text>
      </View>
      <Text className="empty-text">{text}</Text>
      {description && <Text className="empty-description">{description}</Text>}
      {onAction && (
        <View className="empty-action" onClick={onAction}>
          <Text className="action-text">{actionText}</Text>
        </View>
      )}
    </View>
  );
}
