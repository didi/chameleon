//git commit -m"feat: 新增功能"
//规范团队commit规范，参考commitlint-angular https://www.npmjs.com/package/@commitlint/config-angular
module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'type-enum': [2, 'always', [
      "feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"
    ]],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  }
};

//[build, ci, docs, feat, fix, perf, refactor, revert, style, test]



