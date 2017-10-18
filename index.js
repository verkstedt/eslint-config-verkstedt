module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true
  },
  'rules': {
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
