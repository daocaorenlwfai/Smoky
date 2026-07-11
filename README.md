# mobile-app-template

Expo SDK 57 出海 App 通用模板。基于 Expo Router + Tamagui + RevenueCat + PostHog + Sentry。

## 技术栈

| 维度 | 选型 | 说明 |
|------|------|------|
| 框架 | Expo SDK 57 | iOS + Android 一站式 |
| 路由 | Expo Router | 文件系统路由 |
| UI | Tamagui | 跨端 Design Token |
| 状态 | Zustand | 轻量高性能 |
| 存储 | MMKV | 高性能 KV |
| 支付 | RevenueCat | 统一 IAP |
| 分析 | PostHog | 开源可自部署 |
| 监控 | Sentry | 崩溃上报 |
| 国际化 | i18next | 多语言框架 |

## 目录结构

```
MobileAppTemplate/
├── app.json                    # Expo 配置（占位 bundle ID）
├── packages/                   # Monorepo 共享模块
│   ├── auth/                   # Apple + Google + Email 登录
│   ├── paywall/                # RevenueCat 付费墙
│   ├── onboarding/             # 分步引导
│   ├── settings/               # 通用设置页
│   ├── analytics/              # PostHog 埋点
│   ├── i18n-shared/            # 多语言框架
│   └── theme/                  # Design Token（亮/暗）
└── src/app/                    # Expo Router 页面
```

## 新 App 启动命令

```bash
git clone git@github.com:<user>/mobile-app-template.git <AppName>
cd <AppName>
rm -rf .git && git init
npm install --legacy-peer-deps
# 修改 app.json 的 name/slug/bundleIdentifier
npx expo start --ios
```
