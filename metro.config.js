// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// ── Resolve @template/* aliases ──────────────────────────
const packagesDir = path.join(projectRoot, 'packages');
const packages = ['auth', 'paywall', 'onboarding', 'settings', 'analytics', 'i18n-shared', 'theme', 'supabase', 'feedback'];

packages.forEach((pkg) => {
  config.resolver.extraNodeModules[`@template/${pkg}`] = path.join(packagesDir, pkg, 'src');
  config.watchFolders.push(path.join(packagesDir, pkg));
});

module.exports = config;
