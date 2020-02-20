module.exports = {
    root:true,
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'standard',
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
      'semi':[2,'always']
    }
  }
