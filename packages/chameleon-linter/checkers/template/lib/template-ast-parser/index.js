const astTreeTraversal = require('./lib/ast-tree-traversal');
const suspiciousNodeDispatcher = require('./lib/suspicious-node-dispatcher');
const customizedNodeDispatcher = require('./lib/customized-node-dispatcher');
const options = require('./options');

/**
 * Get all possible properties' value that may be a variable or a method name.
 * @param {Object} templateAst
 * @param {Object} usingComponents An array contains customized components' names
 * @returns {Object} {vars: [], methods: [], customizedComponents: {comp: {props: [], events: []}}}
 */
function getParseResults(templateAst, {usingComponents = [], platform = 'cml'}) {
  let rootTag = templateAst[0];
  let templateLang = 'cml';

  if (rootTag.attribs.lang && ~options.getOption('langs').indexOf(rootTag.attribs.lang.value = rootTag.attribs.lang.value.trim())) {
    templateLang = rootTag.attribs.lang.value;
  }

  // ast tree traversal to get attribute nodes, textNodes and customized components.
  let {components: customizedComponents, nodes} = astTreeTraversal.travel({
    root: rootTag,
    lang: templateLang,
    platform,
    usingComponents
  });

  let varandMethods = suspiciousNodeDispatcher.getResults(nodes);
  let propandEvents = customizedNodeDispatcher.getResults(customizedComponents);

  return {
    vars: varandMethods.filter((node) => node.variable),
    methods: varandMethods.filter((node) => node.method),
    customizedComponents: propandEvents
  };
}

module.exports = {
  getParseResults
}
