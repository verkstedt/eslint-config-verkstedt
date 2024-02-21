module.exports = {
  extends: 'stylelint-config-standard',
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'media-feature-range-notation': null,
    // Remove once StyleLint learns about @container
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['container'],
      },
    ],
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
        // “This rule is only appropriate for CSS. You should not turn
        //  it on for CSS-like languages, such as Sass or Less, as they
        //  have their own syntaxes.”
        // — https://stylelint.io/user-guide/rules/media-query-no-invalid/
        'media-query-no-invalid': null,
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
