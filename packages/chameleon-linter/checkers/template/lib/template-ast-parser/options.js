const _options = {
  langs: ['cml', 'vue'],
  cmlSystemVarNames: ['$event', 'Math', 'Date'],
  vueSystemVarNames: ['$event', 'Math', 'Date']
}

module.exports.getOption = function(optName) {
  return _options[optName];
}

module.exports.getAllOptions = function() {
  return {..._options};
}
