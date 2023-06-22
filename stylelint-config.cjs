module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'media-feature-range-notation': null,
  },
  overrides: [
    {
      files: '*.scss',
      customSyntax: 'postcss-scss',
      rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'function-no-unknown': null,
        'scss/function-no-unknown': true,
      },
    },
  ],
}
