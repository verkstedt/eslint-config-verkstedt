const withNext = require('./lib/withNext')
const withPrettier = require('./lib/withPrettier')

const typescriptReact = require('./typescript-react')

module.exports = withPrettier(withNext(typescriptReact))
