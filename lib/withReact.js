module.exports = (base) => ({
  ...base,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    ...base.extends.filter((ext) => ext !== 'airbnb-base'),
  ],
  rules: {
    ...base.rules,
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/media-has-caption': 'off',
    'react/destructuring-assignment': 'warn',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/prefer-stateless-function': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-variables',
          'instance-variables',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render',
        ],
      },
    ],
    'react/style-prop-object': 'off',
  },
  overrides: [
    ...base.overrides,
    // Alow props spreading in Storybook files to allow Template with args pattern there
    // See https://storybook.js.org/docs/react/writing-stories/introduction#using-args
    {
      files: ['*.stories.*'],
      rules: { 'react/jsx-props-no-spreading': 'off' },
    },
  ],
})