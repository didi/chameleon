/**
 * tags: Technically, it only holds tags that are not a html tag.
 * attrs: Attributes that only existing in mini-app can be listed here.
*/
module.exports = {
  attrs: ['wx:if', 'wx:elif', 'wx:else', 'wx:for', 'wx:for-item', 'wx:for-index', 'wx:key', 'bindtap', 'catchtap'],
  tags: [
    'template',
    'view',
    'block',
    'scroll-view',
    'swiper',
    'movable-view',
    'movable-area',
    'cover-view',
    'cover-image',
    'icon',
    'text',
    'rich-text',
    'progress',
    'lable',
    'input',
    'form',
    'checkbox',
    'picker',
    'picker-view',
    'radio',
    'switch',
    'slider',
    'textarea',
    'navigator',
    'functional-page-navigator',
    'camera',
    'live-player',
    'live-pusher',
    'map',
    'open-data',
    'web-view',
    'ad',
    'official-account',
    'slot'
  ]
}
