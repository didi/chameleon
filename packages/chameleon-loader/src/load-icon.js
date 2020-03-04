const _ = module.exports = {};
const path = require('path');
const cmlUtils = require('chameleon-tool-utils');
const fse = require('fs-extra');

_.handleApptabbar = function(newJsonObj, filePath, type) {
  let tabbarIconPaths = _.getTabbarIconPaths(newJsonObj.tabBar, type);
  if (tabbarIconPaths.length) {
    tabbarIconPaths.forEach((item) => {
      let rootDir = path.resolve(cml.projectRoot, `dist/${type}`);

      let destIconPath = path.resolve(rootDir, item.finalPath); // 获取到要将icon拷贝的路径
      let sourceIconPath = path.resolve(filePath, item.originPath) // 获取到原来的icon的路径
      if (cmlUtils.isFile(sourceIconPath)) {
        fse.copySync(sourceIconPath, destIconPath)
      } else {
        cmlUtils.log.warn(`${sourceIconPath} is not exsit`)
      }

    });
  }
}
_.getRelativeIconPath = function(p) {
  let fileName = path.parse(p).base;
  return path.join('./icon', fileName)
}
_.getTabbarIconPaths = function(tabbar, type) {
  let iconPaths = [];
  let miniAppType = ['wx', 'baidu', 'qq', 'tt']

  if (tabbar && miniAppType.includes(type)) {
    (tabbar.list || []).forEach((item) => {
      if (item.iconPath) {
        let iconInfo = {};
        iconInfo.originPath = item.iconPath;
        item.iconPath = _.getRelativeIconPath(item.iconPath);
        iconInfo.finalPath = item.iconPath;

        iconPaths.push(iconInfo);
      }
      if (item.selectedIconPath) {
        let iconInfo = {};
        iconInfo.originPath = item.selectedIconPath;
        item.selectedIconPath = _.getRelativeIconPath(item.selectedIconPath);
        iconInfo.finalPath = item.selectedIconPath;

        iconPaths.push(iconInfo);
      }
    })
  }
  if (tabbar && type === 'alipay') {
    (tabbar.items || []).forEach((item) => {
      if (item.icon) {
        let iconInfo = {};
        iconInfo.originPath = item.icon;
        item.icon = _.getRelativeIconPath(item.icon);
        iconInfo.finalPath = item.icon;

        iconPaths.push(iconInfo);
      }
      if (item.activeIcon) {
        let iconInfo = {};
        iconInfo.originPath = item.activeIcon;
        item.activeIcon = _.getRelativeIconPath(item.activeIcon);
        iconInfo.finalPath = item.activeIcon;

        iconPaths.push(iconInfo);
      }
    })
  }
  return iconPaths;
}
