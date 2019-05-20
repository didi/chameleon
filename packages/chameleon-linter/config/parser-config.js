module.exports = {
  script: {
    sourceType: 'module',
    allowImportExportEverywhere: true, // consistent with espree
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    ranges: true,
    tokens: true,
    plugins: [
      'flow',
      'asyncGenerators',
      'bigInt',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'throwExpressions'
    ]
  },
  style: {
    rules: {
      'block-no-empty': null,
      'selector-max-compound-selectors': 1,
      'selector-type-no-unknown': [true, {
        'ignore': ['custom-elements'],
        'ignoreTypes': ['page']
      }]
    }
  }
};
