
const {chameleonHandle} = require('../lib/utils.js');
const { expect } = require('chai');

describe('test chameleonHandle function', function () {
  it('', function () {
    let content = `../../chameleon-tool/node_modules/babel-loader/lib/index.js?{\"filename\":\"/Users/didi/Documents/code/chameleon-tool/package.json\"}!../../chameleon-tool/node_modules/vue-loader/lib/selector.js?type=script&index=0!../../chameleon-tool/node_modules/chameleon-loader/index.js??ref--11-1!../../chameleon-tool/node_modules/replace-loader/index.js??ref--11-2!./node_modules/cml-ui/components/c-header/c-header.cml`;
    let cliName = 'chameleon-tool';
    let result = chameleonHandle(content, cliName);
    console.log(result)
    expect(result).to.be.equal(`chameleon-tool/node_modules/babel-loader/lib/index.js?{"filename":"chameleon-tool/package.json"}!chameleon-tool/node_modules/vue-loader/lib/selector.js?type=script&index=0!chameleon-tool/node_modules/chameleon-loader/index.js??ref--11-1!chameleon-tool/node_modules/replace-loader/index.js??ref--11-2!./node_modules/cml-ui/components/c-header/c-header.cml`)

  })
})


