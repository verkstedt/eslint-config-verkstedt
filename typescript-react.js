const withTypescript = require('./lib/withTypescript')
const withReact = require('./lib/withReact')
const base = require('./base')

const config = withTypescript(withReact(base))

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    // In typescript we don’t use prop types and default props, but
    // instead rely on props’s interfaces and function default values
    'react/require-default-props': 'off'
  }
}
