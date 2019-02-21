"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path2 = require("path");

var _helperModuleImports = require("@babel/helper-module-imports");

function camel2Dash(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, $1 => `-${$1.toLowerCase()}`);
}

function camel2Underline(_str) {
  const str = _str[0].toLowerCase() + _str.substr(1);

  return str.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`);
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

class Plugin {
  constructor(libraryName, libraryDirectory, style, camel2DashComponentName, camel2UnderlineComponentName, libraryFileName, customName, transformToDefaultImport, types, index = 0, defaulLibraryDirectory, defaulLibraryFileName) {
    this.libraryName = libraryName;
    this.defaulLibraryDirectory = defaulLibraryDirectory;
    this.libraryDirectory = typeof libraryDirectory === 'undefined' ? 'lib' : libraryDirectory;
    this.camel2DashComponentName = typeof camel2DashComponentName === 'undefined' ? true : camel2DashComponentName;
    this.camel2UnderlineComponentName = camel2UnderlineComponentName;
    this.style = style || false;
    this.libraryFileName = libraryFileName || '';
    this.defaulLibraryFileName = defaulLibraryFileName || '';
    this.customName = customName;
    this.transformToDefaultImport = typeof transformToDefaultImport === 'undefined' ? true : transformToDefaultImport;
    this.types = types;
    this.pluginStateKey = `importPluginState${index}`;
    this.libraryVariable = '';
  }

  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {}; // eslint-disable-line
    }

    return state[this.pluginStateKey];
  }

  isInGlobalScope(path, name, pluginState) {
    const parentPath = path.findParent(_path => _path.scope.hasOwnBinding(pluginState.specified[name]));
    return !!parentPath && parentPath.isProgram();
  }

  importMethod(methodName, file, pluginState) {
    if (!pluginState.selectedMethods[methodName]) {
      const libraryDirectory = this.libraryDirectory;
      const style = this.style;
      const transformedMethodName = methodName;
      const path = winPath(this.customName ? this.customName(transformedMethodName) : (0, _path2.join)(this.libraryName, libraryDirectory, transformedMethodName, this.libraryFileName) // eslint-disable-line
      );
      pluginState.selectedMethods[methodName] = this.transformToDefaultImport // eslint-disable-line
      ? (0, _helperModuleImports.addDefault)(file.path, path, {
        nameHint: methodName
      }) : (0, _helperModuleImports.addNamed)(file.path, methodName, path);

      if (style === true) {
        (0, _helperModuleImports.addSideEffect)(file.path, `${path}/style`);
      } else if (style === 'css') {
        (0, _helperModuleImports.addSideEffect)(file.path, `${path}/style/css`);
      } else if (typeof style === 'function') {
        const stylePath = style(path, file);

        if (stylePath) {
          (0, _helperModuleImports.addSideEffect)(file.path, stylePath);
        }
      }
    }

    return Object.assign({}, pluginState.selectedMethods[methodName]);
  }

  buildExpressionHandler(node, props, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const types = this.types;
    const pluginState = this.getPluginState(state);
    props.forEach(prop => {
      if (!types.isIdentifier(node[prop])) return;

      if (pluginState.specified[node[prop].name]) {
        node[prop] = this.importMethod(pluginState.specified[node[prop].name], file, pluginState); // eslint-disable-line
      }
    });
  }

  buildDeclaratorHandler(node, prop, path, state) {
    const file = path && path.hub && path.hub.file || state && state.file;
    const types = this.types;
    const pluginState = this.getPluginState(state);
    if (!types.isIdentifier(node[prop])) return;

    if (pluginState.specified[node[prop].name] && path.scope.hasBinding(node[prop].name) && path.scope.getBinding(node[prop].name).path.type === 'ImportSpecifier') {
      node[prop] = this.importMethod(node[prop].name, file, pluginState); // eslint-disable-line
    }
  }

  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.specified = Object.create(null);
    pluginState.libraryObjs = Object.create(null);
    pluginState.selectedMethods = Object.create(null);
    pluginState.pathsToRemove = [];
  }

  ProgramExit(path, state) {
    this.getPluginState(state).pathsToRemove.forEach(p => !p.removed && p.remove());
  }

  Identifier(path, state) {
    const node = path.node;
    const pluginState = this.getPluginState(state);
    //如果使用了libraryVariable，则增加import libraryVariable from libraryName
    if(node.name === this.libraryVariable && (path.parent.type !== 'ImportDefaultSpecifier') && pluginState.libraryObjs[this.libraryVariable]) {
      const libraryName = _path2.join(this.libraryName, this.defaulLibraryDirectory, this.defaulLibraryFileName)
      _helperModuleImports.addDefault(path.hub.file.path, libraryName, {
        nameHint: this.libraryVariable
      })
      node.name = `_${node.name}`;
    }
    
  }

  ImportDeclaration(path, state) {
    const node = path.node; // path maybe removed by prev instances.

    if (!node) return;
    const value = node.source.value;
    const libraryName = this.libraryName;
    const types = this.types;
    const pluginState = this.getPluginState(state);

    if (value === libraryName) {
      node.specifiers.forEach(spec => {
        if (types.isImportSpecifier(spec)) {
          pluginState.specified[spec.local.name] = spec.imported.name;
        } else {
          pluginState.libraryObjs[spec.local.name] = true;
          this.libraryVariable = spec.local.name;
        }
      });
      pluginState.pathsToRemove.push(path);
    }
  }

  CallExpression(path, state) {
    const node = path.node;
    const file = path && path.hub && path.hub.file || state && state.file;
    const name = node.callee.name;
    const types = this.types;
    const pluginState = this.getPluginState(state);

    if (types.isIdentifier(node.callee)) {
      if (pluginState.specified[name]) {
        node.callee = this.importMethod(pluginState.specified[name], file, pluginState);
      }
    }

    node.arguments = node.arguments.map(arg => {
      const argName = arg.name;

      if (pluginState.specified[argName] && path.scope.hasBinding(argName) && path.scope.getBinding(argName).path.type === 'ImportSpecifier') {
        return this.importMethod(pluginState.specified[argName], file, pluginState);
      }

      return arg;
    });
  }

  MemberExpression(path, state) {
    const node = path.node;
    const file = path && path.hub && path.hub.file || state && state.file;
    const pluginState = this.getPluginState(state); // multiple instance check.

    if (!node.object || !node.object.name) return;

    if (pluginState.libraryObjs[node.object.name]) {
      // antd.Button -> _Button
      if (node.property.type === 'Identifier') {
        //antd.Button
        path.replaceWith(this.importMethod(node.property.name, file, pluginState));
      } else if (node.property.type === 'Literal') {
        //antd['Button']
        path.replaceWith(this.importMethod(node.property.value, file, pluginState));
      }
    } else if (pluginState.specified[node.object.name]) {
      node.object = this.importMethod(pluginState.specified[node.object.name], file, pluginState);
    }
  }

  Property(path, state) {
    const node = path.node;
    this.buildDeclaratorHandler(node, 'value', path, state);
  }

  VariableDeclarator(path, state) {
    const node = path.node;
    this.buildDeclaratorHandler(node, 'init', path, state);
  }

  ArrayExpression(path, state) {
    const node = path.node;
    const props = node.elements.map((_, index) => index);
    this.buildExpressionHandler(node.elements, props, path, state);
  }

  LogicalExpression(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['left', 'right'], path, state);
  }

  ConditionalExpression(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['test', 'consequent', 'alternate'], path, state);
  }

  IfStatement(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['test'], path, state);
    this.buildExpressionHandler(node.test, ['left', 'right'], path, state);
  }

  ExpressionStatement(path, state) {
    const node = path.node;
    const types = this.types;

    if (types.isAssignmentExpression(node.expression)) {
      this.buildExpressionHandler(node.expression, ['right'], path, state);
    }
  }

  ReturnStatement(path, state) {
    const types = this.types;
    const file = path && path.hub && path.hub.file || state && state.file;
    const node = path.node;
    const pluginState = this.getPluginState(state);

    if (node.argument && types.isIdentifier(node.argument) && pluginState.specified[node.argument.name] && this.isInGlobalScope(path, node.argument.name, pluginState)) {
      node.argument = this.importMethod(node.argument.name, file, pluginState);
    }
  }

  ExportDefaultDeclaration(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['declaration'], path, state);
  }

  BinaryExpression(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['left', 'right'], path, state);
  }

  NewExpression(path, state) {
    const node = path.node;
    this.buildExpressionHandler(node, ['callee', 'arguments'], path, state);
  }

}

exports.default = Plugin;