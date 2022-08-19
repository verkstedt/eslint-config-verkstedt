const typescriptReact = require('./typescript-react')

const withNext = require('./lib/withNext')
const withPrettier = require('./lib/withPrettier')

module.exports = withPrettier(withNext(typescriptReact))
