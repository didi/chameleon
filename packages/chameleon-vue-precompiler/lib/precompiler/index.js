const { transformTag } = require('./node/tag')
const components = require('./components')
const hooks = require('./hooks')
const conf = require('./config')

class Precompiler {
    /**
     * usrConf:
     *  - preservedTags: the preserved cml components tag list. The default
     *    value is: ['a','container','div','image','img','text','input',
     *    'switch','list','scroller','waterfall','slider','indicator',
     *    'loading-indicator','loading','refresh','textarea','video','web'].
     *    If you have other components as plugins installed in cml, you
     *    should add them to this lists, add pass the whole list to this.
     *  - autoprefixer: options for autoprefixer. default is { browsers:
     *    ['> 0.1%', 'ios >= 8', 'not ie < 12'] }.
     *  - px2rem: options for postcss-plugin-px2rem. default is: { rootValue: 75 }
     * @param {*} options
     */
    constructor (usrConf) {
      conf.merge(usrConf)
      this.config = conf.get()
    }
  
    compile (el) {
      const attrsMap = el.attrsMap ? el.attrsMap : (el.attrsMap = {})
      const attrsList = el.attrsList ? el.attrsList : (el.attrsList = [])
      const attrs = el.attrs ? el.attrs : (el.attrs = [])
      const staticClass = (el.staticClass || '').replace(/"/g, '')
      const args = [el, attrsMap, attrsList, attrs, staticClass]
      
      const tag = transformTag(el)
  
      const {
        cmlBuiltInComponents,
        cmlRegisteredComponents,
        cmlComponents
      } = this.config

      if (cmlBuiltInComponents.indexOf(el._origTag || el.tag) > -1) {
        el._cmlBuiltIn = true
      }
      else if (
        cmlRegisteredComponents.indexOf(el.tag) > -1
        || cmlComponents.indexOf(el.tag) > -1
      ) {
        el._cmlRegistered = true
      }
      else {
        el._userRegistered = true
      }
  
      // use component processors to process components' special attrs.
      // const processor = components[tag]
      // if (processor) {
      //   processor.apply(this, args)
      // }
  
      // process hooks.
      for (const k in hooks) {
        hooks[k].apply(this, args)
      }
    }
  }

  module.exports = Precompiler