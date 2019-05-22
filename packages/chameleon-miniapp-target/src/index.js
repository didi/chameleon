const JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
const NodeSourcePlugin = require("webpack/lib/node/NodeSourcePlugin");
const FunctionModulePlugin = require("webpack/lib/FunctionModulePlugin");
const LoaderTargetPlugin = require("webpack/lib/LoaderTargetPlugin");


module.exports = function (compiler) {
  const { options } = compiler
  // compiler.apply(
  //   new JsonpTemplatePlugin(options.output),
  //   new FunctionModulePlugin(options.output),
  //   new NodeSourcePlugin(options.node),
  //   new LoaderTargetPlugin(options.target)
  // );

  new JsonpTemplatePlugin().apply(compiler);
  new FunctionModulePlugin().apply(compiler);
  new NodeSourcePlugin(options.node).apply(compiler);
  new LoaderTargetPlugin(options.target).apply(compiler);
};
