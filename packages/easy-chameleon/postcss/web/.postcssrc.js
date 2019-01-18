// https://github.com/michael-ciniawsky/postcss-load-config
module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "postcss-plugin-weex":{},
    "autoprefixer": {
        browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
    }
  }
}