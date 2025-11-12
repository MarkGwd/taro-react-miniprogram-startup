export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/profile/index",
  ],
  window: {
    backgroundTextStyle: "light",
    backgroundColor: "#f6f8f6",
  },
  tabBar: {
    color: "#6b7280",
    selectedColor: "#13ec13",
    backgroundColor: "rgba(246, 248, 246, 0.8)",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home-active.png",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
        iconPath: "assets/icons/profile.png",
        selectedIconPath: "assets/icons/profile-active.png",
      },
    ],
  },
});
