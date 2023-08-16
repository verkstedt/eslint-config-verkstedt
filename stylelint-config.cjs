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
    {
      files: ['*.module.css', '*.module.scss'],
      rules: {
        // Use camelCase for class names in CSS modules -- for ease of
        // use after importing
        'selector-class-pattern': [
          '^([a-z][a-z0-9]*)([A-Z][a-z0-9]*)*$',
          {
            message: (selector) =>
              `Expected class selector "${selector}" to be camelCase`,
          },
        ],
        // Also for keyframes, for consistency
        'keyframes-name-pattern': [
          '^([a-z][a-z0-9]*)([A-Z][a-z0-9]*)*$',
          {
            message: (selector) =>
              `Expected keyframes name "${selector}" to be camelCase`,
          },
        ],
      },
    },
  ],
}
