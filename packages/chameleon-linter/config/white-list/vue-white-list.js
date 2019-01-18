/**
 * tags: Technically, it only holds tags that are not a html tag.
*/
module.exports = {
  // attrs: ['v-if','v-else','v-bind','v-cloak','v-for','v-html','v-model','v-on','v-once','v-pre','v-show','v-text'],
  attrs: ['v-if', 'v-else', 'v-else-if', 'v-for', 'v-on', 'v-bind', 'v-html', 'v-show', 'v-model', 'v-pre', 'v-once', 'slot-scope', 'is'],
  // tags: ['template','component','keep-alive','transition','transition-group']
  tags: ['template', 'view', 'text', 'block', 'scroller', 'list', 'cell', 'image', 'switch', 'video', 'input', 'button', 'radio', 'checkbox', 'page', 'router-view', 'slot']
}
