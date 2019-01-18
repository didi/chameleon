/**
 * A class reprents a customized component.
 */
class CustomizedNode {
  constructor(tag, lang = 'cml') {
    this.lang = lang;
    this.name = tag.name;
    this.attribs = {...tag.attribs};
  }

  get attrs() {
    let attrs = this.attribs;
    return Object.keys(attrs).map((attrName) => {
      return {
        name: attrName,
        namePos: attrs[attrName].nameLineCol,
        value: attrs[attrName].value,
        valuePos: attrs[attrName].valueLineCol
      };
    });
  }
}

module.exports = CustomizedNode;
