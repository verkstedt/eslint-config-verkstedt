const withPrettier = require('./lib/withPrettier')

const config = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    jest: true
  },
  plugins: [],
  rules: {
    'comma-dangle': ['error', 'never'],
    'complexity': ['error', { max: 10 }],
    'function-paren-newline': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'max-params': ['warn', 2],
    'no-debugger': 'warn',
    'no-else-return': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*'],
            message:
              'Use absolute paths for importing files from parent directories.'
          }
        ]
      }
    ],
    'no-restricted-modules': [
      'error',
      {
        // Seems it’s impossible to set up a message for a pattern
        patterns: ['../*']
      }
    ],
    'semi': ['error', 'never']
  }
}

module.exports = withPrettier(config)
