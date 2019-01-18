/**
 * A class reprents nodes that are waiting for passing to getting variable rules.
 */
class SuspiciousNode {

  constructor({name = '', rawValue = '', valuePos = [], lang = 'cml', scope = [], isTextNode = false}) {
    this.name = name;
    this.rawValue = rawValue;
    this.valuePos = valuePos;
    this.lang = lang;

    /**
     * loopScopes property is holding the for loop varibables. For example for v-for
     * directive in vue.js, say v-for='(item , index) in array', then we will append an
     * array with value:
     * [item, index]
     * into loopScopes property.
     */
    this.loopScopes = scope;
    this.isTextNode = isTextNode;
    this.isAttr = !this.isTextNode;
  }
}

module.exports = SuspiciousNode;
