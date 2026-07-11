# MobileAppTemplate project context for Hermes

当在此仓库中工作时，Hermes 应遵循以下规则：

## 技术约束
- 使用 Expo SDK 57 + Expo Router（文件系统路由）
- 使用 Tamagui 作为 UI 框架（亮/暗主题通过 `@template/theme`）
- 状态管理使用 Zustand
- 国际化使用 i18next，通过 `@template/i18n-shared` 访问
- 支付通过 `@template/paywall`（RevenueCat 封装）
- 认证通过 `@template/auth`（Apple + Google Sign-In）
- 分析通过 `@template/analytics`（PostHog）
- 崩溃上报通过 Sentry

## 目录约定
- `src/app/` — Expo Router 页面（文件即路由）
- `packages/` — 可复用模块（@template/*）
- `assets/` — 静态资源
- `fastlane/` — 自动化截图和元数据上传

## 设计规范
- 默认暗色主题（`#0D1117` 背景）
- 颜色 Token 在 `packages/theme/src/tokens.ts`
- 多语言文案在 `packages/i18n-shared/src/locales/`
- 设置页组件在 `packages/settings/src/SettingsScreen.tsx`

## 关键命令
- `npx expo start --ios` — 启动 iOS 模拟器
- `npx expo start --android` — 启动 Android 模拟器
- `npx tsc --noEmit` — TypeScript 类型检查
- `npm install --legacy-peer-deps` — 安装依赖（必须使用此 flag）
