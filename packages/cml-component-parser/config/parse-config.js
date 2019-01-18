module.exports = {
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
}
