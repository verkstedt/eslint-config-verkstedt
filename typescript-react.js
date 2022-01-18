const withTypescript = require('./lib/withTypescript')
const react = require('./react')

const config = withTypescript(react)

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // In typescript we don’t use prop types and default props, but
    // instead rely on props’s interfaces and function default values
    'react/require-default-props': 'off',
  },
}
