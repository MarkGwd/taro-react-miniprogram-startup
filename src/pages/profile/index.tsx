import { View, Text, Image, Button, Input } from "@tarojs/components";
import {
  useLoad,
  showToast,
  uploadFile,
  getStorageSync,
  switchTab,
} from "@tarojs/taro";
import { useState } from "react";
import { useUserStore } from "../../stores";
import CustomNavBar from "../../components/CustomNavBar";
import Icon from "../../components/Icon";
import { getApiConfig } from "../../services/config";
import "./index.scss";

export default function Profile() {
  const { user, wxLogin, checkLoginStatus, fetchUserInfo, updateUserProfile } =
    useUserStore();

  // 弹窗状态管理
  const [showEditModal, setShowEditModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");
  const [tempNickName, setTempNickName] = useState("");

  useLoad(async () => {
    console.log("Profile page loaded.");
    // 检查登录状态
    const loggedIn = checkLoginStatus();
    if (loggedIn) {
      // 获取用户完整信息
      try {
        await fetchUserInfo();
      } catch (error: any) {
        console.error("获取用户信息失败:", error);
      }
    }
  });

  // 授权手机号码登录
  const handlePhoneLogin = async (e: any) => {
    const { code, errMsg } = e.detail;

    if (code) {
      try {
        // 调用登录接口（传入手机号码 code）
        await wxLogin(code);
        // 登录成功后获取用户信息
        await fetchUserInfo();
      } catch (error: any) {
        showToast({
          title: error.message || "登录失败",
          icon: "none",
        });
      }
    } else {
      // 用户取消授权，静默处理（不显示提示）
      if (
        errMsg &&
        (errMsg.includes("user deny") || errMsg.includes("cancel"))
      ) {
        return;
      }
      // 其他错误才显示提示
      showToast({
        title: "授权失败，请稍后重试",
        icon: "none",
      });
    }
  };

  // 点击编辑按钮，打开弹窗
  const handleEditProfile = () => {
    setTempAvatarUrl(user?.avatarUrl || "");
    setTempNickName(user?.nickName || "");
    setShowEditModal(true);
  };

  // 关闭弹窗
  const handleCloseModal = () => {
    setShowEditModal(false);
    setTempAvatarUrl("");
    setTempNickName("");
  };

  // 选择头像
  const handleChooseAvatar = async (e: any) => {
    const { avatarUrl } = e.detail;
    console.log("选择的头像:", avatarUrl);

    // 上传头像到服务器
    try {
      const apiConfig = getApiConfig();
      const token = getStorageSync("token");

      const uploadRes = await uploadFile({
        url: `${apiConfig.baseUrl}/file/upload`,
        filePath: avatarUrl,
        name: "file",
        header: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = JSON.parse(uploadRes.data);
      // 后端返回格式: {code: 200, msg: null, data: {name: "xxx.png", url: "https://..."}}
      if (data.code === 200 && data.data && data.data.url) {
        setTempAvatarUrl(data.data.url);
        showToast({
          title: "头像上传成功",
          icon: "success",
        });
      } else {
        throw new Error(data.msg || "上传失败");
      }
    } catch (error: any) {
      console.error("上传头像失败:", error);
      showToast({
        title: error.message || "上传头像失败",
        icon: "none",
      });
    }
  };

  // 昵称输入
  const handleNicknameInput = (e: any) => {
    setTempNickName(e.detail.value);
  };

  // 保存用户信息
  const handleSaveProfile = async () => {
    if (!tempNickName.trim()) {
      showToast({
        title: "请输入昵称",
        icon: "none",
      });
      return;
    }

    try {
      await updateUserProfile(
        tempNickName,
        tempAvatarUrl || user?.avatarUrl || ""
      );
      handleCloseModal();
    } catch (error: any) {
      showToast({
        title: error.message || "保存失败",
        icon: "none",
      });
    }
  };

  // 隐藏手机号码中间4位
  const maskPhone = (phone: string): string => {
    if (!phone || phone.length !== 11) return phone;
    return phone.substring(0, 3) + "****" + phone.substring(7);
  };

  // 检查登录状态
  const isLoggedIn = checkLoginStatus();

  return (
    <View className="profile">
      {/* 自定义导航栏 */}
      <CustomNavBar title="我的" />

      <View className="content">
        {/* 用户信息区域 */}
        <View className="user-section">
          {isLoggedIn ? (
            <>
              <View className="user-info-clickable" onClick={handleEditProfile}>
                <View className="user-avatar-container">
                  <Image
                    className="user-avatar"
                    src={
                      user?.avatarUrl ||
                      "../../assets/images/user-avatar-default.png"
                    }
                    mode="aspectFill"
                  />
                  <View className="edit-icon">
                    <Icon name="pencil" size={16} color="#ffffff" />
                  </View>
                </View>
                <Text className="user-name">
                  {user?.nickName || "点击设置昵称"}
                </Text>
              </View>
              {user?.phone && (
                <Text className="user-phone">{maskPhone(user.phone)}</Text>
              )}
            </>
          ) : (
            <>
              <View className="user-avatar-container">
                <Image
                  className="user-avatar"
                  src="../../assets/images/user-avatar-default.png"
                  mode="aspectFill"
                />
              </View>
              <Text className="user-name">未登录</Text>
              <Button
                className="login-button"
                openType="getPhoneNumber"
                onGetPhoneNumber={handlePhoneLogin}
              >
                授权手机号码登录
              </Button>
              <View
                className="skip-login"
                onClick={() => switchTab({ url: "/pages/index/index" })}
              >
                <Text className="skip-login-text">不授权继续使用</Text>
              </View>
            </>
          )}
        </View>

      </View>

      {/* 编辑弹窗 */}
      {showEditModal && (
        <View className="modal-overlay" onClick={handleCloseModal}>
          <View className="modal-content" onClick={(e) => e.stopPropagation()}>
            <View className="modal-header">
              <Text className="modal-title">编辑资料</Text>
              <View className="modal-close" onClick={handleCloseModal}>
                <Text>✕</Text>
              </View>
            </View>

            <View className="modal-body">
              {/* 头像选择 */}
              <View className="form-item">
                <Text className="form-label">头像</Text>
                <Button
                  className="avatar-picker"
                  openType="chooseAvatar"
                  onChooseAvatar={handleChooseAvatar}
                >
                  <Image
                    className="avatar-preview"
                    src={
                      tempAvatarUrl ||
                      user?.avatarUrl ||
                      "../../assets/images/user-avatar-default.png"
                    }
                    mode="aspectFill"
                  />
                  <Text className="avatar-tip">点击更换</Text>
                </Button>
              </View>

              {/* 昵称输入 */}
              <View className="form-item">
                <Text className="form-label">昵称</Text>
                <Input
                  className="nickname-input"
                  type="nickname"
                  value={tempNickName}
                  onInput={handleNicknameInput}
                  placeholder="请输入昵称"
                />
              </View>
            </View>

            <View className="modal-footer">
              <Button className="cancel-btn" onClick={handleCloseModal}>
                取消
              </Button>
              <Button className="save-btn" onClick={handleSaveProfile}>
                保存
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
