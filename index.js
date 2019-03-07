module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true
  },
  'rules': {
    'complexity': ['error', { 'max': 10 }],
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        'components': [
          'LinkWithIcon',
          'ProductLink'
        ],
        'aspects': [
          'noHref',
          'invalidHref',
          'preferButton'
        ]
      }
    ],
    'jsx-a11y/media-has-caption': 0,
    'no-debugger': 1,
    'react/prefer-stateless-function': 0,
    'react/sort-comp': [
      2,
      {
        'order': [
          'static-methods',
          'instance-variables',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }
    ],
    'react/style-prop-object': 0,
    'no-restricted-imports': [
      2,
      {
        'patterns': [
          '../*'
        ]
      }
    ],
    'no-restricted-modules': [
      2,
      {
        'patterns': [
          '../*'
        ]
      }
    ],

    'comma-dangle': ['error', 'never'],
    'function-paren-newline': 'off',
    'no-extra-semi': 'error',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'semi': ['error', 'never'],
		'arrow-parens': ['error', 'as-needed'],
    'quote-props': ['error', 'consistent-as-needed']
  }
}
