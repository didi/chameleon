// https://github.com/michael-ciniawsky/postcss-load-config

let result = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {}
  }
}
if(cml.config.get().cmss.enableAutoPrefix === true) {
  result.plugins.autoprefixer = cml.config.get().cmss.autoprefixOptions
}

module.exports = result;
