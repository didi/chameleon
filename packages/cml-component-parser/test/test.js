const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const Parser = require('../index');

describe('component check', function() {
  it('should pass static flatEntrance', function() {
    const mainEntrance = path.resolve(__dirname, './docs/built-in-components');
    let results = Parser.flatEntrance(mainEntrance);

    expect(results).to.be.deep.equal([
      'docs/built-in-components/input/input.interface',
      'docs/built-in-components/layout/aside/aside.cml',
      'docs/built-in-components/layout/col/col.cml',
      'docs/built-in-components/layout/container/container.cml',
      'docs/built-in-components/layout/foot/foot.cml'
    ].map((fileName) => {
      return path.resolve(__dirname, fileName);
    }));
  });
  describe('should pass interface file parser', function() {
    let parser = new Parser();
    it('should fail isResultsEmpty', function() {
      expect(parser.isResultsEmpty()).to.be.true;
    });
    it('should pass getParseResults check', function() {
      parser.resetPath(path.resolve(__dirname, './docs/index.interface'));
      let results = parser.getParseResults();
      expect(results).to.have.deep.property('vars', ['cstyle', 'bottomOffset', 'scrollDirection']);
      expect(results).to.have.deep.property('methods', ['customscroll', 'scrolltobottom']);
      expect(results).to.have.deep.property('props', [{
        name: 'cstyle', valueType: 'String', props: [], typeChain: []
      }, {
        name: 'bottomOffset', valueType: 'Number', props: [], typeChain: []
      }, {
        name: 'scrollDirection', valueType: 'String', props: [], typeChain: []
      }]);
    });
    it('should pass isResultsEmpty', function() {
      expect(parser.isResultsEmpty()).to.be.false;
    });
    it('should pass getReadmeContent', function() {
      let readme = parser.getReadmeContent();
      expect(readme).to.be.equal('# index \n---\n\n|属性名|类型|说明|\n| ------ | ------ | ------ |\n|cstyle|String| |\n|bottomOffset|Number| |\n|scrollDirection|String| |\n|c-bind:customscroll|EventHandle|事件返回参数 eventDetail [类型: scrollEventDetail] <br/> 其中 scrollEventDetail 的定义为 <br/>&emsp;{deltaX: Number , deltaY: Number , scrollHeight: Number , scrollLeft: Number , scrollTop: Number , scrollWidth: Number}<br/>|\n|c-bind:scrolltobottom|EventHandle|事件返回参数 eventDetail [类型: scrolltobottomEventDetail] <br/> 其中 scrolltobottomEventDetail 的定义为 <br/>&emsp;{direction: String}<br/>|');
    });
    it('should pass getJsonContent', function() {
      let json = parser.getJsonContent();
      expect(json).to.equal('{\n\t"vars": [\n\t\t"cstyle",\n\t\t"bottomOffset",\n\t\t"scrollDirection"\n\t],\n\t"methods": [\n\t\t"customscroll",\n\t\t"scrolltobottom"\n\t],\n\t"props": [\n\t\t{\n\t\t\t"name": "cstyle",\n\t\t\t"valueType": "String",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t},\n\t\t{\n\t\t\t"name": "bottomOffset",\n\t\t\t"valueType": "Number",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t},\n\t\t{\n\t\t\t"name": "scrollDirection",\n\t\t\t"valueType": "String",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t}\n\t],\n\t"events": [\n\t\t{\n\t\t\t"name": "customscroll",\n\t\t\t"paramsNum": 1,\n\t\t\t"params": [\n\t\t\t\t{\n\t\t\t\t\t"typeName": "scrollEventDetail",\n\t\t\t\t\t"flowType": "ObjectTypeAnnotation",\n\t\t\t\t\t"props": [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "deltaX",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "deltaY",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollHeight",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollLeft",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollTop",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollWidth",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t"varName": "eventDetail",\n\t\t\t\t\t"typeChain": []\n\t\t\t\t}\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t"name": "scrolltobottom",\n\t\t\t"paramsNum": 1,\n\t\t\t"params": [\n\t\t\t\t{\n\t\t\t\t\t"typeName": "scrolltobottomEventDetail",\n\t\t\t\t\t"flowType": "ObjectTypeAnnotation",\n\t\t\t\t\t"props": [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "direction",\n\t\t\t\t\t\t\t"valueType": "String"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t"varName": "eventDetail",\n\t\t\t\t\t"typeChain": []\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t]\n}');
    });
    it('should pass writeReadmeFileToDir', function(done) {
      parser.writeReadmeFileToDir(__dirname, 'interface')
        .then((res) => {
          expect(res).to.equal('success');
          expect(fs.readFileSync(path.resolve(__dirname, 'interface.md'), 'utf8')).to.equal('# index \n---\n\n|属性名|类型|说明|\n| ------ | ------ | ------ |\n|cstyle|String| |\n|bottomOffset|Number| |\n|scrollDirection|String| |\n|c-bind:customscroll|EventHandle|事件返回参数 eventDetail [类型: scrollEventDetail] <br/> 其中 scrollEventDetail 的定义为 <br/>&emsp;{deltaX: Number , deltaY: Number , scrollHeight: Number , scrollLeft: Number , scrollTop: Number , scrollWidth: Number}<br/>|\n|c-bind:scrolltobottom|EventHandle|事件返回参数 eventDetail [类型: scrolltobottomEventDetail] <br/> 其中 scrolltobottomEventDetail 的定义为 <br/>&emsp;{direction: String}<br/>|');
          done();
        })
        .catch(err => {
          done(err);
        })
        .then((res) => {
          fs.unlinkSync(path.resolve(__dirname, 'interface.md'));
        });
    });
    it('should pass writeJsonFileToDir', function(done) {
      parser.writeJsonFileToDir(__dirname, 'interface')
        .then((res) => {
          expect(res).to.be.equal('success');
          expect(fs.readFileSync(path.resolve(__dirname, 'interface.json'), 'utf8')).to.equal('{\n\t"vars": [\n\t\t"cstyle",\n\t\t"bottomOffset",\n\t\t"scrollDirection"\n\t],\n\t"methods": [\n\t\t"customscroll",\n\t\t"scrolltobottom"\n\t],\n\t"props": [\n\t\t{\n\t\t\t"name": "cstyle",\n\t\t\t"valueType": "String",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t},\n\t\t{\n\t\t\t"name": "bottomOffset",\n\t\t\t"valueType": "Number",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t},\n\t\t{\n\t\t\t"name": "scrollDirection",\n\t\t\t"valueType": "String",\n\t\t\t"props": [],\n\t\t\t"typeChain": []\n\t\t}\n\t],\n\t"events": [\n\t\t{\n\t\t\t"name": "customscroll",\n\t\t\t"paramsNum": 1,\n\t\t\t"params": [\n\t\t\t\t{\n\t\t\t\t\t"typeName": "scrollEventDetail",\n\t\t\t\t\t"flowType": "ObjectTypeAnnotation",\n\t\t\t\t\t"props": [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "deltaX",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "deltaY",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollHeight",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollLeft",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollTop",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "scrollWidth",\n\t\t\t\t\t\t\t"valueType": "Number"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t"varName": "eventDetail",\n\t\t\t\t\t"typeChain": []\n\t\t\t\t}\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t"name": "scrolltobottom",\n\t\t\t"paramsNum": 1,\n\t\t\t"params": [\n\t\t\t\t{\n\t\t\t\t\t"typeName": "scrolltobottomEventDetail",\n\t\t\t\t\t"flowType": "ObjectTypeAnnotation",\n\t\t\t\t\t"props": [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\t"name": "direction",\n\t\t\t\t\t\t\t"valueType": "String"\n\t\t\t\t\t\t}\n\t\t\t\t\t],\n\t\t\t\t\t"varName": "eventDetail",\n\t\t\t\t\t"typeChain": []\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t]\n}');
          done();
        })
        .catch(err => {
          done(err);
        })
        .then((res) => {
          fs.unlinkSync(path.resolve(__dirname, 'interface.json'));
        });
    });
  });

  describe('should pass single cml file parser', function() {
    let parser = new Parser(path.resolve(__dirname, './docs/export-default.cml'));
    it('should pass getParseResults check', function() {
      let results = parser.getParseResults();
      expect(results).to.have.deep.property('vars', ['propOne', 'propTwo', 'dataOne', 'dataTwo', 'computedOne', 'computedShow', 'getterHide'], 'failed at checking vars');
      expect(results).to.have.deep.property('methods', ['onTap'], 'failed on checking methods');
      expect(results).to.have.deep.property('props', [{
        name: 'propOne', valueType: 'Object', default: ''
      }, {
        name: 'propTwo', valueType: 'Boolean', default: true
      }], 'failed at checking props');
      expect(results).to.have.deep.property('events', [{
        name: 'eventOne', paramsNum: -1, params: []
      }]);
    });
  });
});
