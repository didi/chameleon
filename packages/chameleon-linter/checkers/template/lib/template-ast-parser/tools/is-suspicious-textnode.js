const suspiciousRegexes = {
  cml: /{{(.*?)}}/g,
  vue: /{{(.*?)}}/g,
  wx: /{{(.*?)}}/g
};

module.exports.isSuspiciousTextnode = function({lang = 'cml', text = ''}) {
  return suspiciousRegexes[lang].test(text);
}
