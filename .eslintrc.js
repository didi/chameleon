module.exports = {
    root:true,//
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'plugin:vue/base',
      'standard',//由于团队实现eslint规范初期可能需要修改的地方比较多
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
      ecmaVersion: 2018,
      parser:'babel-eslint'
    },
    rules: {
      'vue/comment-directive': 'off',
      'vue/jsx-uses-vars': 'off',
      'semi':[2,'always']
    }
  }
