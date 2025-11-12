import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { UserProvider } from "./stores";

import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  // children 是将要会渲染的页面
  return (
    <UserProvider>
      <View>{children}</View>
    </UserProvider>
  );
}

export default App;