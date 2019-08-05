module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true
  },
  'rules': {
		'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'complexity': ['error', { 'max': 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': [ 'error', { 'components': [ 'LinkWithIcon', 'ProductLink' ], 'aspects': [ 'noHref', 'invalidHref', 'preferButton' ] } ],
    'jsx-a11y/media-has-caption': 0,
    'no-debugger': 1,
    'no-extra-semi': 'error',
    'no-restricted-imports': [ 2, { 'patterns': [ '../*' ] } ],
    'no-restricted-modules': [ 2, { 'patterns': [ '../*' ] } ],
    'quote-props': ['error', 'consistent-as-needed'],
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'react/prefer-stateless-function': 0,
    'react/sort-comp': [ 2, { 'order': [ 'static-methods', 'instance-variables', 'lifecycle', 'everything-else', 'render' ] } ],
    'react/style-prop-object': 0,
    'semi': ['error', 'never']
  }
}
