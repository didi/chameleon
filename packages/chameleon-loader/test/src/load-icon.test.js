const loadIcon = require('../../src/load-icon.js');
const expect = require('chai').expect;
const path = require('path');

describe('load-icon', function() {
  it('handleApptabbar', function() {
    let newJsonObj = {
      "tabBar": {
        "color": "#7A7E83",
        "selectedColor": "#3cc51f",
        "borderStyle": "black",
        "backgroundColor": "#ffffff",
        "list": [
          {
            "pagePath": "pages/index/index",
            "text": "组件",
            "iconPath": "../../assets/images/chameleon.png",
            "selectedIconPath": "../../assets/images/icon_API.png"
          },
          {
            "pagePath": "pages/index/index2",
            "text": "接口"
          }
        ]
      }
    }
    let filePath = path.resolve(__dirname);
    global.cml = {projectRoot: path.resolve(__dirname)}

    let result = loadIcon.handleApptabbar(newJsonObj, filePath, 'wx');
    expect(result).to.not.be.ok;
  })
  it('getRelativeIconPath', function() {
    let result = loadIcon.getRelativeIconPath('./dir/chameleon.png');
    expect(result).to.equal('icon/chameleon.png')
  });
  it('getTabbarIconPaths-baidu', function() {
    let tabbar = {
      "color": "#7A7E83",
      "selectedColor": "#3cc51f",
      "borderStyle": "black",
      "backgroundColor": "#ffffff",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "组件",
          "iconPath": "../../assets/images/chameleon.png",
          "selectedIconPath": "../../assets/images/icon_API2.png"
        },
        {
          "pagePath": "pages/index/index2",
          "text": "接口"
        }
      ]
    }
    let result = loadIcon.getTabbarIconPaths(tabbar, 'baidu')
    expect(result).to.be.an('array')
  });
  it('getTabbarIconPaths-wx', function() {
    let tabbar = {
      "color": "#7A7E83",
      "selectedColor": "#3cc51f",
      "borderStyle": "black",
      "backgroundColor": "#ffffff",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "组件",
          "iconPath": "../../assets/images/chameleon.png",
          "selectedIconPath": "../../assets/images/icon_API2.png"
        },
        {
          "pagePath": "pages/index/index2",
          "text": "接口"
        }
      ]
    }
    let result = loadIcon.getTabbarIconPaths(tabbar, 'wx')
    expect(result).to.be.an('array')
  });
  it('getTabbarIconPaths-baidu', function() {
    let tabbar = {
      "color": "#7A7E83",
      "selectedColor": "#3cc51f",
      "borderStyle": "black",
      "backgroundColor": "#ffffff",
      "items": [
        {
          "pagePath": "pages/index/index",
          "text": "组件",
          "icon": "../../assets/images/chameleon.png",
          "activeIcon": "../../assets/images/icon_API2.png"
        },
        {
          "pagePath": "pages/index/index2",
          "text": "接口"
        }
      ]
    }
    let result = loadIcon.getTabbarIconPaths(tabbar, 'alipay')
    expect(result).to.be.an('array')
  });

})
