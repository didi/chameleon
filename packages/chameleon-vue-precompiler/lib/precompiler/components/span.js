exports.processSpan = function (
    el,
    attrsMap,
    attrsList,
    attrs,
    staticClass
  ) {
    // const finalClass = staticClass + ' cml-bk cml-text'
    el.staticClass = `"${staticClass}"`
    attrs.push({
      name: `cml-type`,
      value: '"span"'
    })
    delete el.ns
    el.plain = false
  }