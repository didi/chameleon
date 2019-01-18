
process.argv = ['node', 'chameleon.js'];
require('../../lib/index.js');
var getWebpackConfig = require('../../configs/index.js');
var expect = require('chai').expect;
const path = require('path');


describe('configs index.js', function () {
  it('wx dev', function () {
    cml.projectRoot = path.join(__dirname, '../../node_modules/chameleon-templates/project');
    cml.media = 'dev';
    var {getOptions} = require('../../commanders/utils.js');
    let options = getOptions('dev', 'wx');
    getWebpackConfig(options).then(config=>{
    })
  })
})
