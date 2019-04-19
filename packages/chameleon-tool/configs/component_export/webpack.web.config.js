
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.interface']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(\.min\.js)/,
        include: [path.resolve(__dirname, '../node_modules')]
      },
      {
        test: /\.interface$/,
        include: [path.resolve(__dirname, '../node_modules')],
        use: [{
          loader: 'babel-loader'
        },
        {
          loader: 'interface-loader',
          options: {
            cmlType: 'web'
          }
        }]
      }
    ]
  }
}
