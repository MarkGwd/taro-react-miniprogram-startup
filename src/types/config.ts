// 配置相关类型定义

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  useMock: boolean;
  modules: {
    auth: { useMock: boolean };
    student: { useMock: boolean };
    report: { useMock: boolean };
  };
}

export interface HomeConfig {
  video: {
    title: string;
    description: string;
    thumbnail: string;
    url: string;
  };
  showcase: {
    title: string;
    students: Array<{
      id: string;
      name: string;
      avatar: string;
      grade: string;
    }>;
  };
  articles: {
    title: string;
    tabs: Array<{
      id: string;
      name: string;
    }>;
    list: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      date: string;
      category: string;
    }>;
  };
}

export interface AppConfig {
  name: string;
  version: string;
  api: ApiConfig;
  home: HomeConfig;
}
