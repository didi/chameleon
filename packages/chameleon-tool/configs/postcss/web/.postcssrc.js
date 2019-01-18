// https://github.com/michael-ciniawsky/postcss-load-config
let defaultConfig = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "postcss-plugin-weex":{},
    "autoprefixer": cml.config.get().cmss.autoprefixOptions
  }
}

module.exports = defaultConfig;


