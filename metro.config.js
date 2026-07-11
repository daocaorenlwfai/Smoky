// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  path.resolve(projectRoot, 'packages'),
];

config.resolver = {
  ...config.resolver,
  extraNodeModules: new Proxy(
    {},
    {
      get: (_, name) => {
        if (name.startsWith('@template/')) {
          const pkg = name.replace('@template/', '');
          return path.resolve(projectRoot, 'packages', pkg, 'src');
        }
        return undefined;
      },
    }
  ),
};

module.exports = config;
