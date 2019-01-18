exports.processDiv = function (
  el,
  attrsMap,
  attrsList,
  attrs,
  staticClass
) {
  // const finalClass = staticClass + ' cml-flx cml-view'
  el.staticClass = `"${staticClass}"`
  attrs.push({
    name: `cml-type`,
    value: '"div"'
  })
  el.plain = false
}
